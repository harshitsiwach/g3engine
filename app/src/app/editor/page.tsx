'use client';

import dynamic from 'next/dynamic';

const Viewport = dynamic(() => import('@/components/editor/Viewport'), { ssr: false });
const TopBar = dynamic(() => import('@/components/layout/TopBar'), { ssr: false });
const LeftPanel = dynamic(() => import('@/components/layout/LeftPanel'), { ssr: false });
const RightPanel = dynamic(() => import('@/components/layout/RightPanel'), { ssr: false });
const BottomPanel = dynamic(() => import('@/components/layout/BottomPanel'), { ssr: false });

export default function EditorPage() {
    return (
        <div className="editor-layout">
            {/* 3D Viewport (background) */}
            <Viewport />

            {/* Floating UI Panels */}
            <TopBar />
            <LeftPanel />
            <RightPanel />
            <BottomPanel />
        </div>
    );
}
