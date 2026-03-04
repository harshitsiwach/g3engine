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
    'endless-runner': [],
};

export const TEMPLATES_2D: Record<GameTemplate, GameCommand[]> = {
    'blank': [],
    'platformer-starter': [
        { type: 'add_sprite', spriteType: 'shape', shapeType: 'rect', name: 'Ground', x: 400, y: 550, width: 800, height: 100, fillColor: '#0d944e' },
        { type: 'add_sprite', spriteType: 'shape', shapeType: 'rect', name: 'Sky', x: 400, y: 250, width: 800, height: 500, fillColor: '#38bdf8' },
        { type: 'add_sprite', spriteType: 'sprite', emoji: '🏃', name: 'Player', x: 100, y: 450, width: 64, height: 64 },
        { type: 'add_sprite', spriteType: 'shape', shapeType: 'rect', name: 'Platform 1', x: 300, y: 400, width: 150, height: 20, fillColor: '#8b5cf6' },
        { type: 'add_sprite', spriteType: 'shape', shapeType: 'rect', name: 'Platform 2', x: 600, y: 300, width: 150, height: 20, fillColor: '#8b5cf6' },
        { type: 'add_sprite', spriteType: 'sprite', emoji: '🪙', name: 'Coin', x: 600, y: 240, width: 40, height: 40 },
    ],
    'endless-runner': [
        { type: 'add_sprite', spriteType: 'shape', shapeType: 'rect', name: 'Night Sky', x: 400, y: 300, width: 800, height: 600, fillColor: '#1e1e2f' },
        { type: 'add_sprite', spriteType: 'shape', shapeType: 'rect', name: 'Ground', x: 400, y: 550, width: 800, height: 100, fillColor: '#333344' },
        { type: 'add_sprite', spriteType: 'sprite', emoji: '🚗', name: 'Vehicle', x: 150, y: 470, width: 80, height: 80 },
        { type: 'add_sprite', spriteType: 'sprite', emoji: '🌲', name: 'Tree Obstacle', x: 700, y: 460, width: 80, height: 80 },
        { type: 'add_sprite', spriteType: 'sprite', emoji: '🌲', name: 'Tree Bg', x: 400, y: 460, width: 60, height: 60 },
        { type: 'add_sprite', spriteType: 'text', text: 'Score: 0', name: 'Score UI', x: 100, y: 40, fontSize: 24, fillColor: '#ffffff' },
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
};
