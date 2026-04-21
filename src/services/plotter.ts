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
  const ctx = canvas.getContext('2d') as unknown as CanvasRenderingContext2D;

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
  const filename = `${data.symbol.replace('/', '_').replace(':', '_')}_${Date.now()}.png`;
  fs.writeFileSync(path.join(plotsDir, filename), buffer);

  return buffer;
}

function drawPricePane(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, data: PlotData) {
  ctx.strokeStyle = '#ffffff';
  ctx.strokeRect(x + 50, y + 20, w - 70, h - 40);
  ctx.fillStyle = '#ffffff';
  ctx.font = '20px Arial';
  ctx.fillText(`${data.symbol} Price & BB`, x + 60, y + 40);
}

function drawRSIPane(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, rsi: number[]) {
  ctx.strokeStyle = '#ffffff';
  ctx.strokeRect(x + 50, y + 20, w - 70, h - 40);
  ctx.fillStyle = '#ffffff';
  ctx.font = '20px Arial';
  ctx.fillText(`RSI`, x + 60, y + 40);
}

function drawMACDPane(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, macd: any[]) {
  ctx.strokeStyle = '#ffffff';
  ctx.strokeRect(x + 50, y + 20, w - 70, h - 40);
  ctx.fillStyle = '#ffffff';
  ctx.font = '20px Arial';
  ctx.fillText(`MACD`, x + 60, y + 40);
}
