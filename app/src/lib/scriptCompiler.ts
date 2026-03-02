'use client';

import { Node, Edge } from '@xyflow/react';

// ---------- Types ----------

export interface CompiledAction {
    eventType: string;
    eventLabel: string;
    actionType: string;
    actionLabel: string;
    params: Record<string, unknown>;
}

export interface CompiledScript {
    actions: CompiledAction[];
}

// ---------- Compiler ----------

/**
 * Traverses the React Flow graph (nodes + edges) and produces
 * an array of compiled actions that can be consumed by the
 * Three.js game loop.
 *
 * Each compiled action pairs an EventNode with an ActionNode
 * (or Web3Node) based on the edges connecting them.
 */
export function compileGraph(nodes: Node[], edges: Edge[]): CompiledScript {
    const nodeMap = new Map<string, Node>();
    nodes.forEach((n) => nodeMap.set(n.id, n));

    const actions: CompiledAction[] = [];

    // Walk each edge: source → target
    for (const edge of edges) {
        const source = nodeMap.get(edge.source);
        const target = nodeMap.get(edge.target);

        if (!source || !target) continue;

        // Determine event type
        let eventType = 'unknown';
        if (source.type === 'eventNode') {
            const label = String((source.data as any)?.label || '').toLowerCase();
            if (label.includes('key') || label.includes('wasd')) eventType = 'keyPress';
            else if (label.includes('click')) eventType = 'click';
            else if (label.includes('start')) eventType = 'start';
            else if (label.includes('update') || label.includes('tick')) eventType = 'update';
            else if (label.includes('wallet') || label.includes('connect')) eventType = 'walletConnect';
            else eventType = 'custom';
        } else if (source.type === 'actionNode' || source.type === 'web3Node') {
            // Chained actions: action→action or action→web3
            eventType = 'chain';
        }

        // Determine action type
        let actionType = 'unknown';
        if (target.type === 'actionNode') {
            const label = String((target.data as any)?.label || '').toLowerCase();
            if (label.includes('move')) actionType = 'moveCharacter';
            else if (label.includes('hide') || label.includes('show')) actionType = 'toggleVisibility';
            else if (label.includes('play') && label.includes('anim')) actionType = 'playAnimation';
            else if (label.includes('play') && label.includes('sound')) actionType = 'playSound';
            else if (label.includes('rotate')) actionType = 'rotateObject';
            else actionType = 'customAction';
        } else if (target.type === 'web3Node') {
            const label = String((target.data as any)?.label || '').toLowerCase();
            if (label.includes('mint')) actionType = 'mintNFT';
            else if (label.includes('transfer') || label.includes('send')) actionType = 'transferToken';
            else if (label.includes('gate') || label.includes('require')) actionType = 'nftGate';
            else actionType = 'web3Custom';
        }

        actions.push({
            eventType,
            eventLabel: String((source.data as any)?.label || source.id),
            actionType,
            actionLabel: String((target.data as any)?.label || target.id),
            params: {},
        });
    }

    return { actions };
}

/**
 * Takes compiled actions and generates executable callback registrations
 * that can be consumed by a Three.js game loop.
 */
export function generateCallbacks(script: CompiledScript): (() => void)[] {
    return script.actions.map((action) => {
        return () => {
            console.log(`[GameLoop] Event: ${action.eventType} (${action.eventLabel}) → Action: ${action.actionType} (${action.actionLabel})`);
        };
    });
}

/**
 * Serialize compiled script to JSON for storage/export
 */
export function serializeScript(script: CompiledScript): string {
    return JSON.stringify(script, null, 2);
}
