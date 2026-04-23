# 📊 Financial Indicators MCP Server

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![MCP](https://img.shields.io/badge/MCP-1.0-orange.svg)](https://modelcontextprotocol.io/)

A high-performance **Model Context Protocol (MCP)** server delivering institutional-grade quantitative financial analysis, real-time market data, and professional visualization for global equities and cryptocurrency markets.

---

## 🚀 Key Features

*   **Real-time Market Data**: Direct integration with Yahoo Finance and CCXT for stocks and crypto.
*   **Technical Analysis Engine**: Professional-grade indicators (RSI, MACD, Bollinger Bands) with regime context.
*   **Quant Visualization**: Automated chart generation with technical overlays and interactive plots.
*   **Predictive Intelligence**: Market regime detection, advanced feature engineering, and sentiment analysis.
*   **Risk Management**: Quantitative metrics including Value at Risk (VaR), Sortino ratios, and trade simulations.
*   **Multi-Asset Support**: Seamless analysis across traditional equities and digital assets.

---

## 🛠️ Tool Suite

| Tool | Category | Description |
| :--- | :--- | :--- |
| `get-price` | Data | Retrieves current market prices and daily change. |
| `get-indicators` | Technical | Calculates standard indicators with regime confidence levels. |
| `plot-indicators` | Visualization | Generates high-quality PNG charts with technical overlays. |
| `get-market-regime` | Quant | Identifies state (Trending, Mean Reverting, Volatile). |
| `get-engineered-features` | Quant | Advanced data features for algorithmic modeling. |
| `get-sentiment-intelligence` | AI/NLP | News sentiment scoring and market impact analysis. |
| `simulate-trade` | Risk | Evaluates trade setups with risk-adjusted performance metrics. |
| `get-correlation-matrix` | Analysis | Statistical price relationships between asset classes. |
| `get-portfolio-risk-metrics` | Risk | Deep dive into returns, volatility, and tail risk (VaR). |
| `get-alpha-signal` | Alpha | Momentum and volatility-based trading signal strength. |
| `get-market-news` | Data | Real-time global financial news and symbol-specific feeds. |

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/your-repo/financial-indicators-mcp.git
cd financial-indicators-mcp

# Install dependencies
npm install

# Build the project
npm run build
```

---

## ⚙️ Configuration

Integrate this server into your MCP client (e.g., Claude Desktop, Gemini CLI) by adding it to your `mcpServers` config:

```json
{
  "mcpServers": {
    "financial-indicators": {
      "command": "node",
      "args": ["C:/absolute/path/to/financial-indicators-mcp/dist/index.js"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

---

## 📈 Development Workflow

*   **Build**: `npm run build` - Compiles TypeScript to production JavaScript.
*   **Develop**: `npm run dev` - Watch mode for rapid local development.
*   **Test**: `npm test` - Execute comprehensive test suite for all quant engines.

---

## 🏗️ Project Architecture

```text
src/
├── services/          # Core Quant & Analysis Engines
│   ├── primes/        # Proprietary regime and intelligence logic
│   ├── alpha-engine   # Signal generation
│   ├── plotter        # Visualization logic
│   └── risk-engine    # Risk metrics (VaR, Sortino)
├── utils/             # Math and helper functions
└── index.ts           # MCP Server Entry Point
```

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---
*Built with ❤️ for Quants and Developers.*
