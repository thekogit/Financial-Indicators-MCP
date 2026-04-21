# Professional Quant Decision Engine MCP Design Spec

> **Date:** 2026-04-21
> **Status:** Draft
> **Author:** Gemini CLI
> **Objective:** Transition the `financial-indicators-mcp` from a retail-indicator tool into a professional-grade Decision Engine for intraday discovery and long-term allocation.

## 1. Overview
This design implements a **Dual-Engine Architecture** based on the `Final_PDF_Dataset` research (Thorp, Kelly, Avellaneda, Bouchaud). It separates the identification of statistical "edge" (Alpha) from the management of capital "allocation" (Risk).

## 2. Architecture: Dual-Engine System

### 2.1 Alpha Engine (The Discovery Layer)
Focused on finding entry/exit signals using market microstructure and formulaic alphas.
- **Microstructure Service:** Connects to Binance/Crypto WebSocket/REST for real-time Order Book (LOB) analysis.
- **Formulaic Alpha Library:** Implementation of "101 Alphas" style logic (Cross-sectional momentum, mean-reversion).
- **Stat-Arb Service:** Cointegration and Z-score mapping for pair trading.

### 2.2 Risk Engine (The Allocation Layer)
Focused on position sizing, portfolio construction, and downside protection.
- **Sizing Service:** Kelly Criterion implementation (Optimal f, Half-Kelly, Fractional).
- **Optimization Service:** Hierarchical Risk Parity (HRP) to cluster assets and balance risk without fragile correlation matrices.
- **Risk Metrics Service:** Value-at-Risk (VaR) and Conditional VaR (CVaR/Expected Shortfall) for total portfolio monitoring.

## 3. Tool Definitions

### 3.1 Alpha Engine Tools
- `get-alpha-signal`: Returns signal strength (-1 to 1) based on research-backed formulaic factors.
- `analyze-pair-cointegration`: Tests relationship between two assets for Stat-Arb entries.
- `get-lob-imbalance`: Analyzes real-time Order Book depth to predict short-term price pressure.
- `get-vpin-metric`: Volume-Synchronized Probability of Informed Trading to detect "smart money" moves.

### 3.2 Risk Engine Tools
- `calculate-kelly-sizing`: Determines optimal bet size based on win rate and edge.
- `optimize-portfolio-hrp`: Recommends weights for a list of symbols using Hierarchical Risk Parity.
- `get-portfolio-risk-metrics`: Returns VaR, CVaR, and Maximum Drawdown for a set of positions.
- `estimate-trade-impact`: Estimates slippage and market impact (Almgren-Chriss) for a given trade size.

## 4. Technical Strategy
- **Data Layer:** 
    - **Intraday:** Binance API (via `ccxt` or direct) for free LOB/Tick data.
    - **Macro:** Yahoo Finance for daily historical data.
- **Math Library:** Use `simple-statistics` for distribution analysis and `ml-matrix` for HRP clustering.
- **State Management:** The server will maintain a `portfolio-context.json` (local, non-committed) to track current "mock" or real positions for risk calculations.

## 5. Implementation Phases
1. **Phase 1: Alpha Core.** Implement LOB imbalance and basic formulaic Alphas.
2. **Phase 2: Risk Core.** Implement Kelly Sizing and VaR calculation.
3. **Phase 3: Portfolio Core.** Implement HRP Optimization.
4. **Phase 4: Synthesis.** Update `plot-quant-chart` to visualize Alpha signals alongside Risk constraints.

## 6. Success Criteria
- Tool returns "Optimal Bet Size" derived from Kelly math.
- Portfolio-wide VaR is calculable with a single tool call.
- LOB Imbalance shows >70% correlation with short-term (1m) direction in backtests.
