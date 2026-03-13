import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { GeoMacTerminal } from "./GeoMacTerminal";
import { GeoEndCard } from "./GeoEndCard";

// Frame at which the installer output is done and terminal flips away
const TERMINAL_DONE_FRAME = 210;

export const GeoSeoInstaller: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  // Terminal slides in from bottom
  const slideIn = spring({
    frame,
    fps,
    config: {
      damping: 200,
      stiffness: 100,
    },
  });

  // Terminal flips out (rotates on X axis towards camera)
  const flipOut = spring({
    frame: frame - TERMINAL_DONE_FRAME,
    fps,
    config: {
      damping: 200,
      stiffness: 80,
    },
  });

  const translateY = interpolate(slideIn, [0, 1], [800, 80]);
  const rotateY = interpolate(frame, [0, durationInFrames], [10, -10]);
  const scale = interpolate(frame, [0, durationInFrames], [0.9, 1]);

  const flipRotateX =
    frame >= TERMINAL_DONE_FRAME
      ? interpolate(flipOut, [0, 1], [0, -90])
      : 0;

  return (
    <AbsoluteFill className="bg-[#f8fafc]" style={{ perspective: 1200 }}>
      {/* End card revealed behind the terminal */}
      <Sequence
        from={TERMINAL_DONE_FRAME}
        durationInFrames={durationInFrames - TERMINAL_DONE_FRAME}
      >
        <GeoEndCard />
      </Sequence>

      {/* Terminal on top with slide-in + 3D rotation + flip-out */}
      <Sequence
        durationInFrames={durationInFrames}
        style={{
          transform: `translateY(${translateY}px) rotateX(20deg) rotateY(${rotateY}deg) scale(${scale})`,
        }}
      >
        {/* Flip wrapper — transform origin at bottom */}
        <div style={{ width: "100%", height: "100%", perspective: 1000 }}>
          <div
            style={{
              width: "100%",
              height: "100%",
              transformOrigin: "center bottom",
              transform: `rotateX(${flipRotateX}deg)`,
            }}
          >
            <GeoMacTerminal />
          </div>
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
