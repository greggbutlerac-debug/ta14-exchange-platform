"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type TrackId = "foundations" | "practitioner" | "reviewer" | "assessor" | "instructor" | "executive" | "provider" | "deployer" | "auditor" | "regulator";
type LevelFilter = "All" | "Beginner" | "Practitioner" | "Professional" | "Expert" | "Executive";
type SavedPathwayState = {
  selectedTrack: TrackId;
  completedModules: string[];
  savedTracks: TrackId[];
  notes: Record<string, string>;
  updatedAt: string;
};

const STORAGE_KEY = "ta14-academy-pathways-v2";

const railItems = [
  {
    glyph: "AC",
    label: "Academy Home",
    href: "/academy",
    action: "Home",
  },
  {
    glyph: "01",
    label: "Start Here",
    href: "/academy/start",
    action: "Begin",
  },
  {
    glyph: "MC",
    label: "Mission Control",
    href: "/academy/mission-control",
    action: "Resume",
  },
  {
    glyph: "AR",
    label: "Architecture Explorer",
    href: "/academy/architecture-explorer",
    action: "Inspect",
  },
  {
    glyph: "PW",
    label: "Learning Pathways",
    href: "/academy/pathways",
    action: "Choose",
  },
  {
    glyph: "RB",
    label: "Route Construction Lab",
    href: "/academy/route-construction-lab",
    action: "Build",
  },
  {
    glyph: "SIM",
    label: "Simulation Center",
    href: "/academy/simulator",
    action: "Test",
  },
  {
    glyph: "RV",
    label: "Review Workspace",
    href: "/academy/review",
    action: "Challenge",
  },
  {
    glyph: "AS",
    label: "Assessment Center",
    href: "/academy/assessment",
    action: "Prove",
  },
  {
    glyph: "CR",
    label: "Credential Dashboard",
    href: "/academy/credential-dashboard",
    action: "Advance",
  },
  {
    glyph: "RG",
    label: "Credential Registry",
    href: "/academy/credential-registry",
    action: "Verify",
  },
  {
    glyph: "EX",
    label: "Return to Exchange",
    href: "/",
    action: "Exit",
  },
] as const;

