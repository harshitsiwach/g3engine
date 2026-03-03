'use client';

import React, { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { useWeb3Store } from '@/store/web3Store';

// Import wallet adapter default styles
import '@solana/wallet-adapter-react-ui/styles.css';

export default function SolanaProvider({ children }: { children: React.ReactNode }) {
    const { rpcEndpoint } = useWeb3Store();

    // Let the wallet adapter auto-detect installed wallets (Phantom, Solflare, etc.)
    // Providing explicit adapters can cause duplicate key errors (e.g., MetaMask)
    const wallets = useMemo(() => [], []);

    return (
        <ConnectionProvider endpoint={rpcEndpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    {children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}
