export function calculateKellyFraction(winRate: number, winLossRatio: number): number {
  if (winRate < 0 || winRate > 1) {
    throw new Error('winRate must be between 0 and 1');
  }
  if (winLossRatio <= 0) return 0;
  const fraction = winRate - ((1 - winRate) / winLossRatio);
  return fraction > 0 ? fraction : 0;
}

export function calculateHistoricalVaR(returns: number[], confidenceLevel: number, isAlreadySorted: boolean = false): number {
  if (returns.length === 0) return 0;
  const sortedReturns = isAlreadySorted ? returns : [...returns].sort((a, b) => a - b);
  // Use a small epsilon to handle floating point issues and get the correct percentile index
  const percentileIndex = Math.floor(returns.length * (1 - confidenceLevel) - 1e-10);
  // Ensure we don't go out of bounds
  const index = Math.max(0, Math.min(percentileIndex, returns.length - 1));
  return sortedReturns[index];
}
