// src/services/primes/intelligence.ts
const POSITIVE_WORDS = new Set(['bullish', 'surge', 'growth', 'gain', 'support', 'etf', 'approval', 'buy', 'long', 'rally', 'upgrade']);
const NEGATIVE_WORDS = new Set(['bearish', 'drop', 'crash', 'hack', 'sec', 'rejection', 'sell', 'short', 'liquidated', 'dump', 'lawsuit']);

export interface SentimentResult {
  score: number; // -1 to 1
  speculationIndex: number; // 0 to 1
  insights: string[];
}

export function analyzeSentiment(headlines: string[]): SentimentResult {
  let totalScore = 0;
  let wordCount = 0;
  const insights: string[] = [];

  headlines.forEach(text => {
    const words = text.toLowerCase().split(/\W+/);
    words.forEach(word => {
      if (POSITIVE_WORDS.has(word)) totalScore += 1;
      if (NEGATIVE_WORDS.has(word)) totalScore -= 1;
      wordCount++;
    });
    
    if (text.toLowerCase().includes('retail') || text.toLowerCase().includes('reddit')) {
      insights.push('High retail speculation detected');
    }
  });

  const score = wordCount > 0 ? Math.max(-1, Math.min(1, totalScore / (headlines.length * 2))) : 0;
  const speculationIndex = Math.min(1, insights.length / 5); // Simple proxy

  return { score, speculationIndex, insights: [...new Set(insights)] };
}
