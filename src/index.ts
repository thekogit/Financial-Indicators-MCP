// src/index.ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { getStockPrice, getStockHistory, getMarketNews } from './services/finance.js';
import { getCryptoPrice, getCryptoHistory } from './services/crypto.js';
import { isCrypto } from './utils/helpers.js';
import { calculateRSI, calculateMACD, calculateBB } from './services/ta-engine.js';
import { generatePlot } from './services/plotter.js';

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
      ? await getCryptoHistory(symbol, interval, limit) 
      : await getStockHistory(symbol, interval, limit);
    
    const prices = history.map((h: any) => h.close as number);
    
    const rsi = calculateRSI(prices);
    const macd = calculateMACD(prices);
    const bb = calculateBB(prices);

    return {
      content: [{ 
        type: 'text', 
        text: JSON.stringify({
          symbol,
          interval,
          rsi,
          macd,
          bb,
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

    const plotBuffer = await generatePlot({
      symbol,
      prices: prices.slice(-limit),
      rsi: rsi.slice(-limit),
      macd: macd.slice(-limit),
      bb: bb.slice(-limit)
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

const transport = new StdioServerTransport();
await server.connect(transport);
console.error('Financial Indicators MCP Server running...');
