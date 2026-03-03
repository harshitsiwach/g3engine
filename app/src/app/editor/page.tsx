'use client';

import dynamic from 'next/dynamic';
import { useEditorStore } from '@/store/editorStore';

const Viewport = dynamic(() => import('@/components/editor/Viewport'), { ssr: false });
const TopBar = dynamic(() => import('@/components/layout/TopBar'), { ssr: false });
const LeftPanel = dynamic(() => import('@/components/layout/LeftPanel'), { ssr: false });
const RightPanel = dynamic(() => import('@/components/layout/RightPanel'), { ssr: false });
const BottomPanel = dynamic(() => import('@/components/layout/BottomPanel'), { ssr: false });
const Web3Panel = dynamic(() => import('@/components/web3/Web3Panel'), { ssr: false });

export default function EditorPage() {
    const web3Enabled = useEditorStore((s) => s.web3Enabled);

    return (
        <div className="editor-layout">
            {/* 3D Viewport (background) */}
            <Viewport />

            {/* Floating UI Panels */}
            <TopBar />
            <LeftPanel />
            <RightPanel />
            <BottomPanel />

            {/* Web3 Panel — slides in from right when enabled */}
            {web3Enabled && (
                <div style={{
                    position: 'fixed',
                    top: 48,
                    right: 0,
                    width: 300,
                    bottom: 0,
                    zIndex: 50,
                    animation: 'slideInRight 0.25s ease-out',
                }}>
                    <Web3Panel />
                </div>
            )}

            <style jsx>{`
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
}

