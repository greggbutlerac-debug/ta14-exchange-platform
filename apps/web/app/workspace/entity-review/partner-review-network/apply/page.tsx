/* TA-14 PARTNER REVIEW NETWORK APPLICATION - QUESTIONNAIRE + DRAG AND DROP - 2026-07-21 */
'use client';

import Link from 'next/link';
import {
  ChangeEvent,
  DragEvent,
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from 'react';

type UploadedFile = {
  id: string;
  name: string;
  size: number;
  type: string;
  lastModified: number;
};

type ApplicationForm = {
  organizationName: string;
  website: string;
  contactName: string;
  contactTitle: string;
  email: string;
  phone: string;
  country: string;
  organizationType: string;
  yearsOperating: string;
  reviewDomain: string;
  secondaryDomains: string;
  governanceSummary: string;
  methodology: string;
  evidencePractices: string;
  uncertaintyPractices: string;
  authorityBoundary: string;
  escalationPractice: string;
  conflictPractice: string;
  representativeWork: string;
  desiredLane: string;
  additionalContext: string;
  certifyAccuracy: boolean;
  acceptAdverseOutcome: boolean;
  acceptNoGuarantee: boolean;
  acceptBoundedAuthority: boolean;
};

const STORAGE_KEY = 'ta14-partner-review-network-application-v1';

const initialForm: ApplicationForm = {
  organizationName: '',
  website: '',
  contactName: '',
  contactTitle: '',
  email: '',
  phone: '',
  country: '',
  organizationType: '',
  yearsOperating: '',
  reviewDomain: '',
  secondaryDomains: '',
  governanceSummary: '',
  methodology: '',
  evidencePractices: '',
  uncertaintyPractices: '',
  authorityBoundary: '',
  escalationPractice: '',
  conflictPractice: '',
  representativeWork: '',
  desiredLane: '',
  additionalContext: '',
  certifyAccuracy: false,
  acceptAdverseOutcome: false,
  acceptNoGuarantee: false,
  acceptBoundedAuthority: false,
};

const supportedFileTypes = [
  '.pdf',
  '.doc',
  '.docx',
  '.txt',
  '.md',
  '.csv',
  '.xlsx',
  '.ppt',
  '.pptx',
  '.json',
  '.zip',
];

const maxFileSize = 25 * 1024 * 1024;
const maxFiles = 12;

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 bytes';
  const units = ['bytes', 'KB', 'MB', 'GB'];
  const order = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  const value = bytes / 1024 ** order;
  return `${value.toFixed(order === 0 ? 0 : 1)} ${units[order]}`;
}

function createFileRecord(file: File): UploadedFile {
  return {
    id: `${file.name}-${file.size}-${file.lastModified}-${crypto.randomUUID()}`,
    name: file.name,
    size: file.size,
    type: file.type || 'Unknown',
    lastModified: file.lastModified,
  };
}

