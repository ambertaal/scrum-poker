import type { UUID, PlayerEstimate, PlayersById } from "@/types/player";
import { isNonNull } from "@/lib/utils";

export type { PlayerEstimate, PlayersById };

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
    .filter(isNonNull);
}
