"use client";

import { useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  MarkerType,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { UserFlow } from "@/lib/types";

const typeColors: Record<string, string> = {
  screen: "#6366f1",
  action: "#22c55e",
  decision: "#f59e0b",
};

function layoutNodes(nodes: UserFlow["nodes"]): Node[] {
  const cols = Math.ceil(Math.sqrt(nodes.length));
  return nodes.map((node, i) => ({
    id: node.id,
    data: {
      label: (
        <div className="text-center">
          <div className="font-semibold text-xs">{node.label}</div>
          {node.description && (
            <div className="text-[10px] text-muted-foreground mt-0.5">{node.description}</div>
          )}
        </div>
      ),
    },
    position: {
      x: (i % cols) * 220,
      y: Math.floor(i / cols) * 120,
    },
    style: {
      background: typeColors[node.type] ?? "#6366f1",
      color: "white",
      border: "none",
      borderRadius: "8px",
      padding: "10px 14px",
      fontSize: "12px",
      minWidth: "140px",
    },
  }));
}

interface FlowDiagramProps {
  flow: UserFlow;
}

export function FlowDiagram({ flow }: FlowDiagramProps) {
  const nodes = useMemo(() => layoutNodes(flow.nodes), [flow.nodes]);

  const edges: Edge[] = useMemo(
    () =>
      flow.edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: edge.label,
        animated: true,
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { stroke: "#a1a1aa" },
        labelStyle: { fontSize: 10, fill: "#71717a" },
      })),
    [flow.edges]
  );

  return (
    <div className="h-[400px] w-full rounded-lg border border-border bg-card">
      <ReactFlow nodes={nodes} edges={edges} fitView proOptions={{ hideAttribution: true }}>
        <Background gap={16} size={1} />
        <Controls />
        <MiniMap
          nodeColor={(n) => (n.style?.background as string) ?? "#6366f1"}
          maskColor="rgba(0,0,0,0.05)"
        />
      </ReactFlow>
    </div>
  );
}
