import type { PortfolioInput, VNode } from "../portfolio/types.ts";
import { resolve, walk } from "../portfolio/vfs.ts";
import { parseLine } from "./parser.ts";

export type Effect = { type: "open"; target: string } | { type: "clear" };
export type RunResult = { lines: string[]; effects: Effect[]; cwd: VNode };
export type Ctx = { root: VNode; input: PortfolioInput; now: () => Date };

const APP_TARGETS: Record<string, string> = {
  terminal: "terminal",
  storage: "storage",
  explorer: "storage",
  contact: "contact",
  about: "about",
  stack: "stack",
  projects: "projects",
};

const COMMANDS: Record<string, string> = {
  help: "list commands",
  ls: "list a directory (ls [-l] [path])",
  pwd: "print the working directory",
  cd: "change directory (cd [path])",
  tree: "show a directory tree (tree [path])",
  cat: "print a text file (cat <file>)",
  whoami: "who runs this portfolio",
  about: "a short introduction",
  projects: "list my projects",
  open: "open a project or app (open <name>)",
  skills: "technologies I use",
  contact: "where to find me",
  date: "print the date",
  clear: "clear the screen",
  neofetch: "system information",
  echo: "print text",
  history: "show earlier commands",
};
export const COMMAND_NAMES = Object.keys(COMMANDS);

const pad = (s: string, n: number) => (s.length >= n ? s : s + " ".repeat(n - s.length));
const typeMark = (n: VNode) => (n.type === "dir" ? `${n.name}/` : n.name);

function tree(n: VNode, prefix = "", isRoot = true): string[] {
  const lines = isRoot ? [n.type === "dir" && n.parent ? `${n.name}/` : n.name] : [];
  n.children.forEach((c, i) => {
    const last = i === n.children.length - 1;
    lines.push(`${prefix}${last ? "└── " : "├── "}${typeMark(c)}`);
    if (c.type === "dir") lines.push(...tree(c, prefix + (last ? "    " : "│   "), false));
  });
  return lines;
}

/** Finds something `open` can launch: an app word, a project slug or title, or a path. */
function findOpenTarget(ctx: Ctx, cwd: VNode, word: string): string | undefined {
  const w = word.toLowerCase().replace(/\.app$/, "");
  if (APP_TARGETS[w]) return APP_TARGETS[w];
  const byPath = resolve(ctx.root, cwd, word);
  if (byPath?.open) return byPath.open;
  if (byPath?.kind === "project") return `project:${byPath.name}`;
  const p =
    ctx.input.projects.find((x) => x.slug === w) ??
    ctx.input.projects.find((x) => [x.title, x.shortTitle ?? ""].some((t) => t.toLowerCase() === w)) ??
    ctx.input.projects.find((x) => x.slug.includes(w) || x.title.toLowerCase().includes(w));
  return p ? `project:${p.slug}` : undefined;
}

const art = [
  "     .--------.   ",
  "   .'  ______  '. ",
  "  /  .'      '.  \\",
  " |  |  SRI-OS |  |",
  "  \\  '.______.'  /",
  "   '.   ____   .' ",
  "     '-(____)-'   ",
];

