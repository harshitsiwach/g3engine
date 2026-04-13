'use client';

import { Node, Edge } from '@xyflow/react';
import { WEB3_NODE_EXECUTORS, Web3RuntimeContext } from './web3Runtime';
import { EVM_NODE_EXECUTORS, EVMRuntimeContext } from './evmRuntime';

// ---------- Types ----------

export interface CompiledAction {
    id: string;
    eventType: 'start' | 'update' | 'keyPress' | 'click' | 'collision' | 'walletConnect' | 'chain' | 'custom';
    eventLabel: string;
    eventParams: Record<string, unknown>;
    actionType: string;
    actionLabel: string;
    params: Record<string, unknown>;
    nextActionId?: string; // For chaining actions
}

export interface CompiledScript {
    version: number;
    actions: CompiledAction[];
    entryPoints: string[]; // action IDs that trigger on game start
    updateLoop: string[];  // action IDs that run every frame
    keyHandlers: Record<string, string[]>; // key → action IDs
    clickHandlers: string[]; // action IDs triggered on click
    collisionHandlers: string[]; // action IDs triggered on collision
}

// ---------- Node Type Registry ----------

interface NodeDefinition {
    category: 'event' | 'action' | 'web3' | 'logic' | 'variable' | 'math' | 'flow';
    parse: (data: Record<string, unknown>) => Record<string, unknown>;
}

