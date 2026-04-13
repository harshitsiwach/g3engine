'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useEditor2DStore } from '@/store/editor2DStore';

export default function GameHUD2D() {
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [time, setTime] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        timerRef.current = setInterval(() => {
            setTime((t) => t + 1);
        }, 1000);
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, []);

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m}:${sec.toString().padStart(2, '0')}`;
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '12px 24px', pointerEvents: 'none',
        }}>
            {/* Score */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 16px', borderRadius: 12,
                background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.08)',
            }}>
                <span style={{ fontSize: 20 }}>⭐</span>
                <span style={{ fontSize: 18, fontWeight: 700, color: '#f59e0b', fontFamily: 'monospace' }}>
                    {score}
                </span>
            </div>

            {/* Time */}
            <div style={{
                padding: '8px 16px', borderRadius: 12,
                background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.08)',
                fontSize: 16, fontWeight: 600, color: '#fff', fontFamily: 'monospace',
            }}>
                ⏱ {formatTime(time)}
            </div>

            {/* Lives */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '8px 16px', borderRadius: 12,
                background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.08)',
            }}>
                {Array.from({ length: 3 }, (_, i) => (
                    <span key={i} style={{ fontSize: 18, opacity: i < lives ? 1 : 0.3 }}>
                        ❤️
                    </span>
                ))}
            </div>
        </div>
    );
}
