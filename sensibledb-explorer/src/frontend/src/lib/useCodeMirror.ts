import { onMount, onCleanup, createSignal } from "solid-js";
import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";

export interface UseCodeMirrorOptions {
  initialDoc?: string;
  onChange?: (doc: string) => void;
  theme?: Record<string, Record<string, string>>;
}

export interface UseCodeMirrorReturn {
  ref: (el: HTMLDivElement) => void;
  editor: EditorView | undefined;
  getDoc: () => string;
  setDoc: (doc: string) => void;
}

export function useCodeMirror(options: UseCodeMirrorOptions = {}): UseCodeMirrorReturn {
  const { initialDoc = "", onChange } = options;
  
  const [query, setQuery] = createSignal(initialDoc);
  let editorRef: HTMLDivElement | undefined;
  let editor: EditorView | undefined;

  const ref = (el: HTMLDivElement) => {
    editorRef = el;
    if (!el || editor) return;
    
    editor = new EditorView({
      state: EditorState.create({
        doc: initialDoc,
        extensions: [
          basicSetup,
          EditorView.theme({
            "&": { fontSize: "14px" },
            ".cm-editor": { background: "#f8fafc" },
            ".cm-gutters": { background: "#f1f5f9", border: "none" },
          }),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              const doc = update.state.doc.toString();
              setQuery(doc);
              onChange?.(doc);
            }
          }),
        ],
      }),
      parent: el,
    });
  };

  const getDoc = () => editor?.state.doc.toString() ?? "";

  const setDoc = (doc: string) => {
    if (editor) {
      editor.dispatch({
        changes: { from: 0, to: editor.state.doc.length, insert: doc },
      });
    }
  };

  onCleanup(() => {
    editor?.destroy();
  });

  return {
    ref,
    getDoc,
    setDoc,
    get editor() {
      return editor;
    },
  };
}