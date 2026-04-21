# Synthesized Quant MCP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the `financial-indicators-mcp` to professional-grade using scientifically validated quantitative methods, focusing on regime detection, feature engineering, and cross-asset correlation.

**Architecture:** A modular service-oriented architecture where specialized "Primes" (Services) handle Regime Detection, Feature Engineering, Sentiment Intelligence, and Trade Validation. These services are exposed via synergistic MCP tools.

**Tech Stack:** TypeScript, Node.js, `simple-statistics` (math/stats), `skia-canvas` (plotting), `ccxt` (crypto), `yahoo-finance2` (stocks).

---

### Task 1: Scaffolding & Dependencies

**Files:**
- Modify: `package.json`
- Create: `src/services/primes/regime.ts`
- Create: `src/services/primes/features.ts`
- Create: `src/services/primes/intelligence.ts`
- Create: `src/services/primes/validation.ts`
- Create: `src/utils/math.ts`

- [ ] **Step 1: Install new dependencies**

Run: `npm install simple-statistics`

- [ ] **Step 2: Create Math Utility for Hurst Exponent and Stationary Transforms**

```typescript
// src/utils/math.ts
import * as ss from 'simple-statistics';

export function calculateLogReturns(prices: number[]): number[] {
  const returns: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push(Math.log(prices[i] / prices[i - 1]));
  }
  return returns;
}

export function calculateZScore(value: number, series: number[]): number {
  if (series.length < 2) return 0;
  const mean = ss.mean(series);
  const stdDev = ss.standardDeviation(series);
  return stdDev === 0 ? 0 : (value - mean) / stdDev;
}

export function calculateHurstExponent(prices: number[]): number {
  if (prices.length < 10) return 0.5; // Neutral
  const logReturns = calculateLogReturns(prices);
  // Simplified R/S analysis for Hurst
  // Real Hurst implementation involves rescaled range over multiple window sizes
  // This is a proxy for persistence
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

export function calculatePearsonCorrelation(seriesA: number[], seriesB: number[]): number {
  if (seriesA.length !== seriesB.length || seriesA.length < 2) return 0;
  return ss.sampleCorrelation(seriesA, seriesB);
}
```

- [ ] **Step 3: Commit scaffolding**

```bash
git add package.json src/utils/math.ts
git commit -m "chore: add quant math utilities and dependencies"
```

---

### Task 2: Market Regime Service

**Files:**
- Create: `src/services/primes/regime.ts`

- [ ] **Step 1: Implement Regime Detection Logic**

```typescript
// src/services/primes/regime.ts
import { calculateHurstExponent } from '../../utils/math.js';
import * as ss from 'simple-statistics';

export interface MarketRegime {
  hurst: number;
  volatilityPercentile: number;
  regime: 'Trending' | 'Mean-Reverting' | 'High-Volatility' | 'Stable';
  confidenceMatrix: Record<string, number>;
}

export function detectRegime(prices: number[], history: number[]): MarketRegime {
  const hurst = calculateHurstExponent(prices);
  
  // Volatility calculation (Standard Deviation of log returns)
  const currentReturns = prices.slice(-20).map((p, i, a) => i === 0 ? 0 : Math.log(p / a[i-1])).slice(1);
  const currentVol = ss.standardDeviation(currentReturns);
  
  const historicalReturns = history.map((p, i, a) => i === 0 ? 0 : Math.log(p / a[i-1])).slice(1);
  const windowSize = 20;
  const historicalVols: number[] = [];
  for (let i = windowSize; i < historicalReturns.length; i++) {
    historicalVols.push(ss.standardDeviation(historicalReturns.slice(i - windowSize, i)));
  }
  
  const volPercentile = historicalVols.filter(v => v < currentVol).length / historicalVols.length;
  
  let regime: MarketRegime['regime'] = 'Stable';
  if (volPercentile > 0.8) regime = 'High-Volatility';
  else if (hurst > 0.55) regime = 'Trending';
  else if (hurst < 0.45) regime = 'Mean-Reverting';
  
  const confidenceMatrix = getConfidenceMatrix(regime);
  
  return { hurst, volatilityPercentile: volPercentile, regime, confidenceMatrix };
}

function getConfidenceMatrix(regime: MarketRegime['regime']): Record<string, number> {
  switch (regime) {
    case 'Trending': return { EMA: 0.9, RSI: 0.3, BB: 0.4 };
    case 'Mean-Reverting': return { EMA: 0.2, RSI: 0.9, BB: 0.8 };
    case 'High-Volatility': return { EMA: 0.4, RSI: 0.1, BB: 0.7 };
    default: return { EMA: 0.5, RSI: 0.5, BB: 0.5 };
  }
}
```

- [ ] **Step 2: Commit Regime Service**

```bash
git add src/services/primes/regime.ts
git commit -m "feat: implement market regime detection service"
```

---

### Task 3: Feature Engineering Service

**Files:**
- Create: `src/services/primes/features.ts`

