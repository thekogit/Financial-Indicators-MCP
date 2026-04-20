// src/services/finance.ts
import yahooFinance from 'yahoo-finance2';

export async function getStockPrice(symbol: string) {
  const result = await yahooFinance.quote(symbol);
  return {
    symbol: result.symbol,
    price: result.regularMarketPrice,
    change: result.regularMarketChange,
    changePercent: result.regularMarketChangePercent,
    high: result.regularMarketDayHigh,
    low: result.regularMarketDayLow,
    volume: result.regularMarketVolume
  };
}
