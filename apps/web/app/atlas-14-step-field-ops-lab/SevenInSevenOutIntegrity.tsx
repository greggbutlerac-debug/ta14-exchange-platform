"use client";

import { useEffect, useState } from "react";

type Phase = "READY" | "7 IN" | "7 OUT" | "COMPLETE" | "EXPIRED";

function readStep() {
  const zone = document.querySelector<HTMLElement>(".zone")?.textContent ?? "";
  const match = zone.match(/STEP\s+(\d+)\s+OF\s+14/i);
  return match ? Number(match[1]) : 0;
}

function readTimer() {
  return document.querySelector<HTMLElement>(".