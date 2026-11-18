import {
  IconAlertTriangle,
  IconDeviceDesktop,
  IconEye,
  IconGauge,
  IconInfoCircle,
  IconMicrophone,
  IconPhotoVideo,
  IconPlayerPlay,
  IconVideo,
} from "@tabler/icons-react";
import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { cn } from "../../lib/cn.ts";
import { classifyGetUserMediaError, mediaFailureToastKey } from "../../lib/media-permissions.ts";
import {
  qualityLevels,
  readMediaQuality,
  receiveQualities,
  SCREEN_USAGE_GUIDE,
  screenContents,
  screenFrameRates,
  screenQualities,
  screenUsage,
  writeMediaQuality,
  type MediaQualityKey,
  type MediaQualityPrefs,
} from "../../lib/media-quality.ts";
import { useRoomStore } from "../../stores/room-store.ts";
import { Button } from "../ui/button.tsx";
import { Field } from "../ui/field.tsx";
import { Popover } from "../ui/popover.tsx";
import { Select } from "../ui/select.tsx";

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

function ScreenUsageNote({ quality }: { quality: MediaQualityPrefs }) {
  const { t } = useTranslation();
  const liveTier = useRoomStore((s) => s.screenAutoTier);
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const usage = screenUsage(quality);
  const values = { upload: usage.uploadMbps, recommended: usage.recommendedMbps };
  const auto = quality.screen === "auto";
  const warning = !auto && usage.heavy;
  const Icon = warning ? IconAlertTriangle : IconGauge;
  const message = auto
    ? t("settings.usageAuto", values)
    : t(warning ? "settings.usageHeavy" : "settings.usageFixed", values);
  const extra =
    auto && liveTier
      ? t("settings.usageNow", { height: liveTier.height, fps: liveTier.frameRate })
      : !auto && quality.screenFps === "60" && quality.screenContent === "detail"
        ? t("settings.usageTextAt60")
        : null;

  return (
    <div
      className={cn(
        "flex items-start gap-2.5 rounded-[var(--radius-control)] border px-3 py-2.5 sm:col-span-2",
        warning ? "border-attention/40 bg-attention-soft" : "border-border bg-surface-sunken",
      )}
    >
      <Icon
        className={cn("mt-0.5 size-4 shrink-0", warning ? "text-attention-text" : "text-ink-subtle")}
        stroke={1.75}
        aria-hidden="true"
      />
      <p className={cn("min-w-0 flex-1 text-[13px] leading-5", warning ? "text-attention-text" : "text-ink-muted")}>
        {message}
        {extra ? ` ${extra}` : ""}
      </p>
      <Button
        variant="ghost"
        size="icon"
        className="-my-1 -mr-1 size-7 [&_svg]:size-4"
        aria-label={t("settings.usageMore")}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={(event) => {
          setAnchor(event.currentTarget);
          setOpen((value) => !value);
        }}
      >
        <IconInfoCircle stroke={1.75} aria-hidden="true" />
      </Button>
      <Popover
        open={open}
        onClose={() => setOpen(false)}
        anchor={anchor}
        label={t("settings.guideTitle")}
        className="flex flex-col gap-2.5 p-4 text-[13px] leading-5"
      >
        <h4 className="pr-7 font-display text-sm font-bold text-ink">{t("settings.guideTitle")}</h4>
        <p>{t("settings.guideViewers")}</p>
        <p>{t("settings.guideUpload")}</p>
        <div>
          <p className="mb-1 font-bold text-ink-soft">{t("settings.guideTableTitle")}</p>
          <ul className="flex flex-col gap-1">
            {SCREEN_USAGE_GUIDE.map((row) => (
              <li key={`${row.height}-${row.fps}`} className="flex justify-between gap-3">
                <span>{t("settings.guideUploadValue", { value: row.recommendedMbps })}</span>
                <span className="text-right text-ink">
                  {t("settings.guideQuality", { height: row.height, fps: row.fps })}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <p>{t("settings.guideWatching")}</p>
      </Popover>
    </div>
  );
}

export function CallQualityPanel({
  applyMediaQuality,
}: {
  applyMediaQuality: (key: MediaQualityKey) => Promise<void>;
}) {
  const { t } = useTranslation();
  const [quality, setQuality] = useState(readMediaQuality);

  const onQuality = <K extends MediaQualityKey>(key: K, value: MediaQualityPrefs[K]) => {
    const next = { ...quality, [key]: value };
    setQuality(next);
    writeMediaQuality(next);
    void applyMediaQuality(key).catch((err: unknown) => {
      toast.error(t(mediaFailureToastKey(classifyGetUserMediaError(err))));
    });
  };

  return (
    <section className="flex flex-col gap-5" aria-labelledby="call-quality-title">
      <div>
        <h3 id="call-quality-title" className="font-display text-sm font-bold text-ink">
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
          options={screenQualities}
          optionLabel={(value) => t(`settings.screenLevel.${value}`)}
          onChange={(value) => onQuality("screen", value)}
        />
        {quality.screen === "auto" ? null : (
          <QualitySelect<"screenFps">
            id="quality-screen-fps"
            label={t("settings.qualityScreenFps")}
            icon={<IconPlayerPlay className="size-4" />}
            value={quality.screenFps}
            options={screenFrameRates}
            optionLabel={(value) => t(`settings.screenFps.${value}`)}
            onChange={(value) => onQuality("screenFps", value)}
          />
        )}
        <QualitySelect<"screenContent">
          id="quality-screen-content"
          label={t("settings.qualityScreenContent")}
          icon={<IconPhotoVideo className="size-4" />}
          value={quality.screenContent}
          options={screenContents}
          optionLabel={(value) => t(`settings.screenContent.${value}`)}
          onChange={(value) => onQuality("screenContent", value)}
        />
        <ScreenUsageNote quality={quality} />
      </div>
      <p className="text-xs leading-5 text-ink-muted">{t("settings.qualityScreenHint")}</p>
    </section>
  );
}
