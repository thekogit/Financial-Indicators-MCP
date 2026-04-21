import { evaluateFormulaicAlpha } from './alpha-engine.js';
import * as assert from 'assert';

describe('Alpha Engine Service', () => {
  it('should evaluate a cross-sectional momentum alpha', () => {
    const prices = [100, 101, 102, 105, 110];
    const signal = evaluateFormulaicAlpha(prices);
    assert.strictEqual(signal > 0, true);
  });

  it('should return 0 for zero momentum', () => {
    const prices = [100, 100, 100];
    const signal = evaluateFormulaicAlpha(prices);
    assert.strictEqual(signal, 0);
  });

  it('should handle zero starting price safely', () => {
    const signal = evaluateFormulaicAlpha([0, 10]);
    assert.strictEqual(signal, 1);
  });

  it('should handle empty or small arrays', () => {
    assert.strictEqual(evaluateFormulaicAlpha([]), 0);
    assert.strictEqual(evaluateFormulaicAlpha([100]), 0);
  });

  it('should clamp large momentum', () => {
    const signal = evaluateFormulaicAlpha([10, 100]); // 900% gain
    assert.strictEqual(signal, 1);
  });
});
