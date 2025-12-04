import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";

import { usePlayerStore, type UUID } from "@/stores/player";

// --- Mock crypto.randomUUID so tests stay deterministic ---
vi.stubGlobal("crypto", {
  randomUUID: vi.fn(() => "0000-1111-2222-3333-4444"),
});

describe("usePlayerStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("initializes with empty username", () => {
    const store = usePlayerStore();
    expect(store.username).toBe("");
  });

  it("initializes userId with crypto.randomUUID()", () => {
    const store = usePlayerStore();
    expect(crypto.randomUUID).toHaveBeenCalled();
    expect(store.userId).toBe("0000-1111-2222-3333-4444");
  });

  it("setUsername() trims and sets username", () => {
    const store = usePlayerStore();
    store.setUsername("   Pino   ");

    expect(store.username).toBe("Pino");
  });

  it("setUserId() directly sets userId", () => {
    const store = usePlayerStore();
    const newId = "aaaa-bbbb-cccc-dddd-eeee" as UUID;

    store.setUserId(newId);

    expect(store.userId).toBe(newId);
  });

  it("setPlayer() sets both userId and trimmed username", () => {
    const store = usePlayerStore();
    const newId = "ffff-1111-2222-3333-9999" as UUID;

    store.setPlayer(newId, "   Elmo  ");

    expect(store.userId).toBe(newId);
    expect(store.username).toBe("Elmo");
  });
});
