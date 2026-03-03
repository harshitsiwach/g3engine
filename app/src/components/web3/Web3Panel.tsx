'use client';

import React, { useState } from 'react';
import { useWeb3Store } from '@/store/web3Store';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import TokenLaunchModal from './TokenLaunchModal';
import MintNFTModal from './MintNFTModal';

const TABS = [
    { id: 'tokens' as const, icon: '🪙', label: 'Tokens' },
    { id: 'nfts' as const, icon: '🎨', label: 'NFTs' },
    { id: 'economy' as const, icon: '💰', label: 'Economy' },
    { id: 'settings' as const, icon: '⚙️', label: 'Settings' },
];

export default function Web3Panel() {
    const {
        activeTab, setActiveTab,
        tokens, nfts,
        economy, updateEconomy,
        network, setNetwork,
        walletAddress, solBalance,
        transactions,
    } = useWeb3Store();
    const { connected } = useWallet();
    const { setVisible } = useWalletModal();

    const [showTokenLaunch, setShowTokenLaunch] = useState(false);
    const [showMintNFT, setShowMintNFT] = useState(false);

    return (
        <>
            <div style={{
                display: 'flex', flexDirection: 'column', height: '100%',
                background: 'rgba(15,15,22,0.95)',
                borderLeft: '1px solid rgba(255,255,255,0.06)',
            }}>
                {/* Tab Bar */}
                <div style={{
                    display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)',
                    padding: '0 4px',
                }}>
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                flex: 1,
                                padding: '10px 4px',
                                background: activeTab === tab.id ? 'rgba(20,241,149,0.08)' : 'transparent',
                                border: 'none',
                                borderBottom: activeTab === tab.id ? '2px solid #14f195' : '2px solid transparent',
                                color: activeTab === tab.id ? '#14f195' : 'rgba(255,255,255,0.4)',
                                fontSize: 11,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 2,
                            }}
                        >
                            <span style={{ fontSize: 16 }}>{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div style={{ flex: 1, overflow: 'auto', padding: 12 }}>
                    {!connected ? (
                        <div style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            justifyContent: 'center', height: '100%', gap: 16, padding: 20,
                        }}>
                            <div style={{ fontSize: 48, opacity: 0.3 }}>🔗</div>
                            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
                                Connect your wallet to access Web3 features
                            </p>
                            <button
                                onClick={() => setVisible(true)}
                                style={{
                                    padding: '10px 24px', borderRadius: 10,
                                    background: 'linear-gradient(135deg, #14f195, #9945FF)',
                                    border: 'none', color: '#000', fontWeight: 700,
                                    fontSize: 13, cursor: 'pointer',
                                }}
                            >
                                Connect Wallet
                            </button>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'tokens' && (
                                <TokensTab
                                    tokens={tokens}
                                    onLaunchToken={() => setShowTokenLaunch(true)}
                                />
                            )}
                            {activeTab === 'nfts' && (
                                <NFTsTab
                                    nfts={nfts}
                                    onMintNFT={() => setShowMintNFT(true)}
                                />
                            )}
                            {activeTab === 'economy' && (
                                <EconomyTab economy={economy} updateEconomy={updateEconomy} tokens={tokens} />
                            )}
                            {activeTab === 'settings' && (
                                <SettingsTab
                                    network={network}
                                    setNetwork={setNetwork}
                                    walletAddress={walletAddress}
                                    solBalance={solBalance}
                                    transactions={transactions}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>

            <TokenLaunchModal isOpen={showTokenLaunch} onClose={() => setShowTokenLaunch(false)} />
            <MintNFTModal isOpen={showMintNFT} onClose={() => setShowMintNFT(false)} />
        </>
    );
}

// ────────────────────────────────
// Token Tab
// ────────────────────────────────

