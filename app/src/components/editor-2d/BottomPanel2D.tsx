'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useEditor2DStore } from '@/store/editor2DStore';

const NodeEditor = dynamic(() => import('@/components/scripting/NodeEditor'), { ssr: false });

type PanelTab = 'assets' | 'logic';

// ─── Asset Categories ───

interface Asset2D {
    id: string;
    name: string;
    emoji: string;
    width: number;
    height: number;
    fillColor: string;
    category: string;
}

const SPRITE_ASSETS: Asset2D[] = [
    // Characters
    { id: 'char-hero', name: 'Hero', emoji: '🦸', width: 48, height: 48, fillColor: '#6366f1', category: 'characters' },
    { id: 'char-villain', name: 'Villain', emoji: '🦹', width: 48, height: 48, fillColor: '#ef4444', category: 'characters' },
    { id: 'char-robot', name: 'Robot', emoji: '🤖', width: 48, height: 48, fillColor: '#64748b', category: 'characters' },
    { id: 'char-alien', name: 'Alien', emoji: '👾', width: 48, height: 48, fillColor: '#22c55e', category: 'characters' },
    { id: 'char-wizard', name: 'Wizard', emoji: '🧙', width: 48, height: 48, fillColor: '#a855f7', category: 'characters' },
    { id: 'char-knight', name: 'Knight', emoji: '⚔️', width: 48, height: 48, fillColor: '#d97706', category: 'characters' },

    // Tiles
    { id: 'tile-grass', name: 'Grass', emoji: '🟩', width: 32, height: 32, fillColor: '#22c55e', category: 'tiles' },
    { id: 'tile-stone', name: 'Stone', emoji: '⬜', width: 32, height: 32, fillColor: '#6b7280', category: 'tiles' },
    { id: 'tile-water', name: 'Water', emoji: '🟦', width: 32, height: 32, fillColor: '#3b82f6', category: 'tiles' },
    { id: 'tile-sand', name: 'Sand', emoji: '🟨', width: 32, height: 32, fillColor: '#eab308', category: 'tiles' },
    { id: 'tile-lava', name: 'Lava', emoji: '🟧', width: 32, height: 32, fillColor: '#f97316', category: 'tiles' },
    { id: 'tile-dirt', name: 'Dirt', emoji: '🟫', width: 32, height: 32, fillColor: '#92400e', category: 'tiles' },

    // Props
    { id: 'prop-tree', name: 'Tree', emoji: '🌳', width: 64, height: 80, fillColor: '#16a34a', category: 'props' },
    { id: 'prop-rock', name: 'Rock', emoji: '🪨', width: 48, height: 40, fillColor: '#6b7280', category: 'props' },
    { id: 'prop-chest', name: 'Chest', emoji: '📦', width: 40, height: 36, fillColor: '#d97706', category: 'props' },
    { id: 'prop-gem', name: 'Gem', emoji: '💎', width: 24, height: 24, fillColor: '#06b6d4', category: 'props' },
    { id: 'prop-key', name: 'Key', emoji: '🔑', width: 24, height: 24, fillColor: '#eab308', category: 'props' },
    { id: 'prop-flag', name: 'Flag', emoji: '🚩', width: 32, height: 48, fillColor: '#ef4444', category: 'props' },
    { id: 'prop-house', name: 'House', emoji: '🏠', width: 80, height: 72, fillColor: '#78716c', category: 'props' },
    { id: 'prop-coin', name: 'Coin', emoji: '🪙', width: 24, height: 24, fillColor: '#f59e0b', category: 'props' },

    // Effects
    { id: 'fx-fire', name: 'Fire', emoji: '🔥', width: 32, height: 40, fillColor: '#ef4444', category: 'effects' },
    { id: 'fx-star', name: 'Star', emoji: '⭐', width: 24, height: 24, fillColor: '#eab308', category: 'effects' },
    { id: 'fx-heart', name: 'Heart', emoji: '❤️', width: 24, height: 24, fillColor: '#ef4444', category: 'effects' },
    { id: 'fx-lightning', name: 'Lightning', emoji: '⚡', width: 20, height: 32, fillColor: '#eab308', category: 'effects' },
    { id: 'fx-sparkle', name: 'Sparkle', emoji: '✨', width: 24, height: 24, fillColor: '#f59e0b', category: 'effects' },
    { id: 'fx-explosion', name: 'Boom', emoji: '💥', width: 48, height: 48, fillColor: '#f97316', category: 'effects' },

    // Shapes
    { id: 'shape-rect', name: 'Rectangle', emoji: '⬜', width: 64, height: 48, fillColor: '#6366f1', category: 'shapes' },
    { id: 'shape-circle', name: 'Circle', emoji: '🔵', width: 48, height: 48, fillColor: '#3b82f6', category: 'shapes' },
    { id: 'shape-tri', name: 'Triangle', emoji: '🔺', width: 48, height: 48, fillColor: '#ef4444', category: 'shapes' },
    { id: 'shape-platform', name: 'Platform', emoji: '▬', width: 128, height: 24, fillColor: '#52525b', category: 'shapes' },
    { id: 'shape-wall', name: 'Wall', emoji: '▮', width: 24, height: 128, fillColor: '#52525b', category: 'shapes' },
];

