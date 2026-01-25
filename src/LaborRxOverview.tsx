import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { IntroScene } from "./scenes/IntroScene";
import { PhoneShowcaseScene } from "./scenes/PhoneShowcaseScene";
import { FeaturesScene } from "./scenes/FeaturesScene";
import { OutroScene } from "./scenes/OutroScene";

export const LaborRxOverview: React.FC = () => {
  const { fps } = useVideoConfig();

  // Scene durations in frames (at 30fps)
  const introDuration = 120; // 4 seconds
  const homeShowcaseDuration = 150; // 5 seconds
  const scheduleShowcaseDuration = 150; // 5 seconds
  const requestsShowcaseDuration = 150; // 5 seconds
  const featuresDuration = 150; // 5 seconds
  const outroDuration = 120; // 4 seconds

  // Calculate start frames
  let currentFrame = 0;

  const introStart = currentFrame;
  currentFrame += introDuration;

  const homeStart = currentFrame;
  currentFrame += homeShowcaseDuration;

  const scheduleStart = currentFrame;
  currentFrame += scheduleShowcaseDuration;

  const requestsStart = currentFrame;
  currentFrame += requestsShowcaseDuration;

  const featuresStart = currentFrame;
  currentFrame += featuresDuration;

  const outroStart = currentFrame;

  return (
    <AbsoluteFill style={{ background: "#fff" }}>
      {/* Intro Scene */}
      <Sequence from={introStart} durationInFrames={introDuration}>
        <IntroScene />
      </Sequence>

      {/* Home Screen Showcase */}
      <Sequence from={homeStart} durationInFrames={homeShowcaseDuration}>
        <PhoneShowcaseScene
          screen="home"
          title="Your Day at a Glance"
          subtitle="See your upcoming shifts, quick actions, and important updates all in one place."
        />
      </Sequence>

      {/* Schedule Screen Showcase */}
      <Sequence from={scheduleStart} durationInFrames={scheduleShowcaseDuration}>
        <PhoneShowcaseScene
          screen="schedule"
          title="Smart Scheduling"
          subtitle="Flexible calendar views make it easy to plan ahead and find available shifts."
        />
      </Sequence>

      {/* Requests Screen Showcase */}
      <Sequence from={requestsStart} durationInFrames={requestsShowcaseDuration}>
        <PhoneShowcaseScene
          screen="requests"
          title="Effortless Requests"
          subtitle="Request time-off, track approvals, and manage your work-life balance with ease."
        />
      </Sequence>

      {/* Features Overview */}
      <Sequence from={featuresStart} durationInFrames={featuresDuration}>
        <FeaturesScene />
      </Sequence>

      {/* Outro Scene */}
      <Sequence from={outroStart} durationInFrames={outroDuration}>
        <OutroScene />
      </Sequence>
    </AbsoluteFill>
  );
};