export function runCommand(ctx: Ctx, cwd: VNode, line: string, history: string[] = []): RunResult {
  const out: RunResult = { lines: [], effects: [], cwd };
  const say = (...l: string[]) => out.lines.push(...l);
  const parsed = parseLine(line);
  if (!parsed.ok) {
    say(`sh: ${parsed.error}`);
    return out;
  }
  const [cmd, ...args] = parsed.argv;
  if (!cmd) return out;
  const { input } = ctx;
  const flags = args.filter((a) => a.startsWith("-") && a.length > 1);
  const rest = args.filter((a) => !flags.includes(a));

  switch (cmd.toLowerCase()) {
    case "help":
      say("Commands:", ...Object.entries(COMMANDS).map(([k, v]) => `  ${pad(k, 10)}${v}`), "", "Tab completes. Up and down arrows walk through history.");
      break;
    case "pwd":
      say(cwd.path);
      break;
    case "ls": {
      const target = rest[0] ? resolve(ctx.root, cwd, rest[0]) : cwd;
      if (!target) {
        say(`ls: ${rest[0]}: No such file or directory`);
        break;
      }
      if (target.type === "file") {
        say(target.name);
        break;
      }
      if (flags.includes("-l")) say(...target.children.map((c) => `${c.type === "dir" ? "d" : "-"}  ${pad(typeMark(c), 28)}${c.summary}`));
      else say(target.children.map(typeMark).join("  ") || "(empty)");
      break;
    }
    case "cd": {
      const target = resolve(ctx.root, cwd, rest[0] ?? "/");
      if (!target) say(`cd: ${rest[0]}: No such file or directory`);
      else if (target.type !== "dir") say(`cd: ${rest[0]}: Not a directory`);
      else out.cwd = target;
      break;
    }
    case "tree": {
      const target = rest[0] ? resolve(ctx.root, cwd, rest[0]) : cwd;
      if (!target) say(`tree: ${rest[0]}: No such file or directory`);
      else say(...tree(target));
      break;
    }
    case "cat": {
      if (!rest.length) {
        say("usage: cat <file>");
        break;
      }
      for (const a of rest) {
        const f = resolve(ctx.root, cwd, a);
        if (!f) say(`cat: ${a}: No such file or directory`);
        else if (f.type === "dir") say(`cat: ${a}: Is a directory`);
        else say(...(f.content ?? "").split("\n"));
      }
      break;
    }
    case "whoami":
      say(`${input.owner.name}`, input.owner.description, `GitHub: ${input.owner.githubUrl}`);
      break;
    case "about":
      say(...input.about.flatMap((p) => [p, ""]).slice(0, -1));
      break;
    case "projects":
      say(...input.projects.map((p) => `${pad(p.slug, 22)}${pad(p.year, 12)}${pad(p.status, 16)}${p.title}`), "", "open <name> shows one. cd /Projects to browse files.");
      break;
    case "skills":
      for (const g of input.stack) say(`${g.label}:`, ...g.items.map((t) => `  ${t.name}${t.learning ? "  (learning)" : ""}`), "");
      if (out.lines.at(-1) === "") out.lines.pop();
      break;
    case "contact":
      say(...input.links.map((l) => `${pad(l.label, 8)}${l.href}`));
      out.effects.push({ type: "open", target: "contact" });
      break;
    case "date":
      say(ctx.now().toString());
      break;
    case "clear":
      out.effects.push({ type: "clear" });
      break;
    case "echo":
      say(rest.join(" "));
      break;
    case "history":
      say(...history.map((h, i) => `${pad(String(i + 1), 4)}${h}`));
      break;
    case "open": {
      if (!rest[0]) {
        say("usage: open <project | terminal | storage | contact | about | stack | projects>");
        break;
      }
      const target = findOpenTarget(ctx, cwd, rest[0]);
      if (!target) say(`open: ${rest[0]}: nothing by that name. Try: projects`);
      else {
        say(`Opening ${rest[0]}...`);
        out.effects.push({ type: "open", target });
      }
      break;
    }
    case "neofetch": {
      let files = 0;
      walk(ctx.root, (n) => n.type === "file" && files++);
      const langs = input.stack.find((g) => /lang/i.test(g.label))?.items.map((t) => t.name).join(", ");
      const info = [
        `${input.owner.shortName.toLowerCase()}@bondi`,
        "-".repeat(`${input.owner.shortName}@bondi`.length),
        "OS: SRI-OS 1.0 (a made-up Platinum-style desktop)",
        "Host: Bondi Blue CRT, translucent, 15 inch",
        `Projects: ${input.projects.length}`,
        `Files: ${files}`,
        ...(langs ? [`Languages: ${langs}`] : []),
        "Shell: sh (not a real one)",
      ];
      for (let i = 0; i < Math.max(art.length, info.length); i++) say(`${pad(art[i] ?? "", 20)}${info[i] ?? ""}`);
      break;
    }
    default:
      say(`${cmd}: command not found. Try: help`);
  }
  return out;
}

export type Completion = { line: string; options: string[] };

/** Tab completion for the command word, paths and `open` targets. */
export function complete(ctx: Ctx, cwd: VNode, line: string): Completion {
  const m = /^(.*?)(\S*)$/.exec(line)!;
  const [, before, frag] = m;
  const words = before.trim() ? before.trim().split(/\s+/) : [];
  let candidates: string[];
  let prefix = "";
  if (!words.length) candidates = COMMAND_NAMES;
  else {
    const cmd = words[0].toLowerCase();
    if (cmd === "help") candidates = COMMAND_NAMES;
    else if (["ls", "cd", "tree", "cat", "open"].includes(cmd)) {
      const slash = frag.lastIndexOf("/");
      const dirPart = slash >= 0 ? frag.slice(0, slash + 1) : "";
      const dir = dirPart ? resolve(ctx.root, cwd, dirPart) : cwd;
      prefix = dirPart;
      const kids = (dir?.children ?? []).filter((c) => cmd !== "cd" || c.type === "dir");
      candidates = kids.map((c) => (c.type === "dir" ? `${c.name}/` : c.name));
      if (cmd === "open" && !dirPart) candidates.push(...Object.keys(APP_TARGETS), ...ctx.input.projects.map((p) => p.slug));
    } else candidates = [];
  }
  const rest = prefix ? frag.slice(prefix.length) : frag;
  const options = [...new Set(candidates)].filter((c) => c.toLowerCase().startsWith(rest.toLowerCase())).sort();
  if (!options.length) return { line, options: [] };
  let common = options[0];
  for (const o of options) while (!o.toLowerCase().startsWith(common.toLowerCase())) common = common.slice(0, -1);
  const done = options.length === 1 && !common.endsWith("/") ? `${common} ` : common;
  return { line: `${before}${prefix}${done}`, options: options.length > 1 ? options : [] };
}
