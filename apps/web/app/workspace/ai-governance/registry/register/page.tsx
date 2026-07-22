'use client';

import Link from 'next/link';
import {
  ChangeEvent,
  DragEvent,
  FormEvent,
  useMemo,
  useRef,
  useState,
} from 'react';

type Visibility = 'PUBLIC' | 'CONTROLLED' | 'PRIVATE';
type EvidenceCategory =
  | 'Founding declaration'
  | 'Governance specification'
  | 'Claims evidence'
  | 'Limitations / non-claims'
  | 'Publication'
  | 'Repository export'
  | 'Demonstration record'
  | 'Standards or regulatory mapping'
  | 'Ownership or licensing record'
  | 'Other supporting evidence';

type EvidenceFile = {
  id: string;
  file: File;
  category: EvidenceCategory;
  description: string;
  visibility: Visibility;
};

type FormState = {
  governanceName: string;
  shortName: string;
  currentVersion: string;
  establishmentDate: string;
  governanceCategory: string;
  claimantName: string;
  claimantType: string;
  stewardName: string;
  organization: string;
  contactEmail: string;
  website: string;
  jurisdiction: string;
  regulatoryScope: string;
  plainDescription: string;
  claims: string;
  nonClaims: string;
  limitations: string;
  ownershipDeclaration: string;
  license: string;
  recordVisibility: Visibility;
  publicContact: boolean;
  authorityConfirmed: boolean;
  accuracyConfirmed: boolean;
  boundaryConfirmed: boolean;
};

const MAX_FILE_SIZE = 50 * 1024 * 1024;
const MAX_TOTAL_SIZE = 250 * 1024 * 1024;
const ACCEPTED_EXTENSIONS = [
  'pdf',
  'doc',
  'docx',
  'txt',
  'md',
  'csv',
  'json',
  'xls',
  'xlsx',
  'ppt',
  'pptx',
  'png',
  'jpg',
  'jpeg',
  'webp',
  'zip',
];

const evidenceCategories: EvidenceCategory[] = [
  'Founding declaration',
  'Governance specification',
  'Claims evidence',
  'Limitations / non-claims',
  'Publication',
  'Repository export',
  'Demonstration record',
  'Standards or regulatory mapping',
  'Ownership or licensing record',
  'Other supporting evidence',
];

const initialForm: FormState = {
  governanceName: '',
  shortName: '',
  currentVersion: '1.0',
  establishmentDate: '',
  governanceCategory: '',
  claimantName: '',
  claimantType: 'Individual founder or author',
  stewardName: '',
  organization: '',
  contactEmail: '',
  website: '',
  jurisdiction: '',
  regulatoryScope: '',
  plainDescription: '',
  claims: '',
  nonClaims: '',
  limitations: '',
  ownershipDeclaration: '',
  license: '',
  recordVisibility: 'PUBLIC',
  publicContact: false,
  authorityConfirmed: false,
  accuracyConfirmed: false,
  boundaryConfirmed: false,
};

