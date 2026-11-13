"use client";

import { AnimatePresence } from "motion/react";
import { useImperativeHandle, useMemo, useState } from "react";
import { StorageExplorer } from "@/components/apps/storage-explorer-lazy";
import { TerminalApp } from "@/components/apps/terminal-app";
import { buildVfs } from "@/lib/portfolio/vfs";
import { AboutWindow, ContactWindow, ProjectsWindow, ProjectWindow, StackWindow, type DeskData } from "./desk-content";
import { DeskWindow } from "./desk-window";
import { icons } from "./os-icons";
import { MenuList, type MenuItem } from "./os-menu";
import styles from "./os.module.css";

type Win = { id: string; slot: number; collapsed: boolean; zoomed: boolean; origin: string };

export type OsControl = { open: (id: string) => void; closeTop: () => void };

const APPS: Record<string, { title: string; size?: { w: number; h: number }; flush?: boolean }> = {
  projects: { title: "Projects" },
  stack: { title: "Developer" },
  about: { title: "About Me" },
  contact: { title: "Contact" },
  terminal: { title: "Terminal", size: { w: 600, h: 400 }, flush: true },
  storage: { title: "Storage Explorer: Macintosh HD", size: { w: 800, h: 560 }, flush: true },
  trash: { title: "Trash" },
};

type Icon = { id: string; open: string; label: string; icon: React.ReactNode; fixed?: boolean };
const LEFT: Icon[] = [
  { id: "terminal", open: "terminal", label: "Terminal", icon: icons.terminal },
  { id: "storage", open: "storage", label: "Storage Explorer", icon: icons.explorer },
  { id: "contact", open: "contact", label: "Contact", icon: icons.contact },
];
const RIGHT: Icon[] = [
  { id: "hd", open: "storage", label: "Macintosh HD", icon: icons.disk, fixed: true },
  { id: "projects", open: "projects", label: "Projects", icon: icons.folder },
  { id: "about", open: "about", label: "About Me", icon: icons.doc },
  { id: "stack", open: "stack", label: "Developer", icon: icons.tools },
];

type OsProps = DeskData & {
  /** The scene writes position and size onto this element every frame. */
  elRef: React.RefObject<HTMLDivElement | null>;
  controlRef: React.RefObject<OsControl | null>;
  /** True once the camera is at the screen: the desktop takes pointer input. */
  live: boolean;
  ready: boolean;
  /** Phones: windows fill the screen. */
  compact: boolean;
  reduceMotion: boolean;
  onWindowCount: (n: number) => void;
  onExit: () => void;
};