const CATEGORIES = ['all', 'characters', 'tiles', 'props', 'effects', 'shapes'];
const CATEGORY_ICONS: Record<string, string> = {
    all: '🧩', characters: '🦸', tiles: '🗺️', props: '🏗️', effects: '✨', shapes: '🔷',
};

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

export default function BottomPanel2D() {
    const { addSprite, isPlaying, camera } = useEditor2DStore();
    const [panelTab, setPanelTab] = useState<PanelTab>('assets');
    const [activeCategory, setActiveCategory] = useState('all');
    const [collapsed, setCollapsed] = useState(false);

    if (isPlaying) return null;

    const filtered = activeCategory === 'all'
        ? SPRITE_ASSETS
        : SPRITE_ASSETS.filter((a) => a.category === activeCategory);

    const handleAdd = (asset: Asset2D) => {
        addSprite({
            name: asset.name,
            type: 'sprite',
            emoji: asset.emoji,
            width: asset.width,
            height: asset.height,
            fillColor: asset.fillColor,
            x: (400 - camera.x) / camera.zoom,
            y: (300 - camera.y) / camera.zoom,
        });
    };

    return (
        <div className={`editor-bottom-panel glass-panel ${collapsed ? 'collapsed' : ''}`}>
            {/* Main Tabs: Assets / Logic */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className="tab-bar" style={{ flex: 1, overflowX: 'auto' }}>
                    <div
                        className={`tab-item ${panelTab === 'assets' ? 'active' : ''}`}
                        onClick={() => { setPanelTab('assets'); setCollapsed(false); }}
                        style={panelTab === 'assets' ? { borderColor: '#14f195', color: '#14f195' } : {}}
                    >
                        🧩 Assets
                    </div>
                    <div
                        className={`tab-item ${panelTab === 'logic' ? 'active' : ''}`}
                        onClick={() => { setPanelTab('logic'); setCollapsed(false); }}
                        style={panelTab === 'logic' ? { borderColor: '#a78bfa', color: '#a78bfa' } : {}}
                    >
                        🔗 Blueprint
                    </div>

                    {/* Asset sub-categories — only show when on Assets tab */}
                    {panelTab === 'assets' && (
                        <>
                            <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.06)', margin: '0 4px' }} />
                            {CATEGORIES.map((cat) => (
                                <div
                                    key={cat}
                                    className={`tab-item ${activeCategory === cat ? 'active' : ''}`}
                                    onClick={() => { setActiveCategory(cat); setCollapsed(false); }}
                                    style={activeCategory === cat ? { borderColor: '#14f195', color: '#14f195' } : {}}
                                >
                                    {CATEGORY_ICONS[cat]} {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </div>
                            ))}
                        </>
                    )}
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
            {!collapsed && panelTab === 'assets' && (
                <div className="panel-body" style={{ padding: '8px 12px' }}>
                    <div style={{
                        display: 'flex',
                        gap: 8,
                        overflowX: 'auto',
                        paddingBottom: 4,
                    }}>
                        {filtered.map((asset) => (
                            <div
                                key={asset.id}
                                onClick={() => handleAdd(asset)}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 4,
                                    padding: '10px 14px',
                                    borderRadius: 10,
                                    background: 'rgba(255,255,255,0.02)',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                    minWidth: 76,
                                    flexShrink: 0,
                                }}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLDivElement).style.background = 'rgba(20,241,149,0.06)';
                                    (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(20,241,149,0.15)';
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.02)';
                                    (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.05)';
                                }}
                            >
                                <span style={{ fontSize: 28 }}>{asset.emoji}</span>
                                <span style={{ fontSize: 10, color: '#9ca3b0', fontWeight: 500, textAlign: 'center' }}>
                                    {asset.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Blueprint Node Editor */}
            {!collapsed && panelTab === 'logic' && (
                <div className="panel-body" style={{ padding: 0 }}>
                    <NodeEditor />
                </div>
            )}
        </div>
    );
}
