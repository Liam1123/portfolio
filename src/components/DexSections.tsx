"use client";

import { useEffect, useState } from "react";
import {
  abilities,
  badges,
  baseStats,
  evolution,
  job,
  moves,
  party,
  quests,
  school,
  trainer,
  TYPE_COLORS,
} from "@/data/dex";
import { sfx } from "@/lib/sfx";
import { BADGE_SHAPES, LCD_PALETTE, POKEBALL, Sprite, TRAINER } from "./Sprite";
import { TypeBadge } from "./TypeBadge";

function Heading({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div className="mb-3 border-b-4 border-dex-screen-dark pb-2">
      <h2 className="type-in font-pixel text-[11px] leading-relaxed sm:text-xs">{children}</h2>
      {sub && <p className="mt-1 text-lg leading-none text-dex-screen-mid">{sub}</p>}
    </div>
  );
}

/** Gen 1 style text box with a double border. */
function TextBox({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`border-4 border-double border-dex-screen-dark bg-[#c4dc6c]/40 p-3 ${className}`}>{children}</div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex gap-2 text-xl leading-tight">
      <span className="font-pixel text-[9px] leading-[22px] text-dex-screen-mid">{k}</span>
      <span>{v}</span>
    </div>
  );
}

export function EntrySection() {
  return (
    <div>
      <div className="flex flex-wrap items-start gap-4">
        <div className="border-4 border-dex-screen-dark bg-[#c4dc6c] p-2">
          <Sprite rows={TRAINER} palette={LCD_PALETTE} scale={6} title="Pixel sprite of Liam" />
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <p className="font-pixel text-[10px]">No.{trainer.number}</p>
          <h2 className="font-pixel text-sm leading-relaxed sm:text-base">{trainer.name}</h2>
          <p className="font-pixel text-[9px] text-dex-screen-mid">{trainer.species}</p>
          <div className="flex gap-2 pt-1">
            {trainer.types.map((t) => (
              <TypeBadge key={t} type={t} />
            ))}
          </div>
          <div className="pt-2">
            <Row k="HT" v={trainer.height} />
            <Row k="WT" v={trainer.weight} />
            <Row k="ROLE" v={`${job.title} @ UT RSOC`} />
          </div>
        </div>
      </div>
      <TextBox className="mt-4">
        <p className="text-xl leading-snug sm:text-[22px]">{trainer.entry}</p>
      </TextBox>
      <p className="mt-3 text-lg text-dex-screen-mid">
        <span className="blink">▼</span> Use the blue keypad, the D-pad, or the number keys 1–7 to browse.
      </p>
    </div>
  );
}

