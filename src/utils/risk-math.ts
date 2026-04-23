/**
 * Calculates the Kelly Criterion fraction for optimal position sizing.
 * Determines the percentage of capital to allocate to a trade given a win rate and win/loss ratio.
 * 
 * @param winRate - The probability of a winning trade (between 0 and 1).
 * @param winLossRatio - The ratio of average gain to average loss.
 * @returns The suggested Kelly fraction, or 0 if negative or winLossRatio is 0.
 * @throws Error if winRate is not between 0 and 1.
 */
export function calculateKellyFraction(winRate: number, winLossRatio: number): number {
  if (winRate < 0 || winRate > 1) {
    throw new Error('winRate must be between 0 and 1');
  }
  if (winLossRatio <= 0) return 0;
  const fraction = winRate - ((1 - winRate) / winLossRatio);
  return fraction > 0 ? fraction : 0;
}

/**
 * Calculates Value at Risk (VaR) using the historical simulation method.
 * VaR estimates the maximum potential loss over a given confidence interval based on past performance.
 * 
 * @param returns - An array of historical returns.
 * @param confidenceLevel - The probability level for the VaR calculation (e.g., 0.95 for 95% VaR).
 * @param isAlreadySorted - Optimization flag if the returns array is already sorted in ascending order.
 * @returns The potential loss at the specified confidence percentile.
 */
export function calculateHistoricalVaR(returns: number[], confidenceLevel: number, isAlreadySorted: boolean = false): number {
  if (returns.length === 0) return 0;
  const sortedReturns = isAlreadySorted ? returns : [...returns].sort((a, b) => a - b);
  // Use a small epsilon to handle floating point issues and get the correct percentile index
  const percentileIndex = Math.floor(returns.length * (1 - confidenceLevel) - 1e-10);
  // Ensure we don't go out of bounds
  const index = Math.max(0, Math.min(percentileIndex, returns.length - 1));
  return sortedReturns[index];
}