const NODE_REGISTRY: Record<string, NodeDefinition> = {
    // Events
    'On Start': {
        category: 'event',
        parse: () => ({ trigger: 'start' }),
    },
    'On Update': {
        category: 'event',
        parse: () => ({ trigger: 'update' }),
    },
    'On Key Press': {
        category: 'event',
        parse: (d) => ({ trigger: 'keyPress', key: d.key || 'Space' }),
    },
    'On Click': {
        category: 'event',
        parse: () => ({ trigger: 'click' }),
    },
    'On Collision': {
        category: 'event',
        parse: (d) => ({ trigger: 'collision', target: d.target }),
    },
    'On Wallet Connect': {
        category: 'event',
        parse: () => ({ trigger: 'walletConnect' }),
    },

    // Actions
    'Move Character': {
        category: 'action',
        parse: (d) => ({
            type: 'move',
            targetId: d.targetId,
            direction: d.direction || 'forward',
            speed: Number(d.speed) || 0.1,
            axis: d.axis || 'x',
        }),
    },
    'Rotate Object': {
        category: 'action',
        parse: (d) => ({
            type: 'rotate',
            targetId: d.targetId,
            axis: d.axis || 'y',
            speed: Number(d.speed) || 0.02,
        }),
    },
    'Set Position': {
        category: 'action',
        parse: (d) => ({
            type: 'setPosition',
            targetId: d.targetId,
            x: Number(d.x) || 0,
            y: Number(d.y) || 0,
            z: Number(d.z) || 0,
        }),
    },
    'Show/Hide Object': {
        category: 'action',
        parse: (d) => ({
            type: 'toggleVisibility',
            targetId: d.targetId,
            visible: d.visible !== false,
        }),
    },
    'Play Sound': {
        category: 'action',
        parse: (d) => ({
            type: 'playSound',
            soundId: d.soundId,
            volume: Number(d.volume) || 1,
            loop: d.loop === true,
        }),
    },
    'Change Color': {
        category: 'action',
        parse: (d) => ({
            type: 'changeColor',
            targetId: d.targetId,
            color: d.color || '#ff0000',
        }),
    },
    'Apply Force': {
        category: 'action',
        parse: (d) => ({
            type: 'applyForce',
            targetId: d.targetId,
            x: Number(d.forceX) || 0,
            y: Number(d.forceY) || 0,
            z: Number(d.forceZ) || 0,
        }),
    },
    'Destroy Object': {
        category: 'action',
        parse: (d) => ({
            type: 'destroy',
            targetId: d.targetId,
        }),
    },
    'Spawn Object': {
        category: 'action',
        parse: (d) => ({
            type: 'spawn',
            objectType: d.objectType || 'box',
            x: Number(d.x) || 0,
            y: Number(d.y) || 0,
            z: Number(d.z) || 0,
        }),
    },

    // Web3 - Solana
    '🚀 Launch Token (Pump.fun)': {
        category: 'web3',
        parse: (d) => ({
            type: 'solana',
            executor: '🚀 Launch Token (Pump.fun)',
            name: d.name || 'GameToken',
            symbol: d.symbol || 'GAME',
            imageUri: d.imageUri || '',
        }),
    },
    '💰 Buy Token (Pump.fun)': {
        category: 'web3',
        parse: (d) => ({
            type: 'solana',
            executor: '💰 Buy Token (Pump.fun)',
            tokenMint: d.tokenMint,
            solAmount: Number(d.solAmount) || 0.01,
        }),
    },
    '💸 Sell Token (Pump.fun)': {
        category: 'web3',
        parse: (d) => ({
            type: 'solana',
            executor: '💸 Sell Token (Pump.fun)',
            tokenMint: d.tokenMint,
            tokenAmount: Number(d.tokenAmount) || 1000,
        }),
    },
    '🎨 Mint NFT': {
        category: 'web3',
        parse: (d) => ({
            type: 'solana',
            executor: '🎨 Mint NFT',
            name: d.name || 'Game NFT',
            imageUri: d.imageUri || '',
        }),
    },
    '🔐 Token Gate': {
        category: 'web3',
        parse: (d) => ({
            type: 'solana',
            executor: '🔐 Token Gate',
            tokenMint: d.tokenMint,
            minBalance: Number(d.minBalance) || 1,
        }),
    },
    '💎 Check Balance': {
        category: 'web3',
        parse: (d) => ({
            type: 'solana',
            executor: '💎 Check Balance',
            tokenMint: d.tokenMint,
        }),
    },
    '🎁 Reward Player': {
        category: 'web3',
        parse: (d) => ({
            type: 'solana',
            executor: '🎁 Reward Player',
            rewardType: d.rewardType || 'token_drop',
            amount: Number(d.amount) || 10,
            opts: {
                tokenMint: d.tokenMint,
                tokenSymbol: d.tokenSymbol,
                nftName: d.nftName,
            },
        }),
    },

    // Web3 - EVM
    'Ξ Send ETH': {
        category: 'web3',
        parse: (d) => ({
            type: 'evm',
            executor: 'Ξ Send ETH',
            recipient: d.recipient,
            amount: d.amount || '0.01',
        }),
    },
    '💰 Transfer ERC-20': {
        category: 'web3',
        parse: (d) => ({
            type: 'evm',
            executor: '💰 Transfer ERC-20',
            tokenAddress: d.tokenAddress,
            recipient: d.recipient,
            amount: d.amount || '10',
        }),
    },
    '🎨 Mint NFT (EVM)': {
        category: 'web3',
        parse: (d) => ({
            type: 'evm',
            executor: '🎨 Mint NFT (EVM)',
            contractAddress: d.contractAddress,
            metadataUri: d.metadataUri || '',
        }),
    },
    '🔐 Token Gate (EVM)': {
        category: 'web3',
        parse: (d) => ({
            type: 'evm',
            executor: '🔐 Token Gate (EVM)',
            contractAddress: d.contractAddress,
            minBalance: Number(d.minBalance) || 1,
        }),
    },

    // Logic
    'If Condition': {
        category: 'logic',
        parse: (d) => ({
            type: 'condition',
            variable: d.variable,
            operator: d.operator || '==',
            value: d.value,
        }),
    },
    'Wait': {
        category: 'logic',
        parse: (d) => ({
            type: 'wait',
            duration: Number(d.duration) || 1000,
        }),
    },
    'Repeat N Times': {
        category: 'logic',
        parse: (d) => ({
            type: 'repeat',
            count: Number(d.count) || 3,
        }),
    },
};

// ---------- Compiler ----------

/**
 * Traverses the React Flow graph and produces a compiled script
 * that can be consumed by the game loop runtime.
 */
