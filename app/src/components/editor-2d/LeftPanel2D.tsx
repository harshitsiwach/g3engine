'use client';

import React from 'react';
import { useEditor2DStore } from '@/store/editor2DStore';

const EyeIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
);

const LockIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

const PlusIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const TrashIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
);

export default function LeftPanel2D() {
    const {
        layers, sprites, selectedLayerId, selectedSpriteId,
        selectLayer, addLayer, removeLayer, updateLayer,
        selectSprite, removeSprite,
        isPlaying,
    } = useEditor2DStore();

    if (isPlaying) return null;

    const sortedLayers = [...layers].sort((a, b) => b.order - a.order);
    const spritesByLayer = (layerId: string) =>
        sprites.filter((sp) => sp.layerId === layerId);

    return (
        <div className="editor-left-panel glass-panel">
            {/* Layers Section */}
            <div style={{ padding: '12px 12px 8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Layers
                    </span>
                    <button
                        onClick={() => addLayer()}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 4,
                            padding: '3px 8px', borderRadius: 6,
                            background: 'rgba(20,241,149,0.08)',
                            border: '1px solid rgba(20,241,149,0.15)',
                            color: '#14f195', fontSize: 10, fontWeight: 600, cursor: 'pointer',
                        }}
                    >
                        <PlusIcon /> Add
                    </button>
                </div>

                {sortedLayers.map((layer) => (
                    <div key={layer.id}>
                        {/* Layer Row */}
                        <div
                            onClick={() => selectLayer(layer.id)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 6,
                                padding: '6px 8px', borderRadius: 8, marginBottom: 2,
                                background: selectedLayerId === layer.id ? 'rgba(20,241,149,0.08)' : 'transparent',
                                border: `1px solid ${selectedLayerId === layer.id ? 'rgba(20,241,149,0.15)' : 'transparent'}`,
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                            }}
                        >
                            <button
                                onClick={(e) => { e.stopPropagation(); updateLayer(layer.id, { visible: !layer.visible }); }}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: layer.visible ? '#14f195' : '#5a5f6d', padding: 2 }}
                            >
                                <EyeIcon />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); updateLayer(layer.id, { locked: !layer.locked }); }}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: layer.locked ? '#f59e0b' : '#5a5f6d', padding: 2 }}
                            >
                                <LockIcon />
                            </button>
                            <span style={{ flex: 1, fontSize: 12, fontWeight: 500, color: selectedLayerId === layer.id ? '#f0f0f5' : '#9ca3b0' }}>
                                {layer.name}
                            </span>
                            <span style={{ fontSize: 9, color: '#5a5f6d' }}>
                                {spritesByLayer(layer.id).length}
                            </span>
                            {layers.length > 1 && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); removeLayer(layer.id); }}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5a5f6d', padding: 2 }}
                                >
                                    <TrashIcon />
                                </button>
                            )}
                        </div>

                        {/* Sprites in this layer */}
                        {spritesByLayer(layer.id).map((sp) => (
                            <div
                                key={sp.id}
                                onClick={() => selectSprite(sp.id)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 6,
                                    padding: '4px 8px 4px 28px', borderRadius: 6, marginBottom: 1,
                                    background: selectedSpriteId === sp.id ? 'rgba(139,92,246,0.1)' : 'transparent',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                }}
                            >
                                <span style={{ fontSize: 14 }}>{sp.emoji || '◻️'}</span>
                                <span style={{ flex: 1, fontSize: 11, color: selectedSpriteId === sp.id ? '#f0f0f5' : '#7a7f8d' }}>
                                    {sp.name}
                                </span>
                                <button
                                    onClick={(e) => { e.stopPropagation(); removeSprite(sp.id); }}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5a5f6d', padding: 2, opacity: 0.5 }}
                                >
                                    <TrashIcon />
                                </button>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
