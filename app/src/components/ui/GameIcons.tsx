'use client';

import React from 'react';

/**
 * G3Engine Icon System
 * Clean SVG icons inspired by game-icons.net and web3icons.io
 * All icons use currentColor and accept size/color/className props.
 */

interface IconProps {
    size?: number;
    color?: string;
    className?: string;
    style?: React.CSSProperties;
}

const defaultProps = { size: 20, color: 'currentColor' };

function icon(path: React.ReactNode, vb = '0 0 24 24') {
    return function Icon({ size = 20, color = 'currentColor', className, style }: IconProps) {
        return (
            <svg width={size} height={size} viewBox={vb} fill="none" xmlns="http://www.w3.org/2000/svg"
                className={className} style={{ flexShrink: 0, ...style }}>
                {typeof path === 'string'
                    ? <path d={path} fill={color} />
                    : path}
            </svg>
        );
    };
}

// ═══════════════════════════════════════════
//  GAME ICONS — inspired by game-icons.net
// ═══════════════════════════════════════════

/** 🎮 Gamepad */
export const IconGamepad = icon(
    <><path d="M8 4a4 4 0 0 0-4 4v4a4 4 0 0 0 4 4h1.5l1.5 4h2l1.5-4H16a4 4 0 0 0 4-4V8a4 4 0 0 0-4-4H8zm0 2h8a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" fill="currentColor"/><rect x="7" y="9" width="4" height="2" rx="0.5" fill="currentColor"/><rect x="8" y="8" width="2" height="4" rx="0.5" fill="currentColor"/><circle cx="16" cy="9" r="1" fill="currentColor"/><circle cx="14.5" cy="10.5" r="1" fill="currentColor"/></>
);

/** 🏆 Trophy */
export const IconTrophy = icon(
    <><path d="M7 3v4a5 5 0 0 0 4 4.9V15H9v2h6v-2h-2v-3.1A5 5 0 0 0 17 7V3H7zm2 2h6v2a3 3 0 0 1-6 0V5z" fill="currentColor"/><path d="M5 4v3a3 3 0 0 0 2.08 2.85A6.97 6.97 0 0 1 5.07 7H5V4zm14 0v3h-.07a6.97 6.97 0 0 1-1.94 2.85A3 3 0 0 0 19 7V4z" fill="currentColor"/><rect x="8" y="18" width="8" height="2" rx="1" fill="currentColor"/></>
);

/** 🪙 Coin/Token */
export const IconCoin = icon(
    <><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none"/><circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1.5" fill="none"/><text x="12" y="16" textAnchor="middle" fill="currentColor" fontSize="10" fontWeight="bold">$</text></>
);

/** ⚡ Lightning / Bolt */
export const IconBolt = icon(
    "M13 2L4.093 13.29a.5.5 0 0 0 .407.71H10l-1 8 8.907-11.29a.5.5 0 0 0-.407-.71H14l1-8z"
);

/** 🏃 Runner */
export const IconRunner = icon(
    <><circle cx="14" cy="4" r="2" fill="currentColor"/><path d="M10.5 8.5l2.5 1.5 3-1.5 1 2-4 2-2.5-1.5-3 3.5-1.5-1 4-4.5zm2 6l-1.5 6h2l1-4 2 2v4h2v-5l-2.5-3 .5-2" fill="currentColor"/></>
);

/** 🚀 Rocket */
export const IconRocket = icon(
    <><path d="M12 2c-2.5 3-4 6.5-4 10a6.55 6.55 0 0 0 .5 2.5L6 17l2 2 2.5-2.5c.75.32 1.6.5 2.5.5s1.75-.18 2.5-.5L18 19l2-2-2.5-2.5A6.55 6.55 0 0 0 18 12c0-3.5-1.5-7-6-10z" fill="currentColor"/><circle cx="12" cy="10" r="2" fill="none" stroke="currentColor" strokeWidth="1.5"/></>
);

/** 🧩 Puzzle */
export const IconPuzzle = icon(
    <><path d="M11 2a2 2 0 0 1 2 2v.5a1 1 0 0 0 1.5.87l.37-.22A2 2 0 0 1 17.6 6.4l-.51.87A1 1 0 0 0 18 8.5h.5a2 2 0 0 1 0 4H18a1 1 0 0 0-.87 1.5l.22.37a2 2 0 0 1-1.24 2.73l-.87-.51A1 1 0 0 0 13.5 17v.5a2 2 0 0 1-4 0V17a1 1 0 0 0-1.5-.87l-.37.22a2 2 0 0 1-2.73-1.24l.51-.87A1 1 0 0 0 4.5 13H4a2 2 0 0 1 0-4h.5a1 1 0 0 0 .87-1.5l-.22-.37A2 2 0 0 1 6.4 4.4l.87.51A1 1 0 0 0 8.5 4V3.5A2 2 0 0 1 11 2z" fill="currentColor" opacity="0.8"/></>
);

