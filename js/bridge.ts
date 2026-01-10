#!/usr/bin/env node
'use strict';

import net from 'net';
import type { BridgeRequest } from './src/bridge/types';
import { handlers } from './src/bridge/registry';
import { sanitizeOutput, toArgv } from './src/bridge/utils';

const port = Number.parseInt(process.env.CHAOS_JS_BRIDGE_PORT || '', 10) || 4050;
const host = process.env.CHAOS_JS_BRIDGE_HOST || '127.0.0.1';

const server = net.createServer((socket) => {
  let buffer = '';

  socket.on('data', (chunk) => {
    buffer += chunk.toString('utf8');
    const newline = buffer.indexOf('\n');
    if (newline === -1) {
      return;
    }

    const line = buffer.slice(0, newline).trim();
    buffer = '';

    let req: BridgeRequest;
    try {
      req = JSON.parse(line) as BridgeRequest;
    } catch (err) {
      socket.end('ERR invalid payload\n');
      return;
    }

    const command = req.command?.trim().toLowerCase();
    if (!command) {
      socket.end('ERR missing command\n');
      return;
    }

    const handler = handlers[command];
    if (!handler) {
      socket.end('NOHANDLER\n');
      return;
    }

    try {
      const output = sanitizeOutput(handler(req, toArgv(req.args)));
      socket.end(`OK ${output}\n`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'handler threw unknown error';
      socket.end(`ERR ${sanitizeOutput(message)}\n`);
    }
  });

  socket.on('error', () => {
    socket.destroy();
  });
});

server.listen(port, host, () => {
  console.log(`JS bridge listening on ${host}:${port}`);
});
