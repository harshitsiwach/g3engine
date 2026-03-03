'use client';

import React, { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useWeb3Store } from '@/store/web3Store';
import { v4 as uuidv4 } from 'uuid';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export default function TokenLaunchModal({ isOpen, onClose }: Props) {
    const { publicKey, signTransaction } = useWallet();
    const { connection } = useConnection();
    const { addToken, addTransaction, network } = useWeb3Store();

    const [name, setName] = useState('');
    const [symbol, setSymbol] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');

    if (!isOpen) return null;

    const handleLaunch = async () => {
        if (!publicKey || !name || !symbol) {
            setStatus('Please fill in all required fields');
            return;
        }

        setLoading(true);
        setStatus('Creating token on Pump.fun...');

        try {
            // In production, this would call the Pump.fun create instruction
            // For now, we simulate the flow and show the UI

            const txId = uuidv4();
            const mockMint = `${symbol.toUpperCase()}${Date.now().toString(36)}`;

            addTransaction({
                id: txId,
                type: 'token_launch',
                signature: mockMint,
                status: 'confirmed',
                description: `Launched $${symbol.toUpperCase()} on Pump.fun`,
                timestamp: Date.now(),
            });

            addToken({
                mint: mockMint,
                name,
                symbol: symbol.toUpperCase(),
                balance: 0,
                decimals: 6,
                imageUri: imageUrl || undefined,
                isPumpToken: true,
                bondingCurveComplete: false,
                priceInSol: 0.000001,
            });

            setStatus(`✅ $${symbol.toUpperCase()} launched successfully!`);
            setTimeout(() => {
                onClose();
                setName('');
                setSymbol('');
                setDescription('');
                setImageUrl('');
                setStatus('');
            }, 1500);
        } catch (err: any) {
            setStatus(`❌ Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={overlayStyle} onClick={onClose}>
            <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#fff' }}>
                        🚀 Launch Token on Pump.fun
                    </h2>
                    <button onClick={onClose} style={closeBtnStyle}>✕</button>
                </div>

                {/* Network Badge */}
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '4px 10px', borderRadius: 6,
                    background: network === 'devnet' ? 'rgba(245,158,11,0.1)' : 'rgba(20,241,149,0.1)',
                    border: `1px solid ${network === 'devnet' ? 'rgba(245,158,11,0.3)' : 'rgba(20,241,149,0.3)'}`,
                    fontSize: 11, color: network === 'devnet' ? '#f59e0b' : '#14f195',
                    marginBottom: 16,
                }}>
                    {network === 'devnet' ? '🧪 Devnet' : '🌐 Mainnet'}
                </div>

                {/* Form */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div>
                        <label style={formLabelStyle}>Token Name *</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Game Gold" style={formInputStyle} />
                    </div>
                    <div>
                        <label style={formLabelStyle}>Symbol *</label>
                        <input value={symbol} onChange={(e) => setSymbol(e.target.value.toUpperCase())} placeholder="e.g. GLD" style={formInputStyle} maxLength={10} />
                    </div>
                    <div>
                        <label style={formLabelStyle}>Description</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your token..." style={{ ...formInputStyle, height: 60, resize: 'vertical' }} />
                    </div>
                    <div>
                        <label style={formLabelStyle}>Image URL</label>
                        <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." style={formInputStyle} />
                    </div>

                    {imageUrl && (
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <img src={imageUrl} alt="Token" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(20,241,149,0.3)' }} />
                        </div>
                    )}

                    {/* Info Box */}
                    <div style={{
                        padding: '10px 14px', borderRadius: 8,
                        background: 'rgba(20,241,149,0.04)',
                        border: '1px solid rgba(20,241,149,0.1)',
                        fontSize: 11, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5,
                    }}>
                        💡 Your token will be launched on the Pump.fun bonding curve. Players and traders can immediately buy and sell. When the bonding curve completes, liquidity migrates to PumpSwap AMM.
                    </div>

                    {status && (
                        <div style={{
                            padding: '8px 12px', borderRadius: 6,
                            background: status.startsWith('✅') ? 'rgba(20,241,149,0.1)' : status.startsWith('❌') ? 'rgba(239,68,68,0.1)' : 'rgba(153,69,255,0.1)',
                            fontSize: 12, color: status.startsWith('✅') ? '#14f195' : status.startsWith('❌') ? '#ef4444' : '#9945FF',
                        }}>
                            {status}
                        </div>
                    )}

                    <button
                        onClick={handleLaunch}
                        disabled={loading || !name || !symbol}
                        style={{
                            ...launchBtnStyle,
                            opacity: loading || !name || !symbol ? 0.5 : 1,
                            cursor: loading || !name || !symbol ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {loading ? '⏳ Launching...' : '🚀 Launch Token'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Styles ──

const overlayStyle: React.CSSProperties = {
    position: 'fixed', inset: 0, zIndex: 10000,
    background: 'rgba(0,0,0,0.7)',
    backdropFilter: 'blur(8px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
};

const modalStyle: React.CSSProperties = {
    width: 440, maxWidth: '90vw', maxHeight: '85vh', overflow: 'auto',
    background: '#1a1a2e',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 16, padding: 24,
    boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
};

const closeBtnStyle: React.CSSProperties = {
    width: 28, height: 28, borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'transparent', color: 'rgba(255,255,255,0.4)',
    cursor: 'pointer', fontSize: 14,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
};

const formLabelStyle: React.CSSProperties = {
    fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.5)',
    marginBottom: 4, display: 'block',
};

const formInputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.04)',
    color: '#fff', fontSize: 13, outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
};

const launchBtnStyle: React.CSSProperties = {
    width: '100%', padding: '14px 24px', borderRadius: 12,
    background: 'linear-gradient(135deg, #14f195, #9945FF)',
    border: 'none', color: '#000', fontWeight: 800,
    fontSize: 15, cursor: 'pointer',
    transition: 'all 0.2s',
};