/** 🏰 Castle */
export const IconCastle = icon(
    <><path d="M3 8h2V6h2v2h2V6h2v2h2V6h2v2h2V6h2v2h2v12H3V8z" fill="currentColor"/><rect x="9" y="13" width="6" height="7" rx="3" fill="var(--bg-base, #0f0f16)"/><rect x="5" y="8" width="2" height="2" fill="var(--bg-base, #0f0f16)"/><rect x="17" y="8" width="2" height="2" fill="var(--bg-base, #0f0f16)"/></>
);

/** 🎯 Target/Crosshair */
export const IconTarget = icon(
    <><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none"/><circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" fill="none"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><line x1="12" y1="1" x2="12" y2="5" stroke="currentColor" strokeWidth="1.5"/><line x1="12" y1="19" x2="12" y2="23" stroke="currentColor" strokeWidth="1.5"/><line x1="1" y1="12" x2="5" y2="12" stroke="currentColor" strokeWidth="1.5"/><line x1="19" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="1.5"/></>
);

/** 🔥 Fire */
export const IconFire = icon(
    "M12 2c-1 4-4 6-4 10a5 5 0 0 0 3.5 4.77A2.5 2.5 0 0 1 9.5 14.5c0-1.38 1-3 2.5-4.5 1.5 1.5 2.5 3.12 2.5 4.5a2.5 2.5 0 0 1-2 2.27A5 5 0 0 0 16 12c0-4-3-6-4-10z"
);

/** ⭐ Star */
export const IconStar = icon(
    "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
);

/** 💎 Gem */
export const IconGem = icon(
    <><path d="M6 3h12l4 7-10 12L2 10l4-7z" fill="currentColor"/><path d="M2 10h20M12 22L6 3M12 22l6-19M8 10l4-7 4 7" stroke="var(--bg-base, #0f0f16)" strokeWidth="1" fill="none"/></>
);

/** 🔑 Key */
export const IconKey = icon(
    <><circle cx="8" cy="10" r="4" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M12 10h7m0 0v3m0-3l-2.5 0v2" stroke="currentColor" strokeWidth="2"/><circle cx="8" cy="10" r="1.5" fill="currentColor"/></>
);

/** 📦 Chest / Box */
export const IconChest = icon(
    <><rect x="3" y="8" width="18" height="11" rx="2" fill="currentColor"/><path d="M3 11h18" stroke="var(--bg-base, #0f0f16)" strokeWidth="1.5"/><rect x="10" y="11" width="4" height="3" rx="1" fill="var(--bg-base, #0f0f16)"/><path d="M5 8l2-4h10l2 4" stroke="currentColor" strokeWidth="2" fill="none"/></>
);


// ═══════════════════════════════════════════
//  WEB3 ICONS — inspired by web3icons.io
// ═══════════════════════════════════════════

/** 🔗 Chain / Link */
export const IconChain = icon(
    <><path d="M10 14a3.5 3.5 0 0 0 5 0l3-3a3.5 3.5 0 0 0-5-5l-1 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/><path d="M14 10a3.5 3.5 0 0 0-5 0l-3 3a3.5 3.5 0 0 0 5 5l1-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/></>
);

/** ⬡ Hexagon (Token/NFT) */
export const IconHexagon = icon(
    <polygon points="12,2 21.5,7 21.5,17 12,22 2.5,17 2.5,7" stroke="currentColor" strokeWidth="2" fill="none"/>
);

/** 💳 Wallet */
export const IconWallet = icon(
    <><rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M2 10h20" stroke="currentColor" strokeWidth="2"/><circle cx="17" cy="14" r="1.5" fill="currentColor"/></>
);

/** 🎨 NFT / Paintbrush */
export const IconNFT = icon(
    <><path d="M4 20l1.5-4.5L17.5 3.5a2.12 2.12 0 0 1 3 3L8.5 18.5 4 20z" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M14.5 6.5l3 3" stroke="currentColor" strokeWidth="2"/></>
);

