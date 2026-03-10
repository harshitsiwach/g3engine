'use client';

import React from 'react';
import { useEditorStore, SceneObject } from '@/store/editorStore';

import {
    BoxIcon as CubeIcon,
    SphereIcon,
    LightIcon,
    CameraIcon,
    PlaneIcon,
    TrashIcon
} from '@/components/icons';

const EyeIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

function getObjectIcon(type: string) {
    if (type.includes('Light')) return <LightIcon />;
    if (type === 'camera') return <CameraIcon />;
    if (type === 'sphere') return <SphereIcon />;
    if (type === 'plane') return <PlaneIcon />;
    return <CubeIcon />;
}

function getObjectColor(type: string) {
    if (type.includes('Light')) return '#fbbf24';
    if (type === 'camera') return '#38bdf8';
    if (type === 'sphere') return '#ec4899';
    if (type === 'plane') return '#22c55e';
    return '#8b5cf6';
}

export default function LeftPanel() {
    const { objects, selectedObjectId, selectObject, removeObject, isPlaying } = useEditorStore();

    if (isPlaying) return null;

    return (
        <div className="editor-left-panel glass-panel">
            <div className="panel-header">
                <h3>
                    <span style={{ fontSize: 14 }}>🎬</span>
                    Scene
                </h3>
                <span style={{
                    fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)',
                    background: 'rgba(139,92,246,0.08)', padding: '2px 8px', borderRadius: 10,
                }}>
                    {objects.length}
                </span>
            </div>
            <div className="panel-body">
                {objects.length === 0 ? (
                    <div className="empty-state">
                        <CubeIcon />
                        <p>No objects yet.<br />Drag from the asset library below.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {objects.map((obj: SceneObject, i: number) => {
                            const isSelected = selectedObjectId === obj.id;
                            const color = getObjectColor(obj.type);
                            return (
                                <div
                                    key={obj.id}
                                    className={`scene-tree-item ${isSelected ? 'selected' : ''}`}
                                    onClick={() => selectObject(obj.id)}
                                    style={{
                                        animationDelay: `${i * 0.03}s`,
                                        animation: 'panelSlideIn 0.3s ease both',
                                    }}
                                >
                                    <span className="icon" style={{ color: isSelected ? color : undefined }}>
                                        {getObjectIcon(obj.type)}
                                    </span>
                                    <span style={{
                                        flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                        fontWeight: isSelected ? 600 : 500,
                                    }}>
                                        {obj.name}
                                    </span>
                                    <span
                                        className="icon"
                                        style={{ opacity: obj.visible ? 0.6 : 0.15, cursor: 'pointer' }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            useEditorStore.getState().toggleVisibility(obj.id);
                                        }}
                                    >
                                        <EyeIcon />
                                    </span>
                                    <span
                                        className="icon"
                                        style={{ opacity: 0.3, cursor: 'pointer' }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeObject(obj.id);
                                        }}
                                    >
                                        <TrashIcon />
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
