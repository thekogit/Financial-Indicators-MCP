import { getPortfolioRiskMetrics } from './risk-engine.js';
import * as assert from 'assert';

describe('Risk Engine Service', () => {
  it('should return risk metrics for a portfolio', () => {
    // Sorted: -0.04, -0.03, -0.02, -0.01, 0.01, 0.01, 0.02, 0.02, 0.03, 0.05 (10 items)
    // 95% Var (1 - 0.95 = 0.05): Index Math.floor(10 * 0.05 - 1e-10) = 0. Value = -0.04
    // 99% Var (1 - 0.99 = 0.01): Index Math.floor(10 * 0.01 - 1e-10) = 0. Value = -0.04
    const portfolioReturns = [-0.01, 0.02, -0.03, 0.01, 0.05, -0.02, -0.04, 0.03, 0.01, 0.02];
    const metrics = getPortfolioRiskMetrics(portfolioReturns);
    
    assert.strictEqual(metrics.var95, -0.04);
    assert.strictEqual(metrics.var99, -0.04);
    assert.strictEqual(metrics.kellyRecommendation, 0);
  });

  it('should calculate Kelly with provided edge', () => {
    const metrics = getPortfolioRiskMetrics([0], 0.6, 1.5);
    // Kelly = 0.6 - (0.4 / 1.5) = 0.6 - 0.2666... = 0.3333...
    assert.strictEqual(Math.abs(metrics.kellyRecommendation - 0.3333) < 0.001, true);
  });
});
