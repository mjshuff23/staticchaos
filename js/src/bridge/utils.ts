export function toArgv(args: string | undefined): string[] {
  if (!args) {
    return [];
  }
  const trimmed = args.trim();
  return trimmed.length ? trimmed.split(/\s+/) : [];
}

export function sanitizeOutput(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\n/g, '\\n')
    .trim();
}
