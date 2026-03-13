import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  Series,
} from "remotion";

const COMMANDS = [
  "/geo audit https://example.com",
  "/geo citability https://example.com/article",
  "/geo crawlers https://example.com",
  "/geo report https://example.com",
];

const CommandList: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const framesPerItem = fps * 0.12;
  const visibleItems = Math.floor(
    interpolate(
      frame,
      [0, COMMANDS.length * framesPerItem],
      [0, COMMANDS.length],
      { extrapolateRight: "clamp" }
    )
  );

  return (
    <div
      style={{
        fontFamily: "monospace",
        fontSize: 22,
        color: "#334155",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      {COMMANDS.slice(0, visibleItems).map((cmd, i) => (
        <div
          key={i}
          style={{
            background: "#f1f5f9",
            borderRadius: 8,
            padding: "8px 16px",
            color: "#2563eb",
          }}
        >
          {cmd}
        </div>
      ))}
    </div>
  );
};

const TitleSlide: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = interpolate(frame, [0, fps * 0.5], [0.85, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const opacity = interpolate(frame, [0, fps * 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill className="flex flex-col items-center justify-center" style={{ gap: 24 }}>
      <div style={{ transform: `scale(${scale})`, opacity, textAlign: "center" }}>
        <div
          style={{
            fontFamily: "GT Planar, sans-serif",
            fontSize: 52,
            fontWeight: 700,
            color: "#0f172a",
            marginBottom: 8,
          }}
        >
          GEO-SEO for Claude Code
        </div>
        <div
          style={{
            fontSize: 22,
            color: "#64748b",
            fontWeight: 400,
          }}
        >
          GEO-first AI search optimization — now installable as a skill
        </div>
      </div>
      <div style={{ transform: `scale(${scale})`, opacity, marginTop: 16 }}>
        <CommandList />
      </div>
    </AbsoluteFill>
  );
};

export const GeoEndCard: React.FC = () => {
  return (
    <Series>
      <Series.Sequence durationInFrames={150}>
        <TitleSlide />
      </Series.Sequence>
    </Series>
  );
};
