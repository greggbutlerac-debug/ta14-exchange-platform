"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type LawStatus =
  | "In force"
  | "Phased implementation"
  | "Enacted"
  | "Proposed";

type Jurisdiction =
  | "European Union"
  | "United States"
  | "United Kingdom"
  | "Canada"
  | "China"
  | "International";

type LawRecord = {
  id: string;
  shortName: string;
  title: string;
  jurisdiction: Jurisdiction;
  status: LawStatus;
  authorityType: string;
  summary: string;
  applicability: string[];
  obligations: string[];
  evidence: string[];
  executionBoundary: string;
  sourceNotice: string;
};

const lawRecords: LawRecord[] = [
  {
    id: "clean-air-act",
    shortName: "Clean Air Act",
    title: "United States Clean Air Act",
    jurisdiction: "United States",
    status: "In force",
    authorityType: "Federal environmental statute",
    summary: "The principal United States federal statute for controlling air pollution from stationary and mobile sources, establishing national ambient air quality programs, hazardous-air-pollutant controls, operating permits, enforcement authorities, and state implementation responsibilities.",
    applicability: [
      "Facilities, sources, vehicles, fuels, states, tribes, and regulated entities within applicable Clean Air Act programs",
      "Activities subject to National Ambient Air Quality Standards, hazardous air pollutant controls, New Source Review, Title V, mobile-source, acid-rain, or ozone-protection requirements",
      "Owners and operators whose permits, emissions, monitoring, reporting, or control obligations are triggered by statute or implementing regulation",
    ],
    obligations: [
      "Determine the controlling Clean Air Act title, section, permit, state implementation plan, and implementing regulation",
      "Preserve emissions, monitoring, calibration, operating-condition, deviation, and reporting records",
      "Maintain required pollution controls and comply with emission limits, work-practice standards, permits, and enforcement orders",
      "Reassess applicability when equipment, process, fuel, throughput, location, rule, permit, or operating condition changes",
    ],
    evidence: [
      "Source and facility identity",
      "Applicable permit and regulatory citation",
      "Emissions inventory and test results",
      "Continuous monitoring and calibration records",
      "Control-device operating evidence",
      "Deviation, notice, reporting, and corrective-action records",
    ],
    executionBoundary: "A permit, model, annual average, or compliance report does not by itself prove that a specific occupied environment, exposure event, release, or intervention was environmentally valid at the time consequence occurred.",
    sourceNotice: "Consult the United States Code, EPA Clean Air Act materials, applicable 40 CFR parts, state implementation plans, permits, Federal Register actions, and current judicial decisions.",
  },
  {
    id: "clean-water-act",
    shortName: "Clean Water Act",
    title: "Federal Water Pollution Control Act, commonly called the Clean Water Act",
    jurisdiction: "United States",
    status: "In force",
    authorityType: "Federal environmental statute",
    summary: "The foundational United States statute governing pollutant discharges to waters, water-quality standards, permits, pretreatment, wetlands and dredge-or-fill activities, spill response, enforcement, and state, tribal, and federal implementation.",
    applicability: [
      "Point-source dischargers and entities requiring National Pollutant Discharge Elimination System permits",
      "States, territories, and authorized tribes developing water-quality standards, impaired-waters lists, and total maximum daily loads",
      "Projects involving dredged or fill material, stormwater, industrial wastewater, municipal systems, pretreatment, or regulated spills",
    ],
    obligations: [
      "Identify the covered water, discharge, pollutant, point source, permit pathway, designated use, criterion, and responsible authority",
      "Preserve sampling, flow, laboratory, chain-of-custody, discharge-monitoring, bypass, upset, and corrective-action records",
      "Comply with technology-based and water-quality-based limits, permit conditions, reporting duties, and enforcement requirements",
      "Verify whether intervention restored the chemical, physical, and biological condition relevant to the governed claim",
    ],
    evidence: [
      "Permit and outfall record",
      "Sampling plan and chain of custody",
      "Laboratory analytical package",
      "Discharge monitoring report",
      "Water-quality standard and designated-use map",
      "Violation, spill, bypass, remediation, and outcome records",
    ],
    executionBoundary: "A permit limit or isolated sample does not establish the complete condition of a waterbody, the validity of every exposure, or the success of remediation without continuity, context, authority, and outcome evidence.",
    sourceNotice: "Consult the official statute, EPA Clean Water Act program materials, applicable 40 CFR provisions, permits, state or tribal standards, and current jurisdictional decisions.",
  },
  {
    id: "safe-drinking-water-act",
    shortName: "Safe Drinking Water Act",
    title: "United States Safe Drinking Water Act",
    jurisdiction: "United States",
    status: "In force",
    authorityType: "Federal public-health and environmental statute",
    summary: "The principal federal law protecting public drinking-water supplies through national primary drinking-water regulations, public-water-system oversight, underground-injection controls, source-water protections, monitoring, notification, and enforcement.",
    applicability: [
      "Public water systems and responsible owners or operators",
      "States, tribes, laboratories, and primacy agencies administering drinking-water programs",
      "Underground injection activities and other regulated pathways capable of affecting drinking-water sources",
    ],
    obligations: [
      "Determine system type, contaminant, monitoring schedule, treatment technique, maximum contaminant level, and responsible authority",
      "Maintain sampling-site, laboratory, method, quality-control, treatment, distribution, violation, and public-notice records",
      "Provide required notices and corrective actions when standards, monitoring, or treatment duties are not met",
      "Preserve post-correction evidence showing whether the affected water system returned to a supportable condition",
    ],
    evidence: [
      "System inventory and source record",
      "Sampling plan and laboratory results",
      "Method and quality-control record",
      "Treatment and distribution operating data",
      "Public notice and consumer confidence report",
      "Corrective action and return-to-service evidence",
    ],
    executionBoundary: "A compliant annual report or a sample below a limit does not prove continuous safety at every tap, time, building, or vulnerable-use condition.",
    sourceNotice: "Consult the official statute, EPA drinking-water regulations and guidance, state primacy requirements, public-water-system records, and current health advisories.",
  },
  {
    id: "rcra",
    shortName: "RCRA",
    title: "Resource Conservation and Recovery Act",
    jurisdiction: "United States",
    status: "In force",
    authorityType: "Federal waste-management statute",
    summary: "The federal cradle-to-grave framework for hazardous waste and a principal framework for solid waste, treatment, storage, disposal, corrective action, underground storage tanks, permitting, tracking, and enforcement.",
    applicability: [
      "Generators, transporters, treatment, storage, and disposal facilities",
      "Owners and operators of regulated waste units and underground storage tanks",
      "States and authorized programs implementing hazardous and solid-waste requirements",
    ],
    obligations: [
      "Classify wastes and generator status correctly",
      "Preserve manifests, profiles, accumulation, inspection, training, contingency, shipment, receipt, and disposal records",
      "Operate permitted or conditionally exempt pathways within applicable limits",
      "Investigate releases, conduct corrective action, and verify closure or remediation outcomes",
    ],
    evidence: [
      "Waste determination",
      "Generator and facility identification",
      "Manifest and chain-of-custody record",
      "Inspection and training record",
      "Permit and operating record",
      "Release, corrective-action, closure, and post-closure evidence",
    ],
    executionBoundary: "A signed manifest establishes a custody transaction, not the environmental validity of handling, treatment, disposal, closure, or resulting site condition.",
    sourceNotice: "Consult the official statute, EPA RCRA materials, applicable 40 CFR parts, authorized state rules, permits, and current waste determinations.",
  },
  {
    id: "cercla",
    shortName: "CERCLA / Superfund",
    title: "Comprehensive Environmental Response, Compensation, and Liability Act",
    jurisdiction: "United States",
    status: "In force",
    authorityType: "Federal cleanup and liability statute",
    summary: "The federal framework for responding to releases or threatened releases of hazardous substances, assigning liability, conducting removal and remedial actions, recovering costs, and preserving long-term cleanup records.",
    applicability: [
      "Potentially responsible parties, owners, operators, arrangers, and transporters within statutory boundaries",
      "Federal, state, tribal, and local response authorities",
      "Sites evaluated, listed, investigated, removed, remediated, monitored, or deleted under Superfund pathways",
    ],
    obligations: [
      "Identify the release, hazardous substance, site, responsible parties, response authority, and applicable or relevant requirements",
      "Preserve sampling, risk, remedy-selection, community, cost, implementation, and monitoring records",
      "Implement authorized removal or remedial actions and institutional controls",
      "Verify remedy performance and preserve unresolved contamination, restrictions, and future-reliance limits",
    ],
    evidence: [
      "Preliminary assessment and site inspection",
      "Remedial investigation and feasibility study",
      "Record of decision",
      "Sampling and laboratory package",
      "Removal or remedial action record",
      "Five-year review and long-term monitoring evidence",
    ],
    executionBoundary: "Remedy completion, construction completion, or site deletion does not automatically establish that every pathway, exposure, building, parcel, or future use is safe.",
    sourceNotice: "Consult the official statute, National Contingency Plan, EPA Superfund records, records of decision, consent instruments, site files, and current judicial authority.",
  },
  {
    id: "tsca",
    shortName: "TSCA",
    title: "Toxic Substances Control Act",
    jurisdiction: "United States",
    status: "In force",
    authorityType: "Federal chemical-control statute",
    summary: "The federal law governing chemical reporting, review, testing, risk evaluation, risk management, restrictions, records, and selected substances and products, as amended by the Frank R. Lautenberg Chemical Safety for the 21st Century Act.",
    applicability: [
      "Manufacturers, importers, processors, distributors, users, and disposers within applicable chemical rules",
      "Entities subject to reporting, testing, significant-new-use, risk-management, PCB, asbestos, lead, or other TSCA programs",
      "Chemical substances and mixtures within statutory and regulatory scope",
    ],
    obligations: [
      "Identify substance identity, activity, exemption, rule, use condition, and responsible role",
      "Maintain manufacturing, import, processing, exposure, release, testing, and downstream communication records",
      "Comply with restrictions, prohibitions, reporting, recordkeeping, certification, and disposal conditions",
      "Reassess when substance, use, process, supplier, formulation, rule, or risk-management condition changes",
    ],
    evidence: [
      "Chemical identity and inventory status",
      "Safety and exposure information",
      "Test and risk-evaluation evidence",
      "Significant-new-use determination",
      "Restriction and compliance record",
      "Downstream communication and disposal evidence",
    ],
    executionBoundary: "Presence on an inventory or compliance with a narrow chemical rule does not establish that a product, building, exposure, or disposal pathway is environmentally acceptable for every use.",
    sourceNotice: "Consult the official statute, EPA chemical-specific rules, risk evaluations, risk-management actions, reporting rules, and current court decisions.",
  },
  {
    id: "fifra",
    shortName: "FIFRA",
    title: "Federal Insecticide, Fungicide, and Rodenticide Act",
    jurisdiction: "United States",
    status: "In force",
    authorityType: "Federal pesticide statute",
    summary: "The principal federal law governing pesticide registration, labeling, distribution, sale, use, production, records, worker protection, applicator requirements, enforcement, and associated environmental controls.",
    applicability: [
      "Pesticide registrants, producers, sellers, distributors, applicators, employers, and users",
      "Products, devices, establishments, applications, and uses within FIFRA and related rules",
      "State and tribal agencies implementing or enforcing delegated pesticide programs",
    ],
    obligations: [
      "Use registered products consistently with labeling and applicable restrictions",
      "Preserve product, lot, establishment, applicator, location, weather, rate, target, notice, and application records",
      "Protect workers, handlers, bystanders, water, sensitive species, and restricted areas as required",
      "Investigate misuse, drift, exposure, release, and adverse effects and preserve corrective actions",
    ],
    evidence: [
      "Registration and label version",
      "Applicator credential",
      "Application and weather record",
      "Worker-protection evidence",
      "Drift, exposure, complaint, or incident record",
      "Corrective action and environmental outcome evidence",
    ],
    executionBoundary: "Registration authorizes labeled uses under defined conditions; it does not prove that a particular application was correctly executed or caused no environmental or human consequence.",
    sourceNotice: "Consult the official statute, EPA pesticide regulations, current label, registration decisions, state or tribal requirements, and applicable worker-protection rules.",
  },
  {
    id: "epcra",
    shortName: "EPCRA",
    title: "Emergency Planning and Community Right-to-Know Act",
    jurisdiction: "United States",
    status: "In force",
    authorityType: "Federal emergency-planning and disclosure statute",
    summary: "A federal statute supporting emergency planning and public access to information about hazardous and toxic chemicals through release notification, inventory reporting, toxic-release reporting, and local planning structures.",
    applicability: [
      "Facilities possessing or releasing covered chemicals above applicable thresholds",
      "State emergency response commissions, local emergency planning committees, fire departments, and response authorities",
      "Owners and operators subject to emergency-release, inventory, safety-data, or toxic-release reporting",
    ],
    obligations: [
      "Determine chemical, threshold, reporting section, facility, release, and recipient requirements",
      "Submit accurate and timely emergency notices, inventories, forms, and updates",
      "Coordinate with emergency planners and preserve facility and community response information",
      "Correct inaccurate records and maintain version, submission, and receipt evidence",
    ],
    evidence: [
      "Chemical inventory and threshold calculation",
      "Safety data and facility map",
      "Emergency release notification",
      "Tier reporting record",
      "Toxic Release Inventory submission",
      "Correction, response, and community-access record",
    ],
    executionBoundary: "Disclosure of a chemical quantity or annual release does not prove that a facility prevented exposure, maintained control, or achieved an acceptable environmental outcome.",
    sourceNotice: "Consult the official statute, EPA EPCRA and TRI materials, current reporting instructions, thresholds, exemptions, and state or local requirements.",
  },
  {
    id: "pollution-prevention-act",
    shortName: "Pollution Prevention Act",
    title: "United States Pollution Prevention Act of 1990",
    jurisdiction: "United States",
    status: "In force",
    authorityType: "Federal pollution-prevention policy statute",
    summary: "A federal statute establishing pollution prevention at the source as a national policy priority ahead of recycling, treatment, and disposal and supporting data collection and technical assistance.",
    applicability: [
      "Industrial and other entities evaluating source reduction and waste-generation pathways",
      "Facilities with related toxic chemical and source-reduction reporting duties",
      "Agencies and programs prioritizing prevention before downstream control",
    ],
    obligations: [
      "Identify opportunities to prevent or reduce pollution before it is created",
      "Preserve baselines, process changes, material substitutions, production-normalized quantities, releases, transfers, and outcomes",
      "Avoid claiming prevention based only on shifting pollution between media, locations, contractors, or accounting categories",
      "Verify whether source reduction persisted and whether new hazards or burdens were introduced",
    ],
    evidence: [
      "Material and process baseline",
      "Source-reduction plan",
      "Production-normalized quantity record",
      "Release and transfer comparison",
      "Substitution and hazard review",
      "Post-change environmental outcome evidence",
    ],
    executionBoundary: "A reduction in reported waste volume does not establish pollution prevention if toxicity, exposure, energy, water, location, or another environmental burden increased.",
    sourceNotice: "Consult the official statute, EPA pollution-prevention resources, TRI source-reduction reporting, sector guidance, and applicable program requirements.",
  },
  {
    id: "nepa",
    shortName: "NEPA",
    title: "National Environmental Policy Act",
    jurisdiction: "United States",
    status: "In force",
    authorityType: "Federal environmental review statute",
    summary: "The United States procedural environmental-review statute requiring federal agencies to evaluate environmental effects of major federal actions within applicable statutory and regulatory boundaries and to preserve a reviewable decision process.",
    applicability: [
      "Federal agencies proposing or authorizing covered actions",
      "Applicants, contractors, cooperating agencies, tribes, states, communities, and affected parties participating in review",
      "Actions requiring categorical exclusion review, environmental assessment, or environmental impact statement pathways",
    ],
    obligations: [
      "Define the proposed action, purpose, need, alternatives, affected environment, effects, mitigation, authority, and review pathway",
      "Use current, attributable information and disclose assumptions, uncertainty, missing information, and relevant cumulative or connected conditions as required",
      "Preserve public participation, consultation, findings, decisions, mitigation commitments, and monitoring",
      "Reevaluate when the action, evidence, environment, authority, or anticipated effect materially changes",
    ],
    evidence: [
      "Categorical exclusion record",
      "Environmental assessment or impact statement",
      "Alternatives and effects analysis",
      "Consultation and public-comment record",
      "Finding or record of decision",
      "Mitigation monitoring and supplemental-review evidence",
    ],
    executionBoundary: "Completion of an environmental-review document is not proof that the selected action caused the predicted outcome or that mitigation was implemented and effective.",
    sourceNotice: "Consult the official statute, current Council on Environmental Quality regulations, agency procedures, project records, and controlling judicial authority.",
  },
  {
    id: "ocean-dumping-act",
    shortName: "MPRSA / Ocean Dumping Act",
    title: "Marine Protection, Research, and Sanctuaries Act",
    jurisdiction: "United States",
    status: "In force",
    authorityType: "Federal marine-protection statute",
    summary: "A federal statute governing transportation and dumping of material into ocean waters, research, monitoring, permitting, designated sites, enforcement, and marine sanctuaries through multiple federal authorities.",
    applicability: [
      "Persons transporting material for ocean dumping and permit applicants",
      "Federal agencies responsible for ocean-dumping and sanctuary pathways",
      "Projects involving dredged material, dumping sites, monitoring, research, or marine protection",
    ],
    obligations: [
      "Identify the material, source, transport, disposal site, permit authority, testing, alternatives, and environmental criteria",
      "Preserve sampling, characterization, chain of custody, permit, vessel, location, quantity, and monitoring records",
      "Operate only within authorized material, site, timing, method, and reporting conditions",
      "Verify seabed, water-column, ecological, and site-management outcomes",
    ],
    evidence: [
      "Material characterization",
      "Permit and alternatives analysis",
      "Vessel and load record",
      "Disposal coordinates and quantity",
      "Site monitoring data",
      "Violation, response, and environmental outcome record",
    ],
    executionBoundary: "A disposal permit does not establish that every load met its characterization, placement, timing, operational, and environmental conditions.",
    sourceNotice: "Consult the official statute, EPA and U.S. Army Corps materials, applicable regulations, permits, site-management plans, and sanctuary authorities.",
  },
  {
    id: "oil-pollution-act",
    shortName: "Oil Pollution Act",
    title: "United States Oil Pollution Act of 1990",
    jurisdiction: "United States",
    status: "In force",
    authorityType: "Federal oil-spill prevention, response, liability, and compensation statute",
    summary: "A federal framework strengthening oil-spill prevention, preparedness, response, liability, financial responsibility, and restoration following discharges to navigable waters and adjoining shorelines.",
    applicability: [
      "Vessels, facilities, owners, operators, responsible parties, and response organizations within statutory scope",
      "Entities subject to spill-prevention, response-plan, financial-responsibility, reporting, removal, or damages requirements",
      "Federal, state, tribal, local, and natural-resource trustee authorities",
    ],
    obligations: [
      "Maintain applicable prevention and response plans, equipment, training, drills, inspection, and financial-responsibility evidence",
      "Report discharges and preserve time, source, quantity, pathway, response, recovery, waste, and restoration records",
      "Coordinate authorized response and natural-resource-damage assessment",
      "Verify cleanup endpoints, residual contamination, restoration, restrictions, and long-term outcomes",
    ],
    evidence: [
      "Prevention and response plan",
      "Inspection, training, and drill record",
      "Discharge notification and trajectory evidence",
      "Response and recovered-material record",
      "Natural-resource damage assessment",
      "Restoration and long-term monitoring evidence",
    ],
    executionBoundary: "Removal of visible oil or completion of response operations does not prove that ecological, shoreline, sediment, building, worker, or community consequences were resolved.",
    sourceNotice: "Consult the official statute, Coast Guard and EPA regulations, area and facility plans, response records, consent instruments, and trustee restoration records.",
  },
  {
    id: "endangered-species-act",
    shortName: "Endangered Species Act",
    title: "United States Endangered Species Act",
    jurisdiction: "United States",
    status: "In force",
    authorityType: "Federal species-conservation statute",
    summary: "A federal law protecting listed species and designated critical habitat through listing, consultation, take prohibitions, permits, recovery planning, interagency duties, and enforcement.",
    applicability: [
      "Federal agencies whose actions may affect listed species or critical habitat",
      "Applicants and entities conducting activities potentially involving prohibited take",
      "Land, water, infrastructure, pollution, pesticide, energy, and development activities intersecting protected species or habitat",
    ],
    obligations: [
      "Identify species, habitat, action area, effects, consultation pathway, permit, and responsible authority",
      "Preserve surveys, methods, seasonal conditions, assumptions, consultation, biological opinions, terms, and monitoring",
      "Operate within incidental-take, reasonable-and-prudent, conservation, reporting, and permit conditions",
      "Verify actual effects and reinitiate review when triggers, evidence, action, or conditions change",
    ],
    evidence: [
      "Species and habitat determination",
      "Survey and methodology record",
      "Consultation package",
      "Biological assessment or opinion",
      "Permit and take record",
      "Monitoring, reinitiation, and recovery evidence",
    ],
    executionBoundary: "Completion of consultation or possession of a permit does not prove that actual take, habitat effects, mitigation, or recovery outcomes remained within the authorized boundary.",
    sourceNotice: "Consult the official statute, U.S. Fish and Wildlife Service and NOAA Fisheries regulations and records, permits, consultations, recovery plans, and current judicial authority.",
  },
  {
    id: "aim-act",
    shortName: "AIM Act",
    title: "American Innovation and Manufacturing Act of 2020",
    jurisdiction: "United States",
    status: "In force",
    authorityType: "Federal climate and refrigerant statute",
    summary: "A federal statute authorizing phasedown, management, and technology-transition programs for hydrofluorocarbons, including allowance, reclamation, servicing, leak-management, reporting, and sector-transition requirements implemented by EPA.",
    applicability: [
      "Producers, importers, exporters, reclaimers, distributors, equipment owners, service providers, and regulated sectors",
      "Hydrofluorocarbons and products or equipment within allowance, management, or transition programs",
      "Activities subject to refrigerant handling, reporting, labeling, leak, reclamation, or technology restrictions",
    ],
    obligations: [
      "Determine substance, equipment, sector, date, allowance, servicing, leak, reclamation, and reporting requirements",
      "Preserve cylinder, quantity, identity, transfer, recovery, reclamation, charging, leak, repair, disposal, and technician records",
      "Use compliant substances and equipment within transition and management boundaries",
      "Verify actual refrigerant containment, recovery, repair, and environmental outcome rather than relying on paperwork alone",
    ],
    evidence: [
      "Refrigerant identity and cylinder record",
      "Allowance or transaction evidence",
      "Technician and equipment identity",
      "Leak inspection and repair record",
      "Recovery and reclamation record",
      "Disposal and post-intervention verification",
    ],
    executionBoundary: "Compliance with an allowance or product transition does not prove that field charging, recovery, leak repair, disposal, or atmospheric release was correctly executed.",
    sourceNotice: "Consult the official statute, EPA HFC regulations, current sector restrictions, refrigerant-management requirements, reporting instructions, and enforcement materials.",
  },
  {
    id: "montreal-protocol",
    shortName: "Montreal Protocol",
    title: "Montreal Protocol on Substances that Deplete the Ozone Layer",
    jurisdiction: "International",
    status: "In force",
    authorityType: "Multilateral environmental agreement",
    summary: "A global treaty controlling production and consumption of ozone-depleting substances, strengthened through adjustments and amendments and linked to national licensing, reporting, trade, recovery, servicing, and phaseout systems.",
    applicability: [
      "Parties and national authorities implementing treaty controls",
      "Producers, importers, exporters, distributors, equipment owners, and service sectors covered by national implementation",
      "Controlled substances, products, equipment, banks, recovery, reclamation, destruction, and trade pathways",
    ],
    obligations: [
      "Identify the controlling treaty amendment, national law, substance, schedule, exemption, licensing, and reporting pathway",
      "Preserve production, import, export, transfer, servicing, recovery, reclamation, destruction, and stock records",
      "Prevent unauthorized production, trade, release, or use and verify national implementation",
      "Distinguish treaty obligations from the domestic legal instrument that directly binds an entity",
    ],
    evidence: [
      "Substance and schedule record",
      "License and customs record",
      "Production and consumption data",
      "Servicing and recovery evidence",
      "Reclamation or destruction record",
      "National implementation and compliance evidence",
    ],
    executionBoundary: "Treaty success at global production or consumption levels does not prove that a particular cylinder, installation, service event, or release was governed correctly.",
    sourceNotice: "Consult the official treaty text, adjustments and amendments, Ozone Secretariat decisions, national implementing law, schedules, exemptions, and current reporting rules.",
  },
  {
    id: "paris-agreement",
    shortName: "Paris Agreement",
    title: "Paris Agreement under the United Nations Framework Convention on Climate Change",
    jurisdiction: "International",
    status: "In force",
    authorityType: "Multilateral climate agreement",
    summary: "A global climate agreement establishing mitigation, adaptation, finance, transparency, nationally determined contribution, stocktake, and cooperative-framework duties for Parties, implemented through national and regional legal systems.",
    applicability: [
      "State Parties and institutions responsible for national implementation",
      "Programs, sectors, markets, projects, and entities affected through domestic climate law, permits, procurement, finance, disclosure, or cooperative mechanisms",
      "Mitigation, adaptation, inventory, reporting, finance, and transition pathways",
    ],
    obligations: [
      "Distinguish international Party obligations from directly applicable domestic duties",
      "Preserve inventory methods, baselines, assumptions, targets, measures, progress, corrections, and outcomes",
      "Avoid converting scenarios, pledges, offsets, or estimates into unsupported claims of achieved environmental consequence",
      "Trace each entity-level duty to current national or regional authority",
    ],
    evidence: [
      "Nationally determined contribution",
      "Greenhouse-gas inventory",
      "Method and baseline record",
      "Policy and measure record",
      "Transparency and review submission",
      "Verified mitigation or adaptation outcome evidence",
    ],
    executionBoundary: "A national target, modeled pathway, credit, or disclosure does not by itself prove that a specific intervention produced additional, durable, non-shifted climate benefit.",
    sourceNotice: "Consult the official agreement, decisions of the Parties, UNFCCC reporting rules, national implementation, registries, methods, and current market or sector law.",
  },
  {
    id: "basel-convention",
    shortName: "Basel Convention",
    title: "Basel Convention on the Control of Transboundary Movements of Hazardous Wastes and Their Disposal",
    jurisdiction: "International",
    status: "In force",
    authorityType: "Multilateral waste agreement",
    summary: "A global treaty governing transboundary movement and environmentally sound management of hazardous and other covered wastes through classification, prior informed consent, tracking, trade controls, return duties, and national implementation.",
    applicability: [
      "State Parties and competent authorities",
      "Generators, exporters, importers, carriers, disposers, brokers, recyclers, and facilities affected by national implementation",
      "Hazardous and other covered waste movements, including applicable plastic-waste and electronic-waste pathways",
    ],
    obligations: [
      "Classify the waste, countries, parties, movement, consent, contract, carrier, facility, disposal operation, and national requirements",
      "Preserve notification, consent, movement, customs, chain-of-custody, receipt, disposal, recycling, and return records",
      "Prevent illegal traffic and verify environmentally sound management at the receiving facility",
      "Distinguish treaty classifications from stricter national definitions and controls",
    ],
    evidence: [
      "Waste classification",
      "Notification and consent",
      "Movement document",
      "Carrier and customs record",
      "Facility receipt and disposal certificate",
      "Illegal-traffic, return, and environmental outcome evidence",
    ],
    executionBoundary: "A completed movement document does not prove that the waste was correctly classified, lawfully accepted, environmentally managed, or prevented from causing downstream harm.",
    sourceNotice: "Consult the official convention, amendments, Conference of the Parties decisions, technical guidelines, Party status, and national implementing laws.",
  },
  {
    id: "stockholm-convention",
    shortName: "Stockholm Convention",
    title: "Stockholm Convention on Persistent Organic Pollutants",
    jurisdiction: "International",
    status: "In force",
    authorityType: "Multilateral chemicals agreement",
    summary: "A global treaty requiring elimination, restriction, reduction, inventory, management, and disposal measures for listed persistent organic pollutants, with national implementation and periodic listing updates.",
    applicability: [
      "State Parties and national authorities",
      "Manufacturers, users, holders, waste managers, sites, products, equipment, and sectors affected through national implementation",
      "Listed chemicals, unintentional releases, stockpiles, articles, contaminated sites, and wastes",
    ],
    obligations: [
      "Identify the chemical, annex, exemption, use, stockpile, release source, waste, site, and national implementing requirement",
      "Preserve inventories, analytical methods, production, use, release, transfer, destruction, disposal, and remediation records",
      "Prevent recycling or recirculation that conflicts with destruction or irreversible-transformation duties",
      "Verify actual reduction, elimination, containment, destruction, and site outcome",
    ],
    evidence: [
      "Chemical and annex determination",
      "Inventory and analytical record",
      "Exemption or acceptable-purpose record",
      "Release and transfer inventory",
      "Destruction or disposal evidence",
      "Contaminated-site and outcome record",
    ],
    executionBoundary: "Listing or national reporting does not prove that a particular stockpile, article, emission source, waste stream, or contaminated site was controlled effectively.",
    sourceNotice: "Consult the official convention, annex updates, Conference decisions, technical guidance, national implementation plans, and domestic chemical and waste law.",
  },
  {
    id: "minamata-convention",
    shortName: "Minamata Convention",
    title: "Minamata Convention on Mercury",
    jurisdiction: "International",
    status: "In force",
    authorityType: "Multilateral chemicals and pollution agreement",
    summary: "A global treaty addressing mercury supply, trade, products, processes, artisanal and small-scale gold mining, emissions, releases, storage, waste, contaminated sites, health, information, and national implementation.",
    applicability: [
      "State Parties and national authorities",
      "Mercury producers, traders, product and process sectors, mining, facilities, waste handlers, laboratories, and affected communities within domestic implementation",
      "Mercury and mercury compounds across supply, use, emissions, releases, waste, storage, and site pathways",
    ],
    obligations: [
      "Identify the mercury pathway, source, product, process, trade, exemption, emissions or releases control, waste, storage, and national authority",
      "Preserve mass balance, analytical, trade, production, use, emissions, releases, waste, storage, exposure, and remediation records",
      "Implement control measures and avoid transferring mercury burden between air, water, land, products, workers, and communities",
      "Verify reductions and environmental or exposure outcomes",
    ],
    evidence: [
      "Mercury identity and mass balance",
      "Trade and consent record",
      "Product or process record",
      "Emissions and releases data",
      "Waste and storage record",
      "Site, exposure, remediation, and outcome evidence",
    ],
    executionBoundary: "A national inventory or facility report does not establish that mercury was contained, exposures prevented, waste stabilized, or environmental conditions restored.",
    sourceNotice: "Consult the official convention, annexes, Conference decisions, technical guidance, Party status, and national implementing law.",
  },
  {
    id: "who-air-quality-guidelines",
    shortName: "WHO Air Quality Guidelines",
    title: "WHO Global Air Quality Guidelines for PM2.5, PM10, ozone, nitrogen dioxide, sulfur dioxide, and carbon monoxide",
    jurisdiction: "International",
    status: "In force",
    authorityType: "Non-binding global health guidance",
    summary: "World Health Organization health-based air-quality guideline levels and interim targets intended to inform legislation and policy. They are evidence-informed guidance, not enacted law or automatically enforceable standards.",
    applicability: [
      "Governments and authorities developing air-quality law, standards, policy, monitoring, and health protection",
      "Institutions comparing legal limits with health-based evidence",
      "Researchers, public-health bodies, communities, building operators, and environmental governance systems using the guidance within declared boundaries",
    ],
    obligations: [
      "Preserve the distinction between health guidance, legal limits, occupational limits, indoor standards, and enforceable permit conditions",
      "Identify pollutant, averaging time, method, population, location, uncertainty, and comparison basis",
      "Avoid declaring legal compliance, causation, diagnosis, or safety solely from a WHO guideline comparison",
      "Use guideline evidence transparently when proposing stronger law, policy, monitoring, or intervention",
    ],
    evidence: [
      "Pollutant and averaging-time record",
      "Method and quality-control evidence",
      "Location and population context",
      "Legal-limit and guideline comparison",
      "Uncertainty and limitation declaration",
      "Intervention and outcome comparison",
    ],
    executionBoundary: "A concentration below a guideline does not prove zero risk, universal safety, legal compliance, or validity for every person, indoor environment, activity, and duration.",
    sourceNotice: "Consult the official WHO publication, pollutant-specific guidance, interim targets, updates, methods, and the applicable national or local law.",
  },
  {
    id: "eu-ai-act",
    shortName: "EU AI Act",
    title: "European Union Artificial Intelligence Act",
    jurisdiction: "European Union",
    status: "Phased implementation",
    authorityType: "Binding regional legislation",
    summary: "A risk-based legal framework governing prohibited AI practices, high-risk AI systems, transparency duties, general-purpose AI models, governance, enforcement, and market oversight.",
    applicability: [
      "Providers, deployers, importers, distributors, product manufacturers, and authorized representatives within territorial and role boundaries",
      "Certain providers and deployers outside the European Union when regulated outputs or systems affect the Union",
      "AI systems and general-purpose AI models within applicable classifications and effective dates",
    ],
    obligations: [
      "Determine role, system classification, prohibited-practice, high-risk, transparency, or general-purpose AI duties",
      "Maintain required risk management, data governance, technical documentation, records, human oversight, testing, monitoring, incident, and corrective-action evidence",
      "Trace harmonized standards, common specifications, guidance, and competent authority requirements without treating them as interchangeable",
      "Revalidate applicability when system, model, provider, deployer, purpose, data, version, territory, or effective date changes",
    ],
    evidence: [
      "Classification and role record",
      "Risk-management file",
      "Technical documentation",
      "Validation and testing results",
      "Human-oversight record",
      "Post-market monitoring and incident evidence",
    ],
    executionBoundary: "Conformity or classification does not prove that a specific runtime action had current authority, admissible evidence, bounded commitment, controlled execution, and verified outcome.",
    sourceNotice: "Consult the official regulation, corrigenda, implementation dates, delegated and implementing acts, standards, guidance, and competent authority materials.",
  },
  {
    id: "colorado-ai-act",
    shortName: "Colorado AI Act",
    title: "Colorado Artificial Intelligence Act",
    jurisdiction: "United States",
    status: "Enacted",
    authorityType: "State artificial-intelligence statute",
    summary: "A state framework addressing developers and deployers of covered high-risk artificial intelligence systems and duties intended to reduce algorithmic discrimination in consequential decisions.",
    applicability: [
      "Developers and deployers of covered high-risk AI systems within jurisdictional, role, and exemption boundaries",
      "Covered consequential decisions and consumer interactions",
      "Organizations preparing for the current effective date, amendments, attorney-general rules, and enforcement framework",
    ],
    obligations: [
      "Determine covered role, system, consequential decision, consumer, exemption, and effective requirement",
      "Maintain documentation, disclosures, impact assessments, risk management, monitoring, notices, correction, appeal, and human-review records as applicable",
      "Avoid treating developer documentation as proof of deployer execution",
      "Revalidate when system, use, model, data, decision, role, consumer population, or law changes",
    ],
    evidence: [
      "Covered-system determination",
      "Developer documentation",
      "Impact assessment",
      "Risk-management record",
      "Consumer notice and appeal evidence",
      "Monitoring and corrective-action record",
    ],
    executionBoundary: "A general policy, impact assessment, or vendor assurance does not prove that a particular consequential decision was authorized, evidence-supported, reviewed, and preserved.",
    sourceNotice: "Consult the enacted statutory text, amendments, attorney-general materials, rulemaking, effective dates, exemptions, and current judicial authority.",
  },
  {
    id: "nyc-local-law-144",
    shortName: "NYC Local Law 144",
    title: "New York City Automated Employment Decision Tool Requirements",
    jurisdiction: "United States",
    status: "In force",
    authorityType: "Municipal employment and automated-decision law",
    summary: "Requirements governing certain automated employment decision tools used in hiring and promotion, including bias-audit, publication, and notice obligations.",
    applicability: [
      "Employers and employment agencies using a covered automated employment decision tool",
      "Covered hiring or promotion decisions involving candidates or employees in New York City",
      "Tool versions and uses satisfying the governing definitions",
    ],
    obligations: [
      "Determine whether the tool and use are covered",
      "Obtain the required independent bias audit and make required information publicly available",
      "Provide required notices before use and preserve the version, date, population, process, and decision pathway",
      "Reassess after material tool or use changes",
    ],
    evidence: [
      "Tool-scope determination",
      "Independent bias audit",
      "Published audit summary",
      "Candidate or employee notice",
      "Tool version and use record",
      "Change and corrective-action history",
    ],
    executionBoundary: "A published audit does not establish that every later employment decision used the same version, data, conditions, authority, or human-review controls.",
    sourceNotice: "Consult the official city law, enforcement rules, definitions, frequently asked questions, current enforcement guidance, and applicable employment law.",
  },
  {
    id: "oecd-ai-principles",
    shortName: "OECD AI Principles",
    title: "OECD Recommendation of the Council on Artificial Intelligence",
    jurisdiction: "International",
    status: "In force",
    authorityType: "Non-binding intergovernmental recommendation",
    summary: "International principles promoting innovative and trustworthy AI, human-centered values, transparency, robustness, accountability, and policy cooperation. They are not independently binding law.",
    applicability: [
      "Governments adopting or implementing the recommendation",
      "Organizations using the principles as a governance benchmark",
      "Policy, procurement, assurance, or standards programs that incorporate the principles",
    ],
    obligations: [
      "Identify when the principles are voluntary guidance and when another instrument makes them mandatory",
      "Translate general principles into bounded roles, controls, evidence, decisions, and review pathways",
      "Preserve the source, version, interpretation, and implementation context",
      "Avoid claiming legal compliance solely from alignment with principles",
    ],
    evidence: [
      "Principles mapping",
      "Policy and control record",
      "Risk and impact assessment",
      "Transparency record",
      "Accountability assignment",
      "Monitoring and improvement evidence",
    ],
    executionBoundary: "A voluntary principle can guide governance but does not independently create the authority needed to release a consequential action.",
    sourceNotice: "Consult the official OECD text, updates, national implementations, and any binding instrument that incorporates the principles.",
  },
  {
    id: "ta14-clean-air-act-upgrade",
    shortName: "TA-14 Clean Air Act Upgrade",
    title: "TA-14 Proposed Clean Air and Atmospheric Integrity Act",
    jurisdiction: "International",
    status: "Proposed",
    authorityType: "TA-14 model law proposal",
    summary: "A proposed model legislative upgrade intended to connect ambient air, indoor environments, buildings, personal atmospheric records, instruments, continuity, admissibility, intervention, enforcement, and verified outcomes instead of governing emissions and compliance records as disconnected domains.",
    applicability: [
      "Legislatures, regulators, public-health bodies, building authorities, environmental agencies, institutions, and communities evaluating model-law modernization",
      "Air-quality, indoor-environment, building-protection, pollution-control, sensor, exposure, and intervention pathways",
      "Future jurisdiction-specific proposals adapted through public consultation and lawful legislative processes",
    ],
    obligations: [
      "Require attributable atmospheric records with instrument, calibration, location, chronology, activity, and limitation evidence",
      "Create exterior-to-interior, building-protection, and personal atmospheric integrity pathways without converting evidence into unsupported diagnosis",
      "Bind intervention authority, determination state, technical execution, public notice, correction, and outcome verification",
      "Preserve public challenge, supersession, registry, and future-reliance records",
    ],
    evidence: [
      "Atmospheric Integrity Record",
      "Personal Atmospheric Integrity Record",
      "Building protection comparison",
      "Authority and admissibility determination",
      "Intervention execution record",
      "Post-intervention environmental outcome package",
    ],
    executionBoundary: "This is a TA-14 proposal and is not enacted law. It must remain clearly labeled, publicly inspectable, challengeable, jurisdiction-specific, and subject to legislative authority.",
    sourceNotice: "Use TA-14 proposal text, revision history, public consultation records, legal review, scientific evidence, and the official enacted law of the relevant jurisdiction.",
  },
  {
    id: "ta14-clean-water-upgrade",
    shortName: "TA-14 Clean Water Upgrade",
    title: "TA-14 Proposed Water Integrity and Outcome Act",
    jurisdiction: "International",
    status: "Proposed",
    authorityType: "TA-14 model law proposal",
    summary: "A proposed model-law modernization intended to preserve water reality from source and sampling through laboratory continuity, legal authority, intervention, distribution, exposure context, remediation, and verified outcome.",
    applicability: [
      "Legislatures, water authorities, utilities, public-health bodies, environmental agencies, laboratories, facilities, and communities evaluating model-law modernization",
      "Source water, drinking water, wastewater, receiving waters, buildings, distribution, contamination, remediation, and restoration pathways",
      "Future jurisdiction-specific proposals adapted through public consultation and lawful legislative processes",
    ],
    obligations: [
      "Require governed sampling plans, chain of custody, laboratory continuity, location, chronology, method, uncertainty, and correction",
      "Separate legal limit, health guidance, operational target, building condition, and individual exposure proposition",
      "Bind notice, restriction, treatment, intervention, reopening, restoration, and outcome verification",
      "Preserve unresolved contamination, vulnerable-use conditions, public challenge, and future reliance",
    ],
    evidence: [
      "Water Integrity Record",
      "Sampling and laboratory continuity package",
      "Authority and threshold map",
      "Notice and protective-action record",
      "Treatment or remediation execution record",
      "Distribution, reopening, and environmental outcome verification",
    ],
    executionBoundary: "This is a TA-14 proposal and is not enacted law. It cannot be represented as a current statutory duty or official health determination.",
    sourceNotice: "Use TA-14 proposal text, revision history, public consultation, legal and scientific review, and official jurisdictional water law.",
  },
  {
    id: "ta14-admissible-environmental-execution-act",
    shortName: "TA-14 Environmental Execution Act",
    title: "TA-14 Proposed Admissible Environmental Execution and Outcome Act",
    jurisdiction: "International",
    status: "Proposed",
    authorityType: "TA-14 model governance law proposal",
    summary: "A proposed cross-domain law requiring consequential environmental interventions to preserve the route from reality and evidence through authority, admissibility, commitment, execution, outcome, challenge, correction, and future reliance.",
    applicability: [
      "Public agencies, regulated entities, contractors, laboratories, building operators, technology providers, and responsible decision-makers conducting consequential environmental interventions",
      "Environmental closure, restriction, remediation, restoration, reopening, permit, enforcement, emergency, and public-protection decisions",
      "Future jurisdiction-specific enactments and sector implementations",
    ],
    obligations: [
      "Require a bounded proposed action, admitted evidence set, current authority, continuity finding, limitations, and determination before execution",
      "Use ALLOW, HOLD, DENY, or ESCALATE states at the consequence boundary",
      "Preserve technical execution effect and compare the resulting environmental reality with the committed determination",
      "Require challenge, correction, supersession, registry, and reassessment when evidence or conditions change",
    ],
    evidence: [
      "Proposed environmental action",
      "Admitted evidence manifest",
      "Authority and continuity record",
      "Committed determination",
      "Technical execution evidence",
      "Outcome, integrity, verification, and challenge package",
    ],
    executionBoundary: "This proposal is not certification, legal advice, or enacted law. It is a model governance instrument requiring jurisdiction-specific legislative, scientific, administrative, and public review.",
    sourceNotice: "Use the current TA-14 proposal, architecture record, revision history, consultations, legal review, and the controlling law of the adopting jurisdiction.",
  },
];

