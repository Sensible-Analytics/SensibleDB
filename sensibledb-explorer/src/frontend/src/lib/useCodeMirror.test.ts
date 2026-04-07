import { describe, it, expect, vi } from "vitest";
import { useCodeMirror } from "./useCodeMirror";

describe("useCodeMirror", () => {
  it("creates ref function", () => {
    const { ref } = useCodeMirror();
    expect(typeof ref).toBe("function");
  });

  it("creates getDoc function", () => {
    const { getDoc } = useCodeMirror();
    expect(typeof getDoc).toBe("function");
  });

  it("creates setDoc function", () => {
    const { setDoc } = useCodeMirror();
    expect(typeof setDoc).toBe("function");
  });

  it("accepts initial doc option", () => {
    const hook = useCodeMirror({ initialDoc: "initial text" });
    expect(hook.getDoc).toBeDefined();
    expect(hook.setDoc).toBeDefined();
  });

  it("accepts onChange callback", () => {
    const onChange = vi.fn();
    const hook = useCodeMirror({ onChange });
    expect(typeof hook.ref).toBe("function");
  });
});