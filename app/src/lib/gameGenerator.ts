'use client';

/**
 * Game Generator — Parses AI JSON responses into executable editor commands.
 * Translates structured commands into actual Zustand store actions.
 */

import { useEditorStore, ObjectType } from '@/store/editorStore';
import { useEditor2DStore } from '@/store/editor2DStore';

// ---------- Command Types ----------

export interface GameCommand {
    type: 'add_object' | 'add_sprite' | 'set_transform' | 'set_material' | 'enable_web3' | 'message';
    [key: string]: any;
}

// ---------- Parser ----------

/**
 * Extract JSON command array from AI response text.
 * Looks for ```json ... ``` blocks.
 */
export function parseAIResponse(text: string): { commands: GameCommand[]; plainText: string } {
    const jsonMatch = text.match(/```json\s*([\s\S]*?)```/);
    let commands: GameCommand[] = [];
    let plainText = text;

    if (jsonMatch) {
        try {
            const parsed = JSON.parse(jsonMatch[1]);
            if (Array.isArray(parsed)) {
                commands = parsed;
            }
            // Remove JSON block from plain text
            plainText = text.replace(/```json[\s\S]*?```/, '').trim();
        } catch (e) {
            console.warn('[GameGenerator] Failed to parse JSON commands:', e);
        }
    }

    // Also extract message commands as text
    const messageCommands = commands.filter((c) => c.type === 'message');
    if (messageCommands.length > 0) {
        const msgs = messageCommands.map((c) => c.text).join('\n');
        if (!plainText) plainText = msgs;
    }

    return { commands: commands.filter((c) => c.type !== 'message'), plainText };
}

// ---------- 3D Executor ----------

const VALID_3D_TYPES: ObjectType[] = ['box', 'sphere', 'cylinder', 'plane', 'cone', 'torus', 'pointLight', 'directionalLight', 'ambientLight', 'camera'];

export function execute3DCommands(commands: GameCommand[]): string[] {
    const log: string[] = [];
    const store = useEditorStore.getState();

    for (const cmd of commands) {
        try {
            switch (cmd.type) {
                case 'add_object': {
                    const objType = cmd.objectType as ObjectType;
                    if (!VALID_3D_TYPES.includes(objType)) {
                        log.push(`⚠️ Unknown object type: ${cmd.objectType}`);
                        continue;
                    }

                    // Add the object
                    store.addObject(objType);
                    const objects = useEditorStore.getState().objects;
                    const newObj = objects[objects.length - 1];

                    // Apply name
                    if (cmd.name) {
                        store.renameObject(newObj.id, cmd.name);
                    }

                    // Apply transform
                    if (cmd.position) {
                        store.updateTransform(newObj.id, 'position', {
                            x: cmd.position.x ?? 0,
                            y: cmd.position.y ?? 0.5,
                            z: cmd.position.z ?? 0,
                        });
                    }
                    if (cmd.rotation) {
                        store.updateTransform(newObj.id, 'rotation', {
                            x: cmd.rotation.x ?? 0,
                            y: cmd.rotation.y ?? 0,
                            z: cmd.rotation.z ?? 0,
                        });
                    }
                    if (cmd.scale) {
                        store.updateTransform(newObj.id, 'scale', {
                            x: cmd.scale.x ?? 1,
                            y: cmd.scale.y ?? 1,
                            z: cmd.scale.z ?? 1,
                        });
                    }

                    // Apply material
                    if (cmd.material) {
                        store.updateMaterial(newObj.id, cmd.material);
                    }

                    log.push(`✅ Added ${objType}: "${cmd.name || newObj.name}"`);
                    break;
                }

                case 'set_transform': {
                    const objects = useEditorStore.getState().objects;
                    const target = objects.find((o) => o.name === cmd.name);
                    if (!target) {
                        log.push(`⚠️ Object not found: "${cmd.name}"`);
                        continue;
                    }
                    if (cmd.position) store.updateTransform(target.id, 'position', cmd.position);
                    if (cmd.rotation) store.updateTransform(target.id, 'rotation', cmd.rotation);
                    if (cmd.scale) store.updateTransform(target.id, 'scale', cmd.scale);
                    log.push(`✅ Updated transform: "${cmd.name}"`);
                    break;
                }

                case 'set_material': {
                    const objects = useEditorStore.getState().objects;
                    const target = objects.find((o) => o.name === cmd.name);
                    if (!target) {
                        log.push(`⚠️ Object not found: "${cmd.name}"`);
                        continue;
                    }
                    if (cmd.material) store.updateMaterial(target.id, cmd.material);
                    log.push(`✅ Updated material: "${cmd.name}"`);
                    break;
                }

                case 'enable_web3': {
                    const editorState = useEditorStore.getState();
                    if (!editorState.web3Enabled) {
                        editorState.toggleWeb3();
                    }
                    log.push('✅ Web3 enabled');
                    break;
                }

                default:
                    break;
            }
        } catch (e: any) {
            log.push(`❌ Error executing ${cmd.type}: ${e.message}`);
        }
    }

    // Push history after batch
    if (commands.length > 0) {
        useEditorStore.getState().pushHistory();
    }

    return log;
}

// ---------- 2D Executor ----------

export function execute2DCommands(commands: GameCommand[]): string[] {
    const log: string[] = [];
    const store = useEditor2DStore.getState();

    for (const cmd of commands) {
        try {
            if (cmd.type === 'add_sprite') {
                store.addSprite({
                    name: cmd.name,
                    type: cmd.spriteType || 'sprite',
                    x: cmd.x ?? 400,
                    y: cmd.y ?? 300,
                    width: cmd.width ?? 64,
                    height: cmd.height ?? 64,
                    fillColor: cmd.fillColor ?? '#6366f1',
                    strokeColor: cmd.strokeColor,
                    emoji: cmd.emoji,
                    shapeType: cmd.shapeType,
                    text: cmd.text,
                    fontSize: cmd.fontSize,
                    fontFamily: cmd.fontFamily,
                });
                log.push(`✅ Added sprite: "${cmd.name || 'Sprite'}"`);
            }
        } catch (e: any) {
            log.push(`❌ Error: ${e.message}`);
        }
    }

    if (commands.length > 0) {
        useEditor2DStore.getState().pushHistory();
    }

    return log;
}

// ---------- Auto-detect & Execute ----------

export function executeCommands(commands: GameCommand[], editorMode: '2d' | '3d' = '3d'): string[] {
    const has3D = commands.some((c) => c.type === 'add_object' || c.type === 'set_transform' || c.type === 'set_material');
    const has2D = commands.some((c) => c.type === 'add_sprite');

    const log: string[] = [];

    if (has3D || editorMode === '3d') {
        log.push(...execute3DCommands(commands.filter((c) => c.type !== 'add_sprite')));
    }
    if (has2D || editorMode === '2d') {
        log.push(...execute2DCommands(commands.filter((c) => c.type === 'add_sprite')));
    }

    // Handle enable_web3 separately
    const web3Cmds = commands.filter((c) => c.type === 'enable_web3');
    if (web3Cmds.length > 0) {
        log.push(...execute3DCommands(web3Cmds));
    }

    return log;
}
