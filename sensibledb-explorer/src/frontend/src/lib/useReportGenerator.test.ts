import { describe, it, expect } from "vitest";
import { useReportGenerator } from "./useReportGenerator";

describe("useReportGenerator", () => {
  it("exports useReportGenerator function", () => {
    expect(typeof useReportGenerator).toBe("function");
  });

  it("accepts nodes, edges, and activeDb callbacks", () => {
    const nodes = () => [];
    const edges = () => [];
    const activeDb = () => null;
    
    const result = useReportGenerator(nodes, edges, activeDb);
    expect(result).toHaveProperty("nodeCount");
    expect(result).toHaveProperty("edgeCount");
    expect(result).toHaveProperty("generateReport");
  });

  it("returns nodeCount as function", () => {
    const nodes = () => [{ id: 1, label: "Test", node_type: "Test", properties: {} }];
    const edges = () => [];
    const activeDb = () => "test.db";
    
    const result = useReportGenerator(nodes, edges, activeDb);
    expect(typeof result.nodeCount).toBe("function");
  });

  it("returns generateReport function", () => {
    const nodes = () => [];
    const edges = () => [];
    const activeDb = () => "test.db";
    
    const result = useReportGenerator(nodes, edges, activeDb);
    expect(typeof result.generateReport).toBe("function");
  });

  it("generateReport returns string", () => {
    const nodes = () => [{ id: 1, label: "Test", node_type: "Test", properties: {} }];
    const edges = () => [];
    const activeDb = () => "test.db";
    
    const result = useReportGenerator(nodes, edges, activeDb);
    expect(typeof result.generateReport()).toBe("string");
  });
});