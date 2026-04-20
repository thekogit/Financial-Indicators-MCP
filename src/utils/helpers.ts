// src/utils/helpers.ts
export function isCrypto(symbol: string): boolean {
  // Simple heuristic: crypto symbols often contain / (e.g. BTC/USDT) 
  // or are common 3-4 letter uppercase tickers that don't match major stocks
  // For this MVP, we'll check for "/" or common crypto base assets.
  const commonCrypto = ['BTC', 'ETH', 'SOL', 'XRP', 'ADA', 'DOT'];
  const base = symbol.split('/')[0].toUpperCase();
  return symbol.includes('/') || commonCrypto.includes(base);
}
