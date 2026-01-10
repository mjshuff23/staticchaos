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
};

export type Handler = (req: BridgeRequest, argv: string[]) => string;
