export function toArgv(args: string | undefined): string[] {
  if (!args) {
    return [];
  }
  const trimmed = args.trim();
  return trimmed.length ? trimmed.split(/\s+/) : [];
}

export function encodeLine(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/\t/g, '\\t')
    .replace(/"/g, '\\"');
}

export function sanitizeError(err: unknown): string {
  const message =
    err instanceof Error ? err.message : String(err ?? 'handler error');
  return encodeLine(message.length ? message : 'handler error');
}
