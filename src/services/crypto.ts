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
