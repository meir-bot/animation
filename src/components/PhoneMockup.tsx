import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface PhoneMockupProps {
  children: React.ReactNode;
  scale?: number;
  x?: number;
  y?: number;
  rotation?: number;
  showNotch?: boolean;
}

export const PhoneMockup: React.FC<PhoneMockupProps> = ({
  children,
  scale = 1,
  x = 0,
  y = 0,
  rotation = 0,
  showNotch = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phoneWidth = 375;
  const phoneHeight = 812;
  const borderRadius = 55;
  const bezelWidth = 12;

  return (
    <div
      style={{
        transform: `translate(${x}px, ${y}px) scale(${scale}) rotate(${rotation}deg)`,
        transformOrigin: "center center",
      }}
    >
      {/* Phone outer frame */}
      <div
        style={{
          width: phoneWidth + bezelWidth * 2,
          height: phoneHeight + bezelWidth * 2,
          background: "linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 50%, #0a0a0a 100%)",
          borderRadius: borderRadius + 4,
          padding: bezelWidth,
          boxShadow: `
            0 50px 100px -20px rgba(0, 0, 0, 0.5),
            0 30px 60px -30px rgba(0, 0, 0, 0.6),
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            inset 0 -1px 0 rgba(0, 0, 0, 0.3)
          `,
          position: "relative",
        }}
      >
        {/* Side buttons */}
        {/* Volume up */}
        <div
          style={{
            position: "absolute",
            left: -3,
            top: 120,
            width: 3,
            height: 30,
            background: "#2a2a2a",
            borderRadius: "2px 0 0 2px",
          }}
        />
        {/* Volume down */}
        <div
          style={{
            position: "absolute",
            left: -3,
            top: 160,
            width: 3,
            height: 30,
            background: "#2a2a2a",
            borderRadius: "2px 0 0 2px",
          }}
        />
        {/* Silent switch */}
        <div
          style={{
            position: "absolute",
            left: -3,
            top: 80,
            width: 3,
            height: 20,
            background: "#2a2a2a",
            borderRadius: "2px 0 0 2px",
          }}
        />
        {/* Power button */}
        <div
          style={{
            position: "absolute",
            right: -3,
            top: 140,
            width: 3,
            height: 50,
            background: "#2a2a2a",
            borderRadius: "0 2px 2px 0",
          }}
        />

        {/* Screen container */}
        <div
          style={{
            width: phoneWidth,
            height: phoneHeight,
            borderRadius: borderRadius - 4,
            overflow: "hidden",
            background: "#fff",
            position: "relative",
          }}
        >
          {/* Dynamic Island / Notch */}
          {showNotch && (
            <div
              style={{
                position: "absolute",
                top: 10,
                left: "50%",
                transform: "translateX(-50%)",
                width: 120,
                height: 35,
                background: "#000",
                borderRadius: 20,
                zIndex: 100,
              }}
            />
          )}

          {/* Screen content */}
          <div
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {children}
          </div>

          {/* Home indicator */}
          <div
            style={{
              position: "absolute",
              bottom: 8,
              left: "50%",
              transform: "translateX(-50%)",
              width: 134,
              height: 5,
              background: "rgba(0, 0, 0, 0.2)",
              borderRadius: 3,
              zIndex: 100,
            }}
          />
        </div>
      </div>
    </div>
  );
};
