"use client";

import { useEffect } from "react";

const STEP_COUNT = 14;

export default function MissionRouteLearningLinks() {
  useEffect(() => {
    const wired = new WeakSet<HTMLElement>();

    const openStep = (step: number) => {
      window.open(
        `/exchange/hvac/14-step/${step}`,
        "_blank",
        "noopener,noreferrer",
      );
    };

    const wire = () => {
      const rows = Array.from(document.querySelectorAll<HTMLElement>(".stepRow"));
      rows.slice(0, STEP_COUNT).forEach((row, index) => {
        if (wired.has(row)) return;
        wired.add(row);

        const step = index + 1;
        row.classList.add("stepLearningCta");
        row.setAttribute("role", "link");
        row.setAttribute("tabindex", "0");
        row.setAttribute("aria-label", `Open TA-14 Academy learning page for step ${step}`);
        row.setAttribute("title", "Open the polished TA-14 Academy step page in a new tab");

        const cta = document.createElement("span");
        cta.className = "stepLearnLabel";
        cta.textContent = "LEARN ↗";
        row.appendChild(cta);

        const activate = (event: Event) => {
          event.preventDefault();
          event.stopPropagation();
          openStep(step);
        };

        row.addEventListener("click", activate);
        row.addEventListener("keydown", (event: KeyboardEvent) => {
          if (event.key === "Enter" || event.key === " ") activate(event);
        });
      });
    };

    wire();
    const observer = new MutationObserver(wire);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return (
    <style>{`
      .stepLearningCta {
        grid-template-columns: 32px minmax(0,1fr) auto !important;
        cursor: pointer;
        position: relative;
        transition: transform .16s ease, border-color .16s ease, background .16s ease !important;
      }
      .stepLearningCta:hover,
      .stepLearningCta:focus-visible {
        transform: translateX(3px);
        border-color: rgba(84,232,255,.48) !important;
        background: linear-gradient(90deg,rgba(84,232,255,.11),rgba(57,242,161,.04)) !important;
        outline: none;
      }
      .stepLearnLabel {
        align-self: center;
        padding: 5px 7px;
        border: 1px solid rgba(84,232,255,.22);
        border-radius: 7px;
        color: #72ebff;
        background: rgba(84,232,255,.045);
        font-size: 7px;
        font-weight: 1000;
        letter-spacing: .08em;
        white-space: nowrap;
      }
      .stepLearningCta.active .stepLearnLabel {
        color: #8af3c1;
        border-color: rgba(57,242,161,.28);
        background: rgba(57,242,161,.055);
      }
      @media(max-width:1100px) {
        .stepLearnLabel { font-size: 6px; padding: 4px 5px; }
      }
    `}</style>
  );
}
