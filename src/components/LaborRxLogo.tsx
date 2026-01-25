import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface LaborRxLogoProps {
  size?: number;
  showText?: boolean;
  animate?: boolean;
}

export const LaborRxLogo: React.FC<LaborRxLogoProps> = ({
  size = 48,
  showText = true,
  animate = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = animate
    ? spring({
        frame,
        fps,
        config: { damping: 12, stiffness: 100 },
      })
    : 1;

  const rotation = animate
    ? interpolate(frame, [0, 30], [-10, 0], {
        extrapolateRight: "clamp",
      })
    : 0;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: size * 0.25,
        transform: `scale(${scale}) rotate(${rotation}deg)`,
      }}
    >
      {/* X Logo Icon */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Red X shape */}
        <path
          d="M12 12L24 24M24 24L36 36M24 24L36 12M24 24L12 36"
          stroke="#ef4444"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Circle accent */}
        <circle
          cx="24"
          cy="24"
          r="20"
          stroke="#ef4444"
          strokeWidth="3"
          fill="none"
          opacity="0.3"
        />
      </svg>

      {showText && (
        <span
          style={{
            fontSize: size * 0.6,
            fontWeight: 700,
            color: "#1f2937",
            letterSpacing: "-0.02em",
          }}
        >
          Labor<span style={{ color: "#ef4444" }}>Rx</span>
        </span>
      )}
    </div>
  );
};
