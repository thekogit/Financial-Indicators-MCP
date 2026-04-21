# Professional Quant Decision Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transition the `financial-indicators-mcp` into a professional-grade Dual-Engine (Alpha & Risk) Decision Engine.

**Architecture:** We will build two distinct namespaces. The Alpha Engine will focus on discovery (formulaic alphas, LOB imbalance), and the Risk Engine will focus on allocation (Kelly sizing, VaR). We will use Test-Driven Development (TDD) to build the mathematical primitives first, then the services, and finally expose them via the MCP server.

**Tech Stack:** TypeScript, Node.js, Jest/Mocha (existing test runner), Model Context Protocol SDK, `simple-statistics`.

---

### Task 1: Risk Engine Primitives (Kelly Criterion)

**Files:**
- Create: `src/utils/risk-math.test.ts`
- Create: `src/utils/risk-math.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// src/utils/risk-math.test.ts
import { calculateKellyFraction } from './risk-math.js';
import * as assert from 'assert';

describe('Risk Math Utilities', () => {
  it('should calculate Kelly Fraction correctly', () => {
    // Win rate = 0.55 (55%), Win/Loss Ratio = 1.2
    // Kelly = W - ((1 - W) / R) = 0.55 - (0.45 / 1.2) = 0.55 - 0.375 = 0.175 (17.5%)
    const fraction = calculateKellyFraction(0.55, 1.2);
    assert.strictEqual(Math.abs(fraction - 0.175) < 0.001, true);
  });

  it('should return 0 for negative edge', () => {
    const fraction = calculateKellyFraction(0.40, 1.0);
    assert.strictEqual(fraction, 0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx ts-node --esm node_modules/mocha/bin/mocha src/utils/risk-math.test.ts` (or equivalent project test command)
Expected: FAIL with "Cannot find module"

- [ ] **Step 3: Write minimal implementation**

```typescript
// src/utils/risk-math.ts
export function calculateKellyFraction(winRate: number, winLossRatio: number): number {
  if (winLossRatio <= 0) return 0;
  const fraction = winRate - ((1 - winRate) / winLossRatio);
  return fraction > 0 ? fraction : 0;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx ts-node --esm node_modules/mocha/bin/mocha src/utils/risk-math.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/utils/risk-math.ts src/utils/risk-math.test.ts
git commit -m "feat: add Kelly Criterion calculation utility"
```

---

### Task 2: Risk Engine Primitives (Value-at-Risk)

**Files:**
- Modify: `src/utils/risk-math.test.ts`
- Modify: `src/utils/risk-math.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// Append to src/utils/risk-math.test.ts
import { calculateHistoricalVaR } from './risk-math.js';

describe('Value at Risk (VaR)', () => {
  it('should calculate 95% historical VaR correctly', () => {
    // 100 returns. Sorted, the 5th percentile (index 4) represents the 95% confidence worst loss.
    const returns = Array.from({ length: 100 }, (_, i) => (i - 50) / 1000); // returns from -0.05 to +0.049
    // Sorted: -0.050, -0.049, -0.048, -0.047, -0.046... index 4 is -0.046
    const var95 = calculateHistoricalVaR(returns, 0.95);
    assert.strictEqual(Math.abs(var95 - (-0.046)) < 0.001, true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx ts-node --esm node_modules/mocha/bin/mocha src/utils/risk-math.test.ts`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**

```typescript
// Append to src/utils/risk-math.ts
import * as ss from 'simple-statistics';

export function calculateHistoricalVaR(returns: number[], confidenceLevel: number): number {
  if (returns.length === 0) return 0;
  const sortedReturns = [...returns].sort((a, b) => a - b);
  const percentileIndex = Math.floor(returns.length * (1 - confidenceLevel));
  // Ensure we don't go out of bounds
  const index = Math.max(0, Math.min(percentileIndex, returns.length - 1));
  return sortedReturns[index];
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx ts-node --esm node_modules/mocha/bin/mocha src/utils/risk-math.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/utils/risk-math.ts src/utils/risk-math.test.ts
git commit -m "feat: add Historical VaR calculation utility"
```

---

### Task 3: Risk Engine Service

**Files:**
- Create: `src/services/risk-engine.ts`
- Create: `src/services/risk-engine.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// src/services/risk-engine.test.ts
import { getPortfolioRiskMetrics } from './risk-engine.js';
import * as assert from 'assert';

describe('Risk Engine Service', () => {
  it('should return risk metrics for a portfolio', () => {
    const portfolioReturns = [-0.01, 0.02, -0.03, 0.01, 0.05, -0.02, -0.04, 0.03, 0.01, 0.02];
    const metrics = getPortfolioRiskMetrics(portfolioReturns);
    
    assert.strictEqual(typeof metrics.var95, 'number');
    assert.strictEqual(metrics.kellyRecommendation, 0); // No edge provided, defaults to 0 or we mock
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx ts-node --esm node_modules/mocha/bin/mocha src/services/risk-engine.test.ts`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**

