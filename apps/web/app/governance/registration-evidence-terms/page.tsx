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

      <h2 className="text-xl font-semibold tracking-tight text-white md:text-2xl">
        {title}
      </h2>
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
      <div className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-16">
        <nav className="mb-10 flex flex-wrap items-center justify-between gap-4 text-sm text-white/55">
          <Link href="/" className="transition hover:text-white">
            TA14 Authority
          </Link>

          <div className="flex flex-wrap items-center gap-5">
            <Link
              href="/workspace/ai-governance"
              className="transition hover:text-white"
            >
              AI Governance Exchange
            </Link>

            <Link href="/governance" className="transition hover:text-white">
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
          </Section>

          <Section number="2" title="What registration means">
            <p>
              Governance Entity Registration establishes an attributable
              institutional record for an AI governance entity.
            </p>

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
                "public and repository references",
                "evidence references",
                "ownership or stewardship declarations",
                "record visibility",
                "version lineage",
                "subsequent governed activity",
              ]}
            />

            <p>
              <strong className="text-white">
                Registration creates an attributable baseline. It is not itself
                a substantive finding about the correctness of that baseline.
              </strong>
            </p>
          </Section>

          <Section number="3" title="What registration does not mean">
            <BulletList
              items={[
                "certification",
                "approval or endorsement",
                "architectural validation",
                "verification of every submitted claim",
                "regulatory or legal compliance",
                "technical correctness",
                "cybersecurity adequacy",
                "production readiness",
                "ownership adjudication",
                "a determination that a particular execution is admissible",
                "superiority over another architecture",
              ]}
            />

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5 font-medium text-white/85">
              A registration identifier is an institutional identity and
              chronology mechanism. It is not a quality mark.
            </div>
          </Section>

          <Section number="4" title="Registration before artifact registration">
            <p>
              An execution artifact, evidence artifact, receipt, conformance
              record, or related governed record may be attributed to an AI
              governance entity only after the relevant governance entity has
              completed Governance Entity Registration.
            </p>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-center font-semibold text-white/85">
              Governance Entity Registration → Attributable Governance Identity
              → Artifact Registration
            </div>
          </Section>

          <Section number="5" title="Closed implementations and intellectual property">
            <p>
              A closed implementation may remain closed. Registration does not
              require disclosure of source code, proprietary models,
              confidential internals, trade secrets, private datasets,
              credentials, or customer materials merely because the governance
              entity is registered.
            </p>

            <p>
              Registration does not transfer ownership of the registrant&apos;s
              intellectual property to TA14 Authority.
            </p>
          </Section>

          <Section number="6" title="Evidence is admitted, not assumed">
            <BulletList
              items={[
                "A registration statement does not automatically become independently established.",
                "A runtime output does not automatically establish the surrounding chronology that produced it.",
                "A hash does not automatically prove that the original information was truthful.",
                "A preserved record does not automatically establish independent attestation.",
              ]}
            />
          </Section>

          <Section number="7" title="Evidence provenance">
            <div className="grid gap-3 md:grid-cols-2">
              {[
                ["REGISTRANT-PRODUCED", "Produced or supplied by the registrant."],
                ["TA14-PRODUCED", "Generated through a TA14 Authority process."],
                ["INDEPENDENTLY PRODUCED", "Originated from a materially independent party."],
                ["INDEPENDENTLY REPRODUCED", "Behavior or result reproduced independently."],
                ["PUBLIC-SOURCE", "Obtained from an attributable public source."],
                ["CROSS-PARTY", "Preserved by more than one party."],
                ["NOT INDEPENDENTLY ESTABLISHED", "Represented in the record but not independently established."],
                ["NOT REPORTED", "Relevant provenance or mechanism was not reported."],
                ["NOT SUBMITTED", "Necessary evidence was not submitted."],
                ["NOT PRESERVED", "The relevant record was not contemporaneously preserved."],
                ["OUTSIDE REVIEW SCOPE", "The matter was not evaluated."],
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

          <Section number="8" title="Material qualifications travel with findings">
            <p>
              A material limitation that changes the meaning of a finding must
              remain attached to the finding it qualifies.
            </p>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="font-medium text-white/85">
                SUPPORTED — registrant-produced evidence; independently
                reproducible under the reviewed test conditions; execution-path
                coverage not independently established.
              </p>
            </div>
          </Section>

          <Section number="9" title="No retrospective evidence manufacturing">
            <p>
              TA14 Authority does not require a registrant to manufacture
              evidence after the fact merely to complete an evidentiary chain.
            </p>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5 font-semibold text-white/85">
              NOT PRESERVED / EVIDENTIARY LIMITATION
            </div>
          </Section>

          <Section number="10" title="Frozen records and later versions">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-center font-semibold text-white/85">
              Frozen Version → Preserved Finding → Later Version
            </div>

            <p>
              A later version does not automatically inherit an earlier PASS,
              favorable finding, evidence sufficiency, production readiness, or
              independent verification.
            </p>
          </Section>

          <Section number="11" title="Publication and withdrawal">
            <p>
              Evidence may carry PUBLIC, CONTROLLED, PRIVATE, REGISTRY-ONLY,
              REVIEW-ONLY, or WITHHELD FROM PUBLICATION status.
            </p>

            <p>
              Withdrawal from future participation does not automatically erase
              historical institutional events that already occurred.
            </p>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              Withdrawal from continuing participation is not the same as
              erasure of historical chronology.
            </div>
          </Section>

          <Section number="12" title="Corrections and participant responses">
            <p>
              A participant may request correction of an objective record error
              without agreeing with TA14 Authority&apos;s substantive finding.
            </p>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-center font-semibold text-white/85">
              TA14 Finding → Participant Response
            </div>
          </Section>

          <Section number="13" title="Fees">
            <div className="overflow-hidden rounded-2xl border border-white/10">
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
          </Section>

          <Section number="14" title="What attests TA14 Authority?">
            <p>
              TA14 Authority does not claim that a record becomes independently
              verified merely because TA14 produced, stored, signed, hashed,
              published, or preserved it.
            </p>

            <p>
              <strong className="text-white">
                Integrity and independence are separate properties.
              </strong>
            </p>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-center text-lg font-medium text-white/85">
              Who independently attests the attester?
            </div>

            <p>
              Where independent verification terminates, that boundary should
              be stated rather than concealed.
            </p>
          </Section>

          <Section number="15" title="TA14 Authority may be wrong">
            <p>
              TA14 Authority does not claim infallibility. Material factual,
              evidentiary, attribution, interpretation, or methodological errors
              may be corrected while preserving the relationship between the
              original and corrected records.
            </p>
          </Section>

          <Section number="16" title="Core institutional principles">
            <div className="grid gap-4 md:grid-cols-2">
              <Principle title="Registration">
                Registration establishes attributable identity, not correctness.
              </Principle>

              <Principle title="Evidence">
                No admissible evidence. No admissible execution.
              </Principle>

              <Principle title="Provenance">
                Distinguish who produced evidence from who evaluated it.
              </Principle>

              <Principle title="Limitation">
                A material limitation must travel with the finding it limits.
              </Principle>

              <Principle title="Version">
                A later implementation does not silently rewrite an earlier
                frozen record.
              </Principle>

              <Principle title="Independence">
                Integrity is not independence.
              </Principle>
            </div>
          </Section>
        </div>

        <footer className="mt-12 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 md:p-8">
          <p className="max-w-4xl text-base leading-7 text-white/70">
            The purpose of these Terms is to make the institutional boundary
            inspectable. Evidence should remain attributable. Limitations should
            remain attached to the conclusions they limit. Closed systems should
            not be forced open merely to participate. Historical records should
            not be silently rewritten.
          </p>

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
