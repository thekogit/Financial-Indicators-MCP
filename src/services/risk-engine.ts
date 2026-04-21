import { calculateHistoricalVaR, calculateKellyFraction } from '../utils/risk-math.js';

export interface PortfolioRiskMetrics {
  var95: number;
  var99: number;
  kellyRecommendation: number;
}

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
