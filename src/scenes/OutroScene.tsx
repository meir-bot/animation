import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Logo animation
  const logoSpring = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  const logoOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // CTA animation
  const ctaSpring = spring({
    frame: frame - 30,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  const ctaOpacity = interpolate(frame, [30, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Tagline animation
  const taglineOpacity = interpolate(frame, [50, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Pulse animation for CTA button
  const pulseScale = 1 + Math.sin(frame * 0.1) * 0.02;

  // Background particles
  const particles = Array.from({ length: 30 }, (_, i) => {
    const angle = (i / 30) * Math.PI * 2;
    const radius = 300 + Math.sin(i * 0.5 + frame * 0.02) * 50;
    const x = Math.cos(angle + frame * 0.005) * radius;
    const y = Math.sin(angle + frame * 0.005) * radius;
    const size = 3 + (i % 4) * 2;
    const opacity = 0.1 + Math.sin(i + frame * 0.05) * 0.05;
    return { x, y, size, opacity, color: i % 2 === 0 ? "#ef4444" : "#22c55e" };
  });

  return (
    <AbsoluteFill
      style={{
        background: `
          radial-gradient(circle at 50% 50%, rgba(239, 68, 68, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 30% 70%, rgba(34, 197, 94, 0.06) 0%, transparent 40%),
          radial-gradient(circle at 70% 30%, rgba(59, 130, 246, 0.04) 0%, transparent 40%),
          linear-gradient(180deg, #fafafa 0%, #f5f5f5 100%)
        `,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Animated background particles */}
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
            background: p.color,
            opacity: p.opacity,
          }}
        />
      ))}

      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          marginBottom: 40,
          opacity: logoOpacity,
          transform: `scale(${logoSpring}) translateY(${interpolate(logoSpring, [0, 1], [30, 0])}px)`,
        }}
      >
        {/* X Logo */}
        <div style={{ position: "relative" }}>
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="36" fill="#ef4444" opacity={0.1} />
            <path
              d="M24 24L40 40M40 40L56 56M40 40L56 24M40 40L24 56"
              stroke="#ef4444"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {/* Glow effect */}
          <div
            style={{
              position: "absolute",
              inset: -10,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(239, 68, 68, 0.2) 0%, transparent 70%)",
              filter: "blur(10px)",
            }}
          />
        </div>

        <span
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: "#1f2937",
            letterSpacing: "-0.03em",
          }}
        >
          Labor<span style={{ color: "#ef4444" }}>Rx</span>
        </span>
      </div>

      {/* Main CTA */}
      <div
        style={{
          opacity: ctaOpacity,
          transform: `scale(${interpolate(ctaSpring, [0, 1], [0.8, 1])})`,
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
            color: "#fff",
            fontSize: 24,
            fontWeight: 700,
            padding: "20px 48px",
            borderRadius: 16,
            boxShadow: "0 8px 32px rgba(239, 68, 68, 0.4)",
            transform: `scale(${pulseScale})`,
            cursor: "pointer",
          }}
        >
          Get Started Today
        </div>
      </div>

      {/* Tagline */}
      <p
        style={{
          marginTop: 32,
          fontSize: 20,
          color: "#6b7280",
          textAlign: "center",
          maxWidth: 500,
          lineHeight: 1.6,
          opacity: taglineOpacity,
          transform: `translateY(${interpolate(
            spring({ frame: frame - 50, fps, config: { damping: 12, stiffness: 80 } }),
            [0, 1],
            [20, 0]
          )}px)`,
        }}
      >
        Join thousands of healthcare professionals who trust LaborRx for their scheduling needs
      </p>

      {/* Stats */}
      <div
        style={{
          display: "flex",
          gap: 60,
          marginTop: 60,
          opacity: interpolate(frame, [70, 90], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {[
          { value: "50K+", label: "Healthcare Workers" },
          { value: "200+", label: "Facilities" },
          { value: "1M+", label: "Shifts Filled" },
        ].map((stat, i) => {
          const statSpring = spring({
            frame: frame - 70 - i * 10,
            fps,
            config: { damping: 12, stiffness: 80 },
          });

          return (
            <div
              key={i}
              style={{
                textAlign: "center",
                transform: `translateY(${interpolate(statSpring, [0, 1], [20, 0])}px)`,
              }}
            >
              <div
                style={{
                  fontSize: 36,
                  fontWeight: 800,
                  color: "#1f2937",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: "#9ca3af",
                  marginTop: 4,
                }}
              >
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Decorative rings */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          border: "1px solid rgba(239, 68, 68, 0.1)",
          transform: `rotate(${frame * 0.2}deg)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          borderRadius: "50%",
          border: "1px solid rgba(34, 197, 94, 0.08)",
          transform: `rotate(${-frame * 0.15}deg)`,
        }}
      />
    </AbsoluteFill>
  );
};
