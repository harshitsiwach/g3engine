'use client';

import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useEditor2DStore, Sprite2D } from '@/store/editor2DStore';

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
        isPlaying, togglePlay,
    } = useEditor2DStore();

    // Drag state
    const [isDragging, setIsDragging] = useState(false);
    const [isPanning, setIsPanning] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [dragSpriteOffset, setDragSpriteOffset] = useState({ x: 0, y: 0 });

    // Game state for play mode
    const keysPressed = useRef<Set<string>>(new Set());
    const gameSprites = useRef<Sprite2D[]>([]);
    const frameCount = useRef(0);
    const animTimers = useRef<Map<string, number>>(new Map());

    // Convert screen coords to world coords
    const screenToWorld = useCallback((sx: number, sy: number) => ({
        x: (sx - camera.x) / camera.zoom,
        y: (sy - camera.y) / camera.zoom,
    }), [camera]);

    // ─── AABB Collision Detection ───
    const checkCollision = useCallback((a: Sprite2D, b: Sprite2D): boolean => {
        const aLeft = a.x - a.width / 2;
        const aRight = a.x + a.width / 2;
        const aTop = a.y - a.height / 2;
        const aBottom = a.y + a.height / 2;
        const bLeft = b.x - b.width / 2;
        const bRight = b.x + b.width / 2;
        const bTop = b.y - b.height / 2;
        const bBottom = b.y + b.height / 2;

        return aLeft < bRight && aRight > bLeft && aTop < bBottom && aBottom > bTop;
    }, []);

    // ─── Physics Step ───
    const physicsStep = useCallback((dt: number) => {
        const store = useEditor2DStore.getState();
        const allSprites = [...store.sprites];

        for (let i = 0; i < allSprites.length; i++) {
            const sp = allSprites[i];
            if (!sp.physics?.enabled || sp.physics.isStatic) continue;

            const phys = sp.physics;
            let { x, y } = sp;
            let vx = phys.velocity.x;
            let vy = phys.velocity.y;

            // Apply gravity
            vy += phys.gravity * dt;

            // Apply friction
            vx *= (1 - phys.friction * dt);

            // Update position
            x += vx * dt;
            y += vy * dt;

            // Boundary collision (game area)
            const halfW = canvasWidth / 2;
            const halfH = canvasHeight / 2;
            const spHalfW = sp.width / 2;
            const spHalfH = sp.height / 2;

            // Floor collision
            if (y + spHalfH > halfH) {
                y = halfH - spHalfH;
                vy = phys.bounce > 0 ? -vy * phys.bounce : 0;
            }
            // Ceiling
            if (y - spHalfH < -halfH) {
                y = -halfH + spHalfH;
                vy = 0;
            }
            // Walls
            if (x + spHalfW > halfW) {
                x = halfW - spHalfW;
                vx = -vx * phys.bounce;
            }
            if (x - spHalfW < -halfW) {
                x = -halfW + spHalfW;
                vx = -vx * phys.bounce;
            }

            // Sprite-to-sprite collision
            for (let j = 0; j < allSprites.length; j++) {
                if (i === j) continue;
                const other = allSprites[j];

                if (checkCollision({ ...sp, x, y }, other)) {
                    if (other.physics?.isStatic && !other.physics.isTrigger) {
                        // Platform collision - resolve from top
                        const overlapTop = (y + spHalfH) - (other.y - other.height / 2);
                        const overlapBottom = (other.y + other.height / 2) - (y - spHalfH);

                        if (overlapTop < overlapBottom && vy > 0) {
                            y = other.y - other.height / 2 - spHalfH;
                            vy = phys.bounce > 0 ? -vy * phys.bounce : 0;
                        } else if (vy < 0) {
                            y = other.y + other.height / 2 + spHalfH;
                            vy = 0;
                        }
                    }
                }
            }

            // Update sprite
            store.updateSprite(sp.id, { x, y, physics: { ...phys, velocity: { x: vx, y: vy } } });
        }
    }, [canvasWidth, canvasHeight, checkCollision]);

    // ─── Animation Step ───
    const animationStep = useCallback((dt: number) => {
        const store = useEditor2DStore.getState();
        for (const sp of store.sprites) {
            if (!sp.animations || !sp.currentAnimation) continue;

            const anim = sp.animations.find((a) => a.name === sp.currentAnimation);
            if (!anim || anim.frames.length === 0) continue;

            let timer = (animTimers.current.get(sp.id) || 0) + dt;
            const frame = sp.currentFrame || 0;
            const frameDuration = anim.frames[frame]?.duration || 200;

            if (timer >= frameDuration) {
                timer = 0;
                let nextFrame = frame + 1;
                if (nextFrame >= anim.frames.length) {
                    nextFrame = anim.loop ? 0 : anim.frames.length - 1;
                }
                store.updateSprite(sp.id, {
                    currentFrame: nextFrame,
                    emoji: anim.frames[nextFrame].emoji,
                });
            }
            animTimers.current.set(sp.id, timer);
        }
    }, []);

    // ─── Game Input Handlers (play mode) ───
    useEffect(() => {
        if (!isPlaying) return;

        const onKeyDown = (e: KeyboardEvent) => {
            keysPressed.current.add(e.key.toLowerCase());

            // Find the player (first sprite with physics enabled and not static)
            const store = useEditor2DStore.getState();
            const player = store.sprites.find((sp) => sp.physics?.enabled && !sp.physics.isStatic);

            if (player && player.physics) {
                const speed = 300;
                const jumpForce = -500;
                let vx = player.physics.velocity.x;
                let vy = player.physics.velocity.y;

                if (e.key === 'ArrowLeft' || e.key === 'a') vx = -speed;
                if (e.key === 'ArrowRight' || e.key === 'd') vx = speed;
                if ((e.key === 'ArrowUp' || e.key === 'w' || e.key === ' ') && Math.abs(vy) < 10) {
                    vy = jumpForce;
                }

                store.updateSprite(player.id, {
                    physics: { ...player.physics, velocity: { x: vx, y: vy } },
                });
            }
        };

        const onKeyUp = (e: KeyboardEvent) => {
            keysPressed.current.delete(e.key.toLowerCase());

            const store = useEditor2DStore.getState();
            const player = store.sprites.find((sp) => sp.physics?.enabled && !sp.physics.isStatic);

            if (player && player.physics) {
                let vx = player.physics.velocity.x;
                if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'ArrowRight' || e.key === 'd') {
                    vx = 0;
                }
                store.updateSprite(player.id, {
                    physics: { ...player.physics, velocity: { x: vx, y: player.physics.velocity.y } },
                });
            }
        };

        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('keyup', onKeyUp);
        };
    }, [isPlaying]);

    // ─── Input Handlers (edit mode) ───
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (isPlaying) return;
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const sx = e.clientX - rect.left;
        const sy = e.clientY - rect.top;
        const world = screenToWorld(sx, sy);

        // Middle-click or alt+click = pan
        if (e.button === 1 || (e.button === 0 && e.altKey)) {
            setIsPanning(true);
            setDragStart({ x: e.clientX, y: e.clientY });
            return;
        }

        if (activeTool === 'select' || activeTool === 'move') {
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
            selectSprite(null);
        }
    }, [isPlaying, activeTool, sprites, layers, screenToWorld, selectSprite]);

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

            const store = useEditor2DStore.getState();
            const snap = store.snapToGrid;
            const grid = store.gridSize;

            let nx = world.x - dragSpriteOffset.x;
            let ny = world.y - dragSpriteOffset.y;

            if (snap) {
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
        zoomCamera(camera.zoom * delta);
    }, [camera.zoom, zoomCamera]);

    // ─── Keyboard shortcuts (edit mode) ───
    useEffect(() => {
        if (isPlaying) return;

        const handleKey = (e: KeyboardEvent) => {
            if ((e.target as HTMLElement).tagName === 'INPUT') return;
            const store = useEditor2DStore.getState();
            switch (e.key.toLowerCase()) {
                case 'v': store.setTool('select'); break;
                case 'g': store.setTool('move'); break;
                case 'b': store.setTool('draw'); break;
                case 'e': store.setTool('erase'); break;
                case 'u': store.setTool('shape'); break;
                case 't': store.setTool('text'); break;
                case 'delete': case 'backspace':
                    if (store.selectedSpriteId) store.removeSprite(store.selectedSpriteId);
                    break;
                case 'z':
                    if (e.metaKey || e.ctrlKey) {
                        if (e.shiftKey) store.redo(); else store.undo();
                    }
                    break;
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [isPlaying]);

    // ─── Render Loop ───
    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let frameId: number;
        let lastTime = performance.now();

        const render = () => {
            const now = performance.now();
            const dt = Math.min((now - lastTime) / 1000, 0.05); // cap at 50ms
            lastTime = now;
            frameCount.current++;

            const { width: cw, height: ch } = container.getBoundingClientRect();
            canvas.width = cw;
            canvas.height = ch;

            // Read current state
            const store = useEditor2DStore.getState();
            const cam = store.camera;
            const allSprites = store.sprites;
            const allLayers = store.layers;
            const selId = store.selectedSpriteId;
            const grid = store.gridSize;
            const showGridState = store.showGrid;
            const gameW = store.canvasWidth;
            const gameH = store.canvasHeight;
            const playing = store.isPlaying;

            // ─ Game Logic (play mode) ─
            if (playing) {
                physicsStep(dt * 60);
                animationStep(dt * 1000);
            }

            // ─ Clear ─
            ctx.fillStyle = '#12121c';
            ctx.fillRect(0, 0, cw, ch);

            ctx.save();
            ctx.translate(cam.x, cam.y);
            ctx.scale(cam.zoom, cam.zoom);

            // ─ Game Area ─
            const halfW = gameW / 2;
            const halfH = gameH / 2;

            ctx.fillStyle = '#1a1a2e';
            ctx.fillRect(-halfW, -halfH, gameW, gameH);

            // Game border
            ctx.strokeStyle = 'rgba(20,241,149,0.3)';
            ctx.lineWidth = 2 / cam.zoom;
            ctx.setLineDash([8 / cam.zoom, 4 / cam.zoom]);
            ctx.strokeRect(-halfW, -halfH, gameW, gameH);
            ctx.setLineDash([]);

            // ─ Grid ─
            if (showGridState && !playing) {
                ctx.strokeStyle = 'rgba(255,255,255,0.03)';
                ctx.lineWidth = 1 / cam.zoom;

                const startX = Math.floor(-halfW / grid) * grid;
                const endX = Math.ceil(halfW / grid) * grid;
                const startY = Math.floor(-halfH / grid) * grid;
                const endY = Math.ceil(halfH / grid) * grid;

                for (let x = startX; x <= endX; x += grid) {
                    ctx.beginPath(); ctx.moveTo(x, -halfH); ctx.lineTo(x, halfH); ctx.stroke();
                }
                for (let y = startY; y <= endY; y += grid) {
                    ctx.beginPath(); ctx.moveTo(-halfW, y); ctx.lineTo(halfW, y); ctx.stroke();
                }

                // Origin lines
                ctx.strokeStyle = 'rgba(20,241,149,0.12)';
                ctx.lineWidth = 1 / cam.zoom;
                ctx.beginPath(); ctx.moveTo(-halfW, 0); ctx.lineTo(halfW, 0); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(0, -halfH); ctx.lineTo(0, halfH); ctx.stroke();
            }

            // ─ Sprites ─
            const currentSprites = store.sprites;
            const visibleLayers = allLayers
                .filter((l) => l.visible)
                .sort((a, b) => a.order - b.order);

            for (const layer of visibleLayers) {
                const layerSprites = currentSprites.filter((sp) => sp.layerId === layer.id && sp.visible);

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

                    // Selection outline (edit mode only)
                    if (!playing && sp.id === selId) {
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

                        // Physics velocity debug
                        if (sp.physics?.enabled) {
                            ctx.strokeStyle = '#f59e0b';
                            ctx.lineWidth = 1 / cam.zoom;
                            ctx.beginPath();
                            ctx.moveTo(0, 0);
                            ctx.lineTo(sp.physics.velocity.x / 20, sp.physics.velocity.y / 20);
                            ctx.stroke();
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
            if (!playing) {
                const screenOrigin = {
                    x: -halfW * cam.zoom + cam.x,
                    y: -halfH * cam.zoom + cam.y,
                };
                ctx.fillStyle = 'rgba(20,241,149,0.5)';
                ctx.font = '10px Inter, sans-serif';
                ctx.fillText(`${gameW}×${gameH}`, screenOrigin.x, screenOrigin.y - 6);
            }

            frameId = requestAnimationFrame(render);
        };

        frameId = requestAnimationFrame(render);
        return () => cancelAnimationFrame(frameId);
    }, [isPlaying, physicsStep, animationStep]);

    return (
        <div ref={containerRef} style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
            <canvas
                ref={canvasRef}
                style={{
                    display: 'block', width: '100%', height: '100%',
                    cursor: isPanning ? 'grabbing' : activeTool === 'move' ? 'move' : 'default',
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
            />
        </div>
    );
}
