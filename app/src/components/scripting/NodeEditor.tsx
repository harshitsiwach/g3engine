'use client';

import React, { useCallback, useState } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    addEdge,
    useNodesState,
    useEdgesState,
    Connection,
    Node,
    Edge,
    Handle,
    Position,
    NodeProps,
    BackgroundVariant,
    Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// ─── Pin Styles ───

const pinColors: Record<string, string> = {
    exec: '#ffffff',
    boolean: '#cc0000',
    float: '#00cc88',
    int: '#06b6d4',
    string: '#f472b6',
    vector: '#eab308',
    object: '#3b82f6',
    any: '#9ca3af',
};

const pinStyle = (type: string, pos: 'left' | 'right'): React.CSSProperties => ({
    background: pinColors[type] || '#9ca3af',
    width: 10,
    height: 10,
    borderRadius: type === 'exec' ? 2 : '50%',
    border: '2px solid rgba(0,0,0,0.3)',
    [pos === 'left' ? 'left' : 'right']: -6,
});

// ─── Node Header Color Map ───

const NODE_COLORS: Record<string, { bg: string; border: string; header: string }> = {
    event: { bg: 'rgba(220, 38, 38, 0.12)', border: 'rgba(220, 38, 38, 0.3)', header: '#dc2626' },
    action: { bg: 'rgba(59, 130, 246, 0.12)', border: 'rgba(59, 130, 246, 0.3)', header: '#3b82f6' },
    logic: { bg: 'rgba(128, 128, 128, 0.12)', border: 'rgba(128, 128, 128, 0.3)', header: '#6b7280' },
    variable: { bg: 'rgba(34, 197, 94, 0.12)', border: 'rgba(34, 197, 94, 0.3)', header: '#22c55e' },
    math: { bg: 'rgba(234, 179, 8, 0.12)', border: 'rgba(234, 179, 8, 0.3)', header: '#eab308' },
    web3: { bg: 'rgba(139, 92, 246, 0.12)', border: 'rgba(139, 92, 246, 0.3)', header: '#8b5cf6' },
    flow: { bg: 'rgba(20, 241, 149, 0.12)', border: 'rgba(20, 241, 149, 0.3)', header: '#14f195' },
};

// ─── Generic Blueprint Node Component ───

interface PinDef {
    id: string;
    label: string;
    type: string; // exec, boolean, float, int, string, vector, object
}

interface BlueprintNodeData {
    label: string;
    category: string;
    icon: string;
    description?: string;
    inputs: PinDef[];
    outputs: PinDef[];
    compact?: boolean;
}

function BlueprintNode({ data, selected }: NodeProps) {
    const d = data as unknown as BlueprintNodeData;
    const colors = NODE_COLORS[d.category] || NODE_COLORS.action;

    return (
        <div style={{
            minWidth: d.compact ? 140 : 180,
            background: '#1a1a28',
            border: `1.5px solid ${selected ? '#14f195' : colors.border}`,
            borderRadius: 8,
            boxShadow: selected
                ? '0 0 20px rgba(20,241,149,0.15)'
                : '0 4px 20px rgba(0,0,0,0.3)',
            fontSize: 11,
            overflow: 'hidden',
        }}>
            {/* Header */}
            <div style={{
                padding: '6px 10px',
                background: colors.bg,
                borderBottom: `1px solid ${colors.border}`,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
            }}>
                <span style={{ fontSize: 12 }}>{d.icon}</span>
                <span style={{ fontWeight: 700, color: colors.header, fontSize: 11, letterSpacing: '-0.01em' }}>
                    {d.label}
                </span>
            </div>

            {/* Pins */}
            <div style={{ padding: '6px 0', position: 'relative' }}>
                {/* Render rows — pair up inputs and outputs */}
                {Array.from({ length: Math.max(d.inputs.length, d.outputs.length) }).map((_, i) => {
                    const inp = d.inputs[i];
                    const out = d.outputs[i];
                    return (
                        <div key={i} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '3px 10px',
                            minHeight: 22,
                            position: 'relative',
                        }}>
                            {/* Input pin */}
                            {inp ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 5, position: 'relative' }}>
                                    <Handle
                                        type="target"
                                        position={Position.Left}
                                        id={inp.id}
                                        style={pinStyle(inp.type, 'left')}
                                    />
                                    <span style={{ color: '#9ca3b0', fontSize: 10 }}>{inp.label}</span>
                                </div>
                            ) : <div />}

                            {/* Output pin */}
                            {out ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 5, position: 'relative' }}>
                                    <span style={{ color: '#9ca3b0', fontSize: 10 }}>{out.label}</span>
                                    <Handle
                                        type="source"
                                        position={Position.Right}
                                        id={out.id}
                                        style={pinStyle(out.type, 'right')}
                                    />
                                </div>
                            ) : <div />}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ─── Node Type Registry ───

