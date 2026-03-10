'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useEditor2DStore } from '@/store/editor2DStore';
import {
    PersonRunIcon, BotIcon, SkullIcon, TargetIcon, ZapIcon, SparklesIcon, DiamondIcon,
    CoinsIcon, TrophyIcon, ShieldIcon, SwordsIcon, RocketIcon, HeartIcon, FlameIcon, StarIcon,
    LockIcon, GemIcon, HexagonIcon, PaletteIcon, LinkIcon, MapIcon, CastleIcon, PuzzleIcon
} from '@/components/icons';

const NodeEditor = dynamic(() => import('@/components/scripting/NodeEditor'), { ssr: false });

type PanelTab = 'assets' | 'logic';

// ─── Asset Categories ───

interface Asset2D {
    id: string;
    name: string;
    emoji: string;
    icon?: React.ReactNode;
    width: number;
    height: number;
    fillColor: string;
    category: string;
}

const SPRITE_ASSETS: Asset2D[] = [
    // Characters
    { id: 'char-hero', name: 'Hero', emoji: '🦸', icon: <PersonRunIcon size={28} style={{ color: '#ebf4ff' }} />, width: 48, height: 48, fillColor: '#6366f1', category: 'characters' },
    { id: 'char-villain', name: 'Villain', emoji: '🦹', icon: <SkullIcon size={28} style={{ color: '#fee2e2' }} />, width: 48, height: 48, fillColor: '#ef4444', category: 'characters' },
    { id: 'char-robot', name: 'Robot', emoji: '🤖', icon: <BotIcon size={28} style={{ color: '#f1f5f9' }} />, width: 48, height: 48, fillColor: '#64748b', category: 'characters' },
    { id: 'char-alien', name: 'Alien', emoji: '👾', icon: <RocketIcon size={28} style={{ color: '#dcfce7' }} />, width: 48, height: 48, fillColor: '#22c55e', category: 'characters' },
    { id: 'char-wizard', name: 'Wizard', emoji: '🧙', icon: <SparklesIcon size={28} style={{ color: '#f3e8ff' }} />, width: 48, height: 48, fillColor: '#a855f7', category: 'characters' },
    { id: 'char-knight', name: 'Knight', emoji: '⚔️', icon: <SwordsIcon size={28} style={{ color: '#fef3c7' }} />, width: 48, height: 48, fillColor: '#d97706', category: 'characters' },

    // Tiles
    { id: 'tile-grass', name: 'Grass', emoji: '🟩', icon: <MapIcon size={28} style={{ color: '#4ade80' }} />, width: 32, height: 32, fillColor: '#22c55e', category: 'tiles' },
    { id: 'tile-stone', name: 'Stone', emoji: '⬜', icon: <HexagonIcon size={28} style={{ color: '#9ca3af' }} />, width: 32, height: 32, fillColor: '#6b7280', category: 'tiles' },
    { id: 'tile-water', name: 'Water', emoji: '🟦', icon: <DiamondIcon size={28} style={{ color: '#60a5fa' }} />, width: 32, height: 32, fillColor: '#3b82f6', category: 'tiles' },
    { id: 'tile-sand', name: 'Sand', emoji: '🟨', icon: <HexagonIcon size={28} style={{ color: '#fde047' }} />, width: 32, height: 32, fillColor: '#eab308', category: 'tiles' },
    { id: 'tile-lava', name: 'Lava', emoji: '🟧', icon: <FlameIcon size={28} style={{ color: '#fb923c' }} />, width: 32, height: 32, fillColor: '#f97316', category: 'tiles' },
    { id: 'tile-dirt', name: 'Dirt', emoji: '🟫', icon: <MapIcon size={28} style={{ color: '#b45309' }} />, width: 32, height: 32, fillColor: '#92400e', category: 'tiles' },

    // Props
    { id: 'prop-tree', name: 'Tree', emoji: '🌳', icon: <HexagonIcon size={28} style={{ color: '#22c55e' }} />, width: 64, height: 80, fillColor: '#16a34a', category: 'props' },
    { id: 'prop-rock', name: 'Rock', emoji: '🪨', icon: <HexagonIcon size={28} style={{ color: '#6b7280' }} />, width: 48, height: 40, fillColor: '#6b7280', category: 'props' },
    { id: 'prop-chest', name: 'Chest', emoji: '📦', icon: <CastleIcon size={28} style={{ color: '#d97706' }} />, width: 40, height: 36, fillColor: '#d97706', category: 'props' },
    { id: 'prop-gem', name: 'Gem', emoji: '💎', icon: <GemIcon size={28} style={{ color: '#06b6d4' }} />, width: 24, height: 24, fillColor: '#06b6d4', category: 'props' },
    { id: 'prop-key', name: 'Key', emoji: '🔑', icon: <LockIcon size={28} style={{ color: '#eab308' }} />, width: 24, height: 24, fillColor: '#eab308', category: 'props' },
    { id: 'prop-flag', name: 'Flag', emoji: '🚩', icon: <TargetIcon size={28} style={{ color: '#ef4444' }} />, width: 32, height: 48, fillColor: '#ef4444', category: 'props' },
    { id: 'prop-house', name: 'House', emoji: '🏠', icon: <CastleIcon size={28} style={{ color: '#78716c' }} />, width: 80, height: 72, fillColor: '#78716c', category: 'props' },
    { id: 'prop-coin', name: 'Coin', emoji: '🪙', icon: <CoinsIcon size={28} style={{ color: '#f59e0b' }} />, width: 24, height: 24, fillColor: '#f59e0b', category: 'props' },

    // Effects
    { id: 'fx-fire', name: 'Fire', emoji: '🔥', icon: <FlameIcon size={28} style={{ color: '#ef4444' }} />, width: 32, height: 40, fillColor: '#ef4444', category: 'effects' },
    { id: 'fx-star', name: 'Star', emoji: '⭐', icon: <StarIcon size={28} style={{ color: '#eab308' }} />, width: 24, height: 24, fillColor: '#eab308', category: 'effects' },
    { id: 'fx-heart', name: 'Heart', emoji: '❤️', icon: <HeartIcon size={28} style={{ color: '#ef4444' }} />, width: 24, height: 24, fillColor: '#ef4444', category: 'effects' },
    { id: 'fx-lightning', name: 'Lightning', emoji: '⚡', icon: <ZapIcon size={28} style={{ color: '#eab308' }} />, width: 20, height: 32, fillColor: '#eab308', category: 'effects' },
    { id: 'fx-sparkle', name: 'Sparkle', emoji: '✨', icon: <SparklesIcon size={28} style={{ color: '#f59e0b' }} />, width: 24, height: 24, fillColor: '#f59e0b', category: 'effects' },
    { id: 'fx-explosion', name: 'Boom', emoji: '💥', icon: <FlameIcon size={28} style={{ color: '#f97316' }} />, width: 48, height: 48, fillColor: '#f97316', category: 'effects' },

    // Shapes
    { id: 'shape-rect', name: 'Rectangle', emoji: '⬜', icon: <HexagonIcon size={28} style={{ color: '#6366f1' }} />, width: 64, height: 48, fillColor: '#6366f1', category: 'shapes' },
    { id: 'shape-circle', name: 'Circle', emoji: '🔵', icon: <DiamondIcon size={28} style={{ color: '#3b82f6' }} />, width: 48, height: 48, fillColor: '#3b82f6', category: 'shapes' },
    { id: 'shape-tri', name: 'Triangle', emoji: '🔺', icon: <TargetIcon size={28} style={{ color: '#ef4444' }} />, width: 48, height: 48, fillColor: '#ef4444', category: 'shapes' },
    { id: 'shape-platform', name: 'Platform', emoji: '▬', icon: <HexagonIcon size={28} style={{ color: '#52525b' }} />, width: 128, height: 24, fillColor: '#52525b', category: 'shapes' },
    { id: 'shape-wall', name: 'Wall', emoji: '▮', icon: <HexagonIcon size={28} style={{ color: '#52525b' }} />, width: 24, height: 128, fillColor: '#52525b', category: 'shapes' },
];

const CATEGORIES = ['all', 'characters', 'tiles', 'props', 'effects', 'shapes'];
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
    all: <PuzzleIcon size={14} />, characters: <PersonRunIcon size={14} />, tiles: <MapIcon size={14} />, props: <CastleIcon size={14} />, effects: <SparklesIcon size={14} />, shapes: <HexagonIcon size={14} />,
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
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><PuzzleIcon size={14} /> Assets</span>
                    </div>
                    <div
                        className={`tab-item ${panelTab === 'logic' ? 'active' : ''}`}
                        onClick={() => { setPanelTab('logic'); setCollapsed(false); }}
                        style={panelTab === 'logic' ? { borderColor: '#a78bfa', color: '#a78bfa' } : {}}
                    >
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><LinkIcon size={14} /> Blueprint</span>
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
                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, marginBottom: 4 }}>
                                    {asset.icon || <span style={{ fontSize: 28 }}>{asset.emoji}</span>}
                                </span>
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
