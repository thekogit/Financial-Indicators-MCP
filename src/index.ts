// src/index.ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { getStockPrice } from './services/finance.js';
import { getCryptoPrice } from './services/crypto.js';
import { isCrypto } from './utils/helpers.js';

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

const transport = new StdioServerTransport();
await server.connect(transport);
console.error('Financial Indicators MCP Server running...');
