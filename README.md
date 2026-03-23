# Static Chaos

Static Chaos is a classic MUD codebase written in C, with a small TypeScript
wrapper to make local dev loops easier. The canonical runtime data lives under
`env/dev` and `env/prod` so you can keep two isolated worlds.

## Repo layout

- `doc/` in-game docs and historical notes.
- `env/` runtime data for each environment (areas, players, notes, logs).
- `scripts/` bash launchers that set environment paths for the C server.
- `src/` C source and build output (`chaosium`).
- `js/` TypeScript wrapper/client tools (compiled to `dist/`).

## Build the server

```
cd src
make chaosium
```

Rebuild any time you change C code. You do not need to rebuild for area/data
file edits.
Debug-friendly flags are enabled by default; use `make chaosium DEBUG=0` for an
optimized build.

## Run the server (shell)

```
./scripts/run-dev.sh [port]
./scripts/run-prod.sh [port]
```

Defaults are 4000 for dev and 5000 for prod. These scripts set the `CHAOS_*`
environment variables so the server reads/writes from the correct `env/*` tree.

## Run via the JS wrapper

```
npm run mud:dev
npm run mud:prod
```

See `js/README.md` for wrapper/client details (including scripted logins).

## Run with Docker

Build the image and run a single environment:

```
docker compose up mud-dev
```

Or for prod:

```
docker compose up mud-prod
```

Compose also starts the JS bridge service, so `js:` commands work out of the box.
The containers expose ports 4000 (dev), 5000 (prod), and 4050 (bridge).
Data under `env/dev` and `env/prod` is bind-mounted so changes persist on your host.

## Deploy on Railway

The easiest cloud setup for this repo is a single Railway service using the root
`Dockerfile`.

1. Create a new Railway project from this GitHub repo.
2. Deploy the root service with the default `Dockerfile`.
3. Set `PORT` only if you want to force a specific port. If unset, Railway
   provides one automatically and the launcher now honors it.
4. Keep the start command empty so Railway uses the image entrypoint and default
   command (`prod` on the Railway-provided port when `PORT` is set).
5. Expose the service with Railway TCP proxying, since the MUD server speaks raw
   TCP rather than HTTP.

Notes:

- Railway should run the production world, not `dev`.
- Browser clients still cannot connect directly to raw TCP. For a portfolio UI,
  add a small WebSocket gateway in front of the MUD and have the page connect to
  that gateway.
- If you want persistent runtime data across redeploys, attach a Railway volume
  and mount it over `/opt/staticchaos/env/prod`.

## Browser gateway

Browsers cannot connect directly to the raw TCP MUD socket. For a portfolio UI,
run the WebSocket gateway in this repo as a separate service.

Local run:

```
npm run mud:ws-gateway
```

Local Docker Compose:

```
docker compose up mud-prod mud-web-gateway
```

Gateway environment variables:

- `PORT` or `CHAOS_WS_PORT`: HTTP/WebSocket listen port. Defaults to `8080`.
- `CHAOS_MUD_HOST`: target MUD host. Defaults to `127.0.0.1`.
- `CHAOS_MUD_PORT`: target MUD port. Defaults to `5000`.
- `CHAOS_WS_ALLOWED_ORIGINS`: optional comma-separated allowed browser origins.
  Leave unset to allow all origins during initial testing.

Railway setup:

1. Create a second service from this same repo.
2. In that new service, set the Dockerfile path to `Dockerfile.gateway`.
3. Leave the start command empty.
4. Set `CHAOS_MUD_HOST=staticchaos.railway.internal`.
5. Set `CHAOS_MUD_PORT=5000`.
6. Generate a normal Railway domain for the gateway service.
7. Connect your frontend to `wss://<gateway-domain>/ws`.

The gateway also exposes `/health`, which is useful for Railway health checks.

## JS command bridge

Start the bridge server in another terminal:

```
npm run mud:bridge
```

Then use `js:<command>` in the MUD. Example:

```
js:ping
js:time
js:whereami
js:echo hello world
js:technique
js:technique cost
js:technique learned
```

The default bridge port is 4050; override with `CHAOS_JS_BRIDGE_PORT`.
The bridge host defaults to `127.0.0.1`; override with `CHAOS_JS_BRIDGE_HOST`.

## Debugging crashes

```
npm run mud:prod -- --tool gdb
npm run mud:prod -- --tool valgrind
```

GDB writes a backtrace log to `env/<env>/log/gdb-<timestamp>.log`. Valgrind
writes its report to `env/<env>/log/valgrind-<timestamp>.log`.

## Logs and runtime data

- Server logs: `env/dev/log/` and `env/prod/log/`.
- Wrapper logs and PIDs are also written under `env/*/log/`.
- Latest server log: `env/*/log/chaosium-<env>.log`.
- Player, notes, and finger data live under `env/*/player`, `env/*/notes`,
  and `env/*/finger`.

## Helpful environment variables

The scripts set these for you:

- `CHAOS_ENV_ROOT` (root of the env)
- `CHAOS_AREA_DIR`
- `CHAOS_PLAYER_DIR`
- `CHAOS_PLAYER_TEMP_DIR`
- `CHAOS_FINGER_DIR`
- `CHAOS_NOTES_DIR`