export default function PartnerReviewNetworkApplicationPage() {
  const [form, setForm] = useState<ApplicationForm>(initialForm);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [message, setMessage] = useState('');
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as {
          form?: Partial<ApplicationForm>;
          files?: UploadedFile[];
        };
        setForm({ ...initialForm, ...(parsed.form || {}) });
        setFiles(Array.isArray(parsed.files) ? parsed.files : []);
      }
    } catch {
      setMessage(
        'A previous local draft could not be loaded. You may continue with a new application.',
      );
    } finally {
      setHasLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!hasLoaded) return;
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        form,
        files,
        savedAt: new Date().toISOString(),
      }),
    );
  }, [files, form, hasLoaded]);

  const requiredFieldsComplete = useMemo(() => {
    return Boolean(
      form.organizationName.trim() &&
        form.contactName.trim() &&
        form.email.trim() &&
        form.organizationType &&
        form.reviewDomain.trim() &&
        form.governanceSummary.trim() &&
        form.methodology.trim() &&
        form.evidencePractices.trim() &&
        form.authorityBoundary.trim() &&
        form.desiredLane,
    );
  }, [form]);

  const acknowledgementsComplete =
    form.certifyAccuracy &&
    form.acceptAdverseOutcome &&
    form.acceptNoGuarantee &&
    form.acceptBoundedAuthority;

  const completionItems = [
    Boolean(form.organizationName.trim()),
    Boolean(form.contactName.trim()),
    Boolean(form.email.trim()),
    Boolean(form.organizationType),
    Boolean(form.reviewDomain.trim()),
    Boolean(form.governanceSummary.trim()),
    Boolean(form.methodology.trim()),
    Boolean(form.evidencePractices.trim()),
    Boolean(form.authorityBoundary.trim()),
    Boolean(form.desiredLane),
    files.length > 0,
    acknowledgementsComplete,
  ];

  const completionPercent = Math.round(
    (completionItems.filter(Boolean).length / completionItems.length) * 100,
  );

  function updateField(
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const target = event.target;
    const value =
      target instanceof HTMLInputElement && target.type === 'checkbox'
        ? target.checked
        : target.value;

    setForm((current) => ({
      ...current,
      [target.name]: value,
    }));
    setMessage('');
  }

  function validateAndAddFiles(incoming: File[]) {
    const accepted: UploadedFile[] = [];
    const rejected: string[] = [];

    incoming.forEach((file) => {
      const extension = `.${file.name.split('.').pop()?.toLowerCase() || ''}`;

      if (!supportedFileTypes.includes(extension)) {
        rejected.push(`${file.name}: unsupported file type`);
        return;
      }

      if (file.size > maxFileSize) {
        rejected.push(`${file.name}: exceeds 25 MB`);
        return;
      }

      accepted.push(createFileRecord(file));
    });

    setFiles((current) => {
      const remainingSlots = Math.max(0, maxFiles - current.length);
      const added = accepted.slice(0, remainingSlots);
      if (accepted.length > remainingSlots) {
        rejected.push(
          `${accepted.length - remainingSlots} file(s): maximum of ${maxFiles} attachments reached`,
        );
      }
      return [...current, ...added];
    });

    if (rejected.length) {
      setMessage(rejected.join(' · '));
    } else if (accepted.length) {
      setMessage(
        `${accepted.length} file${accepted.length === 1 ? '' : 's'} added to this local draft.`,
      );
    }
  }

  function handleFileInput(event: ChangeEvent<HTMLInputElement>) {
    validateAndAddFiles(Array.from(event.target.files || []));
    event.target.value = '';
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragActive(true);
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragActive(false);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragActive(false);
    validateAndAddFiles(Array.from(event.dataTransfer.files || []));
  }

  function removeFile(id: string) {
    setFiles((current) => current.filter((file) => file.id !== id));
    setMessage('Attachment removed from this local draft.');
  }

  function clearDraft() {
    if (
      !window.confirm(
        'Clear this entire locally saved application draft? This cannot be undone.',
      )
    ) {
      return;
    }

    setForm(initialForm);
    setFiles([]);
    window.localStorage.removeItem(STORAGE_KEY);
    setMessage('Local application draft cleared.');
  }

  function downloadPackage() {
    const packageContents = {
      packageType: 'TA-14 Partner Review Network Qualification Application',
      version: '1.0',
      generatedAt: new Date().toISOString(),
      qualificationReviewFee: 450,
      application: form,
      attachmentManifest: files,
      boundaryNotice:
        'This locally generated package is not a submitted application and does not represent payment, acceptance, certification, or Partner Review Network admission.',
    };

    const blob = new Blob([JSON.stringify(packageContents, null, 2)], {
      type: 'application/json',
    });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = `TA-14-Partner-Qualification-${form.organizationName
      .trim()
      .replace(/[^a-z0-9]+/gi, '-')
      .replace(/^-|-$/g, '') || 'Draft'}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(href);
    setMessage('A local qualification package was generated and downloaded.');
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!requiredFieldsComplete) {
      setMessage(
        'Complete every required field before preparing the qualification package.',
      );
      document
        .querySelector<HTMLElement>('[data-first-required="true"]')
        ?.focus();
      return;
    }

    if (!files.length) {
      setMessage(
        'Attach at least one supporting document before preparing the qualification package.',
      );
      document.getElementById('supporting-materials')?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      return;
    }

    if (!acknowledgementsComplete) {
      setMessage(
        'Accept all four qualification acknowledgements before continuing.',
      );
      document.getElementById('acknowledgements')?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      return;
    }

    downloadPackage();
  }

  return (
    <>
      <main className="application-page">
        <div className="star-layer star-layer-one" aria-hidden="true" />
        <div className="star-layer star-layer-two" aria-hidden="true" />
        <div className="orbit orbit-one" aria-hidden="true" />
        <div className="orbit orbit-two" aria-hidden="true" />

        <header className="topbar">
          <Link href="/" className="brand">
            <span className="brand-mark">TA-14</span>
            <span>
              <strong>Partner Review Network</strong>
              <small>Qualification application</small>
            </span>
          </Link>

          <div className="top-actions">
            <Link
              href="/workspace/entity-review/partner-review-network/pricing"
              className="nav-button"
            >
              Review pricing
            </Link>
            <Link href="/workspace/entity-review" className="nav-button">
              Entity Review Center
            </Link>
          </div>
        </header>

        <section className="intro">
          <div className="intro-copy">
            <div className="eyebrow">PARTNER QUALIFICATION QUESTIONNAIRE</div>
            <h1>Bring the evidence behind your governance practice.</h1>
            <p>
              Declare the work you are qualified to review, the boundaries you will
              not cross, the evidence supporting your methods, and how you preserve
              uncertainty when the record does not support a conclusion.
            </p>
          </div>

          <aside className="status-card">
            <div className="status-row">
              <span>Application progress</span>
              <strong>{completionPercent}%</strong>
            </div>
            <div
              className="progress-track"
              aria-label={`Application ${completionPercent}% complete`}
            >
              <span style={{ width: `${completionPercent}%` }} />
            </div>
            <p>
              Your answers and attachment manifest are saved only in this browser as
              a local draft.
            </p>
          </aside>
        </section>

        <div className="boundary-banner">
          <span aria-hidden="true">◇</span>
          <p>
            <strong>Important:</strong> This page currently prepares a local
            qualification package. It does not upload files, process the $450 fee,
            transmit an application, or guarantee acceptance. Those connections must
            be added through the approved storage, payment, and review workflow.
          </p>
        </div>

        {message ? (
          <div className="message" role="status" aria-live="polite">
            {message}
          </div>
        ) : null}

        <form className="application-form" onSubmit={handleSubmit}>
          <section className="form-section">
            <div className="section-number">01</div>
            <div className="section-heading">
              <div className="eyebrow">APPLICANT IDENTITY</div>
              <h2>Who is asking to enter the network?</h2>
              <p>
                Identify the organization and the accountable person responsible for
                this application.
              </p>
            </div>

            <div className="form-grid">
              <label className="field field-wide">
                <span>Organization name *</span>
                <input
                  data-first-required="true"
                  name="organizationName"
                  value={form.organizationName}
                  onChange={updateField}
                  placeholder="Legal or operating name"
                  required
                />
              </label>

              <label className="field">
                <span>Organization website</span>
                <input
                  name="website"
                  value={form.website}
                  onChange={updateField}
                  placeholder="https://"
                  type="url"
                />
              </label>

              <label className="field">
                <span>Organization type *</span>
                <select
                  name="organizationType"
                  value={form.organizationType}
                  onChange={updateField}
                  required
                >
                  <option value="">Choose one</option>
                  <option>AI governance organization</option>
                  <option>Independent governance consultant</option>
                  <option>Cybersecurity organization</option>
                  <option>Evidence or assurance specialist</option>
                  <option>Controls or built-environment specialist</option>
                  <option>Runtime or software platform</option>
                  <option>Academic or research organization</option>
                  <option>Legal, risk, or compliance organization</option>
                  <option>Domain-specific professional organization</option>
                  <option>Other</option>
                </select>
              </label>

              <label className="field">
                <span>Primary contact name *</span>
                <input
                  name="contactName"
                  value={form.contactName}
                  onChange={updateField}
                  placeholder="Accountable applicant"
                  required
                />
              </label>

              <label className="field">
                <span>Title or role</span>
                <input
                  name="contactTitle"
                  value={form.contactTitle}
                  onChange={updateField}
                  placeholder="Founder, reviewer, director..."
                />
              </label>

              <label className="field">
                <span>Email address *</span>
                <input
                  name="email"
                  value={form.email}
                  onChange={updateField}
                  placeholder="name@organization.com"
                  type="email"
                  required
                />
              </label>

              <label className="field">
                <span>Phone</span>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={updateField}
                  placeholder="Optional"
                  type="tel"
                />
              </label>

              <label className="field">
                <span>Country or jurisdiction</span>
                <input
                  name="country"
                  value={form.country}
                  onChange={updateField}
                  placeholder="Where the organization operates"
                />
              </label>

              <label className="field">
                <span>Years operating</span>
                <select
                  name="yearsOperating"
                  value={form.yearsOperating}
                  onChange={updateField}
                >
                  <option value="">Choose one</option>
                  <option>Less than 1 year</option>
                  <option>1–2 years</option>
                  <option>3–5 years</option>
                  <option>6–10 years</option>
                  <option>More than 10 years</option>
                </select>
              </label>
            </div>
          </section>

          <section className="form-section">
            <div className="section-number">02</div>
            <div className="section-heading">
              <div className="eyebrow">DECLARED REVIEW DOMAIN</div>
              <h2>What are you actually qualified to review?</h2>
              <p>
                Do not describe the entire governance market. State the bounded domain
                in which your methods and evidence support review authority.
              </p>
            </div>

            <div className="form-grid">
              <label className="field field-wide">
                <span>Primary review domain *</span>
                <input
                  name="reviewDomain"
                  value={form.reviewDomain}
                  onChange={updateField}
                  placeholder="Example: AI agent authorization and tool-use boundaries"
                  required
                />
              </label>

              <label className="field field-wide">
                <span>Secondary domains</span>
                <input
                  name="secondaryDomains"
                  value={form.secondaryDomains}
                  onChange={updateField}
                  placeholder="List only domains supported by evidence"
                />
              </label>

              <label className="field field-wide">
                <span>Governance practice summary *</span>
                <textarea
                  name="governanceSummary"
                  value={form.governanceSummary}
                  onChange={updateField}
                  placeholder="Explain what your practice governs, for whom, and at what point in the consequence-bearing route."
                  rows={6}
                  required
                />
              </label>

              <label className="field">
                <span>Desired Partner Review Network lane *</span>
                <select
                  name="desiredLane"
                  value={form.desiredLane}
                  onChange={updateField}
                  required
                >
                  <option value="">Choose one</option>
                  <option>Boundary-only specialist</option>
                  <option>Referral-only specialist</option>
                  <option>Scoped review candidate</option>
                  <option>Partner-track candidate</option>
                  <option>Strategic ecosystem partner</option>
                  <option>Unsure — request lane determination</option>
                </select>
              </label>

              <label className="field">
                <span>Representative work</span>
                <textarea
                  name="representativeWork"
                  value={form.representativeWork}
                  onChange={updateField}
                  placeholder="Briefly identify prior projects, publications, reviews, or systems."
                  rows={5}
                />
              </label>
            </div>
          </section>

          <section className="form-section">
            <div className="section-number">03</div>
            <div className="section-heading">
              <div className="eyebrow">METHOD AND EVIDENCE</div>
              <h2>How do you reach a bounded finding?</h2>
              <p>
                Explain the repeatable method behind your work—not merely the
                conclusions you prefer to reach.
              </p>
            </div>

            <div className="form-grid">
              <label className="field field-wide">
                <span>Review methodology *</span>
                <textarea
                  name="methodology"
                  value={form.methodology}
                  onChange={updateField}
                  placeholder="Describe your sequence, tests, rules, thresholds, reviewer roles, correction process, and determination method."
                  rows={7}
                  required
                />
              </label>

              <label className="field field-wide">
                <span>Evidence qualification and provenance practices *</span>
                <textarea
                  name="evidencePractices"
                  value={form.evidencePractices}
                  onChange={updateField}
                  placeholder="How do you establish relevance, attribution, freshness, continuity, integrity, and connection to the reviewed object?"
                  rows={7}
                  required
                />
              </label>

              <label className="field">
                <span>Uncertainty-preservation practice</span>
                <textarea
                  name="uncertaintyPractices"
                  value={form.uncertaintyPractices}
                  onChange={updateField}
                  placeholder="How do you distinguish proven, assumed, unknown, private, and outside-scope material?"
                  rows={6}
                />
              </label>

              <label className="field">
                <span>Escalation practice</span>
                <textarea
                  name="escalationPractice"
                  value={form.escalationPractice}
                  onChange={updateField}
                  placeholder="When must the matter be held, denied, escalated, or referred to another specialist?"
                  rows={6}
                />
              </label>
            </div>
          </section>

          <section className="form-section">
            <div className="section-number">04</div>
            <div className="section-heading">
              <div className="eyebrow">BOUNDARIES AND ACCOUNTABILITY</div>
              <h2>Where does your authority stop?</h2>
              <p>
                A qualified reviewer must be able to declare limits as clearly as
                capabilities.
              </p>
            </div>

            <div className="form-grid">
              <label className="field field-wide">
                <span>Reviewer authority and boundary statement *</span>
                <textarea
                  name="authorityBoundary"
                  value={form.authorityBoundary}
                  onChange={updateField}
                  placeholder="State what you can determine, what you cannot determine, required dependencies, excluded domains, and when your review becomes inadmissible."
                  rows={7}
                  required
                />
              </label>

              <label className="field">
                <span>Conflict-of-interest practice</span>
                <textarea
                  name="conflictPractice"
                  value={form.conflictPractice}
                  onChange={updateField}
                  placeholder="How are financial, technical, organizational, or personal conflicts declared and handled?"
                  rows={6}
                />
              </label>

              <label className="field">
                <span>Additional context</span>
                <textarea
                  name="additionalContext"
                  value={form.additionalContext}
                  onChange={updateField}
                  placeholder="Anything else TA-14 should understand before reviewing the application."
                  rows={6}
                />
              </label>
            </div>
          </section>

          <section id="supporting-materials" className="form-section">
            <div className="section-number">05</div>
            <div className="section-heading">
              <div className="eyebrow">SUPPORTING MATERIAL</div>
              <h2>Upload the evidence behind the application.</h2>
              <p>
                Add representative methods, reports, frameworks, architectures,
                evidence packages, publications, or anonymized prior work.
              </p>
            </div>

            <div
              className={`drop-zone ${dragActive ? 'drop-zone-active' : ''}`}
              onDragOver={handleDragOver}
              onDragEnter={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="drop-icon" aria-hidden="true">⇧</div>
              <h3>Drag and drop supporting files here</h3>
              <p>
                Up to {maxFiles} files, 25 MB each. Accepted: {supportedFileTypes.join(', ')}
              </p>
              <label className="file-button">
                Choose files
                <input
                  type="file"
                  multiple
                  accept={supportedFileTypes.join(',')}
                  onChange={handleFileInput}
                />
              </label>
            </div>

            {files.length ? (
              <div className="file-list">
                <div className="file-list-heading">
                  <strong>Local attachment manifest</strong>
                  <span>
                    {files.length} of {maxFiles} files
                  </span>
                </div>

                {files.map((file) => (
                  <article className="file-row" key={file.id}>
                    <div className="file-symbol" aria-hidden="true">DOC</div>
                    <div className="file-copy">
                      <strong>{file.name}</strong>
                      <span>
                        {formatBytes(file.size)} ·{' '}
                        {new Date(file.lastModified).toLocaleDateString()}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="remove-file"
                      onClick={() => removeFile(file.id)}
                      aria-label={`Remove ${file.name}`}
                    >
                      Remove
                    </button>
                  </article>
                ))}
              </div>
            ) : (
              <p className="empty-files">
                No supporting material has been added to this local draft.
              </p>
            )}
          </section>

          <section id="acknowledgements" className="form-section">
            <div className="section-number">06</div>
            <div className="section-heading">
              <div className="eyebrow">QUALIFICATION ACKNOWLEDGEMENTS</div>
              <h2>Accept the boundary before proceeding.</h2>
            </div>

            <div className="acknowledgement-list">
              <label>
                <input
                  type="checkbox"
                  name="certifyAccuracy"
                  checked={form.certifyAccuracy}
                  onChange={updateField}
                />
                <span>
                  I certify that the information and supporting material are accurate
                  to the best of my knowledge and may be evaluated as submitted.
                </span>
              </label>

              <label>
                <input
                  type="checkbox"
                  name="acceptAdverseOutcome"
                  checked={form.acceptAdverseOutcome}
                  onChange={updateField}
                />
                <span>
                  I understand that the result may be QUALIFIED, QUALIFIED WITH
                  CONDITIONS, DEFERRED, or NOT QUALIFIED.
                </span>
              </label>

              <label>
                <input
                  type="checkbox"
                  name="acceptNoGuarantee"
                  checked={form.acceptNoGuarantee}
                  onChange={updateField}
                />
                <span>
                  I understand that the $450 qualification review fee purchases review
                  only and does not guarantee acceptance, certification, assignments,
                  referrals, revenue, or a favorable finding.
                </span>
              </label>

              <label>
                <input
                  type="checkbox"
                  name="acceptBoundedAuthority"
                  checked={form.acceptBoundedAuthority}
                  onChange={updateField}
                />
                <span>
                  I agree that any approved participation is limited to the review lane,
                  authority, scope, conditions, and boundaries expressly granted.
                </span>
              </label>
            </div>
          </section>

          <section className="submission-panel">
            <div>
              <div className="eyebrow">LOCAL PACKAGE PREPARATION</div>
              <h2>Prepare the application for the connected submission workflow.</h2>
              <p>
                This step validates required fields and creates a downloadable JSON
                package containing your answers and attachment manifest. The actual
                file bytes remain on your device.
              </p>
            </div>

            <div className="submission-actions">
              <button type="button" className="button button-quiet" onClick={clearDraft}>
                Clear local draft
              </button>
              <button type="submit" className="button button-primary">
                Prepare qualification package
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </section>
        </form>

        <footer className="footer">
          <div>
            <strong>TA-14 Authority Governance Institution</strong>
            <p>No admissible evidence. No admissible execution.</p>
          </div>
          <div className="footer-links">
            <Link href="/">Exchange Home</Link>
            <Link href="/workspace/entity-review/partner-review-network/pricing">
              Qualification & Pricing
            </Link>
            <Link href="/workspace/entity-review">Entity Review Center</Link>
          </div>
        </footer>
      </main>

      <style>{`
        :root {
          color-scheme: dark;
        }

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: #050b15;
        }

        button,
        input,
        textarea,
        select {
          font: inherit;
        }

        .application-page {
          --bg: #050b15;
          --surface: rgba(9, 18, 33, 0.92);
          --surface-soft: rgba(12, 25, 43, 0.72);
          --line: rgba(145, 177, 211, 0.18);
          --line-strong: rgba(145, 177, 211, 0.3);
          --text: #f6f8ff;
          --muted: #a9b7ca;
          --mint: #67e6c5;
          --gold: #ffbf3f;
          min-height: 100vh;
          overflow: hidden;
          position: relative;
          color: var(--text);
          background:
            radial-gradient(circle at 50% -10%, rgba(20, 101, 128, .16), transparent 34rem),
            radial-gradient(circle at 100% 52%, rgba(255, 191, 63, .07), transparent 30rem),
            linear-gradient(180deg, #07101f 0%, #050b15 52%, #03070e 100%);
          font-family:
            Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
            sans-serif;
        }

        .star-layer {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: .36;
          background-repeat: repeat;
        }

        .star-layer-one {
          background-image:
            radial-gradient(circle, rgba(255,255,255,.55) 0 1px, transparent 1.4px),
            radial-gradient(circle, rgba(103,230,197,.46) 0 1px, transparent 1.5px);
          background-size: 210px 210px, 330px 330px;
          background-position: 18px 40px, 120px 170px;
          animation: driftOne 60s linear infinite;
        }

        .star-layer-two {
          background-image:
            radial-gradient(circle, rgba(255,191,63,.32) 0 1px, transparent 1.6px);
          background-size: 430px 430px;
          background-position: 180px 90px;
          animation: driftTwo 75s linear infinite;
        }

        .orbit {
          position: absolute;
          width: 48rem;
          height: 48rem;
          border: 1px solid rgba(103,230,197,.07);
          border-radius: 999px;
          pointer-events: none;
        }

        .orbit-one {
          left: -31rem;
          top: 29rem;
        }

        .orbit-two {
          right: -34rem;
          top: 118rem;
          border-color: rgba(255,191,63,.07);
        }

        .topbar,
        .intro,
        .boundary-banner,
        .message,
        .application-form,
        .footer {
          width: min(1180px, calc(100% - 40px));
          margin-inline: auto;
          position: relative;
          z-index: 2;
        }

        .topbar {
          min-height: 88px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          border-bottom: 1px solid var(--line);
        }

        .brand {
          display: inline-flex;
          align-items: center;
          gap: 13px;
          color: inherit;
          text-decoration: none;
        }

        .brand-mark {
          display: grid;
          place-items: center;
          min-width: 65px;
          height: 43px;
          border-radius: 12px;
          border: 1px solid rgba(103,230,197,.4);
          background: rgba(103,230,197,.06);
          color: var(--mint);
          font-weight: 950;
          letter-spacing: .05em;
        }

        .brand > span:last-child {
          display: grid;
          gap: 3px;
        }

        .brand strong {
          font-size: .95rem;
        }

        .brand small {
          color: var(--muted);
          font-size: .73rem;
          text-transform: uppercase;
          letter-spacing: .09em;
        }

        .top-actions,
        .footer-links {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 8px;
        }

        .nav-button,
        .footer-links a {
          min-height: 40px;
          display: inline-flex;
          align-items: center;
          border: 1px solid transparent;
          border-radius: 999px;
          padding: 0 13px;
          color: var(--muted);
          text-decoration: none;
          font-size: .84rem;
          transition: .2s ease;
        }

        .nav-button:hover,
        .nav-button:focus-visible,
        .footer-links a:hover,
        .footer-links a:focus-visible {
          color: var(--text);
          border-color: rgba(103,230,197,.3);
          background: rgba(103,230,197,.06);
          outline: none;
        }

        .intro {
          padding: 86px 0 44px;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 340px;
          gap: 62px;
          align-items: end;
        }

        .eyebrow {
          color: var(--mint);
          font-weight: 950;
          letter-spacing: .14em;
          text-transform: uppercase;
          font-size: .77rem;
        }

        .intro h1 {
          max-width: 820px;
          margin: 14px 0 20px;
          font-size: clamp(2.8rem, 6vw, 5.6rem);
          line-height: .97;
          letter-spacing: -.055em;
        }

        .intro-copy > p {
          max-width: 800px;
          margin: 0;
          color: var(--muted);
          font-size: 1.12rem;
          line-height: 1.75;
        }

        .status-card {
          border: 1px solid var(--line);
          border-radius: 20px;
          padding: 24px;
          background: var(--surface);
          box-shadow: 0 24px 60px rgba(0,0,0,.2);
        }

        .status-row {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 14px;
          color: var(--muted);
          font-size: .9rem;
        }

        .status-row strong {
          color: var(--gold);
        }

        .progress-track {
          height: 10px;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(255,255,255,.06);
        }

        .progress-track span {
          height: 100%;
          display: block;
          border-radius: inherit;
          background: linear-gradient(90deg, var(--mint), var(--gold));
          box-shadow: 0 0 20px rgba(103,230,197,.22);
          transition: width .25s ease;
        }

        .status-card p {
          margin: 15px 0 0;
          color: var(--muted);
          line-height: 1.55;
          font-size: .82rem;
        }

        .boundary-banner,
        .message {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          margin-bottom: 20px;
          border-radius: 16px;
          padding: 17px 19px;
        }

        .boundary-banner {
          border: 1px solid rgba(255,191,63,.24);
          background: rgba(255,191,63,.055);
        }

        .boundary-banner > span {
          color: var(--gold);
          font-size: 1.3rem;
        }

        .boundary-banner p,
        .message {
          color: #ccd5e2;
          line-height: 1.6;
          font-size: .9rem;
        }

        .boundary-banner p {
          margin: 0;
        }

        .message {
          border: 1px solid rgba(103,230,197,.25);
          background: rgba(103,230,197,.06);
        }

        .application-form {
          display: grid;
          gap: 18px;
          padding: 14px 0 74px;
        }

        .form-section,
        .submission-panel {
          position: relative;
          border: 1px solid var(--line);
          border-radius: 26px;
          padding: clamp(28px, 5vw, 52px);
          background:
            linear-gradient(180deg, rgba(12,24,42,.94), rgba(6,14,27,.91));
          box-shadow: 0 26px 70px rgba(0,0,0,.2);
        }

        .section-number {
          position: absolute;
          top: 28px;
          right: 30px;
          color: rgba(255,255,255,.08);
          font-size: clamp(3rem, 7vw, 6rem);
          line-height: 1;
          font-weight: 950;
          letter-spacing: -.08em;
        }

        .section-heading {
          max-width: 760px;
          margin-bottom: 32px;
          position: relative;
          z-index: 1;
        }

        .section-heading h2,
        .submission-panel h2 {
          margin: 12px 0 12px;
          font-size: clamp(2rem, 4vw, 3.7rem);
          line-height: 1.02;
          letter-spacing: -.045em;
        }

        .section-heading p,
        .submission-panel p {
          margin: 0;
          color: var(--muted);
          line-height: 1.68;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
          position: relative;
          z-index: 1;
        }

        .field {
          display: grid;
          gap: 9px;
        }

        .field-wide {
          grid-column: 1 / -1;
        }

        .field > span {
          color: #dce4f0;
          font-size: .88rem;
          font-weight: 800;
        }

        .field input,
        .field textarea,
        .field select {
          width: 100%;
          border: 1px solid var(--line-strong);
          border-radius: 13px;
          padding: 14px 15px;
          color: var(--text);
          background: rgba(3,9,18,.67);
          outline: none;
          transition: .2s ease;
        }

        .field textarea {
          min-height: 132px;
          resize: vertical;
          line-height: 1.55;
        }

        .field input::placeholder,
        .field textarea::placeholder {
          color: #6f7f96;
        }

        .field input:focus,
        .field textarea:focus,
        .field select:focus {
          border-color: rgba(103,230,197,.62);
          box-shadow: 0 0 0 4px rgba(103,230,197,.08);
        }

        .drop-zone {
          border: 1px dashed rgba(103,230,197,.38);
          border-radius: 20px;
          padding: 46px 24px;
          text-align: center;
          background:
            radial-gradient(circle at 50% 0, rgba(103,230,197,.08), transparent 15rem),
            rgba(3,9,18,.48);
          transition: .2s ease;
        }

        .drop-zone-active {
          transform: translateY(-2px);
          border-color: var(--gold);
          background:
            radial-gradient(circle at 50% 0, rgba(255,191,63,.11), transparent 16rem),
            rgba(3,9,18,.55);
          box-shadow: 0 20px 48px rgba(0,0,0,.22);
        }

        .drop-icon {
          width: 60px;
          height: 60px;
          display: grid;
          place-items: center;
          margin: 0 auto 16px;
          border-radius: 18px;
          border: 1px solid rgba(103,230,197,.36);
          color: var(--mint);
          background: rgba(103,230,197,.07);
          font-size: 1.8rem;
          font-weight: 900;
        }

        .drop-zone h3 {
          margin: 0;
          font-size: 1.25rem;
        }

        .drop-zone p,
        .empty-files {
          color: var(--muted);
          line-height: 1.6;
        }

        .file-button {
          min-height: 46px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-top: 10px;
          padding: 0 18px;
          border-radius: 12px;
          border: 1px solid rgba(103,230,197,.34);
          background: rgba(103,230,197,.08);
          color: var(--text);
          cursor: pointer;
          font-weight: 850;
          transition: .2s ease;
        }

        .file-button:hover,
        .file-button:focus-within {
          transform: translateY(-2px);
          border-color: rgba(103,230,197,.62);
        }

        .file-button input {
          position: absolute;
          width: 1px;
          height: 1px;
          opacity: 0;
          pointer-events: none;
        }

        .file-list {
          margin-top: 18px;
          display: grid;
          gap: 10px;
        }

        .file-list-heading {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          padding: 0 4px 8px;
          color: var(--muted);
          font-size: .86rem;
        }

        .file-list-heading strong {
          color: var(--text);
        }

        .file-row {
          display: grid;
          grid-template-columns: 50px 1fr auto;
          align-items: center;
          gap: 14px;
          padding: 14px;
          border: 1px solid var(--line);
          border-radius: 14px;
          background: rgba(3,9,18,.48);
        }

        .file-symbol {
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          color: var(--mint);
          background: rgba(103,230,197,.07);
          border: 1px solid rgba(103,230,197,.2);
          font-size: .7rem;
          font-weight: 950;
        }

        .file-copy {
          min-width: 0;
          display: grid;
          gap: 4px;
        }

        .file-copy strong {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .file-copy span {
          color: var(--muted);
          font-size: .8rem;
        }

        .remove-file {
          border: 1px solid rgba(255,191,63,.22);
          border-radius: 10px;
          padding: 8px 10px;
          color: #ffd98b;
          background: rgba(255,191,63,.055);
          cursor: pointer;
        }

        .remove-file:hover,
        .remove-file:focus-visible {
          border-color: rgba(255,191,63,.48);
          outline: none;
        }

        .empty-files {
          margin-bottom: 0;
          text-align: center;
        }

        .acknowledgement-list {
          display: grid;
          gap: 12px;
        }

        .acknowledgement-list label {
          display: grid;
          grid-template-columns: 24px 1fr;
          gap: 13px;
          align-items: start;
          padding: 17px;
          border: 1px solid var(--line);
          border-radius: 14px;
          background: rgba(3,9,18,.45);
          cursor: pointer;
        }

        .acknowledgement-list label:hover {
          border-color: rgba(103,230,197,.3);
        }

        .acknowledgement-list input {
          width: 18px;
          height: 18px;
          margin: 2px 0 0;
          accent-color: var(--mint);
        }

        .acknowledgement-list span {
          color: #d1dae7;
          line-height: 1.58;
          font-size: .91rem;
        }

        .submission-panel {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 38px;
          border-color: rgba(255,191,63,.25);
          background:
            linear-gradient(120deg, rgba(255,191,63,.07), transparent 52%),
            rgba(9,18,32,.92);
        }

        .submission-panel > div:first-child {
          max-width: 720px;
        }

        .submission-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
          min-width: 250px;
        }

        .button {
          min-height: 50px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          border-radius: 13px;
          padding: 0 19px;
          cursor: pointer;
          font-weight: 900;
          transition: .2s ease;
        }

        .button:hover,
        .button:focus-visible {
          transform: translateY(-2px);
          outline: none;
        }

        .button-primary {
          border: 1px solid transparent;
          color: #241600;
          background: linear-gradient(135deg, #ffe29a, var(--gold) 55%, #df8b00);
          box-shadow: 0 14px 34px rgba(255,174,22,.16);
        }

        .button-primary:hover,
        .button-primary:focus-visible {
          box-shadow: 0 18px 42px rgba(255,174,22,.25);
        }

        .button-quiet {
          border: 1px solid var(--line-strong);
          color: var(--muted);
          background: rgba(3,9,18,.48);
        }

        .button-quiet:hover,
        .button-quiet:focus-visible {
          color: var(--text);
          border-color: rgba(103,230,197,.38);
        }

        .footer {
          min-height: 150px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 28px;
          border-top: 1px solid var(--line);
        }

        .footer p {
          margin: 7px 0 0;
          color: var(--muted);
        }

        @keyframes driftOne {
          to {
            transform: translate3d(-210px, 210px, 0);
          }
        }

        @keyframes driftTwo {
          to {
            transform: translate3d(220px, -180px, 0);
          }
        }

        @media (max-width: 900px) {
          .top-actions {
            display: none;
          }

          .intro {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .status-card {
            max-width: 520px;
          }

          .submission-panel {
            align-items: flex-start;
            flex-direction: column;
          }

          .submission-actions {
            width: 100%;
            min-width: 0;
            flex-direction: row;
          }

          .submission-actions .button {
            flex: 1;
          }
        }

        @media (max-width: 680px) {
          .topbar,
          .intro,
          .boundary-banner,
          .message,
          .application-form,
          .footer {
            width: min(100% - 24px, 1180px);
          }

          .intro {
            padding-top: 62px;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .field-wide {
            grid-column: auto;
          }

          .form-section,
          .submission-panel {
            padding: 26px 18px;
            border-radius: 20px;
          }

          .section-number {
            top: 20px;
            right: 20px;
          }

          .file-row {
            grid-template-columns: 42px minmax(0, 1fr);
          }

          .remove-file {
            grid-column: 1 / -1;
          }

          .submission-actions {
            flex-direction: column;
          }

          .footer {
            padding: 30px 0;
            align-items: flex-start;
            flex-direction: column;
          }

          .footer-links {
            justify-content: flex-start;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }

          .star-layer {
            animation: none;
          }

          .button,
          .nav-button,
          .file-button,
          .progress-track span {
            transition: none;
          }
        }
      `}</style>
    </>
  );
}
