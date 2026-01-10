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