const nodeTypes = {
    blueprint: BlueprintNode,
};

// ─── Node Palette (drag-to-add) ───

interface NodeTemplate {
    label: string;
    category: string;
    icon: string;
    description: string;
    inputs: PinDef[];
    outputs: PinDef[];
    compact?: boolean;
}

const NODE_PALETTE: NodeTemplate[] = [
    // Events
    {
        label: 'Event Begin Play',
        category: 'event',
        icon: '⚡',
        description: 'Fires when the game starts',
        inputs: [],
        outputs: [
            { id: 'exec-out', label: '', type: 'exec' },
        ],
    },
    {
        label: 'Event Tick',
        category: 'event',
        icon: '🔄',
        description: 'Fires every frame',
        inputs: [],
        outputs: [
            { id: 'exec-out', label: '', type: 'exec' },
            { id: 'delta', label: 'Delta Time', type: 'float' },
        ],
    },
    {
        label: 'On Key Press',
        category: 'event',
        icon: '⌨️',
        description: 'Fires when a key is pressed',
        inputs: [],
        outputs: [
            { id: 'exec-out', label: '', type: 'exec' },
            { id: 'key', label: 'Key', type: 'string' },
        ],
    },
    {
        label: 'On Collision',
        category: 'event',
        icon: '💥',
        description: 'When two objects collide',
        inputs: [],
        outputs: [
            { id: 'exec-out', label: '', type: 'exec' },
            { id: 'other', label: 'Other Object', type: 'object' },
        ],
    },
    {
        label: 'On Click',
        category: 'event',
        icon: '👆',
        description: 'When an object is clicked',
        inputs: [],
        outputs: [
            { id: 'exec-out', label: '', type: 'exec' },
            { id: 'pos', label: 'Position', type: 'vector' },
        ],
    },

    // Actions
    {
        label: 'Move To',
        category: 'action',
        icon: '➡️',
        description: 'Move object to position',
        inputs: [
            { id: 'exec-in', label: '', type: 'exec' },
            { id: 'target', label: 'Target', type: 'object' },
            { id: 'position', label: 'Position', type: 'vector' },
            { id: 'speed', label: 'Speed', type: 'float' },
        ],
        outputs: [
            { id: 'exec-out', label: '', type: 'exec' },
            { id: 'done', label: 'Done', type: 'exec' },
        ],
    },
    {
        label: 'Rotate',
        category: 'action',
        icon: '🔄',
        description: 'Rotate an object',
        inputs: [
            { id: 'exec-in', label: '', type: 'exec' },
            { id: 'target', label: 'Target', type: 'object' },
            { id: 'angle', label: 'Degrees', type: 'float' },
        ],
        outputs: [
            { id: 'exec-out', label: '', type: 'exec' },
        ],
    },
    {
        label: 'Spawn Object',
        category: 'action',
        icon: '✨',
        description: 'Create a new object',
        inputs: [
            { id: 'exec-in', label: '', type: 'exec' },
            { id: 'type', label: 'Type', type: 'string' },
            { id: 'position', label: 'Position', type: 'vector' },
        ],
        outputs: [
            { id: 'exec-out', label: '', type: 'exec' },
            { id: 'object', label: 'Object', type: 'object' },
        ],
    },
    {
        label: 'Destroy',
        category: 'action',
        icon: '💀',
        description: 'Remove an object from scene',
        inputs: [
            { id: 'exec-in', label: '', type: 'exec' },
            { id: 'target', label: 'Target', type: 'object' },
        ],
        outputs: [
            { id: 'exec-out', label: '', type: 'exec' },
        ],
    },
    {
        label: 'Play Sound',
        category: 'action',
        icon: '🔊',
        description: 'Play an audio clip',
        inputs: [
            { id: 'exec-in', label: '', type: 'exec' },
            { id: 'sound', label: 'Sound', type: 'string' },
            { id: 'volume', label: 'Volume', type: 'float' },
        ],
        outputs: [
            { id: 'exec-out', label: '', type: 'exec' },
        ],
    },
    {
        label: 'Print String',
        category: 'action',
        icon: '📝',
        description: 'Output debug text',
        inputs: [
            { id: 'exec-in', label: '', type: 'exec' },
            { id: 'text', label: 'Text', type: 'string' },
        ],
        outputs: [
            { id: 'exec-out', label: '', type: 'exec' },
        ],
    },
    {
        label: 'Set Visible',
        category: 'action',
        icon: '👁️',
        description: 'Show or hide an object',
        inputs: [
            { id: 'exec-in', label: '', type: 'exec' },
            { id: 'target', label: 'Target', type: 'object' },
            { id: 'visible', label: 'Visible', type: 'boolean' },
        ],
        outputs: [
            { id: 'exec-out', label: '', type: 'exec' },
        ],
    },

    // Logic
    {
        label: 'Branch',
        category: 'logic',
        icon: '🔀',
        description: 'If/Else conditional',
        inputs: [
            { id: 'exec-in', label: '', type: 'exec' },
            { id: 'condition', label: 'Condition', type: 'boolean' },
        ],
        outputs: [
            { id: 'true', label: 'True', type: 'exec' },
            { id: 'false', label: 'False', type: 'exec' },
        ],
    },
    {
        label: 'Sequence',
        category: 'logic',
        icon: '📋',
        description: 'Execute in order',
        inputs: [
            { id: 'exec-in', label: '', type: 'exec' },
        ],
        outputs: [
            { id: 'then-0', label: 'Then 0', type: 'exec' },
            { id: 'then-1', label: 'Then 1', type: 'exec' },
            { id: 'then-2', label: 'Then 2', type: 'exec' },
        ],
    },
    {
        label: 'Delay',
        category: 'flow',
        icon: '⏱️',
        description: 'Wait for duration',
        inputs: [
            { id: 'exec-in', label: '', type: 'exec' },
            { id: 'duration', label: 'Seconds', type: 'float' },
        ],
        outputs: [
            { id: 'exec-out', label: 'Completed', type: 'exec' },
        ],
    },
    {
        label: 'For Loop',
        category: 'logic',
        icon: '🔁',
        description: 'Loop N times',
        inputs: [
            { id: 'exec-in', label: '', type: 'exec' },
            { id: 'count', label: 'Count', type: 'int' },
        ],
        outputs: [
            { id: 'body', label: 'Loop Body', type: 'exec' },
            { id: 'index', label: 'Index', type: 'int' },
            { id: 'completed', label: 'Completed', type: 'exec' },
        ],
    },

    // Variables / Math
    {
        label: 'Get Position',
        category: 'variable',
        icon: '📍',
        description: 'Get object position',
        inputs: [
            { id: 'target', label: 'Target', type: 'object' },
        ],
        outputs: [
            { id: 'position', label: 'Position', type: 'vector' },
        ],
        compact: true,
    },
    {
        label: 'Add',
        category: 'math',
        icon: '➕',
        description: 'Add two numbers',
        inputs: [
            { id: 'a', label: 'A', type: 'float' },
            { id: 'b', label: 'B', type: 'float' },
        ],
        outputs: [
            { id: 'result', label: 'Result', type: 'float' },
        ],
        compact: true,
    },
    {
        label: 'Multiply',
        category: 'math',
        icon: '✖️',
        description: 'Multiply two numbers',
        inputs: [
            { id: 'a', label: 'A', type: 'float' },
            { id: 'b', label: 'B', type: 'float' },
        ],
        outputs: [
            { id: 'result', label: 'Result', type: 'float' },
        ],
        compact: true,
    },
    {
        label: 'Compare',
        category: 'math',
        icon: '⚖️',
        description: 'Compare two values',
        inputs: [
            { id: 'a', label: 'A', type: 'float' },
            { id: 'b', label: 'B', type: 'float' },
        ],
        outputs: [
            { id: 'gt', label: 'A > B', type: 'boolean' },
            { id: 'eq', label: 'A = B', type: 'boolean' },
            { id: 'lt', label: 'A < B', type: 'boolean' },
        ],
        compact: true,
    },
    {
        label: 'Random Float',
        category: 'math',
        icon: '🎲',
        description: 'Random number in range',
        inputs: [
            { id: 'min', label: 'Min', type: 'float' },
            { id: 'max', label: 'Max', type: 'float' },
        ],
        outputs: [
            { id: 'value', label: 'Value', type: 'float' },
        ],
        compact: true,
    },

    // Web3
    {
        label: 'Mint NFT',
        category: 'web3',
        icon: '⬡',
        description: 'Mint an NFT token',
        inputs: [
            { id: 'exec-in', label: '', type: 'exec' },
            { id: 'metadata', label: 'Metadata', type: 'string' },
        ],
        outputs: [
            { id: 'exec-out', label: '', type: 'exec' },
            { id: 'tokenId', label: 'Token ID', type: 'int' },
        ],
    },
    {
        label: 'Check Balance',
        category: 'web3',
        icon: '💰',
        description: 'Get wallet token balance',
        inputs: [
            { id: 'wallet', label: 'Wallet', type: 'string' },
        ],
        outputs: [
            { id: 'balance', label: 'Balance', type: 'float' },
        ],
        compact: true,
    },
    {
        label: 'Send Transaction',
        category: 'web3',
        icon: '📤',
        description: 'Send a blockchain tx',
        inputs: [
            { id: 'exec-in', label: '', type: 'exec' },
            { id: 'to', label: 'To', type: 'string' },
            { id: 'amount', label: 'Amount', type: 'float' },
        ],
        outputs: [
            { id: 'exec-out', label: '', type: 'exec' },
            { id: 'txHash', label: 'Tx Hash', type: 'string' },
        ],
    },
];

