# Alpha Engine Service Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the Alpha Engine service to evaluate formulaic alpha signals based on price momentum.

**Architecture:** A simple functional service that calculates momentum-based signals from price arrays, normalizing them between -1 and 1.

**Tech Stack:** TypeScript, Mocha, Node.js.

---

### Task 1: Implement Alpha Engine Service

**Files:**
- Create: `src/services/alpha-engine.ts`
- Create: `src/services/alpha-engine.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
import { evaluateFormulaicAlpha } from './alpha-engine.js';
import * as assert from 'assert';

describe('Alpha Engine Service', () => {
  it('should evaluate a cross-sectional momentum alpha', () => {
    const prices = [100, 101, 102, 105, 110]; // Upward trend
    const signal = evaluateFormulaicAlpha(prices);
    assert.strictEqual(signal > 0, true);
  });

  it('should return a negative signal for downward trend', () => {
    const prices = [110, 105, 102, 101, 100]; // Downward trend
    const signal = evaluateFormulaicAlpha(prices);
    assert.strictEqual(signal < 0, true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx mocha --loader ts-node/esm src/services/alpha-engine.test.ts`
Expected: FAIL (Module not found or function not defined)

- [ ] **Step 3: Write minimal implementation**

```typescript
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

Run: `npx mocha --loader ts-node/esm src/services/alpha-engine.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/services/alpha-engine.ts src/services/alpha-engine.test.ts
git commit -m "feat: implement Alpha Engine service"
```
