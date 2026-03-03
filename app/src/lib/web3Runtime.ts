'use client';

/**
 * Web3 Runtime — Lightweight runtime that executes compiled Web3 blueprint nodes.
 * Handles wallet prompts for players and transaction signing flows.
 *
 * In production, these functions will call the actual Solana programs
 * (Pump.fun, Metaplex, SPL Token) using the PumpFun skill instructions.
 */

import {
    Connection,
    PublicKey,
    Transaction,
    SystemProgram,
    LAMPORTS_PER_SOL,
} from '@solana/web3.js';

// ---------- Types ----------

export interface Web3RuntimeContext {
    connection: Connection;
    publicKey: PublicKey;
    signTransaction: (tx: Transaction) => Promise<Transaction>;
    signAllTransactions?: (txs: Transaction[]) => Promise<Transaction[]>;
}

export interface TokenLaunchResult {
    tokenMint: string;
    txHash: string;
}

export interface BuyResult {
    tokensReceived: number;
    txHash: string;
}

export interface SellResult {
    solReceived: number;
    txHash: string;
}

export interface MintNFTResult {
    mintAddress: string;
    txHash: string;
}

export interface BalanceResult {
    balance: number;
}

export interface TokenPriceResult {
    priceInSol: number;
    marketCap: number;
}

// ---------- Node Executors ----------

/**
 * Launch a token on Pump.fun bonding curve.
 * Uses the PumpFun skill's create instruction.
 */
export async function executeTokenLaunch(
    ctx: Web3RuntimeContext,
    name: string,
    symbol: string,
    imageUri: string
): Promise<TokenLaunchResult> {
    // Pump.fun create instruction would go here
    // Using the PumpFun SKILL.md create instruction pattern
    console.log(`[Web3Runtime] Launching token: ${name} ($${symbol})`);
    return {
        tokenMint: `${symbol}${Date.now().toString(36)}`,
        txHash: `tx_${Date.now().toString(36)}`,
    };
}

/**
 * Buy tokens on Pump.fun bonding curve.
 * Uses the PumpFun skill's buy instruction.
 */
export async function executeBuyToken(
    ctx: Web3RuntimeContext,
    tokenMint: string,
    solAmount: number,
    slippage: number = 1
): Promise<BuyResult> {
    console.log(`[Web3Runtime] Buying ${solAmount} SOL worth of ${tokenMint}`);
    return {
        tokensReceived: solAmount * 1000000, // Approximate based on bonding curve
        txHash: `tx_${Date.now().toString(36)}`,
    };
}

/**
 * Sell tokens on Pump.fun bonding curve.
 * Uses the PumpFun skill's sell instruction.
 */
export async function executeSellToken(
    ctx: Web3RuntimeContext,
    tokenMint: string,
    tokenAmount: number,
    slippage: number = 1
): Promise<SellResult> {
    console.log(`[Web3Runtime] Selling ${tokenAmount} tokens of ${tokenMint}`);
    return {
        solReceived: tokenAmount / 1000000,
        txHash: `tx_${Date.now().toString(36)}`,
    };
}

/**
 * Mint an NFT using Metaplex.
 */
export async function executeMintNFT(
    ctx: Web3RuntimeContext,
    name: string,
    imageUri: string,
    attributes?: Record<string, string>
): Promise<MintNFTResult> {
    console.log(`[Web3Runtime] Minting NFT: ${name}`);
    return {
        mintAddress: `nft_${Date.now().toString(36)}`,
        txHash: `tx_${Date.now().toString(36)}`,
    };
}

/**
 * Check if a player holds enough tokens (token gate).
 */
export async function executeTokenGate(
    ctx: Web3RuntimeContext,
    tokenMint: string,
    minBalance: number
): Promise<{ hasAccess: boolean; balance: number }> {
    // In production: fetch SPL token balance via getTokenAccountsByOwner
    const balance = 0; // placeholder
    return { hasAccess: balance >= minBalance, balance };
}

/**
 * Get token or SOL balance.
 */
export async function executeCheckBalance(
    ctx: Web3RuntimeContext,
    tokenMint?: string
): Promise<BalanceResult> {
    if (!tokenMint || tokenMint === 'SOL') {
        const lamports = await ctx.connection.getBalance(ctx.publicKey);
        return { balance: lamports / LAMPORTS_PER_SOL };
    }
    // In production: fetch SPL token balance
    return { balance: 0 };
}

/**
 * Send SOL to another wallet.
 */
export async function executeSendSOL(
    ctx: Web3RuntimeContext,
    recipient: string,
    amount: number
): Promise<{ txHash: string }> {
    const tx = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: ctx.publicKey,
            toPubkey: new PublicKey(recipient),
            lamports: Math.floor(amount * LAMPORTS_PER_SOL),
        })
    );
    tx.feePayer = ctx.publicKey;
    tx.recentBlockhash = (await ctx.connection.getLatestBlockhash()).blockhash;

    const signed = await ctx.signTransaction(tx);
    const txHash = await ctx.connection.sendRawTransaction(signed.serialize());
    return { txHash };
}

/**
 * Query bonding curve price from Pump.fun.
 */
export async function executeGetTokenPrice(
    ctx: Web3RuntimeContext,
    tokenMint: string
): Promise<TokenPriceResult> {
    // In production: fetch bonding curve account and calculate price
    console.log(`[Web3Runtime] Getting price for ${tokenMint}`);
    return { priceInSol: 0.000001, marketCap: 0 };
}

/**
 * Map Blueprint node labels to executor functions.
 */
export const WEB3_NODE_EXECUTORS: Record<string, (...args: any[]) => Promise<any>> = {
    '🚀 Launch Token (Pump.fun)': executeTokenLaunch,
    '💰 Buy Token (Pump.fun)': executeBuyToken,
    '💸 Sell Token (Pump.fun)': executeSellToken,
    '🎨 Mint NFT': executeMintNFT,
    '🔐 Token Gate': executeTokenGate,
    '💎 Check Balance': executeCheckBalance,
    '🏦 Airdrop Tokens': executeBuyToken, // reuse buy pattern
    '⬡ Send SOL': executeSendSOL,
    '🎁 Reward Player': executeBuyToken, // reuse buy pattern
    '📊 Get Token Price': executeGetTokenPrice,
};
