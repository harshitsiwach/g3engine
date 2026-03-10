'use client';

import React, { useState } from 'react';
import {
    useGameRewardStore,
    GameEvent,
    RewardType,
    RewardRule,
} from '@/store/gameRewardStore';
import {
    CoinsIcon, PersonRunIcon, TrophyIcon, TargetIcon, SkullIcon,
    PaletteIcon, SolanaIcon, GamepadIcon, GiftIcon, CrosshairIcon,
} from '@/components/icons';

// ─── Constants ───

const EVENT_OPTIONS: { value: GameEvent; label: string; icon: React.ReactNode; desc: string; color: string }[] = [
    { value: 'coin_collected', label: 'Coin Collected', icon: <CoinsIcon size={16} />, desc: 'Player picks up an in-game coin', color: '#eab308' },
    { value: 'obstacle_dodged', label: 'Obstacle Dodged', icon: <PersonRunIcon size={16} />, desc: 'Player avoids an obstacle', color: '#22c55e' },
    { value: 'score_milestone', label: 'Score Milestone', icon: <TrophyIcon size={16} />, desc: 'Player reaches a score threshold', color: '#f59e0b' },
    { value: 'level_complete', label: 'Level Complete', icon: <TargetIcon size={16} />, desc: 'Player finishes a level', color: '#3b82f6' },
    { value: 'game_over', label: 'Game Over', icon: <SkullIcon size={16} />, desc: 'Play session ends', color: '#ef4444' },
];

const REWARD_OPTIONS: { value: RewardType; label: string; icon: React.ReactNode; color: string }[] = [
    { value: 'token_drop', label: 'Drop Tokens', icon: <CoinsIcon size={16} />, color: '#14f195' },
    { value: 'nft_mint', label: 'Mint NFT', icon: <PaletteIcon size={16} />, color: '#a78bfa' },
    { value: 'sol_tip', label: 'Send SOL', icon: <SolanaIcon size={16} />, color: '#f59e0b' },
];

const PRESET_TEMPLATES = [
    { title: 'Endless Runner', icon: <PersonRunIcon size={14} />, desc: 'Coins → tokens, dodges → bonus', rules: [
        { event: 'coin_collected' as GameEvent, rewardType: 'token_drop' as RewardType, amount: 10, tokenSymbol: 'G3', cooldownMs: 0 },
        { event: 'obstacle_dodged' as GameEvent, rewardType: 'token_drop' as RewardType, amount: 5, tokenSymbol: 'G3', cooldownMs: 2000 },
    ]},
    { title: 'Achievement Hunter', icon: <TrophyIcon size={14} />, desc: 'Score milestones → unique NFTs', rules: [
        { event: 'score_milestone' as GameEvent, rewardType: 'nft_mint' as RewardType, amount: 1, nftName: 'Achievement Badge', milestoneThreshold: 100 },
        { event: 'level_complete' as GameEvent, rewardType: 'token_drop' as RewardType, amount: 50, tokenSymbol: 'G3' },
    ]},
    { title: '💰 Play-to-Earn', desc: 'Every action earns crypto', rules: [
        { event: 'coin_collected' as GameEvent, rewardType: 'token_drop' as RewardType, amount: 1, tokenSymbol: 'GAME', cooldownMs: 0 },
        { event: 'obstacle_dodged' as GameEvent, rewardType: 'sol_tip' as RewardType, amount: 0.001, cooldownMs: 5000 },
        { event: 'game_over' as GameEvent, rewardType: 'nft_mint' as RewardType, amount: 1, nftName: 'Session NFT' },
    ]},
];

// ─── Main Component ───

