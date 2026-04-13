'use client';

import { create } from 'zustand';

// ---------- Types ----------

export type SolanaNetwork = 'devnet' | 'mainnet-beta';
export type ChainType = 'solana' | 'evm';

export interface ChainInfo {
    type: ChainType;
    chainId: number | string; // number for EVM, string for Solana
    name: string;
    symbol: string;
    icon: string;
}

export interface TokenInfo {
    mint: string;
    name: string;
    symbol: string;
    balance: number;
    decimals: number;
    imageUri?: string;
    chainType: ChainType;
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
    chainType: ChainType;
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
    chainType: ChainType;
}

// ---------- Supported Chains ----------

export const SUPPORTED_CHAINS: ChainInfo[] = [
    // Solana
    { type: 'solana', chainId: 'devnet', name: 'Solana Devnet', symbol: 'SOL', icon: '◎' },
    { type: 'solana', chainId: 'mainnet-beta', name: 'Solana', symbol: 'SOL', icon: '◎' },
    // EVM
    { type: 'evm', chainId: 1, name: 'Ethereum', symbol: 'ETH', icon: 'Ξ' },
    { type: 'evm', chainId: 137, name: 'Polygon', symbol: 'MATIC', icon: '⬡' },
    { type: 'evm', chainId: 8453, name: 'Base', symbol: 'ETH', icon: '🔵' },
    { type: 'evm', chainId: 42161, name: 'Arbitrum', symbol: 'ETH', icon: '🔷' },
    { type: 'evm', chainId: 10, name: 'Optimism', symbol: 'ETH', icon: '🔴' },
    // EVM Testnets
    { type: 'evm', chainId: 11155111, name: 'Sepolia', symbol: 'ETH', icon: '🧪' },
    { type: 'evm', chainId: 84532, name: 'Base Sepolia', symbol: 'ETH', icon: '🧪' },
];

// ---------- State Interface ----------

interface Web3State {
    // Active chain
    activeChain: ChainInfo;

    // Solana
    solanaNetwork: SolanaNetwork;
    solanaRpcEndpoint: string;
    solanaConnected: boolean;
    solanaAddress: string | null;
    solBalance: number;

    // EVM
    evmConnected: boolean;
    evmAddress: string | null;
    evmChainId: number | null;
    ethBalance: number;

    // Assets (shared across chains)
    tokens: TokenInfo[];
    nfts: NFTInfo[];

    // Economy
    economy: GameEconomyConfig;

    // Transactions
    transactions: Web3Transaction[];

    // UI
    web3PanelOpen: boolean;
    activeTab: 'tokens' | 'nfts' | 'economy' | 'rewards' | 'settings';

    // --- Actions ---
    setActiveChain: (chain: ChainInfo) => void;

    // Solana
    setSolanaNetwork: (network: SolanaNetwork) => void;
    setSolanaRpcEndpoint: (endpoint: string) => void;
    setSolanaConnected: (connected: boolean, address?: string | null) => void;
    setSolBalance: (balance: number) => void;

    // EVM
    setEVMConnected: (connected: boolean, address?: string | null, chainId?: number | null) => void;
    setEthBalance: (balance: number) => void;

    // Assets
    setTokens: (tokens: TokenInfo[]) => void;
    addToken: (token: TokenInfo) => void;
    setNfts: (nfts: NFTInfo[]) => void;
    addNft: (nft: NFTInfo) => void;

    // Economy
    updateEconomy: (config: Partial<GameEconomyConfig>) => void;

    // Transactions
    addTransaction: (tx: Web3Transaction) => void;
    updateTransaction: (id: string, updates: Partial<Web3Transaction>) => void;

    // UI
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

const DEFAULT_CHAIN: ChainInfo = SUPPORTED_CHAINS[0]; // Solana Devnet

// ---------- Store ----------

export const useWeb3Store = create<Web3State>((set) => ({
    // Active chain
    activeChain: DEFAULT_CHAIN,

    // Solana
    solanaNetwork: 'devnet',
    solanaRpcEndpoint: RPC_ENDPOINTS['devnet'],
    solanaConnected: false,
    solanaAddress: null,
    solBalance: 0,

    // EVM
    evmConnected: false,
    evmAddress: null,
    evmChainId: null,
    ethBalance: 0,

    // Assets
    tokens: [],
    nfts: [],

    // Economy
    economy: { ...DEFAULT_ECONOMY },
    transactions: [],

    // UI
    web3PanelOpen: false,
    activeTab: 'tokens',

    // Actions
    setActiveChain: (chain) => set({ activeChain: chain }),

    // Solana
    setSolanaNetwork: (network) => set({
        solanaNetwork: network,
        solanaRpcEndpoint: RPC_ENDPOINTS[network],
        activeChain: SUPPORTED_CHAINS.find(c => c.chainId === network) || DEFAULT_CHAIN,
    }),
    setSolanaRpcEndpoint: (endpoint) => set({ solanaRpcEndpoint: endpoint }),
    setSolanaConnected: (connected, address) => set({
        solanaConnected: connected,
        solanaAddress: address ?? null,
        solBalance: connected ? 0 : 0,
    }),
    setSolBalance: (balance) => set({ solBalance: balance }),

    // EVM
    setEVMConnected: (connected, address, chainId) => set({
        evmConnected: connected,
        evmAddress: address ?? null,
        evmChainId: chainId ?? null,
        ethBalance: connected ? 0 : 0,
        ...(connected && chainId ? {
            activeChain: SUPPORTED_CHAINS.find(c => c.chainId === chainId) || SUPPORTED_CHAINS[2],
        } : {}),
    }),
    setEthBalance: (balance) => set({ ethBalance: balance }),

    // Assets
    setTokens: (tokens) => set({ tokens }),
    addToken: (token) => set((s) => ({ tokens: [...s.tokens, token] })),
    setNfts: (nfts) => set({ nfts }),
    addNft: (nft) => set((s) => ({ nfts: [...s.nfts, nft] })),

    // Economy
    updateEconomy: (config) => set((s) => ({ economy: { ...s.economy, ...config } })),

    // Transactions
    addTransaction: (tx) => set((s) => ({ transactions: [tx, ...s.transactions] })),
    updateTransaction: (id, updates) => set((s) => ({
        transactions: s.transactions.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),

    // UI
    setWeb3PanelOpen: (open) => set({ web3PanelOpen: open }),
    setActiveTab: (tab) => set({ activeTab: tab }),
}));
