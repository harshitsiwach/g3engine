'use client';

import React, { useCallback, useMemo } from 'react';
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
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// ---------- Custom Node Components ----------

function EventNode({ data }: NodeProps) {
    return (
        <div className="custom-node event-node">
            <div className="custom-node-header">⚡ Event</div>
            <div className="custom-node-body">{(data as any).label}</div>
            <Handle type="source" position={Position.Right} style={{ background: '#22c55e' }} />
        </div>
    );
}

function ActionNode({ data }: NodeProps) {
    return (
        <div className="custom-node action-node">
            <Handle type="target" position={Position.Left} style={{ background: '#3b82f6' }} />
            <div className="custom-node-header">▶ Action</div>
            <div className="custom-node-body">{(data as any).label}</div>
            <Handle type="source" position={Position.Right} style={{ background: '#3b82f6' }} />
        </div>
    );
}

function Web3Node({ data }: NodeProps) {
    return (
        <div className="custom-node web3-node">
            <Handle type="target" position={Position.Left} style={{ background: '#8b5cf6' }} />
            <div className="custom-node-header">⬡ Web3</div>
            <div className="custom-node-body">{(data as any).label}</div>
            <Handle type="source" position={Position.Right} style={{ background: '#8b5cf6' }} />
        </div>
    );
}

// ---------- Initial example nodes ----------

const initialNodes: Node[] = [
    {
        id: 'event-1',
        type: 'eventNode',
        position: { x: 50, y: 30 },
        data: { label: 'On Key Press (WASD)' },
    },
    {
        id: 'action-1',
        type: 'actionNode',
        position: { x: 320, y: 20 },
        data: { label: 'Move Character' },
    },
    {
        id: 'event-2',
        type: 'eventNode',
        position: { x: 50, y: 120 },
        data: { label: 'On Click' },
    },
    {
        id: 'action-2',
        type: 'actionNode',
        position: { x: 320, y: 110 },
        data: { label: 'Play Animation' },
    },
    {
        id: 'web3-1',
        type: 'web3Node',
        position: { x: 580, y: 60 },
        data: { label: 'Mint NFT' },
    },
];

const initialEdges: Edge[] = [
    { id: 'e1', source: 'event-1', target: 'action-1', animated: true, style: { stroke: '#22c55e' } },
    { id: 'e2', source: 'event-2', target: 'action-2', animated: true, style: { stroke: '#22c55e' } },
    { id: 'e3', source: 'action-1', target: 'web3-1', animated: true, style: { stroke: '#3b82f6' } },
];

// ---------- Node Editor ----------

const nodeTypes = {
    eventNode: EventNode,
    actionNode: ActionNode,
    web3Node: Web3Node,
};

export default function NodeEditor() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (params: Connection) =>
            setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#5a5f6d' } }, eds)),
        [setEdges]
    );

    return (
        <div style={{ width: '100%', height: '100%', minHeight: 180 }}>
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
            >
                <Background
                    variant={BackgroundVariant.Dots}
                    gap={20}
                    size={1}
                    color="rgba(255,255,255,0.04)"
                />
                <Controls
                    showInteractive={false}
                    style={{ borderRadius: 10, overflow: 'hidden' }}
                />
                <MiniMap
                    style={{
                        background: 'rgba(10,10,18,0.8)',
                        borderRadius: 8,
                        border: '1px solid rgba(255,255,255,0.06)',
                    }}
                    maskColor="rgba(0,0,0,0.5)"
                    nodeColor={(node) => {
                        if (node.type === 'eventNode') return '#22c55e';
                        if (node.type === 'web3Node') return '#8b5cf6';
                        return '#3b82f6';
                    }}
                />
            </ReactFlow>
        </div>
    );
}
