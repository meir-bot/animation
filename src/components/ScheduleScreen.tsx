import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { StatusBar } from "./StatusBar";
import { BottomNav } from "./BottomNav";

interface DayProps {
  day: number;
  dayName: string;
  isSelected?: boolean;
  hasShift?: "confirmed" | "pending" | "available" | null;
  delay?: number;
}

const DayCell: React.FC<DayProps> = ({
  day,
  dayName,
  isSelected = false,
  hasShift = null,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 200 },
  });

  const dotColors = {
    confirmed: "#3b82f6",
    pending: "#f97316",
    available: "#ef4444",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        transform: `scale(${interpolate(scale, [0, 1], [0.5, 1])})`,
        opacity: interpolate(scale, [0, 1], [0, 1]),
      }}
    >
      <span style={{ fontSize: 11, color: "#6b7280", fontWeight: 500 }}>
        {dayName}
      </span>
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: isSelected ? "#ef4444" : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: isSelected ? "#fff" : "#1f2937",
          }}
        >
          {day}
        </span>
      </div>
      {hasShift && (
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: dotColors[hasShift],
          }}
        />
      )}
    </div>
  );
};

interface ShiftItemProps {
  time: string;
  status: "confirmed" | "pending" | "available";
  showActions?: boolean;
  label?: string;
  delay?: number;
}

const ShiftItem: React.FC<ShiftItemProps> = ({
  time,
  status,
  showActions = false,
  label,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideIn = spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, stiffness: 80 },
  });

  const borderColors = {
    confirmed: "#3b82f6",
    pending: "#f97316",
    available: "#9ca3af",
  };

  return (
    <div
      style={{
        background: "#f8fafc",
        borderRadius: 12,
        padding: 16,
        marginBottom: 8,
        borderLeft: `4px solid ${borderColors[status]}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        opacity: interpolate(slideIn, [0, 1], [0, 1]),
        transform: `translateX(${interpolate(slideIn, [0, 1], [30, 0])}px)`,
      }}
    >
      <div>
        <div style={{ fontSize: 15, fontWeight: 600, color: "#1f2937" }}>
          {time}
        </div>
        {label && (
          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
            {label}
          </div>
        )}
      </div>

      {showActions && (
        <div style={{ display: "flex", gap: 8 }}>
          <button
            style={{
              background: "#1f2937",
              color: "#fff",
              border: "none",
              borderRadius: 20,
              padding: "8px 16px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Pick up shift
          </button>
          <button
            style={{
              background: "#fff",
              color: "#1f2937",
              border: "1px solid #e5e7eb",
              borderRadius: 20,
              padding: "8px 16px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Hide shift
          </button>
        </div>
      )}

      {!showActions && !label && (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="5" r="1.5" fill="#6b7280" />
          <circle cx="10" cy="10" r="1.5" fill="#6b7280" />
          <circle cx="10" cy="15" r="1.5" fill="#6b7280" />
        </svg>
      )}
    </div>
  );
};

export const ScheduleScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerSpring = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const days = [
    { day: 1, name: "MON", selected: true, shift: null },
    { day: 2, name: "TUE", selected: false, shift: "confirmed" as const },
    { day: 3, name: "WED", selected: false, shift: "pending" as const },
    { day: 4, name: "THU", selected: false, shift: "confirmed" as const },
    { day: 5, name: "FRI", selected: false, shift: "available" as const },
    { day: 6, name: "SAT", selected: false, shift: "available" as const },
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#fff",
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
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
          opacity: interpolate(headerSpring, [0, 1], [0, 1]),
        }}
      >
        <span style={{ fontSize: 16, fontWeight: 500, color: "#3b82f6" }}>
          Today
        </span>
        <span style={{ fontSize: 18, fontWeight: 700, color: "#1f2937" }}>
          Schedule
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16, fontWeight: 500, color: "#1f2937" }}>
            Filter
          </span>
          <div
            style={{
              background: "#1f2937",
              color: "#fff",
              borderRadius: "50%",
              width: 22,
              height: 22,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            1
          </div>
        </div>
      </div>

      {/* View toggle */}
      <div
        style={{
          margin: "0 20px 16px",
          background: "#f3f4f6",
          borderRadius: 12,
          padding: 4,
          display: "flex",
          opacity: interpolate(headerSpring, [0, 1], [0, 1]),
        }}
      >
        {["Day", "Week", "Month"].map((view, i) => (
          <div
            key={view}
            style={{
              flex: 1,
              textAlign: "center",
              padding: "10px 0",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              background: view === "Week" ? "#1f2937" : "transparent",
              color: view === "Week" ? "#fff" : "#6b7280",
            }}
          >
            {view}
          </div>
        ))}
      </div>

      {/* Month navigation */}
      <div
        style={{
          padding: "0 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          opacity: interpolate(headerSpring, [0, 1], [0, 1]),
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1f2937" strokeWidth="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        <span style={{ fontSize: 20, fontWeight: 700, color: "#1f2937" }}>
          September, 2025
        </span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1f2937" strokeWidth="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>

      {/* Days row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          padding: "0 12px",
          marginBottom: 20,
        }}
      >
        {days.map((d, i) => (
          <DayCell
            key={d.day}
            day={d.day}
            dayName={d.name}
            isSelected={d.selected}
            hasShift={d.shift}
            delay={i * 3}
          />
        ))}
      </div>

      {/* Schedule items */}
      <div style={{ flex: 1, padding: "0 20px", overflow: "hidden" }}>
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: "#1f2937", marginBottom: 8 }}>
            Monday, September 1
          </h3>
          <ShiftItem time="7:00 AM - 7:00 PM" status="confirmed" delay={20} />
        </div>

        <div style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: "#1f2937", marginBottom: 8 }}>
            Tuesday, September 2
          </h3>
          <ShiftItem time="7:00 AM - 7:00 PM" status="available" showActions delay={30} />
        </div>

        <div style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: "#1f2937", marginBottom: 8 }}>
            Wednesday, September 3
          </h3>
          <ShiftItem
            time="7:00 AM - 7:00 PM"
            status="pending"
            label="Needs manual approval"
            delay={40}
          />
        </div>
      </div>

      <BottomNav activeTab="schedule" />
    </div>
  );
};
