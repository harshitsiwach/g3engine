'use client';

import React from 'react';
import { useEditorStore, ObjectType } from '@/store/editorStore';

// ---------- Asset Icons ----------

const CubeIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    </svg>
);

const SphereIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <ellipse cx="12" cy="12" rx="10" ry="3.5" />
    </svg>
);

const CylinderIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <ellipse cx="12" cy="5" rx="8" ry="3" />
        <path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
    </svg>
);

const PlaneIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M2 16l10 4 10-4" />
        <path d="M2 12l10 4 10-4" />
    </svg>
);

const ConeIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L4 20h16L12 2z" />
        <ellipse cx="12" cy="20" rx="8" ry="2" />
    </svg>
);

const TorusIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <ellipse cx="12" cy="12" rx="10" ry="4" />
        <path d="M12 8c-2.76 0-5 1.79-5 4s2.24 4 5 4 5-1.79 5-4-2.24-4-5-4z" />
    </svg>
);

const LightIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
    </svg>
);

const CameraIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
    </svg>
);

interface AssetDef {
    type: ObjectType;
    label: string;
    icon: React.ReactNode;
    category: 'primitives' | 'lights' | 'other';
}

const ASSETS: AssetDef[] = [
    { type: 'box', label: 'Cube', icon: <CubeIcon />, category: 'primitives' },
    { type: 'sphere', label: 'Sphere', icon: <SphereIcon />, category: 'primitives' },
    { type: 'cylinder', label: 'Cylinder', icon: <CylinderIcon />, category: 'primitives' },
    { type: 'plane', label: 'Plane', icon: <PlaneIcon />, category: 'primitives' },
    { type: 'cone', label: 'Cone', icon: <ConeIcon />, category: 'primitives' },
    { type: 'torus', label: 'Torus', icon: <TorusIcon />, category: 'primitives' },
    { type: 'pointLight', label: 'Point Light', icon: <LightIcon />, category: 'lights' },
    { type: 'directionalLight', label: 'Dir Light', icon: <LightIcon />, category: 'lights' },
    { type: 'ambientLight', label: 'Ambient', icon: <LightIcon />, category: 'lights' },
    { type: 'camera', label: 'Camera', icon: <CameraIcon />, category: 'other' },
];

export default function AssetLibrary() {
    const addObject = useEditorStore((s) => s.addObject);

    return (
        <div className="asset-grid">
            {ASSETS.map((asset) => (
                <div
                    key={asset.type}
                    className="asset-card"
                    onClick={() => addObject(asset.type)}
                    draggable
                    onDragEnd={() => addObject(asset.type)}
                >
                    <div className="asset-icon">{asset.icon}</div>
                    <div className="asset-label">{asset.label}</div>
                </div>
            ))}
        </div>
    );
}