/** ◎ SOL (Solana) */
export const IconSolana = icon(
    <><path d="M5 17.5h12.5l2.5-2.5H7.5L5 17.5z" fill="currentColor"/><path d="M5 6.5h12.5L20 9H7.5L5 6.5z" fill="currentColor"/><path d="M20 12H7.5L5 14.5h12.5L20 12z" fill="currentColor"/></>
);


// ═══════════════════════════════════════════
//  UI / EDITOR ICONS
// ═══════════════════════════════════════════

/** ✨ Sparkle/Magic */
export const IconSparkle = icon(
    <><path d="M12 2l1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5L12 2z" fill="currentColor"/><path d="M18 14l.75 2.25L21 17l-2.25.75L18 20l-.75-2.25L15 17l2.25-.75L18 14z" fill="currentColor" opacity="0.6"/></>
);

/** ⚙️ Settings Gear */
export const IconGear = icon(
    <><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="1.5" fill="none"/></>
);

/** 🗑️ Trash */
export const IconTrash = icon(
    <><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/><path d="M5 6v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6" stroke="currentColor" strokeWidth="2" fill="none"/><line x1="10" y1="11" x2="10" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="14" y1="11" x2="14" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></>
);

/** ✕ Close / X */
export const IconClose = icon(
    <><line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></>
);

/** 🛠️ Build / Wrench */
export const IconBuild = icon(
    <><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="currentColor" strokeWidth="2" fill="none"/></>
);

/** ↑ Send */
export const IconSend = icon(
    <><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></>
);

/** 🚀 Publish/Deploy */
export const IconPublish = icon(
    <><path d="M4 19h16M12 15V3m0 0l-5 5m5-5l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></>
);

/** ▶ Play */
export const IconPlay = icon(
    <polygon points="6,3 20,12 6,21" fill="currentColor"/>
);

/** ❤️ Heart */
export const IconHeart = icon(
    "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
);

/** 🤖 Robot */
export const IconRobot = icon(
    <><rect x="5" y="8" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/><circle cx="9" cy="13" r="1.5" fill="currentColor"/><circle cx="15" cy="13" r="1.5" fill="currentColor"/><line x1="12" y1="5" x2="12" y2="8" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="4" r="1.5" fill="currentColor"/><rect x="8" y="18" width="8" height="2" rx="1" fill="currentColor"/></>
);

/** ⚔️ Sword/Knight */
export const IconSword = icon(
    <><path d="M14.5 3.5l6 6-9 9-6-6 9-9z" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M5.5 14.5l-2 5 5-2" stroke="currentColor" strokeWidth="2" fill="none"/><line x1="18" y1="6" x2="15" y2="9" stroke="currentColor" strokeWidth="2"/></>
);

/** 🗺️ Map/Tiles */
export const IconMap = icon(
    <><path d="M1 6l7-3 8 3 7-3v15l-7 3-8-3-7 3V6z" stroke="currentColor" strokeWidth="2" fill="none"/><line x1="8" y1="3" x2="8" y2="18" stroke="currentColor" strokeWidth="1.5"/><line x1="16" y1="6" x2="16" y2="21" stroke="currentColor" strokeWidth="1.5"/></>
);

/** 🦸 Hero/Character */
export const IconHero = icon(
    <><circle cx="12" cy="5" r="3" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M5 21v-4a7 7 0 0 1 14 0v4" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M8 14l4-2 4 2" stroke="currentColor" strokeWidth="2" fill="none"/></>
);

/** 🔷 Shape */
export const IconShape = icon(
    <><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" fill="none"/></>
);

/** 📊 Stats/Chart */
export const IconChart = icon(
    <><rect x="3" y="12" width="4" height="8" rx="1" fill="currentColor"/><rect x="10" y="7" width="4" height="13" rx="1" fill="currentColor"/><rect x="17" y="3" width="4" height="17" rx="1" fill="currentColor"/></>
);

/** 💰 Money/Earn */
export const IconMoney = icon(
    <><rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" fill="none"/><circle cx="5" cy="12" r="0.5" fill="currentColor"/><circle cx="19" cy="12" r="0.5" fill="currentColor"/></>
);

/** 🔬 Distance/Measure */
export const IconDistance = icon(
    <><path d="M3 21h18M3 21L12 3l9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/><line x1="7.5" y1="12" x2="16.5" y2="12" stroke="currentColor" strokeWidth="1.5"/></>
);
