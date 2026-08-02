"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type StandardStatus =
  | "Published"
  | "Under development"
  | "Guidance"
  | "Proposed by TA-14";

type StandardRecord = {
  id: string;
  name: string;
  title: string;
  organization: string;
  type: string;
  status: StandardStatus;
  year: string;
  summary: string;
  purpose: string;
  coreAreas: string[];
  evidence: string[];
  relationships: string[];
  boundary: string;
  href?: string;
};

const standards: StandardRecord[] = [
  {
    id: "iso-42001",
    name: "ISO/IEC 42001",
    title: "Artificial intelligence — Management system",
    organization: "ISO/IEC",
    type: "AI Management System",
    status: "Published",
    year: "2023",
    summary: "Requirements for establishing, implementing, maintaining, and continually improving an artificial intelligence management system.",
    purpose: "Provides an organizational management structure for governing responsible development, provision, and use of AI.",
    coreAreas: [
      "Organizational context",
      "Leadership and accountability",
      "AI policy",
      "Risk and opportunity planning",
      "Operational controls",
      "Performance evaluation",
      "Internal audit",
      "Continual improvement",
    ],
    evidence: [
      "Management-system scope",
      "AI policy",
      "Risk assessment",
      "Statement of applicability",
      "Operational control record",
      "Internal audit",
      "Management review",
      "Corrective-action record",
    ],
    relationships: [
      "ISO/IEC 23894",
      "NIST AI RMF",
      "EU AI Act",
    ],
    boundary: "Management-system conformity may support organizational assurance, but it does not independently prove that a specific AI action was authorized, evidence-supported, admissible, and properly executed.",
    href: "/governance-library/iso-iec-42001-2023",
  },
  {
    id: "iso-23894",
    name: "ISO/IEC 23894",
    title: "Artificial intelligence — Guidance on risk management",
    organization: "ISO/IEC",
    type: "AI Risk Management",
    status: "Guidance",
    year: "2023",
    summary: "Guidance for integrating AI risk management into organizational activities and functions.",
    purpose: "Supports identification, analysis, evaluation, treatment, monitoring, review, recording, and communication of AI risk.",
    coreAreas: [
      "Risk context",
      "Risk identification",
      "Risk analysis",
      "Risk evaluation",
      "Risk treatment",
      "Monitoring",
      "Communication",
      "Documentation",
    ],
    evidence: [
      "Risk criteria",
      "Risk register",
      "Risk assessment",
      "Treatment plan",
      "Residual-risk decision",
      "Monitoring result",
      "Review record",
    ],
    relationships: [
      "ISO/IEC 42001",
      "NIST AI RMF",
      "ISO 31000",
    ],
    boundary: "Risk assessment alone does not establish current authority or permission for consequential execution.",
  },
  {
    id: "nist-ai-rmf",
    name: "NIST AI RMF 1.0",
    title: "Artificial Intelligence Risk Management Framework",
    organization: "NIST",
    type: "AI Governance Framework",
    status: "Guidance",
    year: "2023",
    summary: "A voluntary framework organized around Govern, Map, Measure, and Manage functions.",
    purpose: "Supports organizations in managing risks to individuals, organizations, and society across the AI lifecycle.",
    coreAreas: [
      "Govern",
      "Map",
      "Measure",
      "Manage",
      "Trustworthiness characteristics",
      "Lifecycle risk",
      "Stakeholder impacts",
      "Continuous improvement",
    ],
    evidence: [
      "Governance profile",
      "Context map",
      "Measurement plan",
      "Risk register",
      "Impact record",
      "Management decision",
      "Monitoring evidence",
    ],
    relationships: [
      "ISO/IEC 42001",
      "ISO/IEC 23894",
      "NIST AI RMF Playbook",
    ],
    boundary: "A framework profile can organize governance work, but it does not itself create legal authority or prove that a particular execution crossed an admissible boundary.",
  },
  {
    id: "ashrae-62-1",
    name: "ANSI/ASHRAE 62.1-2025",
    title: "Ventilation and Acceptable Indoor Air Quality",
    organization: "ASHRAE",
    type: "Indoor Air Quality Standard",
    status: "Published",
    year: "2025",
    summary: "Minimum ventilation and other requirements for acceptable indoor air quality in nonresidential and applicable residential spaces.",
    purpose: "Supports ventilation design, filtration, controls, air cleaning, operations, and maintenance for occupied buildings.",
    coreAreas: [
      "Outdoor air",
      "Ventilation rate procedure",
      "IAQ procedure",
      "Filtration",
      "Humidity control",
      "Exhaust",
      "Operations and maintenance",
      "Emergency controls",
    ],
    evidence: [
      "Design calculations",
      "Occupancy assumptions",
      "Outdoor-air measurement",
      "Filter selection",
      "Control sequences",
      "Commissioning record",
      "Maintenance record",
      "Operational verification",
    ],
    relationships: [
      "ASHRAE 62.2",
      "ASHRAE 55",
      "ASHRAE 241",
      "Building codes",
    ],
    boundary: "A design or calculation claiming conformance does not prove that the occupied building continuously delivered the required environmental condition or protected each activity at the time of reliance.",
  },
  {
    id: "ashrae-62-2",
    name: "ANSI/ASHRAE 62.2-2025",
    title: "Ventilation and Acceptable Indoor Air Quality in Residential Buildings",
    organization: "ASHRAE",
    type: "Residential IAQ Standard",
    status: "Published",
    year: "2025",
    summary: "Minimum dwelling-unit ventilation, local exhaust, filtration, and source-control requirements for residential occupancies.",
    purpose: "Provides a consensus baseline for residential ventilation and indoor-air-quality design and operation.",
    coreAreas: [
      "Dwelling ventilation",
      "Local exhaust",
      "Source control",
      "Filtration",
      "Air-cleaning devices",
      "Duct design",
      "Ground moisture control",
      "Operations",
    ],
    evidence: [
      "Floor area",
      "Occupancy basis",
      "Fan airflow test",
      "Exhaust verification",
      "Filter record",
      "Installation record",
      "Owner information",
      "Maintenance evidence",
    ],
    relationships: [
      "ASHRAE 62.1",
      "ASHRAE 241",
      "Residential codes",
    ],
    boundary: "Prescriptive ventilation compliance does not establish that an individual dwelling remained environmentally valid under changing occupancy, outdoor air, moisture, wildfire, or equipment conditions.",
  },
  {
    id: "ashrae-52-2",
    name: "ANSI/ASHRAE 52.2-2025",
    title: "Method of Testing General Ventilation Air-Cleaning Devices for Removal Efficiency by Particle Size",
    organization: "ASHRAE",
    type: "Air-Cleaner Test Standard",
    status: "Published",
    year: "2025",
    summary: "Laboratory test method for particle-size removal efficiency and resistance of general ventilation air-cleaning devices.",
    purpose: "Supports comparable testing and reporting of filters used in ventilation systems.",
    coreAreas: [
      "Particle-size efficiency",
      "MERV classification",
      "Pressure drop",
      "Dust loading",
      "Conditioning",
      "Test aerosol",
      "Reporting",
      "Laboratory controls",
    ],
    evidence: [
      "Test report",
      "Device identity",
      "Lot and model",
      "Test conditions",
      "Efficiency curve",
      "Pressure-drop curve",
      "Laboratory record",
      "Version record",
    ],
    relationships: [
      "ASHRAE 62.1",
      "ASHRAE 62.2",
      "ASHRAE 241",
    ],
    boundary: "A filter rating is not proof of installed-system performance; bypass, loading, airflow, fit, maintenance, and real operating conditions must be preserved.",
  },
  {
    id: "ashrae-55",
    name: "ANSI/ASHRAE 55-2023",
    title: "Thermal Environmental Conditions for Human Occupancy",
    organization: "ASHRAE",
    type: "Thermal Comfort Standard",
    status: "Published",
    year: "2023",
    summary: "Methods and criteria for evaluating thermal environmental conditions for human occupancy.",
    purpose: "Supports assessment of thermal comfort using environmental and personal factors.",
    coreAreas: [
      "Air temperature",
      "Radiant temperature",
      "Humidity",
      "Air speed",
      "Metabolic rate",
      "Clothing insulation",
      "Local discomfort",
      "Adaptive comfort",
    ],
    evidence: [
      "Instrument record",
      "Measurement location",
      "Occupancy context",
      "Clothing and activity assumptions",
      "Calculation record",
      "Survey evidence",
      "Exception record",
    ],
    relationships: [
      "ASHRAE 62.1",
      "ISO 7730",
      "Building operations",
    ],
    boundary: "A comfort calculation does not prove environmental safety, health protection, or activity validity, and it must not be substituted for evidence of ventilation or contaminant control.",
  },
  {
    id: "ashrae-90-1",
    name: "ANSI/ASHRAE/IES 90.1-2025",
    title: "Energy Standard for Buildings Except Low-Rise Residential Buildings",
    organization: "ASHRAE/IES",
    type: "Building Energy Standard",
    status: "Published",
    year: "2025",
    summary: "Minimum energy-efficiency requirements for design and construction of most buildings other than low-rise residential buildings.",
    purpose: "Provides a model basis for energy codes and performance requirements.",
    coreAreas: [
      "Building envelope",
      "HVAC efficiency",
      "Controls",
      "Lighting",
      "Power",
      "Energy modeling",
      "Commissioning",
      "Documentation",
    ],
    evidence: [
      "Compliance path",
      "Equipment schedules",
      "Control sequences",
      "Energy model",
      "Commissioning record",
      "Inspection record",
      "Exception basis",
    ],
    relationships: [
      "IECC",
      "ASHRAE 100",
      "ASHRAE 90.4",
    ],
    boundary: "Energy compliance does not prove indoor environmental integrity; efficiency measures must remain bounded by ventilation, humidity, pressure, health, and activity requirements.",
  },
  {
    id: "ashrae-170",
    name: "ANSI/ASHRAE/ASHE 170",
    title: "Ventilation of Health Care Facilities",
    organization: "ASHRAE/ASHE",
    type: "Health-Care Ventilation Standard",
    status: "Published",
    year: "Current edition",
    summary: "Minimum ventilation requirements for health-care facilities and spaces, intended for adoption and use by code authorities.",
    purpose: "Supports air-change, pressure, filtration, temperature, humidity, exhaust, and system requirements for clinical spaces.",
    coreAreas: [
      "Space classification",
      "Air changes",
      "Pressure relationships",
      "Filtration",
      "Temperature and humidity",
      "Exhaust",
      "Outdoor air",
      "System operation",
    ],
    evidence: [
      "Room schedule",
      "Pressure verification",
      "Airflow testing",
      "Filter record",
      "Commissioning",
      "Alarm history",
      "Maintenance record",
      "Operational exception",
    ],
    relationships: [
      "FGI Guidelines",
      "ASHRAE 62.1",
      "ASHRAE Guideline 43",
    ],
    boundary: "A design table is not proof that a clinical room maintained the required pressure, filtration, airflow, and activity validity during actual care.",
  },
  {
    id: "ashrae-188",
    name: "ANSI/ASHRAE 188",
    title: "Legionellosis: Risk Management for Building Water Systems",
    organization: "ASHRAE",
    type: "Building Water Risk Standard",
    status: "Published",
    year: "Current edition",
    summary: "Minimum legionellosis risk-management requirements for certain building water systems.",
    purpose: "Establishes program, team, analysis, control, verification, validation, and documentation expectations.",
    coreAreas: [
      "Program team",
      "System analysis",
      "Control locations",
      "Control limits",
      "Monitoring",
      "Corrective action",
      "Verification",
      "Validation",
    ],
    evidence: [
      "Water-management plan",
      "System diagram",
      "Control data",
      "Corrective-action record",
      "Validation result",
      "Team review",
      "Maintenance history",
    ],
    relationships: [
      "ASHRAE Guideline 12",
      "CDC guidance",
      "Building codes",
    ],
    boundary: "A written water-management plan does not prove controls were continuously effective or that a specific exposure was prevented; operational records and outcomes remain necessary.",
  },
  {
    id: "ashrae-241",
    name: "ANSI/ASHRAE 241",
    title: "Control of Infectious Aerosols",
    organization: "ASHRAE",
    type: "Infectious Aerosol Standard",
    status: "Published",
    year: "Current edition",
    summary: "Minimum requirements for reducing exposure to infectious aerosols in new and existing buildings.",
    purpose: "Addresses equivalent clean airflow, infection-risk management mode, planning, design, installation, commissioning, operation, and maintenance.",
    coreAreas: [
      "Equivalent clean airflow",
      "Infection risk management mode",
      "Outdoor air",
      "Filtration",
      "Air cleaning",
      "Planning",
      "Commissioning",
      "Operations",
    ],
    evidence: [
      "Building readiness plan",
      "Clean-air calculations",
      "Filter and air-cleaner data",
      "Control sequence",
      "Commissioning record",
      "Operational mode record",
      "Maintenance evidence",
    ],
    relationships: [
      "ASHRAE 62.1",
      "ASHRAE 62.2",
      "ASHRAE 170",
    ],
    boundary: "A building plan or calculated clean-air target does not prove that the required mode was activated, maintained, and effective during a specific infectious-risk event.",
  },
  {
    id: "ashrae-15",
    name: "ASHRAE 15-2024",
    title: "Safety Standard for Refrigeration Systems",
    organization: "ASHRAE",
    type: "Refrigeration Safety Standard",
    status: "Published",
    year: "2024",
    summary: "Safety requirements for design, construction, installation, operation, inspection, and emergency response for refrigeration systems.",
    purpose: "Supports risk controls for refrigerants, machinery rooms, detection, ventilation, pressure relief, and occupancy.",
    coreAreas: [
      "Refrigerant quantity",
      "Occupancy classification",
      "Machinery rooms",
      "Detection",
      "Ventilation",
      "Pressure relief",
      "Emergency controls",
      "Installation",
    ],
    evidence: [
      "System inventory",
      "Charge calculation",
      "Relief design",
      "Detector test",
      "Ventilation test",
      "Inspection record",
      "Emergency procedure",
      "Change record",
    ],
    relationships: [
      "ASHRAE 34",
      "Mechanical codes",
      "EPA refrigerant rules",
    ],
    boundary: "Code or design compliance does not prove that the actual refrigerant circuit, charge, leak state, detector, ventilation, and intervention remained within the governed boundary.",
  },
  {
    id: "ashrae-34",
    name: "ASHRAE 34-2024",
    title: "Designation and Safety Classification of Refrigerants",
    organization: "ASHRAE",
    type: "Refrigerant Classification Standard",
    status: "Published",
    year: "2024",
    summary: "Designation system and safety classifications for refrigerants based on toxicity and flammability.",
    purpose: "Provides consistent refrigerant identifiers and classification inputs for safety standards and codes.",
    coreAreas: [
      "Designation",
      "Toxicity class",
      "Flammability class",
      "Concentration limits",
      "Data review",
      "Classification change",
      "Publication",
    ],
    evidence: [
      "Refrigerant identity",
      "Safety classification",
      "SDS",
      "Equipment listing",
      "Charge record",
      "Version record",
    ],
    relationships: [
      "ASHRAE 15",
      "EPA SNAP",
      "Mechanical codes",
    ],
    boundary: "Classification is an input, not permission to charge, recover, release, substitute, or operate a refrigerant in a specific system.",
  },
  {
    id: "ashrae-111",
    name: "ANSI/ASHRAE 111-2024",
    title: "Testing, Adjusting, and Balancing of Building HVAC Systems",
    organization: "ASHRAE",
    type: "HVAC Field Test Standard",
    status: "Published",
    year: "2024",
    summary: "Procedures and instrumentation practices for testing, adjusting, and balancing HVAC systems.",
    purpose: "Supports repeatable field measurement of airflow, hydronic flow, pressure, temperature, and system performance.",
    coreAreas: [
      "Instrument requirements",
      "Air systems",
      "Hydronic systems",
      "Pressure",
      "Temperature",
      "Balancing",
      "Reporting",
      "Uncertainty",
    ],
    evidence: [
      "Instrument identity",
      "Calibration",
      "Test conditions",
      "Measurement points",
      "Raw readings",
      "Adjustment history",
      "Final report",
      "Exception record",
    ],
    relationships: [
      "ASHRAE 62.1",
      "NEBB procedures",
      "AABC standards",
    ],
    boundary: "A final TAB report must not erase pre-adjustment reality, instrument limitations, inaccessible points, control state, or post-occupancy drift.",
  },
  {
    id: "ashrae-180",
    name: "ANSI/ASHRAE/ACCA 180",
    title: "Standard Practice for Inspection and Maintenance of Commercial Building HVAC Systems",
    organization: "ASHRAE/ACCA",
    type: "HVAC Maintenance Standard",
    status: "Published",
    year: "Current edition",
    summary: "Minimum inspection and maintenance practices for commercial building HVAC systems.",
    purpose: "Supports maintenance planning, task intervals, condition assessment, and documentation.",
    coreAreas: [
      "Program development",
      "Inventory",
      "Inspection tasks",
      "Maintenance tasks",
      "Intervals",
      "Condition response",
      "Documentation",
      "Program review",
    ],
    evidence: [
      "Asset inventory",
      "Task schedule",
      "Inspection record",
      "Deficiency record",
      "Corrective action",
      "Maintenance history",
      "Program review",
    ],
    relationships: [
      "ASHRAE 62.1",
      "ASHRAE 90.1",
      "Manufacturer instructions",
    ],
    boundary: "Completion of scheduled tasks does not prove environmental performance; maintenance evidence must connect to actual system state and verified outcome.",
  },
  {
    id: "iso-14001",
    name: "ISO 14001:2026",
    title: "Environmental management systems — Requirements with guidance for use",
    organization: "ISO",
    type: "Environmental Management System",
    status: "Published",
    year: "2026",
    summary: "Requirements for an environmental management system designed to improve environmental performance and fulfill compliance obligations.",
    purpose: "Provides a management-system structure for policy, aspects, risks, operational control, evaluation, and improvement.",
    coreAreas: [
      "Context",
      "Leadership",
      "Environmental aspects",
      "Compliance obligations",
      "Objectives",
      "Operational control",
      "Performance evaluation",
      "Improvement",
    ],
    evidence: [
      "EMS scope",
      "Aspect register",
      "Compliance register",
      "Objectives",
      "Operational controls",
      "Monitoring data",
      "Audit",
      "Management review",
    ],
    relationships: [
      "ISO 14004",
      "ISO 19011",
      "Environmental law",
    ],
    boundary: "Certification to an EMS does not prove that a particular emission, discharge, exposure, intervention, or claimed environmental outcome was admissible and correct.",
  },
  {
    id: "iso-17025",
    name: "ISO/IEC 17025",
    title: "General requirements for the competence of testing and calibration laboratories",
    organization: "ISO/IEC",
    type: "Laboratory Competence Standard",
    status: "Published",
    year: "2017",
    summary: "Competence, impartiality, and consistent-operation requirements for testing and calibration laboratories.",
    purpose: "Supports valid methods, equipment control, metrological traceability, sampling, records, uncertainty, and reporting.",
    coreAreas: [
      "Impartiality",
      "Personnel competence",
      "Facilities",
      "Equipment",
      "Metrological traceability",
      "Methods",
      "Sampling",
      "Reporting",
    ],
    evidence: [
      "Scope of accreditation",
      "Method validation",
      "Calibration record",
      "Quality-control result",
      "Uncertainty budget",
      "Sample custody",
      "Test report",
      "Nonconformance record",
    ],
    relationships: [
      "ISO 17034",
      "ISO 17043",
      "EPA methods",
    ],
    boundary: "Accreditation supports laboratory competence within scope; it does not establish that a particular sample was representative, legally sufficient, or properly interpreted for a proposed action.",
  },
  {
    id: "epa-air-qa",
    name: "EPA Ambient Air Monitoring QA Requirements",
    title: "40 CFR Parts 50, 53, and 58 and associated QA guidance",
    organization: "U.S. EPA",
    type: "Regulatory Measurement System",
    status: "Published",
    year: "Current",
    summary: "Federal quality-assurance, method, network, siting, certification, and validation requirements for ambient-air monitoring.",
    purpose: "Supports defensible monitoring of criteria pollutants through reference/equivalent methods and independent assessment.",
    coreAreas: [
      "Reference methods",
      "Equivalent methods",
      "Network design",
      "Probe siting",
      "Calibration",
      "Audits",
      "Data validation",
      "Certification",
    ],
    evidence: [
      "QAPP",
      "SOP",
      "Site record",
      "Calibration",
      "Audit result",
      "Collocation data",
      "Validation flags",
      "Annual certification",
    ],
    relationships: [
      "Clean Air Act",
      "NAAQS",
      "EPA AMTIC",
    ],
    boundary: "Regulatory monitoring data remains bounded by network purpose, siting, averaging period, method, validation, and pollutant scope; it should not be generalized into unsupported indoor or personal exposure claims.",
  },
  {
    id: "epa-sw846",
    name: "EPA SW-846",
    title: "Test Methods for Evaluating Solid Waste, Physical/Chemical Methods",
    organization: "U.S. EPA",
    type: "Environmental Test Method Compendium",
    status: "Guidance",
    year: "Current",
    summary: "A compendium of sampling and analytical methods for hazardous-waste and related environmental programs.",
    purpose: "Provides method options and performance guidance for air, water, soil, sediment, waste, and chemical analyses.",
    coreAreas: [
      "Sampling",
      "Sample preparation",
      "Organic analysis",
      "Inorganic analysis",
      "Air and stack methods",
      "Screening",
      "Quality control",
      "Method performance",
    ],
    evidence: [
      "Sampling plan",
      "Method selection",
      "Custody record",
      "Preparation record",
      "Calibration",
      "QC result",
      "Raw data",
      "Analytical report",
    ],
    relationships: [
      "RCRA",
      "CERCLA",
      "EPA quality system",
    ],
    boundary: "SW-846 methods are not universally mandatory and method use alone does not establish representativeness, regulatory applicability, or admissible interpretation.",
  },
  {
    id: "epa-water-methods",
    name: "EPA Clean Water Act Analytical Methods",
    title: "Approved methods for analysis of pollutants under the Clean Water Act",
    organization: "U.S. EPA",
    type: "Water Analytical Methods",
    status: "Published",
    year: "Current",
    summary: "Approved analytical methods used for monitoring pollutants under Clean Water Act programs.",
    purpose: "Supports permit monitoring and regulatory reporting with specified procedures, quality control, and detection capability.",
    coreAreas: [
      "Sampling",
      "Preservation",
      "Holding times",
      "Calibration",
      "Detection limits",
      "Quality control",
      "Method-specific analysis",
      "Reporting",
    ],
    evidence: [
      "Permit requirement",
      "Sampling record",
      "Custody",
      "Preservation record",
      "Calibration",
      "QC package",
      "Result report",
      "Data qualification",
    ],
    relationships: [
      "Clean Water Act",
      "40 CFR Part 136",
      "NPDES",
    ],
    boundary: "An approved method does not prove the sampling location, timing, preservation, matrix, or interpretation was appropriate for every claimed environmental conclusion.",
  },
  {
    id: "astm-d1356",
    name: "ASTM D1356",
    title: "Standard Terminology Relating to Sampling and Analysis of Atmospheres",
    organization: "ASTM International",
    type: "Atmospheric Terminology Standard",
    status: "Published",
    year: "Current",
    summary: "Terminology supporting consistent communication in atmospheric sampling and analysis.",
    purpose: "Reduces ambiguity in methods, reports, records, and interpretation.",
    coreAreas: [
      "Atmospheric terms",
      "Sampling terms",
      "Analytical terms",
      "Instrument terms",
      "Data-quality terms",
      "Definitions",
    ],
    evidence: [
      "Terminology map",
      "Method reference",
      "Report definitions",
      "Version record",
    ],
    relationships: [
      "EPA air methods",
      "ISO air-quality standards",
      "ASHRAE",
    ],
    boundary: "Terminology improves consistency but does not prove measurement validity, continuity, authority, or outcome.",
  },
  {
    id: "nfpa-70",
    name: "NFPA 70",
    title: "National Electrical Code",
    organization: "NFPA",
    type: "Model Electrical Code",
    status: "Published",
    year: "Current adopted edition varies",
    summary: "Model code for safe electrical design, installation, and inspection.",
    purpose: "Provides electrical safety rules frequently adopted by jurisdictions.",
    coreAreas: [
      "Wiring",
      "Overcurrent protection",
      "Grounding",
      "Equipment",
      "Hazardous locations",
      "Inspection",
      "Special occupancies",
    ],
    evidence: [
      "Adopted edition",
      "Permit",
      "Inspection",
      "Test record",
      "Equipment listing",
      "Correction record",
    ],
    relationships: [
      "State and local codes",
      "NFPA 70E",
      "UL standards",
    ],
    boundary: "The controlling edition is the one adopted by the applicable authority; the newest published edition is not automatically enforceable.",
  },
  {
    id: "icc-imc",
    name: "International Mechanical Code",
    title: "Model mechanical code",
    organization: "International Code Council",
    type: "Model Mechanical Code",
    status: "Published",
    year: "Current adopted edition varies",
    summary: "Model code governing mechanical systems, ventilation, exhaust, combustion air, refrigeration, and related installations.",
    purpose: "Provides a model regulatory baseline for adoption by jurisdictions.",
    coreAreas: [
      "Mechanical permits",
      "Ventilation",
      "Exhaust",
      "Ducts",
      "Combustion air",
      "Refrigeration",
      "Inspection",
      "Alterations",
    ],
    evidence: [
      "Adoption record",
      "Permit",
      "Plans",
      "Inspection",
      "Test report",
      "Correction record",
      "Certificate",
    ],
    relationships: [
      "ASHRAE 15",
      "ASHRAE 62.1",
      "Local amendments",
    ],
    boundary: "Model-code text is not itself the controlling law until adopted; edition, amendments, jurisdiction, permit scope, and enforcement record must be preserved.",
  },
  {
    id: "ta14-air",
    name: "TA-14 Atmospheric Integrity Record Standard",
    title: "Proposed standard for attributable atmospheric evidence and future reliance",
    organization: "TA-14 Authority",
    type: "TA-14 Proposed Standard",
    status: "Proposed by TA-14",
    year: "Proposed",
    summary: "A proposed standard for preserving instrument, place, activity, chronology, environmental context, continuity, interpretation boundaries, and outcome.",
    purpose: "Creates a common governed record for atmospheric evidence without converting measurements into unsupported health, safety, or compliance claims.",
    coreAreas: [
      "Reality declaration",
      "Instrument identity",
      "Location and activity",
      "Chronology",
      "Continuity",
      "Admissibility",
      "Interpretation boundary",
      "Outcome comparison",
    ],
    evidence: [
      "Raw measurements",
      "Calibration",
      "Media",
      "Custody",
      "Environmental context",
      "Determination",
      "Intervention",
      "Outcome record",
    ],
    relationships: [
      "ASHRAE 62.1",
      "EPA air QA",
      "ISO/IEC 17025",
    ],
    boundary: "TA-14 proposal only. It is not an ANSI-approved standard, law, code, certification, or substitute for controlling authority.",
  },
  {
    id: "ta14-hvac",
    name: "TA-14 Governed HVAC Diagnostic Record Standard",
    title: "Proposed standard for complete HVAC diagnostic, intervention, and outcome evidence",
    organization: "TA-14 Authority",
    type: "TA-14 Proposed Standard",
    status: "Proposed by TA-14",
    year: "Proposed",
    summary: "A proposed record standard connecting electrical, refrigerant, airflow, psychrometric, pressure, control, technician, intervention, and outcome evidence.",
    purpose: "Prevents a service conclusion from erasing the measurements, authority, changes, and post-intervention reality supporting it.",
    coreAreas: [
      "System identity",
      "Technician role",
      "Instrument continuity",
      "Electrical evidence",
      "Refrigerant evidence",
      "Airflow and pressure",
      "Committed intervention",
      "Post-intervention outcome",
    ],
    evidence: [
      "Diagnostic record",
      "Electrical record",
      "Refrigerant record",
      "Photos and video",
      "Authority record",
      "Change log",
      "Performance verification",
    ],
    relationships: [
      "ASHRAE 111",
      "ASHRAE 180",
      "Mechanical codes",
    ],
    boundary: "TA-14 proposal only. It does not grant trade authority, replace licensing, override manufacturer instructions, or establish code compliance.",
  },
  {
    id: "ta14-execution",
    name: "TA-14 Admissible Execution Evidence Standard",
    title: "Proposed cross-domain standard for evidence, authority, commitment, execution, and outcome preservation",
    organization: "TA-14 Authority",
    type: "TA-14 Proposed Standard",
    status: "Proposed by TA-14",
    year: "Proposed",
    summary: "A proposed standard for preserving the route from reality and evidence to a bounded determination, technical execution effect, and verified outcome.",
    purpose: "Creates artifact-level proof boundaries across AI, environmental, building, and other consequential systems.",
    coreAreas: [
      "Reality",
      "Record",
      "Continuity",
      "Admissibility",
      "Binding",
      "Commit",
      "Execution",
      "Outcome",
    ],
    evidence: [
      "Proposed action",
      "Admitted evidence",
      "Authority",
      "Determination",
      "Execution record",
      "Outcome evidence",
      "Integrity package",
      "Verification path",
    ],
    relationships: [
      "ISO/IEC 42001",
      "ISO 14001",
      "Environmental and technical codes",
    ],
    boundary: "TA-14 proposal only. Registration, review, or artifact creation does not automatically constitute certification, legal compliance, endorsement, or universal proof.",
  },
];

