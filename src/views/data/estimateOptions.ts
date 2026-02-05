export const ESTIMATE_OPTIONS = [
  "0",
  "0.5",
  "1",
  "2",
  "3",
  "5",
  "8",
  "13",
  "20",
  "40",
  "100",
  "?",
  "☕"
] as const;

/**
 * The type of the estimate options, derived from the ESTIMATE_OPTIONS array.
 * This ensures that the type is always in sync with the actual options defined.
 */
export type EstimateOption = typeof ESTIMATE_OPTIONS[number];
