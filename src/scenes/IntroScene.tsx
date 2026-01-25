import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Logo reveal animation
  const logoScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  const logoOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  // X rotation animation
  const xRotation = interpolate(frame, [0, 45], [180, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.5)),
  });

  // Tagline animation
  const taglineProgress = spring({
    frame: frame - 30,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const taglineOpacity = interpolate(frame, [30, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtitle animation
  const subtitleProgress = spring({
    frame: frame - 50,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  // Background gradient animation
  const gradientRotation = interpolate(frame, [0, durationInFrames], [0, 360]);

  // Particle effects
  const particles = Array.from({ length: 20 }, (_, i) => {
    const delay = i * 3;
    const x = Math.sin(i * 0.7) * 400;
    const y = Math.cos(i * 0.9) * 300;
    const size = 4 + (i % 5) * 2;
    const particleOpacity = interpolate(
      frame - delay,
      [0, 30, 60],
      [0, 0.3, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
    const particleY = interpolate(frame - delay, [0, 90], [y, y - 100], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return { x, y: particleY, size, opacity: particleOpacity };
  });

  return (
    <AbsoluteFill
      style={{
        background: `
          radial-gradient(circle at 30% 20%, rgba(239, 68, 68, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 70% 80%, rgba(34, 197, 94, 0.08) 0%, transparent 50%),
          linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%)
        `,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Animated particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `calc(50% + ${p.x}px)`,
            top: `calc(50% + ${p.y}px)`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: i % 2 === 0 ? "#ef4444" : "#22c55e",
            opacity: p.opacity,
          }}
        />
      ))}

      {/* Logo container */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 24,
          transform: `scale(${logoScale})`,
          opacity: logoOpacity,
        }}
      >
        {/* Animated X logo */}
        <div
          style={{
            width: 120,
            height: 120,
            position: "relative",
            transform: `rotate(${xRotation}deg)`,
          }}
        >
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
            style={{ position: "absolute" }}
          >
            {/* Outer glow ring */}
            <circle
              cx="60"
              cy="60"
              r="55"
              stroke="url(#logoGradient)"
              strokeWidth="2"
              opacity={0.3}
            />
            {/* Inner filled circle background */}
            <circle cx="60" cy="60" r="50" fill="#ef4444" opacity={0.1} />
            {/* X shape */}
            <path
              d="M35 35L60 60M60 60L85 85M60 60L85 35M60 60L35 85"
              stroke="#ef4444"
              strokeWidth="12"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#dc2626" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Brand name */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: "#1f2937",
              letterSpacing: "-0.03em",
              lineHeight: 1,
            }}
          >
            Labor<span style={{ color: "#ef4444" }}>Rx</span>
          </span>
        </div>
      </div>

      {/* Tagline */}
      <div
        style={{
          marginTop: 40,
          opacity: taglineOpacity,
          transform: `translateY(${interpolate(taglineProgress, [0, 1], [20, 0])}px)`,
        }}
      >
        <span
          style={{
            fontSize: 32,
            fontWeight: 600,
            color: "#4b5563",
            letterSpacing: "-0.01em",
          }}
        >
          Healthcare Staffing, Simplified
        </span>
      </div>

      {/* Subtitle */}
      <div
        style={{
          marginTop: 16,
          opacity: interpolate(frame, [50, 65], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          transform: `translateY(${interpolate(subtitleProgress, [0, 1], [15, 0])}px)`,
        }}
      >
        <span
          style={{
            fontSize: 20,
            fontWeight: 400,
            color: "#9ca3af",
          }}
        >
          Empowering nurses to take control of their schedules
        </span>
      </div>

      {/* Decorative line */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          width: interpolate(frame, [60, 90], [0, 200], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          }),
          height: 4,
          background: "linear-gradient(90deg, transparent, #ef4444, transparent)",
          borderRadius: 2,
        }}
      />
    </AbsoluteFill>
  );
};
