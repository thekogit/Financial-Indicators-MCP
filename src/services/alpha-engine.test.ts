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
