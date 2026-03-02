'use client';

import React, { useState } from 'react';

// ─── Platform Definitions ───

interface Platform {
    id: string;
    name: string;
    icon: React.ReactNode;
    color: string;
    desc: string;
    tag?: string;
}

const TwitterIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const TelegramIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
);

const RedditIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 3.314 1.343 6.314 3.515 8.485l-2.286 2.286C.775 23.225 1.097 24 1.738 24H12c6.627 0 12-5.373 12-12S18.627 0 12 0zm5.949 13.529c.034.206.049.418.049.63 0 3.182-3.697 5.763-8.252 5.763S1.494 17.34 1.494 14.16c0-.213.015-.424.05-.63a1.742 1.742 0 0 1-.73-1.418c0-.963.782-1.745 1.745-1.745.462 0 .882.183 1.193.48 1.172-.836 2.804-1.378 4.64-1.449l.89-4.2c.024-.108.087-.2.175-.262a.382.382 0 0 1 .303-.06l2.955.622a1.24 1.24 0 0 1 2.266.56 1.24 1.24 0 0 1-1.235 1.244 1.242 1.242 0 0 1-1.225-1.05l-2.61-.548-.78 3.698c1.82.08 3.425.622 4.587 1.452.312-.297.732-.48 1.194-.48.963 0 1.745.782 1.745 1.745 0 .562-.271 1.06-.688 1.379z" />
    </svg>
);

const FarcasterIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3.72 0h16.56C22.34 0 24 1.66 24 3.72v16.56C24 22.34 22.34 24 20.28 24H3.72C1.66 24 0 22.34 0 20.28V3.72C0 1.66 1.66 0 3.72 0zm1.2 4.08v15.84h2.64v-6.6h8.88v6.6h2.64V4.08h-2.64v6.36H7.56V4.08H4.92z" />
    </svg>
);

const BaseAppIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M8 12c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" />
    </svg>
);

const WebIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
);

const PLATFORMS: Platform[] = [
    {
        id: 'twitter',
        name: 'X (Twitter)',
        icon: <TwitterIcon />,
        color: '#f0f0f5',
        desc: 'Publish as a Twitter Player Card for inline play',
        tag: 'Popular',
    },
    {
        id: 'telegram',
        name: 'Telegram',
        icon: <TelegramIcon />,
        color: '#26a5e4',
        desc: 'Deploy as a Telegram Mini App',
    },
    {
        id: 'reddit',
        name: 'Reddit',
        icon: <RedditIcon />,
        color: '#ff4500',
        desc: 'Embed in Reddit posts as a playable widget',
    },
    {
        id: 'farcaster',
        name: 'Farcaster',
        icon: <FarcasterIcon />,
        color: '#8b5cf6',
        desc: 'Share as a Farcaster Frame for on-chain gaming',
        tag: 'Web3',
    },
    {
        id: 'baseapp',
        name: 'Base App',
        icon: <BaseAppIcon />,
        color: '#0052ff',
        desc: 'Deploy to the Base ecosystem',
        tag: 'Web3',
    },
    {
        id: 'web',
        name: 'Web (URL)',
        icon: <WebIcon />,
        color: '#14f195',
        desc: 'Get a standalone URL to share anywhere',
    },
];

// ─── Modal Styles ───

const backdrop: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    background: 'rgba(0,0,0,0.65)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: 'fadeIn 0.2s ease',
};

const modal: React.CSSProperties = {
    width: '100%',
    maxWidth: 560,
    background: '#13131d',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 20,
    padding: '32px',
    position: 'relative',
    boxShadow: '0 25px 80px rgba(0,0,0,0.5), 0 0 60px rgba(139,92,246,0.08)',
    animation: 'scaleIn 0.25s ease',
};

// ─── Component ───

interface PublishModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function PublishModal({ isOpen, onClose }: PublishModalProps) {
    const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
    const [isPublishing, setIsPublishing] = useState(false);
    const [published, setPublished] = useState(false);

