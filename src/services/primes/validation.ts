// src/services/primes/validation.ts
import { ATR } from 'technicalindicators';

export interface SimulationResult {
  netProfit: number;
  netProfitPercent: number;
  slippageEstimate: number;
  fees: number;
}

/**
 * Simulates a trade and calculates performance metrics with slippage and fees.
 * @param entryPrice The price at which the trade was entered.
 * @param exitPrice The price at which the trade was exited.
 * @param volume The number of units traded.
 * @param highs Array of high prices for ATR calculation.
 * @param lows Array of low prices for ATR calculation.
 * @param closes Array of close prices for ATR calculation.
 */
export function simulateTrade(
  entryPrice: number, 
  exitPrice: number, 
  volume: number,
  highs: number[],
  lows: number[],
  closes: number[]
): SimulationResult {
  const makerFee = 0.001; // 0.1%
  const takerFee = 0.002; // 0.2%
  
  // ATR-based slippage estimation
  const atr = ATR.calculate({ high: highs, low: lows, close: closes, period: 14 });
  const latestATR = atr[atr.length - 1] || 0;
  const slippageFactor = entryPrice > 0 ? (latestATR / entryPrice) * 0.1 : 0; // Estimate 10% of ATR as slippage
  
  const slippagePerUnit = entryPrice * slippageFactor;
  const effectiveEntry = entryPrice + slippagePerUnit;
  const effectiveExit = exitPrice - slippagePerUnit;
  
  const grossProfit = (effectiveExit - effectiveEntry) * volume;
  const fees = (entryPrice * volume * takerFee) + (exitPrice * volume * takerFee);
  
  const netProfit = grossProfit - fees;
  const netProfitPercent = (entryPrice * volume) > 0 ? (netProfit / (entryPrice * volume)) * 100 : 0;
  
  return { netProfit, netProfitPercent, slippageEstimate: slippagePerUnit * 2, fees };
}
