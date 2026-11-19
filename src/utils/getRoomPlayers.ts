import type { UUID, PlayerEstimate, PlayersById, PlayerRole } from "@/types/player";
import { DEFAULT_ROLE, isPlayerRole } from "@/types/player";
import { isNonNull } from "@/lib/utils";

export type { PlayerEstimate, PlayersById };

/** Returns the role of a participant; records without a valid role are players. */
export const getRole = (player: Pick<PlayerEstimate, "role">): PlayerRole =>
  isPlayerRole(player.role) ? player.role : DEFAULT_ROLE;

/** True when the participant votes (and counts towards results). */
export const isVoter = (player: Pick<PlayerEstimate, "role">): boolean =>
  getRole(player) === "player";

/**
 * Maps roomPlayerIds + allPlayers to a clean array of PlayerEstimate.
 * Every returned item has an explicit role.
 */
export const mapRoomPlayers = (
  roomPlayerIds: UUID[],
  allPlayers: PlayersById
): PlayerEstimate[] => {
  return roomPlayerIds
    .map((id) => {
      const player = allPlayers[id];
      if (!player) return null;

      const role = getRole(player);

      return {
        id,
        name: player.name,
        // A spectator never has an estimate, even if stale data says otherwise
        estimate: role === "player" ? (player.estimate ?? null) : null,
        role
      };
    })
    .filter(isNonNull);
}

/** Only the participants that vote. */
export const getVoters = (players: readonly PlayerEstimate[]): PlayerEstimate[] =>
  players.filter(isVoter);

/** Only the participants that watch. */
export const getSpectators = (
  players: readonly PlayerEstimate[]
): PlayerEstimate[] => players.filter((player) => !isVoter(player));
