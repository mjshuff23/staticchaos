#!/usr/bin/env node
'use strict';

import http from 'http';
import net from 'net';
import { WebSocketServer, type RawData } from 'ws';

const listenPort = Number.parseInt(process.env.PORT || process.env.CHAOS_WS_PORT || '', 10) || 8080;
const listenHost = process.env.CHAOS_WS_HOST || '0.0.0.0';
const mudHost = process.env.CHAOS_MUD_HOST || '127.0.0.1';
const mudPort = Number.parseInt(process.env.CHAOS_MUD_PORT || '', 10) || 5000;
const wsHeartbeatMs =
  Number.parseInt(process.env.CHAOS_WS_HEARTBEAT_MS || '', 10) || 30_000;
const idleTimeoutMs =
  Number.parseInt(process.env.CHAOS_WS_IDLE_TIMEOUT_MS || '', 10) || 10 * 60_000;
const allowedOrigins = new Set(
  (process.env.CHAOS_WS_ALLOWED_ORIGINS || '')
    .split(',')
    .map((value) => value.trim())
    .filter((value) => value.length > 0)
);

function isOriginAllowed(origin: string | undefined): boolean {
  if (allowedOrigins.size === 0 || allowedOrigins.has('*')) {
    return true;
  }

  return !!origin && allowedOrigins.has(origin);
}

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ ok: true, mudHost, mudPort }));
    return;
  }

  res.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' });
  res.end('Static Chaos WebSocket gateway is running. Connect with WebSocket on /ws.\n');
});

const wss = new WebSocketServer({
  noServer: true,
  perMessageDeflate: false,
});

wss.on('connection', (ws, req) => {
  const remoteAddress = req.socket.remoteAddress || 'unknown';
  const tcpSocket = net.createConnection({ host: mudHost, port: mudPort });
  let lastActivityAt = Date.now();
  let heartbeatInterval: NodeJS.Timeout | null = null;
  let idleCheckInterval: NodeJS.Timeout | null = null;
  let awaitingPong = false;

  const markActivity = () => {
    lastActivityAt = Date.now();
    awaitingPong = false;
  };

  const cleanupTimers = () => {
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval);
      heartbeatInterval = null;
    }

    if (idleCheckInterval) {
      clearInterval(idleCheckInterval);
      idleCheckInterval = null;
    }
  };

  tcpSocket.setKeepAlive(true, 30_000);
  tcpSocket.setNoDelay(true);

  tcpSocket.on('connect', () => {
    console.log(`ws connected from ${remoteAddress}; proxying to ${mudHost}:${mudPort}`);
  });

  tcpSocket.on('data', (chunk: Buffer) => {
    markActivity();
    if (ws.readyState === ws.OPEN) {
      ws.send(chunk, { binary: true });
    }
  });

  tcpSocket.on('end', () => {
    cleanupTimers();
    if (ws.readyState === ws.OPEN) {
      ws.close(1000, 'MUD connection closed');
    }
  });

  tcpSocket.on('error', (err: Error) => {
    cleanupTimers();
    console.error(`tcp error from ${remoteAddress}: ${err.message}`);
    if (ws.readyState === ws.OPEN) {
      ws.close(1011, 'TCP proxy error');
    }
  });

  ws.on('message', (data: RawData) => {
    markActivity();
    if (tcpSocket.destroyed) {
      return;
    }

    if (Buffer.isBuffer(data)) {
      tcpSocket.write(data);
      return;
    }

    if (Array.isArray(data)) {
      tcpSocket.write(Buffer.concat(data));
      return;
    }

    if (data instanceof ArrayBuffer) {
      tcpSocket.write(Buffer.from(data));
      return;
    }

  });

  ws.on('pong', () => {
    markActivity();
  });

  ws.on('close', () => {
    cleanupTimers();
    tcpSocket.end();
    tcpSocket.destroy();
  });

  ws.on('error', (err: Error) => {
    cleanupTimers();
    console.error(`ws error from ${remoteAddress}: ${err.message}`);
    tcpSocket.destroy();
  });

  heartbeatInterval = setInterval(() => {
    if (ws.readyState !== ws.OPEN) {
      return;
    }

    if (awaitingPong) {
      console.warn(`ws heartbeat timeout from ${remoteAddress}`);
      ws.close(1001, 'WebSocket heartbeat timeout');
      return;
    }

    awaitingPong = true;
    ws.ping();
  }, wsHeartbeatMs);

  idleCheckInterval = setInterval(() => {
    if (ws.readyState !== ws.OPEN) {
      return;
    }

    if (Date.now() - lastActivityAt < idleTimeoutMs) {
      return;
    }

    console.log(`closing idle ws session from ${remoteAddress} after ${idleTimeoutMs}ms`);
    ws.close(1001, 'Session idle timeout');
  }, Math.min(wsHeartbeatMs, 60_000));
});

server.on('upgrade', (req, socket, head) => {
  if (req.url !== '/ws') {
    socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
    socket.destroy();
    return;
  }

  if (!isOriginAllowed(req.headers.origin)) {
    socket.write('HTTP/1.1 403 Forbidden\r\n\r\n');
    socket.destroy();
    return;
  }

  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit('connection', ws, req);
  });
});

server.listen(listenPort, listenHost, () => {
  console.log(
    `WS gateway listening on ${listenHost}:${listenPort}, proxying to ${mudHost}:${mudPort} (heartbeat=${wsHeartbeatMs}ms idleTimeout=${idleTimeoutMs}ms)`
  );
});
