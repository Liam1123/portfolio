"use client";

import * as Tooltip from "@radix-ui/react-tooltip";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { sections, type SectionId } from "@/data/dex";
import { getMuted, sfx } from "@/lib/sfx";
import AlolaBackground from "./AlolaBackground";
import DexUI from "./DexUI";

const PokedexScene = dynamic(() => import("./PokedexScene"), { ssr: false });

const isSection = (s: string): s is SectionId => sections.some((x) => x.id === s);

type Phase = "closed" | "opening" | "open" | "closing";

export default function PokedexApp() {
  const [phase, setPhase] = useState<Phase>("closed");
  const [section, setSection] = useState<SectionId>("entry");
  const [seen, setSeen] = useState<number | null>(null);

  const countOpen = useCallback(() => {
    fetch("/api/encounters", { method: "POST" })
      .then((r) => r.json())
      .then((d) => setSeen(d.seen))
      .catch(() => {});
  }, []);

  // Deep links (#moves, #pc, ...) skip the intro and land on that page.
  useEffect(() => {
    getMuted();
    const hash = window.location.hash.slice(1);
    if (isSection(hash)) {
      // Syncing from the URL hash, which only exists on the client.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSection(hash);
      setPhase("open");
      countOpen();
    }
  }, [countOpen]);

  const open = useCallback(
    (to?: SectionId) => {
      if (phase !== "closed") return;
      if (to) setSection(to);
      sfx("open");
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setPhase(reduce ? "open" : "opening");
      history.replaceState(null, "", `#${to ?? section}`);
      countOpen();
    },
    [phase, section, countOpen],
  );

  const close = useCallback(() => {
    sfx("close");
    setPhase("closing");
    history.replaceState(null, "", window.location.pathname);
  }, []);

  const changeSection = useCallback((id: SectionId) => {
    setSection(id);
    history.replaceState(null, "", `#${id}`);
  }, []);

  // Enter / Space on the intro opens the dex.
  useEffect(() => {
    if (phase !== "closed") return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "Enter" || e.key === " ") && (e.target as HTMLElement).tagName === "BODY") {
        e.preventDefault();
        open();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, open]);

  const showUI = phase === "open";
  const sceneOpen = phase === "opening" || phase === "open";

  return (
    <Tooltip.Provider>
      <AlolaBackground />

      <PokedexScene
        open={sceneOpen}
        hidden={showUI}
        onTap={() => open()}
        onOpened={() => setPhase((p) => (p === "opening" ? "open" : p))}
        onClosed={() => setPhase((p) => (p === "closing" ? "closed" : p))}
      />

      {phase === "closed" && (
        <div className="pointer-events-none fixed inset-0 z-20 flex flex-col items-center justify-between px-4 pt-[max(24px,env(safe-area-inset-top))] pb-[max(20px,env(safe-area-inset-bottom))]">
          <div className="text-center">
            <h1 className="font-pixel text-2xl text-[#ffd83a] [text-shadow:3px_3px_0_#2a5ab8,-2px_-2px_0_#2a5ab8,2px_-2px_0_#2a5ab8,-2px_2px_0_#2a5ab8,0_6px_0_#173a80] sm:text-4xl">
              LIAMDEX
            </h1>
            <p className="mt-3 inline-block border-[3px] border-black bg-white/90 px-3 py-1.5 font-pixel text-[9px] leading-relaxed text-black sm:text-[10px]">
              LIAM MAHONE · CYBERSECURITY ANALYST · UT AUSTIN
            </p>
          </div>

          <div className="flex w-full max-w-3xl flex-col items-center gap-3">
            <button
              onClick={() => open()}
              className="px-press pointer-events-auto border-4 border-black bg-white px-4 py-2.5 font-pixel text-[10px] text-black shadow-[4px_4px_0_#000] sm:text-xs"
            >
              <span className="blink">▶</span> TAP THE POKéDEX TO OPEN
            </button>
            <nav aria-label="Jump to section" className="pointer-events-auto">
              <ul className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        open(s.id);
                      }}
                      title={s.hint}
                      className="px-press block border-[3px] border-black bg-dex-blue px-2 py-1.5 font-pixel text-[8px] text-white shadow-[inset_-2px_-2px_0_#1a5aa8,inset_2px_2px_0_#7cc4ff,3px_3px_0_#000] hover:bg-[#ffd83a] hover:text-black sm:text-[9px]"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}

      {showUI && (
        <main className="relative z-20 min-h-dvh px-3 py-4 sm:px-6 md:flex md:items-center md:py-6">
          <DexUI section={section} onSection={changeSection} onClose={close} seen={seen} />
        </main>
      )}
    </Tooltip.Provider>
  );
}
