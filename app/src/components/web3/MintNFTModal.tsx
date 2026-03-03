'use client';

import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWeb3Store } from '@/store/web3Store';
import { v4 as uuidv4 } from 'uuid';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export default function MintNFTModal({ isOpen, onClose }: Props) {
    const { publicKey } = useWallet();
    const { addNft, addTransaction, network } = useWeb3Store();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [collection, setCollection] = useState('');
    const [attributes, setAttributes] = useState<{ trait_type: string; value: string }[]>([
        { trait_type: 'Type', value: 'Game Asset' },
    ]);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');

    if (!isOpen) return null;

    const addAttribute = () => setAttributes([...attributes, { trait_type: '', value: '' }]);

    const updateAttribute = (i: number, field: 'trait_type' | 'value', val: string) => {
        const updated = [...attributes];
        updated[i][field] = val;
        setAttributes(updated);
    };

    const removeAttribute = (i: number) => setAttributes(attributes.filter((_, idx) => idx !== i));

    const handleMint = async () => {
        if (!publicKey || !name || !imageUrl) {
            setStatus('Please fill in all required fields');
            return;
        }

        setLoading(true);
        setStatus('Minting NFT...');

        try {
            const txId = uuidv4();
            const mockMint = `NFT${Date.now().toString(36)}`;

            addTransaction({
                id: txId,
                type: 'mint_nft',
                signature: mockMint,
                status: 'confirmed',
                description: `Minted NFT: ${name}`,
                timestamp: Date.now(),
            });

            addNft({
                mint: mockMint,
                name,
                imageUri: imageUrl,
                collection: collection || undefined,
                attributes: attributes.filter((a) => a.trait_type && a.value),
            });

            setStatus('✅ NFT minted successfully!');
            setTimeout(() => {
                onClose();
                setName('');
                setDescription('');
                setImageUrl('');
                setCollection('');
                setAttributes([{ trait_type: 'Type', value: 'Game Asset' }]);
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#fff' }}>
                        🎨 Mint Game NFT
                    </h2>
                    <button onClick={onClose} style={closeBtnStyle}>✕</button>
                </div>

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

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div>
                        <label style={formLabelStyle}>NFT Name *</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Legendary Sword" style={formInputStyle} />
                    </div>
                    <div>
                        <label style={formLabelStyle}>Image URL *</label>
                        <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." style={formInputStyle} />
                    </div>
                    {imageUrl && (
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <img src={imageUrl} alt="NFT" style={{ width: 120, height: 120, borderRadius: 12, objectFit: 'cover', border: '2px solid rgba(153,69,255,0.3)' }} />
                        </div>
                    )}
                    <div>
                        <label style={formLabelStyle}>Description</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your NFT..." style={{ ...formInputStyle, height: 60, resize: 'vertical' }} />
                    </div>
                    <div>
                        <label style={formLabelStyle}>Collection Name</label>
                        <input value={collection} onChange={(e) => setCollection(e.target.value)} placeholder="e.g. Game Items" style={formInputStyle} />
                    </div>

                    {/* Attributes */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label style={formLabelStyle}>Attributes</label>
                            <button onClick={addAttribute} style={{ background: 'none', border: 'none', color: '#14f195', fontSize: 11, cursor: 'pointer' }}>+ Add</button>
                        </div>
                        {attributes.map((attr, i) => (
                            <div key={i} style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                                <input value={attr.trait_type} onChange={(e) => updateAttribute(i, 'trait_type', e.target.value)} placeholder="Trait" style={{ ...formInputStyle, flex: 1 }} />
                                <input value={attr.value} onChange={(e) => updateAttribute(i, 'value', e.target.value)} placeholder="Value" style={{ ...formInputStyle, flex: 1 }} />
                                <button onClick={() => removeAttribute(i)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 14 }}>✕</button>
                            </div>
                        ))}
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
                        onClick={handleMint}
                        disabled={loading || !name || !imageUrl}
                        style={{
                            width: '100%', padding: '14px 24px', borderRadius: 12,
                            background: 'linear-gradient(135deg, #9945FF, #14f195)',
                            border: 'none', color: '#fff', fontWeight: 800,
                            fontSize: 15, cursor: loading || !name || !imageUrl ? 'not-allowed' : 'pointer',
                            opacity: loading || !name || !imageUrl ? 0.5 : 1,
                            transition: 'all 0.2s',
                        }}
                    >
                        {loading ? '⏳ Minting...' : '🎨 Mint NFT'}
                    </button>
                </div>
            </div>
        </div>
    );
}

const overlayStyle: React.CSSProperties = {
    position: 'fixed', inset: 0, zIndex: 10000,
    background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
};

const modalStyle: React.CSSProperties = {
    width: 440, maxWidth: '90vw', maxHeight: '85vh', overflow: 'auto',
    background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 16, padding: 24, boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
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
    fontFamily: 'inherit', boxSizing: 'border-box',
};
