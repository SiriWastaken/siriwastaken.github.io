import assert from "node:assert/strict";
import { test } from "node:test";
import type { PortfolioInput } from "../portfolio/types.ts";
import { buildVfs, resolve } from "../portfolio/vfs.ts";
import { parseLine } from "./parser.ts";
import { complete, runCommand, type Ctx } from "./terminal.ts";

const project = (slug: string, extra = {}) => ({
  slug,
  title: `Title ${slug}`,
  year: "2026",
  category: "Tool",
  status: "completed" as const,
  tier: "flagship" as const,
  summary: `Summary of ${slug}.`,
  technologies: ["TypeScript"],
  role: "Solo",
  highlights: ["One", "Two"],
  ...extra,
});

const input: PortfolioInput = {
  owner: { name: "Test Owner", shortName: "Test", description: "A tester.", githubUrl: "https://github.com/x", dmojUrl: "https://dmoj.ca/x" },
  projects: [
    project("alpha", {
      githubUrl: "https://github.com/x/alpha",
      flow: { caption: "How data moves", steps: [{ label: "A", detail: "first" }, { label: "B", detail: "second" }] },
      details: { overview: ["Over."], role: ["r"], architecture: ["Arch."], challenges: [{ title: "Hard", body: "Very." }] },
    }),
    project("beta"),
  ],
  stack: [
    { label: "Languages", items: [{ name: "TypeScript", url: "https://ts", usedIn: "Everything" }, { name: "Swift", url: "https://s", usedIn: "Learning", learning: true }] },
  ],
  about: ["Paragraph one.", "Paragraph two."],
  links: [{ label: "GitHub", href: "https://github.com/x" }],
};

const root = buildVfs(input);
const ctx: Ctx = { root, input, now: () => new Date("2026-01-02T03:04:05Z") };
const run = (line: string, cwd = root) => runCommand(ctx, cwd, line);

test("parser: words, quotes, escapes", () => {
  assert.deepEqual(parseLine("ls -l /Projects"), { ok: true, argv: ["ls", "-l", "/Projects"] });
  assert.deepEqual(parseLine(`echo "a  b" 'c d' e\\ f`), { ok: true, argv: ["echo", "a  b", "c d", "e f"] });
  assert.deepEqual(parseLine(`echo ""`), { ok: true, argv: ["echo", ""] });
  assert.deepEqual(parseLine("   "), { ok: true, argv: [] });
  assert.equal(parseLine(`echo "oops`).ok, false);
});

test("vfs: structure comes from the data", () => {
  assert.deepEqual(root.children.map((c) => c.name), ["Applications", "Projects", "Developer", "Documents", "System"]);
  assert.deepEqual(resolve(root, root, "/Projects")!.children.map((c) => c.name), ["alpha", "beta"]);
  assert.ok(resolve(root, root, "/projects/ALPHA/readme.md"), "case-insensitive");
  assert.ok(resolve(root, root, "/Projects/alpha/architecture.md"));
  assert.equal(resolve(root, root, "/Projects/beta/architecture.md"), undefined, "no details, no file");
  assert.ok(resolve(root, root, "/System/Architecture/alpha.flow"));
  assert.equal(resolve(root, root, "/System/Architecture/beta.flow"), undefined);
  assert.equal(resolve(root, root, "/Projects/alpha/..")!.name, "Projects");
  assert.equal(resolve(root, root, "..")!.name, "Macintosh HD", "root has no parent");
});

test("pwd / cd / ls", () => {
  assert.deepEqual(run("pwd").lines, ["/"]);
  const r = run("cd Projects/alpha");
  assert.equal(r.cwd.path, "/Projects/alpha");
  assert.match(run("ls", r.cwd).lines[0], /README\.md/);
  assert.match(run("cd nope").lines[0], /No such file/);
  assert.match(run("cd /Documents/about.txt").lines[0], /Not a directory/);
  assert.equal(run("cd").cwd, root);
  assert.match(run("ls -l /Developer").lines[0], /^d {2}Languages\//);
  assert.match(run("ls /nope").lines[0], /No such file/);
});

test("tree and cat", () => {
  const t = run("tree /Projects/alpha").lines;
  assert.equal(t[0], "alpha/");
  assert.ok(t.some((l) => l.includes("README.md")));
  assert.match(run("cat /Documents/about.txt").lines.join("\n"), /Paragraph one\.[\s\S]*Paragraph two\./);
  assert.match(run("cat /Projects").lines[0], /Is a directory/);
  assert.match(run("cat").lines[0], /usage/);
  assert.match(run("cat /System/Architecture/alpha.flow").lines.join("\n"), /1\. A - first/);
});

test("info commands", () => {
  assert.match(run("whoami").lines[0], /Test Owner/);
  assert.equal(run("about").lines.filter(Boolean).length, 2);
  assert.equal(run("projects").lines.filter((l) => l.startsWith("alpha") || l.startsWith("beta")).length, 2);
  assert.ok(run("skills").lines.some((l) => l.includes("Swift") && l.includes("(learning)")));
  assert.match(run("contact").lines[0], /GitHub/);
  assert.deepEqual(run("contact").effects, [{ type: "open", target: "contact" }]);
  assert.match(run("date").lines[0], /2026/);
  assert.deepEqual(run("clear").effects, [{ type: "clear" }]);
  assert.ok(run("neofetch").lines.some((l) => l.includes("Projects: 2")));
  assert.equal(run("echo hi there").lines[0], "hi there");
  assert.equal(run("help").lines[0], "Commands:");
});

test("open: apps, projects, paths", () => {
  assert.deepEqual(run("open storage").effects, [{ type: "open", target: "storage" }]);
  assert.deepEqual(run("open terminal.app").effects, [{ type: "open", target: "terminal" }]);
  assert.deepEqual(run("open alpha").effects, [{ type: "open", target: "project:alpha" }]);
  assert.deepEqual(run(`open "Title beta"`).effects, [{ type: "open", target: "project:beta" }]);
  assert.deepEqual(run("open /Projects/beta").effects, [{ type: "open", target: "project:beta" }]);
  assert.match(run("open nothing").lines[0], /nothing by that name/);
  assert.match(run("open").lines[0], /usage/);
});

test("errors are handled", () => {
  assert.match(run("frobnicate").lines[0], /command not found/);
  assert.match(run(`echo "x`).lines[0], /unterminated/);
  assert.deepEqual(run("").lines, []);
  assert.deepEqual(run("rm -rf /").lines.length, 1, "no shell: nothing is executed");
});

test("history", () => {
  assert.deepEqual(run("history").lines, []);
  assert.equal(runCommand(ctx, root, "history", ["ls", "pwd"]).lines.length, 2);
});

test("tab completion", () => {
  assert.equal(complete(ctx, root, "ne").line, "neofetch ");
  assert.deepEqual(complete(ctx, root, "c").options.sort(), ["cat", "cd", "clear", "contact"]);
  assert.equal(complete(ctx, root, "cd Proj").line, "cd Projects/");
  assert.equal(complete(ctx, root, "cat /Projects/alpha/RE").line, "cat /Projects/alpha/README.md ");
  assert.equal(complete(ctx, root, "open al").line, "open alpha ");
  assert.equal(complete(ctx, root, "open sto").line, "open storage ");
  assert.deepEqual(complete(ctx, root, "cd /Projects/a").options, []);
  assert.deepEqual(complete(ctx, root, "zzz").options, []);
  assert.deepEqual(complete(ctx, root, "ls /").options.length, 5);
});
