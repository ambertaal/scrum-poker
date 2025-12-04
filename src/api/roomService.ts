import { db } from "@/firebase";
import { ref as dbRef, get, set } from "firebase/database";
import type { UUID } from "@/stores/player";

export async function createRoomWithOwner(
  roomId: string,
  ownerId: UUID
): Promise<void> {
  const roomRef = dbRef(db, `rooms/${roomId}`);

  await set(roomRef, {
    players: [ownerId],
    revealEstimates: false,
    createdAt: Date.now()
  });
}

export async function addPlayerToRoom(
  roomId: string,
  playerId: UUID
): Promise<void> {
  const roomPlayersRef = dbRef(db, `rooms/${roomId}/players`);
  const snapshot = await get(roomPlayersRef);
  const currentIds = (snapshot.val() as UUID[] | null) ?? [];

  if (!currentIds.includes(playerId)) {
    await set(roomPlayersRef, [...currentIds, playerId]);
  }
}