```typescript
// src/services/risk-engine.ts
import { calculateHistoricalVaR, calculateKellyFraction } from '../utils/risk-math.js';

export interface PortfolioRiskMetrics {
  var95: number;
  var99: number;
  kellyRecommendation: number;
}

export function getPortfolioRiskMetrics(
  portfolioReturns: number[], 
  winRate: number = 0.5, 
  winLossRatio: number = 1.0
): PortfolioRiskMetrics {
  const var95 = calculateHistoricalVaR(portfolioReturns, 0.95);
  const var99 = calculateHistoricalVaR(portfolioReturns, 0.99);
  const kellyRecommendation = calculateKellyFraction(winRate, winLossRatio);

  return {
    var95,
    var99,
    kellyRecommendation
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx ts-node --esm node_modules/mocha/bin/mocha src/services/risk-engine.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/services/risk-engine.ts src/services/risk-engine.test.ts
git commit -m "feat: implement Risk Engine service"
```

---

### Task 4: Alpha Engine Service

**Files:**
- Create: `src/services/alpha-engine.ts`
- Create: `src/services/alpha-engine.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// src/services/alpha-engine.test.ts
import { evaluateFormulaicAlpha } from './alpha-engine.js';
import * as assert from 'assert';

describe('Alpha Engine Service', () => {
  it('should evaluate a cross-sectional momentum alpha', () => {
    const prices = [100, 101, 102, 105, 110]; // Upward trend
    const signal = evaluateFormulaicAlpha(prices);
    assert.strictEqual(signal > 0, true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx ts-node --esm node_modules/mocha/bin/mocha src/services/alpha-engine.test.ts`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**

```typescript
// src/services/alpha-engine.ts
export interface AlphaSignal {
  strength: number; // -1.0 to 1.0
  type: string;
}

export function evaluateFormulaicAlpha(prices: number[]): number {
  if (prices.length < 2) return 0;
  const start = prices[0];
  const end = prices[prices.length - 1];
  const momentum = (end - start) / start;
  
  // Normalize signal between -1 and 1 roughly
  const strength = Math.max(-1, Math.min(1, momentum * 10)); 
  return strength;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx ts-node --esm node_modules/mocha/bin/mocha src/services/alpha-engine.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/services/alpha-engine.ts src/services/alpha-engine.test.ts
git commit -m "feat: implement Alpha Engine service"
```

---

### Task 5: MCP Server Integration

**Files:**
- Modify: `src/index.ts`

- [ ] **Step 1: Add new tools to server registration**

```typescript
// Modify src/index.ts. Add these tool registrations before the `transport` initialization.
import { getPortfolioRiskMetrics } from './services/risk-engine.js';
import { evaluateFormulaicAlpha } from './services/alpha-engine.js';
// (Ensure these are imported at the top)

server.tool('get-portfolio-risk-metrics', {
  returns: z.array(z.number()).describe('Array of historical portfolio returns'),
  winRate: z.number().min(0).max(1).default(0.5).describe('Historical win rate'),
  winLossRatio: z.number().min(0).default(1.0).describe('Historical win/loss ratio')
}, async ({ returns, winRate, winLossRatio }) => {
  try {
    const metrics = getPortfolioRiskMetrics(returns, winRate, winLossRatio);
    return {
      content: [{ type: 'text', text: JSON.stringify(metrics, null, 2) }]
    };
  } catch (error: any) {
    return {
      content: [{ type: 'text', text: `Error calculating risk metrics: ${error.message}` }],
      isError: true
    };
  }
});

server.tool('get-alpha-signal', {
  symbol: z.string().describe('Ticker symbol'),
  interval: z.enum(['1m', '5m', '1h', '1d', '1wk']).default('1d'),
  limit: z.number().default(100)
}, async ({ symbol, interval, limit }) => {
  try {
    const history = isCrypto(symbol) 
      ? await getCryptoHistory(symbol, interval, limit) 
      : await getStockHistory(symbol, interval, limit);
    
    const prices = history.map((h: any) => h.close as number);
    const signal = evaluateFormulaicAlpha(prices);

    return {
      content: [{ 
        type: 'text', 
        text: JSON.stringify({ symbol, signalStrength: signal, type: 'momentum' }, null, 2) 
      }]
    };
  } catch (error: any) {
    return {
      content: [{ type: 'text', text: `Error generating alpha signal: ${error.message}` }],
      isError: true
    };
  }
});
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `npx tsc --noEmit`
Expected: Exits with code 0 (no errors)

- [ ] **Step 3: Commit**

```bash
git add src/index.ts
git commit -m "feat: expose alpha and risk engine tools via MCP"
```
