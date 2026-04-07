import { describe, it, expect, vi } from "vitest";
import { useAppInitialization, useKeyboardShortcuts } from "./useAppInit";

vi.mock("../lib/api", () => ({
  dbList: vi.fn().mockResolvedValue([]),
  nodeList: vi.fn().mockResolvedValue([]),
  edgeList: vi.fn().mockResolvedValue([]),
  schemaGet: vi.fn().mockResolvedValue({ node_labels: [], edge_types: [], indexes: [], vector_indexes: [] }),
  logError: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("../components/onboarding/GuidedTour", () => ({
  isTourCompleted: vi.fn().mockReturnValue(true),
}));

describe("useAppInitialization", () => {
  it("exports useAppInitialization function", () => {
    expect(typeof useAppInitialization).toBe("function");
  });

  it("returns loadDbData function", () => {
    const setDatabases = vi.fn();
    const setActiveDb = vi.fn();
    const setNodes = vi.fn();
    const setEdges = vi.fn();
    const setSchema = vi.fn();
    
    const result = useAppInitialization(setDatabases, setActiveDb, setNodes, setEdges, setSchema);
    expect(result).toHaveProperty("loadDbData");
    expect(typeof result.loadDbData).toBe("function");
  });
});

describe("useKeyboardShortcuts", () => {
  it("exports useKeyboardShortcuts function", () => {
    expect(typeof useKeyboardShortcuts).toBe("function");
  });
});