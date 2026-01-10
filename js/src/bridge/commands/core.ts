import type { BridgeRequest, Handler } from '../types';

const helpText =
  'JS commands: ping, time, whereami, echo. Use js:<command> in game.';

export const coreCommands: Record<string, Handler> = {
  help: () => helpText,
  ping: () => 'pong',
  time: () => new Date().toISOString(),
  whereami: (req: BridgeRequest) =>
    `You are in room ${typeof req.room === 'number' ? req.room : 'unknown'}.`,
  echo: (req: BridgeRequest) => req.args?.trim() || '(no args)',
};
