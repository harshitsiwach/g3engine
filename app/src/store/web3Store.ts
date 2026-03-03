'use client';

import { create } from 'zustand';

// ---------- Types ----------

export type SolanaNetwork = 'devnet' | 'mainnet-beta';

export interface TokenInfo {
    mint: string;
    name: string;
    symbol: string;
    balance: number;
    decimals: number;
    imageUri?: string;
    // Pump.fun specific
    isPumpToken?: boolean;
    bondingCurveComplete?: boolean;
    priceInSol?: number;
}

export interface NFTInfo {
    mint: string;
    name: string;
    imageUri: string;
    collection?: string;
    attributes?: { trait_type: string; value: string }[];
}

export interface GameEconomyConfig {
    rewardTokenMint: string | null;
    rewardPerLevel: number;
    tipJarEnabled: boolean;
    itemPrices: { itemId: string; priceToken: string; amount: number }[];
}

export interface Web3Transaction {
    id: string;
    type: 'token_launch' | 'buy' | 'sell' | 'mint_nft' | 'transfer' | 'airdrop';
    signature: string;
    status: 'pending' | 'confirmed' | 'failed';
    description: string;
    timestamp: number;
}

interface Web3State {
    // Connection
    network: SolanaNetwork;
    rpcEndpoint: string;
    walletConnected: boolean;
    walletAddress: string | null;
    solBalance: number;

    // Assets
    tokens: TokenInfo[];
    nfts: NFTInfo[];

    // Economy
    economy: GameEconomyConfig;

    // Transactions
    transactions: Web3Transaction[];

    // UI
    web3PanelOpen: boolean;
    activeTab: 'tokens' | 'nfts' | 'economy' | 'settings';

    // --- Actions ---
    setNetwork: (network: SolanaNetwork) => void;
    setRpcEndpoint: (endpoint: string) => void;
    setWalletConnected: (connected: boolean, address?: string | null) => void;
    setSolBalance: (balance: number) => void;

    setTokens: (tokens: TokenInfo[]) => void;
    addToken: (token: TokenInfo) => void;
    setNfts: (nfts: NFTInfo[]) => void;
    addNft: (nft: NFTInfo) => void;

    updateEconomy: (config: Partial<GameEconomyConfig>) => void;

    addTransaction: (tx: Web3Transaction) => void;
    updateTransaction: (id: string, updates: Partial<Web3Transaction>) => void;

    setWeb3PanelOpen: (open: boolean) => void;
    setActiveTab: (tab: Web3State['activeTab']) => void;
}

// ---------- Defaults ----------

const RPC_ENDPOINTS: Record<SolanaNetwork, string> = {
    'devnet': 'https://api.devnet.solana.com',
    'mainnet-beta': 'https://api.mainnet-beta.solana.com',
};

const DEFAULT_ECONOMY: GameEconomyConfig = {
    rewardTokenMint: null,
    rewardPerLevel: 10,
    tipJarEnabled: false,
    itemPrices: [],
};

// ---------- Store ----------

export const useWeb3Store = create<Web3State>((set) => ({
    network: 'devnet',
    rpcEndpoint: RPC_ENDPOINTS['devnet'],
    walletConnected: false,
    walletAddress: null,
    solBalance: 0,

    tokens: [],
    nfts: [],

    economy: { ...DEFAULT_ECONOMY },
    transactions: [],

    web3PanelOpen: false,
    activeTab: 'tokens',

    setNetwork: (network) => set({ network, rpcEndpoint: RPC_ENDPOINTS[network] }),
    setRpcEndpoint: (endpoint) => set({ rpcEndpoint: endpoint }),
    setWalletConnected: (connected, address) => set({
        walletConnected: connected,
        walletAddress: address ?? null,
        solBalance: connected ? undefined as any : 0, // reset on disconnect
    }),
    setSolBalance: (balance) => set({ solBalance: balance }),

    setTokens: (tokens) => set({ tokens }),
    addToken: (token) => set((s) => ({ tokens: [...s.tokens, token] })),
    setNfts: (nfts) => set({ nfts }),
    addNft: (nft) => set((s) => ({ nfts: [...s.nfts, nft] })),

    updateEconomy: (config) => set((s) => ({ economy: { ...s.economy, ...config } })),

    addTransaction: (tx) => set((s) => ({ transactions: [tx, ...s.transactions] })),
    updateTransaction: (id, updates) => set((s) => ({
        transactions: s.transactions.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),

    setWeb3PanelOpen: (open) => set({ web3PanelOpen: open }),
    setActiveTab: (tab) => set({ activeTab: tab }),
}));
