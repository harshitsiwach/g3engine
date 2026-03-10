'use client';

import React, { useEffect } from 'react';
import { useGameRewardStore, RewardLogEntry } from '@/store/gameRewardStore';
import { useEditorStore } from '@/store/editorStore';
import { TrophyIcon, CoinsIcon, RulerIcon, ZapIcon, PaletteIcon, SolanaIcon } from '@/components/icons';

// ─── Main HUD ───

export default function GameHUD() {
    const { isPlaying } = useEditorStore();
    const {
        coinsCollected, obstaclesDodged, score, distance,
        activeToasts, dismissToast, rewardsEnabled,
    } = useGameRewardStore();

    // Auto-dismiss toasts after 3s
    useEffect(() => {
        if (activeToasts.length === 0) return;
        const timers = activeToasts.map((t) =>
            setTimeout(() => dismissToast(t.id), 3000)
        );
        return () => timers.forEach(clearTimeout);
    }, [activeToasts, dismissToast]);

    if (!isPlaying) return null;

    return (
        <>
            {/* Inline keyframes */}
            <style>{`
                @keyframes hudSlideIn { 0% { transform: translateY(-20px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
                @keyframes hudPop { 0% { transform: scale(0.8); opacity: 0; } 50% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }
                @keyframes rewardToastIn {
                    0% { transform: translateX(80px) scale(0.9); opacity: 0; }
                    30% { transform: translateX(-5px) scale(1.02); opacity: 1; }
                    50% { transform: translateX(0) scale(1); }
                    85% { transform: translateX(0); opacity: 1; }
                    100% { transform: translateX(40px); opacity: 0; }
                }
                @keyframes toastGlow {
                    0%, 100% { box-shadow: 0 0 8px rgba(20,241,149,0.15); }
                    50% { box-shadow: 0 0 24px rgba(20,241,149,0.3); }
                }
                @keyframes coinSpin { 0% { transform: rotateY(0deg); } 100% { transform: rotateY(360deg); } }
                @keyframes scoreFlash { 0% { color: #fff; } 50% { color: #14f195; } 100% { color: #fff; } }
            `}</style>

            {/* Top Stats Bar */}
            <div style={{
                position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
                display: 'flex', gap: 6, zIndex: 30, pointerEvents: 'none',
                animation: 'hudSlideIn 0.5s ease',
            }}>
                {/* Score */}
                <div style={statPillStyle}>
                    <TrophyIcon size={14} style={{ color: '#fbbf24' }} />
                    <div>
                        <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.35)', fontWeight: 700, textTransform: 'uppercase' }}>Score</div>
                        <div style={{ fontSize: 16, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{score}</div>
                    </div>
                </div>

                {/* Coins */}
                <div style={statPillStyle}>
                    <CoinsIcon size={14} style={{ color: '#fbbf24', display: 'inline-block', animation: 'coinSpin 2s linear infinite' }} />
                    <div>
                        <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.35)', fontWeight: 700, textTransform: 'uppercase' }}>Coins</div>
                        <div style={{ fontSize: 16, fontWeight: 900, color: '#eab308', lineHeight: 1 }}>{coinsCollected}</div>
                    </div>
                </div>

                {/* Distance */}
                <div style={statPillStyle}>
                    <RulerIcon size={14} style={{ color: '#38bdf8' }} />
                    <div>
                        <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.35)', fontWeight: 700, textTransform: 'uppercase' }}>Distance</div>
                        <div style={{ fontSize: 16, fontWeight: 900, color: '#3b82f6', lineHeight: 1 }}>{Math.floor(distance)}m</div>
                    </div>
                </div>

                {/* Dodges */}
                <div style={statPillStyle}>
                    <ZapIcon size={14} style={{ color: '#a78bfa' }} />
                    <div>
                        <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.35)', fontWeight: 700, textTransform: 'uppercase' }}>Dodges</div>
                        <div style={{ fontSize: 16, fontWeight: 900, color: '#22c55e', lineHeight: 1 }}>{obstaclesDodged}</div>
                    </div>
                </div>
            </div>

            {/* Web3 Rewards Badge */}
            {rewardsEnabled && (
                <div style={{
                    position: 'absolute', top: 12, right: 12,
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '6px 10px', borderRadius: 8,
                    background: 'rgba(20,241,149,0.1)',
                    border: '1px solid rgba(20,241,149,0.2)',
                    backdropFilter: 'blur(8px)',
                    zIndex: 30, pointerEvents: 'none',
                    animation: 'hudPop 0.6s ease',
                }}>
                    <div style={{
                        width: 6, height: 6, borderRadius: 3, background: '#14f195',
                        boxShadow: '0 0 6px #14f195',
                    }} />
                    <span style={{ fontSize: 9, fontWeight: 700, color: '#14f195', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Web3 Rewards Active
                    </span>
                </div>
            )}

            {/* Reward Toasts */}
            <div style={{
                position: 'absolute', bottom: 80, right: 16,
                display: 'flex', flexDirection: 'column', gap: 8,
                zIndex: 30, pointerEvents: 'none',
                alignItems: 'flex-end',
            }}>
                {activeToasts.slice(-5).map((toast, i) => (
                    <RewardToast key={toast.id} toast={toast} index={i} />
                ))}
            </div>
        </>
    );
}

// ─── Toast ───

function RewardToast({ toast, index }: { toast: RewardLogEntry; index: number }) {
    const isToken = toast.rewardType === 'token_drop';
    const isNft = toast.rewardType === 'nft_mint';

    const bg = isToken ? 'rgba(20,241,149,0.12)' : isNft ? 'rgba(139,92,246,0.12)' : 'rgba(245,158,11,0.12)';
    const border = isToken ? 'rgba(20,241,149,0.3)' : isNft ? 'rgba(139,92,246,0.3)' : 'rgba(245,158,11,0.3)';
    const color = isToken ? '#14f195' : isNft ? '#a78bfa' : '#f59e0b';
    const icon = isToken ? <CoinsIcon size={16} style={{ color: '#fbbf24' }} /> : isNft ? <PaletteIcon size={16} style={{ color: '#ec4899' }} /> : <SolanaIcon size={16} style={{ color: '#14f195' }} />;

    return (
        <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 16px', borderRadius: 12,
            background: bg, border: `1px solid ${border}`,
            backdropFilter: 'blur(16px)',
            animation: `rewardToastIn 3s ease forwards, toastGlow 1s ease 2`,
            animationDelay: `${index * 0.08}s`,
            whiteSpace: 'nowrap',
        }}>
            <span style={{ fontSize: 20 }}>{icon}</span>
            <div>
                <div style={{ fontSize: 14, fontWeight: 800, color, letterSpacing: '-0.01em' }}>
                    {toast.label}
                </div>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginTop: 1, textTransform: 'uppercase', fontWeight: 600 }}>
                    {isToken ? 'Token Reward' : isNft ? 'NFT Minted' : 'SOL Sent'}
                </div>
            </div>
        </div>
    );
}

// ─── Styles ───

const statPillStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '8px 14px', borderRadius: 10,
    background: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
    minWidth: 70,
};
