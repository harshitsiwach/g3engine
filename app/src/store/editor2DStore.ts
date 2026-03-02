'use client';

import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

// ─── Types ───

export type Tool2D = 'select' | 'move' | 'draw' | 'erase' | 'fill' | 'shape' | 'text';
export type ShapeType = 'rect' | 'circle' | 'line' | 'polygon';

export interface Vec2 { x: number; y: number }

export interface Sprite2D {
    id: string;
    name: string;
    type: 'sprite' | 'shape' | 'text' | 'tilemap';
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    scaleX: number;
    scaleY: number;
    opacity: number;
    visible: boolean;
    locked: boolean;
    layerId: string;
    // Sprite rendering
    fillColor: string;
    strokeColor: string;
    strokeWidth: number;
    // Shape-specific
    shapeType?: ShapeType;
    cornerRadius?: number;
    // Text-specific
    text?: string;
    fontSize?: number;
    fontFamily?: string;
    // Sprite image
    emoji?: string; // For quick prototyping
}

export interface Layer2D {
    id: string;
    name: string;
    visible: boolean;
    locked: boolean;
    opacity: number;
    order: number;
}

export interface Camera2D {
    x: number;
    y: number;
    zoom: number;
}

export interface Editor2DState {
    // Scene
    sprites: Sprite2D[];
    layers: Layer2D[];
    selectedSpriteId: string | null;
    selectedLayerId: string;

    // Camera
    camera: Camera2D;

    // Tools
    activeTool: Tool2D;
    activeShapeType: ShapeType;
    brushColor: string;
    brushSize: number;
    gridSize: number;
    snapToGrid: boolean;
    showGrid: boolean;

    // Editor state
    isPlaying: boolean;
    canvasWidth: number;
    canvasHeight: number;

    // History
    history: { sprites: Sprite2D[] }[];
    historyIndex: number;

    // ─── Actions ───
    addSprite: (sprite: Partial<Sprite2D>) => void;
    removeSprite: (id: string) => void;
    selectSprite: (id: string | null) => void;
    updateSprite: (id: string, updates: Partial<Sprite2D>) => void;
    duplicateSprite: (id: string) => void;

    // Layers
    addLayer: (name?: string) => void;
    removeLayer: (id: string) => void;
    selectLayer: (id: string) => void;
    updateLayer: (id: string, updates: Partial<Layer2D>) => void;
    reorderLayer: (id: string, newOrder: number) => void;

    // Camera
    panCamera: (dx: number, dy: number) => void;
    zoomCamera: (zoom: number) => void;
    resetCamera: () => void;

    // Tools
    setTool: (tool: Tool2D) => void;
    setShapeType: (shape: ShapeType) => void;
    setBrushColor: (color: string) => void;
    setBrushSize: (size: number) => void;
    toggleGrid: () => void;
    toggleSnap: () => void;

    // Editor
    togglePlay: () => void;

    // History
    pushHistory: () => void;
    undo: () => void;
    redo: () => void;
}

// ─── Defaults ───

const DEFAULT_LAYER: Layer2D = {
    id: 'layer-bg',
    name: 'Background',
    visible: true,
    locked: false,
    opacity: 1,
    order: 0,
};

const DEFAULT_MAIN_LAYER: Layer2D = {
    id: 'layer-main',
    name: 'Main',
    visible: true,
    locked: false,
    opacity: 1,
    order: 1,
};

const DEFAULT_UI_LAYER: Layer2D = {
    id: 'layer-ui',
    name: 'UI',
    visible: true,
    locked: false,
    opacity: 1,
    order: 2,
};

let spriteCounter = 0;