export default function Web3RewardsPanel() {
    const {
        rules, rewardsEnabled, rewardLog, coinsCollected, obstaclesDodged, score,
        setRewardsEnabled, addRule, removeRule, updateRule, toggleRule,
    } = useGameRewardStore();
    const [showPresets, setShowPresets] = useState(rules.length === 0);

    const handleAddRule = () => {
        addRule({
            event: 'coin_collected',
            rewardType: 'token_drop',
            amount: 10,
            tokenMint: '',
            tokenSymbol: 'G3',
            nftName: '',
            cooldownMs: 0,
            milestoneThreshold: 100,
            enabled: true,
        });
        setShowPresets(false);
    };

    const handleApplyPreset = (preset: typeof PRESET_TEMPLATES[0]) => {
        preset.rules.forEach((r) => {
            addRule({
                event: r.event,
                rewardType: r.rewardType,
                amount: r.amount,
                tokenMint: '',
                tokenSymbol: (r as any).tokenSymbol || '',
                nftName: (r as any).nftName || '',
                cooldownMs: (r as any).cooldownMs || 0,
                milestoneThreshold: (r as any).milestoneThreshold || 0,
                enabled: true,
            });
        });
        setShowPresets(false);
    };

    return (
        <div style={panelStyle}>
            {/* Animated CSS */}
            <style>{`
                @keyframes rwdPulse { 0%,100%{ box-shadow: 0 0 0 0 rgba(20,241,149,0.15); } 50%{ box-shadow: 0 0 16px 4px rgba(20,241,149,0.15); } }
                @keyframes rwdFloat { 0%,100%{ transform: translateY(0); } 50%{ transform: translateY(-3px); } }
                @keyframes rwdGlowLine { 0%{ background-position: -200% 0; } 100%{ background-position: 200% 0; } }
                .rwd-card:hover { border-color: rgba(139,92,246,0.4) !important; transform: translateY(-1px); }
                .rwd-preset:hover { border-color: rgba(20,241,149,0.4) !important; background: rgba(20,241,149,0.06) !important; transform: scale(1.02); }
                .rwd-add:hover { background: rgba(139,92,246,0.12) !important; border-color: rgba(139,92,246,0.5) !important; }
            `}</style>

            {/* Header */}
            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                padding: '14px 16px', borderRadius: 14,
                background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(20,241,149,0.06))',
                border: '1px solid rgba(139,92,246,0.12)',
                marginBottom: 14,
            }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <GamepadIcon size={22} style={{ animation: 'rwdFloat 2s ease infinite' }} />
                        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
                            Game Rewards
                        </h3>
                    </div>
                    <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5, maxWidth: 200 }}>
                        Reward players with tokens, NFTs, or SOL when they trigger game events
                    </p>
                </div>
                <label style={{ cursor: 'pointer', marginTop: 4 }}>
                    <input type="checkbox" checked={rewardsEnabled} onChange={(e) => setRewardsEnabled(e.target.checked)} style={{ display: 'none' }} />
                    <div style={{
                        width: 40, height: 22, borderRadius: 11, padding: 2,
                        background: rewardsEnabled ? 'linear-gradient(135deg, #14f195, #9945FF)' : 'rgba(255,255,255,0.08)',
                        transition: 'all 0.3s', position: 'relative',
                        animation: rewardsEnabled ? 'rwdPulse 2s ease infinite' : 'none',
                    }}>
                        <div style={{
                            width: 18, height: 18, borderRadius: 9,
                            background: '#fff',
                            transform: rewardsEnabled ? 'translateX(18px)' : 'translateX(0)',
                            transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        }} />
                    </div>
                </label>
            </div>

            {/* Live Stats Bar */}
            {rewardLog.length > 0 && (
                <div style={{
                    display: 'flex', gap: 6, marginBottom: 14,
                }}>
                    {[
                        { icon: <CoinsIcon size={10} />, val: coinsCollected, label: 'Coins' },
                        { icon: <PersonRunIcon size={10} />, val: obstaclesDodged, label: 'Dodges' },
                        { icon: <TrophyIcon size={10} />, val: score, label: 'Score' },
                        { icon: <GiftIcon size={10} />, val: rewardLog.length, label: 'Rewards' },
                    ].map((s) => (
                        <div key={s.label} style={{
                            flex: 1, padding: '8px 4px', borderRadius: 8, textAlign: 'center',
                            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
                        }}>
                            <div style={{ fontSize: 14 }}>{s.icon}</div>
                            <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>{s.val}</div>
                            <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', fontWeight: 600 }}>
                                {s.label}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Preset Templates */}
            {showPresets && rules.length === 0 && (
                <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                        Quick Start Templates
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {PRESET_TEMPLATES.map((preset, i) => (
                            <div
                                key={i}
                                className="rwd-preset"
                                onClick={() => handleApplyPreset(preset)}
                                style={{
                                    padding: '10px 12px', borderRadius: 10, cursor: 'pointer',
                                    background: 'rgba(255,255,255,0.02)',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    transition: 'all 0.2s',
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{preset.title}</div>
                                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{preset.desc}</div>
                                    </div>
                                    <span style={{ fontSize: 10, color: '#14f195', fontWeight: 600, padding: '3px 8px', borderRadius: 6, background: 'rgba(20,241,149,0.1)' }}>
                                        Use
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Rules */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 320, overflowY: 'auto', scrollbarWidth: 'none' }}>
                {rules.map((rule) => (
                    <RuleCard
                        key={rule.id}
                        rule={rule}
                        onUpdate={(u) => updateRule(rule.id, u)}
                        onToggle={() => toggleRule(rule.id)}
                        onRemove={() => removeRule(rule.id)}
                    />
                ))}
            </div>

            {/* Add Rule */}
            <button onClick={handleAddRule} className="rwd-add" style={addBtnStyle}>
                <span style={{ fontSize: 16, lineHeight: 1 }}>+</span>
                Add Reward Rule
            </button>

            {/* How it works - empty state */}
            {rules.length === 0 && !showPresets && (
                <div style={{
                    marginTop: 14, padding: 16, borderRadius: 12, textAlign: 'center',
                    background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
                }}>
                    <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.6 }}><CrosshairIcon size={28} /></div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#fff', marginBottom: 4 }}>No rewards configured</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6, maxWidth: 200, margin: '0 auto' }}>
                        Add rules above or{' '}
                        <span onClick={() => setShowPresets(true)} style={{ color: '#14f195', cursor: 'pointer', textDecoration: 'underline' }}>
                            use a template
                        </span>
                        {' '}to start rewarding players!
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Rule Card ───

function RuleCard({ rule, onUpdate, onToggle, onRemove }: {
    rule: RewardRule;
    onUpdate: (u: Partial<RewardRule>) => void;
    onToggle: () => void;
    onRemove: () => void;
}) {
    const eventInfo = EVENT_OPTIONS.find((e) => e.value === rule.event)!;
    const rewardInfo = REWARD_OPTIONS.find((r) => r.value === rule.rewardType)!;

    return (
        <div className="rwd-card" style={{
            padding: 0, borderRadius: 12, overflow: 'hidden',
            background: 'rgba(255,255,255,0.02)',
            border: `1px solid ${rule.enabled ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.04)'}`,
            opacity: rule.enabled ? 1 : 0.45,
            transition: 'all 0.25s ease',
        }}>
            {/* Event Section */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 12px',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
            }}>
                <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: `${eventInfo.color}15`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16, flexShrink: 0,
                }}>
                    {eventInfo.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <select value={rule.event} onChange={(e) => onUpdate({ event: e.target.value as GameEvent })} style={selectStyle}>
                        {EVENT_OPTIONS.map((e) => <option key={e.value} value={e.value}>When: {e.label}</option>)}
                    </select>
                </div>
                <div style={{ display: 'flex', gap: 3 }}>
                    <button onClick={onToggle} style={{
                        ...smBtnStyle,
                        background: rule.enabled ? 'rgba(20,241,149,0.12)' : 'rgba(255,255,255,0.04)',
                        color: rule.enabled ? '#14f195' : 'rgba(255,255,255,0.3)',
                    }}>
                        {rule.enabled ? '●' : '○'}
                    </button>
                    <button onClick={onRemove} style={{ ...smBtnStyle, color: '#ef4444', background: 'rgba(239,68,68,0.08)' }}>✕</button>
                </div>
            </div>

            {/* Flow Arrow */}
            <div style={{
                height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.05), transparent)',
            }}>
                <div style={{
                    fontSize: 10, color: 'rgba(139,92,246,0.5)', fontWeight: 800,
                    display: 'flex', alignItems: 'center', gap: 4,
                }}>
                    <span style={{ fontSize: 8 }}>▼</span> THEN <span style={{ fontSize: 8 }}>▼</span>
                </div>
            </div>

            {/* Reward Section */}
            <div style={{
                padding: '10px 12px',
                background: `${rewardInfo.color}05`,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <div style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: `${rewardInfo.color}15`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 16, flexShrink: 0,
                    }}>
                        {rewardInfo.icon}
                    </div>
                    <select value={rule.rewardType} onChange={(e) => onUpdate({ rewardType: e.target.value as RewardType })} style={{ ...selectStyle, flex: 1 }}>
                        {REWARD_OPTIONS.map((r) => <option key={r.value} value={r.value}>Give: {r.label}</option>)}
                    </select>
                </div>

                {/* Config */}
                <div style={{ display: 'flex', gap: 6 }}>
                    {rule.rewardType === 'token_drop' && (
                        <>
                            <input type="number" value={rule.amount} onChange={(e) => onUpdate({ amount: Number(e.target.value) })}
                                style={{ ...inputStyle, width: 55 }} placeholder="Amt" />
                            <input value={rule.tokenSymbol} onChange={(e) => onUpdate({ tokenSymbol: e.target.value })}
                                style={{ ...inputStyle, flex: 1 }} placeholder="Token symbol" />
                        </>
                    )}
                    {rule.rewardType === 'nft_mint' && (
                        <input value={rule.nftName} onChange={(e) => onUpdate({ nftName: e.target.value })}
                            style={{ ...inputStyle, flex: 1 }} placeholder="NFT collection name" />
                    )}
                    {rule.rewardType === 'sol_tip' && (
                        <input type="number" value={rule.amount} onChange={(e) => onUpdate({ amount: Number(e.target.value) })}
                            style={{ ...inputStyle, flex: 1 }} placeholder="SOL amount" step="0.001" />
                    )}
                </div>

                {/* Extra configs */}
                <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                    {rule.event === 'score_milestone' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span style={tagStyle}>Every</span>
                            <input type="number" value={rule.milestoneThreshold} onChange={(e) => onUpdate({ milestoneThreshold: Number(e.target.value) })}
                                style={{ ...inputStyle, width: 45, padding: '3px 5px', fontSize: 10 }} />
                            <span style={tagStyle}>pts</span>
                        </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={tagStyle}>Cooldown</span>
                        <input type="number" value={rule.cooldownMs / 1000} min={0} step={0.5}
                            onChange={(e) => onUpdate({ cooldownMs: Number(e.target.value) * 1000 })}
                            style={{ ...inputStyle, width: 40, padding: '3px 5px', fontSize: 10 }} />
                        <span style={tagStyle}>s</span>
                    </div>
                </div>
            </div>

            {/* Preview badge */}
            <div style={{
                padding: '6px 12px',
                background: 'rgba(0,0,0,0.15)',
                borderTop: '1px solid rgba(255,255,255,0.03)',
                display: 'flex', alignItems: 'center', gap: 6,
            }}>
                <span style={{ width: 6, height: 6, borderRadius: 3, background: rule.enabled ? '#14f195' : '#555', flexShrink: 0 }} />
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', fontStyle: 'italic' }}>
                    {rule.rewardType === 'token_drop' && `Player gets +${rule.amount} ${rule.tokenSymbol} per ${eventInfo.label.toLowerCase()}`}
                    {rule.rewardType === 'nft_mint' && `Mints "${rule.nftName}" NFT on ${eventInfo.label.toLowerCase()}`}
                    {rule.rewardType === 'sol_tip' && `Sends ${rule.amount} SOL on ${eventInfo.label.toLowerCase()}`}
                </span>
            </div>
        </div>
    );
}

// ─── Styles ───

const panelStyle: React.CSSProperties = {
    padding: 12, height: '100%', overflowY: 'auto', scrollbarWidth: 'none',
    display: 'flex', flexDirection: 'column',
};

const selectStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.06)', color: '#fff',
    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6,
    padding: '5px 8px', fontSize: 11, fontWeight: 600,
    outline: 'none', cursor: 'pointer', width: '100%',
};

const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.06)', color: '#fff',
    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6,
    padding: '5px 8px', fontSize: 11, outline: 'none',
    fontFamily: 'inherit',
};

const smBtnStyle: React.CSSProperties = {
    width: 24, height: 24, borderRadius: 6, border: 'none',
    fontSize: 10, cursor: 'pointer', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.15s',
};

const addBtnStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    width: '100%', padding: '11px', marginTop: 10,
    borderRadius: 10, border: '1px dashed rgba(139,92,246,0.25)',
    background: 'rgba(139,92,246,0.05)', color: '#a78bfa',
    fontSize: 12, fontWeight: 700, cursor: 'pointer',
    transition: 'all 0.2s',
};

const tagStyle: React.CSSProperties = {
    fontSize: 9, color: 'rgba(255,255,255,0.3)', fontWeight: 600,
    textTransform: 'uppercase',
};