const jurisdictions: Array<"All jurisdictions" | Jurisdiction> = [
  "All jurisdictions",
  "European Union",
  "United States",
  "United Kingdom",
  "Canada",
  "China",
  "International",
];

const statuses: Array<"All statuses" | LawStatus> = [
  "All statuses",
  "In force",
  "Phased implementation",
  "Enacted",
  "Proposed",
];

function statusClass(status: LawStatus) {
  return status.toLowerCase().replace(/\s+/g, "-");
}

export default function LawsPage() {
  const [query, setQuery] = useState("");
  const [jurisdiction, setJurisdiction] = useState<
    "All jurisdictions" | Jurisdiction
  >("All jurisdictions");
  const [status, setStatus] = useState<
    "All statuses" | LawStatus
  >("All statuses");
  const [selectedLawId, setSelectedLawId] = useState(
    lawRecords[0].id,
  );

  const filteredLaws = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return lawRecords.filter((law) => {
      const jurisdictionMatches =
        jurisdiction === "All jurisdictions" ||
        law.jurisdiction === jurisdiction;

      const statusMatches =
        status === "All statuses" ||
        law.status === status;

      const searchable = [
        law.shortName,
        law.title,
        law.jurisdiction,
        law.status,
        law.authorityType,
        law.summary,
        law.executionBoundary,
        ...law.applicability,
        ...law.obligations,
        ...law.evidence,
      ]
        .join(" ")
        .toLowerCase();

      const queryMatches =
        normalizedQuery.length === 0 ||
        normalizedQuery
          .split(/\s+/)
          .every((token) => searchable.includes(token));

      return (
        jurisdictionMatches &&
        statusMatches &&
        queryMatches
      );
    });
  }, [jurisdiction, query, status]);

  const selectedLaw =
    lawRecords.find((law) => law.id === selectedLawId) ??
    filteredLaws[0] ??
    lawRecords[0];

  const metrics = useMemo(
    () => ({
      authorities: lawRecords.length,
      jurisdictions: new Set(
        lawRecords.map((law) => law.jurisdiction),
      ).size,
      active: lawRecords.filter(
        (law) =>
          law.status === "In force" ||
          law.status === "Phased implementation",
      ).length,
      proposed: lawRecords.filter(
        (law) => law.status === "Proposed",
      ).length,
      evidenceTypes: new Set(
        lawRecords.flatMap((law) => law.evidence),
      ).size,
    }),
    [],
  );

  function clearFilters() {
    setQuery("");
    setJurisdiction("All jurisdictions");
    setStatus("All statuses");
  }

  return (
    <main className="lawsPage">
      <div className="backgroundGrid" />
      <div className="backgroundGlow glowOne" />
      <div className="backgroundGlow glowTwo" />

      <div className="pageShell">
        <div className="topbar">
          <Link
            href="/governance-library"
            className="topbarLink"
          >
            ← Governance Library
          </Link>

          <div className="topbarStatus">
            <span />
            Authority navigation workspace
          </div>

          <Link
            href="/governance-library/applicability"
            className="topbarAction"
          >
            Run Applicability →
          </Link>
        </div>

        <header className="hero">
          <div className="heroSeal">
            <span>GL</span>
            <small>TA-14</small>
          </div>

          <p className="eyebrow">
            TA-14 AUTHORITY GOVERNANCE INSTITUTION
          </p>

          <h1>
            Current & Proposed
            <span> Laws & Authorities</span>
          </h1>

          <p className="lead">
            Navigate major environmental, public-health, pollution-control, climate, chemical, water, air, and artificial-intelligence authorities alongside clearly labeled TA-14 proposed upgrades. Each record preserves legal status, jurisdiction, applicability, evidence duties, execution boundaries, and the official-source requirement.
          </p>

          <div className="heroMetrics">
            <article>
              <span>{metrics.authorities}</span>
              <small>Authority records</small>
            </article>

            <article>
              <span>{metrics.jurisdictions}</span>
              <small>Jurisdictions</small>
            </article>

            <article>
              <span>{metrics.active}</span>
              <small>Active or phasing</small>
            </article>

            <article>
              <span>{metrics.proposed}</span>
              <small>Proposed instruments</small>
            </article>

            <article>
              <span>{metrics.evidenceTypes}</span>
              <small>Evidence references</small>
            </article>
          </div>
        </header>

        <section className="librarySection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">
                AUTHORITY CONTROL DESK
              </p>

              <h2>
                Find the authority. Test the scope.
              </h2>
            </div>

            <p>
              A law’s existence does not establish that it applies to
              a particular entity, system, role, territory, date, or
              execution. Applicability must be separately determined
              and preserved.
            </p>
          </div>

          <div className="filterPanel">
            <label className="searchField">
              Search laws and authorities
              <input
                type="search"
                value={query}
                onChange={(event) =>
                  setQuery(event.target.value)
                }
                placeholder="Search Clean Air Act, EPA, water, pollution, WHO, AI, proposed law..."
              />
            </label>

            <label>
              Jurisdiction
              <select
                value={jurisdiction}
                onChange={(event) =>
                  setJurisdiction(
                    event.target.value as
                      | "All jurisdictions"
                      | Jurisdiction,
                  )
                }
              >
                {jurisdictions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Legal status
              <select
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value as
                      | "All statuses"
                      | LawStatus,
                  )
                }
              >
                {statuses.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              className="clearButton"
              onClick={clearFilters}
            >
              Clear filters
            </button>
          </div>

          <div className="workspaceGrid">
            <aside className="lawIndex">
              <div className="indexHeading">
                <div>
                  <span>Authority index</span>
                  <strong>
                    {filteredLaws.length} records
                  </strong>
                </div>

                <small>
                  Select a record to inspect its governance
                  conditions.
                </small>
              </div>

              <div className="lawList">
                {filteredLaws.map((law, index) => (
                  <button
                    key={law.id}
                    type="button"
                    className={
                      selectedLaw.id === law.id
                        ? "lawButton active"
                        : "lawButton"
                    }
                    onClick={() => setSelectedLawId(law.id)}
                  >
                    <span className="lawNumber">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="lawIdentity">
                      <small>{law.jurisdiction}</small>
                      <strong>{law.shortName}</strong>
                      <em>{law.authorityType}</em>
                    </span>

                    <span
                      className={`statusDot ${statusClass(
                        law.status,
                      )}`}
                    />
                  </button>
                ))}

                {filteredLaws.length === 0 ? (
                  <div className="emptyIndex">
                    <span>00</span>
                    <strong>No authority matched.</strong>
                    <p>
                      Broaden the search or clear the current
                      filters.
                    </p>
                  </div>
                ) : null}
              </div>
            </aside>

            <section className="lawRecord">
              <div className="recordHeader">
                <div className="recordIdentity">
                  <div className="recordSeal">
                    {selectedLaw.shortName
                      .split(/\s+/)
                      .map((word) => word.charAt(0))
                      .join("")
                      .slice(0, 3)}
                  </div>

                  <div>
                    <p>{selectedLaw.jurisdiction}</p>
                    <h3>{selectedLaw.shortName}</h3>
                    <span>{selectedLaw.title}</span>
                  </div>
                </div>

                <div
                  className={`statusBadge ${statusClass(
                    selectedLaw.status,
                  )}`}
                >
                  {selectedLaw.status}
                </div>
              </div>

              <div className="authorityStrip">
                <div>
                  <span>Authority type</span>
                  <strong>{selectedLaw.authorityType}</strong>
                </div>

                <div>
                  <span>Jurisdiction</span>
                  <strong>{selectedLaw.jurisdiction}</strong>
                </div>

                <div>
                  <span>Record condition</span>
                  <strong>Navigation only</strong>
                </div>
              </div>

              <div className="summaryCard">
                <span>Authority summary</span>
                <p>{selectedLaw.summary}</p>
              </div>

              <div className="recordColumns">
                <article className="recordCard">
                  <div className="cardHeading">
                    <span>Potential applicability</span>
                    <strong>
                      {selectedLaw.applicability.length}
                    </strong>
                  </div>

                  <div className="numberedList">
                    {selectedLaw.applicability.map(
                      (item, index) => (
                        <div key={item}>
                          <span>
                            {String(index + 1).padStart(
                              2,
                              "0",
                            )}
                          </span>
                          <p>{item}</p>
                        </div>
                      ),
                    )}
                  </div>
                </article>

                <article className="recordCard">
                  <div className="cardHeading">
                    <span>Governance obligations</span>
                    <strong>
                      {selectedLaw.obligations.length}
                    </strong>
                  </div>

                  <div className="numberedList">
                    {selectedLaw.obligations.map(
                      (item, index) => (
                        <div key={item}>
                          <span>
                            {String(index + 1).padStart(
                              2,
                              "0",
                            )}
                          </span>
                          <p>{item}</p>
                        </div>
                      ),
                    )}
                  </div>
                </article>
              </div>

              <article className="evidenceCard">
                <div className="cardHeading">
                  <span>Evidence commonly associated</span>
                  <strong>{selectedLaw.evidence.length}</strong>
                </div>

                <div className="evidenceGrid">
                  {selectedLaw.evidence.map(
                    (item, index) => (
                      <div key={item}>
                        <span>
                          {String(index + 1).padStart(
                            2,
                            "0",
                          )}
                        </span>
                        <strong>{item}</strong>
                      </div>
                    ),
                  )}
                </div>
              </article>

              <article className="executionCard">
                <div className="executionSeal">T14</div>

                <div>
                  <span>TA-14 execution boundary</span>
                  <p>{selectedLaw.executionBoundary}</p>
                </div>
              </article>

              <article className="sourceCard">
                <span>Official-source requirement</span>
                <p>{selectedLaw.sourceNotice}</p>
              </article>

              <div className="recordActions">
                <Link
                  href="/governance-library/applicability"
                  className="secondaryAction"
                >
                  Test Applicability
                </Link>

                <Link
                  href="/governance-library/crosswalks"
                  className="secondaryAction"
                >
                  Compare Frameworks
                </Link>

                <Link
                  href="/environmental-integrity-governance"
                  className="primaryAction"
                >
                  Enter Governing Division →
                </Link>
              </div>
            </section>
          </div>
        </section>

        <section className="institutionalNotice">
          <div>
            <p className="eyebrow">CURRENT LAW · GLOBAL INSTRUMENTS · TA-14 PROPOSED UPGRADES</p>
            <h2>Preserve what is legally binding. Identify what remains guidance. Label every TA-14 proposal honestly.</h2>
            <p>This library does not convert standards, WHO guidance, treaties, regulations, statutes, permits, and TA-14 proposals into the same kind of authority. Each instrument must be traced to the jurisdiction, adopting mechanism, current version, responsible authority, and exact proposition it can support.</p>
          </div>
          <div className="noticeRoute">
            <span>Existing authority</span><i>→</i><span>Evidence gap</span><i>→</i><span>TA-14 analysis</span><i>→</i><span>Proposed upgrade</span><i>→</i><span>Public challenge and revision</span>
          </div>
        </section>

        <section className="sequenceSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">
                AUTHORITY DETERMINATION SEQUENCE
              </p>

              <h2>
                Law must be translated into governed authority, execution, and outcome.
              </h2>
            </div>

            <p>
              A reliable governance route preserves the authority,
              interpretation, evidence, decision, execution, and
              resulting outcome rather than relying on a general
              compliance claim.
            </p>
          </div>

          <div className="sequenceGrid">
            {[
              {
                code: "01",
                title: "Identify",
                text: "Identify the official authority, instrument, version, jurisdiction, and effective date.",
              },
              {
                code: "02",
                title: "Classify",
                text: "Classify the entity, regulated role, system, use, risk level, and territorial connection.",
              },
              {
                code: "03",
                title: "Interpret",
                text: "Determine the applicable duty, exemption, threshold, and competent authority.",
              },
              {
                code: "04",
                title: "Evidence",
                text: "Collect attributable records demonstrating whether each relevant condition is supported.",
              },
              {
                code: "05",
                title: "Determine",
                text: "Issue a bounded determination without converting uncertainty into a compliance claim.",
              },
              {
                code: "06",
                title: "Control",
                text: "Bind the determination to ALLOW, HOLD, DENY, or ESCALATE execution conditions.",
              },
              {
                code: "07",
                title: "Preserve",
                text: "Preserve the legal source, evidence, reviewer, decision, execution, and outcome record.",
              },
              {
                code: "08",
                title: "Revalidate",
                text: "Reassess when the law, system, use, role, evidence, or operating condition changes.",
              },
            ].map((step) => (
              <article key={step.code}>
                <span>{step.code}</span>
                <strong>{step.title}</strong>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="boundarySection">
          <div className="boundarySeal">
            <span>LB</span>
            <small>Legal boundary</small>
          </div>

          <p className="eyebrow gold">
            LEGAL NAVIGATION BOUNDARY
          </p>

          <h2>
            A library record is not a legal determination.
          </h2>

          <p>
            This workspace organizes selected governance authorities
            and identifies evidence and execution questions. It does
            not provide legal advice, establish that a law applies,
            determine compliance, issue certification, replace a
            regulator or court, or authorize execution. Official
            sources, current law, competent counsel, qualified
            reviewers, and the applicable authority remain
            controlling.
          </p>

          <div className="boundaryGrid">
            <article>
              <span>LIBRARY PROVIDES</span>
              <strong>
                Authority navigation, applicability questions,
                obligation mapping, and evidence orientation
              </strong>
            </article>

            <article>
              <span>LIBRARY DOES NOT PROVIDE</span>
              <strong>
                Legal advice, regulatory approval, conformity,
                certification, or universal compliance
              </strong>
            </article>

            <article>
              <span>EXECUTION REQUIRES</span>
              <strong>
                Current authority, admissible evidence, binding,
                control, and preserved outcome proof
              </strong>
            </article>
          </div>

          <div className="boundaryActions">
            <Link
              href="/governance-library/applicability"
              className="secondaryAction"
            >
              Run Applicability
            </Link>

            <Link
              href="/governance-library/testing"
              className="secondaryAction"
            >
              Open Testing
            </Link>

            <Link
              href="/workspace/ai-governance"
              className="primaryAction"
            >
              Build TA-14 Route →
            </Link>
          </div>
        </section>
      </div>

      <style jsx>{`
        .lawsPage {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          color: #f5fbff;
          background:
            radial-gradient(
              circle at 50% -8%,
              rgba(37, 145, 192, 0.17),
              transparent 35%
            ),
            radial-gradient(
              circle at 8% 48%,
              rgba(81, 224, 242, 0.06),
              transparent 25%
            ),
            radial-gradient(
              circle at 92% 76%,
              rgba(235, 177, 66, 0.06),
              transparent 28%
            ),
            linear-gradient(
              180deg,
              #04101b 0%,
              #020913 52%,
              #01060c 100%
            );
        }

        .backgroundGrid,
        .backgroundGlow {
          position: fixed;
          inset: 0;
          pointer-events: none;
        }

        .backgroundGrid {
          opacity: 0.16;
          background-image:
            linear-gradient(
              rgba(255, 255, 255, 0.018) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.018) 1px,
              transparent 1px
            );
          background-size: 48px 48px;
          mask-image: linear-gradient(
            to bottom,
            black,
            transparent 88%
          );
        }

        .glowOne {
          background: radial-gradient(
            circle at 17% 20%,
            rgba(99, 230, 255, 0.07),
            transparent 26%
          );
        }

        .glowTwo {
          background: radial-gradient(
            circle at 84% 55%,
            rgba(255, 196, 79, 0.05),
            transparent 24%
          );
        }

        .pageShell {
          position: relative;
          z-index: 2;
          width: min(1480px, calc(100% - 40px));
          margin: auto;
          padding: 24px 0 90px;
        }

        .topbar {
          padding: 12px;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 16px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 19px;
          background: linear-gradient(
            180deg,
            rgba(8, 26, 42, 0.88),
            rgba(4, 15, 26, 0.76)
          );
          box-shadow:
            0 16px 50px rgba(0, 0, 0, 0.28),
            inset 0 1px rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(18px);
        }

        .topbarLink,
        .topbarAction,
        .primaryAction,
        .secondaryAction {
          min-height: 44px;
          padding: 0 15px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 11px;
          text-decoration: none;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          transition:
            transform 0.22s,
            border-color 0.22s,
            background 0.22s;
        }

        .topbarLink {
          justify-self: start;
          color: #c4d5de;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(0, 0, 0, 0.18);
        }

        .topbarAction,
        .primaryAction {
          justify-self: end;
          color: #041a23;
          border: 1px solid #aaf2ff;
          background: linear-gradient(
            135deg,
            #d9fbff,
            #76deef 64%,
            #38aeca
          );
        }

        .secondaryAction {
          color: #c2d5dd;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(0, 0, 0, 0.18);
        }

        .topbarLink:hover,
        .topbarAction:hover,
        .primaryAction:hover,
        .secondaryAction:hover {
          transform: translateY(-2px);
        }

        .topbarStatus {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #8fa9b6;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .topbarStatus span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #72e6b2;
          box-shadow: 0 0 15px rgba(114, 230, 178, 0.9);
        }

        .hero {
          max-width: 1120px;
          margin: auto;
          padding: 88px 0 72px;
          text-align: center;
        }

        .heroSeal,
        .boundarySeal {
          width: 106px;
          height: 106px;
          margin: 0 auto 27px;
          display: grid;
          place-items: center;
          align-content: center;
          gap: 3px;
          border: 1px solid rgba(255, 198, 82, 0.37);
          border-radius: 50%;
          background:
            radial-gradient(
              circle at 50% 35%,
              rgba(255, 220, 146, 0.16),
              transparent 36%
            ),
            rgba(4, 18, 30, 0.96);
          box-shadow:
            0 0 60px rgba(255, 193, 64, 0.09),
            inset 0 0 28px rgba(255, 255, 255, 0.03);
        }

        .heroSeal span,
        .boundarySeal span {
          color: #ffe3a0;
          font: 900 30px Georgia, serif;
        }

        .heroSeal small,
        .boundarySeal small {
          color: #8199a4;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.17em;
          text-transform: uppercase;
        }

        .eyebrow {
          margin: 0;
          color: #6fe8ff;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.21em;
          text-transform: uppercase;
        }

        .eyebrow.gold {
          color: #efbd59;
        }

        h1,
        h2,
        h3 {
          font-family: Georgia, "Times New Roman", serif;
        }

        .hero h1 {
          margin: 15px auto 0;
          font-size: clamp(52px, 6.3vw, 90px);
          line-height: 0.94;
          letter-spacing: -0.055em;
        }

        .hero h1 span {
          display: block;
          color: #9fb4bf;
          font-style: italic;
          font-weight: 500;
        }

        .lead {
          max-width: 940px;
          margin: 27px auto 0;
          color: #afc1ca;
          font-size: 18px;
          line-height: 1.75;
        }

        .heroMetrics {
          margin-top: 36px;
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 12px;
        }

        .heroMetrics article {
          padding: 18px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 16px;
          background: rgba(6, 20, 32, 0.58);
        }

        .heroMetrics span {
          display: block;
          color: #f0d28f;
          font: 700 27px Georgia, serif;
        }

        .heroMetrics small {
          display: block;
          margin-top: 5px;
          color: #788f9a;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .librarySection,
        .sequenceSection {
          padding-top: 80px;
        }

        .sectionHeading {
          margin-bottom: 31px;
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          align-items: end;
          gap: 40px;
        }

        .sectionHeading h2,
        .boundarySection h2 {
          margin: 11px 0 0;
          font-size: clamp(38px, 4.3vw, 64px);
          line-height: 0.99;
          letter-spacing: -0.047em;
        }

        .sectionHeading > p {
          margin: 0;
          color: #98adb7;
          font-size: 15px;
          line-height: 1.75;
        }

        .filterPanel {
          padding: 19px;
          display: grid;
          grid-template-columns:
            minmax(0, 1fr) 220px 220px auto;
          align-items: end;
          gap: 12px;
          border: 1px solid rgba(99, 230, 255, 0.12);
          border-radius: 21px;
          background: linear-gradient(
            145deg,
            rgba(9, 29, 44, 0.95),
            rgba(3, 13, 22, 0.98)
          );
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.27);
        }

        label {
          display: grid;
          gap: 8px;
          color: #80a1af;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        input,
        select {
          width: 100%;
          min-height: 47px;
          box-sizing: border-box;
          padding: 0 13px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 11px;
          outline: none;
          color: #e8f2f5;
          background: rgba(0, 0, 0, 0.2);
          font: inherit;
          text-transform: none;
        }

        input:focus,
        select:focus {
          border-color: rgba(99, 230, 255, 0.42);
          box-shadow: 0 0 0 3px rgba(99, 230, 255, 0.06);
        }

        select option {
          color: #e8f2f5;
          background: #071520;
        }

        .clearButton {
          min-height: 47px;
          padding: 0 15px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 11px;
          color: #b5c7cf;
          background: rgba(0, 0, 0, 0.18);
          cursor: pointer;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .workspaceGrid {
          margin-top: 17px;
          display: grid;
          grid-template-columns: 390px minmax(0, 1fr);
          gap: 17px;
          align-items: start;
        }

        .lawIndex,
        .lawRecord {
          border: 1px solid rgba(99, 230, 255, 0.12);
          border-radius: 24px;
          background: linear-gradient(
            145deg,
            rgba(9, 29, 44, 0.95),
            rgba(3, 13, 22, 0.98)
          );
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.27);
        }

        .lawIndex {
          position: sticky;
          top: 20px;
          padding: 18px;
        }

        .indexHeading {
          padding: 4px 3px 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .indexHeading div {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .indexHeading span {
          color: #70ddec;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .indexHeading strong {
          color: #edca80;
          font: 700 16px Georgia, serif;
        }

        .indexHeading small {
          display: block;
          margin-top: 8px;
          color: #718995;
          font-size: 9px;
          line-height: 1.5;
        }

        .lawList {
          margin-top: 14px;
          display: grid;
          gap: 9px;
        }

        .lawButton {
          width: 100%;
          padding: 13px;
          display: grid;
          grid-template-columns: 40px minmax(0, 1fr) 9px;
          align-items: center;
          gap: 11px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 13px;
          color: inherit;
          background: rgba(0, 0, 0, 0.15);
          cursor: pointer;
          text-align: left;
          transition:
            transform 0.2s,
            border-color 0.2s,
            background 0.2s;
        }

        .lawButton:hover,
        .lawButton.active {
          transform: translateX(3px);
          border-color: rgba(99, 230, 255, 0.28);
          background: rgba(99, 230, 255, 0.05);
        }

        .lawNumber {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(99, 230, 255, 0.15);
          border-radius: 10px;
          color: #6bd9eb;
          font-size: 8px;
          font-weight: 900;
        }

        .lawIdentity {
          min-width: 0;
          display: grid;
          gap: 4px;
        }

        .lawIdentity small {
          color: #728995;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .lawIdentity strong {
          overflow: hidden;
          color: #dce8ec;
          font-size: 11px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .lawIdentity em {
          overflow: hidden;
          color: #71858f;
          font-size: 8px;
          font-style: normal;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .statusDot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #63727a;
        }

        .statusDot.in-force {
          background: #72e6b2;
          box-shadow: 0 0 10px rgba(114, 230, 178, 0.6);
        }

        .statusDot.phased-implementation {
          background: #71d7ef;
        }

        .statusDot.enacted {
          background: #efc76e;
        }

        .statusDot.proposed {
          background: #b77be2;
        }

        .emptyIndex {
          padding: 35px 18px;
          border: 1px dashed rgba(255, 255, 255, 0.1);
          border-radius: 14px;
          text-align: center;
        }

        .emptyIndex span {
          color: #efc875;
          font: 700 22px Georgia, serif;
        }

        .emptyIndex strong {
          display: block;
          margin-top: 10px;
          font-size: 12px;
        }

        .emptyIndex p {
          margin: 8px 0 0;
          color: #748b96;
          font-size: 9px;
          line-height: 1.5;
        }

        .lawRecord {
          padding: 26px;
        }

        .recordHeader {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
        }

        .recordIdentity {
          display: flex;
          align-items: center;
          gap: 17px;
        }

        .recordSeal {
          width: 70px;
          height: 70px;
          flex: 0 0 70px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 198, 82, 0.28);
          border-radius: 50%;
          color: #f1cb7c;
          background: rgba(255, 198, 82, 0.04);
          font: 700 18px Georgia, serif;
        }

        .recordIdentity p {
          margin: 0;
          color: #69dcef;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .recordIdentity h3 {
          margin: 6px 0 0;
          font-size: clamp(29px, 3vw, 43px);
          line-height: 1;
        }

        .recordIdentity span {
          display: block;
          max-width: 710px;
          margin-top: 8px;
          color: #8499a3;
          font-size: 11px;
          line-height: 1.5;
        }

        .statusBadge {
          padding: 9px 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 999px;
          color: #9fb1b9;
          background: rgba(0, 0, 0, 0.16);
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .statusBadge.in-force {
          color: #89efc2;
          border-color: rgba(114, 230, 178, 0.24);
          background: rgba(114, 230, 178, 0.06);
        }

        .statusBadge.phased-implementation {
          color: #85e7f6;
          border-color: rgba(113, 215, 239, 0.24);
          background: rgba(113, 215, 239, 0.06);
        }

        .statusBadge.enacted {
          color: #f3cf7d;
          border-color: rgba(239, 199, 110, 0.25);
          background: rgba(239, 199, 110, 0.06);
        }

        .statusBadge.proposed {
          color: #d39af0;
          border-color: rgba(183, 123, 226, 0.25);
          background: rgba(183, 123, 226, 0.06);
        }

        .authorityStrip {
          margin-top: 23px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
        }

        .authorityStrip div {
          padding: 14px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 13px;
          background: rgba(0, 0, 0, 0.15);
        }

        .authorityStrip span,
        .summaryCard > span,
        .sourceCard > span {
          color: #70ddec;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .authorityStrip strong {
          display: block;
          margin-top: 7px;
          color: #d4e1e5;
          font-size: 10px;
        }

        .summaryCard,
        .sourceCard {
          margin-top: 14px;
          padding: 19px;
          border: 1px solid rgba(99, 230, 255, 0.1);
          border-radius: 16px;
          background: rgba(0, 0, 0, 0.14);
        }

        .summaryCard p,
        .sourceCard p {
          margin: 9px 0 0;
          color: #9dafb8;
          font-size: 12px;
          line-height: 1.68;
        }

        .recordColumns {
          margin-top: 14px;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 13px;
        }

        .recordCard,
        .evidenceCard {
          padding: 18px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 17px;
          background: rgba(0, 0, 0, 0.14);
        }

        .evidenceCard {
          margin-top: 14px;
        }

        .cardHeading {
          padding-bottom: 13px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .cardHeading span {
          color: #78ddeb;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .cardHeading strong {
          color: #edca80;
          font: 700 18px Georgia, serif;
        }

        .numberedList {
          margin-top: 13px;
          display: grid;
          gap: 9px;
        }

        .numberedList div {
          display: grid;
          grid-template-columns: 31px minmax(0, 1fr);
          align-items: start;
          gap: 10px;
        }

        .numberedList div > span {
          width: 31px;
          height: 31px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(99, 230, 255, 0.12);
          border-radius: 9px;
          color: #68d9ea;
          font-size: 7px;
          font-weight: 900;
        }

        .numberedList p {
          margin: 5px 0 0;
          color: #a0b2ba;
          font-size: 10px;
          line-height: 1.55;
        }

        .evidenceGrid {
          margin-top: 14px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 9px;
        }

        .evidenceGrid div {
          min-height: 75px;
          padding: 12px;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          background: rgba(0, 0, 0, 0.14);
        }

        .evidenceGrid span {
          color: #6fdced;
          font-size: 7px;
          font-weight: 900;
        }

        .evidenceGrid strong {
          color: #aabcc4;
          font-size: 9px;
          line-height: 1.45;
        }

        .executionCard {
          margin-top: 14px;
          padding: 19px;
          display: grid;
          grid-template-columns: 60px minmax(0, 1fr);
          align-items: center;
          gap: 16px;
          border: 1px solid rgba(255, 198, 82, 0.19);
          border-radius: 16px;
          background:
            radial-gradient(
              circle at 0 0,
              rgba(255, 198, 82, 0.07),
              transparent 34%
            ),
            rgba(0, 0, 0, 0.16);
        }

        .executionSeal {
          width: 60px;
          height: 60px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 198, 82, 0.25);
          border-radius: 50%;
          color: #efc875;
          font: 700 15px Georgia, serif;
        }

        .executionCard span {
          color: #e4b95e;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .executionCard p {
          margin: 8px 0 0;
          color: #d3e0e4;
          font-size: 12px;
          line-height: 1.62;
        }

        .recordActions {
          margin-top: 17px;
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 9px;
        }

        .sequenceGrid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 11px;
        }

        .sequenceGrid article {
          min-height: 190px;
          padding: 19px;
          border: 1px solid rgba(99, 230, 255, 0.1);
          border-radius: 17px;
          background: linear-gradient(
            180deg,
            rgba(10, 30, 45, 0.9),
            rgba(3, 12, 20, 0.96)
          );
        }

        .sequenceGrid article > span {
          width: 37px;
          height: 37px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 197, 82, 0.2);
          border-radius: 50%;
          color: #efc66f;
          font-size: 8px;
          font-weight: 900;
        }

        .sequenceGrid strong {
          display: block;
          margin-top: 23px;
          color: #e1ecef;
          font: 700 19px Georgia, serif;
        }

        .sequenceGrid p {
          margin: 11px 0 0;
          color: #8298a2;
          font-size: 10px;
          line-height: 1.58;
        }

        .boundarySection {
          margin-top: 88px;
          padding: 56px 34px;
          border: 1px solid rgba(255, 197, 82, 0.24);
          border-radius: 31px;
          background:
            radial-gradient(
              circle at 50% 0,
              rgba(255, 185, 44, 0.12),
              transparent 42%
            ),
            linear-gradient(
              180deg,
              rgba(8, 20, 33, 0.97),
              rgba(3, 10, 18, 0.99)
            );
          box-shadow:
            0 28px 78px rgba(0, 0, 0, 0.35),
            inset 0 1px rgba(255, 255, 255, 0.025);
          text-align: center;
        }

        .boundarySeal {
          width: 82px;
          height: 82px;
          margin-bottom: 22px;
        }

        .boundarySeal span {
          font-size: 23px;
        }

        .boundarySeal small {
          font-size: 6px;
        }

        .boundarySection h2 {
          max-width: 1040px;
          margin: 14px auto 0;
        }

        .boundarySection > p:not(.eyebrow) {
          max-width: 970px;
          margin: 23px auto 0;
          color: #a4b4bc;
          font-size: 15px;
          line-height: 1.78;
        }

        .boundaryGrid {
          max-width: 1080px;
          margin: 31px auto 0;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .boundaryGrid article {
          padding: 20px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 16px;
          background: rgba(0, 0, 0, 0.17);
        }

        .boundaryGrid span {
          display: block;
          color: #e3b759;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.12em;
        }

        .boundaryGrid strong {
          display: block;
          margin-top: 9px;
          color: #d9e4e8;
          font-size: 12px;
          line-height: 1.45;
        }

        .boundaryActions {
          margin-top: 29px;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
        }


        .institutionalNotice {
          margin: 22px 0 0;
          padding: 34px;
          border: 1px solid rgba(91, 218, 206, 0.18);
          border-radius: 24px;
          background: linear-gradient(145deg, rgba(8, 35, 43, 0.88), rgba(4, 17, 25, 0.94));
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.24);
        }

        .institutionalNotice h2 {
          max-width: 1100px;
          margin: 12px 0 14px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(30px, 4vw, 58px);
          line-height: 1.02;
          letter-spacing: -0.045em;
        }

        .institutionalNotice p:last-child {
          max-width: 1120px;
          color: #9db7bd;
          font-size: 15px;
          line-height: 1.7;
        }

        .noticeRoute {
          margin-top: 24px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 9px;
        }

        .noticeRoute span {
          padding: 10px 13px;
          border: 1px solid rgba(255, 209, 92, 0.2);
          border-radius: 999px;
          background: rgba(255, 209, 92, 0.045);
          color: #e8d8a5;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .noticeRoute i {
          color: #65dfd0;
          font-style: normal;
        }
        @media (max-width: 1180px) {
          .heroMetrics {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .filterPanel {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .workspaceGrid {
            grid-template-columns: 330px minmax(0, 1fr);
          }

          .evidenceGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 920px) {
          .topbar {
            grid-template-columns: 1fr 1fr;
          }

          .topbarStatus {
            display: none;
          }

          .sectionHeading,
          .workspaceGrid {
            grid-template-columns: 1fr;
          }

          .lawIndex {
            position: static;
          }

          .lawList {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .recordColumns {
            grid-template-columns: 1fr;
          }

          .sequenceGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .boundaryGrid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 680px) {
          .pageShell {
            width: calc(100% - 22px);
          }

          .topbar,
          .filterPanel,
          .lawList,
          .authorityStrip,
          .evidenceGrid,
          .sequenceGrid {
            grid-template-columns: 1fr;
          }

          .topbarLink,
          .topbarAction {
            justify-self: stretch;
          }

          .hero {
            padding: 62px 0;
          }

          .hero h1 {
            font-size: clamp(45px, 14vw, 68px);
          }

          .heroMetrics {
            grid-template-columns: 1fr;
          }

          .lawIndex,
          .lawRecord,
          .boundarySection {
            padding: 21px;
          }

          .recordHeader {
            flex-direction: column;
          }

          .recordIdentity {
            align-items: flex-start;
          }

          .executionCard {
            grid-template-columns: 1fr;
          }

          .recordActions,
          .boundaryActions {
            align-items: stretch;
            flex-direction: column;
          }

          .primaryAction,
          .secondaryAction {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}
