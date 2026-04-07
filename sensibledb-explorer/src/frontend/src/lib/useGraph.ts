import { createMemo, createSignal } from "solid-js";
import type { NodeDto, EdgeDto } from "../../types";

export interface GraphNode {
  id: number;
  label: string;
  type: string;
  x: number;
  y: number;
  color: string;
  icon: string;
  connectionCount: number;
}

const colors = [
  "#3b82f6", "#ef4444", "#22c55e", "#f59e0b", "#8b5cf6",
  "#ec4899", "#06b6d4", "#f97316", "#14b8a6", "#6366f1"
];

const typeIcons: Record<string, string> = {
  Person: "🧑",
  Event: "📅",
  Symptom: "😰",
  Medication: "💊",
  Office: "🏢",
  Home: "🏠",
  Travel: "✈️",
  Task: "✅",
  Project: "📋",
  Tool: "🔧",
  default: "📦",
};

export function useGraphData(
  nodes: () => NodeDto[],
  edges: () => EdgeDto[],
  schema: () => { node_labels: string[] } | null
) {
  const getIconForType = (type: string): string => {
    return typeIcons[type] || typeIcons.default;
  };

  const getColorForIndex = (i: number): string => {
    return colors[i % colors.length];
  };

  const extractTypeFromLabel = (label: string): string => {
    const s = schema();
    if (s) {
      for (const nodeLabel of s.node_labels) {
        if (label.toLowerCase().includes(nodeLabel.toLowerCase())) {
          return nodeLabel;
        }
      }
    }
    const words = label.split(/[\s_-]+/);
    if (words.length > 1) {
      return words[0];
    }
    return "Item";
  };

  const getConnectionCount = (nodeId: number, edgeList: EdgeDto[]): number => {
    return edgeList.filter(e => e.from === nodeId || e.to === nodeId).length;
  };

  const graphNodes = createMemo<GraphNode[]>(() => {
    const nodeList = nodes();
    const edgeList = edges();
    return nodeList.map((n, i) => ({
      id: n.id,
      label: n.label,
      type: extractTypeFromLabel(n.label),
      x: Math.random() * 800,
      y: Math.random() * 600,
      color: getColorForIndex(i),
      icon: getIconForType(extractTypeFromLabel(n.label)),
      connectionCount: getConnectionCount(n.id, edgeList),
    }));
  });

  const graphEdges = createMemo(() => edges());

  return {
    graphNodes,
    graphEdges,
  };
}

export interface Transform {
  x: number;
  y: number;
  k: number;
}

export interface UseForceSimulationOptions {
  width?: number;
  height?: number;
  onTick?: (nodes: GraphNode[], edges: EdgeDto[]) => void;
}

export function useForceSimulation(options: UseForceSimulationOptions = {}) {
  const { width = 800, height = 600, onTick } = options;
  
  const [transform, setTransform] = createSignal<Transform>({ x: 0, y: 0, k: 1 });
  const [dragging, setDragging] = createSignal<GraphNode | null>(null);
  const [panning, setPanning] = createSignal(false);
  const [panStart, setPanStart] = createSignal({ x: 0, y: 0 });
  const [hoveredEdge, setHoveredEdge] = createSignal<number | null>(null);
  const [hoveredNode, setHoveredNode] = createSignal<number | null>(null);

  const runAsyncSimulation = (
    nodeMap: Map<number, GraphNode>,
    edgeList: EdgeDto[],
    cx: number,
    cy: number
  ) => {
    let simulationRunning = true;

    let alpha = 1.0;
    const minAlpha = 0.001;
    const decay = 0.965;

    const tick = () => {
      if (alpha < minAlpha) {
        simulationRunning = false;
        return;
      }

      const arr = Array.from(nodeMap.values());
      const dragNode = dragging();

      for (let i = 0; i < arr.length; i++) {
        const node = arr[i];
        
        if (dragNode && node.id === dragNode.id) continue;

        let fx = 0, fy = 0;

        for (let j = 0; j < arr.length; j++) {
          if (i === j) continue;
          const other = arr[j];
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = 1000 / (dist * dist);
          fx += (dx / dist) * force;
          fy += (dy / dist) * force;
        }

        for (const edge of edgeList) {
          const isSource = edge.from === node.id;
          const isTarget = edge.to === node.id;
          if (!isSource && !isTarget) continue;
          
          const otherId = isSource ? edge.to : edge.from;
          const other = nodeMap.get(otherId);
          if (!other) continue;

          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = (dist - 200) * 0.01;
          fx -= (dx / dist) * force;
          fy -= (dy / dist) * force;
        }

        fx += (cx - node.x) * 0.001;
        fy += (cy - node.y) * 0.001;

        node.x += fx * alpha;
        node.y += fy * alpha;

        node.x = Math.max(50, Math.min(width - 50, node.x));
        node.y = Math.max(50, Math.min(height - 50, node.y));
      }

      alpha *= decay;
      
      if (simulationRunning) {
        onTick?.(Array.from(nodeMap.values()), edgeList);
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);

    return () => {
      simulationRunning = false;
    };
  };

  return {
    transform,
    setTransform,
    dragging,
    setDragging,
    panning,
    setPanning,
    panStart,
    setPanStart,
    hoveredEdge,
    setHoveredEdge,
    hoveredNode,
    setHoveredNode,
    runAsyncSimulation,
  };
}