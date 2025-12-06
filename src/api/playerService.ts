import { db } from "@/firebase";
import { ref as dbRef, set } from "firebase/database";
import type { UUID } from "@/stores/player";

export const savePlayer = (userId: UUID, username: string) => {
  // Persist identity and username preference to localStorage
  localStorage.setItem("playerId", userId);
  localStorage.setItem("playerUsername", username);

  return set(dbRef(db, `players/${userId}`), {
    id: userId,
    name: username,
    estimate: null
  });
};

export const setPlayerEstimate = (userId: UUID, estimate: string | null) => {
  return set(dbRef(db, `players/${userId}/estimate`), estimate);
};
