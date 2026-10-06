"use client";

import * as Tooltip from "@radix-ui/react-tooltip";
import { TYPE_COLORS, type DexType } from "@/data/dex";

export function TypeBadge({ type, small = false }: { type: DexType; small?: boolean }) {
  const c = TYPE_COLORS[type];
  return (
    <Tooltip.Root delayDuration={150}>
      <Tooltip.Trigger asChild>
        <span
          tabIndex={0}
          className={`inline-block cursor-help border-2 border-black font-pixel leading-none tracking-tight ${small ? "px-1 py-[3px] text-[7px]" : "px-1.5 py-1 text-[9px]"}`}
          style={{ background: c.bg, color: c.fg, boxShadow: "inset -2px -2px 0 rgba(0,0,0,.25), inset 2px 2px 0 rgba(255,255,255,.3)" }}
        >
          {type}
        </span>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          sideOffset={6}
          className="z-50 max-w-[220px] border-[3px] border-black bg-dex-cream px-2 py-1 font-term text-lg leading-tight text-black"
        >
          <span className="font-pixel text-[8px]">{type} TYPE</span>
          <br />
          {c.blurb}
          <Tooltip.Arrow className="fill-black" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
