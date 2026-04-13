'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useEditorStore } from '@/store/editorStore';
import { useProjectStore } from '@/store/projectStore';
import { TEMPLATES_3D } from '@/lib/templates';
import { executeCommands } from '@/lib/gameGenerator';

// All editor components loaded dynamically with SSR disabled to prevent hydration mismatch
const Viewport = dynamic(() => import('@/components/editor/Viewport'), { ssr: false });
const TopBar = dynamic(() => import('@/components/layout/TopBar'), { ssr: false });
const LeftPanel = dynamic(() => import('@/components/layout/LeftPanel'), { ssr: false });
const RightPanel = dynamic(() => import('@/components/layout/RightPanel'), { ssr: false });
const BottomPanel = dynamic(() => import('@/components/layout/BottomPanel'), { ssr: false });
const Web3Panel = dynamic(() => import('@/components/web3/Web3Panel'), { ssr: false });
const AIChatPanel = dynamic(() => import('@/components/ai/AIChatPanel'), { ssr: false });
const EditorTour = dynamic(() => import('@/components/editor/EditorTour'), { ssr: false });

export default function EditorPage() {
    const [mounted, setMounted] = useState(false);
    const web3Enabled = useEditorStore((s) => s.web3Enabled);
    const { config } = useProjectStore();
    const runTour = useEditorStore((s) => s.runTour);
    const setRunTour = useEditorStore((s) => s.setRunTour);

    // Mark as mounted to prevent SSR/hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    // Auto-load template on initial mount
    useEffect(() => {
        if (!mounted) return;
        const store = useEditorStore.getState();
        if (store.objects.length === 0 && config.template && TEMPLATES_3D[config.template]) {
            const cmds = TEMPLATES_3D[config.template];
            if (cmds.length > 0) {
                console.log(`[Editor] Loading 3D template: ${config.template}`);
                executeCommands(cmds, '3d');
            }
        }
    }, [mounted, config.template]);

    // Auto-start tour on first visit
    useEffect(() => {
        if (!mounted) return;
        const hasSeenTour = localStorage.getItem('g3_has_seen_tour');
        if (!hasSeenTour) {
            setRunTour(true);
            localStorage.setItem('g3_has_seen_tour', 'true');
        }
    }, [mounted, setRunTour]);

    // Render empty shell until mounted — prevents SSR/hydration mismatch
    if (!mounted) {
        return <div className="editor-layout" style={{ background: '#0a0a12', width: '100vw', height: '100vh' }} />;
    }

    return (
        <div className="editor-layout" suppressHydrationWarning>
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

            {/* AI Chat Panel */}
            <AIChatPanel />

            {/* Onboarding UI Tour */}
            <EditorTour run={runTour} onFinish={() => setRunTour(false)} />

        </div>
    );
}
