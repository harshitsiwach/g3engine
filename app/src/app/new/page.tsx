'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProjectStore, GameDimension, GameGenre, GameTemplate } from '@/store/projectStore';

// ─── Step Definitions ───

type Step = 'dimension' | 'genre' | 'template' | 'name';

const GENRES: { id: GameGenre; label: string; icon: string; desc: string }[] = [
    { id: 'platformer', label: 'Platformer', icon: '🏃', desc: 'Jump, run, and dodge obstacles' },
    { id: 'puzzle', label: 'Puzzle', icon: '🧩', desc: 'Brain teasers and logic games' },
    { id: 'rpg', label: 'RPG', icon: '⚔️', desc: 'Role-playing adventures' },
    { id: 'racing', label: 'Racing', icon: '🏎️', desc: 'High-speed racing action' },
    { id: 'shooter', label: 'Shooter', icon: '🎯', desc: 'Aim, shoot, and survive' },
    { id: 'adventure', label: 'Adventure', icon: '🗺️', desc: 'Explore and discover' },
    { id: 'strategy', label: 'Strategy', icon: '♟️', desc: 'Plan, build, and conquer' },
    { id: 'sandbox', label: 'Sandbox', icon: '🏗️', desc: 'Create without limits' },
    { id: 'social', label: 'Social', icon: '👥', desc: 'Multiplayer social spaces' },
    { id: 'other', label: 'Other', icon: '✨', desc: 'Something unique' },
];

const TEMPLATES_3D: { id: GameTemplate; label: string; icon: string; desc: string }[] = [
    { id: 'blank', label: 'Blank Canvas', icon: '⬜', desc: 'Start from scratch' },
    { id: 'platformer-starter', label: '3D Platformer', icon: '🏃', desc: 'Player, platforms, and collectibles' },
    { id: 'token-gate-room', label: 'Token Gate Room', icon: '🔐', desc: 'NFT-gated 3D space' },
    { id: 'nft-gallery', label: 'NFT Gallery', icon: '🖼️', desc: 'Showcase digital art in 3D' },
    { id: 'multiplayer-arena', label: 'Multiplayer Arena', icon: '⚡', desc: 'Competitive arena setup' },
];

const TEMPLATES_2D: { id: GameTemplate; label: string; icon: string; desc: string }[] = [
    { id: 'blank', label: 'Blank Canvas', icon: '⬜', desc: 'Start from scratch' },
    { id: 'platformer-starter', label: '2D Platformer', icon: '🕹️', desc: 'Side-scrolling platformer' },
    { id: 'endless-runner', label: 'Endless Runner', icon: '🏃', desc: 'Auto-run and dodge' },
    { id: 'nft-gallery', label: 'NFT Showcase', icon: '🖼️', desc: 'Display NFTs in a 2D gallery' },
];

// ─── Styles ───

