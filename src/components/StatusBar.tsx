import React from "react";

interface StatusBarProps {
  time?: string;
  dark?: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  time = "7:45",
  dark = false,
}) => {
  const color = dark ? "#fff" : "#000";

  return (
    <div
      style={{
        height: 54,
        paddingTop: 14,
        paddingLeft: 28,
        paddingRight: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Time */}
      <span
        style={{
          fontSize: 16,
          fontWeight: 600,
          color,
        }}
      >
        {time}
      </span>

      {/* Right icons */}
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        {/* Signal */}
        <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
          <rect x="0" y="5" width="3" height="7" rx="1" fill={color} />
          <rect x="5" y="3" width="3" height="9" rx="1" fill={color} />
          <rect x="10" y="1" width="3" height="11" rx="1" fill={color} />
          <rect x="15" y="0" width="3" height="12" rx="1" fill={color} opacity="0.3" />
        </svg>

        {/* WiFi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path
            d="M8 10.5C8.83 10.5 9.5 9.83 9.5 9C9.5 8.17 8.83 7.5 8 7.5C7.17 7.5 6.5 8.17 6.5 9C6.5 9.83 7.17 10.5 8 10.5Z"
            fill={color}
          />
          <path
            d="M4.5 6.5C5.44 5.56 6.67 5 8 5C9.33 5 10.56 5.56 11.5 6.5"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M2 4C3.58 2.42 5.69 1.5 8 1.5C10.31 1.5 12.42 2.42 14 4"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>

        {/* Battery */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 25,
              height: 12,
              borderRadius: 3,
              border: `1px solid ${color}`,
              padding: 1,
              display: "flex",
            }}
          >
            <div
              style={{
                flex: 1,
                background: color,
                borderRadius: 1,
              }}
            />
          </div>
          <div
            style={{
              width: 2,
              height: 5,
              background: color,
              borderRadius: "0 1px 1px 0",
              marginLeft: 1,
            }}
          />
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              marginLeft: 4,
              background: color,
              borderRadius: 6,
              padding: "1px 5px",
              color: dark ? "#000" : "#fff",
            }}
          >
            99
          </span>
        </div>
      </div>
    </div>
  );
};