// ─── Default Scene ───

const defaultNodes: Node[] = [
    {
        id: 'ev-start',
        type: 'blueprint',
        position: { x: 50, y: 50 },
        data: {
            label: 'Event Begin Play',
            category: 'event',
            icon: '⚡',
            inputs: [],
            outputs: [{ id: 'exec-out', label: '', type: 'exec' }],
        },
    },
    {
        id: 'ev-key',
        type: 'blueprint',
        position: { x: 50, y: 180 },
        data: {
            label: 'On Key Press',
            category: 'event',
            icon: '⌨️',
            inputs: [],
            outputs: [
                { id: 'exec-out', label: '', type: 'exec' },
                { id: 'key', label: 'Key', type: 'string' },
            ],
        },
    },
    {
        id: 'act-move',
        type: 'blueprint',
        position: { x: 340, y: 160 },
        data: {
            label: 'Move To',
            category: 'action',
            icon: '➡️',
            inputs: [
                { id: 'exec-in', label: '', type: 'exec' },
                { id: 'target', label: 'Target', type: 'object' },
                { id: 'position', label: 'Position', type: 'vector' },
                { id: 'speed', label: 'Speed', type: 'float' },
            ],
            outputs: [
                { id: 'exec-out', label: '', type: 'exec' },
                { id: 'done', label: 'Done', type: 'exec' },
            ],
        },
    },
    {
        id: 'log-branch',
        type: 'blueprint',
        position: { x: 340, y: 30 },
        data: {
            label: 'Branch',
            category: 'logic',
            icon: '🔀',
            inputs: [
                { id: 'exec-in', label: '', type: 'exec' },
                { id: 'condition', label: 'Condition', type: 'boolean' },
            ],
            outputs: [
                { id: 'true', label: 'True', type: 'exec' },
                { id: 'false', label: 'False', type: 'exec' },
            ],
        },
    },
    {
        id: 'act-spawn',
        type: 'blueprint',
        position: { x: 620, y: 10 },
        data: {
            label: 'Spawn Object',
            category: 'action',
            icon: '✨',
            inputs: [
                { id: 'exec-in', label: '', type: 'exec' },
                { id: 'type', label: 'Type', type: 'string' },
                { id: 'position', label: 'Position', type: 'vector' },
            ],
            outputs: [
                { id: 'exec-out', label: '', type: 'exec' },
                { id: 'object', label: 'Object', type: 'object' },
            ],
        },
    },
    {
        id: 'act-sound',
        type: 'blueprint',
        position: { x: 620, y: 160 },
        data: {
            label: 'Play Sound',
            category: 'action',
            icon: '🔊',
            inputs: [
                { id: 'exec-in', label: '', type: 'exec' },
                { id: 'sound', label: 'Sound', type: 'string' },
                { id: 'volume', label: 'Volume', type: 'float' },
            ],
            outputs: [
                { id: 'exec-out', label: '', type: 'exec' },
            ],
        },
    },
];

