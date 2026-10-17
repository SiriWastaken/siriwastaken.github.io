import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const alt = `${site.name}: software`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        background: "#000000",
        color: "#f5f5f7",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          fontSize: 24,
          color: "#a1a1a6",
        }}
      >
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            background: "#2997ff",
          }}
        />
        Sri
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 92, fontWeight: 600, letterSpacing: -3 }}>
          {site.name}
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 36,
            lineHeight: 1.3,
            maxWidth: 940,
            color: "#a1a1a6",
          }}
        >
          Scouting apps, dashboards, and CLI tools for a robotics team.
        </div>
      </div>
      <div style={{ display: "flex", height: 4, width: 160, background: "#2997ff" }} />
    </div>,
    size,
  );
}