export function MovesSection() {
  const [sel, setSel] = useState(0);
  const [all, setAll] = useState(false);
  const m = moves[sel];
  return (
    <div>
      <Heading sub={`${job.title} · ${job.when} · ${job.place}`}>LEARNED AT {job.where}</Heading>
      <div className="mb-2 flex justify-end">
        <button
          onClick={() => {
            sfx("select");
            setAll((a) => !a);
          }}
          className="px-press border-2 border-dex-screen-dark px-2 py-1 font-pixel text-[8px] hover:bg-dex-screen-dark hover:text-dex-screen"
        >
          {all ? "BATTLE VIEW" : "VIEW ALL"}
        </button>
      </div>
      {all ? (
        <ul className="space-y-3">
          {moves.map((mv) => (
            <li key={mv.name}>
              <TextBox>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-pixel text-[10px]">{mv.name}</span>
                  <TypeBadge type={mv.type} small />
                </div>
                <p className="mt-1 text-xl leading-snug">{mv.text}</p>
              </TextBox>
            </li>
          ))}
        </ul>
      ) : (
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <TextBox>
            <ul role="listbox" aria-label="Moves" className="space-y-1">
              {moves.map((mv, i) => (
                <li key={mv.name}>
                  <button
                    role="option"
                    aria-selected={i === sel}
                    onClick={() => {
                      sfx("select");
                      setSel(i);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowDown") {
                        e.preventDefault();
                        setSel((s) => (s + 1) % moves.length);
                      }
                      if (e.key === "ArrowUp") {
                        e.preventDefault();
                        setSel((s) => (s - 1 + moves.length) % moves.length);
                      }
                    }}
                    className="flex w-full items-center gap-2 py-0.5 text-left font-pixel text-[9px] leading-relaxed sm:text-[10px]"
                  >
                    <span className={i === sel ? "" : "invisible"}>▶</span>
                    <span className="flex-1">{mv.name}</span>
                    <span className="text-dex-screen-mid">
                      {mv.pp}/{mv.pp}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </TextBox>
          <TextBox>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-pixel text-[11px]">{m.name}</span>
              <TypeBadge type={m.type} small />
            </div>
            <div className="mt-2 grid grid-cols-2 gap-x-3">
              <Row k="CAT" v={m.category} />
              <Row k="PWR" v={m.pwr} />
              <Row k="ACC" v={m.acc} />
              <Row k="PP" v={`${m.pp}/${m.pp}`} />
            </div>
            <p className="mt-2 text-xl leading-snug">{m.text}</p>
          </TextBox>
        </div>
      )}
    </div>
  );
}

export function PowersSection() {
  return (
    <div>
      <Heading sub="Self-assessed, out of 255 like the games">BASE STATS</Heading>
      <TextBox>
        <dl className="space-y-1.5">
          {baseStats.map((s) => (
            <div key={s.label} className="grid grid-cols-[92px_36px_1fr] items-center gap-2 sm:grid-cols-[110px_40px_1fr]">
              <dt className="font-pixel text-[8px] sm:text-[9px]">{s.label}</dt>
              <dd className="text-right text-xl leading-none">{s.value}</dd>
              <dd className="h-3 border-2 border-dex-screen-dark bg-[#c4dc6c]">
                <div className="h-full bg-dex-screen-dark" style={{ width: `${(s.value / 255) * 100}%` }} />
              </dd>
            </div>
          ))}
        </dl>
      </TextBox>
      <h3 className="mt-5 mb-2 font-pixel text-[10px]">ABILITIES</h3>
      <div className="grid gap-3 md:grid-cols-2">
        {abilities.map((a) => (
          <TextBox key={a.name}>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-pixel text-[10px]">{a.name}</span>
              <TypeBadge type={a.type} small />
            </div>
            <p className="mt-1 text-lg italic leading-tight text-dex-screen-mid">{a.text}</p>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {a.skills.map((s) => (
                <li key={s} className="border-2 border-dex-screen-dark px-1.5 text-lg leading-snug">
                  {s}
                </li>
              ))}
            </ul>
          </TextBox>
        ))}
      </div>
    </div>
  );
}

export function BadgesSection() {
  return (
    <div>
      <Heading sub={`${badges.length} badges earned`}>BADGE CASE</Heading>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {badges.map((b) => (
          <li key={b.name}>
            <TextBox className="flex h-full flex-col items-center text-center">
              <div className="bob mb-2 drop-shadow-[3px_3px_0_#0f380f]">
                <Sprite
                  rows={BADGE_SHAPES[b.shape]}
                  palette={{ "1": b.color, "2": "#ffffff" }}
                  scale={7}
                  title={`${b.name} badge`}
                />
              </div>
              <span className="font-pixel text-[9px] leading-relaxed">{b.name}</span>
              <span className="mt-1 text-lg leading-tight text-dex-screen-mid">{b.issuer}</span>
              {b.year && <span className="text-lg leading-tight">{b.year}</span>}
            </TextBox>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TrainingSection() {
  return (
    <div>
      <Heading sub="Education">TRAINER SCHOOL</Heading>
      <TextBox>
        <p className="font-pixel text-[10px] leading-relaxed">{school.name}</p>
        <div className="mt-1">
          <Row k="DEGREE" v={school.degree} />
          <Row k="GPA" v={school.gpa} />
          <Row k="HONORS" v={school.honors} />
          <Row k="GRAD" v={school.when} />
          <Row k="PLUS" v={school.extra} />
        </div>
        <p className="mt-2 font-pixel text-[9px] text-dex-screen-mid">COURSEWORK</p>
        <ul className="mt-1 flex flex-wrap gap-1.5">
          {school.coursework.map((c) => (
            <li key={c} className="border-2 border-dex-screen-dark px-1.5 text-lg leading-snug">
              {c}
            </li>
          ))}
        </ul>
      </TextBox>

      <h3 className="mt-5 mb-2 font-pixel text-[10px]">EVOLUTION CHAIN</h3>
      <ol className="flex flex-wrap items-center gap-1 sm:gap-2">
        {evolution.map((e, i) => (
          <li key={e.stage} className="flex items-center gap-1 sm:gap-2">
            <div className="border-4 border-double border-dex-screen-dark px-2 py-1 text-center">
              <div className="font-pixel text-[9px]">{e.stage}</div>
              <div className="text-lg leading-none text-dex-screen-mid">
                {e.when} · {e.note}
              </div>
            </div>
            {i < evolution.length - 1 && <span className="font-pixel text-[10px]">▶</span>}
          </li>
        ))}
      </ol>

      <h3 className="mt-5 mb-2 font-pixel text-[10px]">SIDE QUESTS</h3>
      <div className="space-y-3">
        {quests.map((q) => (
          <TextBox key={q.name}>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-pixel text-[9px] leading-relaxed sm:text-[10px]">{q.name}</span>
              <TypeBadge type={q.type} small />
              <span className="ml-auto text-lg">{q.when}</span>
            </div>
            <ul className="mt-1 space-y-1">
              {q.bullets.map((b) => (
                <li key={b} className="flex gap-2 text-xl leading-snug">
                  <span aria-hidden>▸</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </TextBox>
        ))}
      </div>
    </div>
  );
}

export function PartySection() {
  return (
    <div>
      <Heading sub="Leadership & activities">PARTY</Heading>
      <ul className="space-y-3">
        {party.map((p) => (
          <li key={p.name}>
            <TextBox>
              <div className="flex items-start gap-3">
                <Sprite rows={POKEBALL} palette={LCD_PALETTE} scale={4} className="mt-1 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-pixel text-[10px]">{p.name}</span>
                    <span className="font-pixel text-[9px]">:L{p.lv}</span>
                    <TypeBadge type={p.type} small />
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="font-pixel text-[8px]">HP:</span>
                    <div className="h-2.5 w-28 border-2 border-dex-screen-dark bg-[#c4dc6c] sm:w-40">
                      <div className="h-full" style={{ width: `${p.hp}%`, background: TYPE_COLORS.ECON.bg }} />
                    </div>
                    <span className="text-lg leading-none">{p.when}</span>
                  </div>
                  <p className="mt-1 text-lg leading-tight text-dex-screen-mid">{p.role}</p>
                  <p className="mt-1 text-xl leading-snug">{p.text}</p>
                </div>
              </div>
            </TextBox>
          </li>
        ))}
      </ul>
    </div>
  );
}

type Guest = { id: number; name: string; message: string; starter: string; created_at: string };
const STARTERS = ["BULBASAUR", "CHARMANDER", "SQUIRTLE", "PIKACHU"] as const;

export function PcSection({ onGuestCount }: { onGuestCount: (n: number) => void }) {
  const [entries, setEntries] = useState<Guest[]>([]);
  const [status, setStatus] = useState<{ kind: "idle" | "saving" | "ok" | "err"; msg?: string }>({ kind: "idle" });
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [starter, setStarter] = useState<(typeof STARTERS)[number]>("PIKACHU");

  useEffect(() => {
    fetch("/api/guestbook")
      .then((r) => r.json())
      .then((d) => {
        setEntries(d.entries);
        onGuestCount(d.total);
      })
      .catch(() => {});
  }, [onGuestCount]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus({ kind: "saving" });
    const res = await fetch("/api/guestbook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, message, starter, website: form.get("website") || undefined }),
    }).catch(() => null);
    const data = await res?.json().catch(() => null);
    if (!res?.ok) {
      sfx("error");
      setStatus({ kind: "err", msg: data?.error ?? "The PC isn't responding." });
      return;
    }
    sfx("save");
    setEntries((es) => [data.entry, ...es].slice(0, 20));
    onGuestCount(data.total);
    setMessage("");
    setStatus({ kind: "ok", msg: `${data.entry.name} saved the game!` });
  }

  return (
    <div>
      <Heading sub="Contact">LIAM&apos;S PC</Heading>
      <TextBox>
        <ul className="space-y-1 text-xl">
          <li className="flex flex-wrap gap-x-2">
            <span className="font-pixel text-[9px] leading-[22px] text-dex-screen-mid">EMAIL</span>
            <a className="underline decoration-2 underline-offset-2 hover:bg-dex-screen-dark hover:text-dex-screen" href={`mailto:${trainer.email}`}>
              {trainer.email}
            </a>
          </li>
          <li className="flex flex-wrap gap-x-2">
            <span className="font-pixel text-[9px] leading-[22px] text-dex-screen-mid">LINKEDIN</span>
            <a
              className="underline decoration-2 underline-offset-2 hover:bg-dex-screen-dark hover:text-dex-screen"
              href={trainer.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              {trainer.linkedinLabel}
            </a>
          </li>
          <li className="flex flex-wrap gap-x-2">
            <span className="font-pixel text-[9px] leading-[22px] text-dex-screen-mid">REGION</span>
            {trainer.location}
          </li>
          <li className="flex flex-wrap gap-x-2">
            <span className="font-pixel text-[9px] leading-[22px] text-dex-screen-mid">STATUS</span>
            {trainer.workAuth}
          </li>
        </ul>
      </TextBox>

      <h3 className="mt-5 mb-2 font-pixel text-[10px]">TRAINER LOG</h3>
      <TextBox>
        <form onSubmit={submit} className="space-y-2">
          <p className="text-lg leading-tight text-dex-screen-mid">Leave a note and pick a starter. Saved to Liam&apos;s local database.</p>
          <label className="block">
            <span className="font-pixel text-[8px]">YOUR NAME?</span>
            <input
              required
              maxLength={10}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border-2 border-dex-screen-dark bg-[#c4dc6c] px-2 text-xl uppercase outline-none focus:bg-[#d6e88a]"
              placeholder="RED"
            />
          </label>
          <label className="block">
            <span className="font-pixel text-[8px]">MESSAGE</span>
            <textarea
              required
              maxLength={140}
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1 block w-full resize-none border-2 border-dex-screen-dark bg-[#c4dc6c] px-2 text-xl leading-tight outline-none focus:bg-[#d6e88a]"
              placeholder="Gotta hire 'em all!"
            />
          </label>
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
          <fieldset>
            <legend className="font-pixel text-[8px]">STARTER</legend>
            <div className="mt-1 flex flex-wrap gap-2">
              {STARTERS.map((s) => (
                <label
                  key={s}
                  className={`cursor-pointer border-2 border-dex-screen-dark px-2 font-pixel text-[8px] leading-[20px] has-[:focus-visible]:outline-dashed ${starter === s ? "bg-dex-screen-dark text-dex-screen" : ""}`}
                >
                  <input type="radio" name="starter" value={s} checked={starter === s} onChange={() => setStarter(s)} className="sr-only" />
                  {s}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              disabled={status.kind === "saving"}
              className="px-press border-2 border-dex-screen-dark bg-dex-screen-dark px-3 py-1.5 font-pixel text-[9px] text-dex-screen disabled:opacity-60"
            >
              {status.kind === "saving" ? "SAVING..." : "SAVE"}
            </button>
            {status.msg && (
              <span role="status" className="text-xl">
                {status.msg}
              </span>
            )}
          </div>
        </form>
      </TextBox>

      <ul className="mt-3 space-y-2">
        {entries.length === 0 && <li className="text-xl text-dex-screen-mid">No trainers yet. Be the first!</li>}
        {entries.map((g) => (
          <li key={g.id} className="border-l-4 border-dex-screen-dark pl-2">
            <span className="font-pixel text-[9px]">{g.name}</span>
            <span className="ml-2 font-pixel text-[7px] text-dex-screen-mid">chose {g.starter}</span>
            <p className="text-xl leading-tight">{g.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
