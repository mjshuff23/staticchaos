import type { BridgeAction, BridgeResult } from './types';
import { encodeLine } from './utils';

function actionLine(action: BridgeAction): string | null {
  switch (action.type) {
    case 'msg':
      return `MSG ${encodeLine(action.text)}`;
    case 'room':
      return `ROOM ${encodeLine(action.text)}`;
    case 'wait':
      return `WAIT ${Math.trunc(action.ticks)}`;
    case 'add':
      return `ADD ${action.field} ${Math.trunc(action.value)}`;
    case 'set':
      return `SET ${action.field} ${Math.trunc(action.value)}`;
    default:
      return null;
  }
}

export function buildResponseLines(result: BridgeResult): string[] {
  if (typeof result === 'string') {
    return result.length ? ['OK', `MSG ${encodeLine(result)}`] : ['OK'];
  }

  const lines = ['OK'];
  const actions = result.actions || [];
  for (const action of actions) {
    const line = actionLine(action);
    if (line) {
      lines.push(line);
    }
  }
  return lines;
}