- [ ] **Step 1: Implement Stationary Feature Transforms**

```typescript
// src/services/primes/features.ts
import { calculateLogReturns, calculateZScore } from '../../utils/math.js';
import { BollingerBands } from 'technicalindicators';

export interface EngineeredFeatures {
  logReturns: number[];
  zScore: number;
  bollingerB: number;
  distanceFromMean: number; // in %
}

export function engineerFeatures(prices: number[]): EngineeredFeatures {
  const logReturns = calculateLogReturns(prices);
  const zScore = calculateZScore(prices[prices.length - 1], prices.slice(-20));
  
  const bb = BollingerBands.calculate({ values: prices, period: 20, stdDev: 2 });
  const latestBB = bb[bb.length - 1];
  const latestPrice = prices[prices.length - 1];
  
  const bollingerB = (latestPrice - latestBB.lower) / (latestBB.upper - latestBB.lower);
  const distanceFromMean = (latestPrice - latestBB.middle) / latestBB.middle;
  
  return { logReturns, zScore, bollingerB, distanceFromMean };
}
```

- [ ] **Step 2: Commit Feature Service**

```bash
git add src/services/primes/features.ts
git commit -m "feat: implement engineered features service"
```

---

### Task 4: Intelligence & Sentiment Service

**Files:**
- Create: `src/services/primes/intelligence.ts`

- [ ] **Step 1: Implement Lightweight Sentiment Scoring**

```typescript
// src/services/primes/intelligence.ts
const POSITIVE_WORDS = new Set(['bullish', 'surge', 'growth', 'gain', 'support', 'etf', 'approval', 'buy', 'long']);
const NEGATIVE_WORDS = new Set(['bearish', 'drop', 'crash', 'hack', 'sec', 'rejection', 'sell', 'short', 'liquidated']);

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
  const speculationIndex = insights.length / 10; // Simple proxy

  return { score, speculationIndex, insights };
}
```

- [ ] **Step 2: Commit Intelligence Service**

```bash
git add src/services/primes/intelligence.ts
git commit -m "feat: implement sentiment intelligence service"
```

---

### Task 5: Validation & Risk Service

**Files:**
- Create: `src/services/primes/validation.ts`

- [ ] **Step 1: Implement Realistic Trade Simulation**

```typescript
// src/services/primes/validation.ts
import { ATR } from 'technicalindicators';

export interface SimulationResult {
  netProfit: number;
  netProfitPercent: number;
  slippageEstimate: number;
  fees: number;
}

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
  const latestATR = atr[atr.length - 1];
  const slippageFactor = (latestATR / entryPrice) * 0.1; // Estimate 10% of ATR as slippage
  
  const slippagePerUnit = entryPrice * slippageFactor;
  const effectiveEntry = entryPrice + slippagePerUnit;
  const effectiveExit = exitPrice - slippagePerUnit;
  
  const grossProfit = (effectiveExit - effectiveEntry) * volume;
  const fees = (entryPrice * volume * takerFee) + (exitPrice * volume * takerFee);
  
  const netProfit = grossProfit - fees;
  const netProfitPercent = (netProfit / (entryPrice * volume)) * 100;
  
  return { netProfit, netProfitPercent, slippageEstimate: slippagePerUnit * 2, fees };
}
```

- [ ] **Step 2: Commit Validation Service**

```bash
git add src/services/primes/validation.ts
git commit -m "feat: implement trade validation and risk service"
```

---

### Task 6: Tool Integration (MCP Server)

**Files:**
- Modify: `src/index.ts`

- [ ] **Step 1: Register New Synergistic Tools**

Add `get-market-regime`, `get-engineered-features`, `get-correlation-matrix`, `get-sentiment-intelligence`, and `simulate-trade` tools to `server.tool(...)`.

- [ ] **Step 2: Implement Tool Handlers**

Connect the MCP tools to the new services created in Tasks 2-5.

- [ ] **Step 3: Update `get-indicators` to include Confidence Score**

Use `detectRegime` within `get-indicators` to add the `confidenceMatrix` to the response.

- [ ] **Step 4: Commit Server Changes**

```bash
git add src/index.ts
git commit -m "feat: integrate synthesized quant tools into MCP server"
```

---

### Task 7: Upgraded Plotter (Regime Shading)

**Files:**
- Modify: `src/services/plotter.ts`

- [ ] **Step 1: Update `PlotData` interface to include regime info**

- [ ] **Step 2: Implement background shading in `drawPricePane`**

Green for Trending, Purple for Mean-Reverting, Red for High-Volatility.

- [ ] **Step 3: Commit Plotter Upgrades**

```bash
git add src/services/plotter.ts
git commit -m "feat: upgrade plotter with regime-based background shading"
```

---

### Task 8: Verification & Cleanup

- [ ] **Step 1: Run comprehensive tests**
- [ ] **Step 2: Verify math outputs**
- [ ] **Step 3: Check visual output of `plot-quant-chart`**
- [ ] **Step 4: Final commit and cleanup**
