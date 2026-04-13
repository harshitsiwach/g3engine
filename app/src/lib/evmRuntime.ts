'use client';

/**
 * EVM Runtime — Ethereum/EVM chain integration for G3Engine.
 * Supports ERC-20 token operations, ERC-721 NFT minting,
 * token gating, and cross-chain game rewards.
 *
 * Uses ethers.js for broad compatibility with MetaMask, WalletConnect, etc.
 */

import { ethers } from 'ethers';

// ---------- Types ----------

export interface EVMRuntimeContext {
    provider: ethers.BrowserProvider;
    signer: ethers.Signer;
    address: string;
    chainId: number;
}

export interface EVMTokenResult {
    txHash: string;
    tokenAddress?: string;
}

export interface EVMBalanceResult {
    balance: string;
    formatted: string;
    decimals: number;
}

export interface EVMNFTResult {
    txHash: string;
    tokenId?: string;
    contractAddress?: string;
}

// ---------- Chain Configs ----------

export interface ChainConfig {
    chainId: number;
    name: string;
    symbol: string;
    rpcUrl: string;
    explorerUrl: string;
    icon: string;
}

export const SUPPORTED_CHAINS: Record<number, ChainConfig> = {
    1: { chainId: 1, name: 'Ethereum', symbol: 'ETH', rpcUrl: 'https://eth.llamarpc.com', explorerUrl: 'https://etherscan.io', icon: 'Ξ' },
    137: { chainId: 137, name: 'Polygon', symbol: 'MATIC', rpcUrl: 'https://polygon-rpc.com', explorerUrl: 'https://polygonscan.com', icon: '⬡' },
    8453: { chainId: 8453, name: 'Base', symbol: 'ETH', rpcUrl: 'https://mainnet.base.org', explorerUrl: 'https://basescan.org', icon: '🔵' },
    42161: { chainId: 42161, name: 'Arbitrum', symbol: 'ETH', rpcUrl: 'https://arb1.arbitrum.io/rpc', explorerUrl: 'https://arbiscan.io', icon: '🔷' },
    10: { chainId: 10, name: 'Optimism', symbol: 'ETH', rpcUrl: 'https://mainnet.optimism.io', explorerUrl: 'https://optimistic.etherscan.io', icon: '🔴' },
    // Testnets
    11155111: { chainId: 11155111, name: 'Sepolia', symbol: 'ETH', rpcUrl: 'https://rpc.sepolia.org', explorerUrl: 'https://sepolia.etherscan.io', icon: '🧪' },
    84532: { chainId: 84532, name: 'Base Sepolia', symbol: 'ETH', rpcUrl: 'https://sepolia.base.org', explorerUrl: 'https://sepolia.basescan.org', icon: '🧪' },
};

// ---------- ABIs ----------

// Minimal ERC-20 ABI
const ERC20_ABI = [
    'function balanceOf(address owner) view returns (uint256)',
    'function transfer(address to, uint256 amount) returns (bool)',
    'function decimals() view returns (uint8)',
    'function symbol() view returns (string)',
    'function name() view returns (string)',
    'function approve(address spender, uint256 amount) returns (bool)',
    'function allowance(address owner, address spender) view returns (uint256)',
    'function totalSupply() view returns (uint256)',
];

// Minimal ERC-721 ABI
const ERC721_ABI = [
    'function balanceOf(address owner) view returns (uint256)',
    'function ownerOf(uint256 tokenId) view returns (address)',
    'function safeTransferFrom(address from, address to, uint256 tokenId)',
    'function mint(address to) returns (uint256)',
    'function tokenURI(uint256 tokenId) view returns (string)',
    'function approve(address to, uint256 tokenId)',
    'function getApproved(uint256 tokenId) view returns (address)',
    'function isApprovedForAll(address owner, address operator) view returns (bool)',
    'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
];

// Simple GameNFT ABI (for custom minting with metadata)
const GAME_NFT_ABI = [
    ...ERC721_ABI,
    'function mintWithMetadata(address to, string memory uri) returns (uint256)',
];

// ---------- Connection ----------

/**
 * Connect to EVM wallet via window.ethereum (MetaMask, etc.)
 */
export async function connectEVMWallet(): Promise<EVMRuntimeContext> {
    if (typeof window === 'undefined' || !(window as any).ethereum) {
        throw new Error('No EVM wallet found. Please install MetaMask or another Web3 wallet.');
    }

    const provider = new ethers.BrowserProvider((window as any).ethereum);

    // Request account access
    await provider.send('eth_requestAccounts', []);

    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    const network = await provider.getNetwork();

    return {
        provider,
        signer,
        address,
        chainId: Number(network.chainId),
    };
}

/**
 * Switch to a specific chain
 */
export async function switchChain(ctx: EVMRuntimeContext, targetChainId: number): Promise<void> {
    const chainHex = `0x${targetChainId.toString(16)}`;

    try {
        await (window as any).ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: chainHex }],
        });
    } catch (switchError: any) {
        // Chain not added yet, try to add it
        if (switchError.code === 4902) {
            const chain = SUPPORTED_CHAINS[targetChainId];
            if (!chain) throw new Error(`Unsupported chain: ${targetChainId}`);

            await (window as any).ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                    chainId: chainHex,
                    chainName: chain.name,
                    nativeCurrency: { name: chain.symbol, symbol: chain.symbol, decimals: 18 },
                    rpcUrls: [chain.rpcUrl],
                    blockExplorerUrls: [chain.explorerUrl],
                }],
            });
        } else {
            throw switchError;
        }
    }
}

