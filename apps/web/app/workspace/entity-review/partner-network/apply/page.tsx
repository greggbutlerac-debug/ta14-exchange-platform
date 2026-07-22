"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type ApplicationStatus = "Draft" | "Ready for Review";

const specialties = [
  "AI governance architecture",
  "Model risk and assurance",
  "Data governance",
  "Cybersecurity",
  "Privacy",
  "Legal and regulatory",
  "Human factors",
  "Operational governance",
  "Safety engineering",
  "Environmental integrity",
  "Healthcare",
  "Financial systems",
  "Building systems",
  "Other",
];

const laneOptions = [
  "Boundary-Only Reviewer",
  "Referral-Only Partner",
  "Scoped Review Candidate",
  "Partner-Track Candidate",
  "Strategic Ecosystem Partner",
  "Unsure — request TA-14 determination",
];

const acknowledgments = [
  "I understand that the $450 fee pays for qualification review and does not guarantee acceptance.",
  "I understand that network participation is limited to a written lane, specialty, authority, and evidence boundary.",
  "I understand that TA-14 may HOLD, DENY, ESCALATE, correct, or remove a partner or finding.",
  "I understand that network participation is not legal certification, regulatory approval, or universal endorsement.",
  "I confirm that the submitted materials are accurate to the best of my knowledge and that I have authority to submit them.",
];

