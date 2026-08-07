import Link from "next/link";

export const metadata = {
  title: "Registration & Evidence Terms | TA14 Authority",
  description:
    "Public terms governing AI governance registration, evidence submission, findings, publication, withdrawal, versioning, fees, and institutional recordkeeping within the TA14 AI Governance Exchange.",
};

const Section = ({
  number,
  title,
  children,
}: {
  number?: string;
  title: string;
  children: React.ReactNode;
}) => (
  <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 md:p-8">
    <div className="mb-4 flex items-start gap-4">
      {number ? (
        <span className="flex h-9 min-w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-2 text-xs font-semibold tracking-[0.14em] text-white/60">
          {number}
        </span>
      ) : null}

      <div>
        <h2 className="text-xl font-semibold tracking-tight text-white md:text-2xl">
          {title}
        </h2>
      </div>
    </div>

    <div className="space-y-4 text-[15px] leading-7 text-white/72">
      {children}
    </div>
  </section>
);

const BulletList = ({ items }: { items: string[] }) => (
  <ul className="space-y-2 pl-5">
    {items.map((item) => (
      <li key={item} className="list-disc pl-1 marker:text-white/35">
        {item}
      </li>
    ))}
  </ul>
);

const Principle = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
    <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
      {title}
    </div>
    <div className="text-base font-medium leading-7 text-white/85">
      {children}
    </div>
  </div>
);

