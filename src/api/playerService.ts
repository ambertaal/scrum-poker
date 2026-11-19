import { db, ensureAuthUid } from "@/firebase";
import { ref as dbRef, set, update } from "firebase/database";
import type { UUID } from "@/stores/player";
import { ROLE_STORAGE_KEY } from "@/stores/player";
import type { EstimateOption } from "@/types/estimates";
import type { PlayerEstimate, PlayerRole } from "@/types/player";
import { DEFAULT_ROLE } from "@/types/player";

/** Stored player record; `ownerUid` ties it to the anonymous auth user. */
export type PlayerRecord = PlayerEstimate & { role: PlayerRole; ownerUid?: string };

export const savePlayer = async (
  userId: UUID,
  username: string,
  role: PlayerRole = DEFAULT_ROLE
): Promise<void> => {
  // Persist identity, username and role preference to localStorage
  localStorage.setItem("playerId", userId);
  localStorage.setItem("playerUsername", username);
  localStorage.setItem(ROLE_STORAGE_KEY, role);

  const ownerUid = await ensureAuthUid();

  const record: PlayerRecord = {
    id: userId,
    name: username,
    estimate: null,
    role,
    ...(ownerUid ? { ownerUid } : {})
  };

  return set(dbRef(db, `players/${userId}`), record);
};

export const setPlayerEstimate = (userId: UUID, estimate: EstimateOption | null): Promise<void> => {
  return set(dbRef(db, `players/${userId}/estimate`), estimate);
};

/**
 * Switches role. The estimate is always cleared: a spectator never has one,
 * and a fresh player starts without a selection.
 */
export const setPlayerRole = (userId: UUID, role: PlayerRole): Promise<void> => {
  localStorage.setItem(ROLE_STORAGE_KEY, role);

  return update(dbRef(db, `players/${userId}`), {
    role,
    estimate: null
  });
};
