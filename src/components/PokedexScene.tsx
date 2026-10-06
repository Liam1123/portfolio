"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

// A blocky, low-poly Gen 1 Pokédex built from primitives. The whole canvas is
// rendered at a low pixel ratio and scaled up with `image-rendering: pixelated`
// so the 3D model reads as chunky pixel art.

const W = 2.2; // width of each half
const H = 3.2; // height of the body
const D = 0.42; // body depth
const LID_H = 2.45;
const LID_D = 0.18;
const LEDGE_H = H - LID_H; // raised strip at the top holding the lens
const FRONT = D / 2;

const RED = "#d8202c";
const RED_DARK = "#9a1420";

function useToonGradient() {
  return useMemo(() => {
    const data = new Uint8Array([70, 70, 70, 255, 160, 160, 160, 255, 255, 255, 255, 255]);
    const tex = new THREE.DataTexture(data, 3, 1, THREE.RGBAFormat);
    tex.minFilter = THREE.NearestFilter;
    tex.magFilter = THREE.NearestFilter;
    tex.needsUpdate = true;
    return tex;
  }, []);
}

type MatProps = { color: string; emissive?: string; map?: THREE.Texture };

function Mat({ color, emissive, map }: MatProps) {
  const gradientMap = useToonGradient();
  return (
    <meshToonMaterial
      color={color}
      gradientMap={gradientMap}
      emissive={emissive ?? "#000000"}
      emissiveIntensity={emissive ? 0.6 : 0}
      map={map}
    />
  );
}

function Box({ size, position, color, emissive }: { size: [number, number, number]; position: [number, number, number]; color: string; emissive?: string }) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <Mat color={color} emissive={emissive} />
    </mesh>
  );
}

// Cylinder facing +z (or -z when `back`), sitting on a face at depth z.
function Button({ r, position, color, depth = 0.06, emissive, back = false }: { r: number; position: [number, number, number]; color: string; depth?: number; emissive?: string; back?: boolean }) {
  const [x, y, z] = position;
  return (
    <mesh position={[x, y, z + (back ? -depth / 2 : depth / 2)]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[r, r, depth, 12]} />
      <Mat color={color} emissive={emissive} />
    </mesh>
  );
}

function makePixelTexture(w: number, h: number, paint: (ctx: CanvasRenderingContext2D) => void) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;
  paint(ctx);
  const tex = new THREE.CanvasTexture(c);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// 1-bit-ish sprite font for the tiny on-model screens.
const GLYPHS: Record<string, string[]> = {
  L: ["100", "100", "100", "100", "111"],
  I: ["111", "010", "010", "010", "111"],
  A: ["010", "101", "111", "101", "101"],
  M: ["101", "111", "111", "101", "101"],
  D: ["110", "101", "101", "101", "110"],
  E: ["111", "100", "110", "100", "111"],
  X: ["101", "101", "010", "101", "101"],
  "0": ["111", "101", "101", "101", "111"],
  "1": ["010", "110", "010", "010", "111"],
  "#": ["101", "111", "101", "111", "101"],
  " ": ["000", "000", "000", "000", "000"],
};

function drawText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, color: string) {
  ctx.fillStyle = color;
  [...text].forEach((ch, i) => {
    const g = GLYPHS[ch] ?? GLYPHS[" "];
    g.forEach((row, ry) => [...row].forEach((b, rx) => b === "1" && ctx.fillRect(x + i * 4 + rx, y + ry, 1, 1)));
  });
}

function useScreenTexture() {
  return useMemo(
    () =>
      makePixelTexture(48, 32, (ctx) => {
        ctx.fillStyle = "#9bbc0f";
        ctx.fillRect(0, 0, 48, 32);
        // a little trainer silhouette
        ctx.fillStyle = "#306230";
        ctx.fillRect(8, 6, 6, 5);
        ctx.fillRect(6, 4, 10, 2);
        ctx.fillRect(7, 11, 8, 9);
        ctx.fillRect(5, 12, 2, 6);
        ctx.fillRect(15, 12, 2, 6);
        ctx.fillRect(8, 20, 2, 6);
        ctx.fillRect(12, 20, 2, 6);
        ctx.fillStyle = "#0f380f";
        ctx.fillRect(6, 3, 10, 2);
        drawText(ctx, "#001", 22, 6, "#0f380f");
        drawText(ctx, "LIAM", 22, 14, "#0f380f");
        ctx.fillStyle = "#306230";
        ctx.fillRect(22, 22, 20, 1);
        ctx.fillRect(22, 25, 14, 1);
      }),
    [],
  );
}

