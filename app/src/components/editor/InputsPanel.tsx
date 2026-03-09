'use client';

import React from 'react';
import { useProjectStore } from '@/store/projectStore';

export default function InputsPanel() {
    const genre = useProjectStore((s) => s.config.genre);

    return (
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', color: '#f0f0f5' }}>
            <div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 600 }}>Game Inputs</h3>
                <p style={{ margin: 0, fontSize: '14px', color: '#8a8f9d' }}>Current control scheme for this template.</p>
            </div>

            {genre === 'platformer' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '14px', fontWeight: 500 }}>Move Left</span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <kbd style={{ background: '#2d2d3b', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontFamily: 'monospace' }}>A</kbd>
                            <span style={{ color: '#5a5f6d', fontSize: '12px', alignSelf: 'center' }}>or</span>
                            <kbd style={{ background: '#2d2d3b', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontFamily: 'monospace' }}>Left Arrow</kbd>
                        </div>
                    </div>
                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '14px', fontWeight: 500 }}>Move Right</span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <kbd style={{ background: '#2d2d3b', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontFamily: 'monospace' }}>D</kbd>
                            <span style={{ color: '#5a5f6d', fontSize: '12px', alignSelf: 'center' }}>or</span>
                            <kbd style={{ background: '#2d2d3b', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontFamily: 'monospace' }}>Right Arrow</kbd>
                        </div>
                    </div>
                </div>
            ) : (
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', color: '#8a8f9d' }}>
                    <p style={{ margin: 0, fontSize: '14px' }}>No specific inputs bound for this template yet.</p>
                </div>
            )}
        </div>
    );
}