export function compileGraph(nodes: Node[], edges: Edge[]): CompiledScript {
    const nodeMap = new Map<string, Node>();
    nodes.forEach((n) => nodeMap.set(n.id, n));

    // Build adjacency map from edges
    const adjacency = new Map<string, string[]>(); // sourceId → [targetIds]
    for (const edge of edges) {
        if (!adjacency.has(edge.source)) adjacency.set(edge.source, []);
        adjacency.get(edge.source)!.push(edge.target);
    }

    const actions: CompiledAction[] = [];
    const entryPoints: string[] = [];
    const updateLoop: string[] = [];
    const keyHandlers: Record<string, string[]> = {};
    const clickHandlers: string[] = [];
    const collisionHandlers: string[] = [];

    // Process each node
    for (const [nodeId, node] of nodeMap) {
        const data = node.data as Record<string, unknown>;
        const label = String(data.label || node.id);
        const def = NODE_REGISTRY[label];
        const category = def?.category || 'action';
        const params = def?.parse(data) || data;

        const action: CompiledAction = {
            id: nodeId,
            eventType: category === 'event' ? (params.trigger as any || 'custom') : 'chain',
            eventLabel: label,
            eventParams: category === 'event' ? params : {},
            actionType: String(params.type || 'custom'),
            actionLabel: label,
            params,
            nextActionId: adjacency.get(nodeId)?.[0], // First connected target
        };

        actions.push(action);

        // Categorize by event type
        if (params.trigger === 'start') {
            entryPoints.push(nodeId);
        } else if (params.trigger === 'update') {
            updateLoop.push(nodeId);
        } else if (params.trigger === 'keyPress') {
            const key = String(params.key || 'Space');
            if (!keyHandlers[key]) keyHandlers[key] = [];
            keyHandlers[key].push(nodeId);
        } else if (params.trigger === 'click') {
            clickHandlers.push(nodeId);
        } else if (params.trigger === 'collision') {
            collisionHandlers.push(nodeId);
        }
    }

    return {
        version: 1,
        actions,
        entryPoints,
        updateLoop,
        keyHandlers,
        clickHandlers,
        collisionHandlers,
    };
}

// ---------- Game Loop Runtime ----------

/**
 * Creates a game loop runtime from a compiled script.
 * Returns handlers that can be attached to the Three.js game loop.
 */
export interface GameLoopHandlers {
    onStart: () => void;
    onUpdate: (deltaTime: number, frameCount: number) => void;
    onKeyDown: (key: string) => void;
    onKeyUp: (key: string) => void;
    onClick: (objectId: string | null) => void;
    onCollision: (objectA: string, objectB: string) => void;
    destroy: () => void;
}

interface ObjectTransform {
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number };
    velocity?: { x: number; y: number; z: number };
}

