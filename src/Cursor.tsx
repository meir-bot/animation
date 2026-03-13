import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface CursorProps {
  blinking: boolean;
}

export const Cursor: React.FC<CursorProps> = ({ blinking }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Blink every 0.5 seconds when blinking is true
  const blinkCycle = fps * 0.5;
  const opacity = blinking
    ? interpolate(frame % blinkCycle, [0, blinkCycle * 0.5, blinkCycle], [1, 1, 0], {
        extrapolateRight: "clamp",
      })
    : 1;

  return (
    <span
      className="w-4 h-10 bg-[#333] ml-0.5 inline-block"
      style={{ opacity }}
    />
  );
};
