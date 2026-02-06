import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { usePlayerStore, type UUID } from "@/stores/player";

// Make a deterministic UUID that fits your UUID template type
const FIXED_UUID = "00000000-1111-2222-3333-444444444444" as UUID;

// Stub BOTH globalThis.crypto and self.crypto because the store uses self.crypto.randomUUID()
const randomUUIDMock = vi.fn(() => FIXED_UUID);

vi.stubGlobal("crypto", { randomUUID: randomUUIDMock });
// @vitest-environment jsdom usually provides self; in case it doesn't, stub it:
vi.stubGlobal("self", { crypto: { randomUUID: randomUUIDMock } });

describe("usePlayerStore", () => {
  beforeEach(() => {
    // ensure deterministic initialization every test
    localStorage.clear();

    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("initializes with empty username", () => {
    const store = usePlayerStore();
    expect(store.username).toBe("");
  });

  it("initializes userId with crypto.randomUUID() when localStorage has no playerId", () => {
    const store = usePlayerStore();

    expect(randomUUIDMock).toHaveBeenCalledTimes(1);
    expect(store.userId).toBe(FIXED_UUID);
    expect(localStorage.getItem("playerId")).toBe(FIXED_UUID);
  });

  it("initializes userId from localStorage when playerId exists", () => {
    const existing = "aaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee" as UUID;
    localStorage.setItem("playerId", existing);

    const store = usePlayerStore();

    // should NOT generate a new id
    expect(randomUUIDMock).not.toHaveBeenCalled();
    expect(store.userId).toBe(existing);
  });

  it("setUsername() trims and sets username", () => {
    const store = usePlayerStore();
    store.setUsername("   Pino   ");
    expect(store.username).toBe("Pino");
  });

  it("setUserId() sets userId and persists to localStorage", () => {
    const store = usePlayerStore();
    const newId = "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee" as UUID;

    store.setUserId(newId);

    expect(store.userId).toBe(newId);
    expect(localStorage.getItem("playerId")).toBe(newId);
  });

  it("setPlayer() sets userId + trimmed username and persists both", () => {
    const store = usePlayerStore();
    const newId = "ffffffff-1111-2222-3333-999999999999" as UUID;

    store.setPlayer(newId, "   Elmo  ");

    expect(store.userId).toBe(newId);
    expect(store.username).toBe("Elmo");
    expect(localStorage.getItem("playerId")).toBe(newId);
    expect(localStorage.getItem("playerUsername")).toBe("Elmo");
  });
});