const types = [
  "All types",
  ...Array.from(
    new Set(standards.map((standard) => standard.type)),
  ),
];

const statuses: Array<
  "All statuses" | StandardStatus
> = [
  "All statuses",
  "Published",
  "Under development",
  "Guidance",
  "Proposed by TA-14",
];

function statusClass(status: StandardStatus) {
  return status.toLowerCase().replace(/\s+/g, "-");
}

export default function StandardsPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All types");
  const [status, setStatus] = useState<
    "All statuses" | StandardStatus
  >("All statuses");
  const [selectedId, setSelectedId] = useState(
    standards[0].id,
  );

  const filteredStandards = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return standards.filter((standard) => {
      const typeMatches =
        type === "All types" || standard.type === type;

      const statusMatches =
        status === "All statuses" ||
        standard.status === status;

      const searchable = [
        standard.name,
        standard.title,
        standard.organization,
        standard.type,
        standard.status,
        standard.year,
        standard.summary,
        standard.purpose,
        standard.boundary,
        ...standard.coreAreas,
        ...standard.evidence,
        ...standard.relationships,
      ]
        .join(" ")
        .toLowerCase();

      const queryMatches =
        normalizedQuery.length === 0 ||
        normalizedQuery
          .split(/\s+/)
          .every((token) => searchable.includes(token));

      return typeMatches && statusMatches && queryMatches;
    });
  }, [query, status, type]);

  const selectedStandard =
    standards.find(
      (standard) => standard.id === selectedId,
    ) ??
    filteredStandards[0] ??
    standards[0];

  const metrics = useMemo(
    () => ({
      records: standards.length,
      organizations: new Set(
        standards.map(
          (standard) => standard.organization,
        ),
      ).size,
      types: new Set(
        standards.map((standard) => standard.type),
      ).size,
      evidence: new Set(
        standards.flatMap(
          (standard) => standard.evidence,
        ),
      ).size,
      published: standards.filter(
        (standard) =>
          standard.status === "Published",
      ).length,
    }),
    [],
  );

  function clearFilters() {
    setQuery("");
    setType("All types");
    setStatus("All statuses");
  }

  return (
    <main className="standardsPage">
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
            Standards navigation workspace
          </div>

          <Link
            href="/law-standards-public-policy"
            className="topbarAction"
          >
            Open Law & Standards →
          </Link>
        </div>

        <header className="hero">
          <div className="heroSeal">
            <span>ST</span>
            <small>TA-14</small>
          </div>

          <p className="eyebrow">
            TA-14 AUTHORITY GOVERNANCE INSTITUTION
          </p>

          <h1>
            Standards, Codes
            <span> & Technical Modernization</span>
          </h1>

          <p className="lead">
            Navigate AI, environmental, building, HVAC, refrigeration, indoor-air, laboratory, measurement, code, and regulatory standards while preserving their actual authority, edition, adoption path, evidence requirements, and execution boundary.
          </p>

          <div className="heroMetrics">
            <article>
              <span>{metrics.records}</span>
              <small>Standard records</small>
            </article>

            <article>
              <span>{metrics.organizations}</span>
              <small>Organizations</small>
            </article>

            <article>
              <span>{metrics.types}</span>
              <small>Standard types</small>
            </article>

            <article>
              <span>{metrics.evidence}</span>
              <small>Evidence references</small>
            </article>

            <article>
              <span>{metrics.published}</span>
              <small>Published standards</small>
            </article>
          </div>
        </header>

        <section className="standardsSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">
                STANDARDS CONTROL DESK
              </p>

              <h2>
                Find the standard. Preserve its boundary.
              </h2>
            </div>

            <p>
              Standards may define requirements, guidance,
              terminology, lifecycle processes, or technical
              practices. Their governance effect depends on
              adoption, scope, version, contractual use, and
              applicable authority.
            </p>
          </div>

          <div className="filterPanel">
            <label className="searchField">
              Search standards
              <input
                type="search"
                value={query}
                onChange={(event) =>
                  setQuery(event.target.value)
                }
                placeholder="Search ASHRAE, ANSI, ISO, EPA, HVAC, air, water, AI..."
              />
            </label>

            <label>
              Standard type
              <select
                value={type}
                onChange={(event) =>
                  setType(event.target.value)
                }
              >
                {types.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Publication status
              <select
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value as
                      | "All statuses"
                      | StandardStatus,
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
            <aside className="standardIndex">
              <div className="indexHeading">
                <div>
                  <span>Standards index</span>
                  <strong>
                    {filteredStandards.length} records
                  </strong>
                </div>

                <small>
                  Select a standard to inspect its purpose,
                  evidence relationships, and execution
                  boundary.
                </small>
              </div>

              <div className="standardList">
                {filteredStandards.map(
                  (standard, index) => (
                    <button
                      key={standard.id}
                      type="button"
                      className={
                        selectedStandard.id === standard.id
                          ? "standardButton active"
                          : "standardButton"
                      }
                      onClick={() =>
                        setSelectedId(standard.id)
                      }
                    >
                      <span className="standardNumber">
                        {String(index + 1).padStart(
                          2,
                          "0",
                        )}
                      </span>

                      <span className="standardIdentity">
                        <small>{standard.type}</small>
                        <strong>{standard.name}</strong>
                        <em>
                          {standard.organization} ·{" "}
                          {standard.year}
                        </em>
                      </span>

                      <span
                        className={`statusDot ${statusClass(
                          standard.status,
                        )}`}
                      />
                    </button>
                  ),
                )}

                {filteredStandards.length === 0 ? (
                  <div className="emptyIndex">
                    <span>00</span>
                    <strong>No standard matched.</strong>
                    <p>
                      Broaden the search or clear the current
                      filters.
                    </p>
                  </div>
                ) : null}
              </div>
            </aside>

            <section className="standardRecord">
              <div className="recordHeader">
                <div className="recordIdentity">
                  <div className="recordSeal">
                    {selectedStandard.name
                      .split(/\s+/)
                      .map((word) => word.charAt(0))
                      .join("")
                      .slice(0, 3)}
                  </div>

                  <div>
                    <p>{selectedStandard.organization}</p>
                    <h3>{selectedStandard.name}</h3>
                    <span>{selectedStandard.title}</span>
                  </div>
                </div>

                <div
                  className={`statusBadge ${statusClass(
                    selectedStandard.status,
                  )}`}
                >
                  {selectedStandard.status}
                </div>
              </div>

              <div className="authorityStrip">
                <div>
                  <span>Standard type</span>
                  <strong>{selectedStandard.type}</strong>
                </div>

                <div>
                  <span>Publisher</span>
                  <strong>
                    {selectedStandard.organization}
                  </strong>
                </div>

                <div>
                  <span>Publication year</span>
                  <strong>{selectedStandard.year}</strong>
                </div>
              </div>

              <article className="summaryCard">
                <span>Standard summary</span>
                <strong>{selectedStandard.summary}</strong>
                <p>{selectedStandard.purpose}</p>
              </article>

              <div className="recordColumns">
                <article className="recordCard">
                  <div className="cardHeading">
                    <span>Core areas</span>
                    <strong>
                      {selectedStandard.coreAreas.length}
                    </strong>
                  </div>

                  <div className="numberedList">
                    {selectedStandard.coreAreas.map(
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
                    <span>Related authorities</span>
                    <strong>
                      {
                        selectedStandard.relationships
                          .length
                      }
                    </strong>
                  </div>

                  <div className="relatedList">
                    {selectedStandard.relationships.map(
                      (item) => (
                        <div key={item}>
                          <span>↔</span>
                          <strong>{item}</strong>
                        </div>
                      ),
                    )}
                  </div>
                </article>
              </div>

              <article className="evidenceCard">
                <div className="cardHeading">
                  <span>
                    Evidence commonly associated
                  </span>
                  <strong>
                    {selectedStandard.evidence.length}
                  </strong>
                </div>

                <div className="evidenceGrid">
                  {selectedStandard.evidence.map(
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
                  <p>{selectedStandard.boundary}</p>
                </div>
              </article>

              <div className="recordActions">
                {selectedStandard.href ? (
                  <Link
                    href={selectedStandard.href}
                    className="secondaryAction"
                  >
                    View Standard Record
                  </Link>
                ) : null}

                <Link
                  href="/law-standards-public-policy"
                  className="secondaryAction"
                >
                  Open Crosswalk
                </Link>

                <Link
                  href="/law-standards-public-policy"
                  className="primaryAction"
                >
                  Enter Institutional Division →
                </Link>
              </div>
            </section>
          </div>
        </section>

        <section className="sequenceSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">
                STANDARD APPLICATION SEQUENCE
              </p>

              <h2>
                Conformance must be translated into evidence.
              </h2>
            </div>

            <p>
              Citing a standard is not the same as proving that
              its requirements were adopted, implemented,
              verified, and bound to a specific governance
              decision.
            </p>
          </div>

          <div className="sequenceGrid">
            {[
              {
                code: "01",
                title: "Identify",
                text: "Identify the official title, publisher, version, date, and applicable edition.",
              },
              {
                code: "02",
                title: "Scope",
                text: "Determine the organizational, technical, lifecycle, or system boundary covered.",
              },
              {
                code: "03",
                title: "Adopt",
                text: "Preserve how the standard became applicable through law, contract, policy, certification, or voluntary use.",
              },
              {
                code: "04",
                title: "Map",
                text: "Map requirements or guidance to accountable controls, systems, owners, and evidence.",
              },
              {
                code: "05",
                title: "Verify",
                text: "Test whether the declared controls and outcomes are actually supported.",
              },
              {
                code: "06",
                title: "Determine",
                text: "Issue a bounded conclusion without overstating certification, conformity, or compliance.",
              },
              {
                code: "07",
                title: "Control",
                text: "Bind the conclusion to ALLOW, HOLD, DENY, or ESCALATE execution conditions.",
              },
              {
                code: "08",
                title: "Preserve",
                text: "Preserve the source, evidence, determination, execution, and outcome record.",
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
            <span>SB</span>
            <small>Standards boundary</small>
          </div>

          <p className="eyebrow gold">
            STANDARDS NAVIGATION BOUNDARY
          </p>

          <h2>
            A standard is not a law, and a published edition is not automatically the controlling edition.
          </h2>

          <p>
            This workspace provides standards navigation,
            functional mapping, and evidence orientation. It
            does not reproduce official standards, grant
            access rights, provide certification, establish
            conformity, determine legal applicability, or
            authorize execution. Official published editions,
            licensing conditions, accredited certification
            bodies, applicable law, contracts, and qualified
            reviewers remain controlling.
          </p>

          <div className="boundaryGrid">
            <article>
              <span>LIBRARY PROVIDES</span>
              <strong>
                Standards navigation, functional context,
                evidence relationships, and crosswalk entry
                points
              </strong>
            </article>

            <article>
              <span>LIBRARY DOES NOT PROVIDE</span>
              <strong>
                Official standard text, certification,
                accreditation, conformity, or legal advice
              </strong>
            </article>

            <article>
              <span>EXECUTION REQUIRES</span>
              <strong>
                Valid authority, admissible evidence,
                continuity, binding, control, and preserved
                outcome proof
              </strong>
            </article>
          </div>

          <div className="boundaryActions">
            <Link
              href="/governance-library/frameworks"
              className="secondaryAction"
            >
              Browse Frameworks
            </Link>

            <Link
              href="/law-standards-public-policy"
              className="secondaryAction"
            >
              Open Crosswalks
            </Link>

            <Link
              href="/law-standards-public-policy"
              className="primaryAction"
            >
              Enter Law, Standards & Public Policy →
            </Link>
          </div>
        </section>
      </div>

      <style jsx>{`
        .standardsPage {
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
          box-shadow: 0 16px 50px rgba(0, 0, 0, 0.28);
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
          transition: transform 0.22s;
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
          background: rgba(4, 18, 30, 0.96);
          box-shadow: 0 0 60px rgba(255, 193, 64, 0.09);
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

        .standardsSection,
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
          text-transform: uppercase;
        }

        .workspaceGrid {
          margin-top: 17px;
          display: grid;
          grid-template-columns: 390px minmax(0, 1fr);
          gap: 17px;
          align-items: start;
        }

        .standardIndex,
        .standardRecord {
          border: 1px solid rgba(99, 230, 255, 0.12);
          border-radius: 24px;
          background: linear-gradient(
            145deg,
            rgba(9, 29, 44, 0.95),
            rgba(3, 13, 22, 0.98)
          );
        }

        .standardIndex {
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

        .standardList {
          margin-top: 14px;
          display: grid;
          gap: 9px;
        }

        .standardButton {
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
        }

        .standardButton:hover,
        .standardButton.active {
          border-color: rgba(99, 230, 255, 0.28);
          background: rgba(99, 230, 255, 0.05);
        }

        .standardNumber {
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

        .standardIdentity {
          min-width: 0;
          display: grid;
          gap: 4px;
        }

        .standardIdentity small {
          color: #728995;
          font-size: 7px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .standardIdentity strong {
          color: #dce8ec;
          font-size: 11px;
        }

        .standardIdentity em {
          color: #71858f;
          font-size: 8px;
          font-style: normal;
        }

        .statusDot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #63727a;
        }

        .statusDot.published {
          background: #72e6b2;
        }

        .statusDot.guidance {
          background: #71d7ef;
        }

        .statusDot.proposed-by-ta-14 {
          background: #b697ff;
        }

        .statusDot.under-development {
          background: #efc76e;
        }

        .emptyIndex {
          padding: 35px 18px;
          text-align: center;
        }

        .standardRecord {
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
          font: 700 18px Georgia, serif;
        }

        .recordIdentity p {
          margin: 0;
          color: #69dcef;
          font-size: 8px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .recordIdentity h3 {
          margin: 6px 0 0;
          font-size: clamp(29px, 3vw, 43px);
        }

        .recordIdentity span {
          display: block;
          margin-top: 8px;
          color: #8499a3;
          font-size: 11px;
        }

        .statusBadge {
          padding: 9px 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 999px;
          color: #9fb1b9;
          font-size: 8px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .authorityStrip {
          margin-top: 23px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
        }

        .authorityStrip div,
        .summaryCard,
        .recordCard,
        .evidenceCard {
          padding: 18px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 16px;
          background: rgba(0, 0, 0, 0.14);
        }

        .authorityStrip span,
        .summaryCard > span {
          color: #70ddec;
          font-size: 7px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .authorityStrip strong {
          display: block;
          margin-top: 7px;
          font-size: 10px;
        }

        .summaryCard {
          margin-top: 14px;
        }

        .summaryCard > strong {
          display: block;
          margin-top: 9px;
          font: 700 18px Georgia, serif;
          line-height: 1.4;
        }

        .summaryCard p {
          margin: 11px 0 0;
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

        .evidenceCard {
          margin-top: 14px;
        }

        .cardHeading {
          padding-bottom: 13px;
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .cardHeading span {
          color: #78ddeb;
          font-size: 8px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .cardHeading strong {
          color: #edca80;
          font: 700 18px Georgia, serif;
        }

        .numberedList,
        .relatedList {
          margin-top: 13px;
          display: grid;
          gap: 9px;
        }

        .numberedList div,
        .relatedList div {
          display: grid;
          grid-template-columns: 31px 1fr;
          gap: 10px;
        }

        .numberedList span,
        .relatedList span {
          width: 31px;
          height: 31px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(99, 230, 255, 0.12);
          border-radius: 9px;
          color: #68d9ea;
          font-size: 7px;
        }

        .numberedList p {
          margin: 5px 0 0;
          color: #a0b2ba;
          font-size: 10px;
        }

        .relatedList strong {
          margin-top: 8px;
          font-size: 10px;
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
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
        }

        .evidenceGrid span {
          color: #6fdced;
          font-size: 7px;
        }

        .evidenceGrid strong {
          display: block;
          margin-top: 8px;
          color: #aabcc4;
          font-size: 9px;
        }

        .executionCard {
          margin-top: 14px;
          padding: 19px;
          display: grid;
          grid-template-columns: 60px 1fr;
          gap: 16px;
          border: 1px solid rgba(255, 198, 82, 0.19);
          border-radius: 16px;
        }

        .executionSeal {
          width: 60px;
          height: 60px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 198, 82, 0.25);
          border-radius: 50%;
          color: #efc875;
        }

        .executionCard span {
          color: #e4b95e;
          font-size: 8px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .executionCard p {
          margin: 8px 0 0;
          color: #d3e0e4;
          font-size: 12px;
          line-height: 1.62;
        }

        .recordActions,
        .boundaryActions {
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
          background: rgba(10, 30, 45, 0.7);
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
        }

        .sequenceGrid strong {
          display: block;
          margin-top: 23px;
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
          background: rgba(8, 20, 33, 0.97);
          text-align: center;
        }

        .boundarySeal {
          width: 82px;
          height: 82px;
        }

        .boundarySection h2 {
          margin-top: 14px;
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
        }

        .boundaryGrid span {
          color: #e3b759;
          font-size: 8px;
          font-weight: 900;
        }

        .boundaryGrid strong {
          display: block;
          margin-top: 9px;
          font-size: 12px;
        }

        .boundaryActions {
          justify-content: center;
        }

        @media (max-width: 980px) {
          .sectionHeading,
          .workspaceGrid {
            grid-template-columns: 1fr;
          }

          .standardIndex {
            position: static;
          }

          .recordColumns {
            grid-template-columns: 1fr;
          }

          .sequenceGrid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 700px) {
          .pageShell {
            width: calc(100% - 22px);
          }

          .topbar,
          .filterPanel,
          .heroMetrics,
          .authorityStrip,
          .evidenceGrid,
          .sequenceGrid,
          .boundaryGrid {
            grid-template-columns: 1fr;
          }

          .topbarStatus {
            display: none;
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
