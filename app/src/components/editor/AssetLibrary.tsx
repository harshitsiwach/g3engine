'use client';

import React from 'react';
import { useEditorStore, ObjectType } from '@/store/editorStore';

// ---------- Asset Icons ----------

import {
    BoxIcon as CubeIcon,
    SphereIcon,
    CylinderIcon,
    PlaneIcon,
    ConeIcon,
    TorusIcon,
    LightIcon,
    CameraIcon
} from '@/components/icons';

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
