'use client';

import React, { useState } from 'react';
import { useEditorStore, TransformMode } from '@/store/editorStore';
import { useWeb3Store } from '@/store/web3Store';
import { useAIStore } from '@/store/aiStore';
import PublishModal from '@/components/editor/PublishModal';
import WalletButton from '@/components/web3/WalletButton';

// ---------- SVG Icons ----------

import {
    PlayIcon,
    StopIcon,
    UndoIcon,
    RedoIcon,
    WrenchIcon,
    PublishIcon,
    Web3Icon,
} from '@/components/icons';

// Using LayoutGrid as a sub for Scale, Wrench for Move, Redo for Rotate for now
const MoveIcon = WrenchIcon;
const RotateIcon = RedoIcon;
const ScaleIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 3 21 3 21 9" />
        <polyline points="9 21 3 21 3 15" />
        <line x1="21" y1="3" x2="14" y2="10" />
        <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
);

export default function TopBar() {
    const {
        isPlaying,
        togglePlay,
        undo,
        redo,
        historyIndex,
        history,
        transformMode,
        setTransformMode,
        web3Enabled,
        toggleWeb3,
        setRunTour,
    } = useEditorStore();

    if (isPlaying) return null;

    return <TopBarContent />;

}

function TopBarContent() {
    const {
        togglePlay,
        undo,
        redo,
        historyIndex,
        history,
        transformMode,
        setTransformMode,
        web3Enabled,
        toggleWeb3,
        isPlaying,
        setRunTour,
    } = useEditorStore();

    const [showPublish, setShowPublish] = useState(false);

    const modes: { mode: TransformMode; icon: React.ReactNode; label: string }[] = [
        { mode: 'translate', icon: <MoveIcon />, label: 'Move (W)' },
        { mode: 'rotate', icon: <RotateIcon />, label: 'Rotate (E)' },
        { mode: 'scale', icon: <ScaleIcon />, label: 'Scale (R)' },
    ];

    return (
        <>
            <div className="editor-topbar glass-panel">
                {/* Logo / Brand */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 8 }}>
                    <div style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        background: 'linear-gradient(135deg, #8b5cf6, #14f195)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 14,
                    }}>
                        ⬡
                    </div>
                    <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                        G3Engine
                    </span>
                </div>

                <div className="toolbar-divider" />

                {/* Play / Stop */}
                <button
                    className={`btn tour-play-btn ${isPlaying ? 'btn-danger' : 'btn-success'}`}
                    onClick={togglePlay}
                    data-tooltip={isPlaying ? 'Stop' : 'Play'}
                    style={isPlaying ? { background: 'rgba(239,68,68,0.15)', borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444' } : {}}
                >
                    {isPlaying ? <StopIcon /> : <PlayIcon />}
                    {isPlaying ? 'Stop' : 'Play'}
                </button>

                <div className="toolbar-divider" />

                {/* Transform Mode — Position / Rotation / Scale */}
                {modes.map(({ mode, icon, label }) => (
                    <button
                        key={mode}
                        className="btn"
                        onClick={() => setTransformMode(mode)}
                        data-tooltip={label}
                        style={
                            transformMode === mode
                                ? {
                                    background: 'rgba(139,92,246,0.18)',
                                    borderColor: 'rgba(139,92,246,0.4)',
                                    color: '#a78bfa',
                                    boxShadow: '0 0 12px rgba(139,92,246,0.15)',
                                }
                                : {}
                        }
                    >
                        {icon}
                        <span style={{ fontSize: 11 }}>{mode === 'translate' ? 'Position' : mode === 'rotate' ? 'Rotation' : 'Scale'}</span>
                        <span style={{
                            fontSize: 9,
                            opacity: 0.5,
                            background: 'rgba(255,255,255,0.06)',
                            padding: '1px 5px',
                            borderRadius: 3,
                            marginLeft: 2,
                        }}>
                            {mode === 'translate' ? 'W' : mode === 'rotate' ? 'E' : 'R'}
                        </span>
                    </button>
                ))}

                <div className="toolbar-divider" />

                {/* Undo / Redo */}
                <button
                    className="btn btn-icon"
                    onClick={undo}
                    disabled={historyIndex <= 0}
                    data-tooltip="Undo (⌘Z)"
                    style={historyIndex <= 0 ? { opacity: 0.3, cursor: 'not-allowed' } : {}}
                >
                    <UndoIcon />
                </button>
                <button
                    className="btn btn-icon"
                    onClick={redo}
                    disabled={historyIndex >= history.length - 1}
                    data-tooltip="Redo (⌘⇧Z)"
                    style={historyIndex >= history.length - 1 ? { opacity: 0.3, cursor: 'not-allowed' } : {}}
                >
                    <RedoIcon />
                </button>

                <div className="toolbar-divider" />

                {/* Web3 Toggle */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Web3Icon />
                    <span style={{ fontSize: 12, color: web3Enabled ? 'var(--accent-secondary)' : 'var(--text-tertiary)' }}>
                        Web3
                    </span>
                    <div
                        className={`toggle-switch ${web3Enabled ? 'active' : ''}`}
                        onClick={() => {
                            toggleWeb3();
                            useWeb3Store.getState().setWeb3PanelOpen(!web3Enabled);
                        }}
                    />
                </div>

                {/* Wallet */}
                {web3Enabled && <WalletButton />}

                <div className="toolbar-divider" />

                {/* AI Assistant */}
                <button
                    className="btn"
                    onClick={() => useAIStore.getState().toggleOpen()}
                    data-tooltip="AI Assistant"
                    style={{
                        background: useAIStore.getState().isOpen ? 'rgba(139,92,246,0.18)' : undefined,
                        borderColor: useAIStore.getState().isOpen ? 'rgba(139,92,246,0.4)' : undefined,
                        color: useAIStore.getState().isOpen ? '#a78bfa' : undefined,
                    }}
                >
                    <span style={{ fontSize: 14 }}>✨</span>
                    <span style={{ fontSize: 11 }}>AI</span>
                </button>

                <div className="toolbar-divider" />

                {/* Tour / Help */}
                <button
                    className="btn"
                    onClick={() => setRunTour(true)}
                    data-tooltip="Editor Tour"
                >
                    <span style={{ fontSize: 14 }}>🧭</span>
                    <span style={{ fontSize: 11 }}>Tour</span>
                </button>

                <div className="toolbar-divider" />

                {/* Publish */}
                <button className="btn btn-primary tour-publish-btn" data-tooltip="Publish Game" onClick={() => setShowPublish(true)}>
                    <PublishIcon />
                    Publish
                </button>
            </div>
            <PublishModal isOpen={showPublish} onClose={() => setShowPublish(false)} />
        </>
    );
}
