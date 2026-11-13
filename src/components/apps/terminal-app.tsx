"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import type { PortfolioInput, VNode } from "@/lib/portfolio/types";
import { complete, runCommand, type Ctx } from "@/lib/terminal/terminal";
import styles from "./apps.module.css";

type Line = { kind: "in" | "out" | "dim"; text: string };

const URL_RE = /(https?:\/\/[^\s)]+)/g;

function Linkified({ text }: { text: string }) {
  return (
    <>
      {text.split(URL_RE).map((part, i) =>
        i % 2 ? (
          <a key={i} href={part} target="_blank" rel="noreferrer">
            {part}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}

const banner = (name: string): Line[] => [
  { kind: "dim", text: `SRI-OS Terminal. ${name}'s portfolio, as a drive you can browse.` },
  { kind: "dim", text: "Type help for commands. Tab completes, arrows walk through history." },
  { kind: "out", text: "" },
];

type Props = { root: VNode; input: PortfolioInput; onOpen: (target: string) => void };

/** A small command line over the virtual drive. It never touches a real shell or filesystem. */
export function TerminalApp({ root, input, onOpen }: Props) {
  const ctx = useMemo<Ctx>(() => ({ root, input, now: () => new Date() }), [root, input]);
  const [lines, setLines] = useState<Line[]>(() => banner(input.owner.shortName));
  const [cwd, setCwd] = useState(root);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const cursor = useRef(-1);
  const draft = useRef("");
  const box = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);

  useEffect(() => field.current?.focus({ preventScroll: true }), []);
  useEffect(() => {
    box.current?.scrollTo({ top: box.current.scrollHeight });
  }, [lines]);

  const prompt = (at: VNode) => `${input.owner.shortName.toLowerCase()}@bondi ${at.path} %`;

  const submit = () => {
    const line = value;
    const r = runCommand(ctx, cwd, line, history);
    const clear = r.effects.some((e) => e.type === "clear");
    const added: Line[] = [{ kind: "in", text: `${prompt(cwd)} ${line}` }, ...r.lines.map((text) => ({ kind: "out" as const, text }))];
    setLines((l) => (clear ? [] : [...l, ...added]));
    setCwd(r.cwd);
    if (line.trim()) setHistory((h) => (h.at(-1) === line ? h : [...h, line]));
    cursor.current = -1;
    setValue("");
    for (const e of r.effects) if (e.type === "open") onOpen(e.target);
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      if (!history.length) return;
      if (cursor.current === -1) draft.current = value;
      const next = cursor.current === -1 ? history.length : cursor.current;
      const idx = Math.min(history.length, Math.max(0, next + (e.key === "ArrowUp" ? -1 : 1)));
      cursor.current = idx >= history.length ? -1 : idx;
      setValue(idx >= history.length ? draft.current : history[idx]);
    } else if (e.key === "Tab") {
      e.preventDefault();
      const c = complete(ctx, cwd, value);
      setValue(c.line);
      if (c.options.length) setLines((l) => [...l, { kind: "in", text: `${prompt(cwd)} ${value}` }, { kind: "dim", text: c.options.join("  ") }]);
    } else if (e.ctrlKey && e.key.toLowerCase() === "l") {
      e.preventDefault();
      setLines([]);
    } else if (e.ctrlKey && e.key.toLowerCase() === "c") {
      e.preventDefault();
      setLines((l) => [...l, { kind: "in", text: `${prompt(cwd)} ${value}^C` }]);
      setValue("");
    }
  };

  return (
    <div ref={box} className={styles.term} onClick={() => !getSelection()?.toString() && field.current?.focus()}>
      <div role="log" aria-live="polite" aria-label="Terminal output">
        {lines.map((l, i) => (
          <pre key={i} className={l.kind === "dim" ? styles.dim : undefined}>
            {l.text ? <Linkified text={l.text} /> : "\u00a0"}
          </pre>
        ))}
      </div>
      <label className={styles.promptRow}>
        <span className={styles.prompt}>{prompt(cwd)}</span>
        <input
          ref={field}
          className={styles.input}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKey}
          aria-label="Command"
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
        />
      </label>
    </div>
  );
}