function TokensTab({ tokens, onLaunchToken }: { tokens: any[]; onLaunchToken: () => void }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button onClick={onLaunchToken} style={actionBtnStyle}>
                🚀 Launch Token on Pump.fun
            </button>

            <h4 style={sectionTitle}>Your Tokens</h4>
            {tokens.length === 0 ? (
                <div style={emptyState}>No tokens yet. Launch one to get started!</div>
            ) : (
                tokens.map((t, i) => (
                    <div key={i} style={cardStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            {t.imageUri ? (
                                <img src={t.imageUri} alt={t.symbol} style={{ width: 28, height: 28, borderRadius: '50%' }} />
                            ) : (
                                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(20,241,149,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🪙</div>
                            )}
                            <div>
                                <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{t.symbol}</div>
                                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{t.name}</div>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: '#14f195' }}>{t.balance}</div>
                            {t.priceInSol && <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{t.priceInSol} SOL</div>}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

// ────────────────────────────────
// NFTs Tab
// ────────────────────────────────

function NFTsTab({ nfts, onMintNFT }: { nfts: any[]; onMintNFT: () => void }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button onClick={onMintNFT} style={actionBtnStyle}>
                🎨 Mint Game NFT
            </button>
            <button style={{ ...actionBtnStyle, background: 'rgba(153,69,255,0.1)', borderColor: 'rgba(153,69,255,0.3)' }}>
                🔐 Add NFT Gate to Scene
            </button>

            <h4 style={sectionTitle}>Your NFTs</h4>
            {nfts.length === 0 ? (
                <div style={emptyState}>No NFTs minted yet.</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {nfts.map((nft, i) => (
                        <div key={i} style={{ ...cardStyle, flexDirection: 'column', padding: 8 }}>
                            <img src={nft.imageUri} alt={nft.name} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 6 }} />
                            <div style={{ fontSize: 11, fontWeight: 600, color: '#fff', marginTop: 4 }}>{nft.name}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ────────────────────────────────
// Economy Tab
// ────────────────────────────────

function EconomyTab({ economy, updateEconomy, tokens }: { economy: any; updateEconomy: any; tokens: any[] }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h4 style={sectionTitle}>In-Game Economy</h4>

            {/* Reward Config */}
            <div style={cardStyle}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
                    <label style={labelStyle}>Reward Token</label>
                    <select
                        value={economy.rewardTokenMint || ''}
                        onChange={(e) => updateEconomy({ rewardTokenMint: e.target.value || null })}
                        style={inputStyle}
                    >
                        <option value="">None</option>
                        {tokens.map((t) => (
                            <option key={t.mint} value={t.mint}>{t.symbol}</option>
                        ))}
                    </select>

                    <label style={labelStyle}>Tokens per Level Complete</label>
                    <input
                        type="number"
                        value={economy.rewardPerLevel}
                        onChange={(e) => updateEconomy({ rewardPerLevel: Number(e.target.value) })}
                        style={inputStyle}
                    />
                </div>
            </div>

            {/* Tip Jar */}
            <div style={{ ...cardStyle, cursor: 'pointer' }} onClick={() => updateEconomy({ tipJarEnabled: !economy.tipJarEnabled })}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 20 }}>☕</span>
                    <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Tip Jar</div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Let players tip you in SOL</div>
                    </div>
                </div>
                <div style={{
                    width: 36, height: 20, borderRadius: 10,
                    background: economy.tipJarEnabled ? '#14f195' : 'rgba(255,255,255,0.1)',
                    position: 'relative', transition: 'all 0.2s',
                }}>
                    <div style={{
                        width: 16, height: 16, borderRadius: '50%',
                        background: '#fff', position: 'absolute', top: 2,
                        left: economy.tipJarEnabled ? 18 : 2, transition: 'all 0.2s',
                    }} />
                </div>
            </div>
        </div>
    );
}

// ────────────────────────────────
// Settings Tab
// ────────────────────────────────

function SettingsTab({ network, setNetwork, walletAddress, solBalance, transactions }: any) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Wallet Info */}
            <div style={cardStyle}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Address</span>
                        <span style={{ fontSize: 11, color: '#14f195', fontFamily: 'monospace' }}>
                            {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : '—'}
                        </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Balance</span>
                        <span style={{ fontSize: 11, color: '#fff', fontWeight: 600 }}>{solBalance.toFixed(4)} SOL</span>
                    </div>
                </div>
            </div>

            {/* Network */}
            <h4 style={sectionTitle}>Network</h4>
            <div style={{ display: 'flex', gap: 8 }}>
                {(['devnet', 'mainnet-beta'] as const).map((net) => (
                    <button
                        key={net}
                        onClick={() => setNetwork(net)}
                        style={{
                            flex: 1, padding: '8px 12px', borderRadius: 8,
                            border: network === net ? '1px solid #14f195' : '1px solid rgba(255,255,255,0.1)',
                            background: network === net ? 'rgba(20,241,149,0.1)' : 'transparent',
                            color: network === net ? '#14f195' : 'rgba(255,255,255,0.4)',
                            fontSize: 12, fontWeight: 600, cursor: 'pointer',
                        }}
                    >
                        {net === 'devnet' ? '🧪 Devnet' : '🌐 Mainnet'}
                    </button>
                ))}
            </div>

            {/* Recent Transactions */}
            <h4 style={sectionTitle}>Recent Transactions</h4>
            {transactions.length === 0 ? (
                <div style={emptyState}>No transactions yet.</div>
            ) : (
                transactions.slice(0, 10).map((tx: any) => (
                    <div key={tx.id} style={{ ...cardStyle, padding: '8px 10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{
                                width: 8, height: 8, borderRadius: '50%',
                                background: tx.status === 'confirmed' ? '#14f195' : tx.status === 'pending' ? '#f59e0b' : '#ef4444',
                            }} />
                            <span style={{ fontSize: 11, color: '#fff' }}>{tx.description}</span>
                        </div>
                        <a
                            href={`https://solscan.io/tx/${tx.signature}?cluster=${network}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}
                        >
                            View ↗
                        </a>
                    </div>
                ))
            )}
        </div>
    );
}

// ────────────────────────────────
// Shared Styles
// ────────────────────────────────

const actionBtnStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    padding: '12px 16px', borderRadius: 10,
    border: '1px solid rgba(20,241,149,0.3)',
    background: 'rgba(20,241,149,0.06)',
    color: '#14f195', fontSize: 13, fontWeight: 700,
    cursor: 'pointer', transition: 'all 0.2s',
};

const sectionTitle: React.CSSProperties = {
    fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)',
    textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0,
};

const cardStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '10px 12px', borderRadius: 8,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
};

const emptyState: React.CSSProperties = {
    fontSize: 12, color: 'rgba(255,255,255,0.25)',
    textAlign: 'center', padding: '20px 0',
};

const labelStyle: React.CSSProperties = {
    fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 600,
};

const inputStyle: React.CSSProperties = {
    padding: '6px 10px', borderRadius: 6,
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.04)',
    color: '#fff', fontSize: 12, outline: 'none',
};
