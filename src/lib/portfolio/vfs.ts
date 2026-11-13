import type { NodeKind, PortfolioInput, VNode } from "./types.ts";

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function node(parent: VNode | null, name: string, type: VNode["type"], kind: NodeKind, summary: string, extra: Partial<VNode> = {}): VNode {
  const n: VNode = {
    name,
    label: name,
    type,
    kind,
    summary,
    parent,
    children: [],
    path: parent ? `${parent.path === "/" ? "" : parent.path}/${name}` : "/",
    ...extra,
  };
  parent?.children.push(n);
  return n;
}

const file = (parent: VNode, name: string, kind: NodeKind, content: string, open?: string) =>
  node(parent, name, "file", kind, content.split("\n")[0].slice(0, 80), { content, open });

const bullets = (items: string[]) => items.map((i) => `  - ${i}`).join("\n");

/** Builds the drive from the real portfolio data. Nothing here is invented content. */
export function buildVfs(d: PortfolioInput): VNode {
  const root = node(null, "Macintosh HD", "dir", "volume", `${d.owner.shortName}'s drive`);

  const apps = node(root, "Applications", "dir", "apps", "Programs on this computer");
  file(apps, "terminal.app", "app", "Terminal\nA small command line over this portfolio. Try: help", "terminal");
  file(apps, "storage.app", "app", "Storage Explorer\nFly through this drive in 3D.", "storage");
  file(apps, "contact.app", "app", "Contact\nWhere to find me.", "contact");

  const projects = node(root, "Projects", "dir", "projects", `${d.projects.length} things I've built`);
  for (const p of d.projects) {
    const dir = node(projects, p.slug, "dir", "project", `${p.year} · ${p.category}`, { open: `project:${p.slug}`, label: p.shortTitle ?? p.title });
    file(
      dir,
      "README.md",
      "doc",
      [
        p.title,
        `${p.year} · ${p.category} · ${p.status}${p.statusNote ? ` (${p.statusNote})` : ""}`,
        "",
        p.summary,
        "",
        `Role: ${p.role}`,
        "",
        "Highlights:",
        bullets(p.highlights),
      ].join("\n"),
      `project:${p.slug}`,
    );
    file(dir, "stack.txt", "doc", ["Built with:", bullets(p.technologies)].join("\n"));
    const links = [
      p.githubUrl && `Code: ${p.githubUrl}`,
      p.liveUrl && `Live: ${p.liveUrl}`,
      p.details && `Write-up: /projects/${p.slug}/`,
      p.sourceNote && p.sourceNote,
    ].filter(Boolean) as string[];
    if (links.length) file(dir, "links.txt", "doc", links.join("\n"));
    const det = p.details;
    if (det) {
      file(dir, "overview.md", "doc", ["Overview", "", ...det.overview].join("\n"));
      if (det.problem) file(dir, "problem.md", "doc", ["Problem", "", ...det.problem].join("\n"));
      file(dir, "architecture.md", "doc", ["Architecture", "", ...det.architecture].join("\n"));
      file(dir, "challenges.md", "doc", ["Challenges", "", ...det.challenges.flatMap((c) => [c.title, `  ${c.body}`, ""])].join("\n"));
      if (det.learned) file(dir, "learned.md", "doc", ["What I learned", "", ...det.learned].join("\n"));
    }
  }

  const dev = node(root, "Developer", "dir", "developer", "Languages, frameworks and tools");
  for (const g of d.stack) {
    const gd = node(dev, g.label, "dir", "group", `${g.items.length} items`);
    for (const t of g.items) {
      file(gd, `${slug(t.name)}.txt`, "tech", [`${t.name}${t.learning ? " (learning)" : ""}`, t.usedIn, t.url].join("\n"));
    }
  }

  const docs = node(root, "Documents", "dir", "documents", "Writing about me");
  file(docs, "about.txt", "doc", d.about.join("\n\n"), "about");
  file(docs, "links.txt", "doc", d.links.map((l) => `${l.label}: ${l.href}`).join("\n"), "contact");

  const sys = node(root, "System", "dir", "system", "How this machine and site work");
  file(
    sys,
    "about-this-computer.txt",
    "doc",
    [
      "A fictional 1998-style computer on a real desk.",
      "",
      "The desk is a Three.js scene; the screen is live HTML mapped onto it.",
      "Built with Next.js (static export), React, Tailwind CSS and Three.js.",
      "Every project, book, frame and file here is generated from src/data.",
    ].join("\n"),
  );
  const arch = node(sys, "Architecture", "dir", "group", "System diagrams from my projects");
  for (const p of d.projects) {
    if (!p.flow) continue;
    const steps = p.flow.steps.map((s, i) => `${i + 1}. ${s.label} - ${s.detail}`);
    if (p.flow.aside) steps.push(`+  ${p.flow.aside.label} - ${p.flow.aside.detail}`);
    file(arch, `${p.slug}.flow`, "doc", [p.flow.caption, "", ...steps].join("\n"), `project:${p.slug}`);
  }
  return root;
}

export function walk(n: VNode, fn: (n: VNode) => void) {
  fn(n);
  n.children.forEach((c) => walk(c, fn));
}

/** Resolves `.`, `..`, `~`, absolute and relative paths. Name matching ignores case, like HFS. */
export function resolve(root: VNode, cwd: VNode, input: string): VNode | undefined {
  let cur = input.startsWith("/") || input.startsWith("~") ? root : cwd;
  for (const part of input.replace(/^~/, "").split("/")) {
    if (!part || part === ".") continue;
    if (part === "..") {
      cur = cur.parent ?? cur;
      continue;
    }
    if (cur.type !== "dir") return undefined;
    const next = cur.children.find((c) => c.name.toLowerCase() === part.toLowerCase());
    if (!next) return undefined;
    cur = next;
  }
  return cur;
}
