'use client';

import React, { useCallback } from 'react';
import { useEditorStore, Vec3 } from '@/store/editorStore';

function VectorInput({
    label,
    value,
    onChange,
}: {
    label: string;
    value: Vec3;
    onChange: (v: Vec3) => void;
}) {
    const handleChange = (axis: 'x' | 'y' | 'z', raw: string) => {
        const num = parseFloat(raw);
        if (!isNaN(num)) {
            onChange({ ...value, [axis]: num });
        }
    };

    return (
        <div className="inspector-section">
            <div className="inspector-section-title">{label}</div>
            {(['x', 'y', 'z'] as const).map((axis) => (
                <div className="inspector-row" key={axis}>
                    <label className={axis}>{axis.toUpperCase()}</label>
                    <input
                        className="inspector-input"
                        type="number"
                        step={label === 'Rotation' ? 0.1 : 0.05}
                        value={Number(value[axis]).toFixed(2)}
                        onChange={(e) => handleChange(axis, e.target.value)}
                    />
                </div>
            ))}
        </div>
    );
}

function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
    return (
        <div className="inspector-row" style={{ paddingTop: 4, paddingBottom: 4 }}>
            <label style={{ width: 'auto', color: 'var(--text-tertiary)', fontSize: 11, fontWeight: 600, minWidth: 50 }}>
                {label}
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                <input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    style={{
                        width: 24,
                        height: 24,
                        border: '1px solid var(--border-default)',
                        borderRadius: 'var(--radius-sm)',
                        background: 'none',
                        cursor: 'pointer',
                        padding: 0,
                    }}
                />
                <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{value}</span>
            </div>
        </div>
    );
}

function SliderInput({
    label,
    value,
    onChange,
    min = 0,
    max = 1,
    step = 0.01,
}: {
    label: string;
    value: number;
    onChange: (v: number) => void;
    min?: number;
    max?: number;
    step?: number;
}) {
    return (
        <div className="inspector-row" style={{ paddingTop: 2, paddingBottom: 2 }}>
            <label style={{ width: 'auto', color: 'var(--text-tertiary)', fontSize: 11, fontWeight: 600, minWidth: 50 }}>
                {label}
            </label>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                style={{ flex: 1, accentColor: 'var(--accent-primary)' }}
            />
            <span style={{ fontSize: 10, color: 'var(--text-tertiary)', width: 30, textAlign: 'right' }}>
                {value.toFixed(2)}
            </span>
        </div>
    );
}

export default function RightPanel() {
    const { objects, selectedObjectId, updateTransform, updateMaterial, isPlaying } = useEditorStore();

    const selected = objects.find((o) => o.id === selectedObjectId);

    const handleTransformChange = useCallback(
        (field: 'position' | 'rotation' | 'scale', value: Vec3) => {
            if (selectedObjectId) updateTransform(selectedObjectId, field, value);
        },
        [selectedObjectId, updateTransform]
    );

    if (isPlaying) return null;

    return (
        <div className="editor-right-panel glass-panel">
            <div className="panel-header">
                <h3>Inspector</h3>
            </div>
            <div className="panel-body">
                {!selected ? (
                    <div className="empty-state">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        <p>Select an object to inspect</p>
                    </div>
                ) : (
                    <>
                        {/* Name & Type */}
                        <div className="inspector-section">
                            <div className="inspector-section-title">Object</div>
                            <div className="inspector-row">
                                <label style={{ width: 'auto', color: 'var(--text-tertiary)', fontSize: 11, fontWeight: 600, minWidth: 35 }}>
                                    Name
                                </label>
                                <span style={{ fontSize: 12, color: 'var(--text-primary)' }}>{selected.name}</span>
                            </div>
                            <div className="inspector-row">
                                <label style={{ width: 'auto', color: 'var(--text-tertiary)', fontSize: 11, fontWeight: 600, minWidth: 35 }}>
                                    Type
                                </label>
                                <span style={{
                                    fontSize: 11,
                                    color: 'var(--accent-primary)',
                                    background: 'rgba(139,92,246,0.1)',
                                    padding: '2px 8px',
                                    borderRadius: 'var(--radius-sm)',
                                }}>
                                    {selected.type}
                                </span>
                            </div>
                        </div>

                        {/* Transform */}
                        <VectorInput label="Position" value={selected.position} onChange={(v) => handleTransformChange('position', v)} />
                        <VectorInput label="Rotation" value={selected.rotation} onChange={(v) => handleTransformChange('rotation', v)} />
                        <VectorInput label="Scale" value={selected.scale} onChange={(v) => handleTransformChange('scale', v)} />

                        {/* Material */}
                        {!selected.type.includes('Light') && selected.type !== 'camera' && (
                            <div className="inspector-section">
                                <div className="inspector-section-title">Material</div>
                                <ColorInput
                                    label="Color"
                                    value={selected.material.color}
                                    onChange={(c) => updateMaterial(selected.id, { color: c })}
                                />
                                <SliderInput
                                    label="Rough"
                                    value={selected.material.roughness}
                                    onChange={(v) => updateMaterial(selected.id, { roughness: v })}
                                />
                                <SliderInput
                                    label="Metal"
                                    value={selected.material.metalness}
                                    onChange={(v) => updateMaterial(selected.id, { metalness: v })}
                                />
                            </div>
                        )}

                        {/* Light */}
                        {selected.type.includes('Light') && (
                            <div className="inspector-section">
                                <div className="inspector-section-title">Light</div>
                                <ColorInput
                                    label="Color"
                                    value={selected.lightColor || '#ffffff'}
                                    onChange={(c) => updateMaterial(selected.id, { color: c })}
                                />
                                <SliderInput
                                    label="Intensity"
                                    value={selected.lightIntensity || 1}
                                    onChange={(v) => {
                                        // Store light intensity
                                        const obj = objects.find((o) => o.id === selected.id);
                                        if (obj) {
                                            useEditorStore.setState({
                                                objects: objects.map((o) =>
                                                    o.id === selected.id ? { ...o, lightIntensity: v } : o
                                                ),
                                            });
                                        }
                                    }}
                                    min={0}
                                    max={10}
                                    step={0.1}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