export default function PartnerReviewNetworkApplicationPage() {
  const [organizationName, setOrganizationName] = useState("");
  const [website, setWebsite] = useState("");
  const [applicantName, setApplicantName] = useState("");
  const [applicantTitle, setApplicantTitle] = useState("");
  const [email, setEmail] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [requestedLane, setRequestedLane] = useState(
    "Unsure — request TA-14 determination",
  );
  const [architectureSummary, setArchitectureSummary] = useState("");
  const [reviewMethod, setReviewMethod] = useState("");
  const [proofBoundaries, setProofBoundaries] = useState("");
  const [authorityBoundary, setAuthorityBoundary] = useState("");
  const [correctionProcess, setCorrectionProcess] = useState("");
  const [representativeWork, setRepresentativeWork] = useState("");
  const [conflicts, setConflicts] = useState("");
  const [materials, setMaterials] = useState("");
  const [checked, setChecked] = useState<boolean[]>(
    acknowledgments.map(() => false),
  );

  const requiredFields = [
    organizationName,
    applicantName,
    applicantTitle,
    email,
    specialty,
    architectureSummary,
    reviewMethod,
    proofBoundaries,
    authorityBoundary,
    correctionProcess,
    representativeWork,
  ];

  const completedFields = requiredFields.filter(
    (value) => value.trim().length > 0,
  ).length;

  const acknowledgmentsComplete = checked.every(Boolean);
  const formComplete =
    completedFields === requiredFields.length && acknowledgmentsComplete;

  const status: ApplicationStatus = formComplete
    ? "Ready for Review"
    : "Draft";

  const completion = useMemo(() => {
    const fieldProgress = completedFields / requiredFields.length;
    const acknowledgmentProgress =
      checked.filter(Boolean).length / acknowledgments.length;

    return Math.round((fieldProgress * 0.75 + acknowledgmentProgress * 0.25) * 100);
  }, [completedFields, checked]);

  const toggleAcknowledgment = (index: number) => {
    setChecked((current) =>
      current.map((value, currentIndex) =>
        currentIndex === index ? !value : value,
      ),
    );
  };

  return (
    <main>
      <div className="stars starsOne" />
      <div className="stars starsTwo" />
      <div className="glow glowOne" />
      <div className="glow glowTwo" />

      <header className="topbar shell">
        <Link
          href="/workspace/entity-review/partner-network"
          className="brand"
        >
          <span className="brandMark">TA-14</span>
          <span>
            <strong>Partner Qualification Application</strong>
            <small>Partner Review Network</small>
          </span>
        </Link>

        <nav>
          <Link href="/">Home</Link>
          <Link href="/workspace/entity-review">Entity Review</Link>
          <Link href="/workspace/entity-review/partner-network">
            Partner Network
          </Link>
          <Link href="/workspace/governed-records">Governed Records</Link>
        </nav>
      </header>

      <section className="hero shell">
        <div>
          <p className="eyebrow">QUALIFICATION APPLICATION</p>
          <h1>Show us how your review architecture actually works.</h1>
          <p className="lead">
            Submit your organization, specialty, reviewer identity, method,
            proof boundaries, authority limits, correction process, and
            representative evidence for Partner Review Network qualification.
          </p>
        </div>

        <aside className="statusCard">
          <span className="statusLabel">APPLICATION STATUS</span>
          <strong className={status === "Ready for Review" ? "ready" : "draft"}>
            {status}
          </strong>

          <div className="progressTrack">
            <i style={{ width: `${completion}%` }} />
          </div>

          <p>{completion}% complete</p>
        </aside>
      </section>

      <section className="feeNotice shell">
        <div className="fee">
          <span>$450</span>
          <small>One-time qualification review fee</small>
        </div>

        <div>
          <p className="eyebrow">REVIEW FEE BOUNDARY</p>
          <h2>Payment purchases a qualification review—not acceptance.</h2>
          <p>
            The fee covers review of the submitted architecture, evidence,
            reviewer identity, scope, boundaries, and potential network fit.
            Payment does not guarantee admission, referrals, revenue,
            certification, endorsement, or any specific review lane.
          </p>
        </div>
      </section>

      <section className="application shell">
        <div className="sectionHeader">
          <p className="eyebrow">SECTION 01</p>
          <h2>Applicant and organization</h2>
          <p>
            Identify the organization and the person accountable for this
            submission.
          </p>
        </div>

        <div className="formGrid">
          <label>
            <span>Organization name *</span>
            <input
              value={organizationName}
              onChange={(event) => setOrganizationName(event.target.value)}
              placeholder="Legal or operating name"
            />
          </label>

          <label>
            <span>Website</span>
            <input
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
              placeholder="https://"
            />
          </label>

          <label>
            <span>Applicant name *</span>
            <input
              value={applicantName}
              onChange={(event) => setApplicantName(event.target.value)}
              placeholder="Named accountable applicant"
            />
          </label>

          <label>
            <span>Applicant title or role *</span>
            <input
              value={applicantTitle}
              onChange={(event) => setApplicantTitle(event.target.value)}
              placeholder="Founder, reviewer, counsel, engineer..."
            />
          </label>

          <label>
            <span>Email *</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@example.com"
            />
          </label>

          <label>
            <span>Primary specialty *</span>
            <select
              value={specialty}
              onChange={(event) => setSpecialty(event.target.value)}
            >
              <option value="">Select specialty</option>
              {specialties.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="wide">
            <span>Requested review lane</span>
            <select
              value={requestedLane}
              onChange={(event) => setRequestedLane(event.target.value)}
            >
              {laneOptions.map((lane) => (
                <option key={lane}>{lane}</option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="application shell">
        <div className="sectionHeader">
          <p className="eyebrow">SECTION 02</p>
          <h2>Governance and review architecture</h2>
          <p>
            Explain the architecture you use to produce review findings and
            preserve their boundaries.
          </p>
        </div>

        <div className="formGrid">
          <label className="wide">
            <span>Architecture summary *</span>
            <textarea
              rows={6}
              value={architectureSummary}
              onChange={(event) => setArchitectureSummary(event.target.value)}
              placeholder="Describe the governance or review architecture, its purpose, primary layers, and intended use."
            />
          </label>

          <label className="wide">
            <span>Review method *</span>
            <textarea
              rows={6}
              value={reviewMethod}
              onChange={(event) => setReviewMethod(event.target.value)}
              placeholder="Describe how evidence is received, examined, interpreted, challenged, and converted into a written finding."
            />
          </label>

          <label className="wide">
            <span>Proof and non-proof boundaries *</span>
            <textarea
              rows={6}
              value={proofBoundaries}
              onChange={(event) => setProofBoundaries(event.target.value)}
              placeholder="Explain what your review can establish, what it cannot establish, and how unsupported claims remain visible."
            />
          </label>

          <label className="wide">
            <span>Authority boundary *</span>
            <textarea
              rows={5}
              value={authorityBoundary}
              onChange={(event) => setAuthorityBoundary(event.target.value)}
              placeholder="State who may issue findings, which roles hold authority, and what decisions remain outside your authority."
            />
          </label>
        </div>
      </section>

      <section className="application shell">
        <div className="sectionHeader">
          <p className="eyebrow">SECTION 03</p>
          <h2>Correction, escalation, and representative work</h2>
          <p>
            Demonstrate how your system handles disagreement, correction,
            missing evidence, and findings that exceed present authority.
          </p>
        </div>

        <div className="formGrid">
          <label className="wide">
            <span>Correction and escalation process *</span>
            <textarea
              rows={6}
              value={correctionProcess}
              onChange={(event) => setCorrectionProcess(event.target.value)}
              placeholder="Describe how findings are corrected, superseded, held, denied, or escalated."
            />
          </label>

          <label className="wide">
            <span>Representative work *</span>
            <textarea
              rows={6}
              value={representativeWork}
              onChange={(event) => setRepresentativeWork(event.target.value)}
              placeholder="Describe one or more reviews, assessments, reports, architectures, or governed decisions that best represent your work."
            />
          </label>

          <label className="wide">
            <span>Known conflicts, commercial interests, or limitations</span>
            <textarea
              rows={5}
              value={conflicts}
              onChange={(event) => setConflicts(event.target.value)}
              placeholder="Declare ownership, referral, vendor, client, financial, legal, or professional interests that may affect review independence."
            />
          </label>
        </div>
      </section>

      <section className="application shell">
        <div className="sectionHeader">
          <p className="eyebrow">SECTION 04</p>
          <h2>Supporting materials</h2>
          <p>
            List or link the documents, records, architectures, sample reviews,
            policies, publications, repositories, or other materials TA-14
            should examine.
          </p>
        </div>

        <label>
          <span>Material references</span>
          <textarea
            rows={8}
            value={materials}
            onChange={(event) => setMaterials(event.target.value)}
            placeholder="Provide URLs, file names, record IDs, publication references, or a structured list of supporting materials."
          />
        </label>

        <div className="uploadPlaceholder">
          <span className="uploadIcon">↑</span>
          <strong>Evidence upload connection</strong>
          <p>
            Connect this interface to your authenticated file-storage workflow
            before accepting production submissions.
          </p>
        </div>
      </section>

      <section className="application shell">
        <div className="sectionHeader">
          <p className="eyebrow">SECTION 05</p>
          <h2>Applicant acknowledgments</h2>
          <p>
            Every acknowledgment must be accepted before the application can be
            submitted for qualification review.
          </p>
        </div>

        <div className="acknowledgments">
          {acknowledgments.map((text, index) => (
            <label className="acknowledgment" key={text}>
              <input
                type="checkbox"
                checked={checked[index]}
                onChange={() => toggleAcknowledgment(index)}
              />
              <span>{text}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="reviewSummary shell">
        <div>
          <p className="eyebrow">APPLICATION SUMMARY</p>
          <h2>{status}</h2>
          <p>
            {formComplete
              ? "The required declarations and acknowledgments are complete. Connect payment and submission services before production use."
              : "Complete the required declarations and acknowledgments before advancing to qualification review."}
          </p>
        </div>

        <div className="summaryGrid">
          <span>
            <strong>Organization</strong>
            {organizationName || "Not declared"}
          </span>

          <span>
            <strong>Applicant</strong>
            {applicantName || "Not declared"}
          </span>

          <span>
            <strong>Specialty</strong>
            {specialty || "Not declared"}
          </span>

          <span>
            <strong>Requested lane</strong>
            {requestedLane}
          </span>
        </div>
      </section>

      <section className="submitSection shell">
        <div>
          <p className="eyebrow">QUALIFICATION REVIEW</p>
          <h2>Submit the application and pay the $450 review fee.</h2>
          <p>
            This page currently provides the complete front-end application
            experience. Connect the submission button to authenticated storage,
            payment processing, confirmation, and review-status records before
            production use.
          </p>
        </div>

        <button
          type="button"
          className="submitButton"
          disabled={!formComplete}
        >
          {formComplete
            ? "Continue to Payment and Submission"
            : "Complete Required Fields"}
          <span>→</span>
        </button>
      </section>

      <section className="boundary shell">
        <div>
          <p className="eyebrow">BOUNDARY</p>
          <h2>Submission creates an application record—not network membership.</h2>
        </div>

        <p>
          TA-14 may decline the application, request additional evidence, place
          it on HOLD, recommend a narrower lane, or invite the applicant into an
          observed review process. No applicant may represent itself as a
          Partner Review Network member before written acceptance.
        </p>
      </section>

      <footer className="shell">
        <span>TA-14 Authority Governance Institution</span>
        <Link href="/workspace/entity-review/partner-network">
          Return to Partner Review Network
        </Link>
      </footer>

      <style jsx>{`
        :global(*) {
          box-sizing: border-box;
        }

        :global(html) {
          background: #090a0d;
        }

        :global(body) {
          margin: 0;
          color: #fffaf0;
          background:
            radial-gradient(circle at 12% 8%, rgba(255, 177, 30, 0.12), transparent 28%),
            radial-gradient(circle at 88% 24%, rgba(202, 118, 22, 0.1), transparent 28%),
            linear-gradient(180deg, #090a0d 0%, #11100f 50%, #08090d 100%);
          font-family:
            Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
            "Segoe UI", sans-serif;
        }

        main {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          isolation: isolate;
        }

        .shell {
          width: min(1180px, calc(100% - 36px));
          margin-inline: auto;
          position: relative;
          z-index: 2;
        }

        .stars {
          position: fixed;
          inset: -12%;
          pointer-events: none;
          z-index: -4;
          opacity: 0.34;
        }

        .starsOne {
          background-image:
            radial-gradient(circle, rgba(255,255,255,.72) 0 1px, transparent 1.4px);
          background-size: 92px 92px;
          animation: starDrift 34s linear infinite;
        }

        .starsTwo {
          background-image:
            radial-gradient(circle, rgba(255,183,48,.6) 0 1px, transparent 1.4px);
          background-size: 156px 156px;
          background-position: 39px 58px;
          animation: starDrift 48s linear infinite reverse;
        }

        .glow {
          position: fixed;
          width: 470px;
          height: 470px;
          border-radius: 999px;
          filter: blur(120px);
          opacity: 0.11;
          z-index: -3;
          animation: glowMove 14s ease-in-out infinite alternate;
        }

        .glowOne {
          left: -170px;
          top: -180px;
          background: #ffb31e;
        }

        .glowTwo {
          right: -180px;
          top: 44%;
          background: #ca6f18;
          animation-delay: -6s;
        }

        .topbar {
          min-height: 84px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          border-bottom: 1px solid rgba(190, 160, 112, 0.17);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          color: white;
          text-decoration: none;
        }

        .brandMark {
          min-width: 64px;
          height: 38px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          color: #1a1003;
          background: linear-gradient(135deg, #ffb31f, #ffe7a8);
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.05em;
        }

        .brand > span:last-child {
          display: flex;
          flex-direction: column;
        }

        .brand small {
          color: #958a78;
          margin-top: 2px;
        }

        nav {
          display: flex;
          gap: 22px;
        }

        nav a,
        footer a {
          color: #b9ae9e;
          text-decoration: none;
          font-size: 14px;
        }

        .hero {
          min-height: 520px;
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 48px;
          align-items: center;
          padding: 72px 0 52px;
        }

        .eyebrow {
          margin: 0;
          color: #ffb421;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.18em;
        }

        h1 {
          max-width: 860px;
          margin: 18px 0 22px;
          font-size: clamp(48px, 7vw, 88px);
          line-height: 0.98;
          letter-spacing: -0.06em;
        }

        .lead {
          max-width: 760px;
          margin: 0;
          color: #b5aa9b;
          font-size: 18px;
          line-height: 1.68;
        }

        .statusCard {
          min-height: 250px;
          padding: 34px;
          border-radius: 28px;
          border: 1px solid rgba(255, 186, 48, 0.24);
          background:
            radial-gradient(circle at 50% 30%, rgba(255, 177, 27, 0.11), transparent 46%),
            linear-gradient(180deg, rgba(30, 23, 14, 0.94), rgba(13, 11, 9, 0.98));
          display: flex;
          flex-direction: column;
          justify-content: center;
          box-shadow: 0 28px 70px rgba(0, 0, 0, 0.28);
        }

        .statusLabel {
          color: #b9965b;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.16em;
        }

        .statusCard strong {
          margin-top: 16px;
          font-size: clamp(38px, 5vw, 62px);
          letter-spacing: -0.05em;
        }

        .statusCard strong.draft {
          color: #c6b7a2;
        }

        .statusCard strong.ready {
          color: #84e4b9;
        }

        .progressTrack {
          height: 10px;
          overflow: hidden;
          margin-top: 24px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.07);
        }

        .progressTrack i {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #ffae1e, #ffe2a0);
          transition: width 220ms ease;
        }

        .statusCard p {
          margin: 10px 0 0;
          color: #9c9182;
        }

        .feeNotice,
        .application,
        .reviewSummary,
        .submitSection,
        .boundary {
          border: 1px solid rgba(181, 148, 96, 0.17);
          background:
            linear-gradient(180deg, rgba(24, 20, 15, 0.91), rgba(12, 11, 10, 0.96));
          border-radius: 26px;
          box-shadow: 0 22px 70px rgba(0, 0, 0, 0.24);
        }

        .feeNotice {
          padding: 38px;
          display: grid;
          grid-template-columns: 0.42fr 1.58fr;
          gap: 38px;
          align-items: center;
        }

        .fee {
          min-height: 180px;
          border-radius: 20px;
          border: 1px solid rgba(255, 185, 43, 0.3);
          background: rgba(167, 99, 16, 0.07);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .fee span {
          color: #ffd16b;
          font-size: 66px;
          font-weight: 950;
          letter-spacing: -0.07em;
        }

        .fee small {
          max-width: 170px;
          color: #a99a85;
          line-height: 1.45;
        }

        .feeNotice h2,
        .sectionHeader h2,
        .reviewSummary h2,
        .submitSection h2,
        .boundary h2 {
          margin: 14px 0 14px;
          font-size: clamp(30px, 4.7vw, 50px);
          line-height: 1.05;
          letter-spacing: -0.045em;
        }

        .feeNotice p:not(.eyebrow),
        .sectionHeader p,
        .reviewSummary p,
        .submitSection p,
        .boundary > p {
          color: #b4aa9d;
          line-height: 1.68;
        }

        .application {
          margin-top: 22px;
          padding: 42px;
        }

        .sectionHeader {
          max-width: 840px;
        }

        .sectionHeader p {
          margin-bottom: 0;
        }

        .formGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
          margin-top: 28px;
        }

        label {
          display: grid;
          gap: 9px;
        }

        label > span {
          color: #c9bba9;
          font-size: 12px;
          font-weight: 800;
        }

        .wide {
          grid-column: 1 / -1;
        }

        input,
        select,
        textarea {
          width: 100%;
          border-radius: 13px;
          border: 1px solid rgba(180, 149, 103, 0.2);
          background: rgba(8, 8, 7, 0.84);
          color: #fff8ec;
          outline: none;
          font: inherit;
        }

        input,
        select {
          min-height: 50px;
          padding: 0 14px;
        }

        textarea {
          padding: 14px;
          resize: vertical;
        }

        input:focus,
        select:focus,
        textarea:focus {
          border-color: rgba(255, 183, 43, 0.54);
          box-shadow: 0 0 0 3px rgba(255, 180, 34, 0.07);
        }

        .uploadPlaceholder {
          min-height: 190px;
          margin-top: 20px;
          padding: 30px;
          border-radius: 18px;
          border: 1px dashed rgba(255, 184, 42, 0.3);
          background: rgba(165, 98, 16, 0.035);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .uploadIcon {
          width: 48px;
          height: 48px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 184, 42, 0.28);
          color: #ffc457;
          font-size: 25px;
        }

        .uploadPlaceholder strong {
          margin-top: 14px;
          font-size: 19px;
        }

        .uploadPlaceholder p {
          max-width: 620px;
          margin: 8px 0 0;
          color: #9e9282;
          line-height: 1.58;
        }

        .acknowledgments {
          display: grid;
          gap: 12px;
          margin-top: 28px;
        }

        .acknowledgment {
          display: grid;
          grid-template-columns: 24px 1fr;
          gap: 12px;
          align-items: start;
          padding: 18px;
          border-radius: 16px;
          border: 1px solid rgba(179, 145, 95, 0.15);
          background: rgba(255, 255, 255, 0.018);
          cursor: pointer;
        }

        .acknowledgment input {
          width: 19px;
          height: 19px;
          min-height: 0;
          margin-top: 1px;
          accent-color: #ffb421;
        }

        .acknowledgment span {
          color: #d7c9b8;
          font-size: 14px;
          line-height: 1.55;
        }

        .reviewSummary,
        .boundary {
          margin-top: 22px;
          padding: 42px;
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 36px;
          align-items: center;
        }

        .summaryGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .summaryGrid span {
          min-height: 96px;
          padding: 18px;
          border-radius: 16px;
          border: 1px solid rgba(180, 148, 101, 0.15);
          background: rgba(255, 255, 255, 0.02);
          color: #d9cbb8;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .summaryGrid strong {
          margin-bottom: 6px;
          color: #a99882;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .submitSection {
          margin-top: 74px;
          padding: 52px 46px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 34px;
        }

        .submitSection > div {
          max-width: 750px;
        }

        .submitButton {
          min-height: 58px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
          border: 0;
          border-radius: 14px;
          padding: 0 22px;
          color: #1b1002;
          background: linear-gradient(135deg, #ffb51f, #ffe6a4);
          box-shadow: 0 14px 38px rgba(255, 174, 28, 0.18);
          font: inherit;
          font-weight: 900;
          cursor: pointer;
        }

        .submitButton:disabled {
          color: #796f61;
          background: #2a2722;
          box-shadow: none;
          cursor: not-allowed;
        }

        .boundary > p {
          margin: 0;
        }

        footer {
          min-height: 120px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          color: #887d6e;
          font-size: 12px;
        }

        @keyframes starDrift {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(90px, 140px, 0);
          }
        }

        @keyframes glowMove {
          from {
            transform: translate3d(0, 0, 0) scale(1);
          }
          to {
            transform: translate3d(55px, 35px, 0) scale(1.1);
          }
        }

        @media (max-width: 900px) {
          nav {
            display: none;
          }

          .hero,
          .feeNotice,
          .reviewSummary,
          .boundary {
            grid-template-columns: 1fr;
          }

          .submitSection {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 680px) {
          .shell {
            width: min(100% - 20px, 1180px);
          }

          .hero {
            min-height: auto;
            padding: 58px 0;
          }

          .feeNotice,
          .application,
          .reviewSummary,
          .submitSection,
          .boundary {
            padding: 28px 24px;
          }

          .formGrid,
          .summaryGrid {
            grid-template-columns: 1fr;
          }

          .wide {
            grid-column: auto;
          }

          footer {
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
          }
        }
      `}</style>
    </main>
  );
}
