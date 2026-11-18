# Infra — Amphitheatre

How to run **LiveKit** (voice, camera, screen share) and, optionally, **OvenMediaEngine** (OBS ingest / shared live playback) in Docker. The OME player is the only signal that is the same for everyone; the rest of the product **does not depend** on OME.

Apps `apps/api` (Hono :3001) and `apps/web` (Vite :5173) are **not** in this folder. This README is the contract they use to connect.

This folder is for **local development** (the apps run from source on the host). To self-host a production instance with pre-built images, a domain, and a reverse proxy, use [`deploy/`](../deploy/) and [docs/self-hosting.md](../docs/self-hosting.md) instead.

## Prerequisites

- Docker Engine + Compose v2
- Root `.env`: `cp .env.example .env`
- (Optional) OBS Studio and/or `ffmpeg` for ingest
- (Optional) [OvenPlayer demo](https://demo.ovenplayer.com) to validate playback

## Bring the stack up

```bash
cp .env.example .env          # set IPs if you will test on a phone
make up                       # Valkey + LiveKit — OME off
make smoke
make ome-up                   # start OME on the same compose (profile ome)
make ome-down                 # stop OME only; voice/chat keep working
make down                     # stop everything
```

Compose equivalent:

```bash
docker compose up -d                              # no OME
docker compose --profile ome up -d                # with OME
docker compose --profile ome --profile caddy up -d  # + TLS reverse proxy
```

**OME independence (guarantee):** the `ome` service has `profiles: [ome]` and is **not** in LiveKit/Valkey `depends_on`. `docker compose up` never starts OME. `make ome-down` / `docker compose stop ome` leaves LiveKit and Valkey healthy — the independence test is in `make smoke` and [docs/load-testing.md](../docs/load-testing.md).

## Profiles

| Profile | Extra services | When to use |
| --- | --- | --- |
| *(none)* | `redis` (Valkey), `livekit` | Day-to-day; voice/chat/camera/screen without OME |
| `ome` | `ome` | OBS ingest + WebRTC/LL-HLS playback |
| `caddy` | `caddy` | Local TLS / `*.localhost` for HTTP/WS only (media UDP **does not** go through Caddy) |

Linux overlay (host network, dedicated VM):

```bash
docker compose -f docker-compose.yml -f infra/compose/livekit-hostnet.yml up -d
```

Adjust `redis.address` and `use_external_ip` in `infra/livekit/livekit.yaml` as commented in the overlay.

## Ports published on the host

| Port | Service | Protocol | Who uses it |
| --- | --- | --- | --- |
| 6379/tcp | Valkey | RESP | LiveKit uses DB 1 **inside** the Docker network (hostname `redis`). The API is SQLite |
| 7880/tcp | LiveKit | HTTP + WebSocket | API (`LIVEKIT_HTTP_URL`), SDK (`LIVEKIT_URL`) |
| 7881/tcp | LiveKit | ICE/TCP | Fallback when UDP is blocked (corporate Wi-Fi, some phones) |
| 7882/udp | LiveKit | WebRTC UDP mux | Voice/camera/screen media. Single-purpose port (Docker Desktop) |
| 6789/tcp | LiveKit | Prometheus | `127.0.0.1` only — metrics for load tests |
| 1935/tcp | OME | RTMP | OBS / ffmpeg ingest |
| 3333/tcp | OME | WS + HTTP | WebRTC signalling + LL-HLS |
| 3334/tcp | OME | TLS | Secure playback (needs a certificate) |
| 3478/tcp | OME | TURN/TCP relay | Phone behind symmetric NAT |
| 10000/tcp | OME | ICE TCP | RFC 6544 |
| 10000–10003/udp | OME | ICE UDP | Broadcast media |
| 8081/tcp | OME | REST | “Is this stream live?” |

**Do not** publish Valkey or the OME API to the internet in production. Dedicated-VM firewall: open media UDP + 7880/443 + 1935 (only if OBS is off-network).

Phone on **mobile data**: UDP is often filtered. LiveKit falls back to ICE/TCP (`7881`) and, if that still fails, TURN (section below). OME uses built-in TURN on `3478`. Without those ports on the firewall, the phone connects the WebSocket and stays mute/black.

## Environment variables (API contract)

Copy `.env.example`. Real secrets only in `.env` (gitignored). Full list: [docs/configuration.md](../docs/configuration.md).

| Variable | Use |
| --- | --- |
| `LIVEKIT_API_KEY` / `LIVEKIT_API_SECRET` | Server and **JWT mint** in Hono. Secret ≥ 32 chars, **no** `:` |
| `LIVEKIT_URL` | Public for the browser (`ws://localhost:7880` in dev, `wss://…` in prod) |
| `LIVEKIT_HTTP_URL` | `http://localhost:7880` — backend RoomService |
| `REDIS_URL` | Valkey on the host (RESP). **LiveKit uses DB 1.** Hono uses SQLite; DB 0 is unused |
| `OME_HOST_IP` | IP announced in OME ICE (`127.0.0.1` on the machine; LAN IP for a phone) |
| `OME_API_ACCESS_TOKEN` | REST Basic auth. Compose passes it to `<AccessToken>` in `Server.xml` |
| `OME_API_URL` | `http://localhost:8081` |
| `OME_RTMP_INGEST_URL` / `OME_RTMP_URL` | `rtmp://localhost:1935/app` (API alias) |
| `OME_WEBRTC_PLAYBACK_BASE` / `OME_PLAYBACK_URL` | `ws://localhost:3333/app` (API alias) |
| `OME_LLHLS_PLAYBACK_BASE` | `http://localhost:3333/app` |
| `OME_ADMISSION_WEBHOOK_URL` | Backend must expose this when the webhook is uncommented in the XML |
| `LIVEKIT_WEBHOOK_URL` | Already on the API: `POST /webhooks/livekit` (HMAC = `LIVEKIT_API_KEY`/`SECRET`; Compose writes `LIVEKIT_API_KEY` into `webhook.api_key` at start) |

LiveKit room name = Amphitheatre `roomId`. Infra **does not** authenticate participants; Hono signs the token with `canPublish` / `canPublishSources`. Simulcast is already the SDK default.

## Stream key (OBS + backend + player)

Implemented format (owner/admin ingest only, provider `ome` on):

```
OME application = app
stream name     = {roomId}-{secret}    # ome.ingest.streamKey — not the public room id alone
```

| Role | URL |
| --- | --- |
| OBS Server | `rtmp://HOST:1935/app` |
| OBS Stream key | `{roomId}-{secret}` (`ome.ingest.streamKey`) |
| ffmpeg equivalent | `rtmp://HOST:1935/app/{streamKey}` |
| WebRTC playback (OvenPlayer ABR) | `ws://HOST:3333/app/{streamKey}/webrtc` |
| LL-HLS playback | `http://HOST:3333/app/{streamKey}/llhls.m3u8` |
| “Is it live?” | `GET {OME_API_URL}/v1/vhosts/default/apps/app/streams/{streamKey}` |

Product walkthrough: [docs/broadcast.md](../docs/broadcast.md).

OME REST auth: header `Authorization: Basic base64(OME_API_ACCESS_TOKEN)` (not `user:password` unless the token contains `:`).

- **200** + JSON → stream exists (live)
- **404** → nobody is publishing in that room
- **401** → XML token ≠ `.env`

The API **polls** that GET (enough for dev). OME AdmissionWebhooks (`POST /webhooks/ome/admission`) are **not** implemented; the block in `Server.xml` stays commented. Do not uncomment it without adding the handler.

Production: do not leave RTMP open without SignedPolicy (commented block). A guessable stream key is ingest hijack — that is why the key is `{roomId}-{secret}`, not the public id.

The ffmpeg smoke fixture (`make ffmpeg-ome ROOM=…`) publishes whatever name you pass as the RTMP path. That is a lab stream, not a minted room key.

## LiveKit — what is already on

- Mic, camera, screen share (permissions on the **token**, not in infra)
- Simulcast + congestion control + TCP fallback
- `max_participants: 50` (product cap)
- Valkey DB 1 (RESP; Compose hostname `redis`; the API does not use that store)
- **No** egress, RTMP ingress, recorder, or SIP

Reconnect: LiveKit client defaults (`room.connect` reconnect). No custom protocol.

Quality indicator: `participant.connectionQuality` (`excellent` / `good` / `poor` / `lost`) + simulcast layers. The frontend displays this; infra only enables the transport.

### TURN / NAT / phones

1. Local on the same machine: UDP mux `7882` + loopback candidate.
2. Phone on LAN Wi-Fi: set the LAN IP in `.env` and uncomment `node_ip` in `livekit.yaml`; on OME, `OME_HOST_IP` **equal** to that IP.
3. Phone on bad NAT / 4G: publish `7881/tcp` (already mapped) and enable LiveKit's built-in TURN on port **3479** (comments in the YAML — **3478 is OME**). Coturn snippet in `docker-compose.yml`. Caddy/Traefik only terminate TLS for **signalling** (`7880` / `3333`); ICE UDP stays direct on the host.

## OvenMediaEngine — adaptive quality

Default dev: **ABR** (`abr_stream`) — bypass of the OBS 1080 + software transcode 720/480 (`Preset` faster, `BFrames` 0). HLS `FileName` `llhls` (AAC). WebRTC on the default playlist (Opus). LL-HLS: `ChunkDuration` 0.2 s, `SegmentDuration` 2 s (OBS GOP 1–2 s). WebRTC is the sub-second path; LL-HLS is fallback (~1–3 s). Transcode uses host CPU.

The SPA uses **OvenPlayer**: WebRTC on `ws://HOST:3333/app/{streamKey}/webrtc` (default playlist Opus), then LL-HLS. `/llhls` is only the HLS master (AAC). OME reads `Server.xml` at start — recreate the container after editing the XML.

**Recording:** DVR off, File publisher **absent**, no LiveKit Egress. Do not turn them on.

TLS: browsers require a secure context for WebRTC on **non-localhost origins**. In production, certificates in `infra/ome/certs/` + uncomment `<TLS>`, or Caddy/Traefik in front of `3333`.

LL-HLS CORS: `*` in dev. Tighten in production.

## OBS guide

If OME is **off**, **do not** use OBS for the room. Anyone who needs to show a screen uses **LiveKit screen share**. Chat and voice do not change. Only the shared OME player is gone.

### Scene

1. **Window capture** (or display) of the content browser/app.
2. DRM (Netflix and similar): turn off hardware acceleration **in the capture browser**, or the window goes black. Software decode + encode at once is heavy — watch CPU. Amphitheatre does not implement or endorse retransmitting a third-party catalog.

### Settings → Output (Advanced)

| Field | Value |
| --- | --- |
| Encoder | NVIDIA GPU: **NVENC H.264**. No GPU: **x264** |
| Rate control | CBR |
| Bitrate | 6000–8000 kbps for 1080p60; lower if upload cannot keep up (2500 kbps is enough for 720p30) |
| Keyframe | **1–2 s** (short GOP; never 0) |
| x264 preset | `veryfast` or `ultrafast` |
| x264 tune | `zerolatency` |
| Profile | `baseline` or `main` |

### Settings → Video

- Canvas/output: 1920×1080 (or 1280×720 if the machine struggles)
- FPS: 60 if CPU/GPU can take it; otherwise 30

### Settings → Stream

- Service: **Custom**
- Server: `rtmp://HOST:1935/app` (`HOST` = `localhost` or LAN IP / public hostname)
- Stream key: **`ome.ingest.streamKey`** (`{roomId}-{secret}`). Knowing the public room id is not enough.

### Quick test without OBS

```bash
make ome-up
make ffmpeg-ome ROOM=abc12xy
```

Player: `ws://localhost:3333/app/abc12xy/webrtc` or `http://localhost:3333/app/abc12xy/llhls.m3u8`.

## Healthchecks and scripts

| Target | How |
| --- | --- |
| Valkey | `valkey-cli ping` in container `coliseum-valkey` |
| LiveKit | `GET /` on `:7880` |
| OME | TCP `:8081` + REST `/v1/vhosts` |

```bash
make smoke
make logs ARGS=livekit
infra/scripts/ffmpeg-ome-fixture.sh
```

## Docker network

Named network `coliseum`. When API/SPA are containerized, they join this network:

- API → `redis:6379`, `http://livekit:7880`, `http://ome:8081` (OME only if the profile is up; treat ECONNREFUSED as “stream off”)
- SPA in the browser **does not** use Docker DNS: it uses `LIVEKIT_URL` / OME URLs on the host or the public domain

`extra_hosts: host.docker.internal:host-gateway` is already on LiveKit and OME for webhooks to Hono on the host (`:3001`).

## App contract (implemented vs not)

**Hono (`apps/api`) — implemented**

- LiveKit JWT mint: room = `roomId`, identity = `userId`
- Poll `GET /v1/vhosts/default/apps/app/streams/{streamKey}` and expose media/broadcast on the room WS
- Password lockout (3 failures / 5 min) and in-memory rate limits
- `POST /webhooks/livekit` (HMAC)

**Not implemented**

- `POST /webhooks/ome/admission` — keep the `Server.xml` block commented
- Recording of any kind

**Vite (`apps/web`) — implemented**

- LiveKit client + simulcast; `connectionQuality` on tiles
- OvenPlayer (WebRTC first, LL-HLS / `hls.js` fallback)
- OME player errors stay isolated: LiveKit tiles and chat remain
- Separate mobile layout; do not assume UDP — test iOS Safari on 4G (see [docs/load-testing.md](../docs/load-testing.md))

HTTP/WS paths: [docs/api.md](../docs/api.md).

## Pinned images

- `livekit/livekit-server:v1.13.11`
- `ovenmedialabs/ovenmediaengine:v0.21.0`
- `valkey/valkey:9.1.3-alpine` (Compose service `redis`, container `coliseum-valkey`)
- `caddy:2.11.9-alpine` (profile `caddy`)
- `coturn/coturn:4.19.1-alpine` (commented profile)

Docs used: [OME Docker](https://ovenmedialabs.com/docs/ome/getting-started/getting-started-with-docker), [OME Server.xml](https://ovenmedialabs.com/docs/ome/configuration), [OME REST streams](https://ovenmedialabs.com/docs/ome/rest-api/v1/virtualhost/application/stream), [OME AdmissionWebhooks](https://ovenmedialabs.com/docs/ome/access-control/admission-webhooks), [LiveKit config-sample.yaml](https://github.com/livekit/livekit/blob/master/config-sample.yaml), [Compose profiles](https://docs.docker.com/compose/how-tos/profiles/).
