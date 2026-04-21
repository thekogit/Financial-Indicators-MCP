import assert from 'node:assert';
import { test } from 'node:test';
import { PlotData, generatePlot } from './plotter.js';

test('PlotData interface should include regime', () => {
  const data: PlotData = {
    symbol: 'AAPL',
    prices: [100, 101, 102],
    rsi: [50, 55, 60],
    macd: [],
    bb: [],
    regime: 'Trending'
  };
  assert.strictEqual(data.regime, 'Trending');
});

test('generatePlot should generate a buffer', async () => {
  const data: PlotData = {
    symbol: 'AAPL',
    prices: [100, 101, 102, 103, 104, 105],
    rsi: [50, 52, 54, 56, 58, 60],
    macd: [
      { MACD: 1, signal: 0.8, histogram: 0.2 },
      { MACD: 1.1, signal: 0.9, histogram: 0.2 }
    ],
    bb: [
      { upper: 110, lower: 90 },
      { upper: 111, lower: 91 }
    ],
    regime: 'Trending'
  };

  const buffer = await generatePlot(data);
  assert.ok(buffer instanceof Buffer);
  assert.ok(buffer.length > 0);
});