export default function RegistrationEvidenceTermsPage() {
  return (
    <main className="min-h-screen bg-[#05060a] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-20rem] h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-white/[0.025] blur-3xl" />
        <div className="absolute bottom-[-18rem] right-[-10rem] h-[34rem] w-[34rem] rounded-full bg-white/[0.02] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-16">
        <nav className="mb-10 flex flex-wrap items-center justify-between gap-4 text-sm text-white/55">
          <Link
            href="/"
            className="transition hover:text-white"
          >
            TA14 Authority
          </Link>

          <div className="flex flex-wrap items-center gap-5">
            <Link
              href="/workspace/ai-governance"
              className="transition hover:text-white"
            >
              AI Governance Exchange
            </Link>

            <Link
              href="/governance"
              className="transition hover:text-white"
            >
              Governance
            </Link>
          </div>
        </nav>

        <header className="mb-12 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035]">
          <div className="border-b border-white/10 px-6 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-white/45 md:px-10">
            TA14 Public Governance Instrument
          </div>

          <div className="px-6 py-10 md:px-10 md:py-14">
            <div className="mb-5 inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold tracking-[0.15em] text-white/55">
              TA14-RET-001 · VERSION 1.0
            </div>

            <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.04em] text-white md:text-6xl">
              Registration & Evidence Terms
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/65">
              Public terms governing AI governance registration, evidence
              submission, findings, publication, withdrawal, versioning,
              intellectual-property boundaries, fees, and institutional
              recordkeeping within the TA14 AI Governance Exchange.
            </p>

            <div className="mt-8 grid gap-3 text-sm text-white/55 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-white/35">Status</div>
                <div className="mt-1 font-medium text-white/80">
                  Public Governance Instrument
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-white/35">Effective</div>
                <div className="mt-1 font-medium text-white/80">
                  August 7, 2026
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-white/35">Issued By</div>
                <div className="mt-1 font-medium text-white/80">
                  TA14 Authority
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-white/35">Applies To</div>
                <div className="mt-1 font-medium text-white/80">
                  AI Governance Exchange
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="mb-10 grid gap-4 md:grid-cols-2">
          <Principle title="Registration boundary">
            Registration establishes attributable identity, not correctness.
          </Principle>

          <Principle title="Evidence boundary">
            Evidence is admitted, attributed, and bounded. It is not silently
            upgraded into independent proof.
          </Principle>

          <Principle title="Finding boundary">
            A material limitation must travel with the finding it limits.
          </Principle>

          <Principle title="Institutional boundary">
            TA14 Authority does not claim that institutional position creates
            independence by itself.
          </Principle>
        </div>

        <div className="space-y-6">
          <Section number="1" title="Purpose">
            <p>
              These Terms establish the public operating boundary for
              registration, evidence submission, evidence preservation,
              governed review, findings, publication, withdrawal, versioning,
              intellectual-property treatment, and institutional recordkeeping
              within the TA14 AI Governance Exchange.
            </p>

            <p>
              They are intended to be understandable by a third party who has
              not participated in private discussions with TA14 Authority or a
              registrant.
            </p>

            <p>
              No private conversation, direct message, meeting, email, or
              unpublished understanding is required to interpret the core
              rights, boundaries, responsibilities, and non-claims stated here.
            </p>
          </Section>

          <Section number="2" title="What registration means">
            <p>
              Governance Entity Registration establishes an attributable
              institutional record for an AI governance entity.
            </p>

            <p>A registration may preserve:</p>

            <BulletList
              items={[
                "governance name and category",
                "steward, founder, claimant, organization, or attributable party",
                "version and effective date",
                "jurisdiction and operational scope",
                "bounded claims",
                "explicit non-claims",
                "declared limitations",
                "implementation state",
                "public references and repository references",
                "evidence references",
                "ownership or stewardship declarations",
                "record visibility",
                "version lineage",
                "subsequent governed activity",
              ]}
            />

            <p>
              Registration establishes what the registrant declares about the
              governance entity at the time of registration.
            </p>

            <p>
              <strong className="text-white">
                Registration creates an attributable baseline. It is not itself
                a substantive finding about the correctness of that baseline.
              </strong>
            </p>
          </Section>

          <Section number="3" title="What registration does not mean">
            <p>
              Registration does <strong className="text-white">not</strong> mean
              that TA14 Authority has:
            </p>

            <BulletList
              items={[
                "certified the governance entity",
                "approved or endorsed the governance entity",
                "validated its architecture",
                "verified every submitted claim",
                "established regulatory or legal compliance",
                "established technical correctness",
                "established cybersecurity adequacy",
                "established production readiness",
                "established ownership as a matter of law",
                "determined that a particular execution is admissible",
                "determined superiority over another architecture",
                "granted authority the registrant did not otherwise possess",
              ]}
            />

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5 font-medium text-white/85">
              A registration identifier is an institutional identity and
              chronology mechanism. It is not a quality mark.
            </div>
          </Section>

          <Section number="4" title="Registration before artifact registration">
            <p>
              An execution artifact, evidence artifact, governed demonstration
              artifact, receipt, conformance record, or related governed record
              may be attributed to an AI governance entity only after the
              relevant governance entity has completed Governance Entity
              Registration.
            </p>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-center font-semibold text-white/85">
              Governance Entity Registration → Attributable Governance Identity
              → Artifact Registration
            </div>

            <p>
              The existence of a registered artifact does not convert the
              underlying governance registration into certification or approval.
            </p>
          </Section>

          <Section number="5" title="Closed implementations and intellectual property">
            <p>
              Governance Entity Registration does not require disclosure of
              source code, proprietary models, confidential internals, trade
              secrets, private datasets, private credentials, customer
              materials, or other non-public implementation details merely
              because the governance entity is registered.
            </p>

            <p>
              <strong className="text-white">
                A closed implementation may remain closed.
              </strong>
            </p>

            <p>
              A registrant may instead submit an evidence surface appropriate to
              the bounded claim under review, including outputs, receipts,
              signed records, hashes, logs, conformance results, public
              specifications, demonstrations, evaluation packets, version
              manifests, execution records, and outcome records.
            </p>

            <p>
              Registration does not transfer ownership of the registrant&apos;s
              intellectual property to TA14 Authority.
            </p>

            <p>
              Unless a separate written agreement expressly states otherwise,
              the registrant retains ownership of its architecture, original
              works, trademarks, proprietary implementation, and related
              intellectual property.
            </p>
          </Section>

          <Section number="6" title="No implied implementation license">
            <p>
              Submission of evidence does not, by itself, grant TA14 Authority a
              license to commercialize the registrant&apos;s architecture,
              reproduce a closed implementation, create derivative
              implementations, redistribute proprietary source code, reverse
              engineer proprietary systems, sublicense proprietary technology,
              or use confidential materials for unrelated commercial
              development.
            </p>

            <p>
              Any broader license must be separately and expressly stated in
              writing.
            </p>
          </Section>

          <Section number="7" title="Evidence is admitted, not assumed">
            <p>TA14 Authority evaluates admitted evidence.</p>

            <BulletList
              items={[
                "A statement inside a registration does not automatically become independently established.",
                "A runtime output does not automatically establish the surrounding chronology that produced it.",
                "A hash does not automatically prove that the underlying information was truthful when originally recorded.",
                "A preserved record does not automatically establish independent attestation.",
              ]}
            />

            <p>
              TA14 Authority distinguishes these properties where they are
              material to the finding.
            </p>
          </Section>

          <Section number="8" title="Evidence provenance">
            <p>
              Material evidence used in a finding should identify its provenance
              explicitly.
            </p>

            <div className="grid gap-3 md:grid-cols-2">
              {[
                ["REGISTRANT-PRODUCED", "Generated, supplied, or maintained by the registrant being evaluated."],
                ["TA14-PRODUCED", "Generated directly through a TA14 Authority institutional process."],
                ["INDEPENDENTLY PRODUCED", "Originated from a materially independent party for the relevant evidentiary purpose."],
                ["INDEPENDENTLY REPRODUCED", "A material behavior or result was reproduced independently under stated conditions."],
                ["PUBLIC-SOURCE", "Obtained from an attributable public source."],
                ["CROSS-PARTY", "Depends on evidence or receipts preserved by more than one party."],
                ["NOT INDEPENDENTLY ESTABLISHED", "Represented in the record, but not independently established."],
                ["NOT REPORTED", "Relevant provenance, source, or mechanism was not reported."],
                ["NOT SUBMITTED", "Evidence necessary to establish the proposition was not submitted."],
                ["NOT PRESERVED", "The relevant record was not contemporaneously preserved."],
                ["OUTSIDE REVIEW SCOPE", "The matter was not evaluated within the bounded proceeding."],
              ].map(([label, text]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/10 bg-black/20 p-5"
                >
                  <div className="text-xs font-semibold tracking-[0.12em] text-white/55">
                    {label}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-white/65">{text}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section number="9" title="No favorable meaning from a blank">
            <p>
              Where provenance, preservation, independence, or mechanism
              attribution is material, a blank field must not be treated as
              neutral.
            </p>

            <p>
              Missing states should be expressed affirmatively where possible,
              including:
            </p>

            <BulletList
              items={[
                "NOT REPORTED",
                "NOT SUBMITTED",
                "NOT PRESERVED",
                "NOT INDEPENDENTLY ESTABLISHED",
                "OUTSIDE REVIEW SCOPE",
              ]}
            />

            <p>
              Silence must not be used to imply the strongest available
              interpretation.
            </p>
          </Section>

          <Section number="10" title="Material qualifications travel with findings">
            <p>
              A material limitation that changes the meaning of a finding must
              remain attached to the finding it qualifies.
            </p>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="text-xs uppercase tracking-[0.15em] text-white/40">
                Example
              </div>
              <p className="mt-3 font-medium text-white/85">
                SUPPORTED — registrant-produced evidence; independently
                reproducible under the reviewed test conditions; execution-path
                coverage not independently established.
              </p>
            </div>

            <p>
              The qualification is part of the finding. It is not optional
              explanatory metadata.
            </p>
          </Section>

          <Section number="11" title="Bounded findings">
            <p>TA14 findings are limited to:</p>

            <BulletList
              items={[
                "the registered entity",
                "the identified version",
                "the declared jurisdiction",
                "the bounded claim",
                "the admitted evidence",
                "the observed conditions",
                "the review scope",
                "the relevant execution or demonstration route",
                "the preserved chronology",
              ]}
            />

            <p>A finding does not silently extend beyond those boundaries.</p>
          </Section>

          <Section number="12" title="No predetermined outcome">
            <p>
              Participation in a governed review does not require the registrant
              to produce a PASS.
            </p>

            <p>
              A valid outcome may reveal demonstrated behavior, failed behavior,
              refusal, escalation, incomplete evidence, a continuity break, a
              preservation failure, a missing artifact, a bounded success, or a
              bounded limitation.
            </p>

            <p>
              Payment, participation, or registration does not purchase a
              favorable finding.
            </p>
          </Section>

          <Section number="13" title="No retrospective evidence manufacturing">
            <p>
              TA14 Authority does not require a registrant to manufacture
              evidence after the fact merely to complete an evidentiary chain.
            </p>

            <p>
              Where a relevant contemporaneous record did not exist or was not
              preserved, the appropriate state may be:
            </p>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5 font-semibold text-white/85">
              NOT PRESERVED / EVIDENTIARY LIMITATION
            </div>

            <p>
              A later reconstruction may be submitted only if clearly identified
              as a reconstruction.
            </p>
          </Section>

          <Section number="14" title="Frozen records and later versions">
            <p>
              Where a demonstration, version, case, or artifact has been formally
              frozen, later implementation changes must not silently alter the
              earlier record.
            </p>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-center font-semibold text-white/85">
              Frozen Version → Preserved Finding → Later Version
            </div>

            <p>
              A later version does not automatically inherit a PASS, favorable
              finding, evidence sufficiency, production readiness, or independent
              verification from an earlier version.
            </p>
          </Section>

          <Section number="15" title="Publication and visibility">
            <p>
              Submitted evidence should carry an explicit visibility state where
              appropriate.
            </p>

            <BulletList
              items={[
                "PUBLIC",
                "CONTROLLED",
                "PRIVATE",
                "REGISTRY-ONLY",
                "REVIEW-ONLY",
                "WITHHELD FROM PUBLICATION",
              ]}
            />

            <p>
              TA14 Authority should not convert a controlled or private artifact
              into a public artifact merely because it influenced a public
              finding.
            </p>

            <p>
              TA14 Authority may publish its own bounded finding about admitted
              evidence without acquiring ownership of the underlying evidence.
            </p>
          </Section>

          <Section number="16" title="Withdrawal">
            <p>
              A registrant may request withdrawal from future voluntary
              participation in a TA14 process.
            </p>

            <p>
              Withdrawal from future participation does not automatically erase
              historical institutional events that already occurred.
            </p>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="font-medium text-white/85">
                Withdrawal from continuing participation
              </p>
              <p className="mt-1 text-white/45">is not the same as</p>
              <p className="mt-1 font-medium text-white/85">
                erasure of historical chronology.
              </p>
            </div>

            <p>
              A withdrawn registration may be marked WITHDRAWN, INACTIVE,
              SUPERSEDED, or RETIRED as appropriate.
            </p>
          </Section>

          <Section number="17" title="Corrections, disputes, and participant responses">
            <p>
              A participant may request correction of an objective record error
              without agreeing with TA14 Authority&apos;s substantive finding.
            </p>

            <p>
              A participant may also disagree with a TA14 finding.
            </p>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-center font-semibold text-white/85">
              TA14 Finding → Participant Response
            </div>

            <p>
              Separate voices remain separately attributable. Participant
              disagreement does not silently rewrite TA14&apos;s finding.
            </p>
          </Section>

          <Section number="18" title="Fees">
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <div className="grid grid-cols-[1fr_auto] gap-4 border-b border-white/10 bg-white/[0.04] px-5 py-4 text-sm font-semibold text-white/70">
                <div>Activity</div>
                <div>Current Fee</div>
              </div>

              {[
                ["Initial AI Governance Entity Registration", "$0"],
                ["Governance Version Registration", "$0"],
                ["Execution / Evidence Artifact Registration", "$0"],
                ["Standard Bounded Demonstration", "$0"],
                ["Extended Independent Evidence Review", "Separately scoped"],
                ["Technical / Production-Readiness Review", "Separately scoped"],
                ["Architecture / Implementation Advisory", "Separately scoped"],
                ["Multi-Layer Partner Review", "Separately scoped"],
              ].map(([activity, fee]) => (
                <div
                  key={activity}
                  className="grid grid-cols-[1fr_auto] gap-4 border-b border-white/10 px-5 py-4 text-sm last:border-b-0"
                >
                  <div className="text-white/65">{activity}</div>
                  <div className="font-medium text-white/85">{fee}</div>
                </div>
              ))}
            </div>

            <p>
              Registration does not create an undisclosed obligation to purchase
              later TA14 services.
            </p>

            <p>
              Where a paid pathway is separately scoped, scope and price must be
              agreed before paid work begins.
            </p>

            <p>
              Payment purchases the agreed review work. It does not purchase a
              PASS, endorsement, certification, favorable finding, removal of
              limitations, or suppression of unfavorable evidence.
            </p>
          </Section>

          <Section number="19" title="What attests TA14 Authority?">
            <p>
              TA14 Authority does not claim that a record becomes independently
              verified merely because TA14 Authority produced, stored, signed,
              hashed, published, or preserved it.
            </p>

            <p>
              <strong className="text-white">
                Integrity and independence are separate properties.
              </strong>
            </p>

            <p>
              TA14 Authority distinguishes among registrant assertion, TA14
              observation, TA14-generated record, third-party source,
              independent reproduction, externally verifiable evidence, and
              evidence whose independence is not established.
            </p>

            <p>
              TA14 Authority does not claim to have solved the general recursion
              problem of:
            </p>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-center text-lg font-medium text-white/85">
              Who independently attests the attester?
            </div>

            <p>
              Where independent verification terminates, the boundary should be
              stated rather than concealed.
            </p>
          </Section>

          <Section number="20" title="TA14 Authority may be wrong">
            <p>
              A TA14 finding may contain a factual error, evidentiary error,
              attribution error, interpretation error, incomplete record, or
              methodological limitation.
            </p>

            <p>TA14 Authority does not claim infallibility.</p>

            <p>
              Where a material factual error is identified, TA14 Authority may
              issue a correction while preserving the relationship between the
              original and corrected records.
            </p>

            <p>
              Institutional records should not be silently altered in a manner
              that erases the existence of the prior state.
            </p>
          </Section>

          <Section number="21" title="Changes to these terms">
            <p>These Terms are versioned.</p>

            <p>
              A material change to ownership treatment, publication rights,
              withdrawal treatment, evidence preservation, finding rights,
              participant-response rights, confidentiality, fees, or
              institutional use of evidence requires a new version or clearly
              identified amendment.
            </p>

            <p>
              TA14 Authority should not silently apply materially broader later
              terms to an earlier frozen record.
            </p>
          </Section>

          <Section number="22" title="Core institutional principles">
            <div className="grid gap-4 md:grid-cols-2">
              <Principle title="Registration">
                Registration establishes attributable identity, not correctness.
              </Principle>

              <Principle title="Evidence">
                No admissible evidence. No admissible execution.
              </Principle>

              <Principle title="Provenance">
                A record must distinguish who produced evidence from who
                evaluated it.
              </Principle>

              <Principle title="Limitation">
                A material limitation must travel with the finding it limits.
              </Principle>

              <Principle title="Silence">
                A blank must not imply the most favorable interpretation.
              </Principle>

              <Principle title="Version">
                A later implementation does not silently rewrite an earlier
                frozen record.
              </Principle>

              <Principle title="Independence">
                Integrity is not independence.
              </Principle>

              <Principle title="Historical record">
                Withdrawal may end participation. It does not automatically
                erase chronology.
              </Principle>
            </div>
          </Section>

          <Section number="23" title="Acceptance">
            <p>
              A registrant entering a governed TA14 pathway should have access to
              the applicable version of these Terms before being asked to accept
              them.
            </p>

            <p>
              Acceptance should be attributable and capable of being associated
              with the relevant registration or governed submission.
            </p>

            <p>
              Acceptance of these Terms does not constitute agreement with any
              future TA14 finding.
            </p>

            <p>
              The governing version for this instrument is:
            </p>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5 font-semibold text-white/85">
              TA14 Registration & Evidence Terms — Version 1.0
            </div>
          </Section>
        </div>

        <footer className="mt-12 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 md:p-8">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
            Closing boundary
          </div>

          <div className="mt-5 max-w-4xl space-y-4 text-base leading-7 text-white/70">
            <p>
              The purpose of these Terms is not to make every governance claim
              appear strong.
            </p>

            <p>
              The purpose is to make the institutional boundary inspectable.
            </p>

            <p>
              Evidence should remain attributable. Limitations should remain
              attached to the conclusions they limit. Closed systems should not
              be forced open merely to participate. Historical records should
              not be silently rewritten.
            </p>

            <p className="font-medium text-white/90">
              TA14 Authority should not ask another governance architecture to
              live under an evidentiary discipline that TA14 Authority is
              unwilling to apply to itself.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/workspace/ai-governance"
              className="rounded-full border border-white/15 bg-white/[0.06] px-5 py-3 text-sm font-medium text-white transition hover:bg-white/[0.1]"
            >
              Enter AI Governance Exchange
            </Link>

            <Link
              href="/"
              className="rounded-full border border-white/10 px-5 py-3 text-sm font-medium text-white/65 transition hover:text-white"
            >
              TA14 Authority
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
