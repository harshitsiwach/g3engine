import { Composition } from "remotion";
import { IntroVideo } from "./IntroVideo";

export const RemotionRoot = () => {
    return (
        <Composition
            id="IntroVideo"
            component={IntroVideo}
            durationInFrames={450}
            fps={30}
            width={1920}
            height={1080}
        />
    );
};
