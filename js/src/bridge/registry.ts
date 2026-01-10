import type { Handler } from './types';
import { coreCommands } from './commands/core';
import { techniqueHandler } from '../classes/saiyan';

const handlers: Record<string, Handler> = {
  ...coreCommands,
  technique: (req) => techniqueHandler(req),
};

export { handlers };
