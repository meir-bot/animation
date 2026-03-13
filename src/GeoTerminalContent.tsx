import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { Cursor } from "./Cursor";

const INSTALL_COMMAND =
  "bash <(curl -s https://raw.githubusercontent.com/zubair-trabzada/geo-seo-claude/main/install.sh)";

// Output lines matching the installer script output
const OUTPUT_LINES = [
  "",
  "╔══════════════════════════════════════════╗",
  "║   GEO-SEO Claude Code Skill Installer    ║",
  "║   GEO-First AI Search Optimization       ║",
  "╚══════════════════════════════════════════╝",
  "",
  "→ Checking prerequisites...",
  "✓ Git found: git version 2.43.0",
  "✓ Python found: Python 3.12.0",
  "✓ Claude Code CLI found",
  "",
  "→ Creating directories...",
  "✓ Directory structure created",
  "",
  "→ Fetching GEO-SEO skill files...",
  "→ Cloning from repository...",
  "✓ Main skill installed",
  "",
  "→ Installing sub-skills...",
  "✓   geo-audit",
  "✓   geo-citability",
  "✓   geo-content",
  "✓   geo-crawlers",
  "✓   geo-llmstxt",
  "  → 5 sub-skills installed",
  "",
  "→ Installing subagents...",
  "✓   geo-analyst.md",
  "✓   geo-reporter.md",
  "  → 2 subagents installed",
  "",
  "→ Installing Python dependencies...",
  "✓ Python dependencies installed",
  "",
  "→ Verifying installation...",
  "✓ Main skill file",
  "✓ Sub-skills directory",
  "✓ Agent files",
  "✓ Utility scripts",
  "✓ Schema templates",
  "",
  "╔══════════════════════════════════════════╗",
  "║        Installation Complete!             ║",
  "╚══════════════════════════════════════════╝",
];

export const GeoTerminalContent: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const charsPerSecond = 18;
  const framesPerChar = fps / charsPerSecond;

  const typingEndFrame = INSTALL_COMMAND.length * framesPerChar;
  const outputStartFrame = typingEndFrame + fps * 0.4;

  const visibleChars = Math.floor(
    interpolate(frame, [0, typingEndFrame], [0, INSTALL_COMMAND.length], {
      extrapolateRight: "clamp",
    })
  );

  const displayedText = INSTALL_COMMAND.slice(0, visibleChars);
  const isTyping = visibleChars < INSTALL_COMMAND.length;
  const showOutput = frame >= outputStartFrame;

  const framesPerLine = fps * 0.04; // 40ms per line — snappy feel
  const linesStartFrame = outputStartFrame;

  const visibleLines = Math.floor(
    interpolate(
      frame,
      [linesStartFrame, linesStartFrame + OUTPUT_LINES.length * framesPerLine],
      [0, OUTPUT_LINES.length],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    )
  );

  const getLineColor = (line: string): string => {
    if (line.startsWith("✓")) return "#28c840";
    if (line.startsWith("→")) return "#4a9eff";
    if (line.startsWith("╔") || line.startsWith("║") || line.startsWith("╚"))
      return "#4a9eff";
    if (line.includes("Installation Complete")) return "#28c840";
    if (line.startsWith("⚠")) return "#febc2e";
    return "#333";
  };

  return (
    <div className="flex-1 bg-white p-6 font-mono overflow-hidden" style={{ fontSize: 13 }}>
      {/* Prompt line */}
      <div className="flex items-start text-[#333] flex-wrap">
        <span className="text-[#2ecc71] font-semibold shrink-0">~</span>
        <span className="text-[#333] mx-1 shrink-0">$</span>
        <span className="break-all">{displayedText}</span>
        {!showOutput && <Cursor blinking={!isTyping} />}
      </div>

      {/* Output */}
      {showOutput && (
        <div className="mt-2 leading-snug">
          {OUTPUT_LINES.slice(0, visibleLines).map((line, i) => (
            <div
              key={i}
              style={{ color: getLineColor(line), fontWeight: line.startsWith("╔") || line.startsWith("║") || line.startsWith("╚") ? 600 : 400 }}
            >
              {line || "\u00A0"}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
