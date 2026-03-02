'use client';

import { create } from 'zustand';

export type GameDimension = '2d' | '3d';

export type GameGenre =
    | 'platformer'
    | 'puzzle'
    | 'rpg'
    | 'racing'
    | 'shooter'
    | 'adventure'
    | 'strategy'
    | 'sandbox'
    | 'social'
    | 'other';

export type GameTemplate =
    | 'blank'
    | 'platformer-starter'
    | 'token-gate-room'
    | 'nft-gallery'
    | 'multiplayer-arena'
    | 'endless-runner';

export interface ProjectConfig {
    name: string;
    dimension: GameDimension | null;
    genre: GameGenre | null;
    template: GameTemplate | null;
}

interface ProjectStore {
    config: ProjectConfig;
    setDimension: (d: GameDimension) => void;
    setGenre: (g: GameGenre) => void;
    setTemplate: (t: GameTemplate) => void;
    setName: (n: string) => void;
    reset: () => void;
}

const DEFAULT_CONFIG: ProjectConfig = {
    name: '',
    dimension: null,
    genre: null,
    template: null,
};

export const useProjectStore = create<ProjectStore>((set) => ({
    config: { ...DEFAULT_CONFIG },
    setDimension: (d) => set((s) => ({ config: { ...s.config, dimension: d } })),
    setGenre: (g) => set((s) => ({ config: { ...s.config, genre: g } })),
    setTemplate: (t) => set((s) => ({ config: { ...s.config, template: t } })),
    setName: (n) => set((s) => ({ config: { ...s.config, name: n } })),
    reset: () => set({ config: { ...DEFAULT_CONFIG } }),
}));
