export function isPrefix(input: string, target: string): boolean {
  if (!input) {
    return false;
  }
  if (input.length > target.length) {
    return false;
  }
  return target.toLowerCase().startsWith(input.toLowerCase());
}
