import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { StatusBar } from "./StatusBar";
import { BottomNav } from "./BottomNav";
import { LaborRxLogo } from "./LaborRxLogo";

interface ShiftCardProps {
  day: number;
  dayName: string;
  month: string;
  time: string;
  role: string;
  countdown: string;
  delay?: number;
}

const ShiftCard: React.FC<ShiftCardProps> = ({
  day,
  dayName,
  month,
  time,
  role,
  countdown,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideIn = spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, stiffness: 80 },
  });

  const opacity = interpolate(frame - delay, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        background: "#f8fafc",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        opacity,
        transform: `translateX(${interpolate(slideIn, [0, 1], [50, 0])}px)`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 12,
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 600, color: "#1f2937" }}>
          Upcoming shift
        </span>
        <span style={{ fontSize: 12, color: "#22c55e" }}>{countdown}</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {/* Date badge */}
        <div
          style={{
            background: "#dcfce7",
            borderRadius: 12,
            padding: "8px 12px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 24, fontWeight: 700, color: "#22c55e" }}>
            {day}
          </span>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ fontSize: 10, fontWeight: 600, color: "#22c55e" }}>
              {dayName}
            </span>
            <span style={{ fontSize: 10, color: "#22c55e" }}>{month}</span>
          </div>
        </div>

        {/* Shift details */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: "#1f2937", marginBottom: 4 }}>
            {time}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="5" cy="6" r="2.5" stroke="#6b7280" strokeWidth="1.5" />
              <circle cx="11" cy="6" r="2.5" stroke="#6b7280" strokeWidth="1.5" />
              <path d="M1 13c0-2 2-3.5 4-3.5s4 1.5 4 3.5" stroke="#6b7280" strokeWidth="1.5" />
              <path d="M9 13c0-2 2-3.5 4-3.5s3 1.5 3 3.5" stroke="#6b7280" strokeWidth="1.5" />
            </svg>
            <span style={{ fontSize: 14, color: "#6b7280" }}>{role}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const HomeScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerSlide = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#f8fafc",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}
    >
      <StatusBar />

      {/* Header */}
      <div
        style={{
          padding: "0 20px",
          opacity: interpolate(headerSlide, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(headerSlide, [0, 1], [-20, 0])}px)`,
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: 12 }}>
          <LaborRxLogo size={32} />
          <div style={{ position: "absolute", right: 20 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
          </div>
        </div>

        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#1f2937",
            margin: 0,
          }}
        >
          Thursday, Aug 28
        </h1>
      </div>

      {/* User card */}
      <div
        style={{
          margin: "16px 20px",
          background: "#fff",
          borderRadius: 16,
          padding: 16,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
          transform: `translateY(${interpolate(headerSlide, [0, 1], [30, 0])}px)`,
          opacity: interpolate(headerSlide, [0, 1], [0, 1]),
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: "50%",
              background: "#dcfce7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              fontWeight: 600,
              color: "#22c55e",
            }}
          >
            SC
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 600, color: "#1f2937" }}>
              Sarah Chen
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 4 }}>
              <span
                style={{
                  background: "#dcfce7",
                  color: "#22c55e",
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "2px 8px",
                  borderRadius: 6,
                }}
              >
                RN
              </span>
              <span style={{ fontSize: 12, color: "#6b7280", display: "flex", alignItems: "center", gap: 4 }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="5" cy="5" r="2" stroke="#6b7280" strokeWidth="1.5" />
                  <circle cx="9" cy="5" r="2" stroke="#6b7280" strokeWidth="1.5" />
                  <path d="M1 12c0-2 2-3 4-3M9 9c2 0 4 1 4 3" stroke="#6b7280" strokeWidth="1.5" />
                </svg>
                0
              </span>
              <span style={{ fontSize: 12, color: "#6b7280", display: "flex", alignItems: "center", gap: 4 }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="5.5" stroke="#6b7280" strokeWidth="1.5" />
                  <path d="M5 7l4 0M7 5l0 4" stroke="#6b7280" strokeWidth="1.5" transform="rotate(45 7 7)" />
                </svg>
                3
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div
        style={{
          display: "flex",
          gap: 12,
          margin: "0 20px 16px",
          transform: `translateY(${interpolate(headerSlide, [0, 1], [40, 0])}px)`,
          opacity: interpolate(headerSlide, [0, 1], [0, 1]),
        }}
      >
        <div
          style={{
            flex: 1,
            background: "#fff",
            borderRadius: 16,
            padding: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 12,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "#fef2f2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#ef4444" strokeWidth="1.5">
              <rect x="3" y="4" width="16" height="16" rx="2" />
              <line x1="14" y1="2" x2="14" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="19" y2="10" />
            </svg>
          </div>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#1f2937" }}>
            Find open shifts
          </span>
        </div>

        <div
          style={{
            flex: 1,
            background: "#fff",
            borderRadius: 16,
            padding: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 12,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "#fef2f2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#ef4444" strokeWidth="1.5">
              <rect x="3" y="4" width="16" height="16" rx="2" />
              <line x1="14" y1="2" x2="14" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="19" y2="10" />
              <path d="M8 14l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#1f2937" }}>
            Manage my requests
          </span>
        </div>
      </div>

      {/* Upcoming shifts */}
      <div style={{ flex: 1, padding: "0 20px", overflow: "hidden" }}>
        <ShiftCard
          day={28}
          dayName="THU"
          month="Aug"
          time="7:00 AM - 7:00 PM"
          role="RN"
          countdown="Is starting in 5 hours"
          delay={15}
        />
        <ShiftCard
          day={1}
          dayName="MON"
          month="Sep"
          time="7:00 AM - 7:00 PM"
          role="RN"
          countdown="Is starting in 4 days"
          delay={25}
        />
        <ShiftCard
          day={8}
          dayName="MON"
          month="Sep"
          time="7:00 AM - 7:00 PM"
          role="RN"
          countdown="Is starting in 11 days"
          delay={35}
        />
      </div>

      <BottomNav activeTab="home" />
    </div>
  );
};
