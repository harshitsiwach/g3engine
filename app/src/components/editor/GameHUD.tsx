'use client';

import React, { useEffect, useCallback } from 'react';
import { useGameRewardStore, RewardLogEntry } from '@/store/gameRewardStore';
import { useEditorStore } from '@/store/editorStore';

// ─── Main HUD ───

export default function GameHUD() {
    const { isPlaying } = useEditorStore();
    const {
        coinsCollected, obstaclesDodged, score, distance,
        activeToasts, dismissToast,
    } = useGameRewardStore();

    // Auto-dismiss toasts after 2.5s
    useEffect(() => {
        if (activeToasts.length === 0) return;
        const timers = activeToasts.map((t) =>
            setTimeout(() => dismissToast(t.id), 2500)
        );
        return () => timers.forEach(clearTimeout);
    }, [activeToasts, dismissToast]);

    if (!isPlaying) return null;

    return (
        <>
            {/* Top-left stats */}
            <div style={statsContainerStyle}>
                <div style={statRowStyle}>
                    <span style={{ fontSize: 16 }}>🪙</span>
                    <span style={statValueStyle}>{coinsCollected}</span>
                </div>
                <div style={statRowStyle}>
                    <span style={{ fontSize: 16 }}>🏆</span>
                    <span style={statValueStyle}>{score}</span>
                </div>
                <div style={statRowStyle}>
                    <span style={{ fontSize: 16 }}>🏃</span>
                    <span style={statValueStyle}>{Math.floor(distance)}m</span>
                </div>
            </div>

            {/* Reward toasts (right side) */}
            <div style={toastContainerStyle}>
                {activeToasts.slice(-4).map((toast, i) => (
                    <RewardToast key={toast.id} toast={toast} index={i} />
                ))}
            </div>

            {/* Inline animation keyframes */}
            <style>{`
                @keyframes rewardSlideIn {
                    0% { transform: translateX(100px); opacity: 0; }
                    20% { transform: translateX(0); opacity: 1; }
                    80% { transform: translateX(0); opacity: 1; }
                    100% { transform: translateX(60px); opacity: 0; }
                }
                @keyframes rewardGlow {
                    0%, 100% { box-shadow: 0 0 8px rgba(20,241,149,0.2); }
                    50% { box-shadow: 0 0 20px rgba(20,241,149,0.5); }
                }
            `}</style>
        </>
    );
}

// ─── Toast Component ───

function RewardToast({ toast, index }: { toast: RewardLogEntry; index: number }) {
    const bgColor = toast.rewardType === 'token_drop'
        ? 'rgba(20,241,149,0.12)'
        : toast.rewardType === 'nft_mint'
            ? 'rgba(139,92,246,0.12)'
            : 'rgba(245,158,11,0.12)';

    const borderColor = toast.rewardType === 'token_drop'
        ? 'rgba(20,241,149,0.25)'
        : toast.rewardType === 'nft_mint'
            ? 'rgba(139,92,246,0.25)'
            : 'rgba(245,158,11,0.25)';

    const textColor = toast.rewardType === 'token_drop'
        ? '#14f195'
        : toast.rewardType === 'nft_mint'
            ? '#a78bfa'
            : '#f59e0b';

    const icon = toast.rewardType === 'token_drop' ? '🪙'
        : toast.rewardType === 'nft_mint' ? '🎨' : '◎';

    return (
        <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 14px', borderRadius: 10,
            background: bgColor, border: `1px solid ${borderColor}`,
            backdropFilter: 'blur(12px)',
            animation: 'rewardSlideIn 2.5s ease forwards, rewardGlow 1s ease 2',
            animationDelay: `${index * 0.1}s`,
            whiteSpace: 'nowrap',
        }}>
            <span style={{ fontSize: 16 }}>{icon}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: textColor, letterSpacing: '-0.01em' }}>
                {toast.label}
            </span>
        </div>
    );
}

// ─── Styles ───

const statsContainerStyle: React.CSSProperties = {
    position: 'absolute', top: 16, left: 16,
    display: 'flex', flexDirection: 'column', gap: 8,
    zIndex: 30, pointerEvents: 'none',
};

const statRowStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '6px 12px', borderRadius: 8,
    background: 'rgba(0,0,0,0.5)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.08)',
};

const statValueStyle: React.CSSProperties = {
    fontSize: 14, fontWeight: 700, color: '#fff',
    fontFamily: "'Inter', monospace",
    minWidth: 40,
};

const toastContainerStyle: React.CSSProperties = {
    position: 'absolute', top: 16, right: 16,
    display: 'flex', flexDirection: 'column', gap: 6,
    zIndex: 30, pointerEvents: 'none',
    alignItems: 'flex-end',
};
