import "./index.css";
import { Composition } from "remotion";
import { LaborRxOverview } from "./LaborRxOverview";

export const RemotionRoot: React.FC = () => {
  // Total duration: 4 + 5 + 5 + 5 + 5 + 4 = 28 seconds at 30fps = 840 frames
  const totalDuration = 840;

  return (
    <>
      <Composition
        id="LaborRxOverview"
        component={LaborRxOverview}
        durationInFrames={totalDuration}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
