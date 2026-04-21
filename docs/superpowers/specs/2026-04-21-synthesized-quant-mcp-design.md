# Synthesized Quant MCP Server Design Spec

> **Date:** 2026-04-21
> **Status:** Approved
> **Author:** Gemini CLI
> **Objective:** Upgrade the `financial-indicators-mcp` to professional-grade using scientifically validated quantitative methods.

## 1. Overview
Traditional technical analysis often fails due to market non-stationarity, regime shifts, and ignorance of transaction costs. This design implements a "Synthesized Quant" framework that prioritizes market regime detection, feature engineering, and cross-asset correlation to provide high-fidelity signals.

## 2. Scientific Foundation (Research-Based)
Based on current quantitative finance research (Jane Street, Citadel, arXiv 2024):
- **Validated:** EMA/Bollinger Bands (Volatility Clustering), Hurst Exponent (Trend Persistence), Stationary Transforms (Log-Returns).
- **Limited/Weak:** RSI (only at extremes), Fibonacci (overfitting), MACD (high turnover/cost).
- **Gaps Addressed:** Market Sentiment integration, Non-stationary data handling, Cross-asset correlation, and Transaction cost simulation.

## 3. Architecture: The "Synthesized Quant" Framework

### 3.1 Specialized Service Primes
- **Regime Prime:** Classifies market state (Trending vs. Mean-Reverting) using Hurst Exponent and Rolling Volatility.
- **Engineered Features Prime:** Provides Log-Returns and Z-Scores (Standardized Distance from Mean).
- **Intelligence Prime:** Native VADER-style sentiment scoring and News-to-Insight extraction.
- **Validation Prime:** Realistic trade simulation including slippage and exchange fees.

### 3.2 Data Strategy
- **Stationary Transforms:** All price data is transformed into Log-Returns or Z-Scores to remove price drift.
- **Regime-Aware Confidence:** Indicators are returned with a "Confidence Score" mapped to the detected market regime.
- **Systemic Confirmation:** Cross-asset correlation checks if a move is symbol-specific or market-wide.

## 4. Tool Definitions

### 4.1 Context & Regime
- `get-market-regime`: Hurst Exponent, Volatility Percentile, and Regime Label.
- `get-confidence-matrix`: Weighting map for indicators based on the current regime.

### 4.2 Signal & Features
- `get-engineered-features`: Log-Returns, Z-Scores, and Bollinger %B.
- `get-momentum-signals`: EMA Crossovers, RSI, and ROC with validity flags.
- `get-volume-dynamics`: VWAP and Money Flow Index (MFI).

### 4.3 Intelligence & Macro
- `get-correlation-matrix`: Pearson correlation with benchmarks (BTC, SPY, DXY, etc.).
- `get-sentiment-intelligence`: Headline sentiment scoring and Speculation Index.

### 4.4 Reality Check
- `simulate-trade`: Net profit calculation after ATR-based slippage and fees.
- `get-risk-metrics`: Value-at-Risk (VaR) and Maximum Drawdown.

### 4.5 Visualization
- `plot-quant-chart`: Multi-pane chart with **Regime Shading** and Correlation panes.

## 5. Technical Implementation
- **Language:** TypeScript (Node.js).
- **Key Libraries:** `simple-statistics` (math), `skia-canvas` (plotting), `vader-sentiment` or equivalent (lightweight NLP).
- **Data Sources:** Yahoo Finance (Stocks), Binance/CCXT (Crypto).

## 6. Testing & Validation
- **Unit Tests:** Verify Hurst and Correlation math against known datasets.
- **Integration Tests:** Verify multi-tool synergy (e.g., Regime -> Signal -> Simulation).
- **Verification:** Reproduction of research-backed behavior (e.g., RSI failing in trends).
