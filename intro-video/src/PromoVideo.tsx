import React from "react";
import {
    AbsoluteFill,
    Sequence,
    useCurrentFrame,
    useVideoConfig,
    interpolate,
    spring,
    Easing,
    Img,
    delayRender,
    continueRender,
} from "remotion";

const COLORS = {
    bg: "#050508",
    bgLight: "#111116",
    accent: "#14f195", // Solana green
    brand: "#06b6d4", // Cyan
    purple: "#9945FF", // Solana purple
    white: "#ffffff",
    dim: "#888899",
};

// ─── Transition ───
const WipeTransition: React.FC<{ type: "in" | "out" }> = ({ type }) => {
    const frame = useCurrentFrame();
    const { durationInFrames } = useVideoConfig();
    const progress = interpolate(frame, [0, durationInFrames], [0, 100], {
        easing: Easing.inOut(Easing.exp),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    const clipPath = type === "in"
        ? `circle(${progress}% at 50% 50%)`
        : `circle(${100 - progress}% at 50% 50%)`;

    return (
        <AbsoluteFill style={{ background: COLORS.bg, clipPath }} />
    );
};

// ────────────────────────────────────────
// Scene 1: Typography Smash (0-3s)
// ────────────────────────────────────────
const SceneTypography: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const zeroScale = spring({ frame, fps, config: { damping: 12, stiffness: 150 } });
    const codeScale = spring({ frame: frame - 15, fps, config: { damping: 12, stiffness: 150 } });

    const infiniteY = spring({ frame: frame - 40, fps, config: { damping: 15, stiffness: 120 } });

    return (
        <AbsoluteFill style={{ background: COLORS.bg, justifyContent: "center", alignItems: "center" }}>
            {/* Dynamic Grid */}
            <div style={{
                position: "absolute", inset: 0,
                background: `radial-gradient(circle at 50% ${interpolate(frame, [0, 90], [50, 150])}%, rgba(20,241,149,0.1) 0%, transparent 60%)`,
            }} />

            <div style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "center", zIndex: 10 }}>
                <div style={{ display: "flex", gap: 30 }}>
                    <div style={{
                        fontSize: 120, fontWeight: 900, color: COLORS.white, fontFamily: "system-ui",
                        transform: `scale(${zeroScale})`,
                        opacity: interpolate(zeroScale, [0, 0.5], [0, 1]),
                    }}>
                        Zero
                    </div>
                    <div style={{
                        fontSize: 120, fontWeight: 900,
                        color: "transparent", WebkitTextStroke: `4px ${COLORS.accent}`, fontFamily: "system-ui",
                        transform: `scale(${codeScale})`,
                        opacity: interpolate(codeScale, [0, 0.5], [0, 1]),
                    }}>
                        Code.
                    </div>
                </div>

                <div style={{
                    fontSize: 60, fontWeight: 700, color: COLORS.dim, fontFamily: "system-ui",
                    transform: `translateY(${interpolate(infiniteY, [0, 1], [100, 0])}px)`,
                    opacity: infiniteY,
                }}>
                    Infinite <span style={{ color: COLORS.purple }}>Possibilities.</span>
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ────────────────────────────────────────
// Scene 2: Tech Stack / Web3 Rings (3-6s)
// ────────────────────────────────────────
const SceneTechStack: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const rotation = interpolate(frame, [0, 90], [0, 180]);
    const scaleIn = spring({ frame, fps, config: { damping: 20, stiffness: 100 } });

    const tech = [
        { name: "Solana", color: "#14F195" },
        { name: "EVM", color: "#627EEA" },
        { name: "Arweave", color: "#000000", bg: "#fff" },
        { name: "Three.js", color: "#049EF4" },
    ];

    return (
        <AbsoluteFill style={{ background: COLORS.bg, justifyContent: "center", alignItems: "center" }}>
            <div style={{
                position: "absolute", top: 100,
                fontSize: 50, fontWeight: 800, color: COLORS.white, fontFamily: "system-ui",
                opacity: interpolate(frame, [0, 20], [0, 1]),
                transform: `translateY(${interpolate(frame, [0, 20], [-50, 0], { easing: Easing.out(Easing.exp) })}px)`,
            }}>
                Built for the <span style={{ color: COLORS.brand }}>Decentralized Web</span>
            </div>

            <div style={{
                position: "relative", width: 600, height: 600,
                transform: `scale(${scaleIn})`,
            }}>
                {/* Core circle */}
                <div style={{
                    position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)",
                    width: 200, height: 200, borderRadius: "50%",
                    background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.brand})`,
                    display: "flex", justifyContent: "center", alignItems: "center",
                    fontSize: 40, fontWeight: 900, color: "#000", fontFamily: "system-ui",
                    boxShadow: `0 0 100px ${COLORS.accent}66`,
                    zIndex: 10,
                }}>
                    G3
                </div>

                {/* Orbiting Tech */}
                {tech.map((t, i) => {
                    const angle = (i * (360 / tech.length)) + rotation;
                    const rad = (angle * Math.PI) / 180;
                    const radius = 220;
                    const x = Math.cos(rad) * radius;
                    const y = Math.sin(rad) * radius;

                    const itemScale = spring({ frame: frame - 10 - i * 5, fps, config: { damping: 15 } });

                    return (
                        <div key={i} style={{
                            position: "absolute", left: "50%", top: "50%",
                            marginLeft: -75, marginTop: -35,
                            width: 150, height: 70, borderRadius: 35,
                            background: t.bg || "#1a1a24",
                            border: `2px solid ${t.color}50`,
                            display: "flex", justifyContent: "center", alignItems: "center",
                            fontSize: 22, fontWeight: 700, color: t.color, fontFamily: "system-ui",
                            transform: `translate(${x}px, ${y}px) scale(${itemScale})`,
                            boxShadow: `0 10px 30px rgba(0,0,0,0.5)`,
                            zIndex: 5,
                        }}>
                            {t.name}
                        </div>
                    );
                })}

                {/* Orbit Rings */}
                <div style={{
                    position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)",
                    width: 440, height: 440, borderRadius: "50%",
                    border: `2px dashed ${COLORS.dim}40`,
                }} />
            </div>
        </AbsoluteFill>
    );
};

// ────────────────────────────────────────
// Scene 3: One Click Export (6-9s)
// ────────────────────────────────────────
const SceneExport: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const btnScale = spring({ frame: frame - 20, fps, config: { damping: 15, stiffness: 150 } });

    // Button click effect around frame 50
    const clickT = Math.max(0, interpolate(frame, [50, 55, 60], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
    const actualBtnScale = btnScale - (clickT * 0.1);

    const TitleY = spring({ frame, fps, config: { damping: 20 } });

    return (
        <AbsoluteFill style={{ background: COLORS.bg, justifyContent: "center", alignItems: "center" }}>
            {/* Background flare */}
            <div style={{
                position: "absolute",
                width: 1200, height: 400,
                background: `radial-gradient(ellipse at center, ${COLORS.brand}20 0%, transparent 60%)`,
                opacity: interpolate(frame, [50, 55, 90], [0, 1, 0]),
                transform: `scaleY(${interpolate(frame, [50, 90], [1, 3])})`,
            }} />

            <div style={{
                position: "absolute", top: 150,
                fontSize: 70, fontWeight: 900, color: COLORS.white, fontFamily: "system-ui",
                transform: `translateY(${interpolate(TitleY, [0, 1], [-100, 0])}px)`,
                opacity: TitleY,
            }}>
                Export to <span style={{ color: COLORS.accent }}>Any Device</span>
            </div>

            <div style={{
                width: 320, height: 100, borderRadius: 50,
                background: `linear-gradient(90deg, ${COLORS.brand}, ${COLORS.purple})`,
                display: "flex", justifyContent: "center", alignItems: "center",
                fontSize: 36, fontWeight: 800, color: COLORS.white, fontFamily: "system-ui",
                transform: `scale(${actualBtnScale})`,
                boxShadow: `0 ${(1 - clickT) * 20}px ${(1 - clickT) * 40}px ${COLORS.purple}50`,
                transition: "box-shadow 0.1s",
            }}>
                🚀 PUBLISH
            </div>

            {/* Particles erupting after click */}
            {new Array(12).fill(0).map((_, i) => {
                const angle = (i * 30 * Math.PI) / 180;
                const p = interpolate(frame, [55, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });
                const distance = p * 400;
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance;
                const pScale = interpolate(p, [0, 0.5, 1], [0, 1, 0]);

                return (
                    <div key={i} style={{
                        position: "absolute", left: "50%", top: "50%",
                        width: 20, height: 20, borderRadius: "50%",
                        background: i % 2 === 0 ? COLORS.accent : COLORS.brand,
                        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${pScale})`,
                    }} />
                );
            })}
        </AbsoluteFill>
    );
};

