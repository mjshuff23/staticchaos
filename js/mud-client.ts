#!/usr/bin/env node
'use strict';

import fs from 'fs';
import net from 'net';

function usage(): void {
  console.log('Usage: mud-client.js [--host host] [--port port] [--cmd cmd] [--file path] [--delay ms] [--linger ms] [--quit]');
  console.log('If no --cmd/--file is provided, stdin is piped to the server.');
  console.log('Use <enter> in a file to send a blank line (for prompts that need RETURN).');
  process.exit(1);
}

const args = process.argv.slice(2);
let host = '127.0.0.1';
let port = 5000;
let delayMs = 200;
let lingerMs = 1500;
let cmds: string[] = [];
let filePath: string | null = null;
let sendQuit = false;

for (let i = 0; i < args.length; i += 1) {
  const arg = args[i];
  if (arg === '--host') {
    host = args[++i] || host;
  } else if (arg === '--port') {
    port = Number.parseInt(args[++i] || '', 10);
  } else if (arg === '--cmd') {
    cmds.push(args[++i] || '');
  } else if (arg === '--file') {
    filePath = args[++i] || null;
  } else if (arg === '--delay') {
    delayMs = Number.parseInt(args[++i] || '', 10);
  } else if (arg === '--linger') {
    lingerMs = Number.parseInt(args[++i] || '', 10);
  } else if (arg === '--quit') {
    sendQuit = true;
  } else {
    usage();
  }
}

if (!Number.isFinite(port)) {
  usage();
}

if (filePath) {
  const lines = fs.readFileSync(filePath, 'utf8')
    .split(/\r?\n/)
    .map((line: string) => line.trim())
    .filter((line: string) => line.length > 0 && !line.startsWith('#'))
    .map((line: string) => {
      if (line.toLowerCase() === '<enter>' || line.toLowerCase() === '<return>') {
        return '';
      }
      return line;
    });
  cmds = cmds.concat(lines);
}

if (sendQuit) {
  cmds.push('quit');
}

const socket = net.createConnection({ host, port }, () => {
  if (cmds.length > 0) {
    let index = 0;
    const sendNext = () => {
      if (index >= cmds.length) {
        if (lingerMs > 0) {
          setTimeout(() => socket.end(), lingerMs);
        } else {
          socket.end();
        }
        return;
      }
      // Small delay lets the server respond between commands.
      socket.write(`${cmds[index]}\n`);
      index += 1;
      setTimeout(sendNext, delayMs);
    };
    sendNext();
  } else {
    process.stdin.pipe(socket);
  }
});

socket.on('data', (chunk: Buffer) => {
  process.stdout.write(chunk);
});

socket.on('error', (err: Error) => {
  console.error(`Connection error: ${err.message}`);
  process.exit(1);
});

socket.on('close', () => {
  process.exit(0);
});
