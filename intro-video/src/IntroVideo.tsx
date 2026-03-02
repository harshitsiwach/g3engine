import React from "react";
import {
    AbsoluteFill,
    Sequence,
    useCurrentFrame,
    useVideoConfig,
    interpolate,
    spring,
    Easing,
} from "remotion";

// ─── Colors ───
const COLORS = {
    bg: "#0a0a12",
    bgLight: "#12121c",
    accent: "#14f195",
    accentCyan: "#06b6d4",
    purple: "#8b5cf6",
    blue: "#3b82f6",
    red: "#dc2626",
    yellow: "#eab308",
    white: "#f0f0f5",
    dimWhite: "#9ca3b0",
    darkBorder: "rgba(255,255,255,0.06)",
};

// ────────────────────────────────────────
// Scene 1: Grand Logo Reveal (~4 seconds)
// ────────────────────────────────────────

const SceneLogo: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Particle grid
    const gridScale = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 40 });
    const logoScale = spring({ frame: frame - 20, fps, config: { damping: 15, stiffness: 120 } });
    const logoOpacity = interpolate(frame, [20, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const subtitleOpacity = interpolate(frame, [50, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const subtitleY = interpolate(frame, [50, 70], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.exp) });

    const glowPulse = interpolate(frame, [60, 120], [0.3, 0.8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

    return (
        <AbsoluteFill style={{ background: COLORS.bg, justifyContent: "center", alignItems: "center" }}>
            {/* Animated grid bg */}
            <div style={{
                position: "absolute", inset: 0,
                backgroundImage: `linear-gradient(rgba(20,241,149,${0.03 * gridScale}) 1px, transparent 1px), linear-gradient(90deg, rgba(20,241,149,${0.03 * gridScale}) 1px, transparent 1px)`,
                backgroundSize: "60px 60px",
                transform: `scale(${1 + gridScale * 0.05})`,
            }} />

            {/* Radial glow */}
            <div style={{
                position: "absolute",
                width: 600, height: 600, borderRadius: "50%",
                background: `radial-gradient(circle, rgba(20,241,149,${glowPulse * 0.15}) 0%, transparent 70%)`,
            }} />

            {/* Logo */}
            <div style={{
                opacity: logoOpacity,
                transform: `scale(${logoScale})`,
                display: "flex", flexDirection: "column", alignItems: "center", gap: 20,
                zIndex: 10,
            }}>
                <div style={{
                    width: 120, height: 120, borderRadius: 28,
                    background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentCyan})`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 60,
                    boxShadow: `0 0 60px rgba(20,241,149,${glowPulse * 0.4}), 0 0 120px rgba(6,182,212,${glowPulse * 0.2})`,
                }}>
                    🎮
                </div>

                <div style={{
                    fontSize: 72, fontWeight: 800, color: COLORS.white,
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    letterSpacing: "-0.04em",
                }}>
                    G3 <span style={{ color: COLORS.accent }}>Engine</span>
                </div>
            </div>

            {/* Subtitle */}
            <div style={{
                position: "absolute", bottom: 280,
                opacity: subtitleOpacity,
                transform: `translateY(${subtitleY}px)`,
                fontSize: 26, fontWeight: 500, color: COLORS.dimWhite,
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: "0.04em",
            }}>
                Build Games. Ship Onchain.
            </div>
        </AbsoluteFill>
    );
};

// ────────────────────────────────────────
// Scene 2: Feature Showcase – 2D & 3D (~3s)
// ────────────────────────────────────────

const SceneFeatures: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const features = [
        { emoji: "🖼️", label: "2D Editor", desc: "Sprites, Layers, Tiles", color: COLORS.accent },
        { emoji: "🧊", label: "3D Editor", desc: "Three.js Viewport", color: COLORS.accentCyan },
        { emoji: "🎨", label: "Pixel Art", desc: "Draw & Animate", color: COLORS.purple },
    ];

    return (
        <AbsoluteFill style={{ background: COLORS.bg, justifyContent: "center", alignItems: "center" }}>
            {/* Title */}
            <div style={{
                position: "absolute", top: 120,
                fontSize: 48, fontWeight: 800, color: COLORS.white,
                fontFamily: "system-ui, sans-serif",
                letterSpacing: "-0.03em",
                opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                transform: `translateY(${interpolate(frame, [0, 20], [40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.exp) })}px)`,
            }}>
                Two Modes. <span style={{ color: COLORS.accent }}>One Engine.</span>
            </div>

            {/* Feature Cards */}
            <div style={{ display: "flex", gap: 40, marginTop: 40 }}>
                {features.map((f, i) => {
                    const delay = 15 + i * 12;
                    const s = spring({ frame: frame - delay, fps, config: { damping: 15, stiffness: 120 } });
                    const op = interpolate(frame, [delay, delay + 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

                    return (
                        <div key={i} style={{
                            width: 320, padding: "40px 30px",
                            borderRadius: 20,
                            background: COLORS.bgLight,
                            border: `1.5px solid ${f.color}33`,
                            opacity: op,
                            transform: `scale(${s}) translateY(${interpolate(s, [0, 1], [30, 0])}px)`,
                            textAlign: "center",
                            boxShadow: `0 0 40px ${f.color}15`,
                        }}>
                            <div style={{ fontSize: 56, marginBottom: 16 }}>{f.emoji}</div>
                            <div style={{ fontSize: 28, fontWeight: 700, color: f.color, fontFamily: "system-ui, sans-serif", marginBottom: 8 }}>{f.label}</div>
                            <div style={{ fontSize: 18, color: COLORS.dimWhite, fontFamily: "system-ui, sans-serif" }}>{f.desc}</div>
                        </div>
                    );
                })}
            </div>
        </AbsoluteFill>
    );
};

// ────────────────────────────────────────
// Scene 3: Blueprint Nodes (~3s)
// ────────────────────────────────────────

const SceneBlueprint: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const titleOp = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

    const nodes = [
        { x: 150, y: 300, label: "⚡ Event Begin Play", color: COLORS.red, w: 250 },
        { x: 550, y: 240, label: "🔀 Branch", color: "#6b7280", w: 200 },
        { x: 950, y: 180, label: "✨ Spawn Object", color: COLORS.blue, w: 240 },
        { x: 950, y: 420, label: "🔊 Play Sound", color: COLORS.blue, w: 220 },
        { x: 550, y: 500, label: "➡️ Move To", color: COLORS.blue, w: 220 },
        { x: 1350, y: 300, label: "⬡ Mint NFT", color: COLORS.purple, w: 220 },
    ];

    // Bezier connection lines
    const connections = [
        { from: { x: 400, y: 330 }, to: { x: 550, y: 270 } },
        { from: { x: 750, y: 250 }, to: { x: 950, y: 210 } },
        { from: { x: 750, y: 300 }, to: { x: 950, y: 450 } },
        { from: { x: 550, y: 530 }, to: { x: 400, y: 350 } },
        { from: { x: 1190, y: 210 }, to: { x: 1350, y: 320 } },
    ];

    return (
        <AbsoluteFill style={{ background: COLORS.bg, justifyContent: "center", alignItems: "center" }}>
            {/* Dot grid */}
            <div style={{
                position: "absolute", inset: 0,
                backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
            }} />

            {/* Title */}
            <div style={{
                position: "absolute", top: 80,
                fontSize: 48, fontWeight: 800, color: COLORS.white,
                fontFamily: "system-ui, sans-serif",
                letterSpacing: "-0.03em",
                opacity: titleOp,
            }}>
                Visual Scripting — Like <span style={{ color: COLORS.purple }}>Unreal Blueprints</span>
            </div>

            {/* SVG Connections */}
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
                {connections.map((c, i) => {
                    const progress = interpolate(frame, [20 + i * 8, 35 + i * 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                    const midX = (c.from.x + c.to.x) / 2;
                    return (
                        <path
                            key={i}
                            d={`M${c.from.x},${c.from.y} C${midX},${c.from.y} ${midX},${c.to.y} ${c.to.x},${c.to.y}`}
                            fill="none"
                            stroke="white"
                            strokeWidth={2.5}
                            strokeDasharray="8,4"
                            opacity={progress * 0.6}
                        />
                    );
                })}
            </svg>

            {/* Nodes */}
            {nodes.map((n, i) => {
                const delay = 10 + i * 6;
                const s = spring({ frame: frame - delay, fps, config: { damping: 20, stiffness: 180 } });
                return (
                    <div key={i} style={{
                        position: "absolute",
                        left: n.x, top: n.y,
                        width: n.w,
                        background: "#1a1a28",
                        border: `1.5px solid ${n.color}50`,
                        borderRadius: 10,
                        overflow: "hidden",
                        transform: `scale(${s})`,
                        opacity: interpolate(s, [0, 0.5], [0, 1], { extrapolateRight: "clamp" }),
                        boxShadow: `0 4px 20px rgba(0,0,0,0.4)`,
                    }}>
                        <div style={{
                            padding: "8px 14px",
                            background: `${n.color}18`,
                            borderBottom: `1px solid ${n.color}30`,
                            fontSize: 16, fontWeight: 700, color: n.color,
                            fontFamily: "system-ui, sans-serif",
                        }}>
                            {n.label}
                        </div>
                        <div style={{ padding: "10px 14px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                                <div style={{ width: 8, height: 8, borderRadius: 2, background: "white", border: "2px solid rgba(0,0,0,0.3)" }} />
                                <span style={{ fontSize: 12, color: COLORS.dimWhite, fontFamily: "system-ui, sans-serif" }}>Exec</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <div style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.accent, border: "2px solid rgba(0,0,0,0.3)" }} />
                                <span style={{ fontSize: 12, color: COLORS.dimWhite, fontFamily: "system-ui, sans-serif" }}>Data</span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </AbsoluteFill>
    );
};

// ────────────────────────────────────────
// Scene 4: Web3 / Publish (~2.5s)
// ────────────────────────────────────────

const SceneWeb3: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const platforms = [
        { emoji: "🐦", name: "X / Twitter", color: "#1da1f2" },
        { emoji: "📱", name: "Telegram", color: "#0088cc" },
        { emoji: "🌐", name: "Web", color: COLORS.accent },
        { emoji: "🔵", name: "Farcaster", color: COLORS.purple },
        { emoji: "🟧", name: "Reddit", color: "#ff4500" },
        { emoji: "💠", name: "BaseApp", color: COLORS.accentCyan },
    ];

    return (
        <AbsoluteFill style={{ background: COLORS.bg, justifyContent: "center", alignItems: "center" }}>
            {/* Radial glow */}
            <div style={{
                position: "absolute",
                width: 800, height: 800, borderRadius: "50%",
                background: `radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)`,
            }} />

            {/* Title */}
            <div style={{
                position: "absolute", top: 140,
                fontSize: 48, fontWeight: 800, color: COLORS.white,
                fontFamily: "system-ui, sans-serif",
                letterSpacing: "-0.03em",
                opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                transform: `translateY(${interpolate(frame, [0, 15], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.exp) })}px)`,
            }}>
                Publish <span style={{ color: COLORS.purple }}>Everywhere</span>
            </div>

            {/* Platform Grid */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "center", maxWidth: 800, marginTop: 80 }}>
                {platforms.map((p, i) => {
                    const delay = 10 + i * 8;
                    const s = spring({ frame: frame - delay, fps, config: { damping: 15, stiffness: 140 } });
                    return (
                        <div key={i} style={{
                            width: 200, padding: "30px 20px",
                            borderRadius: 16,
                            background: COLORS.bgLight,
                            border: `1.5px solid ${p.color}30`,
                            textAlign: "center",
                            transform: `scale(${s})`,
                            opacity: interpolate(s, [0, 0.5], [0, 1], { extrapolateRight: "clamp" }),
                            boxShadow: `0 0 30px ${p.color}10`,
                        }}>
                            <div style={{ fontSize: 40, marginBottom: 10 }}>{p.emoji}</div>
                            <div style={{ fontSize: 18, fontWeight: 600, color: p.color, fontFamily: "system-ui, sans-serif" }}>{p.name}</div>
                        </div>
                    );
                })}
            </div>
        </AbsoluteFill>
    );
};

// ────────────────────────────────────────
// Scene 5: CTA / Finale (~2.5s)
// ────────────────────────────────────────

const SceneCTA: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const mainScale = spring({ frame: frame - 10, fps, config: { damping: 12, stiffness: 100 } });
    const mainOp = interpolate(frame, [10, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const ctaScale = spring({ frame: frame - 40, fps, config: { damping: 15, stiffness: 120 } });
    const ctaOp = interpolate(frame, [40, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

    const glowPulse = interpolate(frame, [0, 75], [0.2, 0.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

    return (
        <AbsoluteFill style={{
            background: COLORS.bg,
            justifyContent: "center", alignItems: "center",
        }}>
            {/* Grid */}
            <div style={{
                position: "absolute", inset: 0,
                backgroundImage: `linear-gradient(rgba(20,241,149,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(20,241,149,0.03) 1px, transparent 1px)`,
                backgroundSize: "80px 80px",
            }} />

            {/* Large glow */}
            <div style={{
                position: "absolute",
                width: 1000, height: 1000, borderRadius: "50%",
                background: `radial-gradient(circle, rgba(20,241,149,${glowPulse * 0.12}) 0%, rgba(6,182,212,${glowPulse * 0.06}) 40%, transparent 70%)`,
            }} />

            {/* Main text */}
            <div style={{
                opacity: mainOp,
                transform: `scale(${mainScale})`,
                textAlign: "center",
                zIndex: 10,
            }}>
                <div style={{
                    fontSize: 80, fontWeight: 900,
                    color: COLORS.white,
                    fontFamily: "system-ui, sans-serif",
                    letterSpacing: "-0.04em",
                    lineHeight: 1.1,
                    marginBottom: 24,
                }}>
                    Start Building<br />
                    <span style={{
                        background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentCyan})`,
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}>
                        Your Game
                    </span>
                </div>
            </div>

            {/* CTA button */}
            <div style={{
                position: "absolute", bottom: 200,
                opacity: ctaOp,
                transform: `scale(${ctaScale})`,
            }}>
                <div style={{
                    padding: "18px 50px",
                    borderRadius: 14,
                    background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentCyan})`,
                    fontSize: 24, fontWeight: 700,
                    color: "#0a0a12",
                    fontFamily: "system-ui, sans-serif",
                    boxShadow: `0 0 40px rgba(20,241,149,${glowPulse * 0.4})`,
                }}>
                    🎮 g3engine.io
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ────────────────────────────────────────
// Scene Transition Overlay
// ────────────────────────────────────────

const FadeTransition: React.FC<{ direction: "in" | "out" }> = ({ direction }) => {
    const frame = useCurrentFrame();
    const { durationInFrames } = useVideoConfig();

    const opacity = direction === "in"
        ? interpolate(frame, [0, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
        : interpolate(frame, [0, durationInFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

    return (
        <AbsoluteFill style={{ background: COLORS.bg, opacity }} />
    );
};

// ────────────────────────────────────────
// Main Composition (15 seconds @ 30fps = 450 frames)
// ────────────────────────────────────────

export const IntroVideo: React.FC = () => {
    return (
        <AbsoluteFill style={{ background: COLORS.bg }}>
            {/* Scene 1: Logo Reveal (0–119, ~4s) */}
            <Sequence from={0} durationInFrames={120}>
                <SceneLogo />
            </Sequence>

            {/* Fade out Scene 1 */}
            <Sequence from={105} durationInFrames={15}>
                <FadeTransition direction="out" />
            </Sequence>

            {/* Scene 2: Features (120–209, ~3s) */}
            <Sequence from={120} durationInFrames={90}>
                <SceneFeatures />
            </Sequence>

            {/* Fade */}
            <Sequence from={195} durationInFrames={15}>
                <FadeTransition direction="out" />
            </Sequence>

            {/* Scene 3: Blueprint Nodes (210–299, ~3s) */}
            <Sequence from={210} durationInFrames={90}>
                <SceneBlueprint />
            </Sequence>

            {/* Fade */}
            <Sequence from={285} durationInFrames={15}>
                <FadeTransition direction="out" />
            </Sequence>

            {/* Scene 4: Web3 Publish (300–374, ~2.5s) */}
            <Sequence from={300} durationInFrames={75}>
                <SceneWeb3 />
            </Sequence>

            {/* Fade */}
            <Sequence from={360} durationInFrames={15}>
                <FadeTransition direction="out" />
            </Sequence>

            {/* Scene 5: CTA Finale (375–449, ~2.5s) */}
            <Sequence from={375} durationInFrames={75}>
                <SceneCTA />
            </Sequence>
        </AbsoluteFill>
    );
};
