"use client";

import { motion, useDragControls, useMotionValue } from "motion/react";
import { useEffect, useRef } from "react";
import styles from "./os.module.css";

type DeskWindowProps = {
  title: string;
  /** Cascade position, 0-4. */
  slot: number;
  z: number;
  active: boolean;
  /** Small viewports: the window fills the whole screen instead of floating. */
  full: boolean;
  collapsed: boolean;
  zoomed: boolean;
  /** Fixed size for apps; content windows size themselves. */
  size?: { w: number; h: number };
  /** Apps manage their own padding and scrolling. */
  flush?: boolean;
  origin: string;
  bounds: React.RefObject<HTMLElement | null>;
  onClose: () => void;
  onRaise: () => void;
  onCollapse: () => void;
  onZoom: () => void;
  children: React.ReactNode;
};

export function DeskWindow({ title, slot, z, active, full, collapsed, zoomed, size, flush, origin, bounds, onClose, onRaise, onCollapse, onZoom, children }: DeskWindowProps) {
  const controls = useDragControls();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Focus the window, unless an app inside it (the terminal's input) already took focus.
  useEffect(() => {
    const el = ref.current;
    if (el && !el.contains(document.activeElement)) el.focus({ preventScroll: true });
  }, []);
  useEffect(() => {
    if (zoomed) {
      x.set(0);
      y.set(0);
    }
  }, [zoomed, x, y]);

  const cls = [styles.win, full ? styles.winFull : "", zoomed && !full ? styles.winZoomed : "", collapsed ? styles.winCollapsed : "", flush ? styles.winFlush : "", active ? "" : styles.winInactive]
    .filter(Boolean)
    .join(" ");

  return (
    <motion.div
      ref={ref}
      role="dialog"
      aria-label={title}
      tabIndex={-1}
      className={cls}
      style={{
        x,
        y,
        transformOrigin: origin,
        ...(full ? {} : { zIndex: z, left: 140 + slot * 36, top: 44 + slot * 30 }),
        ...(size ? ({ "--w": `${size.w}px`, "--h": collapsed ? "auto" : `${size.h}px` } as React.CSSProperties) : {}),
      }}
      initial={{ opacity: 0, scale: 0.82 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
      drag={!full && !zoomed}
      dragControls={controls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={bounds}
      onPointerDown={onRaise}
    >
      <div className={styles.titlebar} onPointerDown={(e) => controls.start(e)} onDoubleClick={onCollapse}>
        <button type="button" className={styles.box} aria-label={`Close ${title}`} onClick={onClose} onPointerDown={(e) => e.stopPropagation()} />
        <span className={styles.title}>{title}</span>
        {full ? null : (
          <>
            <button type="button" className={`${styles.box} ${styles.boxZoom}`} aria-label={zoomed ? "Restore window size" : "Zoom window"} onClick={onZoom} onPointerDown={(e) => e.stopPropagation()} />
            <button type="button" className={`${styles.box} ${styles.boxShade}`} aria-label={collapsed ? "Expand window" : "Collapse window"} aria-pressed={collapsed} onClick={onCollapse} onPointerDown={(e) => e.stopPropagation()} />
          </>
        )}
      </div>
      {collapsed ? null : <div className={styles.winBody}>{children}</div>}
    </motion.div>
  );
}