export function createGameLoopRuntime(
    script: CompiledScript,
    sceneObjects: Map<string, ObjectTransform>,
    updateObject: (id: string, field: string, value: unknown) => void,
    web3Ctx: Web3RuntimeContext | null,
    evmCtx: EVMRuntimeContext | null,
): GameLoopHandlers {
    const actionMap = new Map<string, CompiledAction>();
    script.actions.forEach((a) => actionMap.set(a.id, a));

    const pressedKeys = new Set<string>();
    let destroyed = false;

    // Execute an action chain starting from a given action ID
    async function executeActionChain(startId: string): Promise<void> {
        let currentId: string | undefined = startId;

        while (currentId && !destroyed) {
            const action = actionMap.get(currentId);
            if (!action) break;

            await executeAction(action);
            currentId = action.nextActionId;
        }
    }

    // Execute a single action
    async function executeAction(action: CompiledAction): Promise<void> {
        const p = action.params;

        // Scene manipulation actions
        switch (action.actionType) {
            case 'move': {
                const targetId = String(p.targetId || '');
                const obj = sceneObjects.get(targetId);
                if (!obj) break;
                const speed = Number(p.speed) || 0.1;
                const axis = String(p.axis || 'x');
                const dir = String(p.direction || 'forward');
                const multiplier = dir === 'forward' || dir === 'up' || dir === 'right' ? 1 : -1;

                const newPos = { ...obj.position };
                if (axis === 'x') newPos.x += speed * multiplier;
                else if (axis === 'y') newPos.y += speed * multiplier;
                else if (axis === 'z') newPos.z += speed * multiplier;

                updateObject(targetId, 'position', newPos);
                sceneObjects.set(targetId, { ...obj, position: newPos });
                break;
            }

            case 'rotate': {
                const targetId = String(p.targetId || '');
                const obj = sceneObjects.get(targetId);
                if (!obj) break;
                const speed = Number(p.speed) || 0.02;
                const axis = String(p.axis || 'y');

                const newRot = { ...obj.rotation };
                if (axis === 'x') newRot.x += speed;
                else if (axis === 'y') newRot.y += speed;
                else if (axis === 'z') newRot.z += speed;

                updateObject(targetId, 'rotation', newRot);
                sceneObjects.set(targetId, { ...obj, rotation: newRot });
                break;
            }

            case 'setPosition': {
                const targetId = String(p.targetId || '');
                updateObject(targetId, 'position', {
                    x: Number(p.x),
                    y: Number(p.y),
                    z: Number(p.z),
                });
                break;
            }

            case 'toggleVisibility': {
                const targetId = String(p.targetId || '');
                updateObject(targetId, 'visible', p.visible !== false);
                break;
            }

            case 'changeColor': {
                const targetId = String(p.targetId || '');
                updateObject(targetId, 'material', { color: String(p.color || '#ff0000') });
                break;
            }

            case 'spawn': {
                // Spawn is handled by the editor store
                console.log(`[GameLoop] Spawn: ${p.objectType} at (${p.x}, ${p.y}, ${p.z})`);
                break;
            }

            case 'destroy': {
                const targetId = String(p.targetId || '');
                updateObject(targetId, 'visible', false);
                sceneObjects.delete(targetId);
                break;
            }

            // Web3 actions
            default: {
                if (p.type === 'solana' && web3Ctx) {
                    const executor = WEB3_NODE_EXECUTORS[p.executor as string];
                    if (executor) {
                        try {
                            const args = Object.values(p).filter(v => typeof v !== 'object' || v === null);
                            const result = await executor(web3Ctx, ...args);
                            console.log(`[GameLoop] Web3 (Solana): ${p.executor}`, result);
                        } catch (err) {
                            console.error(`[GameLoop] Web3 error: ${p.executor}`, err);
                        }
                    }
                } else if (p.type === 'evm' && evmCtx) {
                    const executor = EVM_NODE_EXECUTORS[p.executor as string];
                    if (executor) {
                        try {
                            const args = Object.values(p).filter(v => typeof v !== 'object' || v === null);
                            const result = await executor(evmCtx, ...args);
                            console.log(`[GameLoop] Web3 (EVM): ${p.executor}`, result);
                        } catch (err) {
                            console.error(`[GameLoop] EVM error: ${p.executor}`, err);
                        }
                    }
                } else if (action.actionType === 'wait') {
                    await new Promise((resolve) => setTimeout(resolve, Number(p.duration) || 1000));
                } else if (action.actionType === 'repeat') {
                    const count = Number(p.count) || 3;
                    for (let i = 0; i < count && !destroyed; i++) {
                        if (action.nextActionId) {
                            await executeActionChain(action.nextActionId);
                        }
                    }
                } else {
                    console.log(`[GameLoop] Unhandled action: ${action.actionType}`, p);
                }
                break;
            }
        }
    }

    return {
        onStart() {
            for (const id of script.entryPoints) {
                executeActionChain(id);
            }
        },

        onUpdate(deltaTime: number, frameCount: number) {
            for (const id of script.updateLoop) {
                const action = actionMap.get(id);
                if (action) {
                    executeAction(action);
                }
            }
        },

        onKeyDown(key: string) {
            pressedKeys.add(key);
            const handlers = script.keyHandlers[key] || script.keyHandlers['*'];
            if (handlers) {
                for (const id of handlers) {
                    executeActionChain(id);
                }
            }
        },

        onKeyUp(key: string) {
            pressedKeys.delete(key);
        },

        onClick(objectId: string | null) {
            for (const id of script.clickHandlers) {
                executeActionChain(id);
            }
        },

        onCollision(objectA: string, objectB: string) {
            for (const id of script.collisionHandlers) {
                executeActionChain(id);
            }
        },

        destroy() {
            destroyed = true;
        },
    };
}

// ---------- Serialization ----------

export function serializeScript(script: CompiledScript): string {
    return JSON.stringify(script, null, 2);
}

export function deserializeScript(json: string): CompiledScript {
    return JSON.parse(json) as CompiledScript;
}
