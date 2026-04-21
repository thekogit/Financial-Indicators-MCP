// src/index.ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { getStockPrice, getStockHistory, getMarketNews } from './services/finance.js';
import { getCryptoPrice, getCryptoHistory } from './services/crypto.js';
import { isCrypto } from './utils/helpers.js';
import { calculateRSI, calculateMACD, calculateBB } from './services/ta-engine.js';
import { calculatePearsonCorrelation } from './utils/math.js';
import { generatePlot } from './services/plotter.js';
import { detectRegime } from './services/primes/regime.js';
import { engineerFeatures } from './services/primes/features.js';
import { analyzeSentiment } from './services/primes/intelligence.js';
import { simulateTrade } from './services/primes/validation.js';

const server = new McpServer({
  name: 'financial-indicators',
  version: '1.0.0'
});

server.tool('get-price', {
  symbol: z.string().describe('Ticker symbol (e.g. AAPL, BTC/USDT)')
}, async ({ symbol }) => {
  try {
    const data = isCrypto(symbol) ? await getCryptoPrice(symbol) : await getStockPrice(symbol);
    return {
      content: [{ type: 'text', text: JSON.stringify(data, null, 2) }]
    };
  } catch (error: any) {
    return {
      content: [{ type: 'text', text: `Error fetching price for ${symbol}: ${error.message}` }],
      isError: true
    };
  }
});

server.tool('get-indicators', {
  symbol: z.string().describe('Ticker symbol'),
  interval: z.enum(['1m', '5m', '1h', '1d', '1wk']).default('1d'),
  limit: z.number().default(100)
}, async ({ symbol, interval, limit }) => {
  try {
    const history = isCrypto(symbol) 
      ? await getCryptoHistory(symbol, interval, limit * 2) 
      : await getStockHistory(symbol, interval, limit * 2);
    
    const allPrices = history.map((h: any) => h.close as number);
    const prices = allPrices.slice(-limit);
    
    const rsi = calculateRSI(allPrices).slice(-limit);
    const macd = calculateMACD(allPrices).slice(-limit);
    const bb = calculateBB(allPrices).slice(-limit);
    
    // Get market regime for confidence matrix
    const { confidenceMatrix } = detectRegime(prices, allPrices);

    return {
      content: [{ 
        type: 'text', 
        text: JSON.stringify({
          symbol,
          interval,
          rsi,
          macd,
          bb,
          confidenceMatrix,
          historyCount: history.length
        }, null, 2) 
      }]
    };
  } catch (error: any) {
    return {
      content: [{ type: 'text', text: `Error calculating indicators for ${symbol}: ${error.message}` }],
      isError: true
    };
  }
});

server.tool('plot-indicators', {
  symbol: z.string().describe('Ticker symbol'),
  interval: z.enum(['1m', '5m', '1h', '1d', '1wk']).default('1d'),
  limit: z.number().default(100)
}, async ({ symbol, interval, limit }) => {
  try {
    const fetchLimit = limit + 50;
    const history = isCrypto(symbol)
      ? await getCryptoHistory(symbol, interval, fetchLimit)
      : await getStockHistory(symbol, interval, fetchLimit);

    const prices = history.map((h: any) => h.close as number);
    const rsi = calculateRSI(prices);
    const macd = calculateMACD(prices);
    const bb = calculateBB(prices);

    const { regime } = detectRegime(prices.slice(-limit), prices);

    const plotBuffer = await generatePlot({
      symbol,
      prices: prices.slice(-limit),
      rsi: rsi.slice(-limit),
      macd: macd.slice(-limit),
      bb: bb.slice(-limit),
      regime: regime
    });

    return {
      content: [
        { type: 'text', text: `Successfully generated plot for ${symbol} (${interval})` },
        { type: 'image', data: plotBuffer.toString('base64'), mimeType: 'image/png' }
      ]
    };
  } catch (error: any) {
    return {
      content: [{ type: 'text', text: `Error generating plot for ${symbol}: ${error.message}` }],
      isError: true
    };
  }
});

server.tool('get-market-news', {
  symbol: z.string().optional().describe('Ticker symbol for specific news')
}, async ({ symbol }) => {
  try {
    const news = await getMarketNews(symbol);
    return {
      content: [{ type: 'text', text: JSON.stringify(news, null, 2) }]
    };
  } catch (error: any) {
    return {
      content: [{ type: 'text', text: `Error fetching news: ${error.message}` }],
      isError: true
    };
  }
});

