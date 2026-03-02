'use client';

import React from 'react';
import { useEditor2DStore } from '@/store/editor2DStore';

export default function RightPanel2D() {
    const {
        sprites, selectedSpriteId, updateSprite, isPlaying,
        camera, canvasWidth, canvasHeight,
    } = useEditor2DStore();

    if (isPlaying) return null;

    const selected = sprites.find((s) => s.id === selectedSpriteId);

    const numInput = (label: string, value: number, onChange: (v: number) => void, color?: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <span style={{
                width: 16, fontSize: 11, fontWeight: 700, textAlign: 'center',
                color: color || '#7a7f8d',
            }}>
                {label}
            </span>
            <input
                type="number"
                value={value.toFixed(0)}
                onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                style={{
                    flex: 1, padding: '5px 8px', borderRadius: 6,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#f0f0f5', fontSize: 12, fontFamily: 'monospace',
                    outline: 'none',
                }}
            />
        </div>
    );

    return (
        <div className="editor-right-panel glass-panel">
            <div style={{ padding: '12px', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Inspector
            </div>

            {selected ? (
                <div style={{ padding: '0 12px 12px' }}>
                    {/* Name & Type */}
                    <div style={{ marginBottom: 16 }}>
                        <span style={{ fontSize: 10, color: '#5a5f6d', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Object</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                            <span style={{ fontSize: 11, color: '#7a7f8d' }}>Name</span>
                            <input
                                value={selected.name}
                                onChange={(e) => updateSprite(selected.id, { name: e.target.value })}
                                style={{
                                    flex: 1, padding: '5px 8px', borderRadius: 6,
                                    background: 'rgba(255,255,255,0.04)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    color: '#f0f0f5', fontSize: 12, outline: 'none',
                                }}
                            />
                        </div>
                        <div style={{ marginTop: 6, display: 'flex', gap: 8 }}>
                            <span style={{
                                padding: '2px 8px', borderRadius: 6,
                                background: 'rgba(20,241,149,0.08)',
                                border: '1px solid rgba(20,241,149,0.15)',
                                fontSize: 10, fontWeight: 600, color: '#14f195',
                            }}>
                                {selected.type}
                            </span>
                        </div>
                    </div>

                    <div style={{ height: 1, background: 'rgba(255,255,255,0.04)', margin: '12px 0' }} />

                    {/* Position */}
                    <div style={{ marginBottom: 12 }}>
                        <span style={{ fontSize: 10, color: '#5a5f6d', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Position</span>
                        <div style={{ marginTop: 6 }}>
                            {numInput('X', selected.x, (v) => updateSprite(selected.id, { x: v }), '#ef4444')}
                            {numInput('Y', selected.y, (v) => updateSprite(selected.id, { y: v }), '#22c55e')}
                        </div>
                    </div>

                    {/* Size */}
                    <div style={{ marginBottom: 12 }}>
                        <span style={{ fontSize: 10, color: '#5a5f6d', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Size</span>
                        <div style={{ marginTop: 6 }}>
                            {numInput('W', selected.width, (v) => updateSprite(selected.id, { width: v }))}
                            {numInput('H', selected.height, (v) => updateSprite(selected.id, { height: v }))}
                        </div>
                    </div>

                    {/* Rotation */}
                    <div style={{ marginBottom: 12 }}>
                        <span style={{ fontSize: 10, color: '#5a5f6d', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Rotation</span>
                        <div style={{ marginTop: 6 }}>
                            {numInput('°', selected.rotation, (v) => updateSprite(selected.id, { rotation: v }), '#a78bfa')}
                        </div>
                    </div>

                    <div style={{ height: 1, background: 'rgba(255,255,255,0.04)', margin: '12px 0' }} />

                    {/* Appearance */}
                    <div style={{ marginBottom: 12 }}>
                        <span style={{ fontSize: 10, color: '#5a5f6d', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Appearance</span>
                        <div style={{ marginTop: 8 }}>
                            {/* Fill Color */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                                <span style={{ fontSize: 11, color: '#7a7f8d', width: 40 }}>Fill</span>
                                <div style={{ position: 'relative', width: 24, height: 24 }}>
                                    <div style={{
                                        width: 24, height: 24, borderRadius: 6,
                                        background: selected.fillColor,
                                        border: '2px solid rgba(255,255,255,0.1)',
                                    }} />
                                    <input
                                        type="color"
                                        value={selected.fillColor}
                                        onChange={(e) => updateSprite(selected.id, { fillColor: e.target.value })}
                                        style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
                                    />
                                </div>
                                <span style={{ fontSize: 10, color: '#5a5f6d', fontFamily: 'monospace' }}>{selected.fillColor}</span>
                            </div>

                            {/* Opacity */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span style={{ fontSize: 11, color: '#7a7f8d', width: 40 }}>Alpha</span>
                                <input
                                    type="range"
                                    min={0} max={1} step={0.01}
                                    value={selected.opacity}
                                    onChange={(e) => updateSprite(selected.id, { opacity: parseFloat(e.target.value) })}
                                    style={{ flex: 1, accentColor: '#14f195' }}
                                />
                                <span style={{ fontSize: 10, color: '#5a5f6d', fontFamily: 'monospace', width: 30 }}>
                                    {(selected.opacity * 100).toFixed(0)}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div style={{ padding: '60px 20px', textAlign: 'center', color: '#5a5f6d' }}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>✏️</div>
                    <div style={{ fontSize: 12 }}>Select a sprite to inspect</div>
                </div>
            )}

            {/* Canvas Info */}
            <div style={{
                position: 'absolute', bottom: 12, left: 12, right: 12,
                padding: '8px 10px', borderRadius: 8,
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.04)',
                fontSize: 10, color: '#5a5f6d',
                display: 'flex', justifyContent: 'space-between',
            }}>
                <span>{canvasWidth}×{canvasHeight}</span>
                <span>Zoom: {(camera.zoom * 100).toFixed(0)}%</span>
            </div>
        </div>
    );
}
