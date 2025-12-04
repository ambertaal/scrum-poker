import { db } from "@/firebase";
import { ref as dbRef, set } from "firebase/database";
import type { UUID } from "@/stores/player";

export async function savePlayer(
  userId: UUID,
  username: string
): Promise<void> {
  const playerRef = dbRef(db, `players/${userId}`);

  await set(playerRef, {
    id: userId,
    name: username,
    estimate: null
  });
}
