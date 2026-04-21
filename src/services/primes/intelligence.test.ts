import assert from 'node:assert';
import { test } from 'node:test';
import { analyzeSentiment } from './intelligence.js';

test('analyzeSentiment returns positive score for bullish headlines', () => {
  const headlines = ['The market is bullish today', 'ETF approval is likely', 'Growth is surging'];
  const result = analyzeSentiment(headlines);
  
  assert.ok(result.score > 0, `Score should be positive, got ${result.score}`);
  assert.strictEqual(result.speculationIndex, 0);
  assert.strictEqual(result.insights.length, 0);
});

test('analyzeSentiment returns negative score for bearish headlines', () => {
  const headlines = ['Massive crash in prices', 'SEC lawsuit filed', 'Liquidated short positions'];
  const result = analyzeSentiment(headlines);
  
  assert.ok(result.score < 0, `Score should be negative, got ${result.score}`);
});

test('analyzeSentiment detects retail speculation', () => {
  const headlines = ['Retail traders are buying', 'Reddit sentiment is high'];
  const result = analyzeSentiment(headlines);
  
  assert.ok(result.insights.includes('High retail speculation detected'));
  assert.ok(result.speculationIndex > 0);
});

test('analyzeSentiment handles neutral headlines', () => {
  const headlines = ['The weather is nice', 'Nothing happened today'];
  const result = analyzeSentiment(headlines);
  
  assert.strictEqual(result.score, 0);
  assert.strictEqual(result.speculationIndex, 0);
});

test('analyzeSentiment handles empty input', () => {
  const result = analyzeSentiment([]);
  
  assert.strictEqual(result.score, 0);
  assert.strictEqual(result.speculationIndex, 0);
  assert.strictEqual(result.insights.length, 0);
});