/** The made-up late-1990s desktop shown on the machine. */
export function OsScreen(props: OsProps) {
  const { projects, stack, about, links, elRef, controlRef, live, ready, compact, reduceMotion, onWindowCount, onExit } = props;
  const [wins, setWins] = useState<Win[]>([]);
  const [trashed, setTrashed] = useState<string[]>([]);
  const [gone, setGone] = useState<string[]>([]);
  const [menu, setMenu] = useState<string | null>(null);
  const [ctx, setCtx] = useState<{ x: number; y: number; items: MenuItem[] } | null>(null);
  const [bootKey, setBootKey] = useState(0);
  // Where focus goes back to when a window closes. A mutable map held in state, not read while rendering.
  const [openers] = useState(() => new Map<string, Element | null>());
  // Stable across renders: the explorer's 3D scene is keyed on this.
  const { owner } = props;
  const input = useMemo(() => ({ owner, projects, stack, about, links }), [owner, projects, stack, about, links]);
  const root = useMemo(() => buildVfs(input), [input]);

  const update = (fn: (w: Win[]) => Win[]) =>
    setWins((w) => {
      const next = fn(w);
      queueMicrotask(() => onWindowCount(next.length));
      return next;
    });

  const open = (id: string, origin = "50% 40%") => {
    openers.set(id, document.activeElement);
    update((w) => [...w.filter((x) => x.id !== id), w.find((x) => x.id === id) ?? { id, slot: w.length % 5, collapsed: false, zoomed: false, origin }]);
  };
  const raise = (id: string) => setWins((w) => (w.at(-1)?.id === id ? w : [...w.filter((x) => x.id !== id), ...w.filter((x) => x.id === id)]));
  const close = (id: string) => {
    update((w) => w.filter((x) => x.id !== id));
    (openers.get(id) as HTMLElement | null)?.focus?.();
  };
  const patch = (id: string, p: Partial<Win>) => setWins((w) => w.map((x) => (x.id === id ? { ...x, ...p } : x)));
  const top = wins.at(-1);
  useImperativeHandle(controlRef, () => ({ open, closeTop: () => top && close(top.id) }));

  const find = (id: string) => projects.find((p) => `project:${p.slug}` === id);
  const titleOf = (id: string) => APPS[id]?.title ?? find(id)?.title ?? id;
  const labelOf = (id: string) => [...LEFT, ...RIGHT].find((i) => i.id === id)?.label ?? id;

  const restart = () => {
    update(() => []);
    setTrashed([]);
    setGone([]);
    setMenu(null);
    setBootKey((k) => k + 1);
  };
  const toTrash = (i: Icon) => {
    setTrashed((t) => [...t, i.id]);
    update((w) => w.filter((x) => x.id !== i.open));
  };
  const emptyTrash = () => {
    setGone((g) => [...g, ...trashed]);
    setTrashed([]);
  };

  const body = (id: string) => {
    if (id === "projects") return <ProjectsWindow projects={projects} onOpen={(slug) => open(`project:${slug}`)} />;
    if (id === "stack") return <StackWindow stack={stack} />;
    if (id === "about") return <AboutWindow about={about} />;
    if (id === "contact") return <ContactWindow links={links} />;
    if (id === "terminal") return <TerminalApp root={root} input={input} onOpen={(t) => open(t)} />;
    if (id === "storage")
      return <StorageExplorer root={root} input={input} compact={compact} reduceMotion={reduceMotion} onLaunch={(t) => open(t)} />;
    if (id === "trash")
      return trashed.length ? (
        <div>
          {trashed.map((t) => (
            <div key={t} className={styles.trashRow}>
              <span>{labelOf(t)}</span>
              <button type="button" className={styles.push} onClick={() => setTrashed((x) => x.filter((y) => y !== t))}>
                Put back
              </button>
            </div>
          ))}
          <p style={{ marginTop: 10, color: "#555" }}>Emptying the Trash removes the icons until you restart the computer.</p>
        </div>
      ) : (
        <p>The Trash is empty. Right-click a desktop icon and choose Move to Trash.</p>
      );
    const p = find(id);
    return p ? <ProjectWindow project={p} /> : null;
  };

  const placeMenu = (e: React.MouseEvent, items: MenuItem[]) => {
    e.preventDefault();
    e.stopPropagation();
    const el = elRef.current;
    const r = el?.getBoundingClientRect();
    const scale = r && el ? r.width / el.offsetWidth : 1;
    setMenu(null);
    setCtx({ x: r ? (e.clientX - r.left) / scale : 0, y: r ? (e.clientY - r.top) / scale : 0, items });
  };

  const hidden = [...trashed, ...gone];
  const iconButton = (i: Icon) => (
    <button
      key={i.id}
      type="button"
      tabIndex={live ? 0 : -1}
      className={styles.icon}
      onClick={() => open(i.open, "50% 20%")}
      onContextMenu={(e) =>
        placeMenu(e, [{ label: "Open", action: () => open(i.open) }, ...(i.fixed ? [] : (["sep", { label: "Move to Trash", action: () => toTrash(i) }] as MenuItem[]))])
      }
    >
      {i.icon}
      <span>{i.label}</span>
    </button>
  );

  const menus: { name: string; label?: React.ReactNode; items: MenuItem[] }[] = [
    {
      name: "System",
      label: icons.mark,
      items: [
        { label: "About This Computer", action: () => open("about") },
        "sep",
        { label: "Terminal", action: () => open("terminal") },
        { label: "Storage Explorer", action: () => open("storage") },
        { label: "Projects", action: () => open("projects") },
        { label: "Contact", action: () => open("contact") },
      ],
    },
    {
      name: "File",
      items: [
        { label: "Open Terminal", action: () => open("terminal") },
        { label: "Close Window", disabled: !top, action: () => top && close(top.id) },
        { label: "Close All Windows", disabled: !wins.length, action: () => update(() => []) },
      ],
    },
    {
      name: "View",
      items: [
        { label: "Zoom Window", disabled: !top || compact, action: () => top && patch(top.id, { zoomed: !top.zoomed }) },
        { label: "Collapse Window", disabled: !top || compact, action: () => top && patch(top.id, { collapsed: !top.collapsed }) },
      ],
    },
    {
      name: "Special",
      items: [
        { label: "Empty Trash", disabled: !trashed.length, action: emptyTrash },
        { label: "Restart", action: restart },
        "sep",
        { label: "Leave the Computer", action: onExit },
      ],
    },
  ];

  return (
    <div
      ref={elRef}
      className={styles.os}
      data-live={live}
      data-ready={ready}
      data-compact={compact}
      role="region"
      aria-label="Computer screen"
      onContextMenu={(e) => placeMenu(e, [{ label: "About This Computer", action: () => open("about") }, { label: "Restart", action: restart }])}
    >
      <div className={styles.menubar}>
        {menus.map((m) => (
          <div key={m.name} className={styles.menuWrap}>
            <button
              type="button"
              className={styles.menuBtn}
              data-open={menu === m.name}
              aria-label={m.label ? m.name : undefined}
              aria-haspopup="menu"
              aria-expanded={menu === m.name}
              tabIndex={live ? 0 : -1}
              onClick={() => setMenu(menu === m.name ? null : m.name)}
              onMouseEnter={() => menu && setMenu(m.name)}
            >
              {m.label ?? m.name}
            </button>
            {menu === m.name ? (
              <>
                <div className={styles.ctxShield} style={{ zIndex: 590 }} onClick={() => setMenu(null)} />
                <MenuList items={m.items} onClose={() => setMenu(null)} />
              </>
            ) : null}
          </div>
        ))}
        <span className={styles.appName}>{top ? titleOf(top.id) : "Desktop"}</span>
        {compact ? (
          <button type="button" className={styles.exit} onClick={onExit}>
            ← Back to the desk
          </button>
        ) : null}
      </div>

      <div className={styles.iconsLeft}>{LEFT.filter((i) => !hidden.includes(i.id)).map(iconButton)}</div>
      <div className={styles.iconsRight}>{RIGHT.filter((i) => !hidden.includes(i.id)).map(iconButton)}</div>
      <div className={styles.trashSlot}>
        <button
          type="button"
          tabIndex={live ? 0 : -1}
          className={styles.icon}
          onClick={() => open("trash", "90% 90%")}
          onContextMenu={(e) =>
            placeMenu(e, [{ label: "Open", action: () => open("trash") }, { label: "Empty Trash", disabled: !trashed.length, action: emptyTrash }])
          }
        >
          {icons.trash(trashed.length > 0)}
          <span>Trash</span>
        </button>
      </div>

      <AnimatePresence>
        {wins.map((w, i) => (
          <DeskWindow
            key={w.id}
            title={titleOf(w.id)}
            slot={w.slot}
            z={10 + i}
            active={w.id === top?.id}
            full={compact}
            collapsed={w.collapsed}
            zoomed={w.zoomed}
            size={APPS[w.id]?.size}
            flush={APPS[w.id]?.flush}
            origin={w.origin}
            bounds={elRef}
            onClose={() => close(w.id)}
            onRaise={() => raise(w.id)}
            onCollapse={() => patch(w.id, { collapsed: !w.collapsed })}
            onZoom={() => patch(w.id, { zoomed: !w.zoomed })}
          >
            {body(w.id)}
          </DeskWindow>
        ))}
      </AnimatePresence>

      {ctx ? (
        <>
          <div
            className={styles.ctxShield}
            onClick={() => setCtx(null)}
            onContextMenu={(e) => {
              e.preventDefault();
              setCtx(null);
            }}
          />
          <MenuList items={ctx.items} onClose={() => setCtx(null)} className={styles.ctx} style={{ left: ctx.x, top: ctx.y }} />
        </>
      ) : null}

      <div key={bootKey} className={styles.boot} aria-hidden="true">
        <div className={styles.bootBox}>
          {icons.mark}
          Starting up…
          <div className={styles.bootBar}>
            <i />
          </div>
        </div>
      </div>
    </div>
  );
}
