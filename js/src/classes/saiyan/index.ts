import type { Handler } from '../../bridge/types';
import { focusHandler, rageHandler } from './power';
import { techniqueHandler } from './technique';

export const saiyanHandlers: Record<string, Handler> = {
  technique: (req, argv) => techniqueHandler(req, argv),
  rage: (req) => rageHandler(req),
  focus: (req, argv) => focusHandler(req, argv),
};
