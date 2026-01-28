"use client";

import { Player } from "@remotion/player";
import { LaborRxOverview } from "../src/LaborRxOverview";

export default function Home() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        padding: 20,
      }}
    >
      <h1
        style={{
          color: "#fff",
          fontSize: 32,
          fontWeight: 700,
          marginBottom: 24,
          textAlign: "center",
        }}
      >
        LaborRx Product Overview
      </h1>

      <div
        style={{
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        }}
      >
        <Player
          component={LaborRxOverview}
          durationInFrames={840}
          fps={30}
          compositionWidth={1920}
          compositionHeight={1080}
          style={{
            width: "min(90vw, 960px)",
            aspectRatio: "16/9",
          }}
          controls
          autoPlay
          loop
        />
      </div>

      <p
        style={{
          color: "#9ca3af",
          marginTop: 24,
          fontSize: 14,
        }}
      >
        Built with Remotion
      </p>
    </div>
  );
}
