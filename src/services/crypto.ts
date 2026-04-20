// src/services/crypto.ts
import ccxt from 'ccxt';

const binance = new ccxt.binance();

export async function getCryptoPrice(symbol: string) {
  const ticker = await binance.fetchTicker(symbol.includes('/') ? symbol : `${symbol}/USDT`);
  return {
    symbol: ticker.symbol,
    price: ticker.last,
    change: ticker.change,
    changePercent: ticker.percentage,
    high: ticker.high,
    low: ticker.low,
    volume: ticker.baseVolume
  };
}

export async function getCryptoHistory(symbol: string, interval: string = '1d', limit: number = 100) {
  const fullSymbol = symbol.includes('/') ? symbol : `${symbol}/USDT`;
  const ohlcv = await binance.fetchOHLCV(fullSymbol, interval as any, undefined, limit);
  return ohlcv.map(q => ({
    date: new Date(q[0] as number),
    open: q[1] as number,
    high: q[2] as number,
    low: q[3] as number,
    close: q[4] as number,
    volume: q[5] as number
  }));
}
