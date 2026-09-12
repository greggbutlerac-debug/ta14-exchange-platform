import type { WorldLawInstrument } from './world-law-catalog';

// R2 expands the governed multinational corpus. Every record preserves an
// explicit version/applicability boundary; geography alone never establishes applicability.
export const globalR2Instruments: WorldLawInstrument[] = [
  {
    slug:'germany-federal-immission-control-act', title:'Bundes-Immissionsschutzgesetz (BImSchG) — Federal Immission Control Act', shortTitle:'Germany BImSchG', jurisdiction:'Germany', jurisdictionCode:'DE', layer:'NATIONAL', domain:'Air · Noise · Industrial Environmental Control', enacted:'15 March 1974; recast publication 17 May 2013', status:'In force · official federal text records 2026 amendments, with documentary processing cautions for June 2026 changes', authority:'Federal Republic of Germany',
    currentMeaning:'Provides the federal framework for protection against harmful environmental effects from air pollution, noise, vibrations and similar processes, including controls relevant to installations and environmental impacts.',
    applicability:'Applicability depends on the installation, activity, emission or other statutory trigger and the controlling federal and EU provisions. German geography alone is not an applicability determination.',
    architecture:['Protection against harmful environmental effects','Installation-related controls','Air-pollution and noise governance','Federal statutory implementation within the EU legal stack'],
    structuralLimit:'The official text records recent 2026 amendments and documentary-processing notes. A recent statutory text must not be converted into a proposition-specific evidence or outcome claim without verifying the controlling provision and current version.',
    ta14Defect:'Current-law identity and amendment state must remain distinct from evidence admissibility for a specific consequential environmental action.',
    ta14Rewrite:'Preserve BImSchG authority while binding consequential reliance to current-version evidence, proposition identity, continuity, admissibility, bounded authority, execution correspondence and outcome verification.', rewriteState:'IN_EXAMINATION',
    officialSources:[{label:'Gesetze im Internet — Bundes-Immissionsschutzgesetz',url:'https://www.gesetze-im-internet.de/bimschg/BJNR007210974.html',role:'Official federal statutory publication and amendment-status notice'}]
  },
  {
    slug:'france-environment-code', title:"Code de l’environnement — French Environmental Code", shortTitle:'France Environmental Code', jurisdiction:'France', jurisdictionCode:'FR', layer:'NATIONAL', domain:'Environmental Governance · Air · Water · Nature · Pollution', enacted:'Codified environmental framework; continuously amended', status:'In force · Légifrance current code publication reviewed 28 August 2026; data updated 20 August 2026', authority:'French Republic',
    currentMeaning:'Provides France’s codified legislative environmental framework, including common principles and extensive subject-specific environmental provisions across natural resources, pollution prevention, participation and environmental governance.',
    applicability:'The controlling duty depends on the relevant book, title, article, activity, facility, resource, authorization and inherited EU-law context. French geography alone is insufficient.',
    architecture:['Book I — common provisions and general principles','Public information and participation','Subject-specific environmental books and controls','National implementation within the EU legal order'],
    structuralLimit:'A consolidated code can establish controlling legal text while still requiring article-specific applicability, evidence standing and consequence authority for any particular environmental action.',
    ta14Rewrite:'Preserve the Code de l’environnement while adding proposition-bound record identity, continuity, admissibility, bounded binding authority, execution receipts and verified environmental outcomes for consequential reliance.', rewriteState:'IN_EXAMINATION',
    officialSources:[{label:"Légifrance — Code de l’environnement",url:'https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000006074220',role:'Official consolidated French environmental code and chronology gateway'}]
  },
  {
    slug:'new-zealand-resource-management-act-1991', title:'Resource Management Act 1991', shortTitle:'New Zealand RMA 1991', jurisdiction:'New Zealand', jurisdictionCode:'NZ', layer:'NATIONAL', domain:'Resource Management · Land · Water · Environmental Effects', enacted:'1991 · 1991 No 69', status:'In force · latest official version shown as at 10 July 2026; official site lists amendments not yet incorporated', authority:'New Zealand Parliament; administered by Ministry for Cities, Environment, Regions, and Transport',
    currentMeaning:'Establishes New Zealand’s principal resource-management framework for managing environmental effects and natural and physical resources, subject to the Act’s detailed planning, consenting and institutional provisions.',
    applicability:'The applicable rule or duty depends on the activity, resource, plan, consent, authority and statutory provision. New Zealand geography alone does not establish a particular RMA consequence.',
    architecture:['Sustainable/resource-management framework','Planning instruments','Resource consents and environmental effects','Central and local-government functions'],
    structuralLimit:'The official legislation site expressly lists amendments not yet incorporated into the latest displayed version. The engine therefore must preserve that version caveat and refuse to imply a fully incorporated current consolidation.',
    ta14Defect:'Unincorporated amendments create a currentness boundary that must remain visible before consequential reliance.',
    ta14Rewrite:'Preserve RMA authority while requiring explicit version-currentness, proposition identity, continuity, admissibility, bounded authority, execution evidence and outcome verification.', rewriteState:'IN_EXAMINATION',
    officialSources:[{label:'New Zealand Legislation — Resource Management Act 1991',url:'https://www.legislation.govt.nz/act/public/1991/0069/latest/whole.html',role:'Official legislation publication, version history and unincorporated-amendment notice'}]
  }
];
