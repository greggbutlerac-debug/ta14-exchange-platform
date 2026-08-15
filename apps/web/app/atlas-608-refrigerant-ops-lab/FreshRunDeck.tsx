"use client";

import { useEffect } from "react";

const WORLD_BY_LABEL: Record<string, string> = {
  "CORE ORBIT": "core",
  "TYPE I MOON": "type1",
  "TYPE II GIANT": "type2",
  "TYPE III VOID": "type3",
  "A2L FRONTIER": "transition",
  "UNIVERSE GATE": "universal",
};

/**
 * Every player-initiated world launch is a new run.
 *
 * question-bank.ts randomizes its decks when the route module loads. A normal
 * React state reset does not reload that module, so returning to a world could
 * otherwise reuse the previous deck. This capture-phase controller converts a
 * trusted player click on a world button into a full route navigation. The new
 * document load regenerates both question order and answer order.
 *
 * Programmatic clicks from WorldAutoSelect have isTrusted === false and are
 * deliberately ignored, preventing a query-param boot loop.
 */
export default function FreshRunDeck() {
  useEffect(() => {
    const handleWorldLaunch = (event: MouseEvent) => {
      if (!event.isTrusted) return;
      if (window.location.pathname !== "/atlas-608-refrigerant-ops-lab") return;

      const target = event.target;
      if (!(target instanceof Element)) return;
      const button = target.closest<HTMLButtonElement>("button.world");
      if (!button) return;

      const text = button.textContent ?? "";
      const entry = Object.entries(WORLD_BY_LABEL).find(([label]) => text.includes(label));
      if (!entry) return;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      const [, world] = entry;
      window.location.assign(`/atlas-608-refrigerant-ops-lab?world=${encodeURIComponent(world)}`);
    };

    document.addEventListener("click", handleWorldLaunch, true);
    return () => document.removeEventListener("click", handleWorldLaunch, true);
  }, []);

  return null;
}