    if (!isOpen) return null;

    const handlePublish = () => {
        if (!selectedPlatform) return;
        setIsPublishing(true);
        // Simulate publish
        setTimeout(() => {
            setIsPublishing(false);
            setPublished(true);
        }, 2000);
    };

    const handleClose = () => {
        setSelectedPlatform(null);
        setIsPublishing(false);
        setPublished(false);
        onClose();
    };

    return (
        <div style={backdrop} onClick={handleClose}>
            <div style={modal} onClick={(e) => e.stopPropagation()}>
                {/* Close */}
                <button
                    onClick={handleClose}
                    style={{
                        position: 'absolute', top: 16, right: 16,
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 8, width: 32, height: 32,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#7a7f8d', cursor: 'pointer', fontSize: 16,
                    }}
                >
                    ✕
                </button>

                {!published ? (
                    <>
                        {/* Header */}
                        <div style={{ marginBottom: 4 }}>
                            <span style={{
                                display: 'inline-flex', alignItems: 'center', gap: 6,
                                padding: '3px 10px', borderRadius: 12,
                                background: 'rgba(139,92,246,0.1)',
                                border: '1px solid rgba(139,92,246,0.15)',
                                fontSize: 10, fontWeight: 600, color: '#a78bfa',
                                textTransform: 'uppercase', letterSpacing: '0.06em',
                                marginBottom: 12,
                            }}>
                                🚀 Publish
                            </span>
                        </div>

                        <h2 style={{
                            fontSize: 22, fontWeight: 700, color: '#f0f0f5',
                            letterSpacing: '-0.02em', marginBottom: 4,
                        }}>
                            Where do you want to publish?
                        </h2>
                        <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 24, lineHeight: 1.5 }}>
                            Choose a platform and we'll package your game for it.
                        </p>

                        {/* Platform Grid */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: 10,
                            marginBottom: 28,
                        }}>
                            {PLATFORMS.map((p) => {
                                const isSelected = selectedPlatform === p.id;
                                return (
                                    <button
                                        key={p.id}
                                        onClick={() => setSelectedPlatform(p.id)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 12,
                                            padding: '14px 16px',
                                            borderRadius: 14,
                                            background: isSelected ? 'rgba(139,92,246,0.08)' : 'rgba(255,255,255,0.02)',
                                            border: `1.5px solid ${isSelected ? 'rgba(139,92,246,0.35)' : 'rgba(255,255,255,0.05)'}`,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            textAlign: 'left',
                                            position: 'relative',
                                            boxShadow: isSelected ? '0 0 20px rgba(139,92,246,0.08)' : 'none',
                                        }}
                                    >
                                        {/* Icon */}
                                        <div style={{
                                            width: 40, height: 40, borderRadius: 10,
                                            background: isSelected ? `${p.color}15` : 'rgba(255,255,255,0.03)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: isSelected ? p.color : '#5a5f6d',
                                            flexShrink: 0,
                                            transition: 'all 0.2s ease',
                                        }}>
                                            {p.icon}
                                        </div>

                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{
                                                display: 'flex', alignItems: 'center', gap: 6,
                                            }}>
                                                <span style={{
                                                    fontSize: 13, fontWeight: 600,
                                                    color: isSelected ? '#f0f0f5' : '#9ca3b0',
                                                }}>
                                                    {p.name}
                                                </span>
                                                {p.tag && (
                                                    <span style={{
                                                        fontSize: 9, fontWeight: 600,
                                                        padding: '1px 6px', borderRadius: 6,
                                                        background: p.tag === 'Web3' ? 'rgba(139,92,246,0.15)' : 'rgba(20,241,149,0.1)',
                                                        color: p.tag === 'Web3' ? '#a78bfa' : '#14f195',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.05em',
                                                    }}>
                                                        {p.tag}
                                                    </span>
                                                )}
                                            </div>
                                            <span style={{ fontSize: 11, color: '#5a5f6d', lineHeight: 1.3 }}>
                                                {p.desc}
                                            </span>
                                        </div>

                                        {/* Selection indicator */}
                                        {isSelected && (
                                            <div style={{
                                                width: 20, height: 20, borderRadius: '50%',
                                                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: 'white', fontSize: 12, flexShrink: 0,
                                            }}>
                                                ✓
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                            <button
                                onClick={handleClose}
                                style={{
                                    padding: '10px 20px', borderRadius: 10,
                                    background: 'rgba(255,255,255,0.04)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    color: '#9ca3b0', fontSize: 13, fontWeight: 500,
                                    cursor: 'pointer',
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePublish}
                                disabled={!selectedPlatform || isPublishing}
                                style={{
                                    padding: '10px 28px', borderRadius: 10,
                                    background: selectedPlatform
                                        ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
                                        : 'rgba(255,255,255,0.04)',
                                    border: selectedPlatform
                                        ? '1px solid rgba(139,92,246,0.3)'
                                        : '1px solid rgba(255,255,255,0.06)',
                                    color: selectedPlatform ? 'white' : '#5a5f6d',
                                    fontSize: 13, fontWeight: 600,
                                    cursor: selectedPlatform ? 'pointer' : 'not-allowed',
                                    boxShadow: selectedPlatform ? '0 0 24px rgba(139,92,246,0.2)' : 'none',
                                    opacity: isPublishing ? 0.7 : 1,
                                    display: 'flex', alignItems: 'center', gap: 8,
                                }}
                            >
                                {isPublishing ? (
                                    <>
                                        <span style={{
                                            width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)',
                                            borderTopColor: 'white', borderRadius: '50%',
                                            animation: 'spin 0.8s linear infinite',
                                            display: 'inline-block',
                                        }} />
                                        Publishing...
                                    </>
                                ) : (
                                    <>🚀 Publish</>
                                )}
                            </button>
                        </div>
                    </>
                ) : (
                    /* ── Published Success ── */
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                        <div style={{
                            width: 64, height: 64, borderRadius: 20, margin: '0 auto 20px',
                            background: 'rgba(20,241,149,0.1)',
                            border: '1px solid rgba(20,241,149,0.2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 28,
                        }}>
                            ✅
                        </div>
                        <h2 style={{
                            fontSize: 22, fontWeight: 700, color: '#f0f0f5',
                            marginBottom: 8,
                        }}>
                            Published!
                        </h2>
                        <p style={{ fontSize: 13, color: '#7a7f8d', marginBottom: 20, lineHeight: 1.5 }}>
                            Your game is live on <strong style={{ color: '#f0f0f5' }}>
                                {PLATFORMS.find(p => p.id === selectedPlatform)?.name}
                            </strong>
                        </p>

                        {/* Mock URL */}
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            padding: '10px 16px', borderRadius: 10,
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            marginBottom: 24,
                            justifyContent: 'center',
                        }}>
                            <span style={{ fontSize: 12, color: '#14f195', fontFamily: 'monospace' }}>
                                https://engine.gg/play/g_{Math.random().toString(36).slice(2, 8)}
                            </span>
                            <button
                                onClick={() => navigator.clipboard?.writeText('https://engine.gg/play/demo')}
                                style={{
                                    padding: '4px 10px', borderRadius: 6,
                                    background: 'rgba(139,92,246,0.1)',
                                    border: '1px solid rgba(139,92,246,0.2)',
                                    color: '#a78bfa', fontSize: 11, fontWeight: 600,
                                    cursor: 'pointer',
                                }}
                            >
                                Copy
                            </button>
                        </div>

                        <button
                            onClick={handleClose}
                            style={{
                                padding: '10px 28px', borderRadius: 10,
                                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                                border: 'none', color: 'white',
                                fontSize: 13, fontWeight: 600, cursor: 'pointer',
                                boxShadow: '0 0 24px rgba(139,92,246,0.2)',
                            }}
                        >
                            Done
                        </button>
                    </div>
                )}
            </div>

            {/* Animations */}
            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}
