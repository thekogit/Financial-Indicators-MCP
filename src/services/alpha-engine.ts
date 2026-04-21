export function evaluateFormulaicAlpha(prices: number[]): number {
  if (prices.length < 2) return 0;
  const start = prices[0];
  const end = prices[prices.length - 1];
  const momentum = (end - start) / start;
  
  // Normalize signal between -1 and 1 roughly
  const strength = Math.max(-1, Math.min(1, momentum * 10)); 
  return strength;
}
