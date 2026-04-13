import { GameCommand } from '@/lib/gameGenerator';
import { GameTemplate } from '@/store/projectStore';

export const TEMPLATES_3D: Record<GameTemplate, GameCommand[]> = {
    'blank': [],
    'platformer-starter': [
        { type: 'add_object', objectType: 'plane', name: 'Ground', position: { x: 0, y: 0, z: 0 }, scale: { x: 20, y: 20, z: 1 }, rotation: { x: -1.5708, y: 0, z: 0 }, material: { color: '#0d944e', roughness: 0.8, metalness: 0 } },
        { type: 'add_object', objectType: 'box', name: 'Player', position: { x: 0, y: 0.5, z: 0 }, scale: { x: 1, y: 1, z: 1 }, material: { color: '#3b82f6', roughness: 0.2, metalness: 0.1 } },
        { type: 'add_object', objectType: 'box', name: 'Platform 1', position: { x: 3, y: 1.5, z: -2 }, scale: { x: 2, y: 0.2, z: 2 }, material: { color: '#8b5cf6', roughness: 0.5, metalness: 0 } },
        { type: 'add_object', objectType: 'box', name: 'Platform 2', position: { x: 6, y: 3, z: -4 }, scale: { x: 2, y: 0.2, z: 2 }, material: { color: '#8b5cf6', roughness: 0.5, metalness: 0 } },
        { type: 'add_object', objectType: 'sphere', name: 'Goal', position: { x: 6, y: 4, z: -4 }, scale: { x: 0.5, y: 0.5, z: 0.5 }, material: { color: '#eab308', emissive: '#eab308', emissiveIntensity: 0.8, roughness: 0.1, metalness: 0.8 } },
        { type: 'add_object', objectType: 'directionalLight', name: 'Sun', position: { x: 5, y: 10, z: 5 } },
        { type: 'add_object', objectType: 'ambientLight', name: 'Ambient' },
    ],
    'token-gate-room': [
        { type: 'add_object', objectType: 'plane', name: 'Floor', position: { x: 0, y: 0, z: 0 }, scale: { x: 10, y: 10, z: 1 }, rotation: { x: -1.5708, y: 0, z: 0 }, material: { color: '#16161e', roughness: 0.9, metalness: 0 } },
        { type: 'add_object', objectType: 'box', name: 'Wall North', position: { x: 0, y: 2, z: -5 }, scale: { x: 10, y: 4, z: 0.5 }, material: { color: '#1a1a24', roughness: 1, metalness: 0 } },
        { type: 'add_object', objectType: 'box', name: 'Wall East', position: { x: 5, y: 2, z: 0 }, scale: { x: 0.5, y: 4, z: 10 }, material: { color: '#1a1a24', roughness: 1, metalness: 0 } },
        { type: 'add_object', objectType: 'box', name: 'Wall West', position: { x: -5, y: 2, z: 0 }, scale: { x: 0.5, y: 4, z: 10 }, material: { color: '#1a1a24', roughness: 1, metalness: 0 } },
        { type: 'add_object', objectType: 'box', name: 'Pedestal', position: { x: 0, y: 0.5, z: -2 }, scale: { x: 1, y: 1, z: 1 }, material: { color: '#2d2d3b', roughness: 0.5, metalness: 0.2 } },
        { type: 'add_object', objectType: 'box', name: 'Treasure Chest', position: { x: 0, y: 1.25, z: -2 }, scale: { x: 0.8, y: 0.5, z: 0.5 }, material: { color: '#f59e0b', roughness: 0.2, metalness: 0.8, emissive: '#b45309', emissiveIntensity: 0.2 } },
        { type: 'add_object', objectType: 'pointLight', name: 'Spotlight', position: { x: 0, y: 3, z: -2 } },
        { type: 'add_object', objectType: 'ambientLight', name: 'Dim Ambient' },
        { type: 'enable_web3' }
    ],
    'multiplayer-arena': [
        { type: 'add_object', objectType: 'plane', name: 'Arena Floor', position: { x: 0, y: 0, z: 0 }, scale: { x: 24, y: 24, z: 1 }, rotation: { x: -1.5708, y: 0, z: 0 }, material: { color: '#1f1f2e', roughness: 0.7, metalness: 0.2 } },
        { type: 'add_object', objectType: 'box', name: 'Center Obstacle', position: { x: 0, y: 2, z: 0 }, scale: { x: 4, y: 4, z: 4 }, material: { color: '#3b82f6', roughness: 0.4, metalness: 0.1 } },
        { type: 'add_object', objectType: 'cylinder', name: 'Pillar 1', position: { x: 6, y: 3, z: 6 }, scale: { x: 1, y: 6, z: 1 }, material: { color: '#ef4444', roughness: 0.5, metalness: 0 } },
        { type: 'add_object', objectType: 'cylinder', name: 'Pillar 2', position: { x: -6, y: 3, z: -6 }, scale: { x: 1, y: 6, z: 1 }, material: { color: '#ef4444', roughness: 0.5, metalness: 0 } },
        { type: 'add_object', objectType: 'cylinder', name: 'Pillar 3', position: { x: 6, y: 3, z: -6 }, scale: { x: 1, y: 6, z: 1 }, material: { color: '#ef4444', roughness: 0.5, metalness: 0 } },
        { type: 'add_object', objectType: 'cylinder', name: 'Pillar 4', position: { x: -6, y: 3, z: 6 }, scale: { x: 1, y: 6, z: 1 }, material: { color: '#ef4444', roughness: 0.5, metalness: 0 } },
        { type: 'add_object', objectType: 'pointLight', name: 'Center Light', position: { x: 0, y: 8, z: 0 } },
        { type: 'add_object', objectType: 'ambientLight', name: 'Ambient' },
    ],
    'nft-gallery': [
        { type: 'add_object', objectType: 'plane', name: 'Gallery Floor', position: { x: 0, y: 0, z: 0 }, scale: { x: 16, y: 16, z: 1 }, rotation: { x: -1.5708, y: 0, z: 0 }, material: { color: '#e5e7eb', roughness: 0.2, metalness: 0.1 } },
        { type: 'add_object', objectType: 'box', name: 'Display Wall', position: { x: 0, y: 2.5, z: -4 }, scale: { x: 12, y: 5, z: 0.5 }, material: { color: '#ffffff', roughness: 0.9, metalness: 0 } },
        { type: 'add_object', objectType: 'plane', name: 'Artwork 1', position: { x: -3, y: 2.5, z: -3.74 }, scale: { x: 2, y: 2, z: 1 }, rotation: { x: 0, y: 0, z: 0 }, material: { color: '#8b5cf6', roughness: 0.5, metalness: 0 } },
        { type: 'add_object', objectType: 'plane', name: 'Artwork 2', position: { x: 0, y: 2.5, z: -3.74 }, scale: { x: 2, y: 2, z: 1 }, rotation: { x: 0, y: 0, z: 0 }, material: { color: '#ec4899', roughness: 0.5, metalness: 0 } },
        { type: 'add_object', objectType: 'plane', name: 'Artwork 3', position: { x: 3, y: 2.5, z: -3.74 }, scale: { x: 2, y: 2, z: 1 }, rotation: { x: 0, y: 0, z: 0 }, material: { color: '#14f195', roughness: 0.5, metalness: 0 } },
        { type: 'add_object', objectType: 'pointLight', name: 'Light 1', position: { x: -3, y: 4, z: -2 } },
        { type: 'add_object', objectType: 'pointLight', name: 'Light 2', position: { x: 0, y: 4, z: -2 } },
        { type: 'add_object', objectType: 'pointLight', name: 'Light 3', position: { x: 3, y: 4, z: -2 } },
        { type: 'add_object', objectType: 'ambientLight', name: 'Ambient' },
        { type: 'enable_web3' }
    ],
    'endless-runner': [
        // Environment
        { type: 'add_object', objectType: 'directionalLight', name: 'Sun', position: { x: 5, y: 10, z: -5 }, rotation: { x: -0.5, y: 0.5, z: 0 } },
        { type: 'add_object', objectType: 'ambientLight', name: 'Ambient' },
        
        // Endless Track
        { type: 'add_object', objectType: 'box', name: 'Track', position: { x: 0, y: -0.5, z: -20 }, scale: { x: 6, y: 1, z: 60 }, material: { color: '#0d944e', roughness: 0.8, metalness: 0 } },
        
        // Player
        { type: 'add_object', objectType: 'box', name: 'Player', position: { x: 0, y: 0.5, z: 5 }, scale: { x: 1, y: 1, z: 1 }, material: { color: '#3b82f6', roughness: 0.2, metalness: 0.2 } },
        
        // Obstacles
        { type: 'add_object', objectType: 'box', name: 'Obstacle 1', position: { x: 0, y: 0.5, z: 0 }, scale: { x: 2, y: 1, z: 1 }, material: { color: '#ef4444', roughness: 0.5, metalness: 0 } },
        { type: 'add_object', objectType: 'box', name: 'Obstacle 2', position: { x: -2, y: 0.5, z: -10 }, scale: { x: 2, y: 1, z: 1 }, material: { color: '#ef4444', roughness: 0.5, metalness: 0 } },
        { type: 'add_object', objectType: 'box', name: 'Obstacle 3', position: { x: 2, y: 0.5, z: -25 }, scale: { x: 2, y: 1, z: 1 }, material: { color: '#ef4444', roughness: 0.5, metalness: 0 } },
        
        // Coins (Spheres)
        { type: 'add_object', objectType: 'sphere', name: 'Coin 1', position: { x: 2, y: 1, z: -2 }, scale: { x: 0.4, y: 0.4, z: 0.4 }, material: { color: '#eab308', emissive: '#eab308', emissiveIntensity: 0.6, roughness: 0.1, metalness: 0.8 } },
        { type: 'add_object', objectType: 'sphere', name: 'Coin 2', position: { x: 0, y: 1, z: -15 }, scale: { x: 0.4, y: 0.4, z: 0.4 }, material: { color: '#eab308', emissive: '#eab308', emissiveIntensity: 0.6, roughness: 0.1, metalness: 0.8 } },
        { type: 'add_object', objectType: 'sphere', name: 'Coin 3', position: { x: -2, y: 1, z: -30 }, scale: { x: 0.4, y: 0.4, z: 0.4 }, material: { color: '#eab308', emissive: '#eab308', emissiveIntensity: 0.6, roughness: 0.1, metalness: 0.8 } },
    ],
    'puzzle-grid': [],
    'top-down-rpg': [],
    'top-down-shooter': [],
    'top-down-adventure': [],
    'racing-track': [],
};

