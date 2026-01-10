import type { Handler } from './types';
import { coreCommands } from './commands/core';
import { saiyanHandlers } from '../classes/saiyan';

const handlers: Record<string, Handler> = {
  ...coreCommands,
  ...saiyanHandlers,
};

export { handlers };
