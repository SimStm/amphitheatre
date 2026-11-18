import {
  IconDeviceDesktop,
  IconEye,
  IconHeadphones,
  IconMicrophone,
  IconPhotoVideo,
  IconVideo,
} from "@tabler/icons-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import type { MediaDeviceKindName } from "../../hooks/use-livekit.ts";
import { readDevicePrefs, writeDevicePrefs } from "../../lib/device-prefs.ts";
import { classifyGetUserMediaError, mediaFailureToastKey } from "../../lib/media-permissions.ts";
import {
  qualityLevels,
  readMediaQuality,
  receiveQualities,
  screenContents,
  writeMediaQuality,
  type MediaQualityKey,
  type MediaQualityPrefs,
} from "../../lib/media-quality.ts";
import { Field } from "../ui/field.tsx";
import { Select } from "../ui/select.tsx";

type DeviceLists = {
  audioinput: MediaDeviceInfo[];
  audiooutput: MediaDeviceInfo[];
  videoinput: MediaDeviceInfo[];
};

type MediaSettingsPanelProps = {
  active?: boolean;
  listDevices: () => Promise<DeviceLists>;
  switchDevice: (kind: MediaDeviceKindName, deviceId: string) => Promise<void>;
  setOutputVolume: (volume: number) => void;
  setInputVolume: (volume: number) => void;
  micEnabled?: boolean;
  micLocked?: boolean;
  setMic?: (enabled: boolean) => Promise<void>;
  applyMediaQuality?: (key: MediaQualityKey) => Promise<void>;
};

function QualitySelect<K extends MediaQualityKey>({
  id,
  label,
  icon,
  value,
  options,
  optionLabel,
  onChange,
}: {
  id: string;
  label: string;
  icon: ReactNode;
  value: MediaQualityPrefs[K];
  options: readonly MediaQualityPrefs[K][];
  optionLabel: (value: MediaQualityPrefs[K]) => string;
  onChange: (value: MediaQualityPrefs[K]) => void;
}) {
  return (
    <Field id={id} label={label}>
      <Select
        id={id}
        leading={icon}
        value={value}
        onChange={(event) => onChange(event.target.value as MediaQualityPrefs[K])}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {optionLabel(option)}
          </option>
        ))}
      </Select>
    </Field>
  );
}

function DeviceSelect({
  id,
  label,
  icon,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  icon: ReactNode;
  value: string;
  options: MediaDeviceInfo[];
  onChange: (value: string) => void;
}) {
  return (
    <Field id={id} label={label}>
      <Select id={id} leading={icon} value={value} onChange={(event) => onChange(event.target.value)}>
        {options.length === 0 ? <option value="">{label}</option> : null}
        {options.map((device) => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label || device.deviceId}
          </option>
        ))}
      </Select>
    </Field>
  );
}

function VolumeSlider({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <Field id={id} label={label}>
      <input
        id={id}
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-11 w-full accent-[var(--accent)]"
      />
    </Field>
  );
}

function MicMeter({ level, active, label }: { level: number; active: boolean; label: string }) {
  const pct = Math.round(Math.min(1, Math.max(0, level)) * 100);
  return (
    <div className="flex min-w-0 w-full flex-1 flex-col gap-1.5">
      <div
        className="h-3 w-full overflow-hidden rounded-full border border-border bg-surface-page"
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={active ? pct : 0}
      >
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-75"
          style={{ width: `${active ? pct : 0}%` }}
        />
      </div>
    </div>
  );
}

function rmsLevel(data: Uint8Array): number {
  let sum = 0;
  for (const value of data) {
    const n = (value - 128) / 128;
    sum += n * n;
  }
  return Math.min(1, Math.sqrt(sum / data.length) * 3.25);
}

