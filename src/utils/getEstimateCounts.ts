import type { EstimateOption } from "@/types/estimates";
import type { PlayerEstimate } from "@/utils/getRoomPlayers";
import { isNonNull } from "@/lib/utils";

/**
 * Returns a count per estimate option.
 */
export const getEstimateCounts = (
  players: PlayerEstimate[],
  options: readonly EstimateOption[]
): Record<string, number> => {
  const counts: Record<string, number> = {};

  options.forEach((option) => {
    counts[option] = 0;
  });

  players.forEach((player) => {
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
 * - at least 2 players
 * - everyone has an estimate
 * - all estimates are the same
 */
export const shouldShowConfetti =(
  players: PlayerEstimate[],
  revealEstimates: boolean
): boolean => {
  if (!revealEstimates) return false;

  const estimates = players
    .map((player) => player.estimate)
    .filter(isNonNull);

  const hasAtLeastTwoPlayers = players.length >= 2;
  const everyoneHasEstimated = estimates.length === players.length;
  const uniqueEstimates = new Set(estimates);

  return (
    hasAtLeastTwoPlayers &&
    everyoneHasEstimated &&
    uniqueEstimates.size === 1
  );
}
