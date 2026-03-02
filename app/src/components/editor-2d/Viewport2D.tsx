'use client';

import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useEditor2DStore } from '@/store/editor2DStore';

export default function Viewport2D() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const {
        sprites, selectedSpriteId, selectSprite, updateSprite, pushHistory,
        layers,
        camera, panCamera, zoomCamera,
        activeTool,
        showGrid, gridSize,
        canvasWidth, canvasHeight,
    } = useEditor2DStore();

    // Drag state
    const [isDragging, setIsDragging] = useState(false);
    const [isPanning, setIsPanning] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [dragSpriteOffset, setDragSpriteOffset] = useState({ x: 0, y: 0 });

    // Convert screen coords to world coords
    const screenToWorld = useCallback((sx: number, sy: number) => {
        return {
            x: (sx - camera.x) / camera.zoom,
            y: (sy - camera.y) / camera.zoom,
        };
    }, [camera]);

    // Convert world coords to screen coords
    const worldToScreen = useCallback((wx: number, wy: number) => {
        return {
            x: wx * camera.zoom + camera.x,
            y: wy * camera.zoom + camera.y,
        };
    }, [camera]);

    // ─── Input Handlers ───

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const sx = e.clientX - rect.left;
        const sy = e.clientY - rect.top;
        const world = screenToWorld(sx, sy);

        // Middle-click or space+click = pan
        if (e.button === 1 || (e.button === 0 && e.altKey)) {
            setIsPanning(true);
            setDragStart({ x: e.clientX, y: e.clientY });
            return;
        }

        if (activeTool === 'select' || activeTool === 'move') {
            // Hit-test sprites (reverse order = top first)
            const visibleLayers = new Set(layers.filter(l => l.visible).map(l => l.id));
            const lockedLayers = new Set(layers.filter(l => l.locked).map(l => l.id));

            for (let i = sprites.length - 1; i >= 0; i--) {
                const sp = sprites[i];
                if (!sp.visible || !visibleLayers.has(sp.layerId) || lockedLayers.has(sp.layerId)) continue;

                if (
                    world.x >= sp.x - sp.width / 2 &&
                    world.x <= sp.x + sp.width / 2 &&
                    world.y >= sp.y - sp.height / 2 &&
                    world.y <= sp.y + sp.height / 2
                ) {
                    selectSprite(sp.id);
                    setIsDragging(true);
                    setDragStart({ x: e.clientX, y: e.clientY });
                    setDragSpriteOffset({ x: world.x - sp.x, y: world.y - sp.y });
                    return;
                }
            }

            // Clicked on empty space
            selectSprite(null);
        }
    }, [activeTool, sprites, layers, screenToWorld, selectSprite]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (isPanning) {
            const dx = e.clientX - dragStart.x;
            const dy = e.clientY - dragStart.y;
            panCamera(dx, dy);
            setDragStart({ x: e.clientX, y: e.clientY });
            return;
        }

        if (isDragging && selectedSpriteId) {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();
            const sx = e.clientX - rect.left;
            const sy = e.clientY - rect.top;
            const world = screenToWorld(sx, sy);

            const snapToGrid = useEditor2DStore.getState().snapToGrid;
            const grid = useEditor2DStore.getState().gridSize;

            let nx = world.x - dragSpriteOffset.x;
            let ny = world.y - dragSpriteOffset.y;

            if (snapToGrid) {
                nx = Math.round(nx / grid) * grid;
                ny = Math.round(ny / grid) * grid;
            }

            updateSprite(selectedSpriteId, { x: nx, y: ny });
        }
    }, [isPanning, isDragging, selectedSpriteId, dragStart, dragSpriteOffset, panCamera, screenToWorld, updateSprite]);

    const handleMouseUp = useCallback(() => {
        if (isDragging) pushHistory();
        setIsDragging(false);
        setIsPanning(false);
    }, [isDragging, pushHistory]);

    const handleWheel = useCallback((e: React.WheelEvent) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        const newZoom = camera.zoom * delta;
        zoomCamera(newZoom);
    }, [camera.zoom, zoomCamera]);

    // ─── Keyboard shortcuts ───

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            const store = useEditor2DStore.getState();
            switch (e.key.toLowerCase()) {
                case 'v': store.setTool('select'); break;
                case 'g': store.setTool('move'); break;
                case 'b': store.setTool('draw'); break;
                case 'e': store.setTool('erase'); break;
                case 'u': store.setTool('shape'); break;
                case 't': store.setTool('text'); break;
                case 'delete':
                case 'backspace':
                    if (store.selectedSpriteId) {
                        store.removeSprite(store.selectedSpriteId);
                    }
                    break;
                case 'z':
                    if (e.metaKey || e.ctrlKey) {
                        if (e.shiftKey) store.redo();
                        else store.undo();
                    }
                    break;
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, []);

    // ─── Render Loop ───

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let frameId: number;

        const render = () => {
            const { width: cw, height: ch } = container.getBoundingClientRect();
            canvas.width = cw;
            canvas.height = ch;

            const cam = useEditor2DStore.getState().camera;
            const allSprites = useEditor2DStore.getState().sprites;
            const allLayers = useEditor2DStore.getState().layers;
            const selId = useEditor2DStore.getState().selectedSpriteId;
            const grid = useEditor2DStore.getState().gridSize;
            const showGridState = useEditor2DStore.getState().showGrid;
            const gameW = useEditor2DStore.getState().canvasWidth;
            const gameH = useEditor2DStore.getState().canvasHeight;

            // ─ Clear ─
            ctx.fillStyle = '#12121c';
            ctx.fillRect(0, 0, cw, ch);

            ctx.save();
            ctx.translate(cam.x, cam.y);
            ctx.scale(cam.zoom, cam.zoom);

            // ─ Game Area ─
            const halfW = gameW / 2;
            const halfH = gameH / 2;

            // Game bg
            ctx.fillStyle = '#1a1a2e';
            ctx.fillRect(-halfW, -halfH, gameW, gameH);

            // Game border
            ctx.strokeStyle = 'rgba(20,241,149,0.3)';
            ctx.lineWidth = 2 / cam.zoom;
            ctx.setLineDash([8 / cam.zoom, 4 / cam.zoom]);
            ctx.strokeRect(-halfW, -halfH, gameW, gameH);
            ctx.setLineDash([]);

            // ─ Grid ─
            if (showGridState) {
                ctx.strokeStyle = 'rgba(255,255,255,0.03)';
                ctx.lineWidth = 1 / cam.zoom;

                const startX = Math.floor(-halfW / grid) * grid;
                const endX = Math.ceil(halfW / grid) * grid;
                const startY = Math.floor(-halfH / grid) * grid;
                const endY = Math.ceil(halfH / grid) * grid;

                for (let x = startX; x <= endX; x += grid) {
                    ctx.beginPath();
                    ctx.moveTo(x, -halfH);
                    ctx.lineTo(x, halfH);
                    ctx.stroke();
                }
                for (let y = startY; y <= endY; y += grid) {
                    ctx.beginPath();
                    ctx.moveTo(-halfW, y);
                    ctx.lineTo(halfW, y);
                    ctx.stroke();
                }

                // Origin lines
                ctx.strokeStyle = 'rgba(20,241,149,0.12)';
                ctx.lineWidth = 1 / cam.zoom;
                ctx.beginPath(); ctx.moveTo(-halfW, 0); ctx.lineTo(halfW, 0); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(0, -halfH); ctx.lineTo(0, halfH); ctx.stroke();
            }

            // ─ Sprites ─
            const visibleLayers = allLayers
                .filter((l) => l.visible)
                .sort((a, b) => a.order - b.order);

            for (const layer of visibleLayers) {
                const layerSprites = allSprites.filter((sp) => sp.layerId === layer.id && sp.visible);

                for (const sp of layerSprites) {
                    ctx.save();
                    ctx.globalAlpha = sp.opacity * layer.opacity;
                    ctx.translate(sp.x, sp.y);
                    ctx.rotate((sp.rotation * Math.PI) / 180);
                    ctx.scale(sp.scaleX, sp.scaleY);

                    const hw = sp.width / 2;
                    const hh = sp.height / 2;

                    // Fill
                    if (sp.fillColor && sp.fillColor !== 'transparent') {
                        ctx.fillStyle = sp.fillColor;
                        ctx.beginPath();
                        if (sp.shapeType === 'circle') {
                            ctx.ellipse(0, 0, hw, hh, 0, 0, Math.PI * 2);
                        } else {
                            ctx.roundRect(-hw, -hh, sp.width, sp.height, sp.cornerRadius || 0);
                        }
                        ctx.fill();
                    }

                    // Stroke
                    if (sp.strokeWidth > 0 && sp.strokeColor !== 'transparent') {
                        ctx.strokeStyle = sp.strokeColor;
                        ctx.lineWidth = sp.strokeWidth / cam.zoom;
                        ctx.stroke();
                    }

                    // Emoji
                    if (sp.emoji) {
                        const emojiSize = Math.min(sp.width, sp.height) * 0.7;
                        ctx.font = `${emojiSize}px serif`;
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillText(sp.emoji, 0, 2);
                    }

                    // Text
                    if (sp.type === 'text' && sp.text) {
                        ctx.fillStyle = sp.fillColor || '#f0f0f5';
                        ctx.font = `${sp.fontSize || 16}px ${sp.fontFamily || 'Inter, sans-serif'}`;
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillText(sp.text, 0, 0);
                    }

                    ctx.restore();

                    // Selection outline
                    if (sp.id === selId) {
                        ctx.save();
                        ctx.translate(sp.x, sp.y);
                        ctx.rotate((sp.rotation * Math.PI) / 180);

                        ctx.strokeStyle = '#14f195';
                        ctx.lineWidth = 2 / cam.zoom;
                        ctx.setLineDash([6 / cam.zoom, 3 / cam.zoom]);
                        ctx.strokeRect(-hw - 2, -hh - 2, sp.width + 4, sp.height + 4);
                        ctx.setLineDash([]);

                        // Corner handles
                        const handleSize = 6 / cam.zoom;
                        ctx.fillStyle = '#14f195';
                        const corners = [
                            [-hw - 2, -hh - 2], [hw + 2, -hh - 2],
                            [-hw - 2, hh + 2], [hw + 2, hh + 2],
                        ];
                        for (const [cx, cy] of corners) {
                            ctx.fillRect(cx - handleSize / 2, cy - handleSize / 2, handleSize, handleSize);
                        }

                        ctx.restore();
                    }
                }
            }

            // ─ Origin marker ─
            ctx.fillStyle = 'rgba(20,241,149,0.4)';
            ctx.font = `${10 / cam.zoom}px Inter, sans-serif`;
            ctx.fillText('(0,0)', 4 / cam.zoom, -4 / cam.zoom);

            ctx.restore();

            // ─ HUD: Game canvas label ─
            const screenOrigin = {
                x: -halfW * cam.zoom + cam.x,
                y: -halfH * cam.zoom + cam.y,
            };
            ctx.fillStyle = 'rgba(20,241,149,0.5)';
            ctx.font = '10px Inter, sans-serif';
            ctx.fillText(`${gameW}×${gameH}`, screenOrigin.x, screenOrigin.y - 6);

            frameId = requestAnimationFrame(render);
        };

        frameId = requestAnimationFrame(render);
        return () => cancelAnimationFrame(frameId);
    }, []);

    return (
        <div
            ref={containerRef}
            style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}
        >
            <canvas
                ref={canvasRef}
                style={{ display: 'block', width: '100%', height: '100%', cursor: isPanning ? 'grabbing' : activeTool === 'move' ? 'move' : 'default' }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
            />
        </div>
    );
}
