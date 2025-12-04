import { db } from "@/firebase";
import { ref as dbRef, get, set, update } from "firebase/database";
import type { UUID } from "@/stores/player";

export const createRoomWithOwner = (roomId: string, ownerId: UUID) =>
  set(dbRef(db, `rooms/${roomId}`), {
    players: [ownerId],
    revealEstimates: false,
    createdAt: Date.now()
  });

export const addPlayerToRoom = async (roomId: string, playerId: UUID) => {
  const roomPlayersRef = dbRef(db, `rooms/${roomId}/players`);
  const snapshot = await get(roomPlayersRef);
  const currentIds = (snapshot.val() as UUID[] | null) ?? [];

  if (!currentIds.includes(playerId)) {
    await set(roomPlayersRef, [...currentIds, playerId]);
  }
};

export const setRevealEstimates = (roomId: string, reveal: boolean) =>
  set(dbRef(db, `rooms/${roomId}/revealEstimates`), reveal);

export const resetRoomEstimates = async (roomId: string) => {
  const playersRef = dbRef(db, `rooms/${roomId}/players`);
  const snapshot = await get(playersRef);
  if (!snapshot.exists()) return;

  const playerIds = (snapshot.val() as UUID[]).filter(Boolean);

  const updates: Record<string, unknown> = {};

  playerIds.forEach((id) => {
    updates[`players/${id}/estimate`] = null;
  });

  updates[`rooms/${roomId}/revealEstimates`] = false;

  await update(dbRef(db), updates);
};

export const clearRoom = (roomId: string) =>
  set(dbRef(db, `rooms/${roomId}/players`), null);
