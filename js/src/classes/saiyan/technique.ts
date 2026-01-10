import type { BridgeRequest } from '../../bridge/types';
import { CLASS_SAIYAN, TECH_BITS } from './constants';

const yes = 'x';
const no = ' ';

function hasTech(techBits: number | undefined, bit: number): string {
  if (!techBits) {
    return no;
  }
  return (techBits & bit) !== 0 ? yes : no;
}

export function techniqueHandler(
  req: BridgeRequest,
  argv: string[]
): string {
  if (req.class_id !== CLASS_SAIYAN) {
    return 'Duuuuuh what?';
  }

  const arg = argv[0]?.toLowerCase() ?? '';
  if (!arg) {
    return [
      '',
      'Saiyans can learn the following techniques:',
      'Kiwave      Kibomb      Kibolt      Kiblast     Kiwall',
      'Kikouhou    Masenkou    Kamehameha  Solarflare  Ryuken',
      'Zanzouken   Kaiouken    Flight      Kisense     Battlesense',
      'Hawkeyes    Shunkanidou Kiaihou',
      "Enter 'technique <tech>' to learn one, i.e. 'technique kibolt'",
      "Enter 'technique learned' to see which battle skills you have mastered.",
      "Enter 'techinque cost' to see their costs in primal.",
    ].join('\n');
  }

  if (arg === 'cost') {
    return [
      '',
      'These are the costs of developing Saiyan combat techniques, in primal.',
      'Ki Wave      50  Ki Bomb     50  Ki Bolt     50  Ki Blast    25  Ki Wall     75',
      'Kikouhou    100  Masenkou   125  Kamehameha 200  Solarflare 100  Ryuken     150',
      'Zanzouken   100  Kaiouken   200  Flight      50  Ki Sense   100  Bat. Sense  75',
      'ShunkanIdou 125  Hawkeyes    50  Kiaihou    200',
    ].join('\n');
  }

  if (arg === 'learned') {
    const techBits = req.tech_bits || 0;
    return [
      '',
      '',
      'Saiyan battle techniques learned:',
      `Ki Wave    [${hasTech(techBits, TECH_BITS.KIWAVE)}]  Ki Bomb    [${hasTech(
        techBits,
        TECH_BITS.KIBOMB
      )}]  Ki Bolt    [${hasTech(techBits, TECH_BITS.KIBOLT)}]  Ki Blast  [${hasTech(
        techBits,
        TECH_BITS.KIBLAST
      )}]  Ki Wall    [${hasTech(techBits, TECH_BITS.KIWALL)}]`,
      `Kikouhou   [${hasTech(techBits, TECH_BITS.KIKOUHOU)}]  Masenkouha [${hasTech(
        techBits,
        TECH_BITS.MASENKOUHA
      )}]  Kamehameha [${hasTech(
        techBits,
        TECH_BITS.KAMEHAMEHA
      )}]  Solarflar [${hasTech(
        techBits,
        TECH_BITS.SOLARFIST
      )}]  Ryuken     [${hasTech(techBits, TECH_BITS.RYUKEN)}]`,
      `Zanzouken  [${hasTech(techBits, TECH_BITS.ZANZOUKEN)}]  Kaiouken   [${hasTech(
        techBits,
        TECH_BITS.KAIOUKEN
      )}]  Flight     [${hasTech(techBits, TECH_BITS.FLIGHT)}]  Ki Sense  [${hasTech(
        techBits,
        TECH_BITS.KISENSE
      )}]  Bat. Sense [${hasTech(techBits, TECH_BITS.BATTLESENSE)}]`,
      `Shunkan I. [${hasTech(techBits, TECH_BITS.KIMOVE)}]  Hawkeyes   [${hasTech(
        techBits,
        TECH_BITS.HAWKEYES
      )}]  Kiaihou    [${hasTech(techBits, TECH_BITS.KIAIHOU)}]`,
      '',
    ].join('\n');
  }

  return 'That is not a Saiyan battle technique.';
}
