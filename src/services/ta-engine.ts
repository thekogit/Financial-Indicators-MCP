// src/services/ta-engine.ts
import { RSI, MACD, BollingerBands } from 'technicalindicators';

/**
 * Calculates the Relative Strength Index (RSI) for a series of prices.
 * 
 * @param prices - Array of closing prices
 * @param period - The time period for RSI calculation (default: 14)
 * @returns Array of RSI values
 */
export function calculateRSI(prices: number[], period: number = 14) {
  return RSI.calculate({ values: prices, period });
}

/**
 * Calculates the Moving Average Convergence Divergence (MACD) for a series of prices.
 * 
 * Uses standard 12/26/9 parameters.
 * 
 * @param prices - Array of closing prices
 * @returns Array of MACD objects (MACD, signal, histogram)
 */
export function calculateMACD(prices: number[]) {
  return MACD.calculate({
    values: prices,
    fastPeriod: 12,
    slowPeriod: 26,
    signalPeriod: 9,
    SimpleMAOscillator: false,
    SimpleMASignal: false
  });
}

/**
 * Calculates Bollinger Bands for a series of prices.
 * 
 * @param prices - Array of closing prices
 * @param period - The time period for the moving average (default: 20)
 * @returns Array of Bollinger Band objects (upper, middle, lower)
 */
export function calculateBB(prices: number[], period: number = 20) {
  return BollingerBands.calculate({ values: prices, period, stdDev: 2 });
}
