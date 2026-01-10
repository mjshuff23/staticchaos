import type { BridgeRequest, BridgeResult, BridgeField } from '../../bridge/types';
import { addField } from '../../bridge/actions';
import { rollDice, toInt } from '../../utils/math';
import { isPrefix } from '../../utils/text';
import { CLASS_SAIYAN } from './constants';

const MAX_MOVE_DRAIN = 1000;

export function rageHandler(req: BridgeRequest): BridgeResult {
  if (req.is_npc) {
    return '';
  }
  if (req.class_id !== CLASS_SAIYAN) {
    return '';
  }

  const power = toInt(req.power);
  const powerMax = toInt(req.power_max);
  const move = toInt(req.move);
  const body = toInt(req.body);
  const spirit = toInt(req.spirit);

  if (power >= powerMax) {
    return 'You are already at full power!';
  }

  const gain =
    rollDice(body, Math.trunc(spirit / 2)) + Math.trunc(powerMax / 100);
  const gain2 = gain * gain;
  const moveCost = Math.min(Math.trunc(gain / 10), MAX_MOVE_DRAIN);

  if (move <= moveCost) {
    return 'Your body is too exhausted for you to power up.';
  }

  return {
    actions: [
      { type: 'msg', text: 'As your rage builds, your inner power increases!' },
      {
        type: 'room',
        text: '$n screams with rage, and $s body ripples with power!',
      },
      addField('power', gain),
      addField('speed', gain2),
      addField('strength', gain2),
      addField('aegis', gain2),
      addField('move', -moveCost),
      { type: 'wait', ticks: 4 },
    ],
  };
}

export function focusHandler(
  req: BridgeRequest,
  argv: string[]
): BridgeResult {
  if (req.is_npc) {
    return '';
  }
  if (req.class_id !== CLASS_SAIYAN) {
    return 'Huh?';
  }

  const rawAbility = argv[0] ?? '';
  const ability = rawAbility.toLowerCase();
  const rawAmount = argv[1] ?? '';

  if (!ability || rawAbility.length < 2 || !rawAmount) {
    return 'You must specify what ability you wish to focus, and how much power.';
  }

  const increase = Number.parseInt(rawAmount, 10);
  if (!Number.isFinite(increase) || increase === 0) {
    return 'How much power do you want to focus?';
  }
  if (increase < 0) {
    return 'Uhhhh why?';
  }

  const power = toInt(req.power);
  if (increase >= power) {
    return "You don't have that much power.";
  }

  let field: BridgeField | null = null;
  let roomMessage = '';

  if (isPrefix(ability, 'strength')) {
    field = 'strength';
    roomMessage = "$n's muscles bulge with strength.";
  } else if (isPrefix(ability, 'speed')) {
    field = 'speed';
    roomMessage = "$n blurs as their movements speed up.";
  } else if (isPrefix(ability, 'aegis')) {
    field = 'aegis';
    roomMessage = 'The aegis around $n flares with renewed energy.';
  } else {
    return 'Focus on what?';
  }

  return {
    actions: [
      addField(field, increase),
      addField('power', -increase),
      { type: 'room', text: roomMessage },
      {
        type: 'msg',
        text: `You channel ${increase} points of power into your ${rawAbility}.`,
      },
      { type: 'wait', ticks: 4 },
    ],
  };
}
