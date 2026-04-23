// src/utils/math.ts
import * as ss from 'simple-statistics';

/**
 * Calculates the logarithmic returns for a series of prices.
 * Log returns are additive and often preferred in quantitative finance for their statistical properties.
 * 
 * @param prices - An array of numerical price values.
 * @returns An array of log returns with length prices.length - 1.
 */
export function calculateLogReturns(prices: number[]): number[] {
  const returns: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push(Math.log(prices[i] / prices[i - 1]));
  }
  return returns;
}

/**
 * Computes the Z-Score of a value relative to a numerical series.
 * The Z-Score indicates how many standard deviations a value is from the mean.
 * 
 * @param value - The specific value to score.
 * @param series - The reference series to calculate mean and standard deviation from.
 * @returns The Z-Score, or 0 if the series length is less than 2 or standard deviation is 0.
 */
export function calculateZScore(value: number, series: number[]): number {
  if (series.length < 2) return 0;
  const mean = ss.mean(series);
  const stdDev = ss.standardDeviation(series);
  return stdDev === 0 ? 0 : (value - mean) / stdDev;
}

/**
 * Estimates the Hurst Exponent for a series of prices using a simplified Rescaled Range (R/S) analysis.
 * The Hurst Exponent measures the long-term memory or persistence of a time series.
 * H > 0.5 indicates persistence, H < 0.5 indicates anti-persistence, and H = 0.5 indicates random walk.
 * 
 * @param prices - An array of numerical price values.
 * @returns The estimated Hurst Exponent, defaulting to 0.5 if data is insufficient.
 */
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

/**
 * Calculates the Pearson Correlation Coefficient between two numerical series.
 * Measures the linear correlation between series A and series B.
 * 
 * @param seriesA - The first numerical series.
 * @param seriesB - The second numerical series.
 * @returns The correlation coefficient ranging from -1 to 1, or 0 if lengths mismatch or series are too short.
 */
export function calculatePearsonCorrelation(seriesA: number[], seriesB: number[]): number {
  if (seriesA.length !== seriesB.length || seriesA.length < 2) return 0;
  return ss.sampleCorrelation(seriesA, seriesB);
}