const defaultEdges: Edge[] = [
    { id: 'e1', source: 'ev-start', sourceHandle: 'exec-out', target: 'log-branch', targetHandle: 'exec-in', animated: true, style: { stroke: '#fff', strokeWidth: 2 } },
    { id: 'e2', source: 'ev-key', sourceHandle: 'exec-out', target: 'act-move', targetHandle: 'exec-in', animated: true, style: { stroke: '#fff', strokeWidth: 2 } },
    { id: 'e3', source: 'log-branch', sourceHandle: 'true', target: 'act-spawn', targetHandle: 'exec-in', animated: true, style: { stroke: '#22c55e', strokeWidth: 2 } },
    { id: 'e4', source: 'log-branch', sourceHandle: 'false', target: 'act-sound', targetHandle: 'exec-in', animated: true, style: { stroke: '#ef4444', strokeWidth: 2 } },
];

// ─── Palette Categories ───

const PALETTE_CATS = ['All', 'Events', 'Actions', 'Logic', 'Math', 'Web3'];
const PALETTE_CAT_MAP: Record<string, string[]> = {
    All: [],
    Events: ['event'],
    Actions: ['action'],
    Logic: ['logic', 'flow'],
    Math: ['math', 'variable'],
    Web3: ['web3'],
};

// ─── Main Component ───

