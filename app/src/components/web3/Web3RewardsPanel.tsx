'use client';

import React from 'react';
import {
    useGameRewardStore,
    GameEvent,
    RewardType,
    RewardRule,
} from '@/store/gameRewardStore';

// ─── Constants ───

const EVENT_OPTIONS: { value: GameEvent; label: string; icon: string }[] = [
    { value: 'coin_collected', label: 'Coin Collected', icon: '🪙' },
    { value: 'obstacle_dodged', label: 'Obstacle Dodged', icon: '🏃' },
    { value: 'score_milestone', label: 'Score Milestone', icon: '🏆' },
    { value: 'level_complete', label: 'Level Complete', icon: '🎯' },
    { value: 'game_over', label: 'Game Over', icon: '💀' },
];

const REWARD_OPTIONS: { value: RewardType; label: string; icon: string }[] = [
    { value: 'token_drop', label: 'Token Drop', icon: '🪙' },
    { value: 'nft_mint', label: 'Mint NFT', icon: '🎨' },
    { value: 'sol_tip', label: 'SOL Tip', icon: '◎' },
];

// ─── Main Component ───

export default function Web3RewardsPanel() {
    const {
        rules, rewardsEnabled, rewardLog,
        setRewardsEnabled, addRule, removeRule, updateRule, toggleRule,
    } = useGameRewardStore();

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
    };

    return (
        <div style={panelStyle}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#fff' }}>
                        🎮 In-Game Rewards
                    </h3>
                    <p style={{ margin: '4px 0 0', fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
                        Attach Web3 rewards to game events
                    </p>
                </div>
                <label style={toggleWrapStyle}>
                    <input
                        type="checkbox"
                        checked={rewardsEnabled}
                        onChange={(e) => setRewardsEnabled(e.target.checked)}
                        style={{ display: 'none' }}
                    />
                    <div style={{
                        ...toggleTrackStyle,
                        background: rewardsEnabled ? '#14f195' : 'rgba(255,255,255,0.1)',
                    }}>
                        <div style={{
                            ...toggleThumbStyle,
                            transform: rewardsEnabled ? 'translateX(16px)' : 'translateX(0)',
                        }} />
                    </div>
                </label>
            </div>

            {/* Rules List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 360, overflowY: 'auto', scrollbarWidth: 'none' }}>
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
            <button onClick={handleAddRule} style={addBtnStyle}>
                + Add Reward Rule
            </button>

            {/* Stats */}
            {rewardLog.length > 0 && (
                <div style={{ marginTop: 12, padding: '10px 12px', borderRadius: 8, background: 'rgba(20,241,149,0.06)', border: '1px solid rgba(20,241,149,0.12)' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#14f195', marginBottom: 4, textTransform: 'uppercase' }}>
                        Session Rewards
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
                        {rewardLog.length} reward{rewardLog.length !== 1 ? 's' : ''} distributed this session
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
    const eventInfo = EVENT_OPTIONS.find((e) => e.value === rule.event);
    const rewardInfo = REWARD_OPTIONS.find((r) => r.value === rule.rewardType);

    return (
        <div style={{
            ...ruleCardStyle,
            opacity: rule.enabled ? 1 : 0.5,
            borderColor: rule.enabled ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.05)',
        }}>
            {/* Top row: event + toggle */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 16 }}>{eventInfo?.icon}</span>
                    <select
                        value={rule.event}
                        onChange={(e) => onUpdate({ event: e.target.value as GameEvent })}
                        style={selectStyle}
                    >
                        {EVENT_OPTIONS.map((e) => (
                            <option key={e.value} value={e.value}>{e.label}</option>
                        ))}
                    </select>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                    <button onClick={onToggle} style={smBtnStyle} title={rule.enabled ? 'Disable' : 'Enable'}>
                        {rule.enabled ? '✓' : '○'}
                    </button>
                    <button onClick={onRemove} style={{ ...smBtnStyle, color: '#ef4444' }} title="Remove">
                        ✕
                    </button>
                </div>
            </div>

            {/* Arrow */}
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.15)', fontSize: 14, margin: '-2px 0' }}>↓</div>

            {/* Reward row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                <span style={{ fontSize: 14 }}>{rewardInfo?.icon}</span>
                <select
                    value={rule.rewardType}
                    onChange={(e) => onUpdate({ rewardType: e.target.value as RewardType })}
                    style={{ ...selectStyle, flex: 1 }}
                >
                    {REWARD_OPTIONS.map((r) => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                </select>
            </div>

            {/* Config fields */}
            <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                {rule.rewardType === 'token_drop' && (
                    <>
                        <input
                            type="number"
                            value={rule.amount}
                            onChange={(e) => onUpdate({ amount: Number(e.target.value) })}
                            style={{ ...inputStyle, width: 60 }}
                            placeholder="Amt"
                        />
                        <input
                            value={rule.tokenSymbol}
                            onChange={(e) => onUpdate({ tokenSymbol: e.target.value })}
                            style={{ ...inputStyle, flex: 1 }}
                            placeholder="Symbol (e.g. G3)"
                        />
                    </>
                )}
                {rule.rewardType === 'nft_mint' && (
                    <input
                        value={rule.nftName}
                        onChange={(e) => onUpdate({ nftName: e.target.value })}
                        style={{ ...inputStyle, flex: 1 }}
                        placeholder="NFT Name"
                    />
                )}
                {rule.rewardType === 'sol_tip' && (
                    <input
                        type="number"
                        value={rule.amount}
                        onChange={(e) => onUpdate({ amount: Number(e.target.value) })}
                        style={{ ...inputStyle, flex: 1 }}
                        placeholder="SOL Amount"
                        step="0.01"
                    />
                )}
            </div>

            {/* Milestone threshold */}
            {rule.event === 'score_milestone' && (
                <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>Every</span>
                    <input
                        type="number"
                        value={rule.milestoneThreshold}
                        onChange={(e) => onUpdate({ milestoneThreshold: Number(e.target.value) })}
                        style={{ ...inputStyle, width: 50 }}
                    />
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>pts</span>
                </div>
            )}

            {/* Cooldown */}
            {rule.cooldownMs > 0 && (
                <div style={{ marginTop: 4, fontSize: 9, color: 'rgba(255,255,255,0.25)' }}>
                    Cooldown: {(rule.cooldownMs / 1000).toFixed(1)}s
                </div>
            )}
        </div>
    );
}

// ─── Styles ───

const panelStyle: React.CSSProperties = {
    padding: 16,
    height: '100%',
    overflowY: 'auto',
    scrollbarWidth: 'none',
};

const ruleCardStyle: React.CSSProperties = {
    padding: 12, borderRadius: 10,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(139,92,246,0.2)',
    transition: 'all 0.2s',
};

const selectStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.06)', color: '#fff',
    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6,
    padding: '4px 6px', fontSize: 11, fontWeight: 600,
    outline: 'none', cursor: 'pointer',
};

const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.06)', color: '#fff',
    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6,
    padding: '5px 8px', fontSize: 11, outline: 'none',
    fontFamily: 'inherit',
};

const smBtnStyle: React.CSSProperties = {
    width: 22, height: 22, borderRadius: 6, border: 'none',
    background: 'rgba(255,255,255,0.06)', color: '#14f195',
    fontSize: 11, cursor: 'pointer', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
};

const addBtnStyle: React.CSSProperties = {
    width: '100%', padding: '10px', marginTop: 10,
    borderRadius: 8, border: '1px dashed rgba(139,92,246,0.3)',
    background: 'rgba(139,92,246,0.06)', color: '#8b5cf6',
    fontSize: 12, fontWeight: 600, cursor: 'pointer',
    transition: 'all 0.2s',
};

const toggleWrapStyle: React.CSSProperties = { cursor: 'pointer' };

const toggleTrackStyle: React.CSSProperties = {
    width: 36, height: 20, borderRadius: 10, padding: 2,
    transition: 'background 0.2s',
};

const toggleThumbStyle: React.CSSProperties = {
    width: 16, height: 16, borderRadius: 8,
    background: '#fff', transition: 'transform 0.2s',
    boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
};