export function MediaSettingsPanel({
  active = true,
  listDevices,
  switchDevice,
  setOutputVolume,
  setInputVolume,
  micEnabled = false,
  micLocked = false,
  setMic,
  applyMediaQuality,
}: MediaSettingsPanelProps) {
  const { t } = useTranslation();
  const [devices, setDevices] = useState<DeviceLists>({
    audioinput: [],
    audiooutput: [],
    videoinput: [],
  });
  const [prefs, setPrefs] = useState(readDevicePrefs);
  const [quality, setQuality] = useState(readMediaQuality);
  const [level, setLevel] = useState(0);
  const [testing, setTesting] = useState(false);
  const [previewOn, setPreviewOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewRef = useRef<MediaStream | null>(null);
  const meterRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const playbackRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef(0);
  const restoreMicRef = useRef(false);
  const setMicRef = useRef(setMic);
  setMicRef.current = setMic;

  const stopPreview = () => {
    previewRef.current?.getTracks().forEach((track) => track.stop());
    previewRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setPreviewOn(false);
  };

  useEffect(() => {
    if (!active) return;
    void listDevices()
      .then(setDevices)
      .catch((err: unknown) => toast.error(t(mediaFailureToastKey(classifyGetUserMediaError(err)))));
  }, [active, listDevices, t]);

  useEffect(() => {
    if (!active) stopPreview();
    return () => {
      previewRef.current?.getTracks().forEach((track) => track.stop());
      previewRef.current = null;
    };
  }, [active]);

  const startPreview = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: prefs.videoinput ? { deviceId: { exact: prefs.videoinput } } : true,
      });
      previewRef.current?.getTracks().forEach((track) => track.stop());
      previewRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => undefined);
      }
      setPreviewOn(true);
    } catch (err) {
      toast.error(t(mediaFailureToastKey(classifyGetUserMediaError(err))));
    }
  };

  const stopMicTest = async (restore: boolean) => {
    window.cancelAnimationFrame(rafRef.current);
    const playback = playbackRef.current;
    if (playback) {
      playback.pause();
      playback.srcObject = null;
      playbackRef.current = null;
    }
    const ctx = meterRef.current;
    meterRef.current = null;
    gainRef.current = null;
    if (ctx) void ctx.close();
    setLevel(0);
    setTesting(false);
    if (restore && restoreMicRef.current) {
      restoreMicRef.current = false;
      await setMicRef.current?.(true);
    } else {
      restoreMicRef.current = false;
    }
  };

  useEffect(() => {
    return () => {
      void stopMicTest(true);
    };
    // Unmount / leave devices tab must always restore the room mic.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!active) void stopMicTest(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  useEffect(() => {
    if (gainRef.current) gainRef.current.gain.value = prefs.inputVolume;
    if (playbackRef.current) playbackRef.current.volume = prefs.inputVolume;
  }, [prefs.inputVolume]);

  const persist = (next: typeof prefs) => {
    setPrefs(next);
    writeDevicePrefs(next);
  };

  const onDevice = async (kind: MediaDeviceKindName, deviceId: string) => {
    persist({ ...prefs, [kind]: deviceId });
    try {
      await switchDevice(kind, deviceId);
    } catch (err) {
      toast.error(t(mediaFailureToastKey(classifyGetUserMediaError(err))));
    }
  };

  const onOutputVolume = (value: number) => {
    persist({ ...prefs, outputVolume: value });
    setOutputVolume(value);
  };

  const onInputVolume = (value: number) => {
    persist({ ...prefs, inputVolume: value });
    setInputVolume(value);
  };

  const onQuality = <K extends MediaQualityKey>(key: K, value: MediaQualityPrefs[K]) => {
    const next = { ...quality, [key]: value };
    setQuality(next);
    writeMediaQuality(next);
    void applyMediaQuality?.(key).catch((err: unknown) => {
      toast.error(t(mediaFailureToastKey(classifyGetUserMediaError(err))));
    });
  };

  const testMic = async () => {
    if (testing) {
      await stopMicTest(true);
      return;
    }
    let track = previewRef.current?.getAudioTracks().find((item) => item.readyState === "live");
    if (!track) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: prefs.audioinput ? { deviceId: { exact: prefs.audioinput } } : true,
        });
        const next = stream.getAudioTracks()[0];
        if (!next) {
          stream.getTracks().forEach((item) => item.stop());
          toast.error(t("toast.mediaNotFound"));
          return;
        }
        track = next;
        const preview = previewRef.current;
        if (preview) {
          for (const extra of stream.getAudioTracks()) preview.addTrack(extra);
        } else {
          previewRef.current = stream;
        }
      } catch (err) {
        toast.error(t(mediaFailureToastKey(classifyGetUserMediaError(err))));
        return;
      }
    }

    restoreMicRef.current = Boolean(micEnabled && !micLocked && setMicRef.current);
    if (restoreMicRef.current) {
      try {
        await setMicRef.current?.(false);
      } catch {
        restoreMicRef.current = false;
      }
    }

    const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) {
      toast.error(t("toast.mediaUnsupported"));
      if (restoreMicRef.current) {
        restoreMicRef.current = false;
        await setMicRef.current?.(true);
      }
      return;
    }

    const ctx = new AudioCtx();
    meterRef.current = ctx;
    await ctx.resume().catch(() => undefined);
    const source = ctx.createMediaStreamSource(new MediaStream([track]));
    const gain = ctx.createGain();
    gain.gain.value = prefs.inputVolume;
    gainRef.current = gain;
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    source.connect(gain);
    gain.connect(analyser);

    const playback = new Audio();
    playback.srcObject = new MediaStream([track]);
    playback.volume = prefs.inputVolume;
    playbackRef.current = playback;
    try {
      await playback.play();
    } catch {
      /* autoplay; meter still runs */
    }

    const data = new Uint8Array(analyser.fftSize);
    setTesting(true);
    const loop = () => {
      if (!meterRef.current) return;
      analyser.getByteTimeDomainData(data);
      setLevel(rmsLevel(data));
      rafRef.current = requestAnimationFrame(loop);
    };
    loop();
  };

  return (
    <div className="flex flex-col gap-8">
      <section className="grid gap-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-4">
        <div className="flex flex-col gap-4">
          <DeviceSelect
            id="audio-input"
            label={t("settings.audioInput")}
            icon={<IconMicrophone className="size-4" />}
            value={prefs.audioinput ?? devices.audioinput[0]?.deviceId ?? ""}
            options={devices.audioinput}
            onChange={(value) => void onDevice("audioinput", value)}
          />
          <VolumeSlider
            id="input-volume"
            label={t("settings.inputVolume")}
            value={prefs.inputVolume}
            onChange={onInputVolume}
          />
        </div>
        <div className="flex flex-col gap-4">
          <DeviceSelect
            id="audio-output"
            label={t("settings.audioOutput")}
            icon={<IconHeadphones className="size-4" />}
            value={prefs.audiooutput ?? devices.audiooutput[0]?.deviceId ?? ""}
            options={devices.audiooutput}
            onChange={(value) => void onDevice("audiooutput", value)}
          />
          <VolumeSlider
            id="output-volume"
            label={t("settings.outputVolume")}
            value={prefs.outputVolume}
            onChange={onOutputVolume}
          />
        </div>
        <div className="flex flex-col gap-2 sm:col-span-2">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="label-caps min-h-11 shrink-0 rounded-[var(--radius-control)] bg-accent px-4 text-ink-on-accent hover:bg-accent-hover"
              onClick={() => void testMic()}
              aria-pressed={testing}
            >
              {testing ? t("settings.stopMicTest") : t("settings.testMic")}
            </button>
            <MicMeter level={testing ? level : 0} active={testing} label={t("settings.micMeter")} />
          </div>
          <p className="text-xs text-ink-muted">{t("settings.micTestHint")}</p>
        </div>
      </section>
      <section className="flex flex-col gap-4">
        <DeviceSelect
          id="video-input"
          label={t("settings.videoInput")}
          icon={<IconVideo className="size-4" />}
          value={prefs.videoinput ?? devices.videoinput[0]?.deviceId ?? ""}
          options={devices.videoinput}
          onChange={(value) => void onDevice("videoinput", value)}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="relative overflow-hidden rounded-[var(--radius-panel)] border border-border bg-black">
            <video ref={videoRef} className="aspect-video h-auto w-full object-cover" muted playsInline />
            {previewOn ? null : (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 p-3">
                <button
                  type="button"
                  className="label-caps min-h-11 rounded-[var(--radius-control)] bg-accent px-4 text-ink-on-accent hover:bg-accent-hover"
                  onClick={() => void startPreview()}
                >
                  {t("settings.startCameraPreview")}
                </button>
              </div>
            )}
          </div>
          <p className="self-center text-sm text-ink-muted">{t("settings.previewHint")}</p>
        </div>
      </section>
      <section className="flex flex-col gap-4" aria-labelledby="media-quality-title">
        <div>
          <h3 id="media-quality-title" className="font-display text-sm font-bold text-ink">
            {t("settings.qualityTitle")}
          </h3>
          <p className="mt-1 text-xs leading-5 text-ink-muted">{t("settings.qualityBody")}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-x-6">
          <QualitySelect<"receive">
            id="quality-receive"
            label={t("settings.qualityReceive")}
            icon={<IconEye className="size-4" />}
            value={quality.receive}
            options={receiveQualities}
            optionLabel={(value) => t(`settings.receive.${value}`)}
            onChange={(value) => onQuality("receive", value)}
          />
          <QualitySelect<"voice">
            id="quality-voice"
            label={t("settings.qualityVoice")}
            icon={<IconMicrophone className="size-4" />}
            value={quality.voice}
            options={qualityLevels}
            optionLabel={(value) => t(`settings.voiceLevel.${value}`)}
            onChange={(value) => onQuality("voice", value)}
          />
          <QualitySelect<"camera">
            id="quality-camera"
            label={t("settings.qualityCamera")}
            icon={<IconVideo className="size-4" />}
            value={quality.camera}
            options={qualityLevels}
            optionLabel={(value) => t(`settings.cameraLevel.${value}`)}
            onChange={(value) => onQuality("camera", value)}
          />
          <QualitySelect<"screen">
            id="quality-screen"
            label={t("settings.qualityScreen")}
            icon={<IconDeviceDesktop className="size-4" />}
            value={quality.screen}
            options={qualityLevels}
            optionLabel={(value) => t(`settings.screenLevel.${value}`)}
            onChange={(value) => onQuality("screen", value)}
          />
          <QualitySelect<"screenContent">
            id="quality-screen-content"
            label={t("settings.qualityScreenContent")}
            icon={<IconPhotoVideo className="size-4" />}
            value={quality.screenContent}
            options={screenContents}
            optionLabel={(value) => t(`settings.screenContent.${value}`)}
            onChange={(value) => onQuality("screenContent", value)}
          />
        </div>
        <p className="text-xs leading-5 text-ink-muted">{t("settings.qualityScreenHint")}</p>
      </section>
    </div>
  );
}
