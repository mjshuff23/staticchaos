export type BridgeRequest = {
  command?: string;
  args?: string;
  player?: string;
  room?: number;
  trust?: number;
  is_npc?: number;
  class_id?: number;
  tech_bits?: number;
  primal?: number;
  power?: number;
  power_max?: number;
  speed?: number;
  speed_max?: number;
  strength?: number;
  strength_max?: number;
  aegis?: number;
  aegis_max?: number;
  move?: number;
  max_move?: number;
  body?: number;
  spirit?: number;
};

export type BridgeField =
  | 'power'
  | 'speed'
  | 'strength'
  | 'aegis'
  | 'move'
  | 'primal';

export type BridgeAction =
  | { type: 'msg'; text: string }
  | { type: 'room'; text: string }
  | { type: 'wait'; ticks: number }
  | { type: 'add'; field: BridgeField; value: number }
  | { type: 'set'; field: BridgeField; value: number };

export type BridgeResult = string | { actions: BridgeAction[] };

export type Handler = (req: BridgeRequest, argv: string[]) => BridgeResult;
