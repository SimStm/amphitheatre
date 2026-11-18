# Self-hosting Amphitheatre

This guide is for running your own copy of Amphitheatre on your own server, without writing any code. If you want to develop the project itself, see [Getting started](getting-started.md) instead.

## The three moving parts, in plain words

Amphitheatre is not a single program — it is three small services that talk to each other:

| Piece | What it does | Do you need it? |
|---|---|---|
| **The app** | The website itself: rooms, chat, login, moderation. Also the piece that draws your video tiles on screen. | Always |
| **LiveKit** | The "engine" that carries voice, camera, and screen share between people in real time. | Always |
| **OvenMediaEngine (OME)** | Lets one person broadcast from OBS so everyone watches the exact same live video, like a mini Twitch inside your room. | Only if you want that feature — off by default |

You do **not** need to clone the whole source-code repository to run Amphitheatre. The `deploy/` folder in this repository is self-contained: download just that folder, and it downloads ready-made images for the rest.

## What you need before you start

- A server (a small VPS is enough) with [Docker](https://docs.docker.com/get-docker/) and Docker Compose installed.
- One domain name you control, with the ability to create DNS records. Free options like a subdomain from a dynamic-DNS provider also work.
- 10 minutes.

## Step 1 — Get the deploy folder

Download the `deploy/` folder onto your server. If you have `git`, the simplest way is to clone the whole repository and use that folder — it does not download or build anything extra by itself:

```bash
git clone https://github.com/simstm/amphitheatre.git
cd amphitheatre/deploy
```

Everything from here on happens inside `deploy/`.

## Step 2 — Point your domain at your server

Amphitheatre uses up to three subdomains. Create DNS "A" records for each one, pointing at your server's IP address:

| Subdomain (example) | What it is for |
|---|---|
| `amp.example.com` | The website people open |
| `live.example.com` | LiveKit (voice/camera/screen share) |
| `stream.example.com` | OvenMediaEngine (only if you use the optional broadcast stage) |

You can use any names you like — these three are just examples. If you are not using the broadcast stage, you can skip the third one.

## Step 3 — Configure

```bash
cp env.example .env
```

Open `.env` in a text editor and fill in:

- `PUBLIC_APP_HOSTNAME`, `PUBLIC_LIVEKIT_HOSTNAME`, `PUBLIC_OME_HOSTNAME` — the three domains from step 2. Setting these three is enough: the app works out every other URL by itself (see [Configuration](configuration.md) if you ever need to override one manually).
- `ACME_EMAIL` — your e-mail, used to request free HTTPS certificates.
- `SESSION_SECRET` and `LIVEKIT_API_SECRET` — replace both with long random text. On Linux/macOS you can generate one with `openssl rand -hex 32`.

## Step 4 — Choose how traffic reaches your server

Pick **one** of the two options below.

### Option A — Caddy (recommended if you are not sure)

Caddy is bundled and gets free HTTPS certificates automatically, with no extra setup.

```bash
docker compose --profile caddy up -d
```

### Option B — Traefik

Use this if you already run Traefik on this machine (common when you host several apps), or prefer it over Caddy.

```bash
docker compose -f docker-compose.traefik.yml up -d
```

`docker-compose.traefik.yml` starts its own Traefik container. If you **already** have Traefik running for other sites, do not run two Traefik containers — instead, remove the `traefik` service from that file and connect the `app`, `livekit`, and `ome` services to your existing Traefik network (usually declared with `external: true` in your other compose file). The `labels:` on each service already contain everything Traefik needs to route traffic; you only need to make sure they share Traefik's network.

Whichever option you pick, one detail does not change: **voice, camera, and screen share traffic never goes through the reverse proxy.** They travel directly between the browser and LiveKit/OME over UDP, because that is the only way real-time video works well. That is why some ports (see the table further down) must be open directly on your server's firewall no matter which reverse proxy you use.

## Step 5 — Start it

```bash
docker compose up -d          # (or the Traefik command from Step 4)
```

Open `https://amp.example.com` (your own `PUBLIC_APP_HOSTNAME`). That's it — chat, voice, camera, and screen share are working.

The **operator console** is not on that public hostname. Compose publishes it only on the server loopback: `http://127.0.0.1:3002` (SSH tunnel from your laptop). First boot writes username, password, and API key to `data/admin-bootstrap.txt` inside the `amphitheatre-app-data` volume. Full guide: [Operator admin](operator-admin.md).

Want the optional broadcast stage too?

```bash
docker compose --profile ome up -d
```

## No domain yet / just testing?

If you only want to try it on your own machine or over your local network, you can skip DNS and the reverse proxy entirely. Leave `PUBLIC_APP_HOSTNAME` etc. unset, run `docker compose up -d` without a `--profile caddy`/Traefik step, and open `http://<your-machine-ip>:3001`. This is not secure enough for the public internet (no HTTPS), but it is the fastest way to kick the tires.

You can also run just the app container against a LiveKit you already have (self-hosted elsewhere, or LiveKit Cloud):

```bash
docker run -d \
  -p 3001:3001 \
  -p 127.0.0.1:3002:3002 \
  -e SESSION_SECRET=change-me \
  -e ADMIN_BIND=0.0.0.0 \
  -e LIVEKIT_API_KEY=... -e LIVEKIT_API_SECRET=... -e LIVEKIT_URL=wss://your-livekit-host \
  -v amphitheatre-data:/app/data \
  simstosh/amphitheatre:2.0.1
```

## Ports reference

| Port | Service | Needed when |
|---|---|---|
| 443/tcp+udp, 80/tcp | Your reverse proxy (Caddy or Traefik) | Always (public HTTPS) |
| 3001/tcp | The app (theater) | Only if you run it **without** a reverse proxy (`docker-compose.yml` default) |
| 3002/tcp on `127.0.0.1` | Operator console | Always in Compose (loopback only). Do not publish this on `0.0.0.0`. |
| 7880/tcp | LiveKit signalling | Only if you run it **without** a reverse proxy |
| 7881/tcp | LiveKit — fallback for restrictive networks | Always |
| 7882/udp | LiveKit — voice/camera/screen media | Always |
| 1935/tcp | OME — OBS ingest | Only with the broadcast stage |
| 3333/tcp, 3334/tcp | OME — signalling/LL-HLS | Only with the broadcast stage, and only **without** a reverse proxy |
| 3478/tcp | OME — TURN/relay | Only with the broadcast stage |
| 10000/tcp, 10000-10003/udp | OME — media | Only with the broadcast stage |

Ports marked "always" carry raw voice/video data and must stay open on your firewall even behind Traefik or Caddy — a reverse proxy only understands HTTP, not this kind of traffic.

## Updating to a new version

New versions are published to Docker Hub as `simstosh/amphitheatre:<version>`. See [Releases](https://github.com/simstm/amphitheatre/releases) for what changed in each one. The Compose files run the version in `AMPHITHEATRE_VERSION`, so an update never happens by surprise. Set it in your `.env`, then pull and restart:

```bash
docker compose pull app
docker compose up -d app
```

Your rooms, roles, and bans live in the `amphitheatre-app-data` volume and are not affected by an update.

## Backups

Everything that matters (rooms, roles, bans) lives in one file inside the `amphitheatre-app-data` Docker volume. Back up that volume like you would any other file — there is no separate database server to worry about.

## Building your own image instead of using Docker Hub

If you would rather build the image yourself (e.g. to audit it, or to run on `arm64`/`amd64` without depending on Docker Hub):

```bash
git clone https://github.com/simstm/amphitheatre.git
cd amphitheatre
docker build -t amphitheatre .
```

Then point `deploy/docker-compose.yml`'s `app.image` at your own tag instead of `simstosh/amphitheatre:${AMPHITHEATRE_VERSION:-<version>}`.
