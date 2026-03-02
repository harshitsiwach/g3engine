'use client';

import React from 'react';
import { useEditorStore, SceneObject } from '@/store/editorStore';

// ---------- Icons ----------

const CubeIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
);

const SphereIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <ellipse cx="12" cy="12" rx="10" ry="4" />
        <line x1="12" y1="2" x2="12" y2="22" />
    </svg>
);

const LightIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
);

const CameraIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
    </svg>
);

const PlaneIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="8" width="18" height="8" rx="1" />
    </svg>
);

const EyeIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const TrashIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6M14 11v6" />
    </svg>
);

function getObjectIcon(type: string) {
    if (type.includes('Light')) return <LightIcon />;
    if (type === 'camera') return <CameraIcon />;
    if (type === 'sphere') return <SphereIcon />;
    if (type === 'plane') return <PlaneIcon />;
    return <CubeIcon />;
}

export default function LeftPanel() {
    const { objects, selectedObjectId, selectObject, removeObject, isPlaying } = useEditorStore();

    if (isPlaying) return null;

    return (
        <div className="editor-left-panel glass-panel">
            <div className="panel-header">
                <h3>Scene</h3>
                <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>
                    {objects.length} object{objects.length !== 1 ? 's' : ''}
                </span>
            </div>
            <div className="panel-body">
                {objects.length === 0 ? (
                    <div className="empty-state">
                        <CubeIcon />
                        <p>No objects yet.<br />Drag from the asset library below.</p>
                    </div>
                ) : (
                    objects.map((obj: SceneObject) => (
                        <div
                            key={obj.id}
                            className={`scene-tree-item ${selectedObjectId === obj.id ? 'selected' : ''}`}
                            onClick={() => selectObject(obj.id)}
                        >
                            <span className="icon">{getObjectIcon(obj.type)}</span>
                            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {obj.name}
                            </span>
                            <span className="icon" style={{ opacity: 0.4 }}><EyeIcon /></span>
                            <span
                                className="icon"
                                style={{ opacity: 0.4, cursor: 'pointer' }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeObject(obj.id);
                                }}
                            >
                                <TrashIcon />
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
