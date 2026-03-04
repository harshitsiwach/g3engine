'use client';

import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

// ---------- Types ----------

export type ObjectType = 'box' | 'sphere' | 'cylinder' | 'plane' | 'cone' | 'torus' | 'pointLight' | 'directionalLight' | 'ambientLight' | 'camera';

export interface Vec3 {
    x: number;
    y: number;
    z: number;
}

export interface MaterialProps {
    color: string;
    roughness: number;
    metalness: number;
    emissive?: string;
    emissiveIntensity?: number;
    opacity?: number;
    transparent?: boolean;
}

export interface SceneObject {
    id: string;
    name: string;
    type: ObjectType;
    position: Vec3;
    rotation: Vec3;
    scale: Vec3;
    material: MaterialProps;
    visible: boolean;
    lightIntensity?: number;
    lightColor?: string;
}

export interface HistoryEntry {
    objects: SceneObject[];
}

export type TransformMode = 'translate' | 'rotate' | 'scale';

export interface EditorState {
    // Scene graph
    objects: SceneObject[];
    selectedObjectId: string | null;

    // Editor mode
    isPlaying: boolean;
    transformMode: TransformMode;
    web3Enabled: boolean;

    // History (undo/redo)
    history: HistoryEntry[];
    historyIndex: number;

    // Tour
    runTour: boolean;
    setRunTour: (r: boolean) => void;

    // --- Actions ---

    // Object CRUD
    addObject: (type: ObjectType) => void;
    removeObject: (id: string) => void;
    duplicateObject: (id: string) => void;
    selectObject: (id: string | null) => void;

    // Transform
    updateTransform: (id: string, field: 'position' | 'rotation' | 'scale', value: Vec3) => void;
    updateMaterial: (id: string, material: Partial<MaterialProps>) => void;
    setTransformMode: (mode: TransformMode) => void;
    renameObject: (id: string, name: string) => void;

    // Editor
    togglePlay: () => void;
    toggleWeb3: () => void;

    // History
    pushHistory: () => void;
    undo: () => void;
    redo: () => void;

    // Serialization
    exportScene: () => string;
    importScene: (json: string) => void;
}

// ---------- Defaults ----------

const DEFAULT_MATERIAL: MaterialProps = {
    color: '#6366f1',
    roughness: 0.4,
    metalness: 0.1,
};

const OBJECT_NAMES: Record<ObjectType, string> = {
    box: 'Cube',
    sphere: 'Sphere',
    cylinder: 'Cylinder',
    plane: 'Plane',
    cone: 'Cone',
    torus: 'Torus',
    pointLight: 'Point Light',
    directionalLight: 'Directional Light',
    ambientLight: 'Ambient Light',
    camera: 'Camera',
};

function makeDefaultObject(type: ObjectType, index: number): SceneObject {
    const base: SceneObject = {
        id: uuidv4(),
        name: `${OBJECT_NAMES[type]} ${index}`,
        type,
        position: { x: 0, y: type === 'plane' ? 0 : 0.5, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        material: { ...DEFAULT_MATERIAL },
        visible: true,
    };

    if (type === 'pointLight' || type === 'directionalLight' || type === 'ambientLight') {
        base.lightIntensity = 1;
        base.lightColor = '#ffffff';
        base.material.color = '#ffffff';
        base.material.emissive = '#ffffff';
        base.material.emissiveIntensity = 1;
    }

    if (type === 'plane') {
        base.scale = { x: 5, y: 5, z: 1 };
        base.rotation = { x: -Math.PI / 2, y: 0, z: 0 };
        base.material.color = '#2a2a3e';
    }

    return base;
}

// ---------- Store ----------

let objectCounter = 0;

export const useEditorStore = create<EditorState>((set, get) => ({
    objects: [],
    selectedObjectId: null,
    isPlaying: false,
    transformMode: 'translate',
    web3Enabled: false,
    history: [{ objects: [] }],
    historyIndex: 0,
    runTour: false,

    setRunTour: (r) => set({ runTour: r }),

    addObject: (type) => {
        objectCounter++;
        const obj = makeDefaultObject(type, objectCounter);
        set((s) => {
            const newObjects = [...s.objects, obj];
            return {
                objects: newObjects,
                selectedObjectId: obj.id,
                history: [...s.history.slice(0, s.historyIndex + 1), { objects: newObjects }],
                historyIndex: s.historyIndex + 1,
            };
        });
    },

    removeObject: (id) =>
        set((s) => {
            const newObjects = s.objects.filter((o) => o.id !== id);
            return {
                objects: newObjects,
                selectedObjectId: s.selectedObjectId === id ? null : s.selectedObjectId,
                history: [...s.history.slice(0, s.historyIndex + 1), { objects: newObjects }],
                historyIndex: s.historyIndex + 1,
            };
        }),

    duplicateObject: (id) => {
        const obj = get().objects.find((o) => o.id === id);
        if (!obj) return;
        objectCounter++;
        const dup: SceneObject = {
            ...obj,
            id: uuidv4(),
            name: `${obj.name} Copy`,
            position: { ...obj.position, x: obj.position.x + 1 },
        };
        set((s) => {
            const newObjects = [...s.objects, dup];
            return {
                objects: newObjects,
                selectedObjectId: dup.id,
                history: [...s.history.slice(0, s.historyIndex + 1), { objects: newObjects }],
                historyIndex: s.historyIndex + 1,
            };
        });
    },

    selectObject: (id) => set({ selectedObjectId: id }),

    updateTransform: (id, field, value) =>
        set((s) => ({
            objects: s.objects.map((o) => (o.id === id ? { ...o, [field]: value } : o)),
        })),

    updateMaterial: (id, material) =>
        set((s) => ({
            objects: s.objects.map((o) =>
                o.id === id ? { ...o, material: { ...o.material, ...material } } : o
            ),
        })),

    setTransformMode: (mode) => set({ transformMode: mode }),

    renameObject: (id, name) =>
        set((s) => ({
            objects: s.objects.map((o) => (o.id === id ? { ...o, name } : o)),
        })),

    togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying, selectedObjectId: null })),

    toggleWeb3: () => set((s) => ({ web3Enabled: !s.web3Enabled })),

    pushHistory: () =>
        set((s) => ({
            history: [...s.history.slice(0, s.historyIndex + 1), { objects: [...s.objects] }],
            historyIndex: s.historyIndex + 1,
        })),

    undo: () =>
        set((s) => {
            if (s.historyIndex <= 0) return s;
            const newIndex = s.historyIndex - 1;
            return {
                objects: [...s.history[newIndex].objects],
                historyIndex: newIndex,
                selectedObjectId: null,
            };
        }),

    redo: () =>
        set((s) => {
            if (s.historyIndex >= s.history.length - 1) return s;
            const newIndex = s.historyIndex + 1;
            return {
                objects: [...s.history[newIndex].objects],
                historyIndex: newIndex,
                selectedObjectId: null,
            };
        }),

    exportScene: () => {
        const { objects } = get();
        return JSON.stringify({ version: 1, objects }, null, 2);
    },

    importScene: (json) => {
        try {
            const data = JSON.parse(json);
            if (data.objects && Array.isArray(data.objects)) {
                set({
                    objects: data.objects,
                    selectedObjectId: null,
                    history: [{ objects: data.objects }],
                    historyIndex: 0,
                });
            }
        } catch (e) {
            console.error('Failed to import scene:', e);
        }
    },
}));
