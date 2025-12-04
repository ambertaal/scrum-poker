import { db } from "@/firebase";
import { ref as dbRef, set } from "firebase/database";
import type { UUID } from "@/stores/player";

export const savePlayer = (userId: UUID, username: string) => {
  return set(dbRef(db, `players/${userId}`), {
    id: userId,
    name: username,
    estimate: null
  });
};

export const setPlayerEstimate = (userId: UUID, estimate: string | null) => {
  return set(dbRef(db, `players/${userId}/estimate`), estimate);
};