export const useEditor2DStore = create<Editor2DState>((set, get) => ({
    sprites: [],
    layers: [DEFAULT_LAYER, DEFAULT_MAIN_LAYER, DEFAULT_UI_LAYER],
    selectedSpriteId: null,
    selectedLayerId: 'layer-main',

    camera: { x: 0, y: 0, zoom: 1 },

    activeTool: 'select',
    activeShapeType: 'rect',
    brushColor: '#6366f1',
    brushSize: 4,
    gridSize: 32,
    snapToGrid: true,
    showGrid: true,

    isPlaying: false,
    canvasWidth: 800,
    canvasHeight: 600,

    history: [{ sprites: [] }],
    historyIndex: 0,

    // ─── Sprite CRUD ───

    addSprite: (partial) => {
        spriteCounter++;
        const layerId = get().selectedLayerId;
        const sprite: Sprite2D = {
            id: uuidv4(),
            name: partial.name || `Sprite ${spriteCounter}`,
            type: partial.type || 'sprite',
            x: partial.x ?? 400,
            y: partial.y ?? 300,
            width: partial.width ?? 64,
            height: partial.height ?? 64,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            opacity: 1,
            visible: true,
            locked: false,
            layerId,
            fillColor: partial.fillColor ?? '#6366f1',
            strokeColor: partial.strokeColor ?? 'transparent',
            strokeWidth: 0,
            shapeType: partial.shapeType,
            cornerRadius: partial.cornerRadius,
            text: partial.text,
            fontSize: partial.fontSize,
            fontFamily: partial.fontFamily,
            emoji: partial.emoji,
            ...partial,
        };
        set((s) => {
            const newSprites = [...s.sprites, sprite];
            return {
                sprites: newSprites,
                selectedSpriteId: sprite.id,
                history: [...s.history.slice(0, s.historyIndex + 1), { sprites: newSprites }],
                historyIndex: s.historyIndex + 1,
            };
        });
    },

    removeSprite: (id) =>
        set((s) => {
            const newSprites = s.sprites.filter((sp) => sp.id !== id);
            return {
                sprites: newSprites,
                selectedSpriteId: s.selectedSpriteId === id ? null : s.selectedSpriteId,
                history: [...s.history.slice(0, s.historyIndex + 1), { sprites: newSprites }],
                historyIndex: s.historyIndex + 1,
            };
        }),

    selectSprite: (id) => set({ selectedSpriteId: id }),

    updateSprite: (id, updates) =>
        set((s) => ({
            sprites: s.sprites.map((sp) => (sp.id === id ? { ...sp, ...updates } : sp)),
        })),

    duplicateSprite: (id) => {
        const sp = get().sprites.find((s) => s.id === id);
        if (!sp) return;
        spriteCounter++;
        const dup: Sprite2D = { ...sp, id: uuidv4(), name: `${sp.name} Copy`, x: sp.x + 40, y: sp.y + 40 };
        set((s) => {
            const newSprites = [...s.sprites, dup];
            return {
                sprites: newSprites,
                selectedSpriteId: dup.id,
                history: [...s.history.slice(0, s.historyIndex + 1), { sprites: newSprites }],
                historyIndex: s.historyIndex + 1,
            };
        });
    },

    // ─── Layers ───

    addLayer: (name) => {
        const id = uuidv4();
        const order = get().layers.length;
        set((s) => ({
            layers: [...s.layers, { id, name: name || `Layer ${order + 1}`, visible: true, locked: false, opacity: 1, order }],
            selectedLayerId: id,
        }));
    },

    removeLayer: (id) =>
        set((s) => {
            if (s.layers.length <= 1) return s;
            const layers = s.layers.filter((l) => l.id !== id);
            return {
                layers,
                selectedLayerId: s.selectedLayerId === id ? layers[0].id : s.selectedLayerId,
                sprites: s.sprites.filter((sp) => sp.layerId !== id),
            };
        }),

    selectLayer: (id) => set({ selectedLayerId: id }),

    updateLayer: (id, updates) =>
        set((s) => ({
            layers: s.layers.map((l) => (l.id === id ? { ...l, ...updates } : l)),
        })),

    reorderLayer: (id, newOrder) =>
        set((s) => ({
            layers: s.layers.map((l) => (l.id === id ? { ...l, order: newOrder } : l)),
        })),

    // ─── Camera ───

    panCamera: (dx, dy) =>
        set((s) => ({ camera: { ...s.camera, x: s.camera.x + dx, y: s.camera.y + dy } })),

    zoomCamera: (zoom) =>
        set((s) => ({ camera: { ...s.camera, zoom: Math.max(0.1, Math.min(5, zoom)) } })),

    resetCamera: () => set({ camera: { x: 0, y: 0, zoom: 1 } }),

    // ─── Tools ───

    setTool: (tool) => set({ activeTool: tool }),
    setShapeType: (shape) => set({ activeShapeType: shape }),
    setBrushColor: (color) => set({ brushColor: color }),
    setBrushSize: (size) => set({ brushSize: size }),
    toggleGrid: () => set((s) => ({ showGrid: !s.showGrid })),
    toggleSnap: () => set((s) => ({ snapToGrid: !s.snapToGrid })),

    // ─── Editor ───

    togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),

    // ─── History ───

    pushHistory: () =>
        set((s) => ({
            history: [...s.history.slice(0, s.historyIndex + 1), { sprites: [...s.sprites] }],
            historyIndex: s.historyIndex + 1,
        })),

    undo: () =>
        set((s) => {
            if (s.historyIndex <= 0) return s;
            const newIndex = s.historyIndex - 1;
            return { sprites: [...s.history[newIndex].sprites], historyIndex: newIndex, selectedSpriteId: null };
        }),

    redo: () =>
        set((s) => {
            if (s.historyIndex >= s.history.length - 1) return s;
            const newIndex = s.historyIndex + 1;
            return { sprites: [...s.history[newIndex].sprites], historyIndex: newIndex, selectedSpriteId: null };
        }),
}));
