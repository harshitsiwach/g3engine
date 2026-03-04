'use client';

import dynamic from 'next/dynamic';

const WalletDashboard = dynamic(() => import('@/components/web3/WalletDashboard'), { ssr: false });

export default function WalletPage() {
    return <WalletDashboard />;
}
