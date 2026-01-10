export function toInt(value: number | undefined, fallback = 0): number {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return fallback;
  }
  return Math.trunc(value);
}

export function rollDice(times: number, size: number): number {
  if (times <= 0 || size <= 0) {
    return 0;
  }
  let total = 0;
  for (let i = 0; i < times; i += 1) {
    total += Math.floor(Math.random() * size) + 1;
  }
  return total;
}