const pathwayTracks = [
  {
    id: "foundations" as TrackId,
    number: "01",
    title: "Foundations",
    description: "Understand the governing language before entering consequence-bearing tools.",
    status: "Available now",
    moduleCount: "6 modules",
    level: "Beginner",
    href: "/academy/start",
    modules: [
      {
        id: "foundations-01",
        number: "01",
        title: "Governance thinking",
        duration: "40 min",
        evidence: "Demonstrated governance thinking evidence",
      },
      {
        id: "foundations-02",
        number: "02",
        title: "Reality and record",
        duration: "45 min",
        evidence: "Demonstrated reality and record evidence",
      },
      {
        id: "foundations-03",
        number: "03",
        title: "Continuity",
        duration: "50 min",
        evidence: "Demonstrated continuity evidence",
      },
      {
        id: "foundations-04",
        number: "04",
        title: "Admissibility",
        duration: "55 min",
        evidence: "Demonstrated admissibility evidence",
      },
      {
        id: "foundations-05",
        number: "05",
        title: "Authority and binding",
        duration: "60 min",
        evidence: "Demonstrated authority and binding evidence",
      },
      {
        id: "foundations-06",
        number: "06",
        title: "Outcome and verification",
        duration: "65 min",
        evidence: "Demonstrated outcome and verification evidence",
      },
    ],
  },
  {
    id: "practitioner" as TrackId,
    number: "02",
    title: "Governed Route Practitioner",
    description: "Construct bounded routes that preserve uncertainty, evidence, authority, and determinations.",
    status: "Core pathway",
    moduleCount: "8 modules",
    level: "Practitioner",
    href: "/academy/route-construction-lab",
    modules: [
      {
        id: "practitioner-01",
        number: "01",
        title: "What is a route?",
        duration: "40 min",
        evidence: "Demonstrated what is a route? evidence",
      },
      {
        id: "practitioner-02",
        number: "02",
        title: "Route construction lab",
        duration: "45 min",
        evidence: "Demonstrated route construction lab evidence",
      },
      {
        id: "practitioner-03",
        number: "03",
        title: "Decision record lab",
        duration: "50 min",
        evidence: "Demonstrated decision record lab evidence",
      },
      {
        id: "practitioner-04",
        number: "04",
        title: "Runtime governance lab",
        duration: "55 min",
        evidence: "Demonstrated runtime governance lab evidence",
      },
      {
        id: "practitioner-05",
        number: "05",
        title: "Evidence conflict lab",
        duration: "60 min",
        evidence: "Demonstrated evidence conflict lab evidence",
      },
      {
        id: "practitioner-06",
        number: "06",
        title: "Challenge and appeal",
        duration: "65 min",
        evidence: "Demonstrated challenge and appeal evidence",
      },
      {
        id: "practitioner-07",
        number: "07",
        title: "Route validation workshop",
        duration: "70 min",
        evidence: "Demonstrated route validation workshop evidence",
      },
      {
        id: "practitioner-08",
        number: "08",
        title: "Capstone mission",
        duration: "75 min",
        evidence: "Demonstrated capstone mission evidence",
      },
    ],
  },
  {
    id: "reviewer" as TrackId,
    number: "03",
    title: "Independent Reviewer",
    description: "Challenge routes without silently repairing missing evidence or inventing authority.",
    status: "Advanced pathway",
    moduleCount: "7 modules",
    level: "Professional",
    href: "/academy/review",
    modules: [
      {
        id: "reviewer-01",
        number: "01",
        title: "Review foundations",
        duration: "40 min",
        evidence: "Demonstrated review foundations evidence",
      },
      {
        id: "reviewer-02",
        number: "02",
        title: "Boundary inspection",
        duration: "45 min",
        evidence: "Demonstrated boundary inspection evidence",
      },
      {
        id: "reviewer-03",
        number: "03",
        title: "Evidence challenge",
        duration: "50 min",
        evidence: "Demonstrated evidence challenge evidence",
      },
      {
        id: "reviewer-04",
        number: "04",
        title: "Authority challenge",
        duration: "55 min",
        evidence: "Demonstrated authority challenge evidence",
      },
      {
        id: "reviewer-05",
        number: "05",
        title: "Continuity testing",
        duration: "60 min",
        evidence: "Demonstrated continuity testing evidence",
      },
      {
        id: "reviewer-06",
        number: "06",
        title: "Finding preservation",
        duration: "65 min",
        evidence: "Demonstrated finding preservation evidence",
      },
      {
        id: "reviewer-07",
        number: "07",
        title: "Appeal handling",
        duration: "70 min",
        evidence: "Demonstrated appeal handling evidence",
      },
    ],
  },
  {
    id: "assessor" as TrackId,
    number: "04",
    title: "Competency Assessor",
    description: "Evaluate demonstrated capability separately from attendance, completion, or confidence.",
    status: "Credential pathway",
    moduleCount: "6 modules",
    level: "Professional",
    href: "/academy/assessment",
    modules: [
      {
        id: "assessor-01",
        number: "01",
        title: "Assessment architecture",
        duration: "40 min",
        evidence: "Demonstrated assessment architecture evidence",
      },
      {
        id: "assessor-02",
        number: "02",
        title: "Scope boundaries",
        duration: "45 min",
        evidence: "Demonstrated scope boundaries evidence",
      },
      {
        id: "assessor-03",
        number: "03",
        title: "Evidence rubrics",
        duration: "50 min",
        evidence: "Demonstrated evidence rubrics evidence",
      },
      {
        id: "assessor-04",
        number: "04",
        title: "Observed performance",
        duration: "55 min",
        evidence: "Demonstrated observed performance evidence",
      },
      {
        id: "assessor-05",
        number: "05",
        title: "Determination writing",
        duration: "60 min",
        evidence: "Demonstrated determination writing evidence",
      },
      {
        id: "assessor-06",
        number: "06",
        title: "Credential recommendation",
        duration: "65 min",
        evidence: "Demonstrated credential recommendation evidence",
      },
    ],
  },
  {
    id: "instructor" as TrackId,
    number: "05",
    title: "Academy Instructor",
    description: "Teach the architecture without turning examples into fabricated answers.",
    status: "Faculty pathway",
    moduleCount: "7 modules",
    level: "Expert",
    href: "/academy/instructor-console",
    modules: [
      {
        id: "instructor-01",
        number: "01",
        title: "Instructional doctrine",
        duration: "40 min",
        evidence: "Demonstrated instructional doctrine evidence",
      },
      {
        id: "instructor-02",
        number: "02",
        title: "Guided questioning",
        duration: "45 min",
        evidence: "Demonstrated guided questioning evidence",
      },
      {
        id: "instructor-03",
        number: "03",
        title: "Uncertainty preservation",
        duration: "50 min",
        evidence: "Demonstrated uncertainty preservation evidence",
      },
      {
        id: "instructor-04",
        number: "04",
        title: "Lab facilitation",
        duration: "55 min",
        evidence: "Demonstrated lab facilitation evidence",
      },
      {
        id: "instructor-05",
        number: "05",
        title: "Assessment integrity",
        duration: "60 min",
        evidence: "Demonstrated assessment integrity evidence",
      },
      {
        id: "instructor-06",
        number: "06",
        title: "Learner intervention",
        duration: "65 min",
        evidence: "Demonstrated learner intervention evidence",
      },
      {
        id: "instructor-07",
        number: "07",
        title: "Instructor authorization",
        duration: "70 min",
        evidence: "Demonstrated instructor authorization evidence",
      },
    ],
  },
  {
    id: "executive" as TrackId,
    number: "06",
    title: "Executive Governance Leader",
    description: "Connect governance commitments to operating authority, investment, accountability, and consequence.",
    status: "Leadership pathway",
    moduleCount: "5 modules",
    level: "Executive",
    href: "/academy/enterprise-management",
    modules: [
      {
        id: "executive-01",
        number: "01",
        title: "Executive orientation",
        duration: "40 min",
        evidence: "Demonstrated executive orientation evidence",
      },
      {
        id: "executive-02",
        number: "02",
        title: "Authority maps",
        duration: "45 min",
        evidence: "Demonstrated authority maps evidence",
      },
      {
        id: "executive-03",
        number: "03",
        title: "Portfolio consequence",
        duration: "50 min",
        evidence: "Demonstrated portfolio consequence evidence",
      },
      {
        id: "executive-04",
        number: "04",
        title: "Institutional readiness",
        duration: "55 min",
        evidence: "Demonstrated institutional readiness evidence",
      },
      {
        id: "executive-05",
        number: "05",
        title: "Governance operating model",
        duration: "60 min",
        evidence: "Demonstrated governance operating model evidence",
      },
    ],
  },
  {
    id: "provider" as TrackId,
    number: "07",
    title: "AI Provider",
    description: "Translate provider obligations into evidence-bearing design, release, monitoring, and change controls.",
    status: "Role pathway",
    moduleCount: "7 modules",
    level: "Professional",
    href: "/academy/governed-execution-studio",
    modules: [
      {
        id: "provider-01",
        number: "01",
        title: "Provider boundary",
        duration: "40 min",
        evidence: "Demonstrated provider boundary evidence",
      },
      {
        id: "provider-02",
        number: "02",
        title: "System evidence",
        duration: "45 min",
        evidence: "Demonstrated system evidence evidence",
      },
      {
        id: "provider-03",
        number: "03",
        title: "Release authority",
        duration: "50 min",
        evidence: "Demonstrated release authority evidence",
      },
      {
        id: "provider-04",
        number: "04",
        title: "Change continuity",
        duration: "55 min",
        evidence: "Demonstrated change continuity evidence",
      },
      {
        id: "provider-05",
        number: "05",
        title: "Runtime controls",
        duration: "60 min",
        evidence: "Demonstrated runtime controls evidence",
      },
      {
        id: "provider-06",
        number: "06",
        title: "Incident preservation",
        duration: "65 min",
        evidence: "Demonstrated incident preservation evidence",
      },
      {
        id: "provider-07",
        number: "07",
        title: "Provider attestation",
        duration: "70 min",
        evidence: "Demonstrated provider attestation evidence",
      },
    ],
  },
  {
    id: "deployer" as TrackId,
    number: "08",
    title: "AI Deployer",
    description: "Govern use context, local evidence, human authority, operational boundaries, and outcomes.",
    status: "Role pathway",
    moduleCount: "7 modules",
    level: "Professional",
    href: "/academy/governed-execution-studio",
    modules: [
      {
        id: "deployer-01",
        number: "01",
        title: "Deployment context",
        duration: "40 min",
        evidence: "Demonstrated deployment context evidence",
      },
      {
        id: "deployer-02",
        number: "02",
        title: "Use boundary",
        duration: "45 min",
        evidence: "Demonstrated use boundary evidence",
      },
      {
        id: "deployer-03",
        number: "03",
        title: "Local evidence",
        duration: "50 min",
        evidence: "Demonstrated local evidence evidence",
      },
      {
        id: "deployer-04",
        number: "04",
        title: "Human oversight",
        duration: "55 min",
        evidence: "Demonstrated human oversight evidence",
      },
      {
        id: "deployer-05",
        number: "05",
        title: "Runtime correspondence",
        duration: "60 min",
        evidence: "Demonstrated runtime correspondence evidence",
      },
      {
        id: "deployer-06",
        number: "06",
        title: "Outcome review",
        duration: "65 min",
        evidence: "Demonstrated outcome review evidence",
      },
      {
        id: "deployer-07",
        number: "07",
        title: "Deployment attestation",
        duration: "70 min",
        evidence: "Demonstrated deployment attestation evidence",
      },
    ],
  },
  {
    id: "auditor" as TrackId,
    number: "09",
    title: "Governance Auditor",
    description: "Test whether claims, records, controls, and executions correspond without assuming compliance.",
    status: "Assurance pathway",
    moduleCount: "8 modules",
    level: "Expert",
    href: "/academy/review",
    modules: [
      {
        id: "auditor-01",
        number: "01",
        title: "Audit boundary",
        duration: "40 min",
        evidence: "Demonstrated audit boundary evidence",
      },
      {
        id: "auditor-02",
        number: "02",
        title: "Source authority",
        duration: "45 min",
        evidence: "Demonstrated source authority evidence",
      },
      {
        id: "auditor-03",
        number: "03",
        title: "Record sampling",
        duration: "50 min",
        evidence: "Demonstrated record sampling evidence",
      },
      {
        id: "auditor-04",
        number: "04",
        title: "Continuity testing",
        duration: "55 min",
        evidence: "Demonstrated continuity testing evidence",
      },
      {
        id: "auditor-05",
        number: "05",
        title: "Control correspondence",
        duration: "60 min",
        evidence: "Demonstrated control correspondence evidence",
      },
      {
        id: "auditor-06",
        number: "06",
        title: "Execution testing",
        duration: "65 min",
        evidence: "Demonstrated execution testing evidence",
      },
      {
        id: "auditor-07",
        number: "07",
        title: "Finding classification",
        duration: "70 min",
        evidence: "Demonstrated finding classification evidence",
      },
      {
        id: "auditor-08",
        number: "08",
        title: "Audit preservation",
        duration: "75 min",
        evidence: "Demonstrated audit preservation evidence",
      },
    ],
  },
  {
    id: "regulator" as TrackId,
    number: "10",
    title: "Regulatory and Public Authority",
    description: "Inspect consequence-bearing systems through attributable evidence, valid authority, and challengeable determinations.",
    status: "Public-interest pathway",
    moduleCount: "6 modules",
    level: "Expert",
    href: "/academy/architecture-explorer",
    modules: [
      {
        id: "regulator-01",
        number: "01",
        title: "Jurisdiction boundary",
        duration: "40 min",
        evidence: "Demonstrated jurisdiction boundary evidence",
      },
      {
        id: "regulator-02",
        number: "02",
        title: "Authority basis",
        duration: "45 min",
        evidence: "Demonstrated authority basis evidence",
      },
      {
        id: "regulator-03",
        number: "03",
        title: "Evidence demand",
        duration: "50 min",
        evidence: "Demonstrated evidence demand evidence",
      },
      {
        id: "regulator-04",
        number: "04",
        title: "Determination review",
        duration: "55 min",
        evidence: "Demonstrated determination review evidence",
      },
      {
        id: "regulator-05",
        number: "05",
        title: "Corrective action",
        duration: "60 min",
        evidence: "Demonstrated corrective action evidence",
      },
      {
        id: "regulator-06",
        number: "06",
        title: "Public record",
        duration: "65 min",
        evidence: "Demonstrated public record evidence",
      },
    ],
  },
] as const;

