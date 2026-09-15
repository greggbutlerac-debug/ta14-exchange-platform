"use client";

import { useEffect } from "react";

const TITLES = [
  "Approaching & Opening the Air Handler",
  "Heat Kit & Furnace Operation Check",
  "Blower Motor & Airflow Integrity",
  "Evaporator Coil Inspection",
  "Metering Device Identification",
  "Filter & Return Airflow Check",
  "Air Handler Reassembly & Final Indoor Verification",
  "Condenser Visual Inspection & Controlled Panel Opening",
  "Start Components, Capacitors & Compressor Insulation Verification",
  "Compressor & Fan Motor Amp Draw Verification",
  "Condenser Panel Reassembly & Mechanical Integrity Check",
  "Condenser Coil Cleaning & Airflow Restoration",
  "Refrigerant Charge Approximation",
  "Condensate Management Verification & System Closure",
] as const;

export default function MissionRouteExactTitles() {
  useEffect(() => {
    const apply = () => {
      const links = Array.from(
        document.querySelectorAll<HTMLAnchorElement>('aside a[href^="/exchange/hvac/14-step/"]'),
      );

      links.slice(0, TITLES.length).forEach((link, index) => {
        const label = link.querySelector<HTMLSpanElement>("span");
        const phase = label?.querySelector<HTMLElement>("small");
        if (!label || !phase) return;

        Array.from(label.childNodes).forEach((node) => {
          if (node !== phase) node.remove();
        });
        label.append(document.createTextNode(TITLES[index]));
      });
    };

    apply();
    const observer = new MutationObserver(apply);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return null;
}
