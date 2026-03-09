'use client';

import React, { useRef, useCallback, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import {
    OrbitControls,
    TransformControls,
    Grid,
    GizmoHelper,
    GizmoViewport,
    ContactShadows,
} from '@react-three/drei';
import * as THREE from 'three';
import { useEditorStore, SceneObject, ObjectType } from '@/store/editorStore';

// ---------- Scene Object Renderer ----------

function SceneMesh({ obj }: { obj: SceneObject }) {
    const meshRef = useRef<THREE.Mesh>(null!);
    const { selectedObjectId, selectObject, isPlaying } = useEditorStore();
    const isSelected = selectedObjectId === obj.id;

    const handleClick = useCallback(
        (e: any) => {
            e.stopPropagation();
            if (!isPlaying) selectObject(obj.id);
        },
        [obj.id, selectObject, isPlaying]
    );

    const geometry = (() => {
        switch (obj.type) {
            case 'box': return <boxGeometry args={[1, 1, 1]} />;
            case 'sphere': return <sphereGeometry args={[0.5, 32, 32]} />;
            case 'cylinder': return <cylinderGeometry args={[0.5, 0.5, 1, 32]} />;
            case 'plane': return <planeGeometry args={[1, 1]} />;
            case 'cone': return <coneGeometry args={[0.5, 1, 32]} />;
            case 'torus': return <torusGeometry args={[0.4, 0.15, 16, 48]} />;
            default: return <boxGeometry args={[1, 1, 1]} />;
        }
    })();

    return (
        <mesh
            ref={meshRef}
            name={obj.name}
            position={[obj.position.x, obj.position.y, obj.position.z]}
            rotation={[obj.rotation.x, obj.rotation.y, obj.rotation.z]}
            scale={[obj.scale.x, obj.scale.y, obj.scale.z]}
            onClick={handleClick}
            visible={obj.visible}
        >
            {geometry}
            <meshStandardMaterial
                color={obj.material.color}
                roughness={obj.material.roughness}
                metalness={obj.material.metalness}
                emissive={obj.material.emissive || '#000000'}
                emissiveIntensity={obj.material.emissiveIntensity || 0}
                transparent={obj.material.transparent}
                opacity={obj.material.opacity ?? 1}
            />
        </mesh>
    );
}

// ---------- Light Renderer ----------

function SceneLight({ obj }: { obj: SceneObject }) {
    const intensity = obj.lightIntensity || 1;
    const color = obj.lightColor || '#ffffff';
    const pos: [number, number, number] = [obj.position.x, obj.position.y, obj.position.z];

    const { selectObject, selectedObjectId, isPlaying } = useEditorStore();

    const handleClick = useCallback(
        (e: any) => {
            e.stopPropagation();
            if (!isPlaying) selectObject(obj.id);
        },
        [obj.id, selectObject, isPlaying]
    );

    switch (obj.type) {
        case 'pointLight':
            return (
                <group position={pos} onClick={handleClick}>
                    <pointLight intensity={intensity} color={color} castShadow />
                    {!isPlaying && (
                        <mesh>
                            <sphereGeometry args={[0.1, 8, 8]} />
                            <meshBasicMaterial color={color} wireframe />
                        </mesh>
                    )}
                </group>
            );
        case 'directionalLight':
            return (
                <group position={pos} onClick={handleClick}>
                    <directionalLight intensity={intensity} color={color} castShadow />
                    {!isPlaying && (
                        <mesh>
                            <boxGeometry args={[0.15, 0.15, 0.15]} />
                            <meshBasicMaterial color={color} wireframe />
                        </mesh>
                    )}
                </group>
            );
        case 'ambientLight':
            return <ambientLight intensity={intensity} color={color} />;
        default:
            return null;
    }
}

// ---------- Transform Gizmo ----------

function TransformGizmo() {
    const { objects, selectedObjectId, transformMode, updateTransform, pushHistory } = useEditorStore();
    const selected = objects.find((o) => o.id === selectedObjectId);
    const controlsRef = useRef<any>(null);

    useEffect(() => {
        if (!controlsRef.current) return;
        const controls = controlsRef.current;
        const onDragEnd = () => {
            if (!selected) return;
            const obj = controls.object;
            if (!obj) return;
            updateTransform(selected.id, 'position', {
                x: obj.position.x,
                y: obj.position.y,
                z: obj.position.z,
            });
            updateTransform(selected.id, 'rotation', {
                x: obj.rotation.x,
                y: obj.rotation.y,
                z: obj.rotation.z,
            });
            updateTransform(selected.id, 'scale', {
                x: obj.scale.x,
                y: obj.scale.y,
                z: obj.scale.z,
            });
            pushHistory();
        };
        controls.addEventListener('dragging-changed', (event: any) => {
            if (!event.value) onDragEnd();
        });
    }, [selected, updateTransform, pushHistory]);

    if (!selected || selected.type.includes('Light') || selected.type === 'camera') return null;

    return (
        <TransformControls
            ref={controlsRef}
            mode={transformMode}
            position={[selected.position.x, selected.position.y, selected.position.z]}
            rotation={[selected.rotation.x, selected.rotation.y, selected.rotation.z]}
            scale={[selected.scale.x, selected.scale.y, selected.scale.z]}
        >
            <mesh visible={false}>
                <boxGeometry args={[0.001, 0.001, 0.001]} />
            </mesh>
        </TransformControls>
    );
}

// ---------- Scene Background ----------

function SceneSetup() {
    const { scene, gl } = useThree();
    useEffect(() => {
        scene.background = new THREE.Color('#1e1e2e');
        gl.setClearColor('#1e1e2e', 1);
    }, [scene, gl]);
    return null;
}

// ---------- Keyboard Shortcuts ----------

function KeyboardHandler() {
    const { setTransformMode, undo, redo, togglePlay, removeObject, selectedObjectId, duplicateObject } = useEditorStore();
    const { gl } = useThree();

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            // Ignore if typing in an input
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

            switch (e.key.toLowerCase()) {
                case 'w': setTransformMode('translate'); break;
                case 'e': setTransformMode('rotate'); break;
                case 'r': setTransformMode('scale'); break;
                case ' ':
                    e.preventDefault();
                    togglePlay();
                    break;
                case 'delete':
                case 'backspace':
                    if (selectedObjectId) removeObject(selectedObjectId);
                    break;
                case 'd':
                    if ((e.metaKey || e.ctrlKey) && selectedObjectId) {
                        e.preventDefault();
                        duplicateObject(selectedObjectId);
                    }
                    break;
                case 'z':
                    if (e.metaKey || e.ctrlKey) {
                        e.preventDefault();
                        if (e.shiftKey) redo();
                        else undo();
                    }
                    break;
            }
        };

        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [setTransformMode, undo, redo, togglePlay, removeObject, selectedObjectId, duplicateObject]);

    return null;
}

