"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type GovernanceLibraryLayoutProps = {
  children: ReactNode;
};

type NavigationLink = {
  href: string;
  label: string;
  exact?: boolean;
  externalWorkspace?: boolean;
};

type NavigationSection = {
  label: string;
  links: NavigationLink[];
};

const navigationSections: NavigationSection[] = [
  {
    label: "Library Entrance",
    links: [
      {
        href: "/governance-library",
        label: "Overview",
        exact: true,
      },
      {
        href: "/governance-library/dashboard",
        label: "Library Dashboard",
      },
      {
        href: "/governance-library/dictionary",
        label: "AI Governance Dictionary",
      },
      {
        href: "/governance-library/glossary",
        label: "Governance Glossary",
      },
    ],
  },
  {
    label: "Source Authorities",
    links: [
      {
        href: "/governance-library/laws",
        label: "Laws",
      },
      {
        href: "/governance-library/regulations",
        label: "Regulations",
      },
      {
        href: "/governance-library/standards",
        label: "Standards",
      },
      {
        href: "/governance-library/frameworks",
        label: "Frameworks",
      },
      {
        href: "/governance-library/principles",
        label: "Principles",
      },
      {
        href: "/governance-library/recommendations",
        label: "Recommendations",
      },
    ],
  },
  {
    label: "Governance Systems",
    links: [
      {
        href: "/governance
