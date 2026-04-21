# Design Specification: Financial Indicators MCP Server (Node.js)

**Date:** 2026-04-20
**Status:** Approved
**Topic:** Financial Indicators MCP Server for LM Studio

## 1. Overview
A specialized MCP server that provides real-time financial data, technical indicators, and market news for both stocks (Yahoo Finance) and cryptocurrencies (CCXT). The server is designed for use with MCP-compatible clients like LM Studio, Claude Desktop, and Cursor.

## 2. Goals
- Provide real-time price and OHLCV data.
- Calculate technical indicators (RSI, MACD, etc.) locally.
- Aggregate financial news and market summaries.
- No API keys required for primary stock data.
- Seamlessly handle both stock and crypto symbols.

## 3. Architecture
- **Language:** Node.js (TypeScript)
- **Transport:** Standard I/O (stdio)
- **Data Fetchers:**
  - `yahoo-finance2`: For stocks, ETFs, indices, and news.
  - `ccxt`: For cryptocurrency exchange data (Public APIs).
- **Technical Analysis Engine:** `technicalindicators` library.

## 4. MCP Tools
### `get_price`
- **Description:** Get real-time price and daily statistics.
- **Inputs:** `symbol` (e.g., AAPL, BTC/USDT)

### `get_indicators`
- **Description:** Get pre-calculated technical indicators.
- **Inputs:**
  - `symbol`: Target asset.
  - `indicators`: List of indicators (SMA, EMA, RSI, MACD, BB, ATR).
  - `interval`: Data interval (1m, 5m, 1h, 1d, 1wk).
  - `period`: Lookback period (default: 14).

### `get_market_news`
- **Description:** Get latest financial news.
- **Inputs:** `symbol` (optional)

### `get_market_summary`
- **Description:** Get top gainers, losers, and major index levels.
- **Inputs:** None

## 5. File Structure
```
financial_indicators_mcp/
├── src/
│   ├── index.ts          # Server entry point & tool definitions
│   ├── services/
│   │   ├── finance.ts    # Yahoo Finance logic
│   │   ├── crypto.ts     # CCXT logic
│   │   └── ta-engine.ts  # Technical Analysis calculations
│   └── utils/
│       └── helpers.ts    # Symbol detection & formatting
├── package.json
├── tsconfig.json
└── README.md
```

## 6. Build & Execution
- **Build:** `npm run build` (compiles TS to `dist/index.js`)
- **Run:** `node dist/index.js` or `npm start`
- **LM Studio Integration:** Point LM Studio to the `node dist/index.js` command.
