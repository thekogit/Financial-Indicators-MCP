// src/utils/math.ts
import * as ss from 'simple-statistics';

export function calculateLogReturns(prices: number[]): number[] {
  const returns: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push(Math.log(prices[i] / prices[i - 1]));
  }
  return returns;
}

export function calculateZScore(value: number, series: number[]): number {
  if (series.length < 2) return 0;
  const mean = ss.mean(series);
  const stdDev = ss.standardDeviation(series);
  return stdDev === 0 ? 0 : (value - mean) / stdDev;
}

// Simplified R/S analysis for Hurst
// Real Hurst implementation involves rescaled range over multiple window sizes
// This is a proxy for persistence
export function calculateHurstExponent(prices: number[]): number {
  if (prices.length < 10) return 0.5; // Neutral
  const logReturns = calculateLogReturns(prices);
  const n = logReturns.length;
  const mean = ss.mean(logReturns);
  const centered = logReturns.map(r => r - mean);
  const cumulative = centered.reduce((acc, val) => {
    const last = acc.length > 0 ? acc[acc.length - 1] : 0;
    acc.push(last + val);
    return acc;
  }, [] as number[]);

  const range = Math.max(...cumulative) - Math.min(...cumulative);
  const stdDev = ss.standardDeviation(logReturns);

  if (stdDev === 0) return 0.5;
  const rs = range / stdDev;
  return Math.log(rs) / Math.log(n);
}

export function calculatePearsonCorrelation(seriesA: number[], seriesB: number[]): number {
  if (seriesA.length !== seriesB.length || seriesA.length < 2) return 0;
  return ss.sampleCorrelation(seriesA, seriesB);
}