// ---------- Game Logic Runner (Endless Runner) ----------

function GameLogicRunner() {
    const { isPlaying } = useEditorStore();
    const { scene, camera } = useThree();
    
    const keys = useRef({ a: false, d: false, arrowleft: false, arrowright: false });
    const initialPositions = useRef<Record<string, THREE.Vector3>>({});
    const initialCamera = useRef<{ pos: THREE.Vector3, rot: THREE.Euler } | null>(null);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            const k = e.key.toLowerCase();
            if (keys.current.hasOwnProperty(k)) (keys.current as any)[k] = true;
        };
        const onKeyUp = (e: KeyboardEvent) => {
            const k = e.key.toLowerCase();
            if (keys.current.hasOwnProperty(k)) (keys.current as any)[k] = false;
        };
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('keyup', onKeyUp);
        };
    }, []);

    useEffect(() => {
        if (isPlaying) {
            // Save initial positions right as play mode begins
            initialPositions.current = {};
            scene.traverse((obj) => {
                if (obj.name && obj.type === 'Mesh') {
                    initialPositions.current[obj.uuid] = obj.position.clone();
                    if (obj.name.startsWith('Coin')) obj.visible = true; // Ensure visibility
                }
            });
            initialCamera.current = { pos: camera.position.clone(), rot: camera.rotation.clone() };
        } else {
            // Restore positions
            scene.traverse((obj) => {
                if (obj.name && initialPositions.current[obj.uuid]) {
                    obj.position.copy(initialPositions.current[obj.uuid]);
                    if (obj.name.startsWith('Coin')) obj.visible = true; 
                }
            });
            if (initialCamera.current) {
                camera.position.copy(initialCamera.current.pos);
                camera.rotation.copy(initialCamera.current.rot);
            }
        }
    }, [isPlaying, scene, camera]);

    useFrame((state, delta) => {
        if (!isPlaying) return;

        const player = scene.children.find(c => c.name === 'Player') as THREE.Mesh;
        if (!player) return; // Not an endless runner scene if there's no "Player"

        // 1. Move player forward automatically continuously
        const speed = 12;
        player.position.z -= speed * delta;

        // 2. Handle Left/Right movement
        const sideSpeed = 10;
        if (keys.current.a || keys.current.arrowleft) {
            player.position.x -= sideSpeed * delta;
        }
        if (keys.current.d || keys.current.arrowright) {
            player.position.x += sideSpeed * delta;
        }
        player.position.x = THREE.MathUtils.clamp(player.position.x, -2.5, 2.5);

        // 3. Spin coins & check for collection
        const coins = scene.children.filter(c => c.name.startsWith('Coin')) as THREE.Mesh[];
        coins.forEach(coin => {
            coin.rotation.y += 3 * delta;
            coin.rotation.x += 1 * delta;
            
            // Collect logic
            if (coin.visible) {
                const dist = player.position.distanceTo(coin.position);
                if (dist < 1.0) {
                    coin.visible = false; // "Collect"
                    // Optional: play sound here
                }
            }
        });

        // 4. Obstacle collision
        const obstacles = scene.children.filter(c => c.name.startsWith('Obstacle')) as THREE.Mesh[];
        obstacles.forEach(obs => {
            const dist = player.position.distanceTo(obs.position);
            // Very simple distance-based collision box
            if (dist < 1.3) {
                // Bounce back penalty
                player.position.z += 3;
                player.position.x += (Math.random() - 0.5) * 2; // slight knock to side
            }
        });

        // 5. Track/World Looping (Pseudo Infinite)
        const track = scene.children.find(c => c.name === 'Track');
        if (track && player.position.z < track.position.z - 20) {
            // Slide track and obstacles forward when player gets too far
            track.position.z -= 30;
            
            obstacles.forEach(obs => {
                if (player.position.z < obs.position.z - 10) {
                    obs.position.z -= 50;
                    obs.position.x = (Math.random() - 0.5) * 5; // Re-randomize x
                }
            });
            coins.forEach(coin => {
                if (player.position.z < coin.position.z - 10) {
                    coin.position.z -= 50;
                    coin.position.x = (Math.random() - 0.5) * 4;
                    coin.visible = true; // Respawn
                }
            });
        }

        // 6. Camera Follow System
        // Move the camera to smoothly follow just behind and above the player
        camera.position.lerp(new THREE.Vector3(player.position.x * 0.5, player.position.y + 4, player.position.z + 6), 0.1);
        camera.lookAt(player.position.x * 0.2, player.position.y, player.position.z - 4);
    });

    return null;
}

