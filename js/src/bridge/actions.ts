import type { BridgeField, BridgeAction } from './types';

export function addField(
  field: BridgeField,
  value: number
): BridgeAction {
  return { type: 'add', field, value };
}

export function setField(
  field: BridgeField,
  value: number
): BridgeAction {
  return { type: 'set', field, value };
}
