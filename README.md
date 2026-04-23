# Financial Indicators MCP Server

A comprehensive Model Context Protocol (MCP) server providing advanced quantitative financial analysis tools, real-time market data, and visualization capabilities for both traditional stocks and cryptocurrency markets.

## Features

- Real-time and historical data retrieval for global equities and major cryptocurrency pairs.
- Technical analysis engine supporting RSI, MACD, and Bollinger Bands.
- Visual charting system generating high-quality PNG plots with technical overlays.
- Quantitative analysis tools including market regime detection, feature engineering, and correlation matrices.
- Risk management modules for calculating Value at Risk (VaR), Sortino ratios, and trade simulation.
- Market intelligence through news sentiment analysis.
- Alpha signal generation based on momentum and volatility metrics.

## Supported Instruments

- Stocks: Global equities via Yahoo Finance integration.
- Cryptocurrency: Major pairs across global exchanges via CCXT integration.

## Installation

```bash
npm install
npm run build
```

## Tools

The server exposes several tools for financial analysis:

- get-price: Retrieves current market prices for a given symbol.
- get-indicators: Calculates standard technical indicators and market regime confidence.
- plot-indicators: Generates a visual plot of price action and technical overlays.
- get-market-news: Fetches latest news headlines for broader market or specific symbols.
- get-market-regime: Identifies current market state (Trending, Mean Reverting, Volatile).
- get-engineered-features: Produces advanced features for quantitative modeling.
- get-sentiment-intelligence: Performs NLP-based sentiment analysis on market news.
- simulate-trade: Evaluates trade performance with risk-adjusted metrics.
- get-correlation-matrix: Measures price relationship between different assets.
- get-portfolio-risk-metrics: Analyzes returns for VaR and other risk indicators.
- get-alpha-signal: Evaluates momentum-based alpha strength.

## Configuration

To use this server with an MCP client, add it to your configuration file:

```json
{
  "mcpServers": {
    "financial-indicators": {
      "command": "node",
      "args": ["path/to/financial-indicators-mcp/dist/index.js"]
    }
  }
}
```

## Development

- Build: `npm run build`
- Watch Mode: `npm run dev`
- Tests: `npm test`

## License

MIT
