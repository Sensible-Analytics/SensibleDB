import { describe, it, expect } from "vitest";
import { useGraphData, useForceSimulation } from "./useGraph";

describe("useGraphData", () => {
  it("exports useGraphData function", () => {
    expect(typeof useGraphData).toBe("function");
  });

  it("accepts nodes, edges, and schema callbacks", () => {
    const nodes = () => [];
    const edges = () => [];
    const schema = () => null;
    
    const result = useGraphData(nodes, edges, schema);
    expect(result).toHaveProperty("graphNodes");
    expect(result).toHaveProperty("graphEdges");
  });

  it("returns graphNodes as function", () => {
    const nodes = () => [{ id: 1, label: "Test", node_type: "Test", properties: {} }];
    const edges = () => [];
    const schema = () => ({ node_labels: ["Test"] });
    
    const result = useGraphData(nodes, edges, schema);
    expect(typeof result.graphNodes).toBe("function");
  });
});

describe("useForceSimulation", () => {
  it("exports useForceSimulation function", () => {
    expect(typeof useForceSimulation).toBe("function");
  });

  it("returns transform signal", () => {
    const { transform, setTransform } = useForceSimulation();
    expect(transform).toBeDefined();
    expect(typeof setTransform).toBe("function");
  });

  it("returns dragging signal", () => {
    const { dragging, setDragging } = useForceSimulation();
    expect(dragging).toBeDefined();
    expect(typeof setDragging).toBe("function");
  });

  it("returns panning signal", () => {
    const { panning, setPanning } = useForceSimulation();
    expect(panning).toBeDefined();
    expect(typeof setPanning).toBe("function");
  });

  it("returns runAsyncSimulation function", () => {
    const { runAsyncSimulation } = useForceSimulation();
    expect(typeof runAsyncSimulation).toBe("function");
  });
});