const s = {
    page: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0a0f',
        position: 'relative' as const,
        overflow: 'hidden',
        padding: '40px 20px',
    },
    glow1: {
        position: 'absolute' as const,
        width: 700, height: 700, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)',
        top: -300, right: -200, pointerEvents: 'none' as const,
    },
    glow2: {
        position: 'absolute' as const,
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(20,241,149,0.05) 0%, transparent 70%)',
        bottom: -200, left: -150, pointerEvents: 'none' as const,
    },
    card: {
        position: 'relative' as const,
        zIndex: 10,
        maxWidth: 720,
        width: '100%',
    },
    stepBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 14px',
        borderRadius: 20,
        background: 'rgba(139,92,246,0.1)',
        border: '1px solid rgba(139,92,246,0.2)',
        color: '#a78bfa',
        fontSize: 11,
        fontWeight: 600 as const,
        letterSpacing: '0.05em',
        textTransform: 'uppercase' as const,
        marginBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 800 as const,
        color: '#f0f0f5',
        letterSpacing: '-0.03em',
        marginBottom: 8,
        lineHeight: 1.2,
    },
    subtitle: {
        fontSize: 15,
        color: '#7a7f8d',
        marginBottom: 32,
        lineHeight: 1.5,
    },
    grid2: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 16,
        marginBottom: 32,
    },
    gridGenre: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
        gap: 12,
        marginBottom: 32,
    },
    option: (selected: boolean, accent?: string) => ({
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        gap: 10,
        padding: '28px 20px',
        borderRadius: 16,
        background: selected
            ? `rgba(${accent === 'green' ? '20,241,149' : '139,92,246'},0.08)`
            : 'rgba(255,255,255,0.02)',
        border: `1.5px solid ${selected
                ? accent === 'green' ? 'rgba(20,241,149,0.4)' : 'rgba(139,92,246,0.4)'
                : 'rgba(255,255,255,0.06)'
            }`,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: selected
            ? `0 0 24px ${accent === 'green' ? 'rgba(20,241,149,0.1)' : 'rgba(139,92,246,0.12)'}`
            : 'none',
    }),
    optionSmall: (selected: boolean) => ({
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        gap: 6,
        padding: '16px 10px',
        borderRadius: 12,
        background: selected ? 'rgba(139,92,246,0.08)' : 'rgba(255,255,255,0.02)',
        border: `1.5px solid ${selected ? 'rgba(139,92,246,0.4)' : 'rgba(255,255,255,0.06)'}`,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: selected ? '0 0 20px rgba(139,92,246,0.1)' : 'none',
    }),
    iconLarge: {
        fontSize: 40,
        marginBottom: 4,
    },
    iconSmall: {
        fontSize: 24,
    },
    optionLabel: {
        fontSize: 14,
        fontWeight: 600 as const,
        color: '#f0f0f5',
    },
    optionDesc: {
        fontSize: 11,
        color: '#6b7280',
        textAlign: 'center' as const,
    },
    btnRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
    },
    btnPrimary: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '12px 32px',
        borderRadius: 12,
        background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
        color: 'white',
        fontSize: 14,
        fontWeight: 600 as const,
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 0 30px rgba(139,92,246,0.25)',
        transition: 'all 0.2s ease',
    },
    btnSecondary: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '12px 24px',
        borderRadius: 12,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        color: '#9ca3b0',
        fontSize: 14,
        fontWeight: 500 as const,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    btnDisabled: {
        opacity: 0.35,
        cursor: 'not-allowed',
        pointerEvents: 'none' as const,
    },
    progressBar: {
        display: 'flex',
        gap: 6,
        marginBottom: 32,
    },
    dot: (active: boolean, done: boolean) => ({
        width: done ? 28 : active ? 28 : 28,
        height: 4,
        borderRadius: 2,
        background: done ? '#8b5cf6' : active ? '#a78bfa' : 'rgba(255,255,255,0.08)',
        transition: 'all 0.3s ease',
    }),
    input: {
        width: '100%',
        padding: '14px 18px',
        borderRadius: 12,
        background: 'rgba(255,255,255,0.04)',
        border: '1.5px solid rgba(255,255,255,0.08)',
        color: '#f0f0f5',
        fontSize: 16,
        fontFamily: 'Inter, sans-serif',
        outline: 'none',
        marginBottom: 32,
        transition: 'border-color 0.2s ease',
    },
};

// ─── Progress Bar ───

function ProgressBar({ step }: { step: Step }) {
    const steps: Step[] = ['dimension', 'genre', 'template', 'name'];
    const idx = steps.indexOf(step);
    return (
        <div style={s.progressBar}>
            {steps.map((st, i) => (
                <div key={st} style={s.dot(i === idx, i < idx)} />
            ))}
        </div>
    );
}

// ─── Main Wizard ───

