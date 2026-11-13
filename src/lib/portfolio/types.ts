import type { Project } from "@/data/types";

/** Everything the desktop apps need, built once on the server from src/data. */
export type PortfolioInput = {
  owner: {
    name: string;
    shortName: string;
    description: string;
    githubUrl: string;
    dmojUrl: string;
    email?: string;
  };
  projects: Project[];
  stack: { label: string; items: { name: string; url: string; usedIn: string; learning?: boolean }[] }[];
  about: readonly string[];
  links: { label: string; href: string }[];
};

export type NodeKind =
  | "volume"
  | "apps"
  | "projects"
  | "developer"
  | "documents"
  | "system"
  | "app"
  | "project"
  | "group"
  | "tech"
  | "doc";

/** One entry of the virtual drive. Shared by the terminal and the storage explorer. */
export type VNode = {
  name: string;
  /** What to call it in labels (a project shows its title, not its slug). */
  label: string;
  type: "dir" | "file";
  kind: NodeKind;
  /** Short line shown in labels and listings. */
  summary: string;
  path: string;
  parent: VNode | null;
  children: VNode[];
  /** Text for files. */
  content?: string;
  /** What opening this node does on the desktop: an app id or `project:<slug>`. */
  open?: string;
};