server.tool('get-market-regime', {
  symbol: z.string().describe('Ticker symbol'),
  interval: z.enum(['1m', '5m', '1h', '1d', '1wk']).default('1d'),
  limit: z.number().default(100)
}, async ({ symbol, interval, limit }) => {
  try {
    const history = isCrypto(symbol) 
      ? await getCryptoHistory(symbol, interval, limit * 2) 
      : await getStockHistory(symbol, interval, limit * 2);
    
    const prices = history.map((h: any) => h.close as number);
    const result = detectRegime(prices.slice(-limit), prices);

    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
    };
  } catch (error: any) {
    return {
      content: [{ type: 'text', text: `Error detecting regime for ${symbol}: ${error.message}` }],
      isError: true
    };
  }
});

server.tool('get-engineered-features', {
  symbol: z.string().describe('Ticker symbol'),
  interval: z.enum(['1m', '5m', '1h', '1d', '1wk']).default('1d'),
  limit: z.number().default(100)
}, async ({ symbol, interval, limit }) => {
  try {
    const history = isCrypto(symbol) 
      ? await getCryptoHistory(symbol, interval, limit) 
      : await getStockHistory(symbol, interval, limit);
    
    const prices = history.map((h: any) => h.close as number);
    const result = engineerFeatures(prices);

    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
    };
  } catch (error: any) {
    return {
      content: [{ type: 'text', text: `Error engineering features for ${symbol}: ${error.message}` }],
      isError: true
    };
  }
});

server.tool('get-sentiment-intelligence', {
  symbol: z.string().optional().describe('Ticker symbol for specific news')
}, async ({ symbol }) => {
  try {
    const news = await getMarketNews(symbol);
    const headlines = news.map((n: any) => n.headline || n.title || '');
    const result = analyzeSentiment(headlines);

    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
    };
  } catch (error: any) {
    return {
      content: [{ type: 'text', text: `Error analyzing sentiment: ${error.message}` }],
      isError: true
    };
  }
});

server.tool('simulate-trade', {
  symbol: z.string().describe('Ticker symbol'),
  entryPrice: z.number().positive(),
  exitPrice: z.number(),
  volume: z.number().positive().default(1)
}, async ({ symbol, entryPrice, exitPrice, volume }) => {
  try {
    const history = isCrypto(symbol) 
      ? await getCryptoHistory(symbol, '1d', 30) 
      : await getStockHistory(symbol, '1d', 30);
    
    const highs = history.map((h: any) => h.high as number);
    const lows = history.map((h: any) => h.low as number);
    const closes = history.map((h: any) => h.close as number);

    const result = simulateTrade(entryPrice, exitPrice, volume, highs, lows, closes);

    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
    };
  } catch (error: any) {
    return {
      content: [{ type: 'text', text: `Error simulating trade for ${symbol}: ${error.message}` }],
      isError: true
    };
  }
});

server.tool('get-correlation-matrix', {
  symbol: z.string().describe('Base ticker symbol (e.g. AAPL)'),
  benchmarks: z.array(z.string()).describe('List of symbols to correlate with (e.g. ["BTC/USDT", "SPY"])'),
  interval: z.enum(['1m', '5m', '1h', '1d', '1wk']).default('1d'),
  limit: z.number().default(100)
}, async ({ symbol, benchmarks, interval, limit }) => {
  try {
    const fetchHistory = async (s: string) => {
      return isCrypto(s) 
        ? await getCryptoHistory(s, interval, limit) 
        : await getStockHistory(s, interval, limit);
    };

    const baseHistory = await fetchHistory(symbol);
    const basePrices = baseHistory.map((h: any) => h.close as number);

    const results: Record<string, number> = {};
    results[symbol] = 1.0;

    for (const b of benchmarks) {
      try {
        const bHistory = await fetchHistory(b);
        const bPrices = bHistory.map((h: any) => h.close as number);
        
        // Align lengths if necessary
        const minLength = Math.min(basePrices.length, bPrices.length);
        if (minLength < 2) {
          results[b] = 0;
          continue;
        }
        
        const alignedBase = basePrices.slice(-minLength);
        const alignedB = bPrices.slice(-minLength);
        
        results[b] = calculatePearsonCorrelation(alignedBase, alignedB);
      } catch (e) {
        results[b] = 0;
      }
    }

    return {
      content: [{ 
        type: 'text', 
        text: JSON.stringify({
          base: symbol,
          correlations: results,
          window: limit,
          interval
        }, null, 2) 
      }]
    };
  } catch (error: any) {
    return {
      content: [{ type: 'text', text: `Error calculating correlations: ${error.message}` }],
      isError: true
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
console.error('Financial Indicators MCP Server running...');