let nodeCounter = 10;

export default function NodeEditor() {
    const [nodes, setNodes, onNodesChange] = useNodesState(defaultNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(defaultEdges);
    const [showPalette, setShowPalette] = useState(false);
    const [paletteCat, setPaletteCat] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const onConnect = useCallback(
        (params: Connection) => {
            // Determine edge color based on pin type
            const sourceNode = nodes.find(n => n.id === params.source);
            let strokeColor = '#5a5f6d';

            if (sourceNode) {
                const data = sourceNode.data as unknown as BlueprintNodeData;
                const pin = data.outputs.find(o => o.id === params.sourceHandle);
                if (pin) strokeColor = pinColors[pin.type] || '#5a5f6d';
            }

            setEdges((eds) =>
                addEdge({
                    ...params,
                    animated: true,
                    style: { stroke: strokeColor, strokeWidth: 2 },
                    type: 'default',
                }, eds)
            );
        },
        [setEdges, nodes]
    );

    const addNodeFromTemplate = (template: NodeTemplate) => {
        nodeCounter++;
        const newNode: Node = {
            id: `node-${nodeCounter}`,
            type: 'blueprint',
            position: { x: 200 + Math.random() * 200, y: 100 + Math.random() * 200 },
            data: { ...template },
        };
        setNodes((nds) => [...nds, newNode]);
        setShowPalette(false);
    };

    const filteredPalette = NODE_PALETTE.filter((n) => {
        const catMatch = paletteCat === 'All' || PALETTE_CAT_MAP[paletteCat]?.includes(n.category);
        const searchMatch = !searchTerm || n.label.toLowerCase().includes(searchTerm.toLowerCase());
        return catMatch && searchMatch;
    });

    return (
        <div style={{ width: '100%', height: '100%', minHeight: 200, position: 'relative' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
                proOptions={{ hideAttribution: true }}
                style={{ background: 'transparent' }}
                defaultEdgeOptions={{ type: 'default', animated: true }}
                snapToGrid
                snapGrid={[16, 16]}
            >
                <Background
                    variant={BackgroundVariant.Dots}
                    gap={20}
                    size={1}
                    color="rgba(255,255,255,0.04)"
                />
                <Controls showInteractive={false} style={{ borderRadius: 10, overflow: 'hidden' }} />
                <MiniMap
                    style={{
                        background: 'rgba(10,10,18,0.8)',
                        borderRadius: 8,
                        border: '1px solid rgba(255,255,255,0.06)',
                    }}
                    maskColor="rgba(0,0,0,0.5)"
                    nodeColor={(node) => {
                        const d = node.data as unknown as BlueprintNodeData;
                        return NODE_COLORS[d?.category]?.header || '#3b82f6';
                    }}
                />

                {/* Add Node Button */}
                <Panel position="top-left">
                    <button
                        onClick={() => setShowPalette(!showPalette)}
                        style={{
                            padding: '6px 14px',
                            borderRadius: 8,
                            background: showPalette ? 'rgba(20,241,149,0.15)' : 'rgba(255,255,255,0.05)',
                            border: `1px solid ${showPalette ? 'rgba(20,241,149,0.3)' : 'rgba(255,255,255,0.08)'}`,
                            color: showPalette ? '#14f195' : '#9ca3b0',
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                        }}
                    >
                        ➕ Add Node
                    </button>
                </Panel>
            </ReactFlow>

            {/* Node Palette / Dropdown */}
            {showPalette && (
                <div style={{
                    position: 'absolute',
                    top: 46,
                    left: 10,
                    width: 280,
                    maxHeight: 340,
                    background: '#15151f',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 12,
                    zIndex: 100,
                    overflow: 'hidden',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
                }}>
                    {/* Search */}
                    <div style={{ padding: '8px 10px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <input
                            placeholder="Search nodes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                            style={{
                                width: '100%',
                                padding: '6px 10px',
                                borderRadius: 6,
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                color: '#f0f0f5',
                                fontSize: 12,
                                outline: 'none',
                            }}
                        />
                    </div>

                    {/* Category tabs */}
                    <div style={{
                        display: 'flex',
                        gap: 2,
                        padding: '6px 8px',
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                        overflowX: 'auto',
                    }}>
                        {PALETTE_CATS.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setPaletteCat(cat)}
                                style={{
                                    padding: '3px 8px',
                                    borderRadius: 6,
                                    background: paletteCat === cat ? 'rgba(139,92,246,0.12)' : 'transparent',
                                    border: `1px solid ${paletteCat === cat ? 'rgba(139,92,246,0.2)' : 'transparent'}`,
                                    color: paletteCat === cat ? '#a78bfa' : '#5a5f6d',
                                    fontSize: 10,
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Node list */}
                    <div style={{ maxHeight: 220, overflowY: 'auto', padding: '4px 6px' }}>
                        {filteredPalette.map((template) => (
                            <div
                                key={template.label}
                                onClick={() => addNodeFromTemplate(template)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    padding: '6px 8px',
                                    borderRadius: 6,
                                    cursor: 'pointer',
                                    transition: 'all 0.1s ease',
                                    marginBottom: 2,
                                }}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.04)';
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                                }}
                            >
                                <span style={{
                                    width: 28, height: 28, borderRadius: 6,
                                    background: NODE_COLORS[template.category]?.bg || 'rgba(255,255,255,0.04)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 14, flexShrink: 0,
                                }}>
                                    {template.icon}
                                </span>
                                <div>
                                    <div style={{ fontSize: 11, fontWeight: 600, color: NODE_COLORS[template.category]?.header || '#9ca3b0' }}>
                                        {template.label}
                                    </div>
                                    <div style={{ fontSize: 9, color: '#5a5f6d' }}>
                                        {template.description}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
