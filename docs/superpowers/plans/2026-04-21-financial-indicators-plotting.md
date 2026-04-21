# Financial Indicators Plotting Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the `get-indicators` tool to return full data series and implement a `plot-indicators` tool that generates a PNG chart of price and indicators using `skia-canvas`.

**Architecture:** Update the main server to expose full data, and create a specialized `Plotter` service to render multi-pane charts (Price/BB, RSI, MACD).

**Tech Stack:** TypeScript, MCP SDK, `skia-canvas`, `technicalindicators`.

---

### Task 1: Environment Setup & Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install skia-canvas**

Run: `npm install skia-canvas`
Expected: `skia-canvas` added to dependencies.

- [ ] **Step 2: Verify installation**

Run: `npm list skia-canvas`
Expected: Version of `skia-canvas` shown.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add skia-canvas dependency"
```

---

### Task 2: Fix Data Truncation in `get-indicators`

**Files:**
- Modify: `src/index.ts`

- [ ] **Step 1: Update return object to include full arrays**

```typescript
// src/index.ts (inside get-indicators tool)
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
```

- [ ] **Step 2: Commit**

```bash
git add src/index.ts
git commit -m "fix: return full indicator data series in get-indicators"
```

---

### Task 3: Implement Plotting Service

**Files:**
- Create: `src/services/plotter.ts`

- [ ] **Step 1: Create Plotter service with basic multi-pane layout**

```typescript
import { Canvas, CanvasRenderingContext2D } from 'skia-canvas';
import * as fs from 'fs';
import * as path from 'path';

export interface PlotData {
  symbol: string;
  prices: number[];
  rsi: number[];
  macd: any[];
  bb: any[];
}

export async function generatePlot(data: PlotData): Promise<Buffer> {
  const width = 800;
  const height = 1000;
  const canvas = new Canvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#1e1e1e';
  ctx.fillRect(0, 0, width, height);

  // Layout segments: Price (600px), RSI (200px), MACD (200px)
  drawPricePane(ctx, 0, 0, width, 600, data);
  drawRSIPane(ctx, 0, 600, width, 200, data.rsi);
  drawMACDPane(ctx, 0, 800, width, 200, data.macd);

  const buffer = await canvas.toBuffer('png');
  
  // Save locally
  const plotsDir = path.join(process.cwd(), 'plots');
  if (!fs.existsSync(plotsDir)) fs.mkdirSync(plotsDir);
  const filename = `${data.symbol.replace('/', '_')}_${Date.now()}.png`;
  fs.writeFileSync(path.join(plotsDir, filename), buffer);

  return buffer;
}

function drawPricePane(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, data: PlotData) {
  ctx.strokeStyle = '#ffffff';
  ctx.strokeRect(x + 50, y + 20, w - 70, h - 40);
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`${data.symbol} Price & BB`, x + 60, y + 40);
  // Implementation details for candles and BB lines...
}

function drawRSIPane(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, rsi: number[]) {
  ctx.strokeStyle = '#ffffff';
  ctx.strokeRect(x + 50, y + 20, w - 70, h - 40);
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`RSI`, x + 60, y + 40);
  // Implementation details for RSI line...
}

function drawMACDPane(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, macd: any[]) {
  ctx.strokeStyle = '#ffffff';
  ctx.strokeRect(x + 50, y + 20, w - 70, h - 40);
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`MACD`, x + 60, y + 40);
  // Implementation details for MACD histograms...
}
```

- [ ] **Step 2: Commit**

```bash
git add src/services/plotter.ts
git commit -m "feat: implement basic plotting service"
```

---

### Task 4: Add `plot-indicators` Tool

**Files:**
- Modify: `src/index.ts`

- [ ] **Step 1: Register plot-indicators tool**

```typescript
// src/index.ts
import { generatePlot } from './services/plotter.js';

server.tool('plot-indicators', {
  symbol: z.string().describe('Ticker symbol'),
  interval: z.enum(['1m', '5m', '1h', '1d', '1wk']).default('1d'),
  limit: z.number().default(100)
}, async ({ symbol, interval, limit }) => {
  try {
    const history = isCrypto(symbol) 
      ? await getCryptoHistory(symbol, interval, limit + 50) 
      : await getStockHistory(symbol, interval, limit + 50);
    
    const prices = history.map((h: any) => h.close as number);
    const rsi = calculateRSI(prices);
    const macd = calculateMACD(prices);
    const bb = calculateBB(prices);

    const buffer = await generatePlot({
      symbol,
      prices: prices.slice(-limit),
      rsi: rsi.slice(-limit),
      macd: macd.slice(-limit),
      bb: bb.slice(-limit)
    });

    return {
      content: [
        { type: 'text', text: `Plot generated and saved to plots/ directory.` },
        { 
          type: 'image', 
          data: buffer.toString('base64'), 
          mimeType: 'image/png' 
        }
      ]
    };
  } catch (error: any) {
    return {
      content: [{ type: 'text', text: `Error plotting indicators for ${symbol}: ${error.message}` }],
      isError: true
    };
  }
});
```

- [ ] **Step 2: Commit**

```bash
git add src/index.ts
git commit -m "feat: add plot-indicators tool to server"
```

---

### Task 5: Final Verification

- [ ] **Step 1: Build the project**

Run: `npm run build`
Expected: No compilation errors.

- [ ] **Step 2: Manual test with BTC/USDT**

Run the MCP server and call `plot-indicators` for BTC/USDT.
Expected: Image returned and file created in `plots/`.

- [ ] **Step 3: Commit**

```bash
git commit -m "docs: finalize implementation of plotting feature"
```
