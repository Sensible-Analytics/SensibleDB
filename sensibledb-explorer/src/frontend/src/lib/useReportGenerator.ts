import { createMemo } from "solid-js";
import type { NodeDto, EdgeDto } from "../../types";

export interface ReportData {
  nodeCount: number;
  edgeCount: number;
  nodeTypes: string[];
  edgeTypes: string[];
  mostConnected: Array<[number, number]>;
  typeBreakdown: Array<{ type: string; count: number; pct: number }>;
}

export function useReportGenerator(
  nodes: () => NodeDto[],
  edges: () => EdgeDto[],
  activeDb: () => string | null
) {
  const nodeCount = createMemo(() => nodes().length);
  const edgeCount = createMemo(() => edges().length);

  const nodeTypes = createMemo(() => 
    Array.from(new Set(nodes().map(n => n.label.split(":")[0])))
  );

  const edgeTypes = createMemo(() => 
    Array.from(new Set(edges().map(e => e.label || e.edge_type)))
  );

  const mostConnected = createMemo(() => {
    const connectionCount = new Map<number, number>();
    edges().forEach(e => {
      connectionCount.set(e.from, (connectionCount.get(e.from) || 0) + 1);
      connectionCount.set(e.to, (connectionCount.get(e.to) || 0) + 1);
    });
    return [...connectionCount.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  });

  const typeBreakdown = createMemo(() => {
    const types = nodeTypes();
    const count = nodeCount();
    return types.map(type => ({
      type,
      count: nodes().filter(n => n.label.startsWith(type)).length,
      pct: count > 0 ? Math.round((nodes().filter(n => n.label.startsWith(type)).length / count) * 100) : 0,
    }));
  });

  const getNodeLabel = (id: number): string => {
    return nodes().find(n => n.id === id)?.label || `ID: ${id}`;
  };

  const periodLabel = (period: string): string => {
    switch (period) {
      case "week": return "Last 7 Days";
      case "month": return "Last 30 Days";
      default: return "All Time";
    }
  };

  const generateReport = (period: string = "all"): string => {
    const now = new Date().toLocaleString();
    const db = activeDb() || "Not connected";

    const lines: string[] = [];
    lines.push("SensibleDB Summary Report");
    lines.push(`Generated: ${now}`);
    lines.push(`Period: ${periodLabel(period)}`);
    lines.push(`Database: ${db}`);
    lines.push("");
    lines.push("── Overview ──");
    lines.push(`Total Items: ${nodeCount()}`);
    lines.push(`Total Connections: ${edgeCount()}`);
    lines.push(`Item Types: ${nodeTypes().size} (${nodeTypes().join(", ")})`);
    lines.push(`Relationship Types: ${edgeTypes().size} (${edgeTypes().join(", ")})`);
    lines.push("");
    lines.push("── Key Findings ──");

    if (mostConnected().length > 0) {
      lines.push(`• ${getNodeLabel(mostConnected()[0][0])} is the most connected with ${mostConnected()[0][1]} connections`);
    }
    lines.push(`• Your data contains ${nodeTypes().size} different types: ${nodeTypes().join(", ")}`);
    lines.push(`• ${edgeTypes().size} types of relationships connect your items: ${edgeTypes().join(", ")}`);
    lines.push("");

    if (mostConnected().length > 0) {
      lines.push("── Most Connected Items ──");
      mostConnected().forEach(([id, count], i) => {
        lines.push(`${i + 1}. ${getNodeLabel(id)} — ${count} connections`);
      });
      lines.push("");
    }

    lines.push("── Item Breakdown by Type ──");
    typeBreakdown().forEach(({ type, count, pct }) => {
      lines.push(`${type}: ${count} items (${pct}%)`);
    });

    return lines.join("\n");
  };

  return {
    nodeCount,
    edgeCount,
    nodeTypes,
    edgeTypes,
    mostConnected,
    typeBreakdown,
    getNodeLabel,
    periodLabel,
    generateReport,
  };
}