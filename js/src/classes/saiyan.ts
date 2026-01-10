import type { BridgeRequest } from '../bridge/types';

const CLASS_SAIYAN = 1;

const S_KIWAVE = 2;
const S_KIBOMB = 8;
const S_KIBOLT = 1;
const S_KIBLAST = 4;
const S_KIWALL = 65536;
const S_KIKOUHOU = 256;
const S_MASENKOUHA = 512;
const S_KAMEHAMEHA = 128;
const S_SOLARFIST = 1024;
const S_RYUKEN = 131072;
const S_ZANZOUKEN = 16384;
const S_KAIOUKEN = 32768;
const S_FLIGHT = 64;
const S_KISENSE = 32;
const S_BATTLESENSE = 8192;
const S_KIMOVE = 16;
const S_HAWKEYES = 2048;
const S_KIAIHOU = 262144;

const yes = 'x';
const no = ' ';

function hasTech(techBits: number | undefined, bit: number): string {
  if (!techBits) {
    return no;
  }
  return (techBits & bit) !== 0 ? yes : no;
}

export function techniqueHandler(req: BridgeRequest): string {
  if (req.class_id !== CLASS_SAIYAN) {
    return 'Duuuuuh what?';
  }

  const arg = req.args?.trim().toLowerCase() || '';
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
      `Ki Wave    [${hasTech(techBits, S_KIWAVE)}]  Ki Bomb    [${hasTech(
        techBits,
        S_KIBOMB
      )}]  Ki Bolt    [${hasTech(techBits, S_KIBOLT)}]  Ki Blast  [${hasTech(
        techBits,
        S_KIBLAST
      )}]  Ki Wall    [${hasTech(techBits, S_KIWALL)}]`,
      `Kikouhou   [${hasTech(techBits, S_KIKOUHOU)}]  Masenkouha [${hasTech(
        techBits,
        S_MASENKOUHA
      )}]  Kamehameha [${hasTech(
        techBits,
        S_KAMEHAMEHA
      )}]  Solarflar [${hasTech(techBits, S_SOLARFIST)}]  Ryuken     [${hasTech(
        techBits,
        S_RYUKEN
      )}]`,
      `Zanzouken  [${hasTech(techBits, S_ZANZOUKEN)}]  Kaiouken   [${hasTech(
        techBits,
        S_KAIOUKEN
      )}]  Flight     [${hasTech(techBits, S_FLIGHT)}]  Ki Sense  [${hasTech(
        techBits,
        S_KISENSE
      )}]  Bat. Sense [${hasTech(techBits, S_BATTLESENSE)}]`,
      `Shunkan I. [${hasTech(techBits, S_KIMOVE)}]  Hawkeyes   [${hasTech(
        techBits,
        S_HAWKEYES
      )}]  Kiaihou    [${hasTech(techBits, S_KIAIHOU)}]`,
      '',
    ].join('\n');
  }

  return 'That is not a Saiyan battle technique.';
}
