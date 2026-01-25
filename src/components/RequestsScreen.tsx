import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { StatusBar } from "./StatusBar";
import { BottomNav } from "./BottomNav";

interface TimeOffRequestProps {
  startDate: string;
  endDate: string;
  type: string;
  status: "waiting" | "approved" | "rejected";
  showCancel?: boolean;
  delay?: number;
}

const TimeOffRequest: React.FC<TimeOffRequestProps> = ({
  startDate,
  endDate,
  type,
  status,
  showCancel = false,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideIn = spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, stiffness: 80 },
  });

  const statusColors = {
    waiting: "#f97316",
    approved: "#22c55e",
    rejected: "#ef4444",
  };

  return (
    <div
      style={{
        background: "#f8fafc",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderLeft: `4px solid ${statusColors[status]}`,
        opacity: interpolate(slideIn, [0, 1], [0, 1]),
        transform: `translateX(${interpolate(slideIn, [0, 1], [30, 0])}px)`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#6b7280" strokeWidth="1.5">
          <rect x="2" y="3" width="14" height="14" rx="2" />
          <line x1="12" y1="1" x2="12" y2="5" />
          <line x1="6" y1="1" x2="6" y2="5" />
          <line x1="2" y1="8" x2="16" y2="8" />
        </svg>
        <span style={{ fontSize: 14, color: "#6b7280" }}>Start:</span>
        <span style={{ fontSize: 14, fontWeight: 600, color: "#1f2937" }}>{startDate}</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#6b7280" strokeWidth="1.5">
          <rect x="2" y="3" width="14" height="14" rx="2" />
          <line x1="12" y1="1" x2="12" y2="5" />
          <line x1="6" y1="1" x2="6" y2="5" />
          <line x1="2" y1="8" x2="16" y2="8" />
        </svg>
        <span style={{ fontSize: 14, color: "#6b7280" }}>End:</span>
        <span style={{ fontSize: 14, fontWeight: 600, color: "#1f2937" }}>{endDate}</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#6b7280" strokeWidth="1.5">
          <rect x="2" y="4" width="14" height="12" rx="2" />
          <polyline points="2 8 9 12 16 8" />
        </svg>
        <span style={{ fontSize: 14, fontWeight: 600, color: "#1f2937" }}>{type}</span>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13, color: statusColors[status], fontWeight: 500 }}>
          {status === "waiting" && "Waiting approval"}
          {status === "approved" && "Approved"}
          {status === "rejected" && "Rejected"}
        </span>
        {showCancel && (
          <button
            style={{
              background: "#fff",
              color: "#1f2937",
              border: "1px solid #e5e7eb",
              borderRadius: 20,
              padding: "8px 20px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Cancel request
          </button>
        )}
      </div>
    </div>
  );
};

export const RequestsScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerSpring = spring({
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
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 8,
          opacity: interpolate(headerSpring, [0, 1], [0, 1]),
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1f2937" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
      </div>

      <h1
        style={{
          fontSize: 32,
          fontWeight: 700,
          color: "#1f2937",
          margin: "0 20px 16px",
          opacity: interpolate(headerSpring, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(headerSpring, [0, 1], [-10, 0])}px)`,
        }}
      >
        My Requests
      </h1>

      {/* Tabs */}
      <div
        style={{
          margin: "0 20px 20px",
          background: "#fff",
          borderRadius: 12,
          padding: 4,
          display: "flex",
          opacity: interpolate(headerSpring, [0, 1], [0, 1]),
        }}
      >
        {["Shifts", "Time-off", "Call-offs"].map((tab, i) => (
          <div
            key={tab}
            style={{
              flex: 1,
              textAlign: "center",
              padding: "12px 0",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              background: tab === "Time-off" ? "#fff" : "transparent",
              color: tab === "Time-off" ? "#1f2937" : "#6b7280",
              boxShadow: tab === "Time-off" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
            }}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* Request items */}
      <div style={{ flex: 1, padding: "0 20px", overflow: "hidden" }}>
        <TimeOffRequest
          startDate="Sun, Aug 31 2025"
          endDate="Mon, Sep 1 2025"
          type="Vacation"
          status="waiting"
          showCancel
          delay={10}
        />
        <TimeOffRequest
          startDate="Fri, Aug 29 2025"
          endDate="Sat, Aug 30 2025"
          type="Leave of Absence"
          status="approved"
          delay={20}
        />
        <TimeOffRequest
          startDate="Wed, Aug 27 2025"
          endDate="Wed, Aug 27 2025"
          type="Vacation"
          status="rejected"
          delay={30}
        />
      </div>

      {/* Request button */}
      <div style={{ padding: "0 20px 100px" }}>
        <button
          style={{
            width: "100%",
            background: "#fff",
            color: "#1f2937",
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: "16px",
            fontSize: 16,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Request Time-off
        </button>
      </div>

      <BottomNav activeTab="requests" chatBadge={15} />
    </div>
  );
};
