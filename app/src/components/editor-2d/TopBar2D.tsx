'use client';

import React, { useState } from 'react';
import { useEditor2DStore, Tool2D } from '@/store/editor2DStore';
import PublishModal from '@/components/editor/PublishModal';

// ─── Icons ───

const SelectIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
    </svg>
);

const MoveIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="5 9 2 12 5 15" /><polyline points="9 5 12 2 15 5" />
        <polyline points="15 19 12 22 9 19" /><polyline points="19 9 22 12 19 15" />
        <line x1="2" y1="12" x2="22" y2="12" /><line x1="12" y1="2" x2="12" y2="22" />
    </svg>
);

const DrawIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19l7-7 3 3-7 7-3-3z" />
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
        <path d="M2 2l7.586 7.586" />
        <circle cx="11" cy="11" r="2" />
    </svg>
);

const EraseIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 21h10" />
        <path d="M5.5 12.5L15 3l6 6-9.5 9.5a2 2 0 01-1.4.6H6a2 2 0 01-1.4-.6L2.5 16.4a2 2 0 010-2.8l3-1.1z" />
    </svg>
);

const ShapeIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    </svg>
);

const TextIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="4 7 4 4 20 4 20 7" />
        <line x1="9" y1="20" x2="15" y2="20" />
        <line x1="12" y1="4" x2="12" y2="20" />
    </svg>
);

const PlayIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
);

const StopIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="1" /></svg>
);

const UndoIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </svg>
);

const RedoIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
);

const GridIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" /><line x1="3" y1="9" x2="21" y2="9" />
        <line x1="3" y1="15" x2="21" y2="15" /><line x1="9" y1="3" x2="9" y2="21" />
        <line x1="15" y1="3" x2="15" y2="21" />
    </svg>
);

const MagnetIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 15l-4-4 6-6 4 4" /><path d="M18 15l4-4-6-6-4 4" />
        <path d="M14.5 9.5L9.5 14.5" /><line x1="5" y1="19" x2="19" y2="19" />
    </svg>
);

const PublishIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" />
    </svg>
);

// ─── Tool Definitions ───

const TOOLS: { tool: Tool2D; icon: React.ReactNode; label: string; shortcut: string }[] = [
    { tool: 'select', icon: <SelectIcon />, label: 'Select', shortcut: 'V' },
    { tool: 'move', icon: <MoveIcon />, label: 'Move', shortcut: 'G' },
    { tool: 'draw', icon: <DrawIcon />, label: 'Draw', shortcut: 'B' },
    { tool: 'erase', icon: <EraseIcon />, label: 'Erase', shortcut: 'E' },
    { tool: 'shape', icon: <ShapeIcon />, label: 'Shape', shortcut: 'U' },
    { tool: 'text', icon: <TextIcon />, label: 'Text', shortcut: 'T' },
];

// ─── Component ───

export default function TopBar2D() {
    const {
        activeTool, setTool,
        isPlaying, togglePlay,
        showGrid, toggleGrid,
        snapToGrid, toggleSnap,
        undo, redo,
        historyIndex, history,
        brushColor, setBrushColor,
    } = useEditor2DStore();

    const [showPublish, setShowPublish] = useState(false);

    if (isPlaying) return null;

    return (
        <>
            <div className="editor-topbar glass-panel">
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 8 }}>
                    <div style={{
                        width: 28, height: 28, borderRadius: 8,
                        background: 'linear-gradient(135deg, #14f195, #06b6d4)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
                    }}>🎮</div>
                    <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                        Engine <span style={{ fontSize: 10, color: '#14f195', fontWeight: 600, marginLeft: 4 }}>2D</span>
                    </span>
                </div>

                <div className="toolbar-divider" />

                {/* Play / Stop */}
                <button
                    className={`btn ${isPlaying ? 'btn-danger' : 'btn-success'}`}
                    onClick={togglePlay}
                    style={isPlaying ? { background: 'rgba(239,68,68,0.15)', borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444' } : {}}
                >
                    {isPlaying ? <StopIcon /> : <PlayIcon />}
                    {isPlaying ? 'Stop' : 'Play'}
                </button>

                <div className="toolbar-divider" />

                {/* Drawing Tools */}
                {TOOLS.map(({ tool, icon, label, shortcut }) => (
                    <button
                        key={tool}
                        className="btn"
                        onClick={() => setTool(tool)}
                        data-tooltip={`${label} (${shortcut})`}
                        style={
                            activeTool === tool
                                ? {
                                    background: 'rgba(20,241,149,0.15)',
                                    borderColor: 'rgba(20,241,149,0.35)',
                                    color: '#14f195',
                                    boxShadow: '0 0 12px rgba(20,241,149,0.12)',
                                }
                                : {}
                        }
                    >
                        {icon}
                        <span style={{ fontSize: 11 }}>{label}</span>
                        <span style={{
                            fontSize: 9, opacity: 0.5,
                            background: 'rgba(255,255,255,0.06)',
                            padding: '1px 5px', borderRadius: 3, marginLeft: 2,
                        }}>
                            {shortcut}
                        </span>
                    </button>
                ))}

                <div className="toolbar-divider" />

                {/* Color Picker */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ position: 'relative', width: 24, height: 24 }}>
                        <div style={{
                            width: 24, height: 24, borderRadius: 6,
                            background: brushColor,
                            border: '2px solid rgba(255,255,255,0.15)',
                            cursor: 'pointer',
                        }} />
                        <input
                            type="color"
                            value={brushColor}
                            onChange={(e) => setBrushColor(e.target.value)}
                            style={{
                                position: 'absolute', inset: 0,
                                opacity: 0, cursor: 'pointer',
                                width: '100%', height: '100%',
                            }}
                        />
                    </div>
                </div>

                <div className="toolbar-divider" />

                {/* Grid / Snap */}
                <button
                    className="btn btn-icon"
                    onClick={toggleGrid}
                    data-tooltip={`Grid ${showGrid ? 'ON' : 'OFF'}`}
                    style={showGrid ? { color: '#14f195' } : { opacity: 0.4 }}
                >
                    <GridIcon />
                </button>
                <button
                    className="btn btn-icon"
                    onClick={toggleSnap}
                    data-tooltip={`Snap ${snapToGrid ? 'ON' : 'OFF'}`}
                    style={snapToGrid ? { color: '#14f195' } : { opacity: 0.4 }}
                >
                    <MagnetIcon />
                </button>

                <div className="toolbar-divider" />

                {/* Undo / Redo */}
                <button className="btn btn-icon" onClick={undo} disabled={historyIndex <= 0}
                    style={historyIndex <= 0 ? { opacity: 0.3, cursor: 'not-allowed' } : {}} data-tooltip="Undo (⌘Z)">
                    <UndoIcon />
                </button>
                <button className="btn btn-icon" onClick={redo} disabled={historyIndex >= history.length - 1}
                    style={historyIndex >= history.length - 1 ? { opacity: 0.3, cursor: 'not-allowed' } : {}} data-tooltip="Redo (⌘⇧Z)">
                    <RedoIcon />
                </button>

                <div className="toolbar-divider" />

                {/* Publish */}
                <button className="btn btn-primary" onClick={() => setShowPublish(true)} data-tooltip="Publish Game">
                    <PublishIcon /> Publish
                </button>
            </div>

            <PublishModal isOpen={showPublish} onClose={() => setShowPublish(false)} />
        </>
    );
}
