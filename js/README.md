# JS/TS tooling

This folder contains the JavaScript/TypeScript tooling that wraps the C server.
Everything compiles to `dist/` via `tsc`.

## Scripts

- `mud.ts`: start/stop/status/restart wrapper around `scripts/run-env.sh`.
- `mud-client.ts`: lightweight telnet client for scripted command runs.
- `mud-watch.ts`: watches `src/` for `.c/.h` changes, rebuilds, and restarts.

## Build

```
npm run build
```

## Run

```
npm run mud:dev
npm run mud:prod
npm run mud:dev:watch
npm run mud:prod:watch
```

## JS command bridge

Start the bridge server:

```
npm run mud:bridge
```

Bridge handlers live in `js/src/bridge/` (shared commands in
`js/src/bridge/commands/`), and class logic lives under `js/src/classes/`.

In-game, use `js:<command>` to route to the bridge. Example:

```
js:ping
js:time
js:whereami
js:echo hello world
js:technique
js:technique cost
js:technique learned
```

You can change the port via `CHAOS_JS_BRIDGE_PORT` (default 4050).

## WebSocket gateway

The browser gateway exposes an HTTP/WebSocket service and proxies traffic to the
raw TCP MUD server.

```
npm run mud:ws-gateway
```

Environment variables:

- `PORT` or `CHAOS_WS_PORT`: listen port (default `8080`)
- `CHAOS_MUD_HOST`: target MUD host (default `127.0.0.1`)
- `CHAOS_MUD_PORT`: target MUD port (default `5000`)
- `CHAOS_WS_ALLOWED_ORIGINS`: optional comma-separated origin allowlist

Health endpoint:

```
GET /health
```

WebSocket endpoint:

```
GET /ws
```

## Debug runs

```
npm run mud:prod -- --tool gdb
npm run mud:prod -- --tool valgrind
```

`gdb` writes a backtrace log to `env/<env>/log/gdb-<timestamp>.log`.
`valgrind` writes its report to `env/<env>/log/valgrind-<timestamp>.log`.

## Client harness

```
npm run mud:client -- --port 5000 --file js/examples/commands.txt
```

## Notes

- `mud-watch.ts` uses polling to avoid filesystem watch quirks on Linux/WSL.
- The wrapper writes PID files to `env/<env>/log/mud.pid` for stop/status.
