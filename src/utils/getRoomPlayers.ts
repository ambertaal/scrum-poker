import type { UUID } from "@/stores/player";

export interface PlayerEstimate {
  id: UUID;
  name: string;
  estimate: string | null;
}

// Shape of the data you get from Firebase
export type PlayersById = Record<
  string,
  { id: UUID; name: string; estimate: string | null }
>;

/**
 * Maps roomPlayerIds + allPlayers to a clean array of PlayerEstimate.
 */
export const mapRoomPlayers = (
  roomPlayerIds: UUID[],
  allPlayers: PlayersById
): PlayerEstimate[] => {
  return roomPlayerIds
    .map((id) => {
      const player = allPlayers[id];
      if (!player) return null;

      return {
        id,
        name: player.name,
        estimate: player.estimate ?? null
      };
    })
    .filter((player): player is PlayerEstimate => player !== null);
}
