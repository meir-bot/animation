import React from "react";

interface BottomNavProps {
  activeTab?: "home" | "schedule" | "chat" | "requests" | "profile";
  chatBadge?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab = "home",
  chatBadge = 14,
}) => {
  const tabs = [
    { id: "home", label: "Home", icon: "home" },
    { id: "schedule", label: "Schedule", icon: "calendar" },
    { id: "chat", label: "Chat", icon: "chat" },
    { id: "requests", label: "Requests", icon: "requests" },
    { id: "profile", label: "Profile", icon: "profile" },
  ] as const;

  const renderIcon = (icon: string, isActive: boolean) => {
    const color = isActive ? "#000" : "#6b7280";

    switch (icon) {
      case "home":
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill={isActive ? color : "none"} stroke={color} strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        );
      case "calendar":
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
            <rect x="7" y="14" width="3" height="3" fill={color} />
          </svg>
        );
      case "chat":
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        );
      case "requests":
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
            <path d="M9 16l2 2 4-4" stroke={color} strokeWidth="2" />
          </svg>
        );
      case "profile":
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 85,
        background: "#1a1a1a",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-around",
        paddingTop: 12,
        paddingBottom: 20,
      }}
    >
      {tabs.map((tab) => (
        <div
          key={tab.id}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            position: "relative",
          }}
        >
          {tab.id === "chat" ? (
            <div
              style={{
                position: "relative",
                top: -30,
                background: "#ef4444",
                borderRadius: "50%",
                width: 56,
                height: 56,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(239, 68, 68, 0.4)",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
              {chatBadge > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: -4,
                    right: -4,
                    background: "#fff",
                    color: "#ef4444",
                    fontSize: 11,
                    fontWeight: 700,
                    borderRadius: 10,
                    minWidth: 20,
                    height: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 6px",
                  }}
                >
                  {chatBadge}
                </div>
              )}
            </div>
          ) : (
            renderIcon(tab.icon, activeTab === tab.id)
          )}
          <span
            style={{
              fontSize: 10,
              fontWeight: 500,
              color: activeTab === tab.id ? "#000" : "#6b7280",
              marginTop: tab.id === "chat" ? -24 : 0,
            }}
          >
            {tab.label}
          </span>
        </div>
      ))}
    </div>
  );
};