function useLidScreenTexture() {
  return useMemo(
    () =>
      makePixelTexture(48, 12, (ctx) => {
        ctx.fillStyle = "#1a1a1a";
        ctx.fillRect(0, 0, 48, 12);
        drawText(ctx, "LIAMDEX", 10, 4, "#58e070");
      }),
    [],
  );
}

function Body() {
  const screen = useScreenTexture();
  const ledgeZ = FRONT + LID_D / 2;
  const ledgeY = H / 2 - LEDGE_H / 2;
  const faceY = -H / 2 + LID_H / 2; // centre of the area covered by the lid
  return (
    <group>
      <Box size={[W, H, D]} position={[0, 0, 0]} color={RED} />
      {/* raised top strip with lens & lights */}
      <Box size={[W, LEDGE_H, LID_D]} position={[0, ledgeY, ledgeZ]} color={RED} />
      <Box size={[W, 0.05, LID_D + 0.01]} position={[0, ledgeY - LEDGE_H / 2 + 0.03, ledgeZ]} color={RED_DARK} />
      <Button r={0.33} position={[-0.55, ledgeY, FRONT + LID_D]} color="#f4f4f4" depth={0.06} />
      <Button r={0.26} position={[-0.55, ledgeY, FRONT + LID_D + 0.03]} color="#2a8fe8" depth={0.06} emissive="#2a8fe8" />
      <Button r={0.09} position={[-0.63, ledgeY + 0.09, FRONT + LID_D + 0.07]} color="#bfe6ff" depth={0.04} emissive="#ffffff" />
      <Button r={0.08} position={[0.15, ledgeY + 0.12, FRONT + LID_D]} color="#ff3a3a" emissive="#ff3a3a" />
      <Button r={0.08} position={[0.42, ledgeY + 0.12, FRONT + LID_D]} color="#ffd83a" emissive="#ffd83a" />
      <Button r={0.08} position={[0.69, ledgeY + 0.12, FRONT + LID_D]} color="#3ad85a" emissive="#3ad85a" />

      {/* main screen */}
      <Box size={[1.75, 1.3, 0.05]} position={[0, faceY + 0.42, FRONT + 0.025]} color="#e8e8e8" />
      <Button r={0.035} position={[-0.12, faceY + 1.0, FRONT + 0.05]} color="#d82020" depth={0.02} />
      <Button r={0.035} position={[0.12, faceY + 1.0, FRONT + 0.05]} color="#d82020" depth={0.02} />
      <mesh position={[0, faceY + 0.4, FRONT + 0.056]}>
        <planeGeometry args={[1.4, 0.94]} />
        <meshBasicMaterial map={screen} toneMapped={false} />
      </mesh>
      <Button r={0.07} position={[-0.65, faceY - 0.15, FRONT + 0.05]} color="#d82020" depth={0.03} />
      {[0, 1, 2, 3].map((i) => (
        <Box key={i} size={[0.28, 0.025, 0.02]} position={[0.5, faceY - 0.1 - i * 0.05, FRONT + 0.06]} color="#2a2a2a" />
      ))}

      {/* controls */}
      <Button r={0.15} position={[-0.72, faceY - 0.62, FRONT]} color="#1a1a1a" depth={0.08} />
      <Box size={[0.32, 0.08, 0.05]} position={[-0.32, faceY - 0.5, FRONT + 0.025]} color="#e83030" />
      <Box size={[0.32, 0.08, 0.05]} position={[0.08, faceY - 0.5, FRONT + 0.025]} color="#2a6ae8" />
      <Box size={[0.75, 0.42, 0.04]} position={[-0.12, faceY - 0.85, FRONT + 0.02]} color="#58c848" emissive="#3a8a30" />
      <Box size={[0.6, 0.18, 0.08]} position={[0.66, faceY - 0.78, FRONT + 0.04]} color="#1a1a1a" />
      <Box size={[0.18, 0.6, 0.08]} position={[0.66, faceY - 0.78, FRONT + 0.04]} color="#1a1a1a" />

      {/* side hinge */}
      <mesh position={[W / 2, -H / 2 + LID_H / 2, FRONT]}>
        <cylinderGeometry args={[0.1, 0.1, LID_H, 10]} />
        <Mat color={RED_DARK} />
      </mesh>
    </group>
  );
}

