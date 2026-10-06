"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { useCallback, useEffect, useRef, useState } from "react";
import { sections, trainer, type SectionId } from "@/data/dex";
import { getMuted, setMuted, sfx } from "@/lib/sfx";
import {
  BadgesSection,
  EntrySection,
  MovesSection,
  PartySection,
  PcSection,
  PowersSection,
  TrainingSection,
} from "./DexSections";
import { TypeBadge } from "./TypeBadge";

const ids = sections.map((s) => s.id) as SectionId[];

function Lens({ size = 64 }: { size?: number }) {
  return (
    <div
      aria-hidden
      className="relative shrink-0 rounded-full border-4 border-black bg-white"
      style={{ width: size, height: size }}
    >
      <div className="absolute inset-[5px] rounded-full border-4 border-black bg-[#2a8fe8]">
        <div className="absolute top-[18%] left-[18%] h-[28%] w-[28%] rounded-full bg-[#bfe6ff]" />
      </div>
    </div>
  );
}

function Light({ color, blink = false }: { color: string; blink?: boolean }) {
  return (
    <span
      aria-hidden
      className={`inline-block h-4 w-4 rounded-full border-[3px] border-black ${blink ? "blink" : ""}`}
      style={{ background: color }}
    />
  );
}

export default function DexUI({
  section,
  onSection,
  onClose,
  seen,
}: {
  section: SectionId;
  onSection: (id: SectionId) => void;
  onClose: () => void;
  seen: number | null;
}) {
  const screenRef = useRef<HTMLDivElement>(null);
  const [muted, setMutedState] = useState(getMuted);
  const [guests, setGuests] = useState<number | null>(null);
  const idx = ids.indexOf(section);
  const current = sections[idx];

  useEffect(() => {
    fetch("/api/guestbook")
      .then((r) => r.json())
      .then((d) => setGuests(d.total))
      .catch(() => {});
  }, []);

  const go = useCallback(
    (id: SectionId) => {
      sfx("select");
      onSection(id);
      screenRef.current?.scrollTo({ top: 0 });
    },
    [onSection],
  );

  const step = useCallback((d: number) => go(ids[(idx + d + ids.length) % ids.length]), [go, idx]);
  const scroll = (d: number) => screenRef.current?.scrollBy({ top: d * 160, behavior: "smooth" });

  // Keyboard shortcuts: 1-7 jump to a section, Esc closes.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea")) return;
      const n = Number(e.key);
      if (n >= 1 && n <= ids.length) go(ids[n - 1]);
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  const extras = [
    { label: "EMAIL", href: `mailto:${trainer.email}` },
    { label: "LINKEDIN", href: trainer.linkedin },
  ];

  return (
    <Tabs.Root
      value={section}
      onValueChange={(v) => go(v as SectionId)}
      activationMode="manual"
      className="dex-pop mx-auto flex w-full max-w-[1180px] flex-col md:h-[min(860px,calc(100dvh-48px))] md:flex-row"
    >
      {/* LEFT HALF — body with lens, screen and controls */}
      <section
        aria-label="Pokédex screen"
        className="px-bevel relative z-10 order-2 flex min-h-0 flex-col border-4 border-black bg-dex-red md:order-1 md:flex-[1.35] md:rounded-l-[18px] md:border-r-0"
      >
        <header className="hidden items-center gap-4 border-b-4 border-black px-4 pt-3 pb-3 md:flex">
          <Lens />
          <div className="flex gap-2 self-start pt-1">
            <Light color="#ff3a3a" />
            <Light color="#ffd83a" />
            <Light color="#3ad85a" blink />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <h1 className="font-pixel text-sm text-white drop-shadow-[2px_2px_0_#000]">LIAMDEX</h1>
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col p-3 sm:p-4">
          {/* bezel */}
          <div className="flex min-h-0 flex-1 flex-col border-4 border-black bg-[#dcdcdc] p-2 sm:p-3 [clip-path:polygon(0_0,100%_0,100%_100%,28px_100%,0_calc(100%-28px))]">
            <div className="flex justify-center gap-3 pb-1.5" aria-hidden>
              <span className="h-2 w-2 rounded-full bg-[#d82020]" />
              <span className="h-2 w-2 rounded-full bg-[#d82020]" />
            </div>
            <div
              ref={screenRef}
              className="lcd lcd-scroll h-[62vh] min-h-0 overflow-y-auto border-4 border-black p-3 sm:p-4 md:h-auto md:flex-1"
              tabIndex={0}
              aria-live="polite"
            >
              <Tabs.Content value="entry" className="outline-none">
                <EntrySection />
              </Tabs.Content>
              <Tabs.Content value="moves" className="outline-none">
                <MovesSection />
              </Tabs.Content>
              <Tabs.Content value="powers" className="outline-none">
                <PowersSection />
              </Tabs.Content>
              <Tabs.Content value="badges" className="outline-none">
                <BadgesSection />
              </Tabs.Content>
              <Tabs.Content value="training" className="outline-none">
                <TrainingSection />
              </Tabs.Content>
              <Tabs.Content value="party" className="outline-none">
                <PartySection />
              </Tabs.Content>
              <Tabs.Content value="pc" className="outline-none">
                <PcSection onGuestCount={setGuests} />
              </Tabs.Content>
            </div>
            <div className="flex items-center justify-between pt-2 pl-6" aria-hidden>
              <span className="h-4 w-4 rounded-full border-2 border-black bg-[#d82020]" />
              <span className="flex flex-col gap-[3px]">
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className="block h-[3px] w-10 bg-black" />
                ))}
              </span>
            </div>
          </div>

          {/* controls */}
          <div className="mt-3 flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => go("entry")}
              aria-label="Back to Dex entry"
              title="Home"
              className="px-press h-12 w-12 shrink-0 rounded-full border-4 border-black bg-[#2a2a2a] shadow-[inset_-3px_-3px_0_#000,inset_3px_3px_0_#555]"
            />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="flex gap-2">
                <button
                  onClick={() => step(-1)}
                  aria-label="Previous section"
                  className="px-press h-3 w-12 rounded-full border-2 border-black bg-[#e83030]"
                />
                <button
                  onClick={() => step(1)}
                  aria-label="Next section"
                  className="px-press h-3 w-12 rounded-full border-2 border-black bg-[#2a6ae8]"
                />
              </div>
              <div className="truncate border-4 border-black bg-[#58c848] px-2 py-1 font-pixel text-[8px] leading-relaxed text-black sm:text-[9px]">
                {String(idx + 1).padStart(2, "0")} {current.label} · {current.hint}
              </div>
            </div>
            {/* D-pad */}
            <div className="grid shrink-0 grid-cols-3 grid-rows-3" role="group" aria-label="D-pad">
              <span />
              <button onClick={() => scroll(-1)} aria-label="Scroll up" className="px-press h-6 w-6 rounded-t-sm bg-black text-[8px] text-[#666]">▲</button>
              <span />
              <button onClick={() => step(-1)} aria-label="Previous section" className="px-press h-6 w-6 rounded-l-sm bg-black text-[8px] text-[#666]">◀</button>
              <span className="h-6 w-6 bg-black" />
              <button onClick={() => step(1)} aria-label="Next section" className="px-press h-6 w-6 rounded-r-sm bg-black text-[8px] text-[#666]">▶</button>
              <span />
              <button onClick={() => scroll(1)} aria-label="Scroll down" className="px-press h-6 w-6 rounded-b-sm bg-black text-[8px] text-[#666]">▼</button>
              <span />
            </div>
          </div>
        </div>
      </section>

      {/* HINGE */}
      <div aria-hidden className="relative z-0 order-1 hidden w-5 border-y-4 border-black bg-dex-red-dark md:order-2 md:block">
        <div className="absolute inset-x-0 top-6 bottom-6 bg-[repeating-linear-gradient(to_bottom,#6a0a10_0_6px,#b01822_6px_12px)]" />
      </div>

      {/* RIGHT HALF — lid with info screen and keypad */}
      <section
        aria-label="Pokédex controls"
        className="px-bevel relative order-1 flex flex-col border-4 border-b-0 border-black bg-[#c41a24] p-3 sm:p-4 md:order-3 md:flex-1 md:rounded-r-[18px] md:border-b-4 md:border-l-0 md:pt-[92px]"
      >
        {/* mobile header */}
        <div className="mb-3 flex items-center gap-3 md:hidden">
          <Lens size={48} />
          <Light color="#ff3a3a" />
          <Light color="#ffd83a" />
          <Light color="#3ad85a" blink />
          <h1 className="ml-auto font-pixel text-xs text-white drop-shadow-[2px_2px_0_#000]">LIAMDEX</h1>
        </div>

        <div className="border-4 border-black bg-[#1a1a1a] p-3 font-pixel text-[9px] leading-relaxed text-[#58e070] sm:text-[10px]">
          <p>
            No.{trainer.number} <span className="text-white">{trainer.name}</span>
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span>TYPE/</span>
            {trainer.types.map((t) => (
              <TypeBadge key={t} type={t} small />
            ))}
          </div>
        </div>

        <Tabs.List aria-label="Pokédex sections" className="mt-4 grid grid-cols-3 gap-2 md:grid-cols-2 md:gap-3">
          {sections.map((s, i) => (
            <Tabs.Trigger
              key={s.id}
              value={s.id}
              className="px-press group relative border-[3px] border-black bg-dex-blue px-1 py-2 text-center font-pixel text-[8px] leading-tight text-white shadow-[inset_-3px_-3px_0_#1a5aa8,inset_3px_3px_0_#7cc4ff] hover:brightness-110 data-[state=active]:bg-[#ffd83a] data-[state=active]:text-black data-[state=active]:shadow-[inset_-3px_-3px_0_#c09a10,inset_3px_3px_0_#fff3a8] sm:text-[9px] md:py-3"
            >
              <span className="absolute top-0.5 left-1 text-[6px] opacity-70">{i + 1}</span>
              {s.label}
            </Tabs.Trigger>
          ))}
          {extras.map((x) => (
            <a
              key={x.label}
              href={x.href}
              target={x.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              onClick={() => sfx("select")}
              className="px-press flex items-center justify-center border-[3px] border-black bg-dex-blue px-1 py-2 font-pixel text-[8px] text-white shadow-[inset_-3px_-3px_0_#1a5aa8,inset_3px_3px_0_#7cc4ff] hover:brightness-110 sm:text-[9px] md:py-3"
            >
              {x.label}
            </a>
          ))}
          <button
            onClick={() => scroll(-100)}
            className="px-press hidden border-[3px] border-black bg-dex-blue px-1 py-2 font-pixel text-[8px] text-white shadow-[inset_-3px_-3px_0_#1a5aa8,inset_3px_3px_0_#7cc4ff] hover:brightness-110 sm:text-[9px] md:block md:py-3"
          >
            TOP
          </button>
        </Tabs.List>

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={() => {
              const m = !muted;
              setMuted(m);
              setMutedState(m);
              if (!m) sfx("select");
            }}
            aria-pressed={!muted}
            className="px-press border-[3px] border-black bg-[#f4f4f4] px-2 py-1 font-pixel text-[8px] text-black shadow-[inset_-2px_-2px_0_#aaa]"
          >
            SOUND {muted ? "OFF" : "ON"}
          </button>
          <button
            onClick={onClose}
            className="px-press border-[3px] border-black bg-[#f4f4f4] px-2 py-1 font-pixel text-[8px] text-black shadow-[inset_-2px_-2px_0_#aaa]"
          >
            CLOSE ✕
          </button>
          <span className="ml-auto flex gap-2" aria-hidden>
            <Light color="#ffd83a" />
            <Light color="#ffd83a" />
          </span>
        </div>

        <div className="mt-4 hidden min-h-[96px] border-4 border-black bg-[#1a1a1a] p-3 md:block">
          <p key={current.id} className="type-in font-term text-xl leading-tight text-[#58e070]">
            {current.blurb}
            <span className="blink"> _</span>
          </p>
        </div>

        <div className="mt-4 mb-1 hidden grid-cols-2 gap-3 md:mt-auto md:grid">
          <div className="border-4 border-black bg-[#1a1a1a] p-2 font-pixel text-[8px] leading-relaxed text-[#58e070]">
            SEEN
            <div className="text-sm text-white">{seen ?? "---"}</div>
          </div>
          <div className="border-4 border-black bg-[#1a1a1a] p-2 font-pixel text-[8px] leading-relaxed text-[#58e070]">
            TRAINERS
            <div className="text-sm text-white">{guests ?? "---"}</div>
          </div>
        </div>
      </section>
    </Tabs.Root>
  );
}
