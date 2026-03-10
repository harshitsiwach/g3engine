'use client';

import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

// ---------- Types ----------

export type GameEvent =
    | 'coin_collected'
    | 'obstacle_dodged'
    | 'score_milestone'
    | 'level_complete'
    | 'game_over';

export type RewardType = 'token_drop' | 'nft_mint' | 'sol_tip';

export interface RewardRule {
    id: string;
    event: GameEvent;
    rewardType: RewardType;
    amount: number;
    tokenMint: string;
    tokenSymbol: string;
    nftName: string;
    cooldownMs: number;
    milestoneThreshold: number; // for score_milestone, trigger every N points
    enabled: boolean;
}

export interface RewardLogEntry {
    id: string;
    ruleId: string;
    event: GameEvent;
    rewardType: RewardType;
    amount: number;
    label: string;
    timestamp: number;
}

interface GameRewardState {
    // Config
    rules: RewardRule[];
    rewardsEnabled: boolean;

    // Runtime counters (reset on play start)
    coinsCollected: number;
    obstaclesDodged: number;
    score: number;
    distance: number;
    rewardLog: RewardLogEntry[];

    // Cooldown tracking
    lastTriggerTime: Record<string, number>; // ruleId -> timestamp

    // Toast queue (for HUD display)
    activeToasts: RewardLogEntry[];

    // --- Actions ---
    addRule: (rule: Omit<RewardRule, 'id'>) => void;
    removeRule: (id: string) => void;
    updateRule: (id: string, updates: Partial<RewardRule>) => void;
    toggleRule: (id: string) => void;
    setRewardsEnabled: (enabled: boolean) => void;

    // Runtime
    resetRuntime: () => void;
    incrementCoins: () => void;
    incrementDodges: () => void;
    addScore: (points: number) => void;
    setDistance: (d: number) => void;
    triggerEvent: (event: GameEvent) => RewardLogEntry[];
    dismissToast: (id: string) => void;
}

// ---------- Defaults ----------

const DEFAULT_RULES: RewardRule[] = [
    {
        id: 'default-coin',
        event: 'coin_collected',
        rewardType: 'token_drop',
        amount: 10,
        tokenMint: '',
        tokenSymbol: 'G3',
        nftName: '',
        cooldownMs: 0,
        milestoneThreshold: 0,
        enabled: true,
    },
    {
        id: 'default-dodge',
        event: 'obstacle_dodged',
        rewardType: 'token_drop',
        amount: 5,
        tokenMint: '',
        tokenSymbol: 'G3',
        nftName: '',
        cooldownMs: 2000,
        milestoneThreshold: 0,
        enabled: true,
    },
    {
        id: 'default-milestone',
        event: 'score_milestone',
        rewardType: 'nft_mint',
        amount: 1,
        tokenMint: '',
        tokenSymbol: '',
        nftName: 'Achievement Badge',
        cooldownMs: 0,
        milestoneThreshold: 100,
        enabled: false,
    },
];

// ---------- Store ----------

export const useGameRewardStore = create<GameRewardState>((set, get) => ({
    rules: DEFAULT_RULES,
    rewardsEnabled: true,

    coinsCollected: 0,
    obstaclesDodged: 0,
    score: 0,
    distance: 0,
    rewardLog: [],
    lastTriggerTime: {},
    activeToasts: [],

    addRule: (rule) => set((s) => ({
        rules: [...s.rules, { ...rule, id: uuidv4() }],
    })),

    removeRule: (id) => set((s) => ({
        rules: s.rules.filter((r) => r.id !== id),
    })),

    updateRule: (id, updates) => set((s) => ({
        rules: s.rules.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    })),

    toggleRule: (id) => set((s) => ({
        rules: s.rules.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)),
    })),

    setRewardsEnabled: (enabled) => set({ rewardsEnabled: enabled }),

    resetRuntime: () => set({
        coinsCollected: 0,
        obstaclesDodged: 0,
        score: 0,
        distance: 0,
        rewardLog: [],
        lastTriggerTime: {},
        activeToasts: [],
    }),

    incrementCoins: () => set((s) => {
        const newCoins = s.coinsCollected + 1;
        return { coinsCollected: newCoins, score: s.score + 10 };
    }),

    incrementDodges: () => set((s) => ({
        obstaclesDodged: s.obstaclesDodged + 1,
        score: s.score + 5,
    })),

    addScore: (points) => set((s) => ({ score: s.score + points })),

    setDistance: (d) => set({ distance: d }),

    triggerEvent: (event) => {
        const state = get();
        if (!state.rewardsEnabled) return [];

        const now = Date.now();
        const firedRewards: RewardLogEntry[] = [];

        const matchingRules = state.rules.filter((r) => r.enabled && r.event === event);

        for (const rule of matchingRules) {
            // Check cooldown
            const lastTime = state.lastTriggerTime[rule.id] || 0;
            if (rule.cooldownMs > 0 && now - lastTime < rule.cooldownMs) continue;

            // Check milestone threshold
            if (event === 'score_milestone' && rule.milestoneThreshold > 0) {
                if (state.score % rule.milestoneThreshold !== 0 || state.score === 0) continue;
            }

            const label = rule.rewardType === 'token_drop'
                ? `+${rule.amount} ${rule.tokenSymbol}`
                : rule.rewardType === 'nft_mint'
                    ? `🎨 Minted: ${rule.nftName}`
                    : `+${rule.amount} SOL`;

            const entry: RewardLogEntry = {
                id: uuidv4(),
                ruleId: rule.id,
                event,
                rewardType: rule.rewardType,
                amount: rule.amount,
                label,
                timestamp: now,
            };

            firedRewards.push(entry);
        }

        if (firedRewards.length > 0) {
            const newLastTrigger = { ...state.lastTriggerTime };
            firedRewards.forEach((r) => { newLastTrigger[r.ruleId] = now; });

            set({
                rewardLog: [...state.rewardLog, ...firedRewards],
                lastTriggerTime: newLastTrigger,
                activeToasts: [...state.activeToasts, ...firedRewards],
            });
        }

        return firedRewards;
    },

    dismissToast: (id) => set((s) => ({
        activeToasts: s.activeToasts.filter((t) => t.id !== id),
    })),
}));
