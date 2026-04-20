// src/services/ta-engine.ts
import { RSI, MACD, BollingerBands } from 'technicalindicators';

export function calculateRSI(prices: number[], period: number = 14) {
  return RSI.calculate({ values: prices, period });
}

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

export function calculateBB(prices: number[], period: number = 20) {
  return BollingerBands.calculate({ values: prices, period, stdDev: 2 });
}
