import { SceneObject } from '@/store/editorStore';

export interface SceneExport {
    version: number;
    exportedAt: string;
    objects: SceneObject[];
    metadata: {
        objectCount: number;
        hasLights: boolean;
        hasWeb3: boolean;
    };
}

/**
 * Export the current scene state to a serializable JSON format
 */
export function exportScene(objects: SceneObject[], web3Enabled: boolean): SceneExport {
    return {
        version: 1,
        exportedAt: new Date().toISOString(),
        objects: objects.map((obj) => ({ ...obj })),
        metadata: {
            objectCount: objects.length,
            hasLights: objects.some((o) => o.type.includes('Light')),
            hasWeb3: web3Enabled,
        },
    };
}

/**
 * Import a scene from JSON
 */
export function importScene(json: string): SceneObject[] | null {
    try {
        const data: SceneExport = JSON.parse(json);
        if (data.version && Array.isArray(data.objects)) {
            return data.objects;
        }
        return null;
    } catch {
        console.error('Failed to parse scene JSON');
        return null;
    }
}

/**
 * Export scene to a downloadable JSON blob
 */
export function downloadSceneAsJSON(objects: SceneObject[], web3Enabled: boolean): void {
    const sceneData = exportScene(objects, web3Enabled);
    const blob = new Blob([JSON.stringify(sceneData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `game-scene-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
}
