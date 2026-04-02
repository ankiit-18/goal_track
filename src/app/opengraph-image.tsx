import { ImageResponse } from "next/og";
import { getSiteUrl, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site-config";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px",
          background:
            "radial-gradient(circle at 18% 12%, #edf8f2 0%, #d7f0e2 24%, #b8d9c8 52%, #1f2937 100%)",
          color: "#111827",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            color: "#065f46",
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: 1,
          }}
        >
          <span
            style={{
              width: 50,
              height: 50,
              borderRadius: 9999,
              background: "rgba(255,255,255,0.9)",
              border: "1px solid rgba(6,95,70,0.24)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            G
          </span>
          {SITE_NAME}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 74,
              lineHeight: 1.05,
              fontWeight: 700,
              maxWidth: 920,
              color: "#0f172a",
            }}
          >
            Long-term goals, made clear and trackable.
          </div>
          <div
            style={{
              fontSize: 30,
              lineHeight: 1.35,
              color: "rgba(15, 23, 42, 0.8)",
              maxWidth: 980,
            }}
          >
            {SITE_DESCRIPTION}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            color: "rgba(15, 23, 42, 0.72)",
          }}
        >
          <span>Goals. Stages. Weekly rhythm.</span>
          <span>{getSiteUrl().replace(/^https?:\/\//, "")}</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
