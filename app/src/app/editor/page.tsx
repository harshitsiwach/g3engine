'use client';

import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { useEditorStore } from '@/store/editorStore';
import { useProjectStore } from '@/store/projectStore';
import { TEMPLATES_3D } from '@/lib/templates';
import { executeCommands } from '@/lib/gameGenerator';

const Viewport = dynamic(() => import('@/components/editor/Viewport'), { ssr: false });
const TopBar = dynamic(() => import('@/components/layout/TopBar'), { ssr: false });
const LeftPanel = dynamic(() => import('@/components/layout/LeftPanel'), { ssr: false });
const RightPanel = dynamic(() => import('@/components/layout/RightPanel'), { ssr: false });
const BottomPanel = dynamic(() => import('@/components/layout/BottomPanel'), { ssr: false });
const Web3Panel = dynamic(() => import('@/components/web3/Web3Panel'), { ssr: false });
const AIChatPanel = dynamic(() => import('@/components/ai/AIChatPanel'), { ssr: false });
const EditorTour = dynamic(() => import('@/components/editor/EditorTour'), { ssr: false });

export default function EditorPage() {
    const web3Enabled = useEditorStore((s) => s.web3Enabled);
    const { config } = useProjectStore();
    const runTour = useEditorStore((s) => s.runTour);
    const setRunTour = useEditorStore((s) => s.setRunTour);

    // Auto-load template on initial mount
    useEffect(() => {
        const store = useEditorStore.getState();
        if (store.objects.length === 0 && config.template && TEMPLATES_3D[config.template]) {
            const cmds = TEMPLATES_3D[config.template];
            if (cmds.length > 0) {
                console.log(`[Editor] Loading 3D template: ${config.template}`);
                executeCommands(cmds, '3d');
            }
        }
    }, [config.template]);

    // Auto-start tour on first visit
    useEffect(() => {
        const hasSeenTour = localStorage.getItem('g3_has_seen_tour');
        if (!hasSeenTour) {
            setRunTour(true);
            localStorage.setItem('g3_has_seen_tour', 'true');
        }
    }, [setRunTour]);

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

            {/* AI Chat Panel */}
            <AIChatPanel />

            {/* Onboarding UI Tour */}
            <EditorTour run={runTour} onFinish={() => setRunTour(false)} />

        </div>
    );
}

