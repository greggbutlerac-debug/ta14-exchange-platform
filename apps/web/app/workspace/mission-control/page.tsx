"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

type Priority = "critical" | "high" | "standard" | "watch";
type ActionState = "open" | "in_progress" | "blocked" | "satisfied";
type WorkState = "draft" | "intake" | "under_review" | "held" | "published" | "verified";
type DivisionKey = "ai" | "academy" | "environment" | "research" | "standards" | "law";

type InstitutionalAction = {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  state: ActionState;
  basis: string;
  due: string;
  blockingEffect: string;
  recordId: string;
  href: string;
  division: DivisionKey;
};

type ActiveWork = {
  id: string;
  title: string;
  type: string;
  state: WorkState;
  progress: number;
  nextAction: string;
  owner: string;
  updated: string;
  href: string;
  division: DivisionKey;
};

type InstitutionalEvent = {
  id: string;
  event: string;
  subject: string;
  actor: string;
  time: string;
  tone: "blue" | "cyan" | "gold" | "green" | "red" | "violet";
};

type Division = {
  key: DivisionKey;
  code: string;
  title: string;
  description: string;
  href: string;
  accent: string;
  status: string;
  metric: string;
};

const actions: InstitutionalAction[] = [
  {
    id: "TA14-ACT-000142",
    title: "Supply current authority evidence",
    description:
      "The declared reviewer authority record requires a current appointment or delegation before the demonstration can advance.",
    priority: "critical",
    state: "open",
    basis: "Authority continuity rule AUTH-04",
    due: "Today",
    blockingEffect: "Blocks review assignment",
    recordId: "TA14-REV-000031",
    href: "/workspace/ai-governance/registry",
    division: "ai",
  },
  {
    id: "TA14-ACT-000143",
    title: "Accept Founding Demonstration scope",
    description:
      "Review the current scope version, deliverables, exclusions, public-record boundary, and founding fee waiver authority.",
    priority: "high",
    state: "in_progress",
    basis: "Scope acceptance requirement SCP-02",
    due: "Aug 6",
    blockingEffect: "Blocks institutional intake",
    recordId: "TA14-SCP-000087",
    href: "/workspace/ai-governance/pricing",
    division: "ai",
  },
  {
    id: "TA14-ACT-000144",
    title: "Complete evidence-boundary declaration",
    description:
      "Identify public, controlled, confidential, and excluded evidence before the evidence package can enter admission review.",
    priority: "high",
    state: "open",
    basis: "Evidence admission rule EVD-01",
    due: "Aug 7",
    blockingEffect: "Blocks evidence admission",
    recordId: "TA14-EVD-000119",
    href: "/workspace/upload",
    division: "ai",
  },
  {
    id: "TA14-ACT-000145",
    title: "Verify execution outcome",
    description:
      "The route was executed, but the observed result has not yet been bound to a verified outcome record.",
    priority: "standard",
    state: "open",
    basis: "Outcome correspondence rule OUT-03",
    due: "Aug 9",
    blockingEffect: "Artifact remains outcome-pending",
    recordId: "TA14-OUT-000021",
    href: "/workspace/verify",
    division: "ai",
  },
  {
    id: "TA14-ACT-000146",
    title: "Renew PRN conflict declaration",
    description:
      "Annual conflict and competence declarations must be current before new compensated review assignments are offered.",
    priority: "watch",
    state: "open",
    basis: "PRN annual renewal rule PRN-06",
    due: "Aug 21",
    blockingEffect: "Future assignments may be held",
    recordId: "TA14-PRN-000004",
    href: "/workspace/ai-governance/partner-review-network",
    division: "ai",
  },
];

const activeWork: ActiveWork[] = [
  {
    id: "TA14-DEM-000008",
    title: "Founding Demonstration - Independent Governance Architecture",
    type: "Governed Demonstration",
    state: "intake",
    progress: 42,
    nextAction: "Complete evidence boundary",
    owner: "TA-14 + participating entity",
    updated: "12 minutes ago",
    href: "/workspace/ai-governance/demonstrations",
    division: "ai",
  },
  {
    id: "TA14-ENT-000017",
    title: "Governance Entity Registration",
    type: "Institutional Registration",
    state: "under_review",
    progress: 68,
    nextAction: "Reviewer decision",
    owner: "Registry Review",
    updated: "1 hour ago",
    href: "/workspace/ai-governance/registry",
    division: "ai",
  },
  {
    id: "TA14-EA-000012",
    title: "Controlled Execution Artifact",
    type: "Execution Artifact",
    state: "draft",
    progress: 56,
    nextAction: "Bind outcome evidence",
    owner: "Artifact Steward",
    updated: "3 hours ago",
    href: "/workspace/records",
    division: "ai",
  },
  {
    id: "TA14-ACD-000006",
    title: "Reviewer Boundary Orientation",
    type: "Academy Authorization",
    state: "verified",
    progress: 100,
    nextAction: "Credential available",
    owner: "TA-14 Academy",
    updated: "Yesterday",
    href: "/academy",
    division: "academy",
  },
  {
    id: "TA14-AIR-000003",
    title: "Building Atmospheric Integrity Record",
    type: "Environmental Record",
    state: "held",
    progress: 35,
    nextAction: "Supply sensor continuity evidence",
    owner: "Environmental Integrity",
    updated: "Yesterday",
    href: "/workspace/environmental-records",
    division: "environment",
  },
];

const events: InstitutionalEvent[] = [
  {
    id: "EVT-8112",
    event: "scope.version.accepted",
    subject: "TA14-SCP-000084",
    actor: "Authorized organization representative",
    time: "8 minutes ago",
    tone: "gold",
  },
  {
    id: "EVT-8111",
    event: "evidence.package.submitted",
    subject: "TA14-EVD-000119",
    actor: "Governance entity steward",
    time: "27 minutes ago",
    tone: "cyan",
  },
  {
    id: "EVT-8110",
    event: "registry.review.assigned",
    subject: "TA14-ENT-000017",
    actor: "TA-14 Registry",
    time: "1 hour ago",
    tone: "violet",
  },
  {
    id: "EVT-8109",
    event: "credential.issued",
    subject: "TA14-CRD-000006",
    actor: "TA-14 Academy",
    time: "Yesterday",
    tone: "green",
  },
  {
    id: "EVT-8108",
    event: "artifact.outcome.required",
    subject: "TA14-EA-000012",
    actor: "Artifact integrity service",
    time: "Yesterday",
    tone: "red",
  },
];

const divisions: Division[] = [
  {
    key: "ai",
    code: "AI",
    title: "AI Governance Exchange",
    description:
      "Register governance, construct routes, conduct bounded review, preserve artifacts, and resolve Registry records.",
    href: "/workspace/ai-governance",
    accent: "#59d7ff",
    status: "Operational",
    metric: "8 active records",
  },
  {
    key: "academy",
    code: "AC",
    title: "TA-14 Academy",
    description:
      "Learning, assessment, credentials, accreditation, and bounded authorization for institutional work.",
    href: "/academy",
    accent: "#8d9cff",
    status: "Operational",
    metric: "1 active credential",
  },
  {
    key: "environment",
    code: "EI",
    title: "Environmental Integrity Governance",
    description:
      "Environmental records, AIR, PAIR, building evidence, HVAC pathways, and facility-governance review.",
    href: "/workspace/environmental-records",
    accent: "#64e6b5",
    status: "Operational",
    metric: "1 held record",
  },
  {
    key: "research",
    code: "PR",
    title: "Public Research & Records",
    description:
      "Inspectable research, public evidence corpora, institutional publications, and preserved public records.",
    href: "/workspace/discover",
    accent: "#f2c865",
    status: "Foundation",
    metric: "Public pathway",
  },
  {
    key: "standards",
    code: "ST",
    title: "Standards",
    description:
      "TA-14 and external standards, crosswalks, implementation methods, testing, and conformance pathways.",
    href: "/workspace/ai-governance/library",
    accent: "#d79cff",
    status: "Expanding",
    metric: "Library connected",
  },
  {
    key: "law",
    code: "LW",
    title: "Proposed World Law",
    description:
      "Current law, identified gaps, proposed laws, policy records, comparative analysis, and modernization routes.",
    href: "/workspace/ai-governance/eu-ai-act",
    accent: "#ff8f9d",
    status: "Foundation",
    metric: "Law pathway",
  },
];

const chain = [
  "Reality",
  "Record",
  "Continuity",
  "Admissibility",
  "Binding",
  "Commit",
  "Execution",
  "Outcome",
];

