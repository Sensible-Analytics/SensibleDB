import { onMount, onCleanup } from "solid-js";
import { setActiveView, setSelectedNode, activeDb } from "../stores/app";
import { logError, dbList as apiDbList, nodeList, edgeList, schemaGet } from "./api";
import { isTourCompleted } from "../components/onboarding/GuidedTour";

export function useAppInitialization(
  setDatabases: (dbs: string[]) => void,
  setActiveDb: (db: string | null) => void,
  setNodes: (nodes: any[]) => void,
  setEdges: (edges: any[]) => void,
  setSchema: (schema: any) => void
) {
  const loadDbData = async (dbName: string) => {
    try {
      const n = await nodeList(dbName);
      setNodes(n);
      const e = await edgeList(dbName);
      setEdges(e);
      const s = await schemaGet(dbName);
      setSchema(s);
    } catch (err) {
      const errMsg = "[loadDbData] ERROR: " + String(err);
      logError(errMsg).catch(() => {});
    }
  };

  onMount(async () => {
    try {
      const dbs = await apiDbList();
      setDatabases(dbs);
      if (dbs.length > 0) {
        const firstDb = dbs[0];
        setActiveDb(firstDb);
        await loadDbData(firstDb);
      }
    } catch (e) {
    }

    if (!isTourCompleted()) {
      setTimeout(() => {
        const tourEvent = new CustomEvent("show-tour");
        window.dispatchEvent(tourEvent);
      }, 1500);
    }
  });

  return { loadDbData };
}

export function useKeyboardShortcuts(
  activeDb: () => string | null,
  loadDbData: (dbName: string) => Promise<void>
) {
  onMount(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === "1") setActiveView("home");
      else if (e.key === "2") setActiveView("graph");
      else if (e.key === "3") setActiveView("chat");
      else if (e.key === "4") setActiveView("report");
      else if (e.key === "5") setActiveView("nodes");
      else if (e.key === "6") setActiveView("edges");
      else if (e.key === "7") setActiveView("schema");
      else if (e.key === "8") setActiveView("sensibleql");
      else if (e.key === "9") setActiveView("models");
      else if (e.key === "Escape") {
        setSelectedNode(null);
        setActiveView("home");
      }
      else if (e.key === "/" || (e.ctrlKey && e.key === "k")) {
        e.preventDefault();
        setActiveView("chat");
      }
      else if (e.ctrlKey && e.key === "g") {
        e.preventDefault();
        setActiveView("graph");
      }
      else if (e.ctrlKey && e.key === "r") {
        e.preventDefault();
        if (activeDb()) loadDbData(activeDb()!);
      }
    };

    window.addEventListener("keydown", handler);
    onCleanup(() => window.removeEventListener("keydown", handler));
  });
}