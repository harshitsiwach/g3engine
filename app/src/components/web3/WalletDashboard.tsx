'use client';

import React, { useState, useEffect } from 'react';
import { useWeb3Store, TokenInfo, NFTInfo, Web3Transaction } from '@/store/web3Store';

// ─── Types ───

type Screen = 'portfolio' | 'nfts' | 'activity' | 'settings';

// ─── Mock Data (used when wallet not connected) ───

const MOCK_TOKENS: TokenInfo[] = [
    { mint: 'So11...1112', name: 'Solana', symbol: 'SOL', balance: 24.58, decimals: 9, priceInSol: 1, imageUri: '' },
    { mint: 'EPjF...Pump', name: 'G3 Token', symbol: 'G3', balance: 150000, decimals: 6, isPumpToken: true, priceInSol: 0.0003, imageUri: '' },
    { mint: 'USDC...mint', name: 'USD Coin', symbol: 'USDC', balance: 1250.00, decimals: 6, priceInSol: 0.0067, imageUri: '' },
    { mint: 'RAY...mint', name: 'Raydium', symbol: 'RAY', balance: 89.5, decimals: 6, priceInSol: 0.012, imageUri: '' },
    { mint: 'JUP...mint', name: 'Jupiter', symbol: 'JUP', balance: 320, decimals: 6, priceInSol: 0.0058, imageUri: '' },
    { mint: 'BONK...mt', name: 'Bonk', symbol: 'BONK', balance: 5000000, decimals: 5, priceInSol: 0.0000001, imageUri: '' },
];

const MOCK_NFTS: NFTInfo[] = [
    { mint: 'nft1', name: 'Cyber Sword #42', imageUri: '', collection: 'G3 Weapons', attributes: [{ trait_type: 'Rarity', value: 'Legendary' }] },
    { mint: 'nft2', name: 'Shield of Light #7', imageUri: '', collection: 'G3 Weapons', attributes: [{ trait_type: 'Rarity', value: 'Epic' }] },
    { mint: 'nft3', name: 'Space Explorer #128', imageUri: '', collection: 'G3 Characters', attributes: [{ trait_type: 'Rarity', value: 'Rare' }] },
    { mint: 'nft4', name: 'Dragon Mount #3', imageUri: '', collection: 'G3 Mounts', attributes: [{ trait_type: 'Rarity', value: 'Legendary' }] },
];

const MOCK_TXS: Web3Transaction[] = [
    { id: '1', type: 'token_launch', signature: '4xK...abc', status: 'confirmed', description: 'Launched G3 Token on Pump.fun', timestamp: Date.now() - 3600000 },
    { id: '2', type: 'mint_nft', signature: '7bR...def', status: 'confirmed', description: 'Minted Cyber Sword #42', timestamp: Date.now() - 7200000 },
    { id: '3', type: 'buy', signature: '9cQ...ghi', status: 'confirmed', description: 'Bought 150K G3 Tokens', timestamp: Date.now() - 86400000 },
    { id: '4', type: 'airdrop', signature: '2dF...jkl', status: 'pending', description: 'Airdrop to 50 wallets', timestamp: Date.now() - 120000 },
    { id: '5', type: 'transfer', signature: '5eG...mno', status: 'confirmed', description: 'Sent 2 SOL to player', timestamp: Date.now() - 172800000 },
];

const CHART_DATA = [12, 15, 14, 18, 22, 20, 25, 28, 26, 32, 35, 38, 36, 42, 45, 48, 44, 50, 55, 58];

// ─── Token Emoji Map ───

const TOKEN_EMOJI: Record<string, string> = {
    SOL: '◎', G3: '⬡', USDC: '💲', RAY: '☀️', JUP: '🪐', BONK: '🐕',
};

const RARITY_COLORS: Record<string, string> = {
    Legendary: '#f59e0b', Epic: '#a855f7', Rare: '#3b82f6', Common: '#6b7280',
};

const TX_ICONS: Record<string, string> = {
    token_launch: '🚀', mint_nft: '🎨', buy: '💰', sell: '📤', transfer: '↗️', airdrop: '🪂',
};

// ─── Main Component ───

