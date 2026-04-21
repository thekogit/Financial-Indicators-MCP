import assert from 'node:assert';
import { test } from 'node:test';
import { calculateLogReturns, calculateZScore, calculatePearsonCorrelation } from './math.js';

test('calculateLogReturns', () => {
  const prices = [100, 110, 121];
  const returns = calculateLogReturns(prices);
  assert.strictEqual(returns.length, 2);
  assert.ok(Math.abs(returns[0] - Math.log(1.1)) < 1e-10);
});

test('calculateZScore', () => {
  const series = [1, 2, 3, 4, 5];
  const z = calculateZScore(3, series);
  assert.strictEqual(z, 0);
});

test('calculatePearsonCorrelation', () => {
  const seriesA = [1, 2, 3];
  const seriesB = [2, 4, 6];
  const corr = calculatePearsonCorrelation(seriesA, seriesB);
  assert.strictEqual(corr, 1);
});
