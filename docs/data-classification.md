# Data Classification

| Class | Examples | Default control | Public use |
|---|---|---|---|
| Public | RID, bounded purpose, status, version, dates, limitations | Minimal publication | Registry lookup |
| Private | Customer route content, evidence metadata, drafts | Tenant-only, encrypted | None without authorization |
| Restricted | Confidential evidence files, credentials, sensitive commercial data | Explicit role, access log, short-lived signed access | Never public |
| Regulated | Health, financial, employment, government-controlled data | Separate approved controls and retention | Only permitted metadata |
| Institutional record | Findings, appeals, status events, complaint evidence | TA-14 custody under contract/law, append-only where required | Minimal status/history projection |

TA-14 does not sell customer evidence, convert custody into ownership, secretly monitor customer environments, or train on confidential customer evidence without express authorization.
