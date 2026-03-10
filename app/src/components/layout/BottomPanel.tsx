'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useEditorStore } from '@/store/editorStore';
import { LayersIcon, FunctionIcon, GamepadIcon } from '@/components/icons';

const AssetLibrary = dynamic(() => import('@/components/editor/AssetLibrary'), { ssr: false });
const InputsPanel = dynamic(() => import('@/components/editor/InputsPanel'), { ssr: false });
const NodeEditor = dynamic(() => import('@/components/scripting/NodeEditor'), { ssr: false });

type Tab = 'swap' | 'inputs' | 'logic';

const tabs: { id: Tab; icon: React.ReactNode; label: string; color: string }[] = [
    { id: 'swap', icon: <LayersIcon size={14} />, label: 'Assets', color: '#8b5cf6' },
    { id: 'inputs', icon: <GamepadIcon size={14} />, label: 'Inputs', color: '#14f195' },
    { id: 'logic', icon: <FunctionIcon size={14} />, label: 'Logic', color: '#38bdf8' },
];

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
    const [activeTab, setActiveTab] = useState<Tab>('swap');
    const [collapsed, setCollapsed] = useState(false);
    const isPlaying = useEditorStore((s) => s.isPlaying);

    if (isPlaying) return null;

    return (
        <div className={`editor-bottom-panel glass-panel ${collapsed ? 'collapsed' : ''}`}>
            {/* Tab bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className="tab-bar" style={{ flex: 1 }}>
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <div
                                key={tab.id}
                                className={`tab-item ${isActive ? 'active' : ''}`}
                                onClick={() => { setActiveTab(tab.id); setCollapsed(false); }}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    color: isActive ? tab.color : undefined,
                                    borderBottomColor: isActive ? tab.color : 'transparent',
                                    textShadow: isActive ? `0 0 12px ${tab.color}40` : 'none',
                                }}
                            >
                                <span style={{ color: isActive ? tab.color : 'inherit', transition: 'color 0.15s' }}>
                                    {tab.icon}
                                </span>
                                {tab.label}
                            </div>
                        );
                    })}
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
                    {activeTab === 'swap' && <AssetLibrary />}
                    {activeTab === 'inputs' && <InputsPanel />}
                    {activeTab === 'logic' && <NodeEditor />}
                </div>
            )}
        </div>
    );
}
