"use client";

import { useEffect } from "react";
import styles from "./os.module.css";

export type MenuItem = { label: string; action?: () => void; disabled?: boolean } | "sep";

/** A pop-up list used by the menu bar and the context menu. Escape or an outside click closes it. */
export function MenuList({ items, onClose, className = "", style }: { items: MenuItem[]; onClose: () => void; className?: string; style?: React.CSSProperties }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [onClose]);

  return (
    <ul role="menu" className={`${styles.menuList} ${className}`} style={style}>
      {items.map((it, i) =>
        it === "sep" ? (
          <li key={i} role="separator" className={styles.sep} />
        ) : (
          <li key={it.label} role="none">
            <button
              type="button"
              role="menuitem"
              disabled={it.disabled}
              className={styles.menuItem}
              onClick={() => {
                onClose();
                it.action?.();
              }}
            >
              {it.label}
            </button>
          </li>
        ),
      )}
    </ul>
  );
}
