/** Desktop icons, drawn for this project. 32x32, a limited grey/blue palette like a 1998 icon set. */
const S = { viewBox: "0 0 32 32", "aria-hidden": true } as const;
const line = { stroke: "#1a1a1a", strokeWidth: 1.2, strokeLinejoin: "round" as const };

export const icons = {
  disk: (
    <svg {...S}>
      <rect x="3" y="9" width="26" height="15" rx="2" fill="#c9ced4" {...line} />
      <rect x="3" y="9" width="26" height="5" rx="2" fill="#eef1f4" {...line} />
      <rect x="6" y="18" width="14" height="2.5" fill="#6c7580" />
      <circle cx="25" cy="19" r="1.6" fill="#3fb6a8" stroke="#1a1a1a" strokeWidth="0.8" />
    </svg>
  ),
  folder: (
    <svg {...S}>
      <path d="M3 9a2 2 0 0 1 2-2h7l3 3h12a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="#9fb7d2" {...line} />
      <path d="M3 13h26v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="#c5d6e8" {...line} />
    </svg>
  ),
  tools: (
    <svg {...S}>
      <path d="M3 9a2 2 0 0 1 2-2h7l3 3h12a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="#a9c9b0" {...line} />
      <path d="M3 13h26v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="#cfe3d3" {...line} />
      <path d="M12 16l-3 3 3 3M20 16l3 3-3 3" fill="none" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  doc: (
    <svg {...S}>
      <path d="M8 3h12l6 6v20H8z" fill="#fbfbfb" {...line} />
      <path d="M20 3v6h6" fill="#d7dbe0" {...line} />
      <path d="M11 14h12M11 18h12M11 22h8" stroke="#6c7580" strokeWidth="1.2" />
    </svg>
  ),
  terminal: (
    <svg {...S}>
      <rect x="3" y="5" width="26" height="22" rx="3" fill="#cfd5db" {...line} />
      <rect x="6" y="8" width="20" height="14" rx="1.5" fill="#0b1410" {...line} />
      <path d="M9 12l3 2.5L9 17" fill="none" stroke="#9be8a8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 17h5" stroke="#9be8a8" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="11" y="24" width="10" height="1.6" fill="#8d96a0" />
    </svg>
  ),
  explorer: (
    <svg {...S}>
      <rect x="3" y="4" width="26" height="24" rx="3" fill="#0a1219" {...line} />
      <path d="M16 8l5 3v6l-5 3-5-3v-6z" fill="#3fb6a8" stroke="#d8fbff" strokeWidth="0.9" strokeLinejoin="round" />
      <path d="M16 8v12M11 11l10 6M21 11l-10 6" stroke="#d8fbff" strokeWidth="0.6" />
      <circle cx="8" cy="23" r="1.8" fill="#f2a93b" />
      <circle cx="24" cy="23" r="1.8" fill="#8fd694" />
      <path d="M8 23l8-6 8 6" stroke="#4a6572" strokeWidth="0.8" fill="none" />
    </svg>
  ),
  contact: (
    <svg {...S}>
      <rect x="3" y="7" width="26" height="18" rx="2" fill="#f4efe0" {...line} />
      <circle cx="11" cy="15" r="3" fill="#9fb7d2" stroke="#1a1a1a" strokeWidth="1" />
      <path d="M6 23a5 5 0 0 1 10 0" fill="#9fb7d2" stroke="#1a1a1a" strokeWidth="1" />
      <path d="M19 13h7M19 17h7M19 21h4" stroke="#6c7580" strokeWidth="1.2" />
    </svg>
  ),
  trash: (full: boolean) => (
    <svg {...S}>
      <path d="M8 10h16l-1.5 17a2 2 0 0 1-2 1.8h-9a2 2 0 0 1-2-1.8z" fill="#c9ced4" {...line} />
      <path d="M6 10h20" stroke="#1a1a1a" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M13 6h6l1 4h-8z" fill="#dfe3e8" {...line} />
      <path d="M12.5 14l.6 11M16 14v11M19.5 14l-.6 11" stroke="#7c8590" strokeWidth="1" />
      {full ? <path d="M10 10l3-3 3 2 3-3 3 4" fill="#fbfbfb" stroke="#1a1a1a" strokeWidth="1" strokeLinejoin="round" /> : null}
    </svg>
  ),
  mark: (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M8 1.5l6 3.2v6.6L8 14.5 2 11.3V4.7z" fill="#27b8c9" stroke="#0b4f5c" strokeWidth="1" strokeLinejoin="round" />
      <path d="M2 4.7l6 3.2 6-3.2M8 7.9v6.6" fill="none" stroke="#d8fbff" strokeWidth="0.8" />
    </svg>
  ),
};
