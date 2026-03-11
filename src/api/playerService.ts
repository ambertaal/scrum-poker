import { db } from "@/firebase";
import { ref as dbRef, set } from "firebase/database";
import type { UUID } from "@/stores/player";
import type { EstimateOption } from "@/types/estimates";
import type { PlayerEstimate } from "@/types/player";

export const savePlayer = (userId: UUID, username: string) => {
  // Persist identity and username preference to localStorage
  localStorage.setItem("playerId", userId);
  localStorage.setItem("playerUsername", username);

  return set(dbRef(db, `players/${userId}`), {
    id: userId,
    name: username,
    estimate: null
  } satisfies PlayerEstimate);
};

export const setPlayerEstimate = (userId: UUID, estimate: EstimateOption | null) => {
  return set(dbRef(db, `players/${userId}/estimate`), estimate);
};