// ---------- Main Viewport ----------

export default function Viewport() {
    const { objects, selectObject, isPlaying } = useEditorStore();

    const meshObjects = objects.filter(
        (o) => !o.type.includes('Light') && o.type !== 'camera'
    );
    const lightObjects = objects.filter((o) => o.type.includes('Light'));

    return (
        <div className="editor-viewport">
            <Canvas
                shadows
                camera={{ position: [5, 4, 5], fov: 50 }}
                gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
                onPointerMissed={() => {
                    if (!isPlaying) selectObject(null);
                }}
                style={{ background: '#1e1e2e' }}
            >
                {/* Force scene background color inside Three.js */}
                <SceneSetup />
                <KeyboardHandler />
                <GameLogicRunner />

                {/* Default Lighting — bright enough to clearly see objects */}
                <ambientLight intensity={0.6} />
                <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow shadow-mapSize={1024} />
                <directionalLight position={[-3, 5, -3]} intensity={0.4} />
                <hemisphereLight args={['#b0c4ff', '#3a3a5c', 0.5]} />

                {/* Grid */}
                {!isPlaying && (
                    <Grid
                        infiniteGrid
                        fadeDistance={30}
                        fadeStrength={3}
                        cellSize={1}
                        cellThickness={0.6}
                        cellColor="#3a3a55"
                        sectionSize={5}
                        sectionThickness={1.2}
                        sectionColor="#5a5a7e"
                    />
                )}

                {/* Contact Shadows */}
                <ContactShadows
                    position={[0, -0.01, 0]}
                    opacity={0.4}
                    scale={20}
                    blur={2}
                    far={4}
                />

                {/* Scene Objects */}
                {meshObjects.map((obj) => (
                    <SceneMesh key={obj.id} obj={obj} />
                ))}

                {/* Scene Lights */}
                {lightObjects.map((obj) => (
                    <SceneLight key={obj.id} obj={obj} />
                ))}

                {/* Transform Controls */}
                {!isPlaying && <TransformGizmo />}

                {/* Orbit Controls */}
                <OrbitControls
                    makeDefault
                    enableDamping
                    dampingFactor={0.1}
                    minDistance={1}
                    maxDistance={50}
                    enabled={!isPlaying}
                />

                {/* Gizmo Helper */}
                {!isPlaying && (
                    <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
                        <GizmoViewport
                            axisColors={['#ef4444', '#22c55e', '#3b82f6']}
                            labelColor="white"
                        />
                    </GizmoHelper>
                )}
            </Canvas>

            {/* Play Mode Overlay */}
            {isPlaying && (
                <div className="play-mode-overlay">
                    <div className="play-mode-badge">
                        <div className="recording-dot" />
                        PLAYING
                    </div>
                    <button
                        className="btn"
                        onClick={() => useEditorStore.getState().togglePlay()}
                        style={{
                            background: 'rgba(239,68,68,0.15)',
                            borderColor: 'rgba(239,68,68,0.3)',
                            color: '#ef4444',
                        }}
                    >
                        ■ Stop
                    </button>
                </div>
            )}
        </div>
    );
}