export default function NewProjectPage() {
    const router = useRouter();
    const { config, setDimension, setGenre, setTemplate, setName } = useProjectStore();
    const [step, setStep] = useState<Step>('dimension');

    const goNext = () => {
        switch (step) {
            case 'dimension': setStep('genre'); break;
            case 'genre': setStep('template'); break;
            case 'template': setStep('name'); break;
            case 'name':
                // Navigate to appropriate editor
                if (config.dimension === '2d') {
                    router.push('/editor-2d');
                } else {
                    router.push('/editor');
                }
                break;
        }
    };

    const goBack = () => {
        switch (step) {
            case 'genre': setStep('dimension'); break;
            case 'template': setStep('genre'); break;
            case 'name': setStep('template'); break;
        }
    };

    const canProceed = () => {
        switch (step) {
            case 'dimension': return config.dimension !== null;
            case 'genre': return config.genre !== null;
            case 'template': return config.template !== null;
            case 'name': return config.name.trim().length > 0;
        }
    };

    const templates = config.dimension === '2d' ? TEMPLATES_2D : TEMPLATES_3D;

    return (
        <div style={s.page}>
            <div style={s.glow1} />
            <div style={s.glow2} />

            <div style={s.card}>
                <ProgressBar step={step} />

                {/* ── Step 1: 2D or 3D ── */}
                {step === 'dimension' && (
                    <>
                        <div style={s.stepBadge}>Step 1 of 4</div>
                        <h1 style={s.title}>What are you building?</h1>
                        <p style={s.subtitle}>Choose your game's dimension. You can always switch later.</p>
                        <div style={s.grid2}>
                            <div
                                style={s.option(config.dimension === '2d', 'green')}
                                onClick={() => setDimension('2d')}
                            >
                                <span style={s.iconLarge}>🎮</span>
                                <span style={s.optionLabel}>2D Game</span>
                                <span style={s.optionDesc}>Sprites, tilemaps, and side-scrolling action</span>
                            </div>
                            <div
                                style={s.option(config.dimension === '3d')}
                                onClick={() => setDimension('3d')}
                            >
                                <span style={s.iconLarge}>🧊</span>
                                <span style={s.optionLabel}>3D Game</span>
                                <span style={s.optionDesc}>Three.js powered immersive 3D worlds</span>
                            </div>
                        </div>
                    </>
                )}

                {/* ── Step 2: Genre ── */}
                {step === 'genre' && (
                    <>
                        <div style={s.stepBadge}>Step 2 of 4</div>
                        <h1 style={s.title}>Pick a genre</h1>
                        <p style={s.subtitle}>This helps us tailor your starting assets and templates.</p>
                        <div style={s.gridGenre}>
                            {GENRES.map((g) => (
                                <div
                                    key={g.id}
                                    style={s.optionSmall(config.genre === g.id)}
                                    onClick={() => setGenre(g.id)}
                                >
                                    <span style={s.iconSmall}>{g.icon}</span>
                                    <span style={{ fontSize: 12, fontWeight: 600, color: '#f0f0f5' }}>{g.label}</span>
                                    <span style={{ fontSize: 10, color: '#5a5f6d', textAlign: 'center' }}>{g.desc}</span>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* ── Step 3: Template ── */}
                {step === 'template' && (
                    <>
                        <div style={s.stepBadge}>Step 3 of 4</div>
                        <h1 style={s.title}>Choose a template</h1>
                        <p style={s.subtitle}>Start with a pre-built setup or a blank canvas.</p>
                        <div style={s.gridGenre}>
                            {templates.map((t) => (
                                <div
                                    key={t.id}
                                    style={s.optionSmall(config.template === t.id)}
                                    onClick={() => setTemplate(t.id)}
                                >
                                    <span style={s.iconSmall}>{t.icon}</span>
                                    <span style={{ fontSize: 12, fontWeight: 600, color: '#f0f0f5' }}>{t.label}</span>
                                    <span style={{ fontSize: 10, color: '#5a5f6d', textAlign: 'center' }}>{t.desc}</span>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* ── Step 4: Name ── */}
                {step === 'name' && (
                    <>
                        <div style={s.stepBadge}>Step 4 of 4</div>
                        <h1 style={s.title}>Name your project</h1>
                        <p style={s.subtitle}>Give your game a name. Don't worry, you can rename it anytime.</p>
                        <input
                            style={s.input}
                            placeholder="e.g. My Awesome Game"
                            value={config.name}
                            onChange={(e) => setName(e.target.value)}
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && canProceed()) goNext();
                            }}
                            onFocus={(e) => {
                                (e.target as HTMLInputElement).style.borderColor = 'rgba(139,92,246,0.4)';
                            }}
                            onBlur={(e) => {
                                (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.08)';
                            }}
                        />

                        {/* Summary */}
                        <div style={{
                            padding: 16,
                            borderRadius: 12,
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            marginBottom: 32,
                            display: 'flex',
                            gap: 24,
                            fontSize: 12,
                            color: '#7a7f8d',
                        }}>
                            <div><strong style={{ color: '#f0f0f5' }}>Dimension:</strong> {config.dimension?.toUpperCase()}</div>
                            <div><strong style={{ color: '#f0f0f5' }}>Genre:</strong> {GENRES.find(g => g.id === config.genre)?.label}</div>
                            <div><strong style={{ color: '#f0f0f5' }}>Template:</strong> {templates.find(t => t.id === config.template)?.label}</div>
                        </div>
                    </>
                )}

                {/* ── Navigation Buttons ── */}
                <div style={s.btnRow}>
                    {step !== 'dimension' ? (
                        <button style={s.btnSecondary} onClick={goBack}>
                            ← Back
                        </button>
                    ) : (
                        <div />
                    )}
                    <button
                        style={{ ...s.btnPrimary, ...(canProceed() ? {} : s.btnDisabled) }}
                        onClick={goNext}
                    >
                        {step === 'name' ? 'Create Project →' : 'Continue →'}
                    </button>
                </div>
            </div>
        </div>
    );
}