export default function WalletDashboard() {
    const [screen, setScreen] = useState<Screen>('portfolio');
    const { walletConnected, walletAddress, solBalance, tokens, nfts, transactions, network } = useWeb3Store();

    const displayTokens = tokens.length > 0 ? tokens : MOCK_TOKENS;
    const displayNfts = nfts.length > 0 ? nfts : MOCK_NFTS;
    const displayTxs = transactions.length > 0 ? transactions : MOCK_TXS;
    const displayBalance = walletConnected ? solBalance : 24.58;
    const displayAddress = walletAddress || '8xK4...mN7q';

    const totalUsdValue = displayTokens.reduce((sum, t) => {
        const solPrice = 148; // mock SOL/USD
        return sum + t.balance * (t.priceInSol || 0) * solPrice;
    }, 0);

    return (
        <div style={containerStyle}>
            {/* Background mesh gradient */}
            <div style={bgGradient1} />
            <div style={bgGradient2} />
            <div style={bgGradient3} />

            {/* Header */}
            <div style={headerStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, #8b5cf6, #14f195)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700 }}>⬡</div>
                    <span style={{ fontWeight: 700, fontSize: 16, color: '#fff' }}>G3 Wallet</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ padding: '4px 10px', borderRadius: 12, background: 'rgba(20,241,149,0.1)', border: '1px solid rgba(20,241,149,0.2)', fontSize: 10, fontWeight: 600, color: '#14f195', textTransform: 'uppercase' }}>
                        {network}
                    </span>
                    <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
                        {walletConnected ? '🟢' : '🔴'}
                    </div>
                </div>
            </div>

            {/* Screen Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 100px', scrollbarWidth: 'none' }}>
                {screen === 'portfolio' && (
                    <PortfolioScreen
                        address={displayAddress}
                        balance={displayBalance}
                        totalUsd={totalUsdValue}
                        tokens={displayTokens}
                        network={network}
                    />
                )}
                {screen === 'nfts' && <NFTScreen nfts={displayNfts} />}
                {screen === 'activity' && <ActivityScreen txs={displayTxs} />}
                {screen === 'settings' && <SettingsScreen />}
            </div>

            {/* Bottom Nav */}
            <div style={bottomNavStyle}>
                {([
                    { id: 'portfolio' as Screen, icon: '💎', label: 'Portfolio' },
                    { id: 'nfts' as Screen, icon: '🎨', label: 'NFTs' },
                    { id: 'activity' as Screen, icon: '⚡', label: 'Activity' },
                    { id: 'settings' as Screen, icon: '⚙️', label: 'Settings' },
                ]).map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setScreen(tab.id)}
                        style={{
                            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                            padding: '8px 0', background: 'none', border: 'none', cursor: 'pointer',
                            color: screen === tab.id ? '#14f195' : 'rgba(255,255,255,0.35)',
                            transition: 'all 0.2s',
                        }}
                    >
                        <span style={{ fontSize: 20, filter: screen === tab.id ? 'drop-shadow(0 0 8px rgba(20,241,149,0.5))' : 'none' }}>{tab.icon}</span>
                        <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.05em' }}>{tab.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

// ─── Portfolio Screen ───

function PortfolioScreen({ address, balance, totalUsd, tokens, network }: {
    address: string; balance: number; totalUsd: number; tokens: TokenInfo[]; network: string;
}) {
    return (
        <>
            {/* Holographic Card */}
            <div style={holoCardOuter}>
                <div style={holoCardInner}>
                    {/* Holo shimmer overlay */}
                    <div style={holoShimmer} />
                    <div style={{ position: 'relative', zIndex: 2 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
                            <div>
                                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>G3Engine Wallet</div>
                                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>{address}</div>
                            </div>
                            <div style={{ width: 40, height: 28, borderRadius: 4, background: 'linear-gradient(135deg, #f59e0b, #ef4444)', opacity: 0.8 }} />
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>BALANCE</div>
                            <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', textShadow: '0 0 30px rgba(139,92,246,0.4)' }}>
                                {balance.toFixed(2)} <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>SOL</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em' }}>{'•••• •••• •••• ' + address.slice(-4)}</div>
                            <div style={{ padding: '2px 8px', borderRadius: 6, background: 'rgba(20,241,149,0.15)', fontSize: 9, fontWeight: 700, color: '#14f195' }}>{network.toUpperCase()}</div>
                        </div>
                    </div>
                </div>
            </div>
            {/* CSS for holo animation */}
            <style>{`
                @keyframes holoShift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `}</style>

            {/* Total Balance */}
            <div style={{ textAlign: 'center', margin: '24px 0 20px' }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: '0.05em', marginBottom: 4 }}>TOTAL PORTFOLIO</div>
                <div style={{ fontSize: 36, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', textShadow: '0 0 40px rgba(20,241,149,0.2)' }}>
                    ${totalUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 6, padding: '4px 10px', borderRadius: 10, background: 'rgba(20,241,149,0.1)' }}>
                    <span style={{ color: '#14f195', fontSize: 12, fontWeight: 700 }}>↑ 12.4%</span>
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>24h</span>
                </div>
            </div>

            {/* Chart */}
            <div style={chartCardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>ASSET GROWTH</span>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>7D</span>
                </div>
                <LineChart data={CHART_DATA} />
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: 10, margin: '16px 0' }}>
                {[
                    { icon: '↗️', label: 'Send' },
                    { icon: '↙️', label: 'Receive' },
                    { icon: '🔄', label: 'Swap' },
                    { icon: '🚀', label: 'Launch' },
                ].map((a) => (
                    <div key={a.label} style={quickActionStyle}>
                        <span style={{ fontSize: 18 }}>{a.icon}</span>
                        <span style={{ fontSize: 9, fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>{a.label}</span>
                    </div>
                ))}
            </div>

            {/* Token List */}
            <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em', marginBottom: 10 }}>TOKENS</div>
                {tokens.map((t, i) => (
                    <div key={t.mint + i} style={tokenRowStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                            <div style={{
                                width: 36, height: 36, borderRadius: 10,
                                background: `linear-gradient(135deg, ${getTokenGradient(t.symbol)[0]}, ${getTokenGradient(t.symbol)[1]})`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 16,
                                boxShadow: `0 0 12px ${getTokenGradient(t.symbol)[0]}44`,
                            }}>
                                {TOKEN_EMOJI[t.symbol] || '🪙'}
                            </div>
                            <div>
                                <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{t.name}</div>
                                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>{t.symbol}{t.isPumpToken ? ' • Pump.fun' : ''}</div>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>
                                {t.balance >= 1000000 ? `${(t.balance / 1000000).toFixed(1)}M` : t.balance >= 1000 ? `${(t.balance / 1000).toFixed(1)}K` : t.balance.toFixed(2)}
                            </div>
                            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>
                                ${((t.balance * (t.priceInSol || 0)) * 148).toFixed(2)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

// ─── NFT Screen ───

function NFTScreen({ nfts }: { nfts: NFTInfo[] }) {
    return (
        <>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em', marginBottom: 14, marginTop: 8 }}>YOUR COLLECTION — {nfts.length} ITEMS</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {nfts.map((nft) => {
                    const rarity = nft.attributes?.find((a) => a.trait_type === 'Rarity')?.value || 'Common';
                    const rarityColor = RARITY_COLORS[rarity] || RARITY_COLORS.Common;
                    return (
                        <div key={nft.mint} style={nftCardStyle}>
                            <div style={{
                                width: '100%', aspectRatio: '1', borderRadius: 12,
                                background: `linear-gradient(135deg, ${rarityColor}22, ${rarityColor}08)`,
                                border: `1px solid ${rarityColor}33`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 40, marginBottom: 10,
                            }}>
                                {nft.name.includes('Sword') ? '⚔️' : nft.name.includes('Shield') ? '🛡️' : nft.name.includes('Explorer') ? '🧑‍🚀' : '🐉'}
                            </div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: '#fff', marginBottom: 4 }}>{nft.name}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)' }}>{nft.collection}</span>
                                <span style={{ padding: '1px 6px', borderRadius: 4, fontSize: 8, fontWeight: 700, color: rarityColor, background: `${rarityColor}18` }}>{rarity}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}

// ─── Activity Screen ───

function ActivityScreen({ txs }: { txs: Web3Transaction[] }) {
    return (
        <>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em', marginBottom: 14, marginTop: 8 }}>RECENT ACTIVITY</div>
            {txs.map((tx) => (
                <div key={tx.id} style={txRowStyle}>
                    <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: tx.status === 'confirmed' ? 'rgba(20,241,149,0.08)' : 'rgba(251,191,36,0.08)',
                        border: `1px solid ${tx.status === 'confirmed' ? 'rgba(20,241,149,0.15)' : 'rgba(251,191,36,0.15)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                    }}>
                        {TX_ICONS[tx.type] || '📝'}
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>{tx.description}</div>
                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>
                            {formatTimeAgo(tx.timestamp)} • <span style={{ fontFamily: 'monospace' }}>{tx.signature}</span>
                        </div>
                    </div>
                    <div style={{
                        padding: '3px 8px', borderRadius: 6, fontSize: 9, fontWeight: 700,
                        color: tx.status === 'confirmed' ? '#14f195' : tx.status === 'pending' ? '#fbbf24' : '#ef4444',
                        background: tx.status === 'confirmed' ? 'rgba(20,241,149,0.1)' : tx.status === 'pending' ? 'rgba(251,191,36,0.1)' : 'rgba(239,68,68,0.1)',
                    }}>
                        {tx.status.toUpperCase()}
                    </div>
                </div>
            ))}
        </>
    );
}

// ─── Settings Screen ───

function SettingsScreen() {
    const { network, setNetwork, rpcEndpoint, walletAddress, walletConnected } = useWeb3Store();
    return (
        <>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em', marginBottom: 14, marginTop: 8 }}>SETTINGS</div>

            {/* Wallet Info */}
            <div style={settingsCardStyle}>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 600, marginBottom: 8 }}>WALLET</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 4, background: walletConnected ? '#14f195' : '#ef4444' }} />
                    <span style={{ fontSize: 12, color: '#fff', fontWeight: 500 }}>{walletConnected ? 'Connected' : 'Not Connected'}</span>
                </div>
                {walletAddress && (
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                        {walletAddress}
                    </div>
                )}
            </div>

            {/* Network */}
            <div style={settingsCardStyle}>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 600, marginBottom: 8 }}>NETWORK</div>
                <div style={{ display: 'flex', gap: 8 }}>
                    {(['devnet', 'mainnet-beta'] as const).map((net) => (
                        <button
                            key={net}
                            onClick={() => setNetwork(net)}
                            style={{
                                flex: 1, padding: '10px', borderRadius: 10, border: 'none', cursor: 'pointer',
                                background: network === net ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.04)',
                                color: network === net ? '#8b5cf6' : 'rgba(255,255,255,0.4)',
                                fontWeight: 600, fontSize: 11,
                                outline: network === net ? '1px solid rgba(139,92,246,0.3)' : '1px solid rgba(255,255,255,0.06)',
                            }}
                        >
                            {net === 'devnet' ? '🧪 Devnet' : '🌐 Mainnet'}
                        </button>
                    ))}
                </div>
            </div>

            {/* RPC */}
            <div style={settingsCardStyle}>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 600, marginBottom: 8 }}>RPC ENDPOINT</div>
                <div style={{
                    padding: '8px 10px', borderRadius: 8,
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
                    fontSize: 10, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace',
                    wordBreak: 'break-all',
                }}>
                    {rpcEndpoint}
                </div>
            </div>

            {/* Links */}
            <div style={settingsCardStyle}>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 600, marginBottom: 8 }}>ABOUT</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', lineHeight: 1.8 }}>
                    G3Engine Wallet Dashboard<br />
                    Built with Solana Web3.js<br />
                    Version 1.0.0
                </div>
            </div>
        </>
    );
}

// ─── SVG Line Chart ───

function LineChart({ data }: { data: number[] }) {
    const w = 340, h = 100;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const points = data.map((v, i) => ({
        x: (i / (data.length - 1)) * w,
        y: h - ((v - min) / range) * h,
    }));
    const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaD = pathD + ` L ${w} ${h} L 0 ${h} Z`;
    const gradientId = 'chart-grad';

    return (
        <svg width="100%" viewBox={`0 0 ${w} ${h + 10}`} style={{ display: 'block' }}>
            <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#14f195" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#14f195" stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={areaD} fill={`url(#${gradientId})`} />
            <path d={pathD} fill="none" stroke="#14f195" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 6px rgba(20,241,149,0.4))' }} />
            {/* Last point glow */}
            <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="4" fill="#14f195" style={{ filter: 'drop-shadow(0 0 8px rgba(20,241,149,0.6))' }} />
        </svg>
    );
}

// ─── Helpers ───

function formatTimeAgo(ts: number): string {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}

function getTokenGradient(symbol: string): [string, string] {
    const map: Record<string, [string, string]> = {
        SOL: ['#9945FF', '#14F195'],
        G3: ['#8b5cf6', '#14f195'],
        USDC: ['#2775ca', '#5ac4f5'],
        RAY: ['#c850c0', '#4158d0'],
        JUP: ['#00d2ff', '#3a47d5'],
        BONK: ['#f59e0b', '#ef4444'],
    };
    return map[symbol] || ['#6366f1', '#a855f7'];
}

// ─── Styles ───

const containerStyle: React.CSSProperties = {
    width: '100%', maxWidth: 430, minHeight: '100vh',
    margin: '0 auto', position: 'relative', overflow: 'hidden',
    background: '#07070e',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    display: 'flex', flexDirection: 'column',
};

const bgGradient1: React.CSSProperties = {
    position: 'absolute', width: 400, height: 400, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
    top: -100, right: -100, pointerEvents: 'none',
};
const bgGradient2: React.CSSProperties = {
    position: 'absolute', width: 300, height: 300, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(20,241,149,0.08) 0%, transparent 70%)',
    bottom: 200, left: -100, pointerEvents: 'none',
};
const bgGradient3: React.CSSProperties = {
    position: 'absolute', width: 250, height: 250, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(236,72,153,0.06) 0%, transparent 70%)',
    top: 300, right: -80, pointerEvents: 'none',
};

const headerStyle: React.CSSProperties = {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '16px 20px',
    position: 'sticky', top: 0, zIndex: 10,
    backdropFilter: 'blur(20px)',
    background: 'rgba(7,7,14,0.8)',
};

const holoCardOuter: React.CSSProperties = {
    borderRadius: 20, padding: 1, marginTop: 8,
    background: 'linear-gradient(135deg, rgba(139,92,246,0.4), rgba(20,241,149,0.3), rgba(236,72,153,0.3), rgba(59,130,246,0.3))',
    backgroundSize: '300% 300%',
    animation: 'holoShift 6s ease infinite',
};

const holoCardInner: React.CSSProperties = {
    borderRadius: 19, padding: '24px 20px',
    background: 'linear-gradient(145deg, rgba(15,15,25,0.92), rgba(20,20,35,0.88))',
    backdropFilter: 'blur(20px)',
    position: 'relative', overflow: 'hidden',
};

const holoShimmer: React.CSSProperties = {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.04) 45%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 55%, transparent 70%)',
    backgroundSize: '200% 100%',
    animation: 'holoShift 4s ease infinite',
    pointerEvents: 'none',
};

const chartCardStyle: React.CSSProperties = {
    padding: '16px', borderRadius: 16,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    backdropFilter: 'blur(12px)',
};

const quickActionStyle: React.CSSProperties = {
    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
    padding: '14px 0', borderRadius: 14,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    cursor: 'pointer',
};

const tokenRowStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '12px 14px', borderRadius: 14, marginBottom: 8,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.05)',
    backdropFilter: 'blur(8px)',
    transition: 'all 0.2s',
};

const nftCardStyle: React.CSSProperties = {
    padding: 12, borderRadius: 16,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    backdropFilter: 'blur(10px)',
};

const txRowStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '12px 14px', borderRadius: 14, marginBottom: 8,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.05)',
    backdropFilter: 'blur(8px)',
};

const settingsCardStyle: React.CSSProperties = {
    padding: 16, borderRadius: 16, marginBottom: 12,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    backdropFilter: 'blur(10px)',
};

const bottomNavStyle: React.CSSProperties = {
    position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
    width: '100%', maxWidth: 430,
    display: 'flex', justifyContent: 'space-around',
    padding: '8px 0 20px',
    background: 'rgba(7,7,14,0.9)',
    backdropFilter: 'blur(20px)',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    zIndex: 20,
};
