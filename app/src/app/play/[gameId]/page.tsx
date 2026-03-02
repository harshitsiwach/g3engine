import type { Metadata } from 'next';

interface PlayPageProps {
    params: Promise<{ gameId: string }>;
}

export async function generateMetadata({ params }: PlayPageProps): Promise<Metadata> {
    const { gameId } = await params;
    const playerUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://play.engine.com'}/play/${gameId}`;

    return {
        title: `Play Game - ${gameId}`,
        description: 'Play this interactive 3D game built with Web3 Game Engine',
        openGraph: {
            title: `Play Game - ${gameId}`,
            description: 'Play this interactive 3D game built with Web3 Game Engine',
            type: 'website',
        },
        twitter: {
            card: 'player',
            title: `Play Game - ${gameId}`,
            description: 'Play this interactive 3D game built with Web3 Game Engine',
            players: {
                playerUrl: playerUrl,
                width: 480,
                height: 480,
                streamUrl: playerUrl,
            },
        },
        other: {
            'telegram:channel': '@web3gameengine',
        },
    };
}

export default async function PlayPage({ params }: PlayPageProps) {
    const { gameId } = await params;

    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            background: '#0a0a0f',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#f0f0f5',
        }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    background: 'linear-gradient(135deg, #8b5cf6, #14f195)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 28,
                    margin: '0 auto 20px',
                }}>
                    ⬡
                </div>
                <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Loading Game...</h1>
                <p style={{ color: '#5a5f6d', fontSize: 14 }}>Game ID: {gameId}</p>
                <p style={{ color: '#5a5f6d', fontSize: 12, marginTop: 16 }}>
                    The game player will load the scene from Arweave and render it here.
                </p>
            </div>
        </div>
    );
}
