export type Parsed = { ok: true; argv: string[] } | { ok: false; error: string };

/** Splits a command line into words. Supports 'single' and "double" quotes and backslash escapes. */
export function parseLine(line: string): Parsed {
  const argv: string[] = [];
  let cur = "";
  let started = false;
  let quote: string | null = null;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quote) {
      if (ch === quote) quote = null;
      else if (ch === "\\" && quote === '"' && i + 1 < line.length) cur += line[++i];
      else cur += ch;
    } else if (ch === '"' || ch === "'") {
      quote = ch;
      started = true;
    } else if (ch === "\\" && i + 1 < line.length) {
      cur += line[++i];
      started = true;
    } else if (/\s/.test(ch)) {
      if (started || cur) argv.push(cur);
      cur = "";
      started = false;
    } else {
      cur += ch;
      started = true;
    }
  }
  if (quote) return { ok: false, error: `unterminated ${quote === '"' ? "double" : "single"} quote` };
  if (started || cur) argv.push(cur);
  return { ok: true, argv };
}
