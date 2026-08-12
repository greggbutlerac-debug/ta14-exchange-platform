import type { ReactNode } from "react";
import Link from "next/link";

export default function AndeksExaminationLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <section
        aria-label="ANDEKS independent examination response status"
        style={{
          position: "relative",
          zIndex: 90,
          padding: "14px 5vw",
          borderBottom: "1px solid rgba(