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
