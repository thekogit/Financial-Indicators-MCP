
import { calculateRSI, calculateMACD, calculateBB } from './services/ta-engine.js';
import { generatePlot } from './services/plotter.js';

async function testTool() {
  const symbol = "BTC/USDT";
  const limit = 100;
  console.log("Simulating tool call...");
  
  const prices = Array.from({length: 150}, (_, i) => 50000 + Math.random() * 1000);
  const rsi = calculateRSI(prices);
  const macd = calculateMACD(prices);
  const bb = calculateBB(prices);

  console.log("Calculated indicators. Generating plot...");
  try {
    const buffer = await generatePlot({
      symbol,
      prices: prices.slice(-limit),
      rsi: rsi.slice(-limit),
      macd: macd.slice(-limit),
      bb: bb.slice(-limit),
      regime: 'Stable'
    });
    console.log("Success! Buffer size:", buffer.length);
  } catch (err) {
    console.error("Tool call failed:", err);
  }
}

testTool();
