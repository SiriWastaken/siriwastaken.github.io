"use client";

import dynamic from "next/dynamic";

/** The explorer (and its scene code) loads only when its window is first opened. */
export const StorageExplorer = dynamic(() => import("./storage-explorer"), {
  ssr: false,
  loading: () => <p style={{ padding: 16, background: "#04060a", color: "#9fb7c4", font: "12px monospace", flex: 1 }}>Mounting Macintosh HD…</p>,
});
