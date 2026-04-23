import { calculateHistoricalVaR, calculateKellyFraction } from '../utils/risk-math.js';

/**
 * Metrics representing the risk profile of a portfolio.
 */
export interface PortfolioRiskMetrics {
  /** Value at Risk at 95% confidence level */
  var95: number;
  /** Value at Risk at 99% confidence level */
  var99: number;
  /** Recommended position size fraction based on the Kelly Criterion */
  kellyRecommendation: number;
}

/**
 * Calculates risk metrics for a given portfolio of returns.
 * 
 * @param portfolioReturns - Array of historical portfolio returns (as decimals)
 * @param winRate - Estimated probability of a winning trade (0 to 1)
 * @param winLossRatio - Ratio of average win amount to average loss amount
 * @returns An object containing VaR and Kelly Criterion metrics
 */
export function getPortfolioRiskMetrics(
  portfolioReturns: number[], 
  winRate: number = 0.5, 
  winLossRatio: number = 1.0
): PortfolioRiskMetrics {
  if (portfolioReturns.length === 0) {
    return { var95: 0, var99: 0, kellyRecommendation: calculateKellyFraction(winRate, winLossRatio) };
  }
  
  // Sort once and pass pre-sorted array to avoid O(N log N) overhead
  const sortedReturns = [...portfolioReturns].sort((a, b) => a - b);
  
  // Use pre-sorted array for both VaR calculations
  const var95 = calculateHistoricalVaR(sortedReturns, 0.95, true);
  const var99 = calculateHistoricalVaR(sortedReturns, 0.99, true);
  const kellyRecommendation = calculateKellyFraction(winRate, winLossRatio);

  return { var95, var99, kellyRecommendation };
}
