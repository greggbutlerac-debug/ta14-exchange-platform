# Fourth Door — World Environmental Law Global Population R1

Status: SOURCE-CONTROL BOUNDARY ESTABLISHED

This record governs the first multinational population pass for the World Environmental Law Engine. It does not declare any law applicable to a person, property, source, activity, facility, project, permit, or consequence merely because a jurisdiction is selected.

## Governing separation

Every populated record must preserve these as distinct objects:

1. CURRENT LAW — controlling law and current version/status.
2. ORIGINAL PURPOSE / HISTORY — why and how the instrument entered the legal system.
3. PRESENT MEANING — bounded plain-language description supported by official material.
4. APPLICABILITY — program, source, activity, territorial, institutional, or other legal trigger; geography alone is insufficient.
5. STRUCTURAL LIMIT — what the legal instrument does not itself prove.
6. TA-14 EXAMINATION — Reality → Record → Continuity → Admissibility → Binding → Commit → Execution → Outcome.
7. TA-14 PROPOSED LAW — explicitly non-enacted model language or governance rewrite.

No TA-14 proposed language may be represented as enacted law, controlling law, official interpretation, or an amendment unless and until an official source establishes that status.

## Source hierarchy

Use sources in this order:

1. Controlling primary legal text / official legislation register.
2. Official consolidated or current-version record and amendment/version evidence.
3. Official implementing ministry, regulator, commission, or agency material.
4. Official or authoritative interpretation/guidance.
5. Secondary explanation only when necessary and clearly identified.

A record is not population-ready when current version/status cannot be established from an authoritative source.

## R1 jurisdiction set

R1 is deliberately multinational but bounded. Existing United States / Florida / Pinellas County / St. Petersburg records remain the production proof stack and are not rewritten in this pass.

### European Union
Candidate flagship: Regulation (EU) 2021/1119 — European Climate Law.
Primary source: EUR-Lex.
Current-version control: use the consolidated/current version, not only the original 2021 text. As of the R1 research date, EUR-Lex identifies the act as in force and amended, with a consolidated version dated 7 April 2026.

### Canada
Candidate flagship: Canadian Environmental Protection Act, 1999 (S.C. 1999, c. 33).
Primary source: Justice Laws Website, Government of Canada.
Current-version control: official full text states current to 21 June 2026 and last amended 26 March 2026 at the R1 research date.

### United Kingdom / England
Candidate flagship: Environment Act 2021.
Primary sources: legislation.gov.uk for enacted text/version control; GOV.UK / DEFRA for current implementation material.
Applicability caution: implementation materials may expressly apply to England rather than every UK jurisdiction. The engine must preserve that distinction.

### Brazil
Candidate flagship: Lei nº 6.938, de 31 de agosto de 1981 — Política Nacional do Meio Ambiente.
Primary/official legislative source: Brazilian federal legislative publication; current consolidated/version status must be verified before runtime population.

### South Africa
Candidate flagship: National Environmental Management Act 107 of 1998.
Primary source: South African Government legislation page and official Gazette/amendment evidence.
Current-version caution: the government landing page lists amendments but links an external consolidated text updated only to 30 June 2023. Do not label a consolidated text 'current' without fresher authoritative version evidence.

### India
Candidate flagship: Environment (Protection) Act, 1986 (Act 29 of 1986).
Primary source: India Code.
Official metadata establishes enactment 23 May 1986, enforcement 19 November 1986, and central-government powers and pollution-control architecture. Amendment/current-version status must be checked before a final runtime status assertion.

### Japan
Candidate flagship: Basic Environment Law, Law No. 91 of 1993.
Primary source: Ministry of the Environment, Government of Japan.
Official English source identifies Law No. 91 of 1993, effective 13 November 1993, with general provisions, basic environmental policies, environmental quality standards, international cooperation, local-government implementation, and environmental councils.

### Australia
Candidate flagship: Environment Protection and Biodiversity Conservation Act 1999.
Primary source: Federal Register of Legislation.
Version control is mandatory because the Act is in an active reform sequence. The Federal Register showed Compilation 69 effective 1 July 2026 through 23 August 2026 and further Environment Protection Reform Act 2025 amendments commencing 24 August 2026. The R1 runtime record must bind to the post-24-August current compilation rather than preserve a superseded July compilation as current.

## Admission rule for runtime population

A candidate law may enter `world-law-catalog.ts` only when the record has:

- stable jurisdiction identity;
- official title and legal identifier;
- controlling/official source URL;
- current status or a bounded statement that status remains under verification;
- version/amendment evidence appropriate to the jurisdiction;
- present-meaning statement supported by official material;
- explicit applicability boundary;
- structural-limit statement that does not mischaracterize the law;
- TA-14 examination text separated from current law;
- TA-14 rewrite state explicitly marked PROPOSED, IN_EXAMINATION, or NOT_STARTED.

## R1 acceptance boundary

R1 is complete only when:

- each admitted multinational flagship record passes the admission rule;
- jurisdiction pages inherit only legally relevant parent layers represented by the engine;
- every admitted law resolves through `EXAMINE THIS LAW` to the governed `[slug]` route;
- current-law and TA-14 proposed-law surfaces remain visually and semantically separated;
- geography is never represented as sufficient applicability proof;
- source/version caveats remain visible where current consolidation is unsettled;
- repository verification passes before merge;
- production smoke testing confirms at least one non-US national record and the EU supranational record render through the governed law-detail route.

Research boundary established: 27 August 2026.
