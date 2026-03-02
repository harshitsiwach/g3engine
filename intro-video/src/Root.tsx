import { Composition, Folder } from "remotion";
import { IntroVideo } from "./IntroVideo";
import { PromoVideo } from "./PromoVideo";

export const RemotionRoot = () => {
    return (
        <>
            <Folder name="Marketing">
                <Composition
                    id="IntroVideo"
                    component={IntroVideo}
                    durationInFrames={450}
                    fps={30}
                    width={1920}
                    height={1080}
                />
                <Composition
                    id="PromoVideo"
                    component={PromoVideo}
                    durationInFrames={450}
                    fps={30}
                    width={1920}
                    height={1080}
                />
            </Folder>
        </>
    );
};
