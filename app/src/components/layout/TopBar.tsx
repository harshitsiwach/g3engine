'use client';

import React, { useState } from 'react';
import { useEditorStore, TransformMode } from '@/store/editorStore';
import { useWeb3Store } from '@/store/web3Store';
import { useAIStore } from '@/store/aiStore';
import PublishModal from '@/components/editor/PublishModal';
import WalletButton from '@/components/web3/WalletButton';

import {
    PlayIcon,
    StopIcon,
    UndoIcon,
    RedoIcon,
    PublishIcon,
    Web3Icon,
    SparklesIcon,
    CompassIcon,
} from '@/components/icons';

// --- Transform mode icons ---
const MoveIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="5 9 2 12 5 15" /><polyline points="9 5 12 2 15 5" />
        <polyline points="15 19 12 22 9 19" /><polyline points="19 9 22 12 19 15" />
        <line x1="2" y1="12" x2="22" y2="12" /><line x1="12" y1="2" x2="12" y2="22" />
    </svg>
);
const RotateIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38" />
    </svg>
);
const ScaleIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" />
        <line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
    </svg>
);

export default function TopBar() {
    const { isPlaying } = useEditorStore();
    if (isPlaying) return null;
    return <TopBarContent />;
}

function TopBarContent() {
    const {
        togglePlay, undo, redo, historyIndex, history,
        transformMode, setTransformMode,
        web3Enabled, toggleWeb3, isPlaying, setRunTour,
    } = useEditorStore();

    const [showPublish, setShowPublish] = useState(false);

    const modes: { mode: TransformMode; icon: React.ReactNode; label: string; key: string }[] = [
        { mode: 'translate', icon: <MoveIcon />, label: 'Move', key: 'W' },
        { mode: 'rotate', icon: <RotateIcon />, label: 'Rotate', key: 'E' },
        { mode: 'scale', icon: <ScaleIcon />, label: 'Scale', key: 'R' },
    ];

    return (
        <>
            <style>{`
                @keyframes logoPulse {
                    0%, 100% { box-shadow: 0 0 8px rgba(139,92,246,0.3), 0 0 20px rgba(20,241,149,0.1); }
                    50% { box-shadow: 0 0 16px rgba(139,92,246,0.5), 0 0 40px rgba(20,241,149,0.15); }
                }
                @keyframes playBounce {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.04); }
                }
                .topbar-play-btn:hover { animation: playBounce 0.6s ease infinite; }
                .topbar-mode-btn { position: relative; }
                .topbar-mode-btn.active::after {
                    content: '';
                    position: absolute;
                    bottom: -2px; left: 20%; right: 20%; height: 2px;
                    background: linear-gradient(90deg, #8b5cf6, #14f195);
                    border-radius: 2px;
                }
            `}</style>

            <div className="editor-topbar glass-panel">
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 4 }}>
                    <div style={{
                        width: 30, height: 30, borderRadius: 10,
                        background: 'linear-gradient(135deg, #8b5cf6, #14f195)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 15, fontWeight: 900, color: '#000',
                        animation: 'logoPulse 3s ease infinite',
                    }}>
                        G3
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1, gap: 1 }}>
                        <span style={{ fontWeight: 800, fontSize: 13, color: '#fff', letterSpacing: '-0.03em' }}>
                            G3Engine
                        </span>
                        <span style={{ fontSize: 8, fontWeight: 600, color: 'rgba(139,92,246,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            Game Studio
                        </span>
                    </div>
                </div>

                <div className="toolbar-divider" />

                {/* Play */}
                <button
                    className={`btn tour-play-btn topbar-play-btn ${isPlaying ? 'btn-danger' : ''}`}
                    onClick={togglePlay}
                    data-tooltip={isPlaying ? 'Stop Game' : 'Play Game'}
                    style={isPlaying ? {
                        background: 'rgba(244,63,94,0.12)',
                        borderColor: 'rgba(244,63,94,0.3)',
                        color: '#f43f5e',
                    } : {
                        background: 'linear-gradient(135deg, rgba(20,241,149,0.15), rgba(20,241,149,0.05))',
                        borderColor: 'rgba(20,241,149,0.3)',
                        color: '#14f195',
                        fontWeight: 700,
                    }}
                >
                    {isPlaying ? <StopIcon /> : <PlayIcon />}
                    <span style={{ fontSize: 12 }}>{isPlaying ? 'Stop' : 'Play'}</span>
                </button>

                <div className="toolbar-divider" />

                {/* Transform Modes */}
                {modes.map(({ mode, icon, label, key }) => (
                    <button
                        key={mode}
                        className={`btn topbar-mode-btn ${transformMode === mode ? 'active' : ''}`}
                        onClick={() => setTransformMode(mode)}
                        data-tooltip={`${label} (${key})`}
                        style={
                            transformMode === mode
                                ? {
                                    background: 'rgba(139,92,246,0.12)',
                                    borderColor: 'rgba(139,92,246,0.3)',
                                    color: '#a78bfa',
                                    boxShadow: '0 0 16px rgba(139,92,246,0.1)',
                                }
                                : {}
                        }
                    >
                        {icon}
                        <span style={{ fontSize: 11 }}>{label}</span>
                        <kbd style={{
                            fontSize: 9, fontWeight: 700,
                            background: 'rgba(255,255,255,0.06)',
                            padding: '1px 5px', borderRadius: 4,
                            color: 'rgba(255,255,255,0.3)',
                            fontFamily: "'JetBrains Mono', monospace",
                            border: '1px solid rgba(255,255,255,0.06)',
                        }}>
                            {key}
                        </kbd>
                    </button>
                ))}

                <div className="toolbar-divider" />

                {/* Undo / Redo */}
                <button className="btn btn-icon" onClick={undo} disabled={historyIndex <= 0} data-tooltip="Undo (⌘Z)"
                    style={historyIndex <= 0 ? { opacity: 0.25 } : {}}>
                    <UndoIcon />
                </button>
                <button className="btn btn-icon" onClick={redo} disabled={historyIndex >= history.length - 1} data-tooltip="Redo (⌘⇧Z)"
                    style={historyIndex >= history.length - 1 ? { opacity: 0.25 } : {}}>
                    <RedoIcon />
                </button>

                <div className="toolbar-divider" />

                {/* Web3 Toggle */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 5,
                        padding: '3px 8px', borderRadius: 6,
                        background: web3Enabled ? 'rgba(20,241,149,0.08)' : 'transparent',
                        transition: 'all 0.2s',
                    }}>
                        <Web3Icon />
                        <span style={{
                            fontSize: 11, fontWeight: 700,
                            color: web3Enabled ? '#14f195' : 'var(--text-tertiary)',
                            transition: 'color 0.2s',
                        }}>
                            Web3
                        </span>
                    </div>
                    <div
                        className={`toggle-switch ${web3Enabled ? 'active' : ''}`}
                        onClick={() => {
                            toggleWeb3();
                            useWeb3Store.getState().setWeb3PanelOpen(!web3Enabled);
                        }}
                    />
                </div>

                {web3Enabled && <WalletButton />}

                <div className="toolbar-divider" />

                {/* AI */}
                <button
                    className="btn"
                    onClick={() => useAIStore.getState().toggleOpen()}
                    data-tooltip="AI Assistant"
                    style={{
                        background: useAIStore.getState().isOpen ? 'rgba(139,92,246,0.12)' : undefined,
                        borderColor: useAIStore.getState().isOpen ? 'rgba(139,92,246,0.3)' : undefined,
                        color: useAIStore.getState().isOpen ? '#a78bfa' : undefined,
                    }}
                >
                    <SparklesIcon size={14} />
                    <span style={{ fontSize: 11 }}>AI</span>
                </button>

                <div className="toolbar-divider" />

                {/* Tour */}
                <button className="btn" onClick={() => setRunTour(true)} data-tooltip="Editor Tour">
                    <CompassIcon size={14} />
                    <span style={{ fontSize: 11 }}>Tour</span>
                </button>

                <div className="toolbar-divider" />

                {/* Publish */}
                <button className="btn btn-primary tour-publish-btn" data-tooltip="Publish Game" onClick={() => setShowPublish(true)}
                    style={{ padding: '6px 16px' }}>
                    <PublishIcon />
                    <span style={{ fontWeight: 800 }}>Publish</span>
                </button>
            </div>
            <PublishModal isOpen={showPublish} onClose={() => setShowPublish(false)} />
        </>
    );
}