function bytesToSize(bytes: number) {
  if (bytes === 0) return '0 bytes';
  const units = ['bytes', 'KB', 'MB', 'GB'];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

function fileExtension(name: string) {
  const pieces = name.toLowerCase().split('.');
  return pieces.length > 1 ? pieces.pop() ?? '' : '';
}

export default function RegisterGovernancePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<FormState>(initialForm);
  const [files, setFiles] = useState<EvidenceFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const totalSize = useMemo(
    () => files.reduce((total, item) => total + item.file.size, 0),
    [files],
  );

  const requiredCompletion = useMemo(() => {
    const checks = [
      form.governanceName,
      form.currentVersion,
      form.establishmentDate,
      form.governanceCategory,
      form.claimantName,
      form.contactEmail,
      form.plainDescription,
      form.claims,
      form.nonClaims,
      form.ownershipDeclaration,
      form.authorityConfirmed,
      form.accuracyConfirmed,
      form.boundaryConfirmed,
    ];
    const complete = checks.filter(Boolean).length;
    return Math.round((complete / checks.length) * 100);
  }, [form]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setMessage('');
  }

  function addFiles(incoming: File[]) {
    const nextErrors: string[] = [];
    const currentKeys = new Set(
      files.map((item) => `${item.file.name}:${item.file.size}:${item.file.lastModified}`),
    );
    const accepted: EvidenceFile[] = [];
    let prospectiveTotal = totalSize;

    for (const file of incoming) {
      const extension = fileExtension(file.name);
      const key = `${file.name}:${file.size}:${file.lastModified}`;

      if (!ACCEPTED_EXTENSIONS.includes(extension)) {
        nextErrors.push(`${file.name}: unsupported file type.`);
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        nextErrors.push(`${file.name}: exceeds the 50 MB individual file limit.`);
        continue;
      }

      if (currentKeys.has(key)) {
        nextErrors.push(`${file.name}: duplicate file was not added.`);
        continue;
      }

      if (prospectiveTotal + file.size > MAX_TOTAL_SIZE) {
        nextErrors.push(`${file.name}: would exceed the 250 MB evidence-package limit.`);
        continue;
      }

      currentKeys.add(key);
      prospectiveTotal += file.size;
      accepted.push({
        id: crypto.randomUUID(),
        file,
        category: 'Other supporting evidence',
        description: '',
        visibility: form.recordVisibility,
      });
    }

    setFiles((current) => [...current, ...accepted]);
    setErrors(nextErrors);
    if (accepted.length > 0) {
      setMessage(`${accepted.length} evidence file${accepted.length === 1 ? '' : 's'} added.`);
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    addFiles(Array.from(event.target.files ?? []));
    event.target.value = '';
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragActive(false);
    addFiles(Array.from(event.dataTransfer.files));
  }

  function updateEvidence(
    id: string,
    changes: Partial<Pick<EvidenceFile, 'category' | 'description' | 'visibility'>>,
  ) {
    setFiles((current) =>
      current.map((item) => (item.id === id ? { ...item, ...changes } : item)),
    );
  }

  function removeEvidence(id: string) {
    setFiles((current) => current.filter((item) => item.id !== id));
    setMessage('Evidence file removed from this intake package.');
  }

  function validate() {
    const nextErrors: string[] = [];
    if (!form.governanceName.trim()) nextErrors.push('Governance name is required.');
    if (!form.currentVersion.trim()) nextErrors.push('Current version is required.');
    if (!form.establishmentDate) nextErrors.push('Claimed establishment date is required.');
    if (!form.governanceCategory.trim()) nextErrors.push('Governance category is required.');
    if (!form.claimantName.trim()) nextErrors.push('Claimant name is required.');
    if (!form.contactEmail.trim()) nextErrors.push('Contact email is required.');
    if (!form.plainDescription.trim()) nextErrors.push('Plain-language description is required.');
    if (!form.claims.trim()) nextErrors.push('At least one affirmative claim is required.');
    if (!form.nonClaims.trim()) nextErrors.push('Explicit non-claims are required.');
    if (!form.ownershipDeclaration.trim()) {
      nextErrors.push('Ownership and submission-rights declaration is required.');
    }
    if (!form.authorityConfirmed) nextErrors.push('Submission authority must be confirmed.');
    if (!form.accuracyConfirmed) nextErrors.push('Accuracy declaration must be confirmed.');
    if (!form.boundaryConfirmed) nextErrors.push('Registry boundary must be acknowledged.');

    const undocumented = files.filter((item) => !item.description.trim());
    if (undocumented.length > 0) {
      nextErrors.push('Every evidence file requires a short description.');
    }

    setErrors(nextErrors);
    return nextErrors.length === 0;
  }

  function buildManifest() {
    return {
      schema: 'TA-14-AI-GOVERNANCE-REGISTRY-INTAKE',
      schemaVersion: '1.0',
      generatedAt: new Date().toISOString(),
      registryBoundary:
        'This intake package records a declaration and supporting evidence. It is not certification, legal validation, regulatory approval, technical verification, or an ownership determination.',
      registration: form,
      evidenceManifest: files.map((item) => ({
        filename: item.file.name,
        mediaType: item.file.type || 'application/octet-stream',
        sizeBytes: item.file.size,
        lastModified: new Date(item.file.lastModified).toISOString(),
        category: item.category,
        description: item.description,
        visibility: item.visibility,
      })),
    };
  }

  function downloadManifest() {
    if (!validate()) {
      setMessage('Complete the required fields before generating the intake manifest.');
      return;
    }

    const blob = new Blob([JSON.stringify(buildManifest(), null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${form.shortName || form.governanceName || 'governance'}-registry-intake.json`
      .toLowerCase()
      .replace(/[^a-z0-9.-]+/g, '-');
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    setMessage('Review-ready intake manifest generated. Evidence files remain on this device.');
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) {
      setMessage('The intake package is not ready for review. Resolve the items below.');
      return;
    }
    setMessage(
      'The intake package is review-ready. Registry submission storage is not connected on this page yet; generate the manifest to preserve the completed intake now.',
    );
  }

  return (
    <main className="registry-intake-page">
      <div className="cosmos" aria-hidden="true">
        <div className="stars stars-a" />
        <div className="stars stars-b" />
        <div className="orb orb-one" />
        <div className="orb orb-two" />
      </div>

      <header className="topbar">
        <Link href="/workspace/ai-governance/registry" className="brand-button">
          <span className="brand-mark">TA-14</span>
          <span>
            <strong>AI Governance Registry</strong>
            <small>Governed registration intake</small>
          </span>
        </Link>
        <nav aria-label="Registry navigation">
          <Link href="/workspace/ai-governance/registry" className="nav-button">
            Registry Method
          </Link>
          <Link href="/workspace" className="nav-button">
            Open Workspace
          </Link>
        </nav>
      </header>

      <section className="hero-shell">
        <div className="eyebrow">FORMAL REGISTRY INTAKE · FOUNDATIONAL RELEASE</div>
        <h1>Register an AI Governance Architecture</h1>
        <p>
          Establish a dated, attributable, versioned declaration of identity, scope,
          claims, non-claims, evidence, stewardship, ownership, and limitations.
        </p>
        <div className="boundary-banner">
          <strong>Registration is not certification.</strong>
          <span>
            Submission records what was declared and supplied. It does not by itself
            establish truth, ownership priority, legal compliance, technical efficacy,
            regulatory acceptance, or fitness for use.
          </span>
        </div>
      </section>

      <section className="progress-panel" aria-label="Intake completion">
        <div>
          <span>Required intake completion</span>
          <strong>{requiredCompletion}%</strong>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${requiredCompletion}%` }} />
        </div>
        <div className="progress-meta">
          <span>{files.length} evidence files</span>
          <span>{bytesToSize(totalSize)} of 250 MB</span>
          <span>{form.recordVisibility.toLowerCase()} record</span>
        </div>
      </section>

      <form onSubmit={handleSubmit} noValidate>
        <section className="form-section">
          <div className="section-heading">
            <span>01</span>
            <div>
              <h2>Governance Identity</h2>
              <p>Identify the architecture as it should appear in the Registry.</p>
            </div>
          </div>
          <div className="field-grid three">
            <label>
              Governance name <em>Required</em>
              <input
                value={form.governanceName}
                onChange={(event) => updateField('governanceName', event.target.value)}
                placeholder="Full public governance name"
              />
            </label>
            <label>
              Short name or acronym
              <input
                value={form.shortName}
                onChange={(event) => updateField('shortName', event.target.value)}
                placeholder="Optional"
              />
            </label>
            <label>
              Current version <em>Required</em>
              <input
                value={form.currentVersion}
                onChange={(event) => updateField('currentVersion', event.target.value)}
                placeholder="1.0"
              />
            </label>
            <label>
              Claimed establishment date <em>Required</em>
              <span className="date-wrap">
                <input
                  type="date"
                  value={form.establishmentDate}
                  onChange={(event) => updateField('establishmentDate', event.target.value)}
                />
              </span>
            </label>
            <label>
              Governance category <em>Required</em>
              <input
                value={form.governanceCategory}
                onChange={(event) => updateField('governanceCategory', event.target.value)}
                placeholder="AI governance, runtime governance, evidence governance..."
              />
            </label>
            <label>
              Record visibility
              <select
                value={form.recordVisibility}
                onChange={(event) =>
                  updateField('recordVisibility', event.target.value as Visibility)
                }
              >
                <option value="PUBLIC">Public</option>
                <option value="CONTROLLED">Controlled access</option>
                <option value="PRIVATE">Private intake</option>
              </select>
            </label>
          </div>
        </section>

        <section className="form-section">
          <div className="section-heading">
            <span>02</span>
            <div>
              <h2>Attribution and Stewardship</h2>
              <p>Separate the claimant, submitter, steward, and organization.</p>
            </div>
          </div>
          <div className="field-grid two">
            <label>
              Claimant, founder, or author <em>Required</em>
              <input
                value={form.claimantName}
                onChange={(event) => updateField('claimantName', event.target.value)}
                placeholder="Full legal or public name"
              />
            </label>
            <label>
              Claimant type
              <select
                value={form.claimantType}
                onChange={(event) => updateField('claimantType', event.target.value)}
              >
                <option>Individual founder or author</option>
                <option>Organization</option>
                <option>Research group</option>
                <option>Standards or governance body</option>
                <option>Joint claimants</option>
              </select>
            </label>
            <label>
              Current steward
              <input
                value={form.stewardName}
                onChange={(event) => updateField('stewardName', event.target.value)}
                placeholder="Person or entity responsible for the current version"
              />
            </label>
            <label>
              Organization
              <input
                value={form.organization}
                onChange={(event) => updateField('organization', event.target.value)}
                placeholder="Organization, institution, or independent practice"
              />
            </label>
            <label>
              Contact email <em>Required</em>
              <input
                type="email"
                value={form.contactEmail}
                onChange={(event) => updateField('contactEmail', event.target.value)}
                placeholder="registry-contact@example.com"
              />
            </label>
            <label>
              Public website or repository
              <input
                type="url"
                value={form.website}
                onChange={(event) => updateField('website', event.target.value)}
                placeholder="https://"
              />
            </label>
          </div>
          <label className="check-row">
            <input
              type="checkbox"
              checked={form.publicContact}
              onChange={(event) => updateField('publicContact', event.target.checked)}
            />
            <span>Permit the Registry to display the submitted contact route publicly.</span>
          </label>
        </section>

        <section className="form-section">
          <div className="section-heading">
            <span>03</span>
            <div>
              <h2>Scope, Claims, and Boundaries</h2>
              <p>Make the affirmative claims and the non-claims equally visible.</p>
            </div>
          </div>
          <div className="field-grid two">
            <label>
              Geographic or jurisdictional scope
              <input
                value={form.jurisdiction}
                onChange={(event) => updateField('jurisdiction', event.target.value)}
                placeholder="Global, United States, European Union, sector-specific..."
              />
            </label>
            <label>
              Regulatory or standards scope
              <input
                value={form.regulatoryScope}
                onChange={(event) => updateField('regulatoryScope', event.target.value)}
                placeholder="EU AI Act, NIST AI RMF, ISO/IEC, internal governance..."
              />
            </label>
          </div>
          <label>
            Plain-language description <em>Required</em>
            <textarea
              rows={5}
              value={form.plainDescription}
              onChange={(event) => updateField('plainDescription', event.target.value)}
              placeholder="Explain what the governance architecture is, who it serves, what it governs, and how it is intended to be used."
            />
          </label>
          <div className="field-grid two textareas">
            <label>
              Formal claims <em>Required</em>
              <textarea
                rows={8}
                value={form.claims}
                onChange={(event) => updateField('claims', event.target.value)}
                placeholder="List each affirmative claim on a separate line. Avoid unsupported promotional language."
              />
            </label>
            <label>
              Explicit non-claims <em>Required</em>
              <textarea
                rows={8}
                value={form.nonClaims}
                onChange={(event) => updateField('nonClaims', event.target.value)}
                placeholder="State what this architecture does not prove, certify, guarantee, replace, or authorize."
              />
            </label>
          </div>
          <label>
            Known limitations, dependencies, and unresolved questions
            <textarea
              rows={6}
              value={form.limitations}
              onChange={(event) => updateField('limitations', event.target.value)}
              placeholder="Identify known implementation limits, dependencies, conflicts, exceptions, evidence gaps, and unresolved questions."
            />
          </label>
        </section>

        <section className="form-section evidence-section">
          <div className="section-heading">
            <span>04</span>
            <div>
              <h2>Evidence Package</h2>
              <p>Drag, drop, classify, and describe every supporting item.</p>
            </div>
          </div>

          <div
            className={`drop-zone ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={(event) => {
              event.preventDefault();
              setDragActive(true);
            }}
            onDragOver={(event) => event.preventDefault()}
            onDragLeave={(event) => {
              if (event.currentTarget === event.target) setDragActive(false);
            }}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={ACCEPTED_EXTENSIONS.map((extension) => `.${extension}`).join(',')}
              onChange={handleFileChange}
              className="hidden-file-input"
            />
            <div className="upload-symbol">⇧</div>
            <h3>Drop evidence files here</h3>
            <p>
              Or use the polished file selector. Multiple files are supported, with
              duplicate, type, individual-size, and package-size validation.
            </p>
            <button
              type="button"
              className="primary-button"
              onClick={() => fileInputRef.current?.click()}
            >
              Choose Evidence Files
              <span>＋</span>
            </button>
            <small>
              PDF, DOCX, TXT, CSV, JSON, XLSX, PPTX, images, and ZIP · 50 MB each ·
              250 MB package
            </small>
          </div>

          <div className="evidence-boundary">
            <strong>Evidence-boundary notice</strong>
            <p>
              Uploading preserves the submitted item and its declared relationship to
              the registration. It does not establish authenticity, truth, ownership,
              validity, regulatory acceptance, or technical effectiveness.
            </p>
          </div>

          {files.length > 0 && (
            <div className="evidence-list">
              {files.map((item, index) => (
                <article className="evidence-item" key={item.id}>
                  <div className="file-index">{String(index + 1).padStart(2, '0')}</div>
                  <div className="file-body">
                    <div className="file-header">
                      <div>
                        <h3>{item.file.name}</h3>
                        <p>
                          {bytesToSize(item.file.size)} ·{' '}
                          {item.file.type || 'Unspecified media type'}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="remove-button"
                        onClick={() => removeEvidence(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                    <div className="field-grid two compact">
                      <label>
                        Evidence category
                        <select
                          value={item.category}
                          onChange={(event) =>
                            updateEvidence(item.id, {
                              category: event.target.value as EvidenceCategory,
                            })
                          }
                        >
                          {evidenceCategories.map((category) => (
                            <option key={category}>{category}</option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Evidence visibility
                        <select
                          value={item.visibility}
                          onChange={(event) =>
                            updateEvidence(item.id, {
                              visibility: event.target.value as Visibility,
                            })
                          }
                        >
                          <option value="PUBLIC">Public</option>
                          <option value="CONTROLLED">Controlled access</option>
                          <option value="PRIVATE">Private</option>
                        </select>
                      </label>
                    </div>
                    <label>
                      What this file supports <em>Required</em>
                      <textarea
                        rows={3}
                        value={item.description}
                        onChange={(event) =>
                          updateEvidence(item.id, { description: event.target.value })
                        }
                        placeholder="Describe the specific claim, identity assertion, version, boundary, ownership declaration, or historical event this item supports."
                      />
                    </label>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="form-section">
          <div className="section-heading">
            <span>05</span>
            <div>
              <h2>Rights and Declarations</h2>
              <p>Preserve authority, ownership assertions, licensing, and submission boundaries.</p>
            </div>
          </div>
          <div className="field-grid two">
            <label>
              Ownership and submission-rights declaration <em>Required</em>
              <textarea
                rows={7}
                value={form.ownershipDeclaration}
                onChange={(event) =>
                  updateField('ownershipDeclaration', event.target.value)
                }
                placeholder="State who claims ownership or stewardship, the submitter's authority, known joint interests, and any contested or uncertain rights."
              />
            </label>
            <label>
              License or permitted-use statement
              <textarea
                rows={7}
                value={form.license}
                onChange={(event) => updateField('license', event.target.value)}
                placeholder="Identify the applicable license, reserved rights, public-use permissions, or restrictions."
              />
            </label>
          </div>

          <div className="declaration-stack">
            <label className="declaration-row">
              <input
                type="checkbox"
                checked={form.authorityConfirmed}
                onChange={(event) =>
                  updateField('authorityConfirmed', event.target.checked)
                }
              />
              <span>
                <strong>Authority to submit</strong>
                I declare that I am authorized to submit this registration and its
                evidence, or I have clearly disclosed the limits of that authority.
              </span>
            </label>
            <label className="declaration-row">
              <input
                type="checkbox"
                checked={form.accuracyConfirmed}
                onChange={(event) =>
                  updateField('accuracyConfirmed', event.target.checked)
                }
              />
              <span>
                <strong>Accuracy and attribution</strong>
                I declare that the registration is accurate to the best of my knowledge
                and that material sources, contributors, disputes, and limitations have
                not been knowingly concealed.
              </span>
            </label>
            <label className="declaration-row">
              <input
                type="checkbox"
                checked={form.boundaryConfirmed}
                onChange={(event) =>
                  updateField('boundaryConfirmed', event.target.checked)
                }
              />
              <span>
                <strong>Registry boundary</strong>
                I understand that registration preserves a declaration and supporting
                evidence; it is not certification, legal advice, regulatory approval,
                ownership adjudication, or proof that the architecture works as claimed.
              </span>
            </label>
          </div>
        </section>

        {(errors.length > 0 || message) && (
          <section className={`notice-panel ${errors.length > 0 ? 'has-errors' : ''}`} aria-live="polite">
            {message && <strong>{message}</strong>}
            {errors.length > 0 && (
              <ul>
                {errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            )}
          </section>
        )}

        <section className="submission-panel">
          <div>
            <div className="eyebrow">REVIEW-READY INTAKE PACKAGE</div>
            <h2>Preserve the declaration before requesting registration.</h2>
            <p>
              Generate a JSON manifest containing the completed registration metadata and
              evidence manifest. Files stay on this device until persistent Registry
              storage and review workflow are connected.
            </p>
          </div>
          <div className="submission-actions">
            <button type="button" className="secondary-button" onClick={downloadManifest}>
              Generate Intake Manifest
              <span>↓</span>
            </button>
            <button type="submit" className="primary-button large">
              Validate Intake Package
              <span>✓</span>
            </button>
          </div>
        </section>
      </form>

      <footer>
        <div>
          <strong>TA-14 AI Governance Registry</strong>
          <span>Declaration · Identity · Evidence · Review · Registration · Version</span>
        </div>
        <Link href="/workspace/ai-governance/registry" className="nav-button">
          Return to Registry
          <span>←</span>
        </Link>
      </footer>

      <style jsx>{`
        :global(*) { box-sizing: border-box; }
        :global(body) { margin: 0; background: #050812; color: #f7f3e8; }
        .registry-intake-page {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          padding: 24px clamp(18px, 4vw, 64px) 56px;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          background:
            radial-gradient(circle at 50% 10%, rgba(23, 72, 130, .2), transparent 32%),
            linear-gradient(180deg, #050812 0%, #090d19 45%, #050711 100%);
        }
        .cosmos { position: fixed; inset: 0; pointer-events: none; overflow: hidden; }
        .stars { position: absolute; inset: -25%; opacity: .48; background-image: radial-gradient(circle, rgba(255,255,255,.75) 0 1px, transparent 1.4px); background-size: 48px 48px; animation: drift 30s linear infinite; }
        .stars-b { opacity: .2; background-size: 83px 83px; animation-duration: 50s; animation-direction: reverse; }
        .orb { position: absolute; border-radius: 999px; filter: blur(2px); opacity: .25; }
        .orb-one { width: 260px; height: 260px; right: -90px; top: 18%; background: radial-gradient(circle at 35% 35%, #8ad7ff, #19316c 52%, transparent 72%); }
        .orb-two { width: 190px; height: 190px; left: -70px; top: 62%; background: radial-gradient(circle at 40% 35%, #f7c471, #7d3f14 48%, transparent 72%); }
        @keyframes drift { to { transform: translate3d(80px, 60px, 0); } }
        .topbar, .hero-shell, .progress-panel, form, footer { position: relative; z-index: 2; max-width: 1220px; margin-inline: auto; }
        .topbar { display: flex; justify-content: space-between; gap: 20px; align-items: center; padding: 12px 0 30px; }
        .topbar nav { display: flex; gap: 10px; flex-wrap: wrap; justify-content: flex-end; }
        .brand-button, .nav-button, .primary-button, .secondary-button, .remove-button { text-decoration: none; border: 1px solid rgba(219, 177, 102, .48); color: #fff8e8; background: linear-gradient(180deg, rgba(78,55,25,.62), rgba(29,23,18,.84)); box-shadow: inset 0 1px rgba(255,255,255,.08), 0 10px 25px rgba(0,0,0,.22); transition: transform .2s ease, border-color .2s ease, background .2s ease; }
        .brand-button:hover, .nav-button:hover, .primary-button:hover, .secondary-button:hover, .remove-button:hover { transform: translateY(-2px); border-color: rgba(255,214,139,.9); }
        .brand-button { display: inline-flex; align-items: center; gap: 12px; padding: 10px 14px; border-radius: 14px; }
        .brand-button span:last-child { display: grid; gap: 2px; }
        .brand-button small { color: #c8b998; font-size: 11px; letter-spacing: .08em; text-transform: uppercase; }
        .brand-mark { display: grid; place-items: center; min-width: 56px; height: 42px; border-radius: 10px; background: linear-gradient(145deg, #d7a74e, #6e431d); font-family: Georgia, serif; font-weight: 800; color: #130d07; }
        .nav-button { display: inline-flex; align-items: center; gap: 8px; padding: 11px 15px; border-radius: 12px; font-size: 13px; font-weight: 700; }
        .hero-shell { text-align: center; padding: clamp(34px, 7vw, 82px) 0 34px; }
        .eyebrow { color: #e8bc68; letter-spacing: .2em; font-size: 12px; font-weight: 800; }
        h1, h2, h3, p { margin-top: 0; }
        h1 { max-width: 900px; margin: 18px auto; font-family: Georgia, serif; font-size: clamp(42px, 7vw, 82px); line-height: .98; font-weight: 500; }
        .hero-shell > p { max-width: 820px; margin: 0 auto 26px; color: #c9d1df; font-size: clamp(17px, 2vw, 21px); line-height: 1.65; }
        .boundary-banner { display: grid; gap: 5px; max-width: 900px; margin: 0 auto; padding: 18px 22px; text-align: left; border: 1px solid rgba(231,184,96,.4); border-radius: 18px; background: rgba(47,35,20,.56); }
        .boundary-banner strong { color: #ffd98e; }
        .boundary-banner span { color: #d7ceba; line-height: 1.55; }
        .progress-panel { padding: 20px 24px; margin-bottom: 24px; border: 1px solid rgba(126,158,203,.25); border-radius: 18px; background: rgba(10,17,32,.82); backdrop-filter: blur(12px); }
        .progress-panel > div:first-child, .progress-meta { display: flex; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
        .progress-panel strong { color: #f0c979; }
        .progress-track { height: 9px; margin: 13px 0; overflow: hidden; border-radius: 999px; background: rgba(255,255,255,.08); }
        .progress-fill { height: 100%; border-radius: inherit; background: linear-gradient(90deg, #7cb6e8, #e8bc68); transition: width .3s ease; }
        .progress-meta { color: #9eabc0; font-size: 12px; text-transform: uppercase; letter-spacing: .09em; }
        form { display: grid; gap: 22px; }
        .form-section { padding: clamp(22px, 4vw, 38px); border: 1px solid rgba(151,169,199,.2); border-radius: 24px; background: linear-gradient(180deg, rgba(15,24,43,.94), rgba(8,13,25,.96)); box-shadow: 0 25px 70px rgba(0,0,0,.22); }
        .section-heading { display: flex; gap: 16px; align-items: flex-start; margin-bottom: 26px; }
        .section-heading > span { display: grid; place-items: center; flex: 0 0 44px; height: 44px; border-radius: 12px; background: linear-gradient(145deg, #d9aa55, #704519); color: #160e06; font-family: Georgia, serif; font-weight: 900; }
        .section-heading h2 { margin-bottom: 5px; font-family: Georgia, serif; font-size: clamp(25px, 3vw, 36px); font-weight: 500; }
        .section-heading p { color: #98a7bc; margin-bottom: 0; }
        .field-grid { display: grid; gap: 18px; margin-bottom: 18px; }
        .field-grid.two { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .field-grid.three { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .field-grid.compact { margin-bottom: 14px; }
        label { display: grid; gap: 8px; color: #edf2fa; font-size: 13px; font-weight: 750; letter-spacing: .02em; }
        label em { color: #eec571; font-size: 10px; font-style: normal; text-transform: uppercase; letter-spacing: .1em; }
        input, select, textarea { width: 100%; border: 1px solid rgba(151,169,199,.28); border-radius: 12px; padding: 13px 14px; color: #f6f8fc; background: rgba(4,9,18,.82); font: inherit; font-weight: 500; outline: none; }
        input:focus, select:focus, textarea:focus { border-color: #e8bc68; box-shadow: 0 0 0 3px rgba(232,188,104,.12); }
        textarea { resize: vertical; line-height: 1.55; }
        select option { background: #0b1220; }
        .date-wrap { display: block; width: 100%; }
        .date-wrap input { min-width: 0; }
        .check-row, .declaration-row { display: flex; align-items: flex-start; gap: 12px; padding: 14px; border: 1px solid rgba(151,169,199,.18); border-radius: 14px; background: rgba(255,255,255,.025); }
        .check-row input, .declaration-row input { width: 18px; height: 18px; margin-top: 2px; accent-color: #d9aa55; }
        .check-row span, .declaration-row span { font-weight: 500; line-height: 1.55; color: #cbd4e2; }
        .declaration-row strong { display: block; margin-bottom: 3px; color: #fff4d9; }
        .declaration-stack { display: grid; gap: 12px; }
        .drop-zone { display: grid; justify-items: center; gap: 12px; padding: clamp(34px, 7vw, 70px) 20px; text-align: center; border: 1px dashed rgba(232,188,104,.55); border-radius: 22px; background: radial-gradient(circle at 50% 30%, rgba(69,111,164,.18), transparent 58%), rgba(4,10,20,.6); transition: border-color .2s ease, background .2s ease, transform .2s ease; }
        .drop-zone.drag-active { border-color: #ffd98e; background: rgba(70,55,29,.42); transform: scale(1.005); }
        .drop-zone h3 { margin-bottom: 0; font-family: Georgia, serif; font-size: 28px; }
        .drop-zone p { max-width: 650px; margin-bottom: 0; color: #aebbd0; line-height: 1.55; }
        .drop-zone small { color: #8f9cb0; }
        .upload-symbol { display: grid; place-items: center; width: 64px; height: 64px; border: 1px solid rgba(232,188,104,.5); border-radius: 18px; color: #ffd98e; background: linear-gradient(145deg, rgba(232,188,104,.18), rgba(42,67,101,.2)); font-size: 30px; }
        .hidden-file-input { display: none; }
        .primary-button, .secondary-button { display: inline-flex; justify-content: center; align-items: center; gap: 12px; border-radius: 13px; padding: 13px 18px; cursor: pointer; font-weight: 800; }
        .primary-button { background: linear-gradient(180deg, #d7ab59, #87521f); color: #160e07; border-color: #f0ce85; }
        .primary-button.large { min-height: 54px; padding-inline: 24px; }
        .secondary-button { background: linear-gradient(180deg, rgba(47,73,108,.94), rgba(22,34,55,.96)); border-color: rgba(130,178,225,.55); }
        .evidence-boundary { margin: 18px 0; padding: 16px 18px; border-left: 3px solid #d7aa57; background: rgba(216,170,85,.07); }
        .evidence-boundary strong { color: #f2ce87; }
        .evidence-boundary p { margin: 5px 0 0; color: #b9c3d2; line-height: 1.55; }
        .evidence-list { display: grid; gap: 14px; margin-top: 18px; }
        .evidence-item { display: flex; gap: 16px; padding: 18px; border: 1px solid rgba(151,169,199,.22); border-radius: 18px; background: rgba(255,255,255,.025); }
        .file-index { display: grid; place-items: center; flex: 0 0 44px; height: 44px; border-radius: 12px; background: rgba(129,164,207,.12); color: #a9d6ff; font-family: Georgia, serif; font-weight: 800; }
        .file-body { min-width: 0; flex: 1; }
        .file-header { display: flex; justify-content: space-between; gap: 16px; align-items: flex-start; margin-bottom: 16px; }
        .file-header h3 { overflow-wrap: anywhere; margin-bottom: 4px; font-size: 17px; }
        .file-header p { margin-bottom: 0; color: #8f9db1; font-size: 12px; }
        .remove-button { padding: 9px 12px; border-radius: 10px; cursor: pointer; color: #ffd8ca; border-color: rgba(226,124,92,.42); background: rgba(94,34,23,.28); }
        .notice-panel { padding: 18px 22px; border: 1px solid rgba(126,177,221,.38); border-radius: 16px; color: #d9ecff; background: rgba(24,64,100,.34); }
        .notice-panel.has-errors { border-color: rgba(230,128,93,.55); color: #ffe1d4; background: rgba(92,35,24,.34); }
        .notice-panel ul { margin: 10px 0 0; padding-left: 20px; line-height: 1.7; }
        .submission-panel { display: flex; justify-content: space-between; gap: 30px; align-items: center; padding: clamp(24px, 5vw, 44px); border: 1px solid rgba(232,188,104,.42); border-radius: 24px; background: linear-gradient(120deg, rgba(71,48,20,.7), rgba(13,28,49,.9)); }
        .submission-panel > div:first-child { max-width: 700px; }
        .submission-panel h2 { margin: 8px 0; font-family: Georgia, serif; font-size: clamp(26px, 4vw, 42px); font-weight: 500; }
        .submission-panel p { margin-bottom: 0; color: #c4cddd; line-height: 1.6; }
        .submission-actions { display: grid; gap: 12px; min-width: min(100%, 270px); }
        footer { display: flex; justify-content: space-between; gap: 20px; align-items: center; padding-top: 34px; }
        footer > div { display: grid; gap: 4px; }
        footer span { color: #8996a9; font-size: 12px; }
        @media (max-width: 900px) {
          .field-grid.three { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .submission-panel { align-items: stretch; flex-direction: column; }
          .submission-actions { width: 100%; }
        }
        @media (max-width: 680px) {
          .registry-intake-page { padding-inline: 14px; }
          .topbar, footer { align-items: stretch; flex-direction: column; }
          .topbar nav { justify-content: stretch; }
          .topbar nav .nav-button { flex: 1; justify-content: center; }
          .field-grid.two, .field-grid.three { grid-template-columns: 1fr; }
          .form-section { padding: 20px 16px; }
          .section-heading { gap: 12px; }
          .evidence-item { flex-direction: column; }
          .file-header { flex-direction: column; }
          .remove-button { width: 100%; }
          footer .nav-button { justify-content: center; }
        }
        @media (prefers-reduced-motion: reduce) {
          .stars { animation: none; }
          * { scroll-behavior: auto !important; transition: none !important; }
        }
      `}</style>
    </main>
  );
}