// ---------- Balance Queries ----------

/**
 * Get native ETH/MATIC balance
 */
export async function executeEVMCheckBalance(ctx: EVMRuntimeContext): Promise<EVMBalanceResult> {
    const balance = await ctx.provider.getBalance(ctx.address);
    return {
        balance: balance.toString(),
        formatted: ethers.formatEther(balance),
        decimals: 18,
    };
}

/**
 * Get ERC-20 token balance
 */
export async function executeEVMCheckTokenBalance(
    ctx: EVMRuntimeContext,
    tokenAddress: string
): Promise<EVMBalanceResult> {
    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, ctx.provider);
    const [balance, decimals] = await Promise.all([
        contract.balanceOf(ctx.address),
        contract.decimals(),
    ]);

    return {
        balance: balance.toString(),
        formatted: ethers.formatUnits(balance, decimals),
        decimals: Number(decimals),
    };
}

/**
 * Get ERC-721 NFT balance for an address
 */
export async function executeEVMCheckNFTBalance(
    ctx: EVMRuntimeContext,
    contractAddress: string
): Promise<number> {
    const contract = new ethers.Contract(contractAddress, ERC721_ABI, ctx.provider);
    const balance = await contract.balanceOf(ctx.address);
    return Number(balance);
}

// ---------- Token Operations ----------

/**
 * Send native ETH/MATIC
 */
export async function executeEVMSendETH(
    ctx: EVMRuntimeContext,
    recipient: string,
    amount: string // in ETH units like "0.1"
): Promise<{ txHash: string }> {
    const tx = await ctx.signer.sendTransaction({
        to: recipient,
        value: ethers.parseEther(amount),
    });

    await tx.wait();
    return { txHash: tx.hash };
}

/**
 * Transfer ERC-20 tokens
 */
export async function executeEVMTransferToken(
    ctx: EVMRuntimeContext,
    tokenAddress: string,
    recipient: string,
    amount: string // in token units like "10.5"
): Promise<{ txHash: string }> {
    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, ctx.signer);
    const decimals = await contract.decimals();
    const tx = await contract.transfer(recipient, ethers.parseUnits(amount, decimals));
    await tx.wait();
    return { txHash: tx.hash };
}

// ---------- NFT Operations ----------

/**
 * Mint an NFT using a custom GameNFT contract
 */
export async function executeEVMMintNFT(
    ctx: EVMRuntimeContext,
    contractAddress: string,
    metadataUri: string
): Promise<EVMNFTResult> {
    const contract = new ethers.Contract(contractAddress, GAME_NFT_ABI, ctx.signer);
    const tx = await contract.mintWithMetadata(ctx.address, metadataUri);
    const receipt = await tx.wait();

    // Extract tokenId from Transfer event
    let tokenId: string | undefined;
    for (const log of receipt.logs) {
        try {
            const parsed = contract.interface.parseLog({ topics: log.topics as string[], data: log.data });
            if (parsed?.name === 'Transfer') {
                tokenId = parsed.args.tokenId.toString();
                break;
            }
        } catch { }
    }

    return {
        txHash: tx.hash,
        tokenId,
        contractAddress,
    };
}

/**
 * Check if an address owns a specific NFT (token gate)
 */
export async function executeEVMTokenGate(
    ctx: EVMRuntimeContext,
    contractAddress: string,
    minBalance: number = 1
): Promise<{ hasAccess: boolean; balance: number }> {
    try {
        const balance = await executeEVMCheckNFTBalance(ctx, contractAddress);
        return { hasAccess: balance >= minBalance, balance };
    } catch {
        return { hasAccess: false, balance: 0 };
    }
}

/**
 * Transfer an NFT
 */
export async function executeEVMTransferNFT(
    ctx: EVMRuntimeContext,
    contractAddress: string,
    tokenId: string,
    recipient: string
): Promise<{ txHash: string }> {
    const contract = new ethers.Contract(contractAddress, ERC721_ABI, ctx.signer);
    const tx = await contract.safeTransferFrom(ctx.address, recipient, tokenId);
    await tx.wait();
    return { txHash: tx.hash };
}

// ---------- EVM Node Executor Map ----------

export const EVM_NODE_EXECUTORS: Record<string, (...args: any[]) => Promise<any>> = {
    'Ξ Send ETH': executeEVMSendETH,
    '💰 Transfer ERC-20': executeEVMTransferToken,
    '🎨 Mint NFT (EVM)': executeEVMMintNFT,
    '🔐 Token Gate (EVM)': executeEVMTokenGate,
    '💎 Check ETH Balance': executeEVMCheckBalance,
    '📊 Check Token Balance': executeEVMCheckTokenBalance,
    '🔄 Transfer NFT (EVM)': executeEVMTransferNFT,
};

// ---------- Event Listeners ----------

/**
 * Listen for account changes (MetaMask)
 */
export function onEVMAccountChange(callback: (accounts: string[]) => void): () => void {
    if (typeof window === 'undefined' || !(window as any).ethereum) return () => { };

    (window as any).ethereum.on('accountsChanged', callback);
    return () => (window as any).ethereum?.removeListener('accountsChanged', callback);
}

/**
 * Listen for chain changes (MetaMask)
 */
export function onEVMChainChange(callback: (chainId: string) => void): () => void {
    if (typeof window === 'undefined' || !(window as any).ethereum) return () => { };

    (window as any).ethereum.on('chainChanged', callback);
    return () => (window as any).ethereum?.removeListener('chainChanged', callback);
}
