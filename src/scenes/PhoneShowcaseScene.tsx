import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
  Sequence,
} from "remotion";
import { PhoneMockup } from "../components/PhoneMockup";
import { HomeScreen } from "../components/HomeScreen";
import { ScheduleScreen } from "../components/ScheduleScreen";
import { RequestsScreen } from "../components/RequestsScreen";

interface PhoneShowcaseSceneProps {
  screen: "home" | "schedule" | "requests";
  title: string;
  subtitle: string;
}

export const PhoneShowcaseScene: React.FC<PhoneShowcaseSceneProps> = ({
  screen,
  title,
  subtitle,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Phone entrance animation
  const phoneEntrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 60 },
  });

  const phoneY = interpolate(phoneEntrance, [0, 1], [100, 0]);
  const phoneOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Phone subtle float animation
  const floatY = Math.sin(frame * 0.05) * 8;

  // Phone subtle rotation for 3D effect
  const rotateY = interpolate(frame, [0, durationInFrames], [-5, 5], {
    easing: Easing.inOut(Easing.sin),
  });

  // Title animation
  const titleSpring = spring({
    frame: frame - 15,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  const titleOpacity = interpolate(frame, [15, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtitle animation
  const subtitleOpacity = interpolate(frame, [30, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Feature highlights animation
  const highlightOpacity = interpolate(frame, [50, 65], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Exit animation
  const exitStart = durationInFrames - 20;
  const exitOpacity = interpolate(
    frame,
    [exitStart, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const renderScreen = () => {
    switch (screen) {
      case "home":
        return <HomeScreen />;
      case "schedule":
        return <ScheduleScreen />;
      case "requests":
        return <RequestsScreen />;
    }
  };

  const getFeatures = () => {
    switch (screen) {
      case "home":
        return ["View upcoming shifts", "Quick access to open shifts", "Real-time notifications"];
      case "schedule":
        return ["Day, Week, Month views", "Pick up available shifts", "Track approvals"];
      case "requests":
        return ["Request time-off", "Manage shift swaps", "Track request status"];
    }
  };

  return (
    <AbsoluteFill
      style={{
        background: `
          radial-gradient(circle at 20% 30%, rgba(239, 68, 68, 0.05) 0%, transparent 40%),
          radial-gradient(circle at 80% 70%, rgba(34, 197, 94, 0.05) 0%, transparent 40%),
          linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)
        `,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 60,
        opacity: exitOpacity,
      }}
    >
      {/* Left side - Text content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingRight: 60,
        }}
      >
        {/* Title */}
        <h2
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: "#1f2937",
            margin: 0,
            marginBottom: 16,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            opacity: titleOpacity,
            transform: `translateX(${interpolate(titleSpring, [0, 1], [-30, 0])}px)`,
          }}
        >
          {title}
        </h2>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 24,
            color: "#6b7280",
            margin: 0,
            marginBottom: 40,
            lineHeight: 1.5,
            opacity: subtitleOpacity,
            transform: `translateX(${interpolate(
              spring({ frame: frame - 30, fps, config: { damping: 12, stiffness: 80 } }),
              [0, 1],
              [-20, 0]
            )}px)`,
          }}
        >
          {subtitle}
        </p>

        {/* Feature list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {getFeatures().map((feature, i) => {
            const featureSpring = spring({
              frame: frame - 50 - i * 10,
              fps,
              config: { damping: 12, stiffness: 80 },
            });

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  opacity: interpolate(frame, [50 + i * 10, 60 + i * 10], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                  transform: `translateX(${interpolate(featureSpring, [0, 1], [-20, 0])}px)`,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "#dcfce7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="4 9 7 12 14 5" />
                  </svg>
                </div>
                <span style={{ fontSize: 20, color: "#374151", fontWeight: 500 }}>
                  {feature}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right side - Phone mockup */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: phoneOpacity,
          transform: `
            translateY(${phoneY + floatY}px)
            perspective(1000px)
            rotateY(${rotateY}deg)
          `,
        }}
      >
        <PhoneMockup scale={0.85}>{renderScreen()}</PhoneMockup>
      </div>

      {/* Decorative elements */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 40,
          width: 100,
          height: 100,
          borderRadius: "50%",
          border: "2px solid rgba(239, 68, 68, 0.1)",
          opacity: interpolate(frame, [20, 40], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 60,
          right: 80,
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "rgba(34, 197, 94, 0.08)",
          opacity: interpolate(frame, [30, 50], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
    </AbsoluteFill>
  );
};
