'use client';

import React, { useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useWeb3Store } from '@/store/web3Store';

export default function WalletButton() {
    const { publicKey, connected, disconnect } = useWallet();
    const { connection } = useConnection();
    const { setVisible } = useWalletModal();
    const { setWalletConnected, setSolBalance, solBalance } = useWeb3Store();

    // Sync wallet state to web3Store
    useEffect(() => {
        setWalletConnected(connected, publicKey?.toBase58() ?? null);
    }, [connected, publicKey, setWalletConnected]);

    // Fetch SOL balance
    useEffect(() => {
        if (!publicKey || !connected) return;
        const fetchBalance = async () => {
            try {
                const bal = await connection.getBalance(publicKey);
                setSolBalance(bal / LAMPORTS_PER_SOL);
            } catch {
                setSolBalance(0);
            }
        };
        fetchBalance();
        const id = connection.onAccountChange(publicKey, (info) => {
            setSolBalance(info.lamports / LAMPORTS_PER_SOL);
        });
        return () => { connection.removeAccountChangeListener(id); };
    }, [publicKey, connected, connection, setSolBalance]);

    const truncated = publicKey
        ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
        : '';

    if (!connected) {
        return (
            <button
                onClick={() => setVisible(true)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 14px',
                    borderRadius: 8,
                    border: '1px solid rgba(20,241,149,0.3)',
                    background: 'rgba(20,241,149,0.08)',
                    color: '#14f195',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.background = 'rgba(20,241,149,0.15)';
                    (e.target as HTMLElement).style.borderColor = 'rgba(20,241,149,0.5)';
                }}
                onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.background = 'rgba(20,241,149,0.08)';
                    (e.target as HTMLElement).style.borderColor = 'rgba(20,241,149,0.3)';
                }}
            >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="6" width="20" height="12" rx="2" />
                    <path d="M16 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" fill="currentColor" />
                </svg>
                Connect Wallet
            </button>
        );
    }

    return (
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '5px 12px',
                    borderRadius: 8,
                    background: 'rgba(20,241,149,0.08)',
                    border: '1px solid rgba(20,241,149,0.2)',
                    fontSize: 12,
                    color: '#14f195',
                    fontWeight: 600,
                }}
            >
                <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: '#14f195',
                    boxShadow: '0 0 8px rgba(20,241,149,0.5)',
                }} />
                {truncated}
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>
                    {(solBalance ?? 0).toFixed(2)} SOL
                </span>
            </div>
            <button
                onClick={disconnect}
                style={{
                    padding: '5px 8px',
                    borderRadius: 6,
                    border: '1px solid rgba(239,68,68,0.3)',
                    background: 'rgba(239,68,68,0.08)',
                    color: '#ef4444',
                    fontSize: 11,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.background = 'rgba(239,68,68,0.15)';
                }}
                onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.background = 'rgba(239,68,68,0.08)';
                }}
            >
                ✕
            </button>
        </div>
    );
}