export const TEMPLATES_2D: Record<GameTemplate, GameCommand[]> = {
    'blank': [],
    'platformer-starter': [
        { type: 'add_sprite', spriteType: 'shape', shapeType: 'rect', name: 'Sky', x: 400, y: 300, width: 800, height: 600, fillColor: '#38bdf8' },
        { type: 'add_sprite', spriteType: 'shape', shapeType: 'rect', name: 'Ground', x: 400, y: 550, width: 800, height: 100, fillColor: '#0d944e', physics: { enabled: true, gravity: 0, velocity: { x: 0, y: 0 }, friction: 0, bounce: 0, isStatic: true, isTrigger: false } },
        { type: 'add_sprite', spriteType: 'shape', shapeType: 'rect', name: 'Platform 1', x: 250, y: 420, width: 150, height: 20, fillColor: '#8b5cf6', physics: { enabled: true, gravity: 0, velocity: { x: 0, y: 0 }, friction: 0, bounce: 0, isStatic: true, isTrigger: false } },
        { type: 'add_sprite', spriteType: 'shape', shapeType: 'rect', name: 'Platform 2', x: 550, y: 320, width: 150, height: 20, fillColor: '#8b5cf6', physics: { enabled: true, gravity: 0, velocity: { x: 0, y: 0 }, friction: 0, bounce: 0, isStatic: true, isTrigger: false } },
        { type: 'add_sprite', spriteType: 'sprite', emoji: '🏃', name: 'Player', x: 100, y: 450, width: 48, height: 48, physics: { enabled: true, gravity: 800, velocity: { x: 0, y: 0 }, friction: 5, bounce: 0, isStatic: false, isTrigger: false } },
        { type: 'add_sprite', spriteType: 'sprite', emoji: '🪙', name: 'Coin 1', x: 250, y: 370, width: 32, height: 32, physics: { enabled: true, gravity: 0, velocity: { x: 0, y: 0 }, friction: 0, bounce: 0, isStatic: true, isTrigger: true } },
        { type: 'add_sprite', spriteType: 'sprite', emoji: '🪙', name: 'Coin 2', x: 550, y: 270, width: 32, height: 32, physics: { enabled: true, gravity: 0, velocity: { x: 0, y: 0 }, friction: 0, bounce: 0, isStatic: true, isTrigger: true } },
        { type: 'add_sprite', spriteType: 'sprite', emoji: '🚩', name: 'Flag', x: 700, y: 480, width: 40, height: 56 },
    ],
    'endless-runner': [
        { type: 'add_sprite', spriteType: 'shape', shapeType: 'rect', name: 'Night Sky', x: 400, y: 300, width: 800, height: 600, fillColor: '#1e1e2f' },
        { type: 'add_sprite', spriteType: 'shape', shapeType: 'rect', name: 'Ground', x: 400, y: 550, width: 800, height: 100, fillColor: '#333344', physics: { enabled: true, gravity: 0, velocity: { x: 0, y: 0 }, friction: 0, bounce: 0, isStatic: true, isTrigger: false } },
        { type: 'add_sprite', spriteType: 'sprite', emoji: '🚗', name: 'Vehicle', x: 150, y: 470, width: 64, height: 64, physics: { enabled: true, gravity: 600, velocity: { x: 0, y: 0 }, friction: 3, bounce: 0, isStatic: false, isTrigger: false } },
        { type: 'add_sprite', spriteType: 'sprite', emoji: '🌲', name: 'Tree Obstacle', x: 700, y: 470, width: 64, height: 64, physics: { enabled: true, gravity: 0, velocity: { x: 0, y: 0 }, friction: 0, bounce: 0, isStatic: true, isTrigger: false } },
        { type: 'add_sprite', spriteType: 'sprite', emoji: '🌲', name: 'Tree 2', x: 500, y: 470, width: 48, height: 48, physics: { enabled: true, gravity: 0, velocity: { x: 0, y: 0 }, friction: 0, bounce: 0, isStatic: true, isTrigger: false } },
        { type: 'add_sprite', spriteType: 'sprite', emoji: '⭐', name: 'Star', x: 600, y: 400, width: 28, height: 28, physics: { enabled: true, gravity: 0, velocity: { x: 0, y: 0 }, friction: 0, bounce: 0, isStatic: true, isTrigger: true } },
        { type: 'add_sprite', spriteType: 'text', text: 'Score: 0', name: 'Score UI', x: 700, y: 40, fontSize: 20, fillColor: '#ffffff' },
    ],
    'nft-gallery': [
        { type: 'add_sprite', spriteType: 'shape', shapeType: 'rect', name: 'Wall', x: 400, y: 300, width: 800, height: 600, fillColor: '#f3f4f6' },
        { type: 'add_sprite', spriteType: 'shape', shapeType: 'rect', name: 'Frame 1', x: 200, y: 300, width: 160, height: 200, fillColor: '#111827' },
        { type: 'add_sprite', spriteType: 'shape', shapeType: 'rect', name: 'Frame 2', x: 400, y: 300, width: 160, height: 200, fillColor: '#111827' },
        { type: 'add_sprite', spriteType: 'shape', shapeType: 'rect', name: 'Frame 3', x: 600, y: 300, width: 160, height: 200, fillColor: '#111827' },
        { type: 'add_sprite', spriteType: 'sprite', emoji: '🖼️', name: 'Art 1', x: 200, y: 300, width: 120, height: 120 },
        { type: 'add_sprite', spriteType: 'sprite', emoji: '🖼️', name: 'Art 2', x: 400, y: 300, width: 120, height: 120 },
        { type: 'add_sprite', spriteType: 'sprite', emoji: '🖼️', name: 'Art 3', x: 600, y: 300, width: 120, height: 120 },
        { type: 'add_sprite', spriteType: 'text', text: 'My NFT Collection', name: 'Title', x: 400, y: 80, fontSize: 36, fillColor: '#111827' },
        { type: 'enable_web3' }
    ],
    'token-gate-room': [],
    'multiplayer-arena': [],

    // ─── Genre-Specific 2D Templates ───

    'puzzle-grid': [
        // Background
        { type: 'add_sprite', spriteType: 'shape', shapeType: 'rect', name: 'Background', x: 400, y: 300, width: 800, height: 600, fillColor: '#1a1a2e' },
        // Grid board area
        { type: 'add_sprite', spriteType: 'shape', shapeType: 'rect', name: 'Board', x: 400, y: 280, width: 360, height: 360, fillColor: '#2d2d44', strokeColor: '#4a4a6a', strokeWidth: 2 },
        // Grid cells (4x4)
        ...Array.from({ length: 16 }, (_, i) => {
            const row = Math.floor(i / 4);
            const col = i % 4;
            return { type: 'add_sprite' as const, spriteType: 'shape' as const, shapeType: 'rect' as const, name: `Cell ${row}-${col}`, x: 280 + col * 80, y: 160 + row * 80, width: 70, height: 70, fillColor: '#3a3a55', cornerRadius: 8 };
        }),
        // Sample puzzle pieces
        { type: 'add_sprite', spriteType: 'sprite', emoji: '🟦', name: 'Piece Blue', x: 280, y: 160, width: 60, height: 60 },
        { type: 'add_sprite', spriteType: 'sprite', emoji: '🟩', name: 'Piece Green', x: 360, y: 240, width: 60, height: 60 },
        { type: 'add_sprite', spriteType: 'sprite', emoji: '🟨', name: 'Piece Yellow', x: 440, y: 160, width: 60, height: 60 },
        { type: 'add_sprite', spriteType: 'sprite', emoji: '🟥', name: 'Piece Red', x: 520, y: 320, width: 60, height: 60 },
        // UI
        { type: 'add_sprite', spriteType: 'text', text: 'Puzzle Game', name: 'Title', x: 400, y: 30, fontSize: 28, fillColor: '#ffffff' },
        { type: 'add_sprite', spriteType: 'text', text: 'Moves: 0', name: 'Moves Counter', x: 100, y: 30, fontSize: 16, fillColor: '#a0a0b0' },
        { type: 'add_sprite', spriteType: 'text', text: 'Level 1', name: 'Level', x: 700, y: 30, fontSize: 16, fillColor: '#a0a0b0' },
        // Side panel
        { type: 'add_sprite', spriteType: 'shape', shapeType: 'rect', name: 'Side Panel', x: 680, y: 300, width: 160, height: 400, fillColor: '#22223a', cornerRadius: 12 },
        { type: 'add_sprite', spriteType: 'sprite', emoji: '🔄', name: 'Reset Btn', x: 680, y: 440, width: 40, height: 40 },
        { type: 'add_sprite', spriteType: 'text', text: 'Reset', name: 'Reset Label', x: 680, y: 475, fontSize: 12, fillColor: '#7a7f8d' },
    ],

    'top-down-rpg': [
        // Ground
        { type: 'add_sprite', spriteType: 'shape', shapeType: 'rect', name: 'Ground', x: 400, y: 300, width: 800, height: 600, fillColor: '#2d5a27' },
        // Grass patches
        { type: 'add_sprite', spriteType: 'shape', shapeType: 'rect', name: 'Grass Patch 1', x: 200, y: 200, width: 80, height: 60, fillColor: '#3a7a32', cornerRadius: 20 },
        { type: 'add_sprite', spriteType: 'shape', shapeType: 'rect', name: 'Grass Patch 2', x: 550, y: 400, width: 100, height: 70, fillColor: '#3a7a32', cornerRadius: 20 },
        // Paths
        { type: 'add_sprite', spriteType: 'shape', shapeType: 'rect', name: 'Path H', x: 400, y: 300, width: 600, height: 40, fillColor: '#8B7355' },
        { type: 'add_sprite', spriteType: 'shape', shapeType: 'rect', name: 'Path V', x: 400, y: 300, width: 40, height: 400, fillColor: '#8B7355' },
        // Buildings
        { type: 'add_sprite', spriteType: 'sprite', emoji: '🏠', name: 'House 1', x: 150, y: 150, width: 64, height: 64 },
        { type: 'add_sprite', spriteType: 'sprite', emoji: '🏪', name: 'Shop', x: 650, y: 150, width: 64, height: 64 },
        { type: 'add_sprite', spriteType: 'sprite', emoji: '🏰', name: 'Castle', x: 400, y: 100, width: 80, height: 80 },
        // Trees
        { type: 'add_sprite', spriteType: 'sprite', emoji: '🌲', name: 'Tree 1', x: 80, y: 350, width: 48, height: 48 },
        { type: 'add_sprite', spriteType: 'sprite', emoji: '🌲', name: 'Tree 2', x: 720, y: 350, width: 48, height: 48 },
        { type: 'add_sprite', spriteType: 'sprite', emoji: '🌲', name: 'Tree 3', x: 300, y: 500, width: 48, height: 48 },
        { type: 'add_sprite', spriteType: 'sprite', emoji: '🌲', name: 'Tree 4', x: 500, y: 500, width: 48, height: 48 },
        // Player
        { type: 'add_sprite', spriteType: 'sprite', emoji: '🧙', name: 'Hero', x: 400, y: 350, width: 48, height: 48 },
        // NPCs
        { type: 'add_sprite', spriteType: 'sprite', emoji: '🧓', name: 'Old Man', x: 200, y: 280, width: 40, height: 40 },
        { type: 'add_sprite', spriteType: 'sprite', emoji: '👨‍🌾', name: 'Farmer', x: 550, y: 280, width: 40, height: 40 },
        // Items
        { type: 'add_sprite', spriteType: 'sprite', emoji: '💎', name: 'Gem', x: 680, y: 450, width: 28, height: 28 },
        { type: 'add_sprite', spriteType: 'sprite', emoji: '🗝️', name: 'Key', x: 120, y: 450, width: 28, height: 28 },
        // UI
        { type: 'add_sprite', spriteType: 'shape', shapeType: 'rect', name: 'HUD Bar', x: 400, y: 20, width: 760, height: 36, fillColor: 'rgba(0,0,0,0.6)', cornerRadius: 8 },
        { type: 'add_sprite', spriteType: 'text', text: '❤️❤️❤️  ⭐ 100  🪙 50', name: 'HUD Text', x: 400, y: 20, fontSize: 14, fillColor: '#ffffff' },
    ],

    'top-down-shooter': [
        // Arena floor
        { type: 'add_sprite', spriteType: 'shape', shapeType: 'rect', name: 'Arena', x: 400, y: 300, width: 800, height: 600, fillColor: '#1a1a2e' },
        // Walls
        { type: 'add_sprite', spriteType: 'shape', shapeType: 'rect', name: 'Wall Top', x: 400, y: 15, width: 800, height: 30, fillColor: '#4a4a5a', physics: { enabled: true, gravity: 0, velocity: { x: 0, y: 0 }, friction: 0, bounce: 0, isStatic: true, isTrigger: false } },
        { type: 'add_sprite', spriteType: 'shape', shapeType: 'rect', name: 'Wall Bottom', x: 400, y: 585, width: 800, height: 30, fillColor: '#4a4a5a', physics: { enabled: true, gravity: 0, velocity: { x: 0, y: 0 }, friction: 0, bounce: 0, isStatic: true, isTrigger: false } },
        { type: 'add_sprite', spriteType: 'shape', shapeType: 'rect', name: 'Wall Left', x: 15, y: 300, width: 30, height: 600, fillColor: '#4a4a5a', physics: { enabled: true, gravity: 0, velocity: { x: 0, y: 0 }, friction: 0, bounce: 0, isStatic: true, isTrigger: false } },
        { type: 'add_sprite', spriteType: 'shape', shapeType: 'rect', name: 'Wall Right', x: 785, y: 300, width: 30, height: 600, fillColor: '#4a4a5a', physics: { enabled: true, gravity: 0, velocity: { x: 0, y: 0 }, friction: 0, bounce: 0, isStatic: true, isTrigger: false } },
        // Cover objects
        { type: 'add_sprite', spriteType: 'shape', shapeType: 'rect', name: 'Cover 1', x: 250, y: 200, width: 60, height: 60, fillColor: '#3a3a4a', physics: { enabled: true, gravity: 0, velocity: { x: 0, y: 0 }, friction: 0, bounce: 0, isStatic: true, isTrigger: false } },
        { type: 'add_sprite', spriteType: 'shape', shapeType: 'rect', name: 'Cover 2', x: 550, y: 400, width: 60, height: 60, fillColor: '#3a3a4a', physics: { enabled: true, gravity: 0, velocity: { x: 0, y: 0 }, friction: 0, bounce: 0, isStatic: true, isTrigger: false } },
        { type: 'add_sprite', spriteType: 'shape', shapeType: 'rect', name: 'Cover 3', x: 400, y: 300, width: 80, height: 80, fillColor: '#3a3a4a', physics: { enabled: true, gravity: 0, velocity: { x: 0, y: 0 }, friction: 0, bounce: 0, isStatic: true, isTrigger: false } },
        // Player
        { type: 'add_sprite', spriteType: 'sprite', emoji: '🔫', name: 'Player', x: 150, y: 300, width: 48, height: 48, physics: { enabled: true, gravity: 0, velocity: { x: 0, y: 0 }, friction: 8, bounce: 0, isStatic: false, isTrigger: false } },
        // Enemies
        { type: 'add_sprite', spriteType: 'sprite', emoji: '👾', name: 'Enemy 1', x: 600, y: 150, width: 44, height: 44 },
        { type: 'add_sprite', spriteType: 'sprite', emoji: '👾', name: 'Enemy 2', x: 650, y: 450, width: 44, height: 44 },
        { type: 'add_sprite', spriteType: 'sprite', emoji: '👽', name: 'Boss', x: 700, y: 300, width: 64, height: 64 },
        // Pickups
        { type: 'add_sprite', spriteType: 'sprite', emoji: '💊', name: 'Health Pack', x: 400, y: 150, width: 28, height: 28 },
        { type: 'add_sprite', spriteType: 'sprite', emoji: '🔋', name: 'Ammo', x: 300, y: 450, width: 28, height: 28 },
        // HUD
        { type: 'add_sprite', spriteType: 'text', text: 'Health: ████████░░', name: 'Health Bar', x: 120, y: 570, fontSize: 14, fillColor: '#ef4444' },
        { type: 'add_sprite', spriteType: 'text', text: 'Score: 0', name: 'Score', x: 700, y: 570, fontSize: 16, fillColor: '#ffffff' },
        { type: 'add_sprite', spriteType: 'text', text: '🔫 x 30', name: 'Ammo Display', x: 400, y: 570, fontSize: 14, fillColor: '#f59e0b' },
    ],

    'top-down-adventure': [
        // World
        { type: 'add_sprite', spriteType: 'shape', shapeType: 'rect', name: 'World', x: 400, y: 300, width: 800, height: 600, fillColor: '#2a3a2a' },
        // Water areas
        { type: 'add_sprite', spriteType: 'shape', shapeType: 'rect', name: 'Lake', x: 600, y: 400, width: 200, height: 150, fillColor: '#1e40af', cornerRadius: 40 },
        // Dirt path
        { type: 'add_sprite', spriteType: 'shape', shapeType: 'rect', name: 'Dirt Path', x: 300, y: 300, width: 200, height: 30, fillColor: '#92400e' },
        { type: 'add_sprite', spriteType: 'shape', shapeType: 'rect', name: 'Path Bend', x: 400, y: 380, width: 30, height: 160, fillColor: '#92400e' },
        // Dungeon entrance
        { type: 'add_sprite', spriteType: 'sprite', emoji: '🚪', name: 'Dungeon Door', x: 200, y: 150, width: 56, height: 56 },
        { type: 'add_sprite', spriteType: 'shape', shapeType: 'rect', name: 'Dungeon Wall', x: 200, y: 130, width: 120, height: 20, fillColor: '#4a4a4a' },
        // Village
        { type: 'add_sprite', spriteType: 'sprite', emoji: '🏠', name: 'House', x: 100, y: 400, width: 56, height: 56 },
        { type: 'add_sprite', spriteType: 'sprite', emoji: '🏪', name: 'Item Shop', x: 100, y: 480, width: 56, height: 56 },
        { type: 'add_sprite', spriteType: 'sprite', emoji: '⛪', name: 'Church', x: 180, y: 440, width: 56, height: 56 },
        // Nature
        { type: 'add_sprite', spriteType: 'sprite', emoji: '🌲', name: 'Pine 1', x: 50, y: 100, width: 48, height: 48 },
        { type: 'add_sprite', spriteType: 'sprite', emoji: '🌲', name: 'Pine 2', x: 350, y: 80, width: 48, height: 48 },
        { type: 'add_sprite', spriteType: 'sprite', emoji: '🌲', name: 'Pine 3', x: 500, y: 120, width: 48, height: 48 },
        { type: 'add_sprite', spriteType: 'sprite', emoji: '🪨', name: 'Rock', x: 450, y: 250, width: 40, height: 36 },
        { type: 'add_sprite', spriteType: 'sprite', emoji: '🌸', name: 'Flower', x: 320, y: 200, width: 24, height: 24 },
        // Bridge
        { type: 'add_sprite', spriteType: 'shape', shapeType: 'rect', name: 'Bridge', x: 550, y: 330, width: 100, height: 24, fillColor: '#92400e' },
        // Player
        { type: 'add_sprite', spriteType: 'sprite', emoji: '🗡️', name: 'Hero', x: 300, y: 300, width: 48, height: 48 },
        // NPCs
        { type: 'add_sprite', spriteType: 'sprite', emoji: '🧓', name: 'Sage', x: 170, y: 150, width: 40, height: 40 },
        { type: 'add_sprite', spriteType: 'sprite', emoji: '🧑‍🌾', name: 'Villager', x: 60, y: 440, width: 36, height: 36 },
        // Treasure
        { type: 'add_sprite', spriteType: 'sprite', emoji: '📦', name: 'Treasure Chest', x: 200, y: 200, width: 40, height: 36 },
        // Map marker
        { type: 'add_sprite', spriteType: 'sprite', emoji: '🚩', name: 'Quest Marker', x: 200, y: 100, width: 32, height: 40 },
        // HUD
        { type: 'add_sprite', spriteType: 'shape', shapeType: 'rect', name: 'HUD BG', x: 400, y: 20, width: 760, height: 32, fillColor: 'rgba(0,0,0,0.5)', cornerRadius: 6 },
        { type: 'add_sprite', spriteType: 'text', text: '❤️ x3  |  🪙 0  |  📍 Forest Path', name: 'HUD', x: 400, y: 20, fontSize: 13, fillColor: '#ffffff' },
    ],

    'racing-track': [
        // Sky
        { type: 'add_sprite', spriteType: 'shape', shapeType: 'rect', name: 'Sky', x: 400, y: 200, width: 800, height: 300, fillColor: '#0ea5e9' },
        // Track ground
        { type: 'add_sprite', spriteType: 'shape', shapeType: 'rect', name: 'Track', x: 400, y: 450, width: 800, height: 250, fillColor: '#374151' },
        // Road markings
        { type: 'add_sprite', spriteType: 'shape', shapeType: 'rect', name: 'Center Line 1', x: 150, y: 450, width: 60, height: 6, fillColor: '#f59e0b' },
        { type: 'add_sprite', spriteType: 'shape', shapeType: 'rect', name: 'Center Line 2', x: 350, y: 450, width: 60, height: 6, fillColor: '#f59e0b' },
        { type: 'add_sprite', spriteType: 'shape', shapeType: 'rect', name: 'Center Line 3', x: 550, y: 450, width: 60, height: 6, fillColor: '#f59e0b' },
        { type: 'add_sprite', spriteType: 'shape', shapeType: 'rect', name: 'Center Line 4', x: 750, y: 450, width: 60, height: 6, fillColor: '#f59e0b' },
        // Road edges
        { type: 'add_sprite', spriteType: 'shape', shapeType: 'rect', name: 'Road Edge Top', x: 400, y: 330, width: 800, height: 8, fillColor: '#ef4444' },
        { type: 'add_sprite', spriteType: 'shape', shapeType: 'rect', name: 'Road Edge Bottom', x: 400, y: 570, width: 800, height: 8, fillColor: '#ef4444' },
        // Trees along road
        { type: 'add_sprite', spriteType: 'sprite', emoji: '🌲', name: 'Tree 1', x: 80, y: 280, width: 48, height: 48 },
        { type: 'add_sprite', spriteType: 'sprite', emoji: '🌲', name: 'Tree 2', x: 250, y: 260, width: 48, height: 48 },
        { type: 'add_sprite', spriteType: 'sprite', emoji: '🌲', name: 'Tree 3', x: 550, y: 270, width: 48, height: 48 },
        { type: 'add_sprite', spriteType: 'sprite', emoji: '🌲', name: 'Tree 4', x: 720, y: 260, width: 48, height: 48 },
        // Player car
        { type: 'add_sprite', spriteType: 'sprite', emoji: '🏎️', name: 'Player Car', x: 150, y: 450, width: 64, height: 64, physics: { enabled: true, gravity: 0, velocity: { x: 0, y: 0 }, friction: 5, bounce: 0, isStatic: false, isTrigger: false } },
        // Obstacles
        { type: 'add_sprite', spriteType: 'sprite', emoji: '🚗', name: 'Traffic 1', x: 500, y: 400, width: 56, height: 56 },
        { type: 'add_sprite', spriteType: 'sprite', emoji: '🚙', name: 'Traffic 2', x: 650, y: 500, width: 56, height: 56 },
        // Cones
        { type: 'add_sprite', spriteType: 'sprite', emoji: '🔶', name: 'Cone 1', x: 300, y: 350, width: 24, height: 24 },
        { type: 'add_sprite', spriteType: 'sprite', emoji: '🔶', name: 'Cone 2', x: 450, y: 560, width: 24, height: 24 },
        // Finish line
        { type: 'add_sprite', spriteType: 'shape', shapeType: 'rect', name: 'Finish Line', x: 750, y: 450, width: 16, height: 230, fillColor: '#ffffff', strokeColor: '#000000', strokeWidth: 2 },
        // HUD
        { type: 'add_sprite', spriteType: 'text', text: '🏎️ Speed: 0 km/h', name: 'Speed', x: 120, y: 580, fontSize: 16, fillColor: '#ffffff' },
        { type: 'add_sprite', spriteType: 'text', text: 'Lap: 1/3', name: 'Lap Counter', x: 400, y: 20, fontSize: 20, fillColor: '#ffffff' },
        { type: 'add_sprite', spriteType: 'text', text: '⏱ 0:00', name: 'Timer', x: 680, y: 20, fontSize: 18, fillColor: '#f59e0b' },
    ],
};