const roleRecommendations = [
  {
    title: "Executive",
    description: "Set authority, investment, and accountability boundaries.",
    track: "executive" as TrackId,
  },
  {
    title: "Board or committee",
    description: "Challenge material consequence and governance claims.",
    track: "executive" as TrackId,
  },
  {
    title: "AI provider",
    description: "Govern design, release, change, and runtime evidence.",
    track: "provider" as TrackId,
  },
  {
    title: "AI deployer",
    description: "Govern local context, use, oversight, and outcomes.",
    track: "deployer" as TrackId,
  },
  {
    title: "Developer",
    description: "Build controls that correspond to route requirements.",
    track: "practitioner" as TrackId,
  },
  {
    title: "Risk leader",
    description: "Connect enterprise risk to specific execution boundaries.",
    track: "reviewer" as TrackId,
  },
  {
    title: "Compliance leader",
    description: "Map obligations without reducing governance to checklists.",
    track: "reviewer" as TrackId,
  },
  {
    title: "Auditor",
    description: "Test correspondence between claims, controls, and execution.",
    track: "auditor" as TrackId,
  },
  {
    title: "Assessor",
    description: "Determine demonstrated, scope-bounded competency.",
    track: "assessor" as TrackId,
  },
  {
    title: "Instructor",
    description: "Guide learning while preserving unresolved conditions.",
    track: "instructor" as TrackId,
  },
  {
    title: "Regulator",
    description: "Inspect authority, evidence, consequence, and challengeability.",
    track: "regulator" as TrackId,
  },
  {
    title: "Student",
    description: "Begin with foundations and advance through demonstrated capability.",
    track: "foundations" as TrackId,
  },
] as const;

const competencyFramework = [
  {
    code: "C-01",
    title: "Boundary definition",
    description: "State the exact action, actor, system, scope, and consequence.",
  },
  {
    code: "C-02",
    title: "Reality identification",
    description: "Separate observed condition from interpretation and preference.",
  },
  {
    code: "C-03",
    title: "Record evaluation",
    description: "Test attribution, method, timing, provenance, and integrity.",
  },
  {
    code: "C-04",
    title: "Continuity testing",
    description: "Identify breaks across custody, state, dependency, and time.",
  },
  {
    code: "C-05",
    title: "Evidence admissibility",
    description: "Determine whether evidence is relevant, fresh, sufficient, and fit.",
  },
  {
    code: "C-06",
    title: "Authority validation",
    description: "Verify authority for the exact action, scope, actor, and moment.",
  },
  {
    code: "C-07",
    title: "Determination writing",
    description: "Issue ALLOW, HOLD, DENY, or ESCALATE with preserved grounds.",
  },
  {
    code: "C-08",
    title: "Commit preservation",
    description: "Fix the approved route version, conditions, and dependencies.",
  },
  {
    code: "C-09",
    title: "Runtime correspondence",
    description: "Test whether execution remains aligned with the committed state.",
  },
  {
    code: "C-10",
    title: "Outcome preservation",
    description: "Record what occurred, what changed, and what remains unresolved.",
  },
  {
    code: "C-11",
    title: "Independent challenge",
    description: "Raise attributable findings without silently correcting the route.",
  },
  {
    code: "C-12",
    title: "Competency proof",
    description: "Demonstrate capability through observed, scope-bounded evidence.",
  },
] as const;

const progressionRules = [
  {
    number: "01",
    title: "Understanding before construction",
    body: "Learners inspect the architecture and governing language before building routes.",
  },
  {
    number: "02",
    title: "Construction before simulation",
    body: "A route must expose its boundary, evidence, authority, and determination before runtime testing.",
  },
  {
    number: "03",
    title: "Simulation before assessment",
    body: "Practice may reveal failure without becoming credential evidence by itself.",
  },
  {
    number: "04",
    title: "Assessment before credential recommendation",
    body: "Completion never substitutes for observed, scope-bounded capability.",
  },
  {
    number: "05",
    title: "Authorization before registry event",
    body: "Only authorized Academy roles may recommend or issue credential events.",
  },
  {
    number: "06",
    title: "Revalidation after material change",
    body: "Expired scope, changed architecture, or broken continuity requires renewed proof.",
  },
] as const;

