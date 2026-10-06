"use client";

import { useEffect, useRef } from "react";

// A sunny Alola beach painted pixel-by-pixel on a tiny canvas, then scaled up
// with nearest-neighbour filtering. The internal resolution follows the viewport
// aspect (min 180 rows, min 200 columns) so nothing is stretched or cropped.
const FPS = 8;

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SKY = ["#2f9fe8", "#47b2f0", "#62c3f5", "#80d2f8", "#a2e0fb", "#c4ecfc"];
const SEA = ["#1f78c8", "#2690d8", "#2ea8e0", "#38c0e0", "#54d4dc"];

export default function AlolaBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 320;
    let H = 180;
    let horizon = 108;
    let shore = 144;
    let frame = 0;
    let raf = 0;
    let last = 0;

    const resize = () => {
      const aspect = window.innerWidth / window.innerHeight;
      H = Math.max(180, Math.round(200 / aspect));
      W = Math.round(H * aspect);
      horizon = Math.round(H * 0.6);
      shore = Math.round(H * 0.8);
      canvas.width = W;
      canvas.height = H;
      draw();
    };

    const px = (x: number, y: number, w: number, h: number, c: string) => {
      ctx.fillStyle = c;
      ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
    };

    const disc = (cx: number, cy: number, r: number, c: string) => {
      ctx.fillStyle = c;
      for (let y = -r; y <= r; y++) {
        const half = Math.floor(Math.sqrt(r * r - y * y));
        ctx.fillRect(Math.round(cx - half), Math.round(cy + y), half * 2 + 1, 1);
      }
    };

    function sky() {
      const bandH = horizon / SKY.length;
      SKY.forEach((c, i) => {
        px(0, i * bandH, W, bandH + 1, c);
        // dither into the next band
        if (i < SKY.length - 1) {
          ctx.fillStyle = SKY[i + 1];
          const y0 = Math.round((i + 1) * bandH) - 2;
          for (let x = 0; x < W; x += 2) {
            ctx.fillRect(x, y0, 1, 1);
            ctx.fillRect(x + 1, y0 + 1, 1, 1);
          }
        }
      });
    }

    function sun() {
      const cx = W * 0.8;
      const cy = H * 0.18;
      // dithered halo
      ctx.fillStyle = "#fff8c8";
      for (let y = -30; y <= 30; y++)
        for (let x = -30; x <= 30; x++) {
          const d = x * x + y * y;
          if (d < 900 && d > 380 && (x + y) % 2 === 0) ctx.fillRect(Math.round(cx + x), Math.round(cy + y), 1, 1);
        }
      // rays
      const rot = reduce ? 0 : (frame % 16) * (Math.PI / 32);
      ctx.fillStyle = "#ffe36a";
      for (let i = 0; i < 12; i++) {
        const a = rot + (i * Math.PI) / 6;
        for (let r = 21; r < (i % 2 ? 27 : 31); r++) ctx.fillRect(Math.round(cx + Math.cos(a) * r), Math.round(cy + Math.sin(a) * r), 2, 2);
      }
      disc(cx, cy, 18, "#ffc830");
      disc(cx, cy, 16, "#ffe050");
      disc(cx - 2, cy - 2, 12, "#fff090");
      disc(cx - 5, cy - 5, 4, "#ffffff");
    }

    function cloud(x: number, y: number, s: number) {
      const parts: [number, number, number][] = [
        [0, 4, 6],
        [8, 0, 9],
        [18, 3, 7],
        [26, 6, 5],
      ];
      parts.forEach(([dx, dy, r]) => disc(x + dx * s, y + dy * s + 2, r * s, "#a8d8f0"));
      parts.forEach(([dx, dy, r]) => disc(x + dx * s, y + dy * s, r * s, "#ffffff"));
      px(x - 4 * s, y + 6 * s, 34 * s, 4 * s, "#ffffff");
    }

    function clouds() {
      const t = reduce ? 0 : frame * 0.35;
      const span = W + 120;
      [
        [0.05, 0.12, 1],
        [0.42, 0.06, 0.8],
        [0.62, 0.3, 0.6],
        [0.25, 0.34, 0.5],
      ].forEach(([fx, fy, s], i) => {
        const x = ((fx * span + t * (0.5 + i * 0.2)) % span) - 60;
        cloud(x, fy * H, s);
      });
    }

    function birds() {
      if (reduce) return;
      ctx.fillStyle = "#ffffff";
      const flap = frame % 4 < 2;
      [
        [0.3, 0.22],
        [0.36, 0.26],
      ].forEach(([fx, fy], i) => {
        const x = Math.round(((fx * W + frame * 1.2) % (W + 40)) - 20);
        const y = Math.round(fy * H + Math.sin((frame + i * 5) / 3) * 2);
        // wingull-ish: white body with blue wing tips
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(x, y, 3, 2);
        if (flap) {
          ctx.fillRect(x - 3, y - 2, 3, 1);
          ctx.fillRect(x + 3, y - 2, 3, 1);
          ctx.fillStyle = "#2f6fc0";
          ctx.fillRect(x - 5, y - 3, 2, 1);
          ctx.fillRect(x + 6, y - 3, 2, 1);
        } else {
          ctx.fillRect(x - 3, y + 1, 3, 1);
          ctx.fillRect(x + 3, y + 1, 3, 1);
          ctx.fillStyle = "#2f6fc0";
          ctx.fillRect(x - 5, y + 2, 2, 1);
          ctx.fillRect(x + 6, y + 2, 2, 1);
        }
      });
    }

    function island() {
      // volcano island (think Wela)
      const cx = W * 0.3;
      const base = horizon;
      for (let y = 0; y < 34; y++) {
        const half = 8 + y * 1.6;
        const c = y < 10 ? "#8a6a52" : y < 16 ? "#6f8a4a" : "#4f8a3a";
        px(cx - half, base - 34 + y, half * 2, 1, c);
      }
      px(cx - 8, base - 34, 16, 2, "#5a4636");
      // smoke puffs
      const s = reduce ? 0 : frame % 12;
      disc(cx + 2 + s * 0.4, base - 40 - s, 3, "#e8e8e8");
      disc(cx + 6 + s * 0.6, base - 46 - s, 2, "#f4f4f4");
      // small island with tiny palm
      const ix = W * 0.62;
      px(ix - 22, base - 4, 44, 4, "#4f8a3a");
      px(ix - 14, base - 7, 28, 3, "#5f9a44");
      px(ix + 2, base - 15, 2, 9, "#7a5230");
      px(ix - 3, base - 16, 12, 2, "#3e8a30");
    }

    function sea() {
      const bandH = (shore - horizon) / SEA.length;
      SEA.forEach((c, i) => px(0, horizon + i * bandH, W, bandH + 1, c));
      // sparkles + wave dashes
      const rnd = mulberry32(7);
      for (let i = 0; i < W / 4; i++) {
        const x = Math.floor(rnd() * W);
        const y = horizon + 2 + Math.floor(rnd() * (shore - horizon - 6));
        const phase = Math.floor(rnd() * 8);
        if ((frame + phase) % 8 < 3) px(x, y, 1, 1, "#ffffff");
        else if ((frame + phase) % 8 < 5) px(x - 1, y, 3, 1, "rgba(255,255,255,0.45)");
      }
      // horizon highlight under the sun
      for (let y = horizon + 1; y < shore - 4; y += 3) {
        const w = 6 + (y - horizon) * 0.6;
        const off = reduce ? 0 : Math.sin((frame + y) / 2) * 2;
        px(W * 0.8 - w / 2 + off, y, w, 1, "#fff6b0");
      }
    }

    function beach() {
      px(0, shore, W, H - shore, "#f8dc98");
      px(0, shore + 10, W, H - shore - 10, "#f0cc84");
      px(0, shore + 22, W, H - shore - 22, "#e8bc70");
      // foam line
      const t = reduce ? 0 : frame;
      for (let x = 0; x < W; x++) {
        const y = shore - 1 + Math.round(Math.sin(x / 9 + t / 2) * 1.5);
        px(x, y, 1, 2, "#ffffff");
        if ((x + t) % 7 === 0) px(x, y + 2, 1, 1, "#d8f4ff");
      }
      const rnd = mulberry32(42);
      for (let i = 0; i < W / 3; i++) {
        px(Math.floor(rnd() * W), shore + 4 + Math.floor(rnd() * (H - shore - 4)), 1, 1, "#d8a858");
      }
      // starfish + shell
      const sx = W * 0.56;
      const sy = H - 14;
      px(sx, sy - 3, 2, 7, "#f07040");
      px(sx - 3, sy - 1, 8, 2, "#f07040");
      px(sx - 2, sy + 2, 2, 2, "#f07040");
      px(sx + 2, sy + 2, 2, 2, "#f07040");
      disc(W * 0.18, H - 9, 2, "#ffb8c8");
      px(W * 0.18 - 2, H - 9, 5, 1, "#e88098");
    }

    function palm(x: number, flip: boolean, scale: number) {
      const sway = reduce ? 0 : Math.round(Math.sin(frame / 4) * 1);
      const dir = flip ? -1 : 1;
      const height = Math.round(80 * scale);
      const baseY = H - 2;
      let tx = x;
      let ty = baseY;
      for (let i = 0; i < height; i += 3) {
        const lean = Math.round(((i / height) ** 2) * 18 * scale) * dir;
        tx = x + lean + (i > height * 0.7 ? sway : 0);
        ty = baseY - i;
        px(tx - 3 * scale, ty - 3, 6 * scale, 3, i % 6 === 0 ? "#9a6a3a" : "#7a4e28");
      }
      // coconuts
      disc(tx - 2, ty + 3, 2, "#5a3a1a");
      disc(tx + 3, ty + 4, 2, "#5a3a1a");
      // fronds
      const fronds = [-2.6, -2.0, -1.3, -0.6, -0.1, 0.5];
      fronds.forEach((a, i) => {
        const ang = a + (reduce ? 0 : Math.sin((frame + i) / 4) * 0.05);
        const len = (26 + (i % 2) * 6) * scale;
        for (let r = 0; r < len; r++) {
          const droop = (r / len) ** 2 * 10 * scale;
          const fx = tx + Math.cos(ang) * r * (i < 3 ? 1 : 1);
          const fy = ty + Math.sin(ang) * r + droop;
          const w = Math.max(1, Math.round((1 - r / len) * 4 * scale));
          px(fx, fy, 2, w, r % 4 < 2 ? "#2e8a2a" : "#3fa838");
          px(fx, fy + w, 1, 1, "#1f6a20");
        }
      });
    }

    function flowers() {
      const bush = (x: number) => {
        disc(x, H - 6, 9, "#2f7a2a");
        disc(x + 10, H - 4, 7, "#3a8a30");
        [
          [-4, -10, "#ff4a7a"],
          [6, -8, "#ffcc33"],
          [12, -5, "#ff4a7a"],
          [-8, -4, "#ff7aa0"],
        ].forEach(([dx, dy, c]) => {
          const cx = x + (dx as number);
          const cy = H + (dy as number);
          px(cx - 1, cy, 3, 1, c as string);
          px(cx, cy - 1, 1, 3, c as string);
          px(cx, cy, 1, 1, "#fff2a0");
        });
      };
      bush(W * 0.06);
      bush(W * 0.92);
    }

    function draw() {
      ctx.imageSmoothingEnabled = false;
      sky();
      sun();
      clouds();
      birds();
      island();
      sea();
      beach();
      palm(W * 0.04, false, 1.1);
      palm(W * 0.11, false, 0.8);
      palm(W * 0.95, true, 1.15);
      flowers();
    }

    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (t - last < 1000 / FPS) return;
      last = t;
      frame++;
      draw();
    };

    resize();
    window.addEventListener("resize", resize);
    if (!reduce) raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pixelated fixed inset-0 z-0 h-full w-full" />;
}
