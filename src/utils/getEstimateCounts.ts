import type { EstimateOption } from "@/types/estimates";
import { isVoter, type PlayerEstimate } from "@/utils/getRoomPlayers";
import { isNonNull } from "@/lib/utils";

/**
 * Returns a count per estimate option.
 * Spectators never count.
 */
export const getEstimateCounts = (
  players: Readonly<PlayerEstimate>[],
  options: readonly EstimateOption[]
): Record<EstimateOption, number> => {
  const counts = {} as Record<EstimateOption, number>;

  options.forEach((option) => {
    counts[option] = 0;
  });

  players.filter(isVoter).forEach((player) => {
    if (
      player.estimate != null &&
      Object.prototype.hasOwnProperty.call(counts, player.estimate)
    ) {
      counts[player.estimate] += 1;
    }
  });

  return counts;
}

/**
 * Confetti should show when:
 * - reveal is true
 * - at least 2 players (spectators excluded)
 * - every player has an estimate
 * - all estimates are the same
 */
export const shouldShowConfetti =(
  players: Readonly<PlayerEstimate>[],
  revealEstimates: boolean
): boolean => {
  if (!revealEstimates) return false;

  const voters = players.filter(isVoter);
  const estimates = voters
    .map((player) => player.estimate)
    .filter(isNonNull);

  const hasAtLeastTwoPlayers = voters.length >= 2;
  const everyoneHasEstimated = estimates.length === voters.length;
  const uniqueEstimates = new Set(estimates);

  return (
    hasAtLeastTwoPlayers &&
    everyoneHasEstimated &&
    uniqueEstimates.size === 1
  );
}
