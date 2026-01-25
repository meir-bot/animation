import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";

interface FeatureCardProps {
  icon: "shifts" | "schedule" | "requests" | "chat";
  title: string;
  description: string;
  delay: number;
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  delay,
  index,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardSpring = spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, stiffness: 80 },
  });

  const cardOpacity = interpolate(frame - delay, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const iconColors = {
    shifts: { bg: "#fef2f2", color: "#ef4444" },
    schedule: { bg: "#eff6ff", color: "#3b82f6" },
    requests: { bg: "#f0fdf4", color: "#22c55e" },
    chat: { bg: "#fefce8", color: "#eab308" },
  };

  const renderIcon = () => {
    const color = iconColors[icon].color;
    switch (icon) {
      case "shifts":
        return (
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke={color} strokeWidth="2.5">
            <rect x="6" y="8" width="24" height="24" rx="3" />
            <line x1="24" y1="4" x2="24" y2="12" />
            <line x1="12" y1="4" x2="12" y2="12" />
            <line x1="6" y1="16" x2="30" y2="16" />
            <circle cx="18" cy="24" r="4" fill={color} stroke="none" />
          </svg>
        );
      case "schedule":
        return (
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke={color} strokeWidth="2.5">
            <circle cx="18" cy="18" r="14" />
            <polyline points="18 10 18 18 24 22" strokeLinecap="round" />
          </svg>
        );
      case "requests":
        return (
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke={color} strokeWidth="2.5">
            <rect x="6" y="8" width="24" height="24" rx="3" />
            <line x1="24" y1="4" x2="24" y2="12" />
            <line x1="12" y1="4" x2="12" y2="12" />
            <path d="M12 22l4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case "chat":
        return (
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke={color} strokeWidth="2.5">
            <path d="M32 17.5a12.5 12.5 0 0 1-1.4 5.8 12.5 12.5 0 0 1-11.1 6.9 12.5 12.5 0 0 1-5.8-1.4L4 32l3.2-9.7a12.5 12.5 0 0 1-1.4-5.8 12.5 12.5 0 0 1 6.9-11.1A12.5 12.5 0 0 1 18.5 4h.7a12.5 12.5 0 0 1 11.8 11.8v.7z" />
          </svg>
        );
    }
  };

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 24,
        padding: 32,
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.06)",
        opacity: cardOpacity,
        transform: `
          translateY(${interpolate(cardSpring, [0, 1], [40, 0])}px)
          scale(${interpolate(cardSpring, [0, 1], [0.9, 1])})
        `,
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 20,
          background: iconColors[icon].bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 24,
        }}
      >
        {renderIcon()}
      </div>

      {/* Title */}
      <h3
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: "#1f2937",
          margin: 0,
          marginBottom: 12,
        }}
      >
        {title}
      </h3>

      {/* Description */}
      <p
        style={{
          fontSize: 16,
          color: "#6b7280",
          margin: 0,
          lineHeight: 1.6,
        }}
      >
        {description}
      </p>
    </div>
  );
};

export const FeaturesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Header animation
  const headerSpring = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  const headerOpacity = interpolate(frame, [0, 20], [0, 1], {
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

  const features = [
    {
      icon: "shifts" as const,
      title: "Find Open Shifts",
      description: "Browse and pick up available shifts that match your credentials and preferences.",
    },
    {
      icon: "schedule" as const,
      title: "Smart Scheduling",
      description: "View your schedule in day, week, or month format with real-time updates.",
    },
    {
      icon: "requests" as const,
      title: "Easy Requests",
      description: "Submit time-off requests and shift swaps with just a few taps.",
    },
    {
      icon: "chat" as const,
      title: "Team Communication",
      description: "Stay connected with your team through integrated messaging.",
    },
  ];

  return (
    <AbsoluteFill
      style={{
        background: `
          radial-gradient(circle at 10% 20%, rgba(239, 68, 68, 0.05) 0%, transparent 30%),
          radial-gradient(circle at 90% 80%, rgba(59, 130, 246, 0.05) 0%, transparent 30%),
          linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)
        `,
        padding: 60,
        opacity: exitOpacity,
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 60,
          opacity: headerOpacity,
          transform: `translateY(${interpolate(headerSpring, [0, 1], [-30, 0])}px)`,
        }}
      >
        <span
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#ef4444",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          Powerful Features
        </span>
        <h2
          style={{
            fontSize: 48,
            fontWeight: 800,
            color: "#1f2937",
            margin: "12px 0 0 0",
            letterSpacing: "-0.02em",
          }}
        >
          Everything You Need
        </h2>
      </div>

      {/* Features grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 32,
          maxWidth: 1000,
          margin: "0 auto",
        }}
      >
        {features.map((feature, i) => (
          <FeatureCard
            key={i}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            delay={20 + i * 15}
            index={i}
          />
        ))}
      </div>

      {/* Decorative elements */}
      <div
        style={{
          position: "absolute",
          top: 100,
          right: 100,
          width: 200,
          height: 200,
          borderRadius: "50%",
          border: "2px dashed rgba(239, 68, 68, 0.15)",
          opacity: interpolate(frame, [40, 60], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          transform: `rotate(${frame * 0.5}deg)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 60,
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: "rgba(34, 197, 94, 0.05)",
          opacity: interpolate(frame, [50, 70], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
    </AbsoluteFill>
  );
};
