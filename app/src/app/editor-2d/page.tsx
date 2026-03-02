'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useProjectStore } from '@/store/projectStore';

const TopBar = dynamic(() => import('@/components/layout/TopBar'), { ssr: false });
const LeftPanel = dynamic(() => import('@/components/layout/LeftPanel'), { ssr: false });
const RightPanel = dynamic(() => import('@/components/layout/RightPanel'), { ssr: false });
const BottomPanel = dynamic(() => import('@/components/layout/BottomPanel'), { ssr: false });

function Canvas2D() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const context = canvas.getContext('2d');
        setCtx(context);

        return () => window.removeEventListener('resize', resize);
    }, []);

    // Draw grid
    useEffect(() => {
        if (!ctx || !canvasRef.current) return;
        const canvas = canvasRef.current;

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Background
            ctx.fillStyle = '#1a1a2a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Grid
            const gridSize = 40;
            ctx.strokeStyle = 'rgba(255,255,255,0.04)';
            ctx.lineWidth = 1;

            for (let x = 0; x <= canvas.width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            }
            for (let y = 0; y <= canvas.height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }

            // Major grid lines
            ctx.strokeStyle = 'rgba(255,255,255,0.08)';
            ctx.lineWidth = 1;
            const majorSize = gridSize * 5;
            for (let x = 0; x <= canvas.width; x += majorSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            }
            for (let y = 0; y <= canvas.height; y += majorSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }

            // Center crosshair
            const cx = canvas.width / 2;
            const cy = canvas.height / 2;

            ctx.strokeStyle = 'rgba(139,92,246,0.3)';
            ctx.lineWidth = 1;
            ctx.setLineDash([6, 4]);
            ctx.beginPath();
            ctx.moveTo(cx, 0);
            ctx.lineTo(cx, canvas.height);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, cy);
            ctx.lineTo(canvas.width, cy);
            ctx.stroke();
            ctx.setLineDash([]);

            // Origin label
            ctx.fillStyle = 'rgba(139,92,246,0.5)';
            ctx.font = '10px Inter, sans-serif';
            ctx.fillText('(0, 0)', cx + 6, cy - 6);

            // Placeholder message
            ctx.fillStyle = 'rgba(255,255,255,0.15)';
            ctx.font = '16px Inter, sans-serif';
            ctx.textAlign = 'center';
            const msg = '2D Canvas Editor — Drag sprites from the Asset Library';
            ctx.fillText(msg, cx, cy + 60);
            ctx.textAlign = 'start';

            requestAnimationFrame(draw);
        };

        const frameId = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(frameId);
    }, [ctx]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                inset: 0,
                zIndex: 0,
            }}
        />
    );
}

export default function Editor2DPage() {
    const projectName = useProjectStore((s) => s.config.name);

    return (
        <div className="editor-layout">
            <Canvas2D />

            {/* 2D Mode Badge */}
            <div style={{
                position: 'absolute',
                top: 72,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 100,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 16px',
                borderRadius: 20,
                background: 'rgba(20,241,149,0.08)',
                border: '1px solid rgba(20,241,149,0.2)',
                fontSize: 11,
                fontWeight: 600,
                color: '#14f195',
                letterSpacing: '0.05em',
            }}>
                🎮 2D Mode {projectName && `— ${projectName}`}
            </div>

            <TopBar />
            <LeftPanel />
            <RightPanel />
            <BottomPanel />
        </div>
    );
}
