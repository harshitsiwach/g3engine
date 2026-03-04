'use client';

import React from 'react';
import { useEditorStore, SceneObject } from '@/store/editorStore';

// ---------- Icons ----------

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