// ────────────────────────────────────────
// Scene 4: Cinematic Outro (9-15s)
// ────────────────────────────────────────
const SceneOutro: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const logoY = spring({ frame: frame - 15, fps, config: { damping: 15, stiffness: 100 } });

    const textSplit = "G3ENGINE".split("");

    return (
        <AbsoluteFill style={{ background: COLORS.bg, justifyContent: "center", alignItems: "center" }}>
            {/* Cinematic stripes */}
            <div style={{ position: "absolute", top: 0, width: "100%", height: 100, background: "#000", zIndex: 100 }} />
            <div style={{ position: "absolute", bottom: 0, width: "100%", height: 100, background: "#000", zIndex: 100 }} />

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>

                {/* Staggered Text */}
                <div style={{ display: "flex", gap: 8 }}>
                    {textSplit.map((char, i) => {
                        const charScale = spring({ frame: frame - 30 - i * 4, fps, config: { damping: 10, stiffness: 120 } });
                        return (
                            <div key={i} style={{
                                fontSize: 140, fontWeight: 900, fontFamily: "system-ui",
                                color: "transparent",
                                backgroundImage: `linear-gradient(180deg, ${COLORS.white}, ${COLORS.dim})`,
                                backgroundClip: "text",
                                WebkitBackgroundClip: "text",
                                transform: `scale(${charScale}) rotateX(${interpolate(charScale, [0, 1], [90, 0])}deg)`,
                                opacity: interpolate(charScale, [0, 1], [0, 1]),
                            }}>
                                {char}
                            </div>
                        );
                    })}
                </div>

                <div style={{
                    fontSize: 32, fontWeight: 500, color: COLORS.accent, fontFamily: "system-ui", letterSpacing: "0.2em",
                    opacity: interpolate(frame, [80, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                    transform: `translateY(${interpolate(frame, [80, 100], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.exp) })}px)`,
                }}>
                    THE FUTURE OF WEB3 GAMING
                </div>

            </div>
        </AbsoluteFill>
    );
};

// ────────────────────────────────────────
// Main Composition (15 seconds @ 30fps = 450 frames)
// ────────────────────────────────────────
export const PromoVideo: React.FC = () => {
    return (
        <AbsoluteFill style={{ background: COLORS.bg }}>
            {/* 0-90 (3s) */}
            <Sequence from={0} durationInFrames={90}>
                <SceneTypography />
            </Sequence>

            {/* 90-180 (3s) */}
            <Sequence from={90} durationInFrames={90}>
                <SceneTechStack />
                <Sequence from={0} durationInFrames={20}>
                    <WipeTransition type="in" />
                </Sequence>
            </Sequence>

            {/* 180-270 (3s) */}
            <Sequence from={180} durationInFrames={90}>
                <SceneExport />
                <Sequence from={0} durationInFrames={20}>
                    <WipeTransition type="in" />
                </Sequence>
            </Sequence>

            {/* 270-450 (6s) */}
            <Sequence from={270} durationInFrames={180}>
                <SceneOutro />
                <Sequence from={0} durationInFrames={25}>
                    <WipeTransition type="in" />
                </Sequence>
            </Sequence>
        </AbsoluteFill>
    );
};
