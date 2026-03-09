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
    const { objects, selectedObjectId } = useEditorStore();
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const selectedObj = objects.find(o => o.id === selectedObjectId);
    const canSwap = selectedObj && !selectedObj.type.includes('Light') && selectedObj.type !== 'camera';

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Just a dummy handler for UI purposes for now
        const file = e.target.files?.[0];
        if (file) {
            console.log('Would parse and swap mesh with:', file.name);
            alert(`Selected ${file.name} to swap with ${selectedObj?.name}. Full 3D parsing coming soon!`);
        }
    };

    if (!canSwap) {
        return (
            <div style={{ padding: '32px', textAlign: 'center', color: '#8a8f9d', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <CubeIcon strokeWidth="1" style={{ width: 48, height: 48, opacity: 0.2, marginBottom: '16px' }} />
                <p style={{ margin: 0, fontSize: '14px', maxWidth: '300px', lineHeight: '1.5' }}>
                    Select a 3D object in the scene to swap its asset.
                </p>
            </div>
        );
    }

    return (
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', color: '#f0f0f5', overflowY: 'auto', height: '100%' }}>
            <div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 600 }}>Swap Asset</h3>
                <p style={{ margin: 0, fontSize: '14px', color: '#8a8f9d' }}>
                    Replace <strong style={{ color: '#fff' }}>{selectedObj?.name}</strong> with a built-in shape or custom model.
                </p>
            </div>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                
                {/* Import Custom Asset Card */}
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px', border: '1px dashed rgba(59, 130, 246, 0.5)', display: 'flex', flexDirection: 'column', gap: '16px', width: '220px', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 48, height: 48, borderRadius: '24px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6', marginBottom: 8 }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    </div>
                    <button 
                        onClick={handleImportClick}
                        style={{ width: '100%', background: '#3b82f6', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px', transition: 'background 0.2s' }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#2563eb'}
                        onMouseOut={(e) => e.currentTarget.style.background = '#3b82f6'}
                    >
                        Import Custom
                    </button>
                    <input 
                        type="file" 
                        accept=".glb,.gltf" 
                        ref={fileInputRef} 
                        style={{ display: 'none' }} 
                        onChange={handleFileChange}
                    />
                    <div style={{ fontSize: '11px', color: '#8a8f9d', textAlign: 'center' }}>
                        .glb or .gltf (Max 5MB)
                    </div>
                </div>

                {/* Built-in Shapes Grid */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '300px' }}>
                    <h4 style={{ margin: 0, fontSize: '14px', color: '#8a8f9d', fontWeight: 500 }}>Built-in Shapes</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '12px' }}>
                        {ASSETS.filter(a => a.category === 'primitives').map((asset) => (
                            <div
                                key={asset.type}
                                onClick={() => {
                                    if (selectedObj) {
                                        useEditorStore.getState().swapObjectAsset(selectedObj.id, asset.type);
                                    }
                                }}
                                style={{
                                    background: selectedObj?.type === asset.type ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255,255,255,0.03)',
                                    border: selectedObj?.type === asset.type ? '1px solid rgba(59, 130, 246, 0.5)' : '1px solid rgba(255,255,255,0.05)',
                                    borderRadius: '8px',
                                    padding: '12px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                }}
                                onMouseOver={(e) => {
                                    if (selectedObj?.type !== asset.type) {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (selectedObj?.type !== asset.type) {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                                    }
                                }}
                            >
                                <div style={{ color: selectedObj?.type === asset.type ? '#3b82f6' : '#a0a5b5' }}>{asset.icon}</div>
                                <div style={{ fontSize: '11px', color: selectedObj?.type === asset.type ? '#3b82f6' : '#f0f0f5', fontWeight: 500, textAlign: 'center' }}>{asset.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