const priorityOrder: Record<Priority, number> = {
  critical: 0,
  high: 1,
  standard: 2,
  watch: 3,
};

function labelForState(state: string) {
  return state.replaceAll("_", " ");
}

export default function MissionControlPage() {
  const [actionFilter, setActionFilter] = useState<"all" | Priority>("all");
  const [divisionFilter, setDivisionFilter] = useState<"all" | DivisionKey>("all");
  const [selectedActionId, setSelectedActionId] = useState(actions[0]?.id ?? "");
  const [compactMode, setCompactMode] = useState(false);
  const [sessionIdentity, setSessionIdentity] = useState<{
    displayName: string;
    email: string;
    organization: string;
    subjectId: string;
    registeredEntityCount: number;
  } | null>(null);
  const [identityResolved, setIdentityResolved] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function resolveSessionIdentity() {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!url || !anonKey) {
        if (!cancelled) setIdentityResolved(true);
        return;
      }

      const supabase = createBrowserClient(url, anonKey);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        if (!cancelled) {
          setSessionIdentity(null);
          setIdentityResolved(true);
        }
        return;
      }

      const [{ data: profile }, { count: registeredEntityCount }] = await Promise.all([
        supabase
          .from("exchange_profiles")
          .select("display_name,organization_name")
          .eq("user_id", user.id)
          .maybeSingle(),
        supabase
          .from("ai_governance_registry_submissions")
          .select("id", { count: "exact", head: true })
          .eq("owner_user_id", user.id)
          .eq("status", "registered"),
      ]);

      const metadataName =
        typeof user.user_metadata?.display_name === "string"
          ? user.user_metadata.display_name.trim()
          : "";
      const email = user.email || "Authenticated account";
      const displayName = profile?.display_name?.trim() || metadataName || email;

      if (!cancelled) {
        setSessionIdentity({
          displayName,
          email,
          organization: profile?.organization_name?.trim() || "Not declared",
          subjectId: user.id,
          registeredEntityCount: registeredEntityCount || 0,
        });
        setIdentityResolved(true);
      }
    }

    void resolveSessionIdentity();

    return () => {
      cancelled = true;
    };
  }, []);

  const identityMonogram = useMemo(() => {
    const source = sessionIdentity?.displayName || "TA-14";
    const parts = source.split(/\s+/).filter(Boolean);
    return parts.slice(0, 2).map((part) => part[0]?.toUpperCase() || "").join("") || "TA";
  }, [sessionIdentity]);

  const filteredActions = useMemo(() => {
    return actions
      .filter((action) => actionFilter === "all" || action.priority === actionFilter)
      .filter((action) => divisionFilter === "all" || action.division === divisionFilter)
      .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  }, [actionFilter, divisionFilter]);

  const filteredWork = useMemo(() => {
    return activeWork.filter(
      (work) => divisionFilter === "all" || work.division === divisionFilter,
    );
  }, [divisionFilter]);

  const selectedAction =
    actions.find((action) => action.id === selectedActionId) ?? actions[0];

  const openActionCount = actions.filter((action) => action.state !== "satisfied").length;
  const criticalCount = actions.filter((action) => action.priority === "critical").length;
  const activeRecordCount = activeWork.length;
  const verifiedCount = activeWork.filter((work) => work.state === "verified").length;

  const missionControlAdminEmails = new Set(
    (process.env.NEXT_PUBLIC_TA14_MISSION_CONTROL_ADMIN_EMAILS ||
      "ta14admissibleexecution@gmail.com")
      .split(",")
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean),
  );

  const isInstitutionAdmin = Boolean(
    sessionIdentity?.email &&
      missionControlAdminEmails.has(sessionIdentity.email.trim().toLowerCase()),
  );

  if (!identityResolved) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#030712",
          color: "#f5f8ff",
          padding: 32,
          fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <p>Resolving authenticated Mission Control access…</p>
      </main>
    );
  }

  if (!isInstitutionAdmin) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#030712",
          color: "#f5f8ff",
          padding: "48px 24px",
          fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <section
          style={{
            maxWidth: 900,
            margin: "0 auto",
            border: "1px solid rgba(124,167,211,.24)",
            borderRadius: 20,
            padding: 28,
            background: "rgba(9,18,35,.84)",
          }}
        >
          <p style={{ color: "#4dd1ff", fontWeight: 800, letterSpacing: ".08em" }}>
            PARTICIPANT WORKSPACE
          </p>
          <h1 style={{ margin: "8px 0 12px" }}>Your TA-14 account</h1>
          <p style={{ color: "#9fb0c5", lineHeight: 1.7 }}>
            {sessionIdentity?.displayName || sessionIdentity?.email || "Authenticated participant"}
          </p>
          <p style={{ color: "#9fb0c5", lineHeight: 1.7 }}>
            Institutional Mission Control contains TA-14 internal actions, commercial scopes,
            credentials, authority records, and institution-level operating state. Those records
            are not attributed to participant accounts and are not displayed in this workspace.
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              marginTop: 24,
            }}
          >
            <Link
              href="/workspace/ai-governance/registry/my-records"
              style={{
                color: "#03101c",
                background: "#4dd1ff",
                padding: "12px 16px",
                borderRadius: 10,
                textDecoration: "none",
                fontWeight: 800,
              }}
            >
              Open My Registry Records →
            </Link>
            <Link
              href="/workspace/ai-governance/registry/register"
              style={{
                color: "#f5f8ff",
                border: "1px solid rgba(124,167,211,.3)",
                padding: "12px 16px",
                borderRadius: 10,
                textDecoration: "none",
                fontWeight: 800,
              }}
            >
              Register a governance architecture
            </Link>
            <Link
              href="/workspace/ai-governance/reviews-responses"
              style={{
                color: "#f5f8ff",
                border: "1px solid rgba(124,167,211,.3)",
                padding: "12px 16px",
                borderRadius: 10,
                textDecoration: "none",
                fontWeight: 800,
              }}
            >
              Reviews & Responses
            </Link>
          </div>
          <p style={{ marginTop: 24, color: "#7f93aa", fontSize: 13 }}>
            Access boundary: institutional records are not inferred from authentication alone.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className={`missionControl ${compactMode ? "compact" : ""}`}>
      <div className="gridField" />
      <div className="ambient ambientBlue" />
      <div className="ambient ambientGold" />
      <div className="ambient ambientCyan" />

      <header className="commandHeader">
        <div className="commandBrand">
          <div className="brandSeal">
            <span>TA</span>
            <strong>14</strong>
          </div>
          <div>
            <small>TA-14 AUTHORITY GOVERNANCE INSTITUTION</small>
            <h1>Institutional Mission Control</h1>
          </div>
        </div>

        <div className="commandActions">
          <Link href="/workspace/ai-governance" className="headerLink">
            AI Governance
          </Link>
          <Link href="/workspace/ai-governance/registry" className="headerLink">
            Registry
          </Link>
          <button
            type="button"
            className="viewButton"
            onClick={() => setCompactMode((current) => !current)}
          >
            {compactMode ? "Expanded view" : "Compact view"}
          </button>
          <Link href="/" className="headerPrimary">
            Return to Institution →
          </Link>
        </div>
      </header>

      <section className="institutionBar">
        <div className="identityBlock">
          <span className="liveDot" />
          <div>
            <small>AUTHENTICATED INSTITUTIONAL CONTEXT</small>
            <strong>Governance founder · Institutional administrator · Registry reviewer</strong>
          </div>
        </div>

        <div className="authorityPills">
          <span>Authority: active</span>
          <span>Visibility: controlled</span>
          <span>Projection: current</span>
        </div>
      </section>

      <section className="heroSection">
        <div className="heroCopy">
          <p className="eyebrow">GOVERNANCE OF GOVERNANCE</p>
          <h2>
            See the institution.
            <span> Act on what matters next.</span>
          </h2>
          <p className="heroLead">
            Mission Control unifies institutional identity, active work, required
            actions, records, authority, commercial scopes, Academy credentials,
            and continuity into one operating view. Every status resolves to a
            real record. Every action states its basis, owner, completion
            condition, and consequence of inaction.
          </p>

          <div className="heroActions">
            <a href="#requires-action" className="primaryAction">
              Resolve Required Actions →
            </a>
            <Link href="/workspace/ai-governance/registry" className="secondaryAction">
              Search Institutional Records
            </Link>
            <Link href="/workspace/ai-governance/pricing" className="goldAction">
              Open Governance Pathways
            </Link>
          </div>
        </div>

        <div className="heroStatus">
          <div className="statusHeader">
            <div>
              <small>INSTITUTIONAL STATE</small>
              <strong>Operational · Attention required</strong>
            </div>
            <span className="stateBadge">LIVE</span>
          </div>

          <div className="statusMetrics">
            <article>
              <span>{openActionCount}</span>
              <small>Open actions</small>
            </article>
            <article>
              <span>{criticalCount}</span>
              <small>Critical blocker</small>
            </article>
            <article>
              <span>{activeRecordCount}</span>
              <small>Active work records</small>
            </article>
            <article>
              <span>{verifiedCount}</span>
              <small>Verified authorization</small>
            </article>
          </div>

          <div className="currentFocus">
            <small>CURRENT INSTITUTIONAL FOCUS</small>
            <strong>Founding Demonstrations and external execution artifacts</strong>
            <p>
              Complete scope, evidence, authority, review, artifact, publication,
              and continuity records for the first external institutional cases.
            </p>
          </div>
        </div>
      </section>

      <section className="chainSection" aria-label="TA-14 canonical chain">
        {chain.map((stage, index) => (
          <div className="chainStage" key={stage}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{stage}</strong>
            {index < chain.length - 1 ? <i>→</i> : null}
          </div>
        ))}
      </section>

      <section className="dashboardGrid">
        <aside className="identityPanel panel">
          <div className="panelHeading">
            <div>
              <p className="eyebrow">INSTITUTIONAL IDENTITY</p>
              <h3>Who you are here</h3>
            </div>
            <span className="panelState green">ACTIVE</span>
          </div>

          <div className="identityCard">
            <div className="identityMonogram">{identityMonogram}</div>
            <div>
              <strong>
                {!identityResolved
                  ? "Resolving authenticated identity…"
                  : sessionIdentity?.displayName || "No authenticated identity"}
              </strong>
              <span>
                {sessionIdentity?.email ||
                  "Mission Control will not substitute another participant's identity."}
              </span>
            </div>
          </div>

          <dl className="identityList">
            <div>
              <dt>Institutional subject</dt>
              <dd>{sessionIdentity?.subjectId || "Not resolved"}</dd>
            </div>
            <div>
              <dt>Primary organization</dt>
              <dd>{sessionIdentity?.organization || "Not declared"}</dd>
            </div>
            <div>
              <dt>Registered entities</dt>
              <dd>
                {sessionIdentity
                  ? `${sessionIdentity.registeredEntityCount} owned by this account`
                  : "Not available without an authenticated account"}
              </dd>
            </div>
            <div>
              <dt>Current roles</dt>
              <dd>Authenticated participant · no role inferred from static page content</dd>
            </div>
            <div>
              <dt>Identity source</dt>
              <dd>Authenticated Supabase session</dd>
            </div>
          </dl>

          <div className="authorityBoundary">
            <span>AUTHORITY BOUNDARY</span>
            <p>
              Administrative access does not substitute for specialist review,
              external authority, evidence admission, or outcome verification.
            </p>
          </div>

          <div className="panelLinks">
            <Link href="/workspace/entity-review">Open entity workspace →</Link>
            <Link href="/workspace/keys">Review authority keys →</Link>
          </div>
        </aside>

        <section id="requires-action" className="actionsPanel panel">
          <div className="panelHeading wide">
            <div>
              <p className="eyebrow">REQUIRES YOUR ACTION</p>
              <h3>Outstanding institutional obligations</h3>
            </div>
            <span className="panelState gold">{openActionCount} OPEN</span>
          </div>

          <div className="filterRow">
            <div className="filterGroup" aria-label="Action priority filters">
              {(["all", "critical", "high", "standard", "watch"] as const).map(
                (filter) => (
                  <button
                    type="button"
                    key={filter}
                    className={actionFilter === filter ? "active" : ""}
                    onClick={() => setActionFilter(filter)}
                  >
                    {filter === "all" ? "All priorities" : filter}
                  </button>
                ),
              )}
            </div>

            <select
              aria-label="Filter by institutional division"
              value={divisionFilter}
              onChange={(event) =>
                setDivisionFilter(event.target.value as "all" | DivisionKey)
              }
            >
              <option value="all">All divisions</option>
              <option value="ai">AI Governance</option>
              <option value="academy">Academy</option>
              <option value="environment">Environmental Integrity</option>
              <option value="research">Public Research</option>
              <option value="standards">Standards</option>
              <option value="law">Proposed World Law</option>
            </select>
          </div>

          <div className="actionWorkspace">
            <div className="actionList">
              {filteredActions.length ? (
                filteredActions.map((action) => (
                  <button
                    type="button"
                    key={action.id}
                    className={`actionCard ${action.priority} ${
                      selectedAction?.id === action.id ? "selected" : ""
                    }`}
                    onClick={() => setSelectedActionId(action.id)}
                  >
                    <span className="priorityRail" />
                    <div className="actionTopline">
                      <span className={`priorityBadge ${action.priority}`}>
                        {action.priority}
                      </span>
                      <small>{action.due}</small>
                    </div>
                    <strong>{action.title}</strong>
                    <p>{action.description}</p>
                    <div className="actionMeta">
                      <span>{action.id}</span>
                      <span>{action.recordId}</span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="emptyState">
                  <strong>No actions match this view.</strong>
                  <p>
                    This does not mean the institution has no open work. Change the
                    priority or division filter to review other obligations.
                  </p>
                </div>
              )}
            </div>

            {selectedAction ? (
              <div className="actionDetail">
                <div className="detailHeader">
                  <div>
                    <small>SELECTED ACTION</small>
                    <strong>{selectedAction.id}</strong>
                  </div>
                  <span className={`priorityBadge ${selectedAction.priority}`}>
                    {selectedAction.priority}
                  </span>
                </div>

                <h4>{selectedAction.title}</h4>
                <p className="detailDescription">{selectedAction.description}</p>

                <dl className="detailGrid">
                  <div>
                    <dt>Institutional basis</dt>
                    <dd>{selectedAction.basis}</dd>
                  </div>
                  <div>
                    <dt>Linked record</dt>
                    <dd>{selectedAction.recordId}</dd>
                  </div>
                  <div>
                    <dt>Current state</dt>
                    <dd>{labelForState(selectedAction.state)}</dd>
                  </div>
                  <div>
                    <dt>Due condition</dt>
                    <dd>{selectedAction.due}</dd>
                  </div>
                  <div className="full">
                    <dt>Consequence of inaction</dt>
                    <dd>{selectedAction.blockingEffect}</dd>
                  </div>
                </dl>

                <div className="completionStandard">
                  <span>COMPLETION STANDARD</span>
                  <p>
                    The required record must be supplied, attributed, current,
                    permitted within the visibility boundary, and accepted by the
                    authoritative service before the blocking state is removed.
                  </p>
                </div>

                <Link href={selectedAction.href} className="detailAction">
                  Open required institutional action →
                </Link>
              </div>
            ) : null}
          </div>
        </section>
      </section>

      <section className="activeWorkSection panel">
        <div className="panelHeading wide">
          <div>
            <p className="eyebrow">ACTIVE WORK</p>
            <h3>Current institutional engagements and records</h3>
          </div>
          <Link href="/workspace/history" className="panelTextLink">
            View institutional history →
          </Link>
        </div>

        <div className="workGrid">
          {filteredWork.map((work) => (
            <article className="workCard" key={work.id}>
              <div className="workHeader">
                <span className={`workState ${work.state}`}>
                  {labelForState(work.state)}
                </span>
                <small>{work.updated}</small>
              </div>
              <p className="workType">{work.type}</p>
              <h4>{work.title}</h4>
              <div className="workId">{work.id}</div>

              <div className="progressTrack" aria-label={`${work.progress}% complete`}>
                <span style={{ width: `${work.progress}%` }} />
              </div>
              <div className="progressMeta">
                <span>{work.progress}% routed</span>
                <span>{work.nextAction}</span>
              </div>

              <dl>
                <div>
                  <dt>Responsible party</dt>
                  <dd>{work.owner}</dd>
                </div>
              </dl>

              <Link href={work.href}>Open record →</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="middleGrid">
        <section className="recordGraphPanel panel">
          <div className="panelHeading">
            <div>
              <p className="eyebrow">INSTITUTIONAL RECORD GRAPH</p>
              <h3>One history, connected records</h3>
            </div>
            <span className="panelState blue">CURRENT</span>
          </div>

          <div className="graphCanvas">
            <div className="graphCore">
              <span>TA14-ENT-000017</span>
              <strong>Governance Entity</strong>
              <small>Current institutional subject</small>
            </div>

            {[
              ["Claim", "TA14-CLM-000044", "top left"],
              ["Evidence", "TA14-EVD-000119", "top right"],
              ["Review", "TA14-REV-000031", "middle left"],
              ["Demonstration", "TA14-DEM-000008", "middle right"],
              ["Artifact", "TA14-EA-000012", "bottom left"],
              ["Outcome", "TA14-OUT-000021", "bottom right"],
            ].map(([label, id, position]) => (
              <div className={`graphNode ${position}`} key={id}>
                <strong>{label}</strong>
                <span>{id}</span>
              </div>
            ))}

            <svg className="graphLines" viewBox="0 0 800 480" aria-hidden="true">
              <line x1="400" y1="240" x2="155" y2="92" />
              <line x1="400" y1="240" x2="645" y2="92" />
              <line x1="400" y1="240" x2="140" y2="240" />
              <line x1="400" y1="240" x2="660" y2="240" />
              <line x1="400" y1="240" x2="175" y2="392" />
              <line x1="400" y1="240" x2="625" y2="392" />
            </svg>
          </div>

          <div className="graphLegend">
            <span><i className="cyan" /> supported_by</span>
            <span><i className="blue" /> reviewed_in</span>
            <span><i className="gold" /> demonstrated_by</span>
            <span><i className="green" /> produced / verified_by</span>
          </div>

          <Link href="/workspace/ai-governance/registry" className="wideLink">
            Open universal record view →
          </Link>
        </section>

        <section className="commercialPanel panel">
          <div className="panelHeading">
            <div>
              <p className="eyebrow">COMMERCIAL SCOPES</p>
              <h3>Governed engagement state</h3>
            </div>
            <span className="panelState gold">2 ACTIVE</span>
          </div>

          <article className="scopeCard featured">
            <div className="scopeTopline">
              <span>TA14-SCP-000087</span>
              <strong>AWAITING ACCEPTANCE</strong>
            </div>
            <h4>Founding Demonstration</h4>
            <p>
              Bounded capability demonstration with governed evidence, written
              review route, artifact production, and controlled publication.
            </p>
            <dl>
              <div><dt>Commercial value</dt><dd>$2,495</dd></div>
              <div><dt>Founding waiver</dt><dd>100% · pending authority record</dd></div>
              <div><dt>Publication</dt><dd>Mutually approved</dd></div>
              <div><dt>Fulfillment</dt><dd>Not yet opened</dd></div>
            </dl>
            <Link href="/workspace/ai-governance/pricing">Review and preserve scope →</Link>
          </article>

          <article className="scopeCard">
            <div className="scopeTopline">
              <span>TA14-SCP-000084</span>
              <strong>PAID</strong>
            </div>
            <h4>Preserved Governed Run</h4>
            <p>One attributable route evaluation with evidence references and replay history.</p>
            <dl>
              <div><dt>Amount</dt><dd>$9</dd></div>
              <div><dt>Payment</dt><dd>Captured</dd></div>
              <div><dt>Fulfillment</dt><dd>Route preservation open</dd></div>
            </dl>
            <Link href="/workspace/preservation">Continue fulfillment →</Link>
          </article>

          <div className="commercialBoundary">
            <strong>PAYMENT BOUNDARY</strong>
            <p>
              Payment funds defined work. It never creates approval,
              admissibility, authority, certification, or a favorable determination.
            </p>
          </div>
        </section>

        <section className="academyPanel panel">
          <div className="panelHeading">
            <div>
              <p className="eyebrow">ACADEMY & AUTHORIZATION</p>
              <h3>Competence connected to authority</h3>
            </div>
            <span className="panelState violet">1 ACTIVE</span>
          </div>

          <div className="credentialCard">
            <div className="credentialSeal">AC</div>
            <div>
              <small>TA14-CRD-000006</small>
              <strong>Reviewer Boundary Orientation</strong>
              <span>Active through August 2027</span>
            </div>
          </div>

          <div className="authorizationRoute">
            {[
              "Institutional work",
              "Competence requirement",
              "Academy pathway",
              "Assessment",
              "Credential",
              "Authority grant",
              "Assignment",
            ].map((step, index) => (
              <div key={step}>
                <span>{index + 1}</span>
                <strong>{step}</strong>
              </div>
            ))}
          </div>

          <div className="academyRequirements">
            <article>
              <span className="complete">✓</span>
              <div>
                <strong>Conflict and review-boundary orientation</strong>
                <small>Completed · assignment eligible</small>
              </div>
            </article>
            <article>
              <span>02</span>
              <div>
                <strong>Outcome verification assessment</strong>
                <small>Recommended for artifact verification authority</small>
              </div>
            </article>
          </div>

          <Link href="/academy" className="wideLink">Open TA-14 Academy →</Link>
        </section>
      </section>

      <section className="divisionSection panel">
        <div className="panelHeading wide">
          <div>
            <p className="eyebrow">INSTITUTIONAL DIVISION GATEWAY</p>
            <h3>One operating spine, six autonomous divisions</h3>
          </div>
          <span className="panelState blue">CONNECTED</span>
        </div>

        <div className="divisionGrid">
          {divisions.map((division) => (
            <Link
              href={division.href}
              className="divisionCard"
              key={division.key}
              style={{ "--division-accent": division.accent } as React.CSSProperties}
            >
              <div className="divisionCode">{division.code}</div>
              <div className="divisionCopy">
                <span>{division.status}</span>
                <h4>{division.title}</h4>
                <p>{division.description}</p>
                <small>{division.metric}</small>
              </div>
              <i>→</i>
            </Link>
          ))}
        </div>
      </section>

      <section className="eventsSection panel">
        <div className="panelHeading wide">
          <div>
            <p className="eyebrow">RECENT INSTITUTIONAL EVENTS</p>
            <h3>Append-only operating history</h3>
          </div>
          <Link href="/workspace/history" className="panelTextLink">
            Inspect complete event history →
          </Link>
        </div>

        <div className="eventTable" role="table" aria-label="Recent institutional events">
          <div className="eventRow eventHead" role="row">
            <span>Event</span>
            <span>Subject</span>
            <span>Actor</span>
            <span>Occurred</span>
          </div>
          {events.map((event) => (
            <div className="eventRow" role="row" key={event.id}>
              <span className="eventName">
                <i className={event.tone} />
                <strong>{event.event}</strong>
                <small>{event.id}</small>
              </span>
              <span>{event.subject}</span>
              <span>{event.actor}</span>
              <span>{event.time}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="nextMoveSection">
        <div>
          <p className="eyebrow">RECOMMENDED NEXT MOVE</p>
          <h3>Complete the first external institutional demonstration chain.</h3>
          <p>
            Preserve the participating entity, scope, evidence boundary,
            reviewer appointment, demonstration route, finding, execution artifact,
            publication permission, and continuity obligations as one connected
            institutional history.
          </p>
        </div>
        <div className="nextMoveActions">
          <Link href="/workspace/ai-governance/demonstrations" className="primaryAction">
            Open Founding Demonstrations →
          </Link>
          <Link href="/workspace/ai-governance/registry" className="secondaryAction">
            Review Registry State
          </Link>
        </div>
      </section>

      <footer className="institutionFooter">
        <div>
          <strong>TA-14 Authority Governance Institution</strong>
          <span>No admissible evidence. No admissible execution.</span>
        </div>
        <nav>
          <Link href="/workspace/ai-governance">AI Governance</Link>
          <Link href="/academy">Academy</Link>
          <Link href="/workspace/environmental-records">Environmental Integrity</Link>
          <Link href="/workspace/ai-governance/registry">Registry</Link>
          <Link href="/workspace/ai-governance/pricing">Governance Pathways</Link>
        </nav>
      </footer>

      <style jsx>{`
        .missionControl {
          --bg: #03070d;
          --panel: rgba(8, 16, 27, 0.9);
          --panel-soft: rgba(11, 22, 36, 0.72);
          --line: rgba(151, 178, 209, 0.15);
          --line-strong: rgba(121, 199, 255, 0.28);
          --text: #f5f9ff;
          --muted: #91a5bd;
          --faint: #5f748d;
          --blue: #4dc8ff;
          --cyan: #6be7ef;
          --gold: #f4c667;
          --green: #6ce2ad;
          --red: #ff7e8c;
          --violet: #a99cff;
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          color: var(--text);
          background:
            radial-gradient(circle at 12% 0%, rgba(40, 161, 230, 0.13), transparent 27%),
            radial-gradient(circle at 88% 8%, rgba(244, 198, 103, 0.08), transparent 24%),
            linear-gradient(180deg, #02060c 0%, #06101b 42%, #02060b 100%);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .missionControl * { box-sizing: border-box; }
        .missionControl a { color: inherit; text-decoration: none; }
        .missionControl button,
        .missionControl select { font: inherit; }

        .gridField {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          opacity: 0.19;
          background-image:
            linear-gradient(rgba(255,255,255,0.024) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.024) 1px, transparent 1px);
          background-size: 44px 44px;
          mask-image: linear-gradient(to bottom, #000 0%, rgba(0,0,0,0.72) 55%, transparent 100%);
        }

        .ambient {
          position: fixed;
          z-index: 0;
          width: 380px;
          height: 380px;
          border-radius: 999px;
          filter: blur(100px);
          pointer-events: none;
          opacity: 0.12;
        }
        .ambientBlue { left: -170px; top: 260px; background: #2ea8ff; }
        .ambientGold { right: -190px; top: 520px; background: #f2bf55; }
        .ambientCyan { left: 38%; bottom: -250px; background: #52e6e7; }

        .commandHeader,
        .institutionBar,
        .heroSection,
        .chainSection,
        .dashboardGrid,
        .activeWorkSection,
        .middleGrid,
        .divisionSection,
        .eventsSection,
        .nextMoveSection,
        .institutionFooter {
          position: relative;
          z-index: 2;
        }

        .commandHeader {
          position: sticky;
          top: 0;
          z-index: 80;
          min-height: 82px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding: 14px clamp(18px, 3vw, 46px);
          border-bottom: 1px solid var(--line);
          background: rgba(3, 8, 15, 0.9);
          backdrop-filter: blur(24px);
          box-shadow: 0 18px 45px rgba(0,0,0,0.24);
        }

        .commandBrand,
        .commandActions,
        .identityBlock,
        .authorityPills,
        .heroActions,
        .panelHeading,
        .filterRow,
        .actionTopline,
        .actionMeta,
        .detailHeader,
        .workHeader,
        .progressMeta,
        .scopeTopline,
        .eventName,
        .nextMoveActions,
        .institutionFooter,
        .institutionFooter nav {
          display: flex;
          align-items: center;
        }

        .commandBrand { gap: 14px; min-width: 0; }
        .brandSeal {
          width: 52px;
          height: 52px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          place-items: center;
          flex: 0 0 52px;
          border: 1px solid rgba(93, 210, 255, 0.42);
          border-radius: 16px;
          color: #e9f9ff;
          background: linear-gradient(145deg, rgba(44, 179, 236, 0.25), rgba(5, 13, 24, 0.9));
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.16), 0 14px 32px rgba(22, 162, 226, 0.14);
          font-weight: 900;
          letter-spacing: -0.06em;
        }
        .brandSeal span { font-size: 0.66rem; color: #8adfff; }
        .brandSeal strong { font-size: 1.04rem; }
        .commandBrand small { display: block; color: #7790aa; font-size: 0.64rem; letter-spacing: 0.16em; }
        .commandBrand h1 { margin: 4px 0 0; font-size: 1rem; letter-spacing: 0.01em; }

        .commandActions { gap: 8px; flex-wrap: wrap; justify-content: flex-end; }
        .headerLink,
        .viewButton,
        .headerPrimary {
          min-height: 40px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 13px;
          border-radius: 11px;
          font-size: 0.74rem;
          font-weight: 800;
          transition: 160ms ease;
        }
        .headerLink,
        .viewButton {
          border: 1px solid rgba(255,255,255,0.1);
          color: #c6d5e6;
          background: rgba(255,255,255,0.035);
        }
        .viewButton { cursor: pointer; }
        .headerPrimary {
          border: 1px solid rgba(76, 202, 255, 0.4);
          color: #effbff;
          background: linear-gradient(135deg, rgba(30, 170, 230, 0.26), rgba(32, 102, 173, 0.18));
        }
        .headerLink:hover,
        .viewButton:hover,
        .headerPrimary:hover { transform: translateY(-1px); border-color: rgba(103, 217, 255, 0.5); }

        .institutionBar {
          min-height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 10px clamp(18px, 3vw, 46px);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          background: rgba(4, 11, 20, 0.72);
        }
        .identityBlock { gap: 11px; }
        .liveDot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--green);
          box-shadow: 0 0 0 5px rgba(108,226,173,0.08), 0 0 20px rgba(108,226,173,0.42);
        }
        .identityBlock small { display: block; color: #6f849d; font-size: 0.62rem; letter-spacing: 0.14em; }
        .identityBlock strong { display: block; margin-top: 4px; color: #d9e7f6; font-size: 0.76rem; }
        .authorityPills { gap: 8px; flex-wrap: wrap; justify-content: flex-end; }
        .authorityPills span {
          padding: 7px 10px;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 999px;
          color: #91a7bf;
          background: rgba(255,255,255,0.025);
          font-size: 0.64rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .heroSection {
          max-width: 1500px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0, 1.35fr) minmax(360px, 0.65fr);
          gap: 28px;
          padding: clamp(54px, 7vw, 100px) clamp(18px, 3vw, 46px) 42px;
        }
        .eyebrow {
          margin: 0 0 10px;
          color: var(--blue);
          font-size: 0.66rem;
          font-weight: 900;
          letter-spacing: 0.19em;
          text-transform: uppercase;
        }
        .heroCopy h2 {
          max-width: 900px;
          margin: 0;
          font-size: clamp(2.6rem, 5vw, 5.6rem);
          line-height: 0.98;
          letter-spacing: -0.055em;
        }
        .heroCopy h2 span {
          display: block;
          color: transparent;
          background: linear-gradient(90deg, #79dfff, #a8edff 48%, #dcefff);
          background-clip: text;
        }
        .heroLead {
          max-width: 860px;
          margin: 28px 0 0;
          color: #a7b8ca;
          font-size: clamp(1rem, 1.5vw, 1.16rem);
          line-height: 1.8;
        }
        .heroActions { gap: 12px; flex-wrap: wrap; margin-top: 30px; }
        .primaryAction,
        .secondaryAction,
        .goldAction,
        .detailAction,
        .wideLink {
          min-height: 48px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 18px;
          border-radius: 13px;
          font-size: 0.78rem;
          font-weight: 900;
          transition: 170ms ease;
        }
        .primaryAction,
        .detailAction {
          border: 1px solid rgba(84, 211, 255, 0.45);
          color: #f2fcff;
          background: linear-gradient(135deg, rgba(20, 170, 232, 0.34), rgba(41, 105, 189, 0.24));
          box-shadow: 0 14px 34px rgba(20, 154, 220, 0.12);
        }
        .secondaryAction,
        .wideLink {
          border: 1px solid rgba(255,255,255,0.12);
          color: #dce9f7;
          background: rgba(255,255,255,0.045);
        }
        .goldAction {
          border: 1px solid rgba(244, 198, 103, 0.38);
          color: #fff4ce;
          background: rgba(244, 198, 103, 0.09);
        }
        .primaryAction:hover,
        .secondaryAction:hover,
        .goldAction:hover,
        .detailAction:hover,
        .wideLink:hover { transform: translateY(-2px); }

        .heroStatus,
        .panel {
          border: 1px solid var(--line);
          border-radius: 22px;
          background:
            linear-gradient(180deg, rgba(15, 29, 46, 0.87), rgba(5, 13, 23, 0.9));
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.045), 0 26px 64px rgba(0,0,0,0.18);
          backdrop-filter: blur(15px);
        }
        .heroStatus { align-self: end; padding: 22px; }
        .statusHeader { display: flex; align-items: center; justify-content: space-between; gap: 18px; }
        .statusHeader small { display: block; color: #70879f; font-size: 0.62rem; letter-spacing: 0.14em; }
        .statusHeader strong { display: block; margin-top: 5px; font-size: 0.9rem; }
        .stateBadge,
        .panelState {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 7px 10px;
          border-radius: 999px;
          font-size: 0.62rem;
          font-weight: 900;
          letter-spacing: 0.1em;
        }
        .stateBadge { color: #bcffe0; border: 1px solid rgba(108,226,173,0.32); background: rgba(108,226,173,0.08); }
        .statusMetrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 22px; }
        .statusMetrics article {
          min-height: 92px;
          display: grid;
          align-content: center;
          gap: 5px;
          padding: 12px;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          background: rgba(255,255,255,0.026);
        }
        .statusMetrics span { color: #f6fbff; font-size: 1.6rem; font-weight: 900; }
        .statusMetrics small { color: #71869f; font-size: 0.62rem; line-height: 1.35; }
        .currentFocus {
          margin-top: 14px;
          padding: 16px;
          border: 1px solid rgba(244,198,103,0.18);
          border-radius: 15px;
          background: rgba(244,198,103,0.055);
        }
        .currentFocus small { color: #b89c5f; font-size: 0.6rem; letter-spacing: 0.13em; }
        .currentFocus strong { display: block; margin-top: 7px; color: #fff2c3; font-size: 0.86rem; }
        .currentFocus p { margin: 8px 0 0; color: #a89c7d; font-size: 0.72rem; line-height: 1.55; }

        .chainSection {
          max-width: 1500px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(8, minmax(0, 1fr));
          padding: 0 clamp(18px, 3vw, 46px) 34px;
        }
        .chainStage {
          position: relative;
          min-height: 72px;
          display: grid;
          align-content: center;
          justify-items: center;
          gap: 5px;
          border-top: 1px solid rgba(90, 214, 255, 0.25);
          border-bottom: 1px solid rgba(90, 214, 255, 0.12);
          background: linear-gradient(180deg, rgba(59,191,238,0.065), rgba(9,17,29,0.2));
        }
        .chainStage:first-child { border-left: 1px solid rgba(90,214,255,0.16); border-radius: 14px 0 0 14px; }
        .chainStage:last-child { border-right: 1px solid rgba(90,214,255,0.16); border-radius: 0 14px 14px 0; }
        .chainStage span { color: #4f7894; font-size: 0.55rem; font-weight: 900; }
        .chainStage strong { font-size: 0.7rem; letter-spacing: 0.04em; }
        .chainStage i { position: absolute; right: -5px; z-index: 3; color: #3e87aa; font-style: normal; }

        .dashboardGrid,
        .activeWorkSection,
        .middleGrid,
        .divisionSection,
        .eventsSection,
        .nextMoveSection {
          max-width: 1500px;
          margin: 0 auto;
        }
        .dashboardGrid {
          display: grid;
          grid-template-columns: minmax(300px, 0.36fr) minmax(0, 1fr);
          gap: 20px;
          padding: 0 clamp(18px, 3vw, 46px) 20px;
        }
        .panel { padding: 22px; }
        .panelHeading { justify-content: space-between; gap: 18px; margin-bottom: 18px; }
        .panelHeading.wide { align-items: flex-end; }
        .panelHeading h3 { margin: 0; font-size: clamp(1.2rem, 2vw, 1.65rem); letter-spacing: -0.025em; }
        .panelState.green { color: #bfffe2; border: 1px solid rgba(108,226,173,0.27); background: rgba(108,226,173,0.075); }
        .panelState.gold { color: #fff0bd; border: 1px solid rgba(244,198,103,0.27); background: rgba(244,198,103,0.075); }
        .panelState.blue { color: #c9f2ff; border: 1px solid rgba(77,200,255,0.27); background: rgba(77,200,255,0.075); }
        .panelState.violet { color: #e0dbff; border: 1px solid rgba(169,156,255,0.27); background: rgba(169,156,255,0.075); }

        .identityCard { display: flex; align-items: center; gap: 14px; padding: 16px; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; background: rgba(255,255,255,0.025); }
        .identityMonogram { width: 48px; height: 48px; display: grid; place-items: center; border: 1px solid rgba(77,200,255,0.28); border-radius: 14px; color: #dff8ff; background: rgba(77,200,255,0.09); font-weight: 900; }
        .identityCard strong { display: block; font-size: 0.9rem; }
        .identityCard span { display: block; margin-top: 4px; color: #7890a8; font-size: 0.7rem; }
        .identityList { margin: 16px 0 0; }
        .identityList div { display: grid; gap: 5px; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.065); }
        .identityList dt,
        .detailGrid dt,
        .workCard dt,
        .scopeCard dt { color: #657b93; font-size: 0.61rem; font-weight: 900; letter-spacing: 0.09em; text-transform: uppercase; }
        .identityList dd,
        .detailGrid dd,
        .workCard dd,
        .scopeCard dd { margin: 0; color: #c9d7e5; font-size: 0.72rem; line-height: 1.45; }
        .authorityBoundary,
        .completionStandard,
        .commercialBoundary {
          margin-top: 16px;
          padding: 14px;
          border: 1px solid rgba(244,198,103,0.16);
          border-radius: 14px;
          background: rgba(244,198,103,0.045);
        }
        .authorityBoundary span,
        .completionStandard span,
        .commercialBoundary strong { color: #c6a55f; font-size: 0.6rem; font-weight: 900; letter-spacing: 0.12em; }
        .authorityBoundary p,
        .completionStandard p,
        .commercialBoundary p { margin: 7px 0 0; color: #a9a084; font-size: 0.68rem; line-height: 1.55; }
        .panelLinks { display: grid; gap: 8px; margin-top: 16px; }
        .panelLinks a,
        .panelTextLink { color: #91dfff; font-size: 0.7rem; font-weight: 800; }

        .filterRow { justify-content: space-between; gap: 14px; margin-bottom: 14px; }
        .filterGroup { display: flex; gap: 7px; flex-wrap: wrap; }
        .filterGroup button,
        .filterRow select {
          min-height: 34px;
          padding: 0 10px;
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 9px;
          color: #92a8bf;
          background: rgba(255,255,255,0.03);
          font-size: 0.64rem;
          font-weight: 800;
          text-transform: capitalize;
        }
        .filterGroup button { cursor: pointer; }
        .filterGroup button.active { color: #eafaff; border-color: rgba(77,200,255,0.32); background: rgba(77,200,255,0.1); }
        .filterRow select { min-width: 170px; }
        .actionWorkspace { display: grid; grid-template-columns: minmax(0, 0.95fr) minmax(300px, 0.75fr); gap: 14px; }
        .actionList { display: grid; gap: 9px; max-height: 670px; overflow-y: auto; padding-right: 4px; }
        .actionCard {
          position: relative;
          width: 100%;
          display: grid;
          gap: 8px;
          padding: 15px 15px 15px 19px;
          border: 1px solid rgba(255,255,255,0.075);
          border-radius: 15px;
          color: inherit;
          text-align: left;
          background: rgba(255,255,255,0.024);
          cursor: pointer;
          overflow: hidden;
          transition: 150ms ease;
        }
        .actionCard:hover,
        .actionCard.selected { border-color: rgba(77,200,255,0.28); background: rgba(77,200,255,0.055); transform: translateX(2px); }
        .priorityRail { position: absolute; inset: 0 auto 0 0; width: 4px; background: #698097; }
        .actionCard.critical .priorityRail { background: var(--red); }
        .actionCard.high .priorityRail { background: var(--gold); }
        .actionCard.standard .priorityRail { background: var(--blue); }
        .actionCard.watch .priorityRail { background: var(--violet); }
        .actionTopline { justify-content: space-between; gap: 10px; }
        .actionTopline small { color: #75899f; font-size: 0.62rem; }
        .priorityBadge { display: inline-flex; width: max-content; padding: 5px 8px; border-radius: 999px; font-size: 0.57rem; font-weight: 900; letter-spacing: 0.08em; text-transform: uppercase; }
        .priorityBadge.critical { color: #ffd8dc; border: 1px solid rgba(255,126,140,0.28); background: rgba(255,126,140,0.09); }
        .priorityBadge.high { color: #fff0bf; border: 1px solid rgba(244,198,103,0.28); background: rgba(244,198,103,0.09); }
        .priorityBadge.standard { color: #d8f5ff; border: 1px solid rgba(77,200,255,0.28); background: rgba(77,200,255,0.09); }
        .priorityBadge.watch { color: #e3ddff; border: 1px solid rgba(169,156,255,0.28); background: rgba(169,156,255,0.09); }
        .actionCard > strong { font-size: 0.82rem; }
        .actionCard > p { margin: 0; color: #8599b0; font-size: 0.69rem; line-height: 1.5; }
        .actionMeta { gap: 7px; flex-wrap: wrap; }
        .actionMeta span { padding: 4px 7px; border-radius: 7px; color: #607891; background: rgba(255,255,255,0.035); font-size: 0.55rem; font-weight: 800; }
        .actionDetail { min-height: 100%; padding: 19px; border: 1px solid rgba(77,200,255,0.13); border-radius: 16px; background: linear-gradient(180deg, rgba(48,132,180,0.065), rgba(255,255,255,0.018)); }
        .detailHeader { justify-content: space-between; gap: 14px; }
        .detailHeader small { display: block; color: #637a92; font-size: 0.57rem; letter-spacing: 0.12em; }
        .detailHeader strong { display: block; margin-top: 4px; color: #b7cde1; font-size: 0.68rem; }
        .actionDetail h4 { margin: 24px 0 0; font-size: 1.4rem; line-height: 1.12; letter-spacing: -0.03em; }
        .detailDescription { color: #91a5bb; font-size: 0.76rem; line-height: 1.65; }
        .detailGrid { display: grid; grid-template-columns: 1fr 1fr; gap: 9px; margin: 18px 0 0; }
        .detailGrid div { padding: 11px; border: 1px solid rgba(255,255,255,0.065); border-radius: 11px; background: rgba(255,255,255,0.022); }
        .detailGrid div.full { grid-column: 1 / -1; }
        .detailGrid dd { margin-top: 6px; }
        .detailAction { width: 100%; margin-top: 16px; }
        .emptyState { padding: 32px; border: 1px dashed rgba(255,255,255,0.12); border-radius: 14px; text-align: center; }
        .emptyState p { color: #7d91a8; font-size: 0.72rem; line-height: 1.55; }

        .activeWorkSection,
        .divisionSection,
        .eventsSection { margin-top: 0; margin-bottom: 20px; }
        .activeWorkSection { margin-left: auto; margin-right: auto; }
        .workGrid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 12px; }
        .workCard { min-width: 0; display: flex; flex-direction: column; padding: 16px; border: 1px solid rgba(255,255,255,0.075); border-radius: 16px; background: rgba(255,255,255,0.022); }
        .workHeader { justify-content: space-between; gap: 8px; }
        .workHeader small { color: #657b92; font-size: 0.58rem; }
        .workState { padding: 5px 7px; border-radius: 999px; font-size: 0.56rem; font-weight: 900; text-transform: uppercase; }
        .workState.draft { color: #d5ddea; background: rgba(185,199,216,0.08); }
        .workState.intake { color: #d7f6ff; background: rgba(77,200,255,0.1); }
        .workState.under_review { color: #e5ddff; background: rgba(169,156,255,0.1); }
        .workState.held { color: #ffd8dc; background: rgba(255,126,140,0.1); }
        .workState.published,
        .workState.verified { color: #c9ffe4; background: rgba(108,226,173,0.1); }
        .workType { margin: 18px 0 0; color: #698098; font-size: 0.58rem; font-weight: 900; letter-spacing: 0.09em; text-transform: uppercase; }
        .workCard h4 { margin: 7px 0 0; min-height: 56px; font-size: 0.88rem; line-height: 1.35; }
        .workId { margin-top: 10px; color: #55718a; font-size: 0.58rem; font-weight: 800; }
        .progressTrack { height: 7px; margin-top: 18px; border-radius: 999px; background: rgba(255,255,255,0.06); overflow: hidden; }
        .progressTrack span { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, #36bff2, #6be7ef); }
        .progressMeta { justify-content: space-between; gap: 8px; margin-top: 7px; color: #71869c; font-size: 0.56rem; }
        .workCard dl { margin: 18px 0 0; }
        .workCard dd { margin-top: 5px; }
        .workCard > a { margin-top: auto; padding-top: 18px; color: #85dcff; font-size: 0.67rem; font-weight: 900; }

        .middleGrid { display: grid; grid-template-columns: 1.12fr 0.82fr 0.82fr; gap: 20px; padding: 0 clamp(18px, 3vw, 46px) 20px; }
        .graphCanvas { position: relative; min-height: 430px; border: 1px solid rgba(255,255,255,0.065); border-radius: 18px; background: radial-gradient(circle at center, rgba(53,178,230,0.08), transparent 47%), rgba(255,255,255,0.015); overflow: hidden; }
        .graphCore,
        .graphNode { position: absolute; z-index: 3; display: grid; place-items: center; text-align: center; border-radius: 14px; }
        .graphCore { left: 50%; top: 50%; width: 180px; min-height: 96px; padding: 14px; transform: translate(-50%, -50%); border: 1px solid rgba(77,200,255,0.38); background: rgba(20,91,130,0.42); box-shadow: 0 0 45px rgba(41,180,231,0.11); }
        .graphCore span,
        .graphCore small { color: #75a4bf; font-size: 0.56rem; }
        .graphCore strong { margin: 5px 0; font-size: 0.82rem; }
        .graphNode { width: 132px; min-height: 60px; padding: 9px; border: 1px solid rgba(255,255,255,0.1); background: rgba(10,20,33,0.92); }
        .graphNode strong { font-size: 0.68rem; }
        .graphNode span { margin-top: 4px; color: #638099; font-size: 0.52rem; }
        .graphNode.top.left { left: 9%; top: 10%; }
        .graphNode.top.right { right: 9%; top: 10%; }
        .graphNode.middle.left { left: 5%; top: 43%; }
        .graphNode.middle.right { right: 5%; top: 43%; }
        .graphNode.bottom.left { left: 12%; bottom: 9%; }
        .graphNode.bottom.right { right: 12%; bottom: 9%; }
        .graphLines { position: absolute; inset: 0; z-index: 1; width: 100%; height: 100%; }
        .graphLines line { stroke: rgba(88,190,229,0.28); stroke-width: 1.5; stroke-dasharray: 5 8; }
        .graphLegend { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 12px; color: #6d839a; font-size: 0.58rem; }
        .graphLegend span { display: flex; align-items: center; gap: 5px; }
        .graphLegend i { width: 7px; height: 7px; border-radius: 50%; }
        .graphLegend i.cyan { background: var(--cyan); }
        .graphLegend i.blue { background: var(--blue); }
        .graphLegend i.gold { background: var(--gold); }
        .graphLegend i.green { background: var(--green); }
        .wideLink { width: 100%; margin-top: 16px; }

        .scopeCard { padding: 16px; border: 1px solid rgba(255,255,255,0.075); border-radius: 15px; background: rgba(255,255,255,0.022); }
        .scopeCard + .scopeCard { margin-top: 11px; }
        .scopeCard.featured { border-color: rgba(244,198,103,0.19); background: rgba(244,198,103,0.035); }
        .scopeTopline { justify-content: space-between; gap: 10px; }
        .scopeTopline span { color: #607891; font-size: 0.57rem; font-weight: 900; }
        .scopeTopline strong { color: #d6bb77; font-size: 0.55rem; letter-spacing: 0.08em; }
        .scopeCard h4 { margin: 14px 0 0; font-size: 0.92rem; }
        .scopeCard p { color: #8296ac; font-size: 0.68rem; line-height: 1.55; }
        .scopeCard dl { display: grid; gap: 8px; margin: 14px 0; }
        .scopeCard dl div { display: flex; justify-content: space-between; gap: 12px; }
        .scopeCard dd { text-align: right; }
        .scopeCard a { color: #f1ce7f; font-size: 0.66rem; font-weight: 900; }

        .credentialCard { display: flex; align-items: center; gap: 13px; padding: 15px; border: 1px solid rgba(169,156,255,0.16); border-radius: 15px; background: rgba(169,156,255,0.045); }
        .credentialSeal { width: 46px; height: 46px; display: grid; place-items: center; flex: 0 0 46px; border: 1px solid rgba(169,156,255,0.3); border-radius: 13px; color: #e4e0ff; background: rgba(169,156,255,0.08); font-weight: 900; }
        .credentialCard small,
        .credentialCard span { display: block; color: #746e9c; font-size: 0.57rem; }
        .credentialCard strong { display: block; margin: 5px 0; font-size: 0.78rem; }
        .authorizationRoute { display: grid; gap: 7px; margin-top: 16px; }
        .authorizationRoute div { display: grid; grid-template-columns: 25px 1fr; align-items: center; gap: 9px; min-height: 38px; padding: 7px 10px; border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; background: rgba(255,255,255,0.02); }
        .authorizationRoute span { width: 22px; height: 22px; display: grid; place-items: center; border-radius: 50%; color: #a69cff; background: rgba(169,156,255,0.09); font-size: 0.55rem; font-weight: 900; }
        .authorizationRoute strong { font-size: 0.65rem; }
        .academyRequirements { display: grid; gap: 8px; margin-top: 15px; }
        .academyRequirements article { display: grid; grid-template-columns: 29px 1fr; align-items: center; gap: 9px; padding: 10px; border: 1px solid rgba(255,255,255,0.06); border-radius: 11px; }
        .academyRequirements article > span { width: 26px; height: 26px; display: grid; place-items: center; border-radius: 8px; color: #8ca1b8; background: rgba(255,255,255,0.04); font-size: 0.58rem; font-weight: 900; }
        .academyRequirements article > span.complete { color: #bfffe2; background: rgba(108,226,173,0.09); }
        .academyRequirements strong { display: block; font-size: 0.66rem; }
        .academyRequirements small { display: block; margin-top: 4px; color: #6f839a; font-size: 0.57rem; }

        .divisionSection,
        .eventsSection { margin-left: auto; margin-right: auto; }
        .divisionGrid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
        .divisionCard { --division-accent: #59d7ff; min-height: 170px; display: grid; grid-template-columns: 54px 1fr 24px; align-items: start; gap: 14px; padding: 18px; border: 1px solid rgba(255,255,255,0.075); border-radius: 16px; background: linear-gradient(145deg, color-mix(in srgb, var(--division-accent) 6%, transparent), rgba(255,255,255,0.018)); transition: 170ms ease; }
        .divisionCard:hover { transform: translateY(-3px); border-color: color-mix(in srgb, var(--division-accent) 38%, transparent); }
        .divisionCode { width: 48px; height: 48px; display: grid; place-items: center; border: 1px solid color-mix(in srgb, var(--division-accent) 36%, transparent); border-radius: 14px; color: var(--division-accent); background: color-mix(in srgb, var(--division-accent) 9%, transparent); font-weight: 900; }
        .divisionCopy > span { color: var(--division-accent); font-size: 0.57rem; font-weight: 900; letter-spacing: 0.09em; text-transform: uppercase; }
        .divisionCopy h4 { margin: 8px 0 0; font-size: 0.9rem; }
        .divisionCopy p { margin: 9px 0 0; color: #8397ad; font-size: 0.67rem; line-height: 1.52; }
        .divisionCopy small { display: block; margin-top: 14px; color: #60768e; font-size: 0.58rem; font-weight: 800; }
        .divisionCard > i { align-self: center; color: var(--division-accent); font-style: normal; }

        .eventTable { border: 1px solid rgba(255,255,255,0.07); border-radius: 15px; overflow: hidden; }
        .eventRow { display: grid; grid-template-columns: 1.3fr 0.72fr 1fr 0.55fr; align-items: center; gap: 14px; min-height: 62px; padding: 10px 14px; border-top: 1px solid rgba(255,255,255,0.055); color: #8fa3b9; font-size: 0.66rem; }
        .eventRow:first-child { border-top: 0; }
        .eventHead { min-height: 40px; color: #5f768e; background: rgba(255,255,255,0.026); font-size: 0.57rem; font-weight: 900; letter-spacing: 0.08em; text-transform: uppercase; }
        .eventName { gap: 9px; min-width: 0; }
        .eventName i { width: 9px; height: 9px; flex: 0 0 9px; border-radius: 50%; }
        .eventName i.blue { background: var(--blue); }
        .eventName i.cyan { background: var(--cyan); }
        .eventName i.gold { background: var(--gold); }
        .eventName i.green { background: var(--green); }
        .eventName i.red { background: var(--red); }
        .eventName i.violet { background: var(--violet); }
        .eventName strong { color: #c7d7e6; font-size: 0.66rem; }
        .eventName small { color: #526b84; font-size: 0.54rem; }

        .nextMoveSection { display: flex; align-items: center; justify-content: space-between; gap: 30px; margin-top: 0; margin-bottom: 20px; padding: 30px clamp(18px, 3vw, 46px); border: 1px solid rgba(244,198,103,0.18); border-radius: 22px; background: linear-gradient(135deg, rgba(244,198,103,0.07), rgba(32,116,166,0.07)); }
        .nextMoveSection h3 { margin: 0; max-width: 850px; font-size: clamp(1.5rem, 3vw, 2.4rem); letter-spacing: -0.035em; }
        .nextMoveSection p:not(.eyebrow) { max-width: 850px; margin: 12px 0 0; color: #94a6b9; font-size: 0.78rem; line-height: 1.65; }
        .nextMoveActions { gap: 10px; flex-wrap: wrap; justify-content: flex-end; }

        .institutionFooter { justify-content: space-between; gap: 24px; padding: 30px clamp(18px, 3vw, 46px); border-top: 1px solid rgba(255,255,255,0.075); background: rgba(2,6,11,0.68); }
        .institutionFooter strong { display: block; font-size: 0.78rem; }
        .institutionFooter span { display: block; margin-top: 5px; color: #617790; font-size: 0.62rem; }
        .institutionFooter nav { gap: 15px; flex-wrap: wrap; justify-content: flex-end; }
        .institutionFooter nav a { color: #7e93aa; font-size: 0.64rem; font-weight: 800; }

        .missionControl.compact .heroSection { padding-top: 44px; }
        .missionControl.compact .heroCopy h2 { font-size: clamp(2.3rem, 4vw, 4.2rem); }
        .missionControl.compact .heroLead { font-size: 0.94rem; }
        .missionControl.compact .workCard h4 { min-height: 0; }
        .missionControl.compact .graphCanvas { min-height: 360px; }

        @media (max-width: 1240px) {
          .heroSection { grid-template-columns: 1fr; }
          .heroStatus { max-width: 760px; }
          .dashboardGrid { grid-template-columns: 1fr; }
          .middleGrid { grid-template-columns: 1fr 1fr; }
          .recordGraphPanel { grid-column: 1 / -1; }
          .workGrid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        }

        @media (max-width: 900px) {
          .commandHeader { align-items: flex-start; }
          .commandActions { display: none; }
          .institutionBar { align-items: flex-start; flex-direction: column; }
          .authorityPills { justify-content: flex-start; }
          .chainSection { grid-template-columns: repeat(4, 1fr); gap: 7px; }
          .chainStage { border: 1px solid rgba(90,214,255,0.14); border-radius: 10px !important; }
          .chainStage i { display: none; }
          .actionWorkspace { grid-template-columns: 1fr; }
          .actionList { max-height: none; }
          .workGrid { grid-template-columns: 1fr 1fr; }
          .middleGrid { grid-template-columns: 1fr; }
          .recordGraphPanel { grid-column: auto; }
          .divisionGrid { grid-template-columns: 1fr 1fr; }
          .eventRow { grid-template-columns: 1fr 0.72fr 0.55fr; }
          .eventRow > span:nth-child(3) { display: none; }
          .nextMoveSection { align-items: flex-start; flex-direction: column; }
          .nextMoveActions { justify-content: flex-start; }
          .institutionFooter { align-items: flex-start; flex-direction: column; }
          .institutionFooter nav { justify-content: flex-start; }
        }

        @media (max-width: 620px) {
          .commandHeader { min-height: 72px; padding: 10px 14px; }
          .brandSeal { width: 46px; height: 46px; flex-basis: 46px; }
          .commandBrand small { display: none; }
          .commandBrand h1 { font-size: 0.84rem; }
          .institutionBar { padding-left: 14px; padding-right: 14px; }
          .heroSection,
          .dashboardGrid,
          .middleGrid,
          .chainSection { padding-left: 14px; padding-right: 14px; }
          .heroCopy h2 { font-size: 2.65rem; }
          .heroActions { align-items: stretch; flex-direction: column; }
          .heroActions a { width: 100%; }
          .statusMetrics { grid-template-columns: 1fr 1fr; }
          .chainSection { grid-template-columns: 1fr 1fr; }
          .panel { padding: 16px; border-radius: 17px; }
          .panelHeading { align-items: flex-start; flex-direction: column; }
          .filterRow { align-items: stretch; flex-direction: column; }
          .filterRow select { width: 100%; }
          .detailGrid { grid-template-columns: 1fr; }
          .detailGrid div.full { grid-column: auto; }
          .workGrid,
          .divisionGrid { grid-template-columns: 1fr; }
          .graphCanvas { min-height: 510px; }
          .graphCore { width: 150px; }
          .graphNode { width: 118px; }
          .graphNode.top.left { left: 3%; top: 7%; }
          .graphNode.top.right { right: 3%; top: 7%; }
          .graphNode.middle.left { left: 2%; top: 37%; }
          .graphNode.middle.right { right: 2%; top: 37%; }
          .graphNode.bottom.left { left: 5%; bottom: 7%; }
          .graphNode.bottom.right { right: 5%; bottom: 7%; }
          .eventRow { grid-template-columns: 1fr 0.58fr; }
          .eventRow > span:nth-child(2),
          .eventRow > span:nth-child(3) { display: none; }
          .nextMoveSection { margin-left: 14px; margin-right: 14px; padding: 22px 16px; }
          .nextMoveActions { width: 100%; }
          .nextMoveActions a { width: 100%; }
        }
      `}</style>
    </main>
  );
}
