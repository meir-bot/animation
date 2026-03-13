import "./index.css";
import { Composition } from "remotion";
import { Master } from "./Master";
import { LogoCombo } from "./LogoCombo";
import { GeoSeoInstaller } from "./GeoSeoInstaller";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Original skills announcement */}
      <Composition
        id="SkillsAnnouncement"
        component={Master}
        durationInFrames={240}
        fps={30}
        width={1080}
        height={700}
      />
      <Composition
        id="LogoCombo"
        component={LogoCombo}
        durationInFrames={90}
        fps={30}
        width={1080}
        height={400}
      />

      {/* GEO-SEO installer animation */}
      <Composition
        id="GeoSeoInstaller"
        component={GeoSeoInstaller}
        durationInFrames={390}
        fps={30}
        width={1080}
        height={700}
      />
    </>
  );
};
