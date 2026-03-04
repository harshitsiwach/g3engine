'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAIStore } from '@/store/aiStore';
import { parseAIResponse, executeCommands } from '@/lib/gameGenerator';

// ─── Quick Prompts ───

const QUICK_PROMPTS = [
    { icon: '🏃', label: 'Platformer', prompt: 'Build a 3D platformer with a player, ground, 3 floating platforms, and collectible coins' },
    { icon: '🚀', label: 'Space Shooter', prompt: 'Build a space shooter scene with a spaceship, asteroids, and stars' },
    { icon: '🧩', label: 'Puzzle', prompt: 'Build a colorful 3D puzzle scene with different shaped blocks arranged as a challenge' },
    { icon: '🏰', label: 'RPG Scene', prompt: 'Build a medieval RPG scene with a castle tower, trees, a bridge, and torches' },
    { icon: '🎮', label: 'Arcade', prompt: 'Build a retro arcade game scene with a paddle, ball, and brick wall' },
    { icon: '🪙', label: 'Web3 Game', prompt: 'Build a token-gated treasure room with glowing chests and enable Web3 features' },
];

export default function AIChatPanel() {
    const {
        messages, isLoading, error, apiKey, isOpen,
        addMessage, setLoading, setError, setApiKey, clearChat,
    } = useAIStore();

    const [input, setInput] = useState('');
    const [showSettings, setShowSettings] = useState(false);
    const [tempKey, setTempKey] = useState(apiKey);
    const [buildLog, setBuildLog] = useState<string[]>([]);
    const [hasServerKey, setHasServerKey] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Check if server has an API key configured
    useEffect(() => {
        fetch('/api/ai/status')
            .then((r) => r.json())
            .then((d) => setHasServerKey(d.hasServerKey))
            .catch(() => { });
    }, []);

    // Auto-scroll on new messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, buildLog]);

    if (!isOpen) return null;

    const sendMessage = async (text: string) => {
        if (!text.trim()) return;
        if (!apiKey && !hasServerKey) {
            setShowSettings(true);
            setError('No API key available. Set your own key, or ask the project owner to configure one on the server.');
            return;
        }

        const userMsg = text.trim();
        addMessage('user', userMsg);
        setInput('');
        setLoading(true);
        setError(null);
        setBuildLog([]);

        try {
            const allMessages = [
                ...useAIStore.getState().messages.filter((m) => m.role !== 'system'),
            ];

            const res = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: allMessages.slice(-10), // last 10 for context window
                    apiKey,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'API request failed');
            }

            const { commands, plainText } = parseAIResponse(data.content);

            // Add AI response
            addMessage('assistant', data.content);

            // Execute commands if any
            if (commands.length > 0) {
                const log = executeCommands(commands, '3d');
                setBuildLog(log);
            }
        } catch (err: any) {
            setError(err.message);
            addMessage('assistant', `❌ Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={panelStyle}>
            {/* Header */}
            <div style={headerStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                        width: 28, height: 28, borderRadius: 8,
                        background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 14,
                    }}>✨</div>
                    <span style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>AI Assistant</span>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                    <button onClick={() => setShowSettings(!showSettings)} style={iconBtnStyle} title="Settings">⚙️</button>
                    <button onClick={clearChat} style={iconBtnStyle} title="Clear chat">🗑️</button>
                    <button onClick={() => useAIStore.getState().toggleOpen()} style={iconBtnStyle} title="Close">✕</button>
                </div>
            </div>

            {/* Settings Drawer */}
            {showSettings && (
                <div style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    background: 'rgba(255,255,255,0.02)',
                }}>
                    {hasServerKey && (
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            padding: '8px 10px', borderRadius: 6, marginBottom: 8,
                            background: 'rgba(20,241,149,0.08)',
                            border: '1px solid rgba(20,241,149,0.15)',
                        }}>
                            <span style={{ color: '#14f195', fontSize: 14 }}>✓</span>
                            <span style={{ fontSize: 11, color: '#14f195', fontWeight: 600 }}>Server API key active — AI is free to use!</span>
                        </div>
                    )}
                    <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                        {hasServerKey ? 'Override with your own key (optional)' : 'OpenAI API Key'}
                    </label>
                    <div style={{ display: 'flex', gap: 6 }}>
                        <input
                            type="password"
                            value={tempKey}
                            onChange={(e) => setTempKey(e.target.value)}
                            placeholder="sk-..."
                            style={{
                                flex: 1, padding: '8px 10px', borderRadius: 6,
                                border: '1px solid rgba(255,255,255,0.1)',
                                background: 'rgba(255,255,255,0.04)',
                                color: '#fff', fontSize: 12, outline: 'none', fontFamily: 'monospace',
                            }}
                        />
                        <button
                            onClick={() => { setApiKey(tempKey); setShowSettings(false); }}
                            style={{
                                padding: '8px 14px', borderRadius: 6,
                                background: '#8b5cf6', border: 'none',
                                color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                            }}
                        >Save</button>
                    </div>
                    <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 6 }}>
                        {hasServerKey
                            ? 'Your own key overrides the server key. Leave empty to use the free server key.'
                            : 'Key is stored locally in your browser.'}
                    </p>
                </div>
            )}

            {/* Messages */}
            <div ref={scrollRef} style={messagesStyle}>
                {messages.length === 0 && (
                    <div style={{ padding: '20px 16px', textAlign: 'center' }}>
                        <div style={{ fontSize: 40, marginBottom: 12 }}>🎮</div>
                        <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>
                            Build games with AI
                        </p>
                        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
                            Describe what you want and I'll build it in the editor
                        </p>

                        {/* Quick Prompts */}
                        <div style={{
                            display: 'grid', gridTemplateColumns: '1fr 1fr',
                            gap: 8, marginTop: 16,
                        }}>
                            {QUICK_PROMPTS.map((qp) => (
                                <button
                                    key={qp.label}
                                    onClick={() => sendMessage(qp.prompt)}
                                    style={quickPromptStyle}
                                >
                                    <span style={{ fontSize: 20 }}>{qp.icon}</span>
                                    <span style={{ fontSize: 11, fontWeight: 600, color: '#fff' }}>{qp.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {messages.map((msg) => (
                    <div key={msg.id} style={{
                        padding: '8px 16px',
                        display: 'flex',
                        justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    }}>
                        <div style={{
                            maxWidth: '85%',
                            padding: '10px 14px',
                            borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                            background: msg.role === 'user'
                                ? 'linear-gradient(135deg, #8b5cf6, #6d28d9)'
                                : 'rgba(255,255,255,0.06)',
                            fontSize: 13,
                            color: '#fff',
                            lineHeight: 1.5,
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                        }}>
                            {renderMessageContent(msg.content)}
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div style={{ padding: '8px 16px', display: 'flex', justifyContent: 'flex-start' }}>
                        <div style={{
                            padding: '10px 18px', borderRadius: '14px 14px 14px 4px',
                            background: 'rgba(255,255,255,0.06)', fontSize: 13,
                        }}>
                            <span className="ai-typing">✨ Building</span>
                            <style>{`
                .ai-typing::after {
                  content: '';
                  animation: dots 1.5s infinite;
                }
                @keyframes dots {
                  0% { content: ''; }
                  25% { content: '.'; }
                  50% { content: '..'; }
                  75% { content: '...'; }
                }
              `}</style>
                        </div>
                    </div>
                )}

                {/* Build Log */}
                {buildLog.length > 0 && (
                    <div style={{
                        margin: '8px 16px', padding: '10px 12px', borderRadius: 8,
                        background: 'rgba(20,241,149,0.06)',
                        border: '1px solid rgba(20,241,149,0.15)',
                    }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: '#14f195', marginBottom: 4, textTransform: 'uppercase' }}>
                            Build Log
                        </div>
                        {buildLog.map((l, i) => (
                            <div key={i} style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{l}</div>
                        ))}
                    </div>
                )}

                {error && !messages.some((m) => m.content.includes(error)) && (
                    <div style={{
                        margin: '8px 16px', padding: '8px 12px', borderRadius: 6,
                        background: 'rgba(239,68,68,0.1)', fontSize: 12, color: '#ef4444',
                    }}>
                        {error}
                    </div>
                )}
            </div>

            {/* Input */}
            <div style={inputBarStyle}>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage(input);
                        }
                    }}
                    placeholder={apiKey || hasServerKey ? 'Describe what to build...' : 'Set API key in ⚙️ first'}
                    disabled={isLoading}
                    style={{
                        flex: 1, padding: '10px 12px', borderRadius: 10,
                        border: '1px solid rgba(255,255,255,0.1)',
                        background: 'rgba(255,255,255,0.04)',
                        color: '#fff', fontSize: 13, outline: 'none',
                        fontFamily: 'inherit',
                        opacity: isLoading ? 0.5 : 1,
                    }}
                />
                <button
                    onClick={() => sendMessage(input)}
                    disabled={isLoading || !input.trim()}
                    style={{
                        width: 38, height: 38, borderRadius: 10,
                        background: input.trim() && !isLoading
                            ? 'linear-gradient(135deg, #8b5cf6, #ec4899)'
                            : 'rgba(255,255,255,0.06)',
                        border: 'none',
                        color: '#fff', fontSize: 16,
                        cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s',
                    }}
                >
                    ↑
                </button>
            </div>
        </div>
    );
}

// ─── Helpers ───

function renderMessageContent(content: string) {
    // Remove JSON blocks for display
    const clean = content.replace(/```json[\s\S]*?```/g, '');
    const trimmed = clean.trim();
    if (!trimmed) return <span style={{ color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>🛠️ Building your game...</span>;
    return trimmed;
}

// ─── Styles ───

const panelStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: 16, right: 16,
    width: 380, height: 520,
    maxHeight: 'calc(100vh - 80px)',
    borderRadius: 16,
    background: 'rgba(15,15,22,0.97)',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(139,92,246,0.1)',
    display: 'flex', flexDirection: 'column',
    zIndex: 100,
    backdropFilter: 'blur(20px)',
    overflow: 'hidden',
    animation: 'aiPanelIn 0.25s ease-out',
};

const headerStyle: React.CSSProperties = {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '12px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
};

const messagesStyle: React.CSSProperties = {
    flex: 1, overflow: 'auto',
    paddingTop: 8, paddingBottom: 8,
};

const inputBarStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '12px 12px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
};

const iconBtnStyle: React.CSSProperties = {
    width: 28, height: 28, borderRadius: 6,
    border: 'none', background: 'transparent',
    color: 'rgba(255,255,255,0.4)', fontSize: 14,
    cursor: 'pointer', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
};

const quickPromptStyle: React.CSSProperties = {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    gap: 6, padding: '12px 8px', borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.06)',
    background: 'rgba(255,255,255,0.02)',
    cursor: 'pointer', transition: 'all 0.2s',
};
