import assert from 'node:assert';
import { test } from 'node:test';
import { simulateTrade } from './validation.js';

test('simulateTrade calculates profit and fees correctly', () => {
  const entryPrice = 100;
  const exitPrice = 110;
  const volume = 1;
  const highs = Array(20).fill(105);
  const lows = Array(20).fill(95);
  const closes = Array(20).fill(100);

  const result = simulateTrade(entryPrice, exitPrice, volume, highs, lows, closes);

  assert.ok(typeof result.netProfit === 'number');
  assert.ok(typeof result.netProfitPercent === 'number');
  assert.ok(typeof result.slippageEstimate === 'number');
  assert.ok(typeof result.fees === 'number');
  
  // Basic sanity check: With 10% gain, net profit should be around 10 minus fees and slippage
  assert.ok(result.netProfit < 10); 
  assert.ok(result.fees > 0);
});

test('simulateTrade handles zero volume', () => {
  const result = simulateTrade(100, 110, 0, Array(20).fill(105), Array(20).fill(95), Array(20).fill(100));
  assert.strictEqual(result.netProfit, 0);
  assert.strictEqual(result.netProfitPercent, 0);
  assert.strictEqual(result.fees, 0);
});
