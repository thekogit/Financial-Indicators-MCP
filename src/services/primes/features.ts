// src/services/primes/features.ts
import { calculateLogReturns, calculateZScore } from '../../utils/math.js';
import { BollingerBands } from 'technicalindicators';

export interface EngineeredFeatures {
  logReturns: number[];
  zScore: number;
  bollingerB: number;
  distanceFromMean: number; // in %
}

export function engineerFeatures(prices: number[]): EngineeredFeatures {
  const logReturns = calculateLogReturns(prices);
  // Z-Score over the last 20 periods
  const zScore = calculateZScore(prices[prices.length - 1], prices.slice(-20));
  
  const bb = BollingerBands.calculate({ values: prices, period: 20, stdDev: 2 });
  const latestBB = bb[bb.length - 1];
  const latestPrice = prices[prices.length - 1];
  
  if (!latestBB) {
    // Fallback if not enough data
    return {
      logReturns,
      zScore,
      bollingerB: 0,
      distanceFromMean: 0
    };
  }
  
  const denominator = latestBB.upper - latestBB.lower;
  const bollingerB = denominator === 0 ? 0.5 : (latestPrice - latestBB.lower) / denominator;
  const distanceFromMean = latestBB.middle === 0 ? 0 : (latestPrice - latestBB.middle) / latestBB.middle;
  
  return { logReturns, zScore, bollingerB, distanceFromMean };
}
