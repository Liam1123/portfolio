"use client";

// Square-wave bleeps in the spirit of the Game Boy sound chip.
let ctx: AudioContext | null = null;
let muted = false;

export function setMuted(m: boolean) {
  muted = m;
  try {
    localStorage.setItem("liamdex-muted", m ? "1" : "0");
  } catch {}
}

export function getMuted() {
  try {
    muted = localStorage.getItem("liamdex-muted") === "1";
  } catch {}
  return muted;
}

function tone(freq: number, start: number, dur: number, type: OscillatorType = "square", vol = 0.05) {
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
  gain.gain.setValueAtTime(vol, ctx.currentTime + start);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + dur);
  osc.connect(gain).connect(ctx.destination);
  osc.start(ctx.currentTime + start);
  osc.stop(ctx.currentTime + start + dur + 0.02);
}

export function sfx(kind: "select" | "open" | "close" | "save" | "error") {
  if (muted || typeof window === "undefined") return;
  try {
    ctx ??= new AudioContext();
    if (ctx.state === "suspended") void ctx.resume();
  } catch {
    return;
  }
  switch (kind) {
    case "select":
      tone(1318, 0, 0.05);
      break;
    case "open":
      [523, 659, 784, 1046].forEach((f, i) => tone(f, i * 0.08, 0.1));
      break;
    case "close":
      [784, 523, 392].forEach((f, i) => tone(f, i * 0.07, 0.09));
      break;
    case "save":
      [880, 1175, 1568].forEach((f, i) => tone(f, i * 0.09, 0.12, "square", 0.04));
      break;
    case "error":
      tone(196, 0, 0.18, "sawtooth", 0.04);
      break;
  }
}
