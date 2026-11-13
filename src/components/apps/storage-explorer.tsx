"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { PortfolioInput, VNode } from "@/lib/portfolio/types";
import { createExplorer, type Explorer } from "./explorer-scene";
import styles from "./apps.module.css";

const KIND_COLOR: Record<string, string> = {
  volume: "#6fd3e6",
  apps: "#f2a93b",
  app: "#f2a93b",
  projects: "#3fb6a8",
  project: "#3fb6a8",
  developer: "#8fd694",
  group: "#8fd694",
  tech: "#8fd694",
  documents: "#e8e0cc",
  doc: "#e8e0cc",
  system: "#9aa7b4",
};

const KIND_NAME: Record<string, string> = {
  volume: "Volume",
  apps: "Programs",
  app: "Program",
  projects: "Projects",
  project: "Project",
  developer: "Developer tools",
  group: "Group",
  tech: "Technology",
  documents: "Documents",
  doc: "Document",
  system: "System",
};

type Props = {
  root: VNode;
  input: PortfolioInput;
  compact: boolean;
  reduceMotion: boolean;
  /** Opens an app or a project in a desktop window. */
  onLaunch: (target: string) => void;
};

/** The drive as a place: fly through the real portfolio tree in 3D, or use the list beside it. */
export default function StorageExplorer({ root, input, compact, reduceMotion, onLaunch }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const labels = useRef<HTMLDivElement>(null);
  const scene = useRef<Explorer | null>(null);
  const [focus, setFocus] = useState<VNode>(root);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!canvas.current || !labels.current) return;
    try {
      scene.current = createExplorer({ canvas: canvas.current, labels: labels.current, root, reduceMotion, onSelect: setFocus });
    } catch (err) {
      console.warn("Storage Explorer 3D view unavailable:", err);
      queueMicrotask(() => setFailed(true)); // WebGL is unavailable; the list still browses the drive.
      return;
    }
    return () => {
      scene.current?.dispose();
      scene.current = null;
    };
  }, [root, reduceMotion]);
  useEffect(() => scene.current?.focus(focus), [focus]);

  const trail: VNode[] = [];
  for (let n: VNode | null = focus; n; n = n.parent) trail.unshift(n);
  const list = focus.type === "dir" && focus.children.length ? focus.children : (focus.parent?.children ?? []);
  const slug = focus.open?.startsWith("project:") ? focus.open.slice(8) : undefined;
  const project = slug ? input.projects.find((p) => p.slug === slug) : undefined;

  return (
    <div className={styles.xroot} data-compact={compact}>
      <div className={styles.xbar}>
        <button type="button" className={styles.xbtn} disabled={!focus.parent} onClick={() => focus.parent && setFocus(focus.parent)}>
          ← Back
        </button>
        <button type="button" className={styles.xbtn} disabled={focus === root} onClick={() => setFocus(root)}>
          Overview
        </button>
        <nav className={styles.crumbs} aria-label="Location">
          {trail.map((n, i) => (
            <span key={n.path}>
              {i ? " › " : ""}
              <button type="button" onClick={() => setFocus(n)} aria-current={n === focus ? "location" : undefined}>
                {n.label}
              </button>
            </span>
          ))}
        </nav>
      </div>

      <div className={styles.view}>
        {failed ? <p className={styles.nogl}>3D view unavailable here. The list still browses the drive.</p> : <canvas ref={canvas} aria-hidden="true" />}
        <div ref={labels} className={styles.labels} aria-hidden="true" />
        <section className={styles.panel} aria-label="Selected item">
          <h3>{focus.label}</h3>
          <p>
            {KIND_NAME[focus.kind]} · {focus.path}
            {focus.type === "dir" ? ` · ${focus.children.length} item${focus.children.length === 1 ? "" : "s"}` : ""}
          </p>
          {project ? <p>{project.summary}</p> : focus.type === "dir" ? <p>{focus.summary}</p> : null}
          {focus.type === "file" && focus.content ? <pre>{focus.content}</pre> : null}
          <div className={styles.row}>
            {project?.details ? <Link href={`/projects/${project.slug}`}>Open project page →</Link> : null}
            {focus.open ? (
              <button type="button" className={styles.xbtn} onClick={() => onLaunch(focus.open!)}>
                {focus.open.startsWith("project:") ? "Quick view" : "Open"}
              </button>
            ) : null}
          </div>
        </section>
      </div>

      <div className={styles.side}>
        <h4>{focus.type === "dir" ? "Contents" : "Beside it"}</h4>
        {list.map((n) => (
          <button key={n.path} type="button" aria-current={n === focus ? "true" : undefined} onClick={() => setFocus(n)}>
            <span className={styles.kind} style={{ "--k": KIND_COLOR[n.kind] } as React.CSSProperties} aria-hidden="true" />
            {n.label}
            {n.type === "dir" ? "/" : ""}
          </button>
        ))}
      </div>
    </div>
  );
}
