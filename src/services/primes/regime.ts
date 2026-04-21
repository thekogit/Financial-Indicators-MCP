// src/services/primes/regime.ts
import { calculateHurstExponent } from '../../utils/math.js';
import * as ss from 'simple-statistics';

export interface MarketRegime {
  hurst: number;
  volatilityPercentile: number;
  regime: 'Trending' | 'Mean-Reverting' | 'High-Volatility' | 'Stable';
  confidenceMatrix: Record<string, number>;
}

export function detectRegime(prices: number[], history: number[]): MarketRegime {
  if (prices.length < 2) {
    return {
      hurst: 0.5,
      volatilityPercentile: 0.5,
      regime: 'Stable',
      confidenceMatrix: getConfidenceMatrix('Stable')
    };
  }
  const hurst = calculateHurstExponent(prices);
  
  const windowSize = 20;
  // Volatility calculation (Standard Deviation of log returns)
  const currentReturns = prices.slice(-(windowSize + 1)).map((p, i, a) => i === 0 ? 0 : Math.log(p / a[i-1])).slice(1);
  const currentVol = ss.standardDeviation(currentReturns);
  
  const historicalReturns = history.map((p, i, a) => i === 0 ? 0 : Math.log(p / a[i-1])).slice(1);
  const historicalVols: number[] = [];
  for (let i = windowSize; i <= historicalReturns.length; i++) {
    historicalVols.push(ss.standardDeviation(historicalReturns.slice(i - windowSize, i)));
  }
  
  const volPercentile = historicalVols.length > 0 
    ? historicalVols.filter(v => v < currentVol).length / historicalVols.length
    : 0.5;
  
  let regime: MarketRegime['regime'] = 'Stable';
  if (volPercentile > 0.8) regime = 'High-Volatility';
  else if (hurst > 0.55) regime = 'Trending';
  else if (hurst < 0.45) regime = 'Mean-Reverting';
  
  const confidenceMatrix = getConfidenceMatrix(regime);
  
  return { hurst, volatilityPercentile: volPercentile, regime, confidenceMatrix };
}

function getConfidenceMatrix(regime: MarketRegime['regime']): Record<string, number> {
  switch (regime) {
    case 'Trending': return { EMA: 0.9, RSI: 0.3, BB: 0.4 };
    case 'Mean-Reverting': return { EMA: 0.2, RSI: 0.9, BB: 0.8 };
    case 'High-Volatility': return { EMA: 0.4, RSI: 0.1, BB: 0.7 };
    default: return { EMA: 0.5, RSI: 0.5, BB: 0.5 };
  }
}
