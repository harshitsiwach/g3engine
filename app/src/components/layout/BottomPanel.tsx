'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useEditorStore } from '@/store/editorStore';

const AssetLibrary = dynamic(() => import('@/components/editor/AssetLibrary'), { ssr: false });
const NodeEditor = dynamic(() => import('@/components/scripting/NodeEditor'), { ssr: false });

type Tab = 'assets' | 'logic';

const ChevronDownIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

const ChevronUpIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="18 15 12 9 6 15" />
    </svg>
);

export default function BottomPanel() {
    const [activeTab, setActiveTab] = useState<Tab>('assets');
    const [collapsed, setCollapsed] = useState(false);
    const isPlaying = useEditorStore((s) => s.isPlaying);

    if (isPlaying) return null;

    return (
        <div className={`editor-bottom-panel glass-panel ${collapsed ? 'collapsed' : ''}`}>
            {/* Tab bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className="tab-bar" style={{ flex: 1 }}>
                    <div
                        className={`tab-item ${activeTab === 'assets' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('assets'); setCollapsed(false); }}
                    >
                        🧩 Assets
                    </div>
                    <div
                        className={`tab-item ${activeTab === 'logic' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('logic'); setCollapsed(false); }}
                    >
                        🔗 Logic
                    </div>
                </div>
                <button
                    className="btn btn-icon"
                    onClick={() => setCollapsed(!collapsed)}
                    style={{ margin: '0 4px', border: 'none', background: 'none' }}
                >
                    {collapsed ? <ChevronUpIcon /> : <ChevronDownIcon />}
                </button>
            </div>

            {/* Content */}
            {!collapsed && (
                <div className="panel-body" style={{ padding: 0 }}>
                    {activeTab === 'assets' && <AssetLibrary />}
                    {activeTab === 'logic' && <NodeEditor />}
                </div>
            )}
        </div>
    );
}