function Lid({ lidRef }: { lidRef: React.RefObject<THREE.Group | null> }) {
  const strip = useLidScreenTexture();
  // Local coords: hinge at x=0, lid extends to -W. Inner face sits at z=0 facing -z.
  // `u` measures from the hinge outwards once the lid has swung open.
  const u = (v: number) => -v;
  const inner = -0.001;
  return (
    <group ref={lidRef} position={[W / 2, -H / 2 + LID_H / 2, FRONT]}>
      {/* shell */}
      <Box size={[W, LID_H, LID_D]} position={[-W / 2, 0, LID_D / 2]} color={RED} />
      {/* outer face details */}
      <Box size={[W - 0.25, LID_H - 0.25, 0.02]} position={[-W / 2, 0, LID_D + 0.01]} color="#c81a26" />
      <Box size={[0.08, 0.5, 0.03]} position={[-W + 0.12, 0, LID_D + 0.02]} color="#ffd83a" />
      <mesh position={[-W / 2, -LID_H / 2 + 0.3, LID_D + 0.025]}>
        <planeGeometry args={[1.2, 0.3]} />
        <meshBasicMaterial map={strip} toneMapped={false} />
      </mesh>

      {/* inner face (visible once open) */}
      <group position={[0, 0, inner]}>
        <mesh position={[-W / 2, 0, 0]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[W - 0.1, LID_H - 0.1]} />
          <Mat color="#c41a24" />
        </mesh>
        {/* top black display */}
        <Box size={[1.7, 0.5, 0.05]} position={[u(1.1), 0.75, -0.025]} color="#1a1a1a" emissive="#103010" />
        {/* blue keypad 5x2 */}
        {[0, 1].map((row) =>
          [0, 1, 2, 3, 4].map((col) => (
            <Box
              key={`${row}-${col}`}
              size={[0.28, 0.24, 0.06]}
              position={[u(0.42 + col * 0.33), 0.12 - row * 0.3, -0.03]}
              color="#2a8fe8"
              emissive="#1a5aa8"
            />
          )),
        )}
        <Box size={[0.3, 0.1, 0.05]} position={[u(0.55), -0.48, -0.025]} color="#f4f4f4" />
        <Box size={[0.3, 0.1, 0.05]} position={[u(0.95), -0.48, -0.025]} color="#f4f4f4" />
        <Button r={0.07} position={[u(1.5), -0.48, 0]} color="#ffd83a" emissive="#ffd83a" back />
        <Button r={0.07} position={[u(1.75), -0.48, 0]} color="#ffd83a" emissive="#ffd83a" back />
        <Box size={[0.8, 0.36, 0.05]} position={[u(0.6), -0.9, -0.025]} color="#1a1a1a" />
        <Box size={[0.8, 0.36, 0.05]} position={[u(1.55), -0.9, -0.025]} color="#1a1a1a" />
      </group>
    </group>
  );
}

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const seg = (t: number, a: number, b: number) => ease(clamp01((t - a) / (b - a)));

const OPEN_MS = 1900;

