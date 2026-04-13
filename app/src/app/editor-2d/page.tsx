'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useProjectStore } from '@/store/projectStore';
import { useEditor2DStore } from '@/store/editor2DStore';
import { TEMPLATES_2D } from '@/lib/templates';
import { executeCommands } from '@/lib/gameGenerator';

const TopBar2D = dynamic(() => import('@/components/editor-2d/TopBar2D'), { ssr: false });
const LeftPanel2D = dynamic(() => import('@/components/editor-2d/LeftPanel2D'), { ssr: false });
const RightPanel2D = dynamic(() => import('@/components/editor-2d/RightPanel2D'), { ssr: false });
const BottomPanel2D = dynamic(() => import('@/components/editor-2d/BottomPanel2D'), { ssr: false });
const Viewport2D = dynamic(() => import('@/components/editor-2d/Viewport2D'), { ssr: false });
const GameHUD2D = dynamic(() => import('@/components/editor-2d/GameHUD2D'), { ssr: false });
const Web3Panel = dynamic(() => import('@/components/web3/Web3Panel'), { ssr: false });

export default function Editor2DPage() {
    const [mounted, setMounted] = useState(false);
    const { config } = useProjectStore();
    const isPlaying = useEditor2DStore((s) => s.isPlaying);
    const web3Enabled = useEditor2DStore((s) => s.web3Enabled);

    useEffect(() => { setMounted(true); }, []);

    // Auto-load template on initial mount
    useEffect(() => {
        if (!mounted) return;
        const store = useEditor2DStore.getState();
        if (store.sprites.length === 0 && config.template && TEMPLATES_2D[config.template]) {
            const cmds = TEMPLATES_2D[config.template];
            if (cmds.length > 0) {
                console.log(`[Editor 2D] Loading template: ${config.template}`);
                executeCommands(cmds, '2d');
            }
        }
    }, [mounted, config.template]);

    if (!mounted) {
        return <div className="editor-layout" style={{ background: '#0a0a12', width: '100vw', height: '100vh' }} />;
    }

    return (
        <div className="editor-layout" suppressHydrationWarning>
            <Viewport2D />

            {/* 2D Mode Badge */}
            {!isPlaying && (
                <div style={{
                    position: 'absolute', top: 72, left: '50%', transform: 'translateX(-50%)',
                    zIndex: 100, display: 'flex', alignItems: 'center', gap: 8,
                    padding: '6px 16px', borderRadius: 20,
                    background: 'rgba(20,241,149,0.08)', border: '1px solid rgba(20,241,149,0.2)',
                    fontSize: 11, fontWeight: 600, color: '#14f195', letterSpacing: '0.05em',
                    pointerEvents: 'none',
                }}>
                    🎮 2D Mode {config.name && `— ${config.name}`}
                </div>
            )}

            <TopBar2D />
            {isPlaying && <GameHUD2D />}
            {!isPlaying && <LeftPanel2D />}
            {!isPlaying && <RightPanel2D />}
            {!isPlaying && <BottomPanel2D />}

            {/* Web3 Panel — slides in from right when enabled */}
            {web3Enabled && !isPlaying && (
                <div style={{
                    position: 'fixed', top: 48, right: 0, width: 300, bottom: 0, zIndex: 50,
                    animation: 'slideInRight 0.25s ease-out',
                }}>
                    <Web3Panel />
                </div>
            )}
        </div>
    );
}
