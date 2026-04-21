# Financial Indicators MCP Server Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a headless Node.js MCP server that provides real-time price data, technical indicators, and market news for stocks and crypto.

**Architecture:** Use `@modelcontextprotocol/sdk` for the MCP layer, `yahoo-finance2` for stock data, `ccxt` for crypto, and `technicalindicators` for local TA calculations.

**Tech Stack:** Node.js, TypeScript, Zod, CCXT, Yahoo Finance 2, TechnicalIndicators.

---

### Task 1: Project Initialization

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `.gitignore`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "financial-indicators-mcp",
  "version": "1.0.0",
  "description": "Financial Indicators MCP Server",
  "main": "dist/index.js",
  "type": "module",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsc -w"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.1",
    "ccxt": "^4.2.0",
    "yahoo-finance2": "^2.13.2",
    "technicalindicators": "^3.1.0",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/node": "^20.11.0",
    "typescript": "^5.3.3"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"]
}
```

- [ ] **Step 3: Create .gitignore**

```text
node_modules
dist
.env
.superpowers
```

- [ ] **Step 4: Install dependencies**

Run: `npm install`

- [ ] **Step 5: Commit**

```bash
git add package.json tsconfig.json .gitignore
git commit -m "chore: initialize project and install dependencies"
```

---

### Task 2: Core Data Services

**Files:**
- Create: `src/services/finance.ts`
- Create: `src/services/crypto.ts`
- Create: `src/utils/helpers.ts`

- [ ] **Step 1: Implement symbol detection helper**

```typescript
// src/utils/helpers.ts
export function isCrypto(symbol: string): boolean {
  // Simple heuristic: crypto symbols often contain / (e.g. BTC/USDT) 
  // or are common 3-4 letter uppercase tickers that don't match major stocks
  // For this MVP, we'll check for "/" or common crypto base assets.
  const commonCrypto = ['BTC', 'ETH', 'SOL', 'XRP', 'ADA', 'DOT'];
  const base = symbol.split('/')[0].toUpperCase();
  return symbol.includes('/') || commonCrypto.includes(base);
}
```

- [ ] **Step 2: Implement Yahoo Finance service**

```typescript
// src/services/finance.ts
import yahooFinance from 'yahoo-finance2';

export async function getStockPrice(symbol: string) {
  const result = await yahooFinance.quote(symbol);
  return {
    symbol: result.symbol,
    price: result.regularMarketPrice,
    change: result.regularMarketChange,
    changePercent: result.regularMarketChangePercent,
    high: result.regularMarketDayHigh,
    low: result.regularMarketDayLow,
    volume: result.regularMarketVolume
  };
}
```

- [ ] **Step 3: Implement CCXT service**

```typescript
// src/services/crypto.ts
import ccxt from 'ccxt';

const binance = new ccxt.binance();

export async function getCryptoPrice(symbol: string) {
  const ticker = await binance.fetchTicker(symbol.includes('/') ? symbol : `${symbol}/USDT`);
  return {
    symbol: ticker.symbol,
    price: ticker.last,
    change: ticker.change,
    changePercent: ticker.percentage,
    high: ticker.high,
    low: ticker.low,
    volume: ticker.baseVolume
  };
}
```

- [ ] **Step 4: Commit**

```bash
git add src/services/ src/utils/
git commit -m "feat: implement basic data services for stocks and crypto"
```

---

### Task 3: Technical Analysis Engine

**Files:**
- Create: `src/services/ta-engine.ts`

- [ ] **Step 1: Implement TA Engine with technicalindicators**

```typescript
// src/services/ta-engine.ts
import { RSI, MACD, BollingerBands } from 'technicalindicators';

export function calculateRSI(prices: number[], period: number = 14) {
  return RSI.calculate({ values: prices, period });
}

export function calculateMACD(prices: number[]) {
  return MACD.calculate({
    values: prices,
    fastPeriod: 12,
    slowPeriod: 26,
    signalPeriod: 9,
    SimpleMAOscillator: false,
    SimpleMASignal: false
  });
}

export function calculateBB(prices: number[], period: number = 20) {
  return BollingerBands.calculate({ values: prices, period, stdDev: 2 });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/services/ta-engine.ts
git commit -m "feat: add technical analysis engine"
```

---

### Task 4: MCP Server Implementation

**Files:**
- Create: `src/index.ts`

- [ ] **Step 1: Implement MCP Server and Tool Definitions**

```typescript
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
```

- [ ] **Step 2: Build the project**

Run: `npm run build`

- [ ] **Step 3: Commit**

```bash
git add src/index.ts
git commit -m "feat: implement MCP server with get-price tool"
```

---

### Task 5: Expanding Tools (Indicators & News)

**Files:**
- Modify: `src/index.ts`
- Modify: `src/services/finance.ts`

- [ ] **Step 1: Add News and Summary methods to finance service**

```typescript
// src/services/finance.ts (Additions)
export async function getMarketNews(symbol?: string) {
  // Use yahooFinance.search or similar for news
  const query = symbol || 'market news';
  const result = await yahooFinance.search(query);
  return result.news;
}
```

- [ ] **Step 2: Register get-indicators and get-market-news tools**

```typescript
// src/index.ts (Additions)
// ... register get-indicators tool using ta-engine ...
// ... register get-market-news tool ...
```

- [ ] **Step 3: Final Build and Test**

Run: `npm run build`

- [ ] **Step 4: Commit**

```bash
git add src/
git commit -m "feat: add get-indicators and get-market-news tools"
```