function Dex({ open, onOpened, onClosed, onTap }: { open: boolean; onOpened: () => void; onClosed: () => void; onTap: () => void }) {
  const root = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const lid = useRef<THREE.Group>(null);
  const progress = useRef(0);
  const rot = useRef(-0.5);
  const spinFrom = useRef(0);
  const fired = useRef<"none" | "opened" | "closed">("closed");
  const [hover, setHover] = useState(false);
  const size = useThree((s) => s.size);

  useEffect(() => {
    document.body.style.cursor = hover && !open ? "pointer" : "";
  }, [hover, open]);

  useEffect(() => {
    if (open) {
      // Unwind the idle spin to the nearest front-facing angle.
      const turn = Math.PI * 2;
      const target = Math.ceil(rot.current / turn) * turn;
      spinFrom.current = rot.current - target;
      rot.current = 0;
    } else {
      // Close straight back to front-facing, then resume the idle spin from 0.
      spinFrom.current = 0;
    }
  }, [open]);

  // Fit the closed and open device to the viewport.
  const portrait = size.width / size.height < 0.8;
  const farZ = portrait ? 11.5 : 8.5;
  const nearZ = portrait ? 10 : 4.9;

  useFrame((state, dt) => {
    const step = (dt * 1000) / OPEN_MS;
    progress.current = clamp01(progress.current + (open ? step : -step * 1.4));
    const p = progress.current;

    if (!open && p === 0) {
      rot.current += dt * 0.7;
      spinFrom.current = 0;
    }

    const spinT = seg(p, 0, 0.35);
    const lidT = seg(p, 0.12, 0.85);
    const zoomT = seg(p, 0.15, 1);

    if (spin.current) {
      const r = open || p > 0 ? spinFrom.current * (1 - spinT) : rot.current;
      spin.current.rotation.y = r;
      spin.current.rotation.x = (1 - zoomT) * 0.12;
      spin.current.position.y = (1 - zoomT) * Math.sin(state.clock.elapsedTime * 2) * 0.08;
    }
    if (lid.current) lid.current.rotation.y = lidT * Math.PI;
    if (root.current) {
      root.current.position.x = -lidT * (W / 2);
      const s = hover && p === 0 ? 1.06 : 1;
      root.current.scale.lerp(new THREE.Vector3(s, s, s), 0.2);
    }
    const camera = state.camera;
    camera.position.z = THREE.MathUtils.lerp(farZ, nearZ, zoomT);
    camera.position.y = THREE.MathUtils.lerp(0.2, 0, zoomT);
    camera.lookAt(0, 0, 0);

    if (open && p >= 1 && fired.current !== "opened") {
      fired.current = "opened";
      onOpened();
    }
    if (!open && p <= 0 && fired.current !== "closed") {
      fired.current = "closed";
      onClosed();
    }
    if (p > 0 && p < 1) fired.current = "none";
  });

  return (
    <group ref={root}>
      <group
        ref={spin}
        onClick={(e) => {
          e.stopPropagation();
          if (!open) onTap();
        }}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <Body />
        <Lid lidRef={lid} />
      </group>
    </group>
  );
}

export default function PokedexScene({
  open,
  hidden,
  onTap,
  onOpened,
  onClosed,
}: {
  open: boolean;
  hidden: boolean;
  onTap: () => void;
  onOpened: () => void;
  onClosed: () => void;
}) {
  const [dpr, setDpr] = useState(0.35);

  useEffect(() => {
    // Aim for roughly 300 rendered pixel rows regardless of screen size.
    const update = () => setDpr(Math.min(1, Math.max(0.18, 300 / window.innerHeight)));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div
      className="fixed inset-0 z-10 transition-opacity duration-300"
      style={{ opacity: hidden ? 0 : 1, pointerEvents: hidden ? "none" : "auto" }}
    >
      <Canvas
        dpr={dpr}
        flat
        gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
        camera={{ position: [0, 0.2, 8.5], fov: 40 }}
        className="pixelated"
        style={{ imageRendering: "pixelated" }}
      >
        <ambientLight intensity={1.1} />
        <directionalLight position={[3, 4, 6]} intensity={2.2} />
        <directionalLight position={[-4, -2, -3]} intensity={0.6} color="#9fd8ff" />
        <Dex open={open} onOpened={onOpened} onClosed={onClosed} onTap={onTap} />
      </Canvas>
    </div>
  );
}