export default function AcademyPathwaysPage() {
  const [selectedTrack, setSelectedTrack] = useState<TrackId>("foundations");
  const [levelFilter, setLevelFilter] = useState<LevelFilter>("All");
  const [query, setQuery] = useState("");
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [savedTracks, setSavedTracks] = useState<TrackId[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [mobileRailOpen, setMobileRailOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as SavedPathwayState;
        setSelectedTrack(saved.selectedTrack ?? "foundations");
        setCompletedModules(saved.completedModules ?? []);
        setSavedTracks(saved.savedTracks ?? []);
        setNotes(saved.notes ?? {});
      }
    } catch {
      // Local preservation is helpful, never authoritative.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const payload: SavedPathwayState = {
      selectedTrack,
      completedModules,
      savedTracks,
      notes,
      updatedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [selectedTrack, completedModules, savedTracks, notes, hydrated]);

  const activeTrack = useMemo(
    () => pathwayTracks.find((track) => track.id === selectedTrack) ?? pathwayTracks[0],
    [selectedTrack],
  );

  const filteredTracks = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return pathwayTracks.filter((track) => {
      const levelMatch = levelFilter === "All" || track.level === levelFilter;
      const textMatch = !normalized || [track.title, track.description, track.level, ...track.modules.map((module) => module.title)].join(" ").toLowerCase().includes(normalized);
      return levelMatch && textMatch;
    });
  }, [levelFilter, query]);

  const completedInTrack = activeTrack.modules.filter((module) => completedModules.includes(module.id)).length;
  const progress = Math.round((completedInTrack / activeTrack.modules.length) * 100);

  function toggleModule(moduleId: string) {
    setCompletedModules((current) => current.includes(moduleId) ? current.filter((id) => id !== moduleId) : [...current, moduleId]);
  }

  function toggleSaved(trackId: TrackId) {
    setSavedTracks((current) => current.includes(trackId) ? current.filter((id) => id !== trackId) : [...current, trackId]);
  }

  return (
    <main className="academyPathways">
      <button className="mobileRailButton" type="button" onClick={() => setMobileRailOpen((value) => !value)} aria-expanded={mobileRailOpen}>
        <span>AC</span> Academy actions
      </button>

      <aside className={`academyRail ${mobileRailOpen ? "isOpen" : ""}`}>
        <div className="railIdentity">
          <Link href="/academy" className="railMark"><span>TA</span><strong>14</strong></Link>
          <div><p>TA-14 Academy</p><small>Seventh major door</small></div>
        </div>
        <div className="railPrimaryCard">
          <span className="railEyebrow">Your next governed step</span>
          <strong>{activeTrack.title}</strong>
          <p>{progress}% of this pathway is locally marked complete.</p>
          <Link href={activeTrack.href}>Continue pathway <span>→</span></Link>
        </div>
        <nav className="railNavigation" aria-label="Academy navigation">
          {railItems.map((item) => (
            <Link key={item.href} href={item.href} className={item.href === "/academy/pathways" ? "active" : ""} onClick={() => setMobileRailOpen(false)}>
              <span className="railGlyph">{item.glyph}</span>
              <span className="railLabel"><strong>{item.label}</strong><small>{item.action}</small></span>
              <span className="railArrow">→</span>
            </Link>
          ))}
        </nav>
        <div className="railPrinciple"><small>Governing principle</small><strong>No admissible evidence.<br/>No admissible execution.</strong></div>
      </aside>

      <section className="pathwaysCanvas">
        <header className="topBar">
          <div><span className="doorNumber">07</span><div><p>TA-14 Academy</p><small>Learning Pathways</small></div></div>
          <div className="topActions"><Link href="/academy/mission-control">Mission Control</Link><Link href="/academy/assessment" className="filled">Assessment Center</Link></div>
        </header>

        <section className="heroSection">
          <div className="heroCopy">
            <span className="sectionKicker">Choose a governed learning route</span>
            <h1>Move from understanding<br/><em>to demonstrated capability.</em></h1>
            <p>TA-14 Academy pathways organize learning around consequence, evidence, authority, continuity, admissibility, execution, and preserved outcomes. Completion is visible. Competency must still be proved.</p>
            <div className="heroActions"><Link href="/academy/start" className="primaryAction">Find my starting point <span>→</span></Link><a href="#catalog" className="secondaryAction">Explore every pathway</a></div>
            <div className="heroPrinciples"><span>Education before tools</span><span>Competency before credentials</span><span>Evidence before execution</span></div>
          </div>
          <div className="heroDashboard">
            <div className="heroDashboardHead"><span>Pathway command card</span><strong>{activeTrack.number}</strong></div>
            <h2>{activeTrack.title}</h2>
            <p>{activeTrack.description}</p>
            <div className="progressTrack"><span style={{ width: `${progress}%` }} /></div>
            <div className="progressMeta"><strong>{progress}%</strong><span>{completedInTrack} of {activeTrack.modules.length} modules marked</span></div>
            <div className="heroStats"><div><strong>{pathwayTracks.length}</strong><span>institutional pathways</span></div><div><strong>{competencyFramework.length}</strong><span>core competencies</span></div><div><strong>4</strong><span>determination states</span></div></div>
          </div>
        </section>

        <section className="orientationStrip">
          <div><span>01</span><strong>Understand</strong><p>Learn the governing architecture and language.</p></div>
          <div><span>02</span><strong>Construct</strong><p>Build bounded routes without filling unknowns.</p></div>
          <div><span>03</span><strong>Test</strong><p>Find the earliest failure before consequence.</p></div>
          <div><span>04</span><strong>Prove</strong><p>Demonstrate scope-bounded competency.</p></div>
          <div><span>05</span><strong>Preserve</strong><p>Return authorized events to the Registry.</p></div>
        </section>

        <section className="catalogSection" id="catalog">
          <div className="sectionHeading"><div><span className="sectionKicker">Institutional catalog</span><h2>Every pathway has a purpose, boundary, and proof requirement.</h2></div><p>Choose by role, responsibility, consequence, or the capability you need to demonstrate. The Academy does not collapse distinct roles into one generic curriculum.</p></div>
          <div className="catalogControls">
            <label className="searchField"><span>Search pathways</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search role, module, or competency" /></label>
            <div className="filterGroup" aria-label="Level filters">
              {(["All", "Beginner", "Practitioner", "Professional", "Expert", "Executive"] as LevelFilter[]).map((level) => <button key={level} type="button" className={levelFilter === level ? "active" : ""} onClick={() => setLevelFilter(level)}>{level}</button>)}
            </div>
          </div>
          <div className="pathwayGrid">
            {filteredTracks.map((track) => {
              const done = track.modules.filter((module) => completedModules.includes(module.id)).length;
              const pct = Math.round((done / track.modules.length) * 100);
              return (
                <article key={track.id} className={`pathwayCard ${track.id === selectedTrack ? "selected" : ""}`}>
                  <div className="pathwayCardTop"><span>{track.number}</span><button type="button" onClick={() => toggleSaved(track.id)} aria-label={`Save ${track.title}`}>{savedTracks.includes(track.id) ? "Saved" : "Save"}</button></div>
                  <div className="pathwayTags"><span>{track.status}</span><span>{track.level}</span><span>{track.moduleCount}</span></div>
                  <h3>{track.title}</h3>
                  <p>{track.description}</p>
                  <div className="miniProgress"><span style={{ width: `${pct}%` }} /></div>
                  <div className="pathwayFooter"><button type="button" onClick={() => setSelectedTrack(track.id)}>Inspect pathway <span>→</span></button><strong>{pct}%</strong></div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="workspaceSection">
          <div className="workspaceHeader"><div><span className="sectionKicker">Selected pathway</span><h2>{activeTrack.title}</h2><p>{activeTrack.description}</p></div><div className="workspaceHeaderActions"><button type="button" onClick={() => toggleSaved(activeTrack.id)}>{savedTracks.includes(activeTrack.id) ? "Remove saved pathway" : "Save pathway"}</button><Link href={activeTrack.href}>Open connected workspace →</Link></div></div>
          <div className="workspaceGrid">
            <div className="moduleTimeline">
              {activeTrack.modules.map((module, index) => {
                const complete = completedModules.includes(module.id);
                return (
                  <article key={module.id} className={complete ? "complete" : ""}>
                    <button type="button" className="moduleCheck" onClick={() => toggleModule(module.id)} aria-label={`Toggle ${module.title}`}>{complete ? "✓" : module.number}</button>
                    <div className="moduleBody"><div><span>Module {module.number}</span><span>{module.duration}</span></div><h3>{module.title}</h3><p>{module.evidence}</p></div>
                    <Link href={activeTrack.href}>{index === 0 && !complete ? "Begin" : "Open"} →</Link>
                  </article>
                );
              })}
            </div>
            <aside className="pathwayInspector">
              <div className="inspectorCard"><span className="inspectorKicker">Progress determination</span><strong className={progress === 100 ? "allow" : "hold"}>{progress === 100 ? "READY FOR REVIEW" : "HOLD"}</strong><p>{progress === 100 ? "All modules are locally marked complete. Completion still does not establish competency or credential eligibility." : "Required learning remains incomplete. Missing work is preserved rather than treated as satisfied."}</p></div>
              <div className="inspectorCard"><span className="inspectorKicker">Learner note</span><textarea value={notes[activeTrack.id] ?? ""} onChange={(event) => setNotes((current) => ({ ...current, [activeTrack.id]: event.target.value }))} placeholder="Preserve questions, uncertainties, or evidence to revisit." /><small>Stored locally in this browser. This note is not an Academy record.</small></div>
              <div className="inspectorCard"><span className="inspectorKicker">What completion means</span><ul><li>Lessons were opened or locally marked.</li><li>Required concepts were presented.</li><li>Practice may have been performed.</li></ul><span className="divider"/><span className="inspectorKicker">What it does not mean</span><ul><li>Evidence was independently assessed.</li><li>Authority was issued.</li><li>A credential event is admissible.</li></ul></div>
            </aside>
          </div>
        </section>

        <section className="roleSection">
          <div className="sectionHeading"><div><span className="sectionKicker">Role-based orientation</span><h2>Begin from responsibility, not prestige.</h2></div><p>Roles change what evidence, authority, boundaries, and competencies matter. Select a role to inspect its recommended pathway.</p></div>
          <div className="roleGrid">{roleRecommendations.map((role) => <button key={role.title} type="button" onClick={() => { setSelectedTrack(role.track); document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" }); }}><span>{role.title.slice(0,2).toUpperCase()}</span><div><strong>{role.title}</strong><p>{role.description}</p><small>Recommended: {pathwayTracks.find((track) => track.id === role.track)?.title}</small></div><b>→</b></button>)}</div>
        </section>

        <section className="competencySection">
          <div className="sectionHeading light"><div><span className="sectionKicker">Competency framework</span><h2>Twelve capabilities connect learning to governed execution.</h2></div><p>Competency is demonstrated in context. It is never inferred from attendance, title, confidence, or time spent inside the Academy.</p></div>
          <div className="competencyGrid">{competencyFramework.map((item) => <article key={item.code}><span>{item.code}</span><h3>{item.title}</h3><p>{item.description}</p><Link href="/academy/assessment">View assessment connection →</Link></article>)}</div>
        </section>

        <section className="rulesSection">
          <div className="sectionHeading"><div><span className="sectionKicker">Progression rules</span><h2>The Academy advances learners without governance shortcuts.</h2></div><p>Every progression event remains bounded by the evidence and authority actually present.</p></div>
          <div className="rulesList">{progressionRules.map((rule) => <article key={rule.number}><span>{rule.number}</span><div><h3>{rule.title}</h3><p>{rule.body}</p></div></article>)}</div>
        </section>

        <section className="connectionSection">
          <div className="connectionIntro"><span className="sectionKicker">Connected Academy system</span><h2>A pathway is not a dead-end course list.</h2><p>Learning connects to construction, simulation, review, assessment, credentials, and the authoritative Registry without duplicating those institutions.</p></div>
          <div className="connectionMap">
            <Link href="/academy/architecture-explorer"><span>01</span><div><strong>Architecture Explorer</strong><p>Inspect the governing movement before building.</p></div><b>↗</b></Link>
            <Link href="/academy/route-construction-lab"><span>02</span><div><strong>Route Construction Lab</strong><p>Turn bounded questions into an inspectable route.</p></div><b>↗</b></Link>
            <Link href="/academy/simulator"><span>03</span><div><strong>Simulation Center</strong><p>Test conditions and locate earliest failure.</p></div><b>↗</b></Link>
            <Link href="/academy/review"><span>04</span><div><strong>Review Workspace</strong><p>Challenge evidence, authority, continuity, and findings.</p></div><b>↗</b></Link>
            <Link href="/academy/assessment"><span>05</span><div><strong>Assessment Center</strong><p>Prove capability under observed conditions.</p></div><b>↗</b></Link>
            <Link href="/academy/credential-dashboard"><span>06</span><div><strong>Credential Dashboard</strong><p>Track recommendations, scope, status, and renewal.</p></div><b>↗</b></Link>
            <Link href="/academy/credential-registry"><span>07</span><div><strong>Credential Registry</strong><p>Verify authorized credential events.</p></div><b>↗</b></Link>
            <Link href="/academy/mission-control"><span>08</span><div><strong>Mission Control</strong><p>Resume learning and inspect current obligations.</p></div><b>↗</b></Link>
          </div>
        </section>

        <section className="finalCta">
          <div><span className="sectionKicker">Enter with a clear next step</span><h2>Learn the architecture. Practice the route. Prove the competency.</h2><p>The Academy may explain, guide, challenge, and preserve. It may never fabricate evidence, invent authority, erase uncertainty, or silently select a favorable determination.</p></div>
          <div><Link href="/academy/start" className="primaryAction">Find my pathway <span>→</span></Link><Link href="/academy/mission-control" className="secondaryAction">Open Mission Control</Link></div>
        </section>

        <footer className="academyFooter"><div><strong>TA-14 Academy</strong><span>Seventh major door of the TA-14 AI Governance Exchange</span></div><p>No admissible evidence. No admissible execution.</p></footer>
      </section>

      <style jsx>{`
        :global(*) {
          box-sizing: border-box;
        }
        :global(html) {
          scroll-behavior: smooth;
        }
        :global(body) {
          margin: 0;
          background: #05070b;
          color: #f4f7fb;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        :global(a) {
          color: inherit;
          text-decoration: none;
        }
        :global(button), :global(input), :global(textarea) {
          font: inherit;
        }
        .academyPathways {
          min-height: 100vh;
          background: radial-gradient(circle at 78% 4%, rgba(54, 112, 255, .14), transparent 31rem), radial-gradient(circle at 12% 60%, rgba(39, 215, 174, .07), transparent 30rem), #07090e;
        }
        .academyRail {
          position: fixed;
          inset: 0 auto 0 0;
          width: 286px;
          padding: 22px 18px;
          overflow-y: auto;
          border-right: 1px solid rgba(255,255,255,.09);
          background: rgba(7,9,14,.96);
          backdrop-filter: blur(24px);
          z-index: 40;
        }
        .railIdentity {
          display: flex;
          align-items: center;
          gap: 13px;
          padding: 0 3px 20px;
          border-bottom: 1px solid rgba(255,255,255,.08);
        }
        .railMark {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          position: relative;
          border: 1px solid rgba(255,255,255,.17);
          border-radius: 14px;
          background: linear-gradient(145deg, rgba(255,255,255,.11), rgba(255,255,255,.03));
        }
        .railMark span {
          font-size: 11px;
          letter-spacing: .12em;
          transform: translateY(-6px);
        }
        .railMark strong {
          position: absolute;
          font-size: 18px;
          transform: translateY(7px);
          color: #7da2ff;
        }
        .railIdentity p {
          margin: 0 0 3px;
          font-size: 14px;
          font-weight: 780;
        }
        .railIdentity small {
          color: #818a9c;
          font-size: 11px;
        }
        .railPrimaryCard {
          margin: 18px 0;
          padding: 17px;
          border: 1px solid rgba(110,150,255,.28);
          border-radius: 18px;
          background: linear-gradient(145deg, rgba(42,80,180,.28), rgba(13,18,29,.74));
          box-shadow: 0 16px 38px rgba(0,0,0,.22);
        }
        .railEyebrow {
          display: block;
          color: #8daaff;
          font-size: 9px;
          letter-spacing: .16em;
          text-transform: uppercase;
          font-weight: 800;
        }
        .railPrimaryCard strong {
          display: block;
          margin-top: 10px;
          font-size: 17px;
          line-height: 1.22;
        }
        .railPrimaryCard p {
          margin: 8px 0 14px;
          color: #a7afbd;
          font-size: 11px;
          line-height: 1.55;
        }
        .railPrimaryCard a {
          min-height: 40px;
          padding: 0 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: 11px;
          color: #07101d;
          background: #eff4ff;
          font-size: 11px;
          font-weight: 850;
        }
        .railNavigation {
          display: grid;
          gap: 5px;
        }
        .railNavigation > a {
          min-height: 50px;
          padding: 8px 10px;
          display: grid;
          grid-template-columns: 35px 1fr 16px;
          align-items: center;
          gap: 9px;
          border: 1px solid transparent;
          border-radius: 12px;
          color: #b1b8c5;
          transition: .18s ease;
        }
        .railNavigation > a:hover, .railNavigation > a.active {
          color: #fff;
          border-color: rgba(112,151,255,.26);
          background: rgba(92,126,215,.12);
        }
        .railGlyph {
          width: 31px;
          height: 31px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255,255,255,.10);
          border-radius: 9px;
          color: #91aaf0;
          font-size: 9px;
          font-weight: 850;
        }
        .railLabel {
          display: grid;
          gap: 2px;
        }
        .railLabel strong {
          font-size: 11px;
          font-weight: 730;
        }
        .railLabel small {
          color: #687183;
          font-size: 9px;
        }
        .railArrow {
          color: #596274;
        }
        .railPrinciple {
          margin-top: 18px;
          padding: 16px 12px 5px;
          border-top: 1px solid rgba(255,255,255,.08);
        }
        .railPrinciple small {
          display: block;
          color: #667084;
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: .14em;
        }
        .railPrinciple strong {
          display: block;
          margin-top: 8px;
          color: #cbd3e2;
          font-size: 11px;
          line-height: 1.5;
        }
        .mobileRailButton {
          display: none;
        }
        .pathwaysCanvas {
          margin-left: 286px;
          min-width: 0;
        }
        .topBar {
          height: 78px;
          padding: 0 clamp(24px, 4vw, 70px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255,255,255,.08);
          background: rgba(7,9,14,.72);
          backdrop-filter: blur(18px);
          position: sticky;
          top: 0;
          z-index: 25;
        }
        .topBar > div:first-child {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .doorNumber {
          width: 37px;
          height: 37px;
          display: grid;
          place-items: center;
          border-radius: 11px;
          color: #9bb2ff;
          border: 1px solid rgba(130,158,255,.25);
          font-size: 11px;
          font-weight: 850;
        }
        .topBar p {
          margin: 0;
          font-size: 12px;
          font-weight: 800;
        }
        .topBar small {
          color: #737d90;
          font-size: 10px;
        }
        .topActions {
          display: flex;
          gap: 9px;
        }
        .topActions a {
          min-height: 38px;
          padding: 0 14px;
          display: inline-flex;
          align-items: center;
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 10px;
          font-size: 10px;
          font-weight: 760;
        }
        .topActions a.filled {
          color: #07101d;
          background: #edf3ff;
        }
        .heroSection {
          min-height: 700px;
          padding: clamp(70px, 9vw, 130px) clamp(28px, 6vw, 96px);
          display: grid;
          grid-template-columns: minmax(0,1.2fr) minmax(350px,.8fr);
          gap: clamp(45px, 7vw, 110px);
          align-items: center;
          border-bottom: 1px solid rgba(255,255,255,.08);
          position: relative;
          overflow: hidden;
        }
        .heroSection:before {
          content: "";
          position: absolute;
          width: 550px;
          height: 550px;
          right: -160px;
          top: -180px;
          border: 1px solid rgba(120,150,255,.12);
          border-radius: 50%;
          box-shadow: 0 0 0 70px rgba(110,145,255,.025), 0 0 0 140px rgba(110,145,255,.018);
        }
        .sectionKicker {
          display: inline-block;
          color: #85a6ff;
          font-size: 10px;
          font-weight: 860;
          letter-spacing: .2em;
          text-transform: uppercase;
        }
        .heroCopy h1 {
          max-width: 850px;
          margin: 21px 0 24px;
          font-size: clamp(48px, 6vw, 88px);
          line-height: .96;
          letter-spacing: -.055em;
        }
        .heroCopy h1 em {
          color: #8da8ef;
          font-style: normal;
          font-weight: 520;
        }
        .heroCopy > p {
          max-width: 760px;
          margin: 0;
          color: #a7afbd;
          font-size: clamp(15px,1.5vw,19px);
          line-height: 1.72;
        }
        .heroActions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 34px;
        }
        .primaryAction, .secondaryAction {
          min-height: 52px;
          padding: 0 20px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          border-radius: 13px;
          font-size: 12px;
          font-weight: 820;
        }
        .primaryAction {
          color: #07101d;
          background: #f1f5ff;
        }
        .secondaryAction {
          border: 1px solid rgba(255,255,255,.16);
          color: #d8deea;
        }
        .heroPrinciples {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          margin-top: 28px;
        }
        .heroPrinciples span {
          padding: 9px 11px;
          border: 1px solid rgba(255,255,255,.09);
          border-radius: 999px;
          color: #7f899a;
          font-size: 9px;
        }
        .heroDashboard {
          position: relative;
          padding: 28px;
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 28px;
          background: linear-gradient(155deg, rgba(29,40,66,.72), rgba(10,13,21,.9));
          box-shadow: 0 35px 80px rgba(0,0,0,.36);
        }
        .heroDashboardHead {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .heroDashboardHead span {
          color: #8490a4;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: .15em;
        }
        .heroDashboardHead strong {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          color: #94acff;
          background: rgba(120,150,255,.12);
        }
        .heroDashboard h2 {
          margin: 30px 0 12px;
          font-size: clamp(28px,3vw,42px);
          line-height: 1.02;
          letter-spacing: -.035em;
        }
        .heroDashboard > p {
          min-height: 74px;
          margin: 0;
          color: #929cad;
          font-size: 12px;
          line-height: 1.65;
        }
        .progressTrack, .miniProgress {
          overflow: hidden;
          height: 5px;
          background: rgba(255,255,255,.08);
          border-radius: 999px;
        }
        .progressTrack {
          margin-top: 28px;
        }
        .progressTrack span, .miniProgress span {
          height: 100%;
          display: block;
          border-radius: inherit;
          background: linear-gradient(90deg,#7396ff,#4ee1b5);
          transition: width .3s ease;
        }
        .progressMeta {
          margin-top: 11px;
          display: flex;
          align-items: baseline;
          justify-content: space-between;
        }
        .progressMeta strong {
          font-size: 22px;
        }
        .progressMeta span {
          color: #788397;
          font-size: 9px;
        }
        .heroStats {
          margin-top: 28px;
          padding-top: 22px;
          display: grid;
          grid-template-columns: repeat(3,1fr);
          gap: 10px;
          border-top: 1px solid rgba(255,255,255,.08);
        }
        .heroStats div {
          display: grid;
          gap: 5px;
        }
        .heroStats strong {
          font-size: 21px;
        }
        .heroStats span {
          color: #707b8f;
          font-size: 8px;
          line-height: 1.35;
        }
        .orientationStrip {
          display: grid;
          grid-template-columns: repeat(5,1fr);
          border-bottom: 1px solid rgba(255,255,255,.08);
        }
        .orientationStrip > div {
          min-height: 180px;
          padding: 30px 24px;
          border-right: 1px solid rgba(255,255,255,.08);
        }
        .orientationStrip > div:last-child {
          border-right: 0;
        }
        .orientationStrip span {
          color: #7189cf;
          font-size: 10px;
          font-weight: 850;
        }
        .orientationStrip strong {
          display: block;
          margin-top: 30px;
          font-size: 18px;
        }
        .orientationStrip p {
          margin: 9px 0 0;
          color: #788294;
          font-size: 10px;
          line-height: 1.5;
        }
        .catalogSection, .roleSection, .rulesSection, .connectionSection {
          padding: clamp(72px,8vw,125px) clamp(28px,6vw,96px);
          border-bottom: 1px solid rgba(255,255,255,.08);
        }
        .sectionHeading {
          display: grid;
          grid-template-columns: minmax(0,1.2fr) minmax(280px,.65fr);
          gap: 60px;
          align-items: end;
          margin-bottom: 46px;
        }
        .sectionHeading h2 {
          max-width: 800px;
          margin: 15px 0 0;
          font-size: clamp(34px,4.2vw,62px);
          line-height: 1.02;
          letter-spacing: -.045em;
        }
        .sectionHeading > p {
          margin: 0;
          color: #8791a3;
          font-size: 12px;
          line-height: 1.72;
        }
        .catalogControls {
          padding: 16px;
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 20px;
          border: 1px solid rgba(255,255,255,.09);
          border-radius: 18px;
          background: rgba(255,255,255,.025);
        }
        .searchField {
          width: min(390px,100%);
          display: grid;
          gap: 7px;
        }
        .searchField span {
          color: #697487;
          font-size: 8px;
          text-transform: uppercase;
          letter-spacing: .14em;
        }
        .searchField input {
          width: 100%;
          min-height: 42px;
          padding: 0 13px;
          color: #fff;
          border: 1px solid rgba(255,255,255,.11);
          border-radius: 10px;
          background: #0a0e16;
          outline: none;
        }
        .filterGroup {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          justify-content: flex-end;
        }
        .filterGroup button {
          min-height: 34px;
          padding: 0 11px;
          color: #8d97a8;
          border: 1px solid rgba(255,255,255,.09);
          border-radius: 9px;
          background: transparent;
          cursor: pointer;
          font-size: 9px;
        }
        .filterGroup button.active {
          color: #07101d;
          background: #eaf0ff;
        }
        .pathwayGrid {
          margin-top: 24px;
          display: grid;
          grid-template-columns: repeat(2,minmax(0,1fr));
          gap: 16px;
        }
        .pathwayCard {
          min-height: 360px;
          padding: 25px;
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(255,255,255,.09);
          border-radius: 22px;
          background: rgba(255,255,255,.025);
          transition: .2s ease;
        }
        .pathwayCard:hover, .pathwayCard.selected {
          border-color: rgba(116,151,255,.36);
          transform: translateY(-2px);
          background: linear-gradient(145deg,rgba(61,91,167,.15),rgba(255,255,255,.025));
        }
        .pathwayCardTop {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .pathwayCardTop > span {
          color: #7292e8;
          font-size: 12px;
          font-weight: 850;
        }
        .pathwayCardTop button {
          color: #7f899a;
          border: 0;
          background: transparent;
          cursor: pointer;
          font-size: 9px;
        }
        .pathwayTags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 30px;
        }
        .pathwayTags span {
          padding: 6px 8px;
          border: 1px solid rgba(255,255,255,.09);
          border-radius: 999px;
          color: #7e8899;
          font-size: 8px;
        }
        .pathwayCard h3 {
          margin: 24px 0 12px;
          font-size: clamp(24px,2.6vw,36px);
          letter-spacing: -.03em;
        }
        .pathwayCard > p {
          margin: 0;
          color: #8892a3;
          font-size: 11px;
          line-height: 1.68;
        }
        .miniProgress {
          margin-top: auto;
        }
        .pathwayFooter {
          margin-top: 17px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .pathwayFooter button {
          padding: 0;
          color: #d8dfec;
          border: 0;
          background: transparent;
          cursor: pointer;
          font-size: 10px;
          font-weight: 750;
        }
        .pathwayFooter strong {
          color: #8090ad;
          font-size: 10px;
        }
        .workspaceSection {
          padding: clamp(72px,8vw,125px) clamp(28px,6vw,96px);
          background: #0a0d14;
          border-bottom: 1px solid rgba(255,255,255,.08);
        }
        .workspaceHeader {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 35px;
          margin-bottom: 38px;
        }
        .workspaceHeader h2 {
          margin: 13px 0 9px;
          font-size: clamp(36px,4.5vw,64px);
          letter-spacing: -.045em;
        }
        .workspaceHeader p {
          max-width: 740px;
          margin: 0;
          color: #8791a3;
          font-size: 12px;
          line-height: 1.65;
        }
        .workspaceHeaderActions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .workspaceHeaderActions button, .workspaceHeaderActions a {
          min-height: 39px;
          padding: 0 13px;
          display: inline-flex;
          align-items: center;
          color: #d6ddea;
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 10px;
          background: transparent;
          cursor: pointer;
          font-size: 9px;
        }
        .workspaceGrid {
          display: grid;
          grid-template-columns: minmax(0,1fr) 340px;
          gap: 18px;
          align-items: start;
        }
        .moduleTimeline {
          display: grid;
          gap: 9px;
        }
        .moduleTimeline article {
          min-height: 118px;
          padding: 18px;
          display: grid;
          grid-template-columns: 44px minmax(0,1fr) auto;
          gap: 15px;
          align-items: center;
          border: 1px solid rgba(255,255,255,.09);
          border-radius: 16px;
          background: rgba(255,255,255,.025);
        }
        .moduleTimeline article.complete {
          border-color: rgba(68,215,170,.22);
          background: rgba(52,190,149,.045);
        }
        .moduleCheck {
          width: 42px;
          height: 42px;
          border: 1px solid rgba(255,255,255,.13);
          border-radius: 12px;
          color: #90a8ee;
          background: rgba(255,255,255,.035);
          cursor: pointer;
          font-size: 10px;
          font-weight: 850;
        }
        .complete .moduleCheck {
          color: #06130f;
          background: #63dfb7;
        }
        .moduleBody > div {
          display: flex;
          gap: 14px;
          color: #707b8e;
          font-size: 8px;
          text-transform: uppercase;
          letter-spacing: .12em;
        }
        .moduleBody h3 {
          margin: 8px 0 5px;
          font-size: 17px;
        }
        .moduleBody p {
          margin: 0;
          color: #7f899b;
          font-size: 10px;
        }
        .moduleTimeline article > a {
          color: #a8b9eb;
          font-size: 9px;
          font-weight: 800;
        }
        .pathwayInspector {
          display: grid;
          gap: 10px;
          position: sticky;
          top: 96px;
        }
        .inspectorCard {
          padding: 20px;
          border: 1px solid rgba(255,255,255,.09);
          border-radius: 17px;
          background: rgba(255,255,255,.025);
        }
        .inspectorKicker {
          display: block;
          color: #727e91;
          font-size: 8px;
          text-transform: uppercase;
          letter-spacing: .15em;
        }
        .inspectorCard > strong {
          display: inline-block;
          margin-top: 13px;
          padding: 7px 9px;
          border-radius: 8px;
          font-size: 9px;
          letter-spacing: .08em;
        }
        .inspectorCard > strong.hold {
          color: #f0c77b;
          background: rgba(235,166,50,.11);
        }
        .inspectorCard > strong.allow {
          color: #75e1bb;
          background: rgba(57,211,163,.1);
        }
        .inspectorCard p, .inspectorCard li {
          color: #8993a4;
          font-size: 10px;
          line-height: 1.6;
        }
        .inspectorCard ul {
          padding-left: 17px;
          margin: 12px 0 0;
        }
        .inspectorCard textarea {
          width: 100%;
          min-height: 130px;
          margin-top: 13px;
          padding: 12px;
          resize: vertical;
          color: #e8edf6;
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 11px;
          background: #070a10;
          outline: none;
          font-size: 10px;
          line-height: 1.55;
        }
        .inspectorCard small {
          display: block;
          margin-top: 8px;
          color: #5f697b;
          font-size: 8px;
          line-height: 1.45;
        }
        .divider {
          display: block;
          height: 1px;
          margin: 17px 0;
          background: rgba(255,255,255,.08);
        }
        .roleGrid {
          display: grid;
          grid-template-columns: repeat(3,minmax(0,1fr));
          gap: 10px;
        }
        .roleGrid button {
          min-height: 154px;
          padding: 18px;
          display: grid;
          grid-template-columns: 38px 1fr 16px;
          gap: 12px;
          text-align: left;
          color: #eef2f8;
          border: 1px solid rgba(255,255,255,.09);
          border-radius: 16px;
          background: rgba(255,255,255,.02);
          cursor: pointer;
        }
        .roleGrid button:hover {
          border-color: rgba(122,156,255,.3);
          background: rgba(100,135,225,.07);
        }
        .roleGrid button > span {
          width: 36px;
          height: 36px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          color: #91a9ef;
          background: rgba(124,154,255,.09);
          font-size: 9px;
          font-weight: 850;
        }
        .roleGrid strong {
          font-size: 13px;
        }
        .roleGrid p {
          margin: 8px 0;
          color: #7d8799;
          font-size: 9px;
          line-height: 1.5;
        }
        .roleGrid small {
          color: #667186;
          font-size: 8px;
        }
        .roleGrid b {
          color: #647087;
          align-self: center;
        }
        .competencySection {
          padding: clamp(72px,8vw,125px) clamp(28px,6vw,96px);
          color: #09101b;
          background: #edf2fa;
        }
        .sectionHeading.light .sectionKicker {
          color: #345da9;
        }
        .sectionHeading.light > p {
          color: #596575;
        }
        .competencyGrid {
          display: grid;
          grid-template-columns: repeat(3,minmax(0,1fr));
          border-top: 1px solid rgba(10,20,36,.14);
          border-left: 1px solid rgba(10,20,36,.14);
        }
        .competencyGrid article {
          min-height: 245px;
          padding: 27px;
          display: flex;
          flex-direction: column;
          border-right: 1px solid rgba(10,20,36,.14);
          border-bottom: 1px solid rgba(10,20,36,.14);
        }
        .competencyGrid article > span {
          color: #4265a7;
          font-size: 9px;
          font-weight: 850;
        }
        .competencyGrid h3 {
          margin: 34px 0 10px;
          font-size: 20px;
        }
        .competencyGrid p {
          margin: 0;
          color: #5e6876;
          font-size: 10px;
          line-height: 1.62;
        }
        .competencyGrid a {
          margin-top: auto;
          color: #284e91;
          font-size: 9px;
          font-weight: 800;
        }
        .rulesList {
          display: grid;
          grid-template-columns: repeat(2,minmax(0,1fr));
          gap: 10px;
        }
        .rulesList article {
          min-height: 170px;
          padding: 24px;
          display: grid;
          grid-template-columns: 50px 1fr;
          gap: 18px;
          border: 1px solid rgba(255,255,255,.09);
          border-radius: 18px;
          background: rgba(255,255,255,.022);
        }
        .rulesList article > span {
          color: #7592e6;
          font-size: 12px;
          font-weight: 850;
        }
        .rulesList h3 {
          margin: 0 0 10px;
          font-size: 18px;
        }
        .rulesList p {
          margin: 0;
          color: #808a9c;
          font-size: 10px;
          line-height: 1.65;
        }
        .connectionSection {
          display: grid;
          grid-template-columns: minmax(280px,.65fr) minmax(0,1.35fr);
          gap: clamp(40px,7vw,100px);
        }
        .connectionIntro {
          position: sticky;
          top: 110px;
          align-self: start;
        }
        .connectionIntro h2 {
          margin: 16px 0;
          font-size: clamp(34px,4vw,56px);
          line-height: 1.03;
          letter-spacing: -.04em;
        }
        .connectionIntro p {
          color: #8791a3;
          font-size: 11px;
          line-height: 1.7;
        }
        .connectionMap {
          display: grid;
          gap: 9px;
        }
        .connectionMap a {
          min-height: 108px;
          padding: 18px;
          display: grid;
          grid-template-columns: 42px 1fr 20px;
          gap: 15px;
          align-items: center;
          border: 1px solid rgba(255,255,255,.09);
          border-radius: 15px;
          background: rgba(255,255,255,.022);
        }
        .connectionMap a:hover {
          border-color: rgba(119,153,255,.32);
        }
        .connectionMap a > span {
          color: #7795ec;
          font-size: 10px;
          font-weight: 850;
        }
        .connectionMap strong {
          font-size: 15px;
        }
        .connectionMap p {
          margin: 6px 0 0;
          color: #798396;
          font-size: 9px;
          line-height: 1.45;
        }
        .connectionMap b {
          color: #68748a;
        }
        .finalCta {
          padding: clamp(72px,8vw,125px) clamp(28px,6vw,96px);
          display: grid;
          grid-template-columns: minmax(0,1.3fr) auto;
          gap: 50px;
          align-items: end;
          background: radial-gradient(circle at 80% 20%,rgba(87,124,224,.18),transparent 28rem),#0a0d14;
          border-bottom: 1px solid rgba(255,255,255,.08);
        }
        .finalCta h2 {
          max-width: 880px;
          margin: 16px 0;
          font-size: clamp(38px,5vw,70px);
          line-height: .98;
          letter-spacing: -.05em;
        }
        .finalCta p {
          max-width: 760px;
          margin: 0;
          color: #8a94a6;
          font-size: 11px;
          line-height: 1.7;
        }
        .finalCta > div:last-child {
          display: flex;
          flex-direction: column;
          gap: 9px;
          min-width: 220px;
        }
        .academyFooter {
          min-height: 150px;
          padding: 35px clamp(28px,6vw,96px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
        }
        .academyFooter div {
          display: grid;
          gap: 6px;
        }
        .academyFooter strong {
          font-size: 15px;
        }
        .academyFooter span, .academyFooter p {
          color: #606a7b;
          font-size: 9px;
        }
        @media (max-width: 1180px) {
          .academyRail {
            width: 252px;
          }
          .pathwaysCanvas {
            margin-left: 252px;
          }
          .heroSection {
            grid-template-columns: 1fr;
          }
          .heroDashboard {
            max-width: 620px;
          }
          .orientationStrip {
            grid-template-columns: repeat(3,1fr);
          }
          .orientationStrip > div {
            border-bottom: 1px solid rgba(255,255,255,.08);
          }
          .workspaceGrid {
            grid-template-columns: 1fr;
          }
          .pathwayInspector {
            position: static;
            grid-template-columns: repeat(3,1fr);
          }
          .roleGrid, .competencyGrid {
            grid-template-columns: repeat(2,1fr);
          }
          .connectionSection {
            grid-template-columns: 1fr;
          }
          .connectionIntro {
            position: static;
          }
        }
        @media (max-width: 860px) {
          .mobileRailButton {
            position: fixed;
            left: 14px;
            bottom: 14px;
            z-index: 70;
            min-height: 46px;
            padding: 0 15px;
            display: flex;
            align-items: center;
            gap: 9px;
            color: #07101d;
            border: 0;
            border-radius: 13px;
            background: #f0f4ff;
            box-shadow: 0 14px 40px rgba(0,0,0,.35);
            font-size: 10px;
            font-weight: 830;
          }
          .mobileRailButton span {
            width: 26px;
            height: 26px;
            display: grid;
            place-items: center;
            color: #fff;
            border-radius: 8px;
            background: #192a50;
            font-size: 8px;
          }
          .academyRail {
            width: min(330px,calc(100vw - 30px));
            transform: translateX(-105%);
            transition: transform .25s ease;
            box-shadow: 20px 0 70px rgba(0,0,0,.55);
          }
          .academyRail.isOpen {
            transform: translateX(0);
          }
          .pathwaysCanvas {
            margin-left: 0;
          }
          .topBar {
            padding: 0 18px;
          }
          .topActions a:first-child {
            display: none;
          }
          .heroSection {
            padding-top: 80px;
          }
          .orientationStrip {
            grid-template-columns: 1fr 1fr;
          }
          .sectionHeading, .finalCta {
            grid-template-columns: 1fr;
          }
          .catalogControls {
            align-items: stretch;
            flex-direction: column;
          }
          .searchField {
            width: 100%;
          }
          .filterGroup {
            justify-content: flex-start;
          }
          .workspaceHeader {
            align-items: flex-start;
            flex-direction: column;
          }
          .pathwayInspector {
            grid-template-columns: 1fr;
          }
          .roleGrid {
            grid-template-columns: 1fr 1fr;
          }
          .academyFooter {
            align-items: flex-start;
            flex-direction: column;
          }
        }
        @media (max-width: 620px) {
          .heroCopy h1 {
            font-size: 46px;
          }
          .heroActions, .heroActions a {
            width: 100%;
          }
          .heroDashboard {
            padding: 21px;
          }
          .heroStats {
            grid-template-columns: 1fr;
          }
          .orientationStrip, .pathwayGrid, .roleGrid, .competencyGrid, .rulesList {
            grid-template-columns: 1fr;
          }
          .orientationStrip > div {
            min-height: 140px;
          }
          .moduleTimeline article {
            grid-template-columns: 40px 1fr;
          }
          .moduleTimeline article > a {
            grid-column: 2;
          }
          .connectionMap a {
            grid-template-columns: 34px 1fr;
          }
          .connectionMap b {
            display: none;
          }
          .topActions a {
            padding: 0 10px;
          }
          .academyFooter {
            padding-bottom: 95px;
          }
        }
      `}</style>
    </main>
  );
}
