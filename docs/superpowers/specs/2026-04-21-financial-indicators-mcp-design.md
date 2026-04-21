# Financial Indicators Plotting Design Spec

> **Date:** 2026-04-21
> **Status:** Draft
> **Author:** Gemini CLI

## 1. Overview
The `financial-indicators-mcp` currently returns only a summary of the latest technical indicators (RSI, MACD, Bollinger Bands). This design expands the MCP server to return full historical indicator data and introduces a new plotting tool to generate visual charts.

## 2. Goals
- **Fix Data Truncation:** Update the `get-indicators` tool to return full data arrays instead of just the latest value.
- **Visual Representation:** Implement a `plot-indicators` tool that generates a professional multi-pane chart (Price/BB, RSI, MACD).
- **Local Persistence:** Save generated plots to a local `plots/` directory.
- **UI Integration:** Return images as MCP image content types for compatible clients.

## 3. Architecture

### 3.1 Components
- **Data Layer (`src/services/crypto.ts` / `src/index.ts`):** Fetches ~150 periods of price history to provide enough data for technical indicators (e.g., 20 for BB, 14 for RSI, 26 for MACD).
- **TA Engine (`src/services/ta-engine.ts`):** Calculates RSI, MACD, and Bollinger Bands using the `technicalindicators` library. Returns full arrays.
- **Plotting Service (`src/services/plotter.ts`):**
    - Uses `skia-canvas` for high-performance server-side rendering.
    - Implements a multi-pane layout:
        - **Pane 1 (Top, 60%):** Price Candlesticks + Bollinger Bands (Upper/Lower/Middle).
        - **Pane 2 (Middle, 20%):** RSI line (0-100) with 30/70 thresholds.
        - **Pane 3 (Bottom, 20%):** MACD lines + Signal line + Histogram bars.
- **MCP Server (`src/index.ts`):** Exposes `get-indicators` (updated) and `plot-indicators` (new).

### 3.2 Data Flow
1. User calls `plot-indicators` for a specific symbol (e.g., BTC/USDT).
2. Server fetches 150 periods of OHLCV data.
3. TA Engine calculates full indicator series.
4. Plotting Service receives price + indicator data and draws the multi-pane chart.
5. Server saves the PNG to `plots/<symbol>_<timestamp>.png`.
6. Server returns the PNG buffer as an image content type to the client.

## 4. Technical Details

### 4.1 Libraries
- `skia-canvas`: For fast, local PNG generation.
- `technicalindicators`: Already in use for calculation.

### 4.2 Error Handling
- Handle cases where insufficient price data is available (e.g., new listings).
- Ensure the `plots/` directory exists before saving.
- Catch and log canvas rendering errors.

## 5. Testing Strategy
- **Unit Tests:** Verify the `ta-engine` returns full arrays of the correct length.
- **Integration Tests:** Mock the canvas rendering and verify the `plot-indicators` tool returns a non-empty image buffer and saves a file.
- **Manual Verification:** Generate a plot for BTC/USDT and inspect the saved PNG for visual correctness.

## 6. Scope & Constraints
- Only supports PNG output for now.
- Default look-back is fixed at 100 visible periods on the chart (using 150 for calculation).
- Terminal-only execution (no browser-based UI).
