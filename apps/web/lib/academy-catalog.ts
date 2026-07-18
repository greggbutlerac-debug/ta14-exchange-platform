export const ACADEMY_CATALOG_SCHEMA =
  "TA14_ACADEMY_CATALOG_V1" as const;

export type AcademyProgramId =
  | "EPA_608_UNIVERSAL"
  | "BASIC_HVAC_FOUNDATIONS"
  | "AIR_CONDITIONING_MADE_SIMPLE"
  | "AIRFLOW_MADE_SIMPLE"
  | "ELECTRICITY_MADE_SIMPLE"
  | "REFRIGERATION_MADE_SIMPLE";

export type AcademyModule = {
  id: string;
  title: string;
  summary: string;
  sequence: number;
  status: "AVAILABLE" | "IN_DEVELOPMENT" | "PLANNED";
};

export type AcademyProgram = {
  schema: typeof ACADEMY_CATALOG_SCHEMA;
  id: AcademyProgramId;
  title: string;
  shortTitle: string;
  audience: string;
  summary: string;
  governancePrinciple: string;
  delivery: readonly string[];
  status: "AVAILABLE" | "IN_DEVELOPMENT" | "PLANNED";
  modules: readonly AcademyModule[];
};

export const ACADEMY_PROGRAMS: readonly AcademyProgram[] = [
  {
    schema: ACADEMY_CATALOG_SCHEMA,
    id: "EPA_608_UNIVERSAL",
    title: "TA-14 Academy EPA 608 Universal Preparation",
    shortTitle: "EPA 608 Universal",
    audience:
      "Entry-level and working HVAC technicians preparing for EPA Section 608 certification.",
    summary:
      "A structured preparation pathway connecting refrigerant knowledge, environmental responsibility, safe handling, and evidence-based intervention discipline.",
    governancePrinciple:
      "Refrigerant intervention should occur only when the evidence supports intervention and the technician can preserve an accurate record of what occurred.",
    delivery: [
      "Student textbook",
      "Quick-memory workbook",
      "Instructor guide",
      "Knowledge checks",
      "Practice examinations",
    ],
    status: "AVAILABLE",
    modules: [
      {
        id: "608-core",
        title: "Core Refrigerant Responsibility",
        summary:
          "Environmental effects, regulatory foundations, safety, recovery, recycling, reclamation, and technician responsibility.",
        sequence: 1,
        status: "AVAILABLE",
      },
      {
        id: "608-type-i",
        title: "Type I Appliances",
        summary:
          "Small-appliance service, recovery requirements, evacuation, leak repair principles, and disposal practices.",
        sequence: 2,
        status: "AVAILABLE",
      },
      {
        id: "608-type-ii",
        title: "Type II Systems",
        summary:
          "High-pressure and very-high-pressure systems, charging, recovery, leak response, and service practices.",
        sequence: 3,
        status: "AVAILABLE",
      },
      {
        id: "608-type-iii",
        title: "Type III Systems",
        summary:
          "Low-pressure chillers, recovery methods, pressure relationships, leak testing, and safe service procedures.",
        sequence: 4,
        status: "AVAILABLE",
      },
      {
        id: "608-universal-review",
        title: "Universal Review and Examination Readiness",
        summary:
          "Integrated review, memory reinforcement, practice questions, and examination strategy.",
        sequence: 5,
        status: "AVAILABLE",
      },
    ],
  },
  {
    schema: ACADEMY_CATALOG_SCHEMA,
    id: "BASIC_HVAC_FOUNDATIONS",
    title: "TA-14 Academy Basic HVAC Foundations",
    shortTitle: "Basic HVAC",
    audience:
      "New technicians, adult learners, workforce-development students, and returning technicians.",
    summary:
      "A complete entry pathway through electrical fundamentals, airflow, refrigeration, charging discipline, system sequence, and thermodynamics.",
    governancePrinciple:
      "Technicians should learn the system sequence, establish a baseline, respect thresholds, and make evidence-bound determinations before intervening.",
    delivery: [
      "Student textbook",
      "Student workbook",
      "Instructor guide",
      "Laboratory exercises",
      "Field evidence activities",
      "Assessment checkpoints",
    ],
    status: "IN_DEVELOPMENT",
    modules: [
      {
        id: "basic-electrical",
        title: "Electrical Foundations",
        summary:
          "Atoms, voltage, current, resistance, AC and DC, switch logic, motors, capacitors, meters, and electrical drift.",
        sequence: 1,
        status: "IN_DEVELOPMENT",
      },
      {
        id: "basic-airflow",
        title: "Airflow Foundations",
        summary:
          "Static pressure, blower operation, filters, duct systems, fan performance, delivered airflow, and system resistance.",
        sequence: 2,
        status: "IN_DEVELOPMENT",
      },
      {
        id: "basic-refrigeration",
        title: "Refrigeration Foundations",
        summary:
          "Pressure-temperature relationships, phase change, saturation, superheat, subcooling, and heat movement.",
        sequence: 3,
        status: "IN_DEVELOPMENT",
      },
      {
        id: "basic-charging",
        title: "Charging Discipline",
        summary:
          "Evidence thresholds, airflow prerequisites, measurement stability, charging methods, and post-intervention verification.",
        sequence: 4,
        status: "IN_DEVELOPMENT",
      },
      {
        id: "basic-sequence",
        title: "System Sequence of Operation",
        summary:
          "Calls, controls, safeties, component order, expected states, and fault isolation through sequence.",
        sequence: 5,
        status: "IN_DEVELOPMENT",
      },
      {
        id: "basic-thermodynamics",
        title: "Applied Thermodynamics",
        summary:
          "Sensible and latent heat, enthalpy, psychrometrics, heat transfer, and system performance.",
        sequence: 6,
        status: "IN_DEVELOPMENT",
      },
    ],
  },
  {
    schema: ACADEMY_CATALOG_SCHEMA,
    id: "AIR_CONDITIONING_MADE_SIMPLE",
    title: "Air Conditioning Made Simple",
    shortTitle: "Air Conditioning",
    audience:
      "Students and technicians who need a clear, practical understanding of complete air-conditioning system operation.",
    summary:
      "A plain-language system course connecting components, sequence, airflow, refrigeration, electrical behavior, and evidence-based service.",
    governancePrinciple:
      "Understand the whole operating system before changing any part of it.",
    delivery: [
      "Textbook",
      "Workbook",
      "Instructor edition",
      "Visual system maps",
      "Applied exercises",
    ],
    status: "PLANNED",
    modules: [
      {
        id: "ac-system-map",
        title: "The Complete System Map",
        summary:
          "How electrical, airflow, refrigeration, controls, and heat transfer operate as one system.",
        sequence: 1,
        status: "PLANNED",
      },
      {
        id: "ac-operating-sequence",
        title: "Operating Sequence",
        summary:
          "What should happen, in what order, and what each operating state proves.",
        sequence: 2,
        status: "PLANNED",
      },
      {
        id: "ac-evidence",
        title: "Evidence Before Intervention",
        summary:
          "Measurements, stability, thresholds, contradictions, and diagnostic determination.",
        sequence: 3,
        status: "PLANNED",
      },
    ],
  },
  {
    schema: ACADEMY_CATALOG_SCHEMA,
    id: "AIRFLOW_MADE_SIMPLE",
    title: "Airflow Made Simple",
    shortTitle: "Airflow",
    audience:
      "HVAC students and technicians learning how air moves through real systems.",
    summary:
      "A field-centered course covering pressure, resistance, blower performance, duct behavior, filtration, distribution, and delivered capacity.",
    governancePrinciple:
      "Refrigeration measurements are not admissible for intervention until airflow is established and supported by evidence.",
    delivery: [
      "Textbook",
      "Workbook",
      "Instructor edition",
      "Static-pressure labs",
      "Fan-curve exercises",
    ],
    status: "IN_DEVELOPMENT",
    modules: [
      {
        id: "airflow-pressure",
        title: "Pressure and Resistance",
        summary:
          "How static pressure develops and what resistance reveals about system condition.",
        sequence: 1,
        status: "IN_DEVELOPMENT",
      },
      {
        id: "airflow-blower",
        title: "Blowers and Fan Performance",
        summary:
          "Blower speed, fan curves, operating points, and delivered airflow.",
        sequence: 2,
        status: "IN_DEVELOPMENT",
      },
      {
        id: "airflow-distribution",
        title: "Duct and Distribution Performance",
        summary:
          "Returns, supplies, fittings, leakage, restrictions, balance, and room delivery.",
        sequence: 3,
        status: "IN_DEVELOPMENT",
      },
    ],
  },
  {
    schema: ACADEMY_CATALOG_SCHEMA,
    id: "ELECTRICITY_MADE_SIMPLE",
    title: "Electricity Made Simple",
    shortTitle: "Electricity",
    audience:
      "Beginning HVAC learners who need electrical principles explained through practical system behavior.",
    summary:
      "A progressive course from atomic foundations through circuits, controls, motors, capacitors, measurement, safety, and electrical integrity.",
    governancePrinciple:
      "Electrical diagnosis must be tied to measured conditions, expected sequence, equipment requirements, and preserved evidence.",
    delivery: [
      "Textbook",
      "Workbook",
      "Instructor edition",
      "Meter exercises",
      "Circuit activities",
    ],
    status: "IN_DEVELOPMENT",
    modules: [
      {
        id: "electricity-foundations",
        title: "Electrical Foundations",
        summary:
          "Atoms, charge, conductors, voltage, current, resistance, power, and energy.",
        sequence: 1,
        status: "IN_DEVELOPMENT",
      },
      {
        id: "electricity-circuits",
        title: "Circuits and Switch Logic",
        summary:
          "Series, parallel, loads, switches, relays, contactors, transformers, and control paths.",
        sequence: 2,
        status: "IN_DEVELOPMENT",
      },
      {
        id: "electricity-motors",
        title: "Motors and Capacitors",
        summary:
          "Motor types, nameplates, winding behavior, capacitance, starting, running, and failure evidence.",
        sequence: 3,
        status: "IN_DEVELOPMENT",
      },
      {
        id: "electricity-measurement",
        title: "The Meter as an Evidence Tool",
        summary:
          "Voltage, amperage, resistance, capacitance, insulation, safe measurement, and interpretation.",
        sequence: 4,
        status: "IN_DEVELOPMENT",
      },
    ],
  },
  {
    schema: ACADEMY_CATALOG_SCHEMA,
    id: "REFRIGERATION_MADE_SIMPLE",
    title: "Refrigeration Made Simple",
    shortTitle: "Refrigeration",
    audience:
      "HVAC learners building a practical understanding of the refrigeration cycle and service measurements.",
    summary:
      "A clear course connecting pressure, temperature, saturation, phase change, heat transfer, superheat, subcooling, metering, and system evidence.",
    governancePrinciple:
      "A refrigerant circuit should not be opened or adjusted merely because a reading appears unusual; the full evidence chain must support intervention.",
    delivery: [
      "Textbook",
      "Workbook",
      "Instructor edition",
      "Pressure-temperature exercises",
      "Cycle-mapping activities",
    ],
    status: "IN_DEVELOPMENT",
    modules: [
      {
        id: "refrigeration-cycle",
        title: "The Refrigeration Cycle",
        summary:
          "Compression, condensation, metering, evaporation, and heat movement.",
        sequence: 1,
        status: "IN_DEVELOPMENT",
      },
      {
        id: "refrigeration-saturation",
        title: "Pressure, Temperature, and Saturation",
        summary:
          "How refrigerant pressure establishes saturation temperature and phase condition.",
        sequence: 2,
        status: "IN_DEVELOPMENT",
      },
      {
        id: "refrigeration-sh-sc",
        title: "Superheat and Subcooling",
        summary:
          "What the measurements mean, when they are valid, and how airflow and load affect them.",
        sequence: 3,
        status: "IN_DEVELOPMENT",
      },
      {
        id: "refrigeration-intervention",
        title: "Evidence-Based Refrigerant Intervention",
        summary:
          "Thresholds, prerequisites, contradictions, charging discipline, and post-intervention proof.",
        sequence: 4,
        status: "IN_DEVELOPMENT",
      },
    ],
  },
] as const;

export function getAcademyProgram(
  programId: AcademyProgramId,
): AcademyProgram {
  const program = ACADEMY_PROGRAMS.find(
    (candidate) => candidate.id === programId,
  );

  if (!program) {
    throw new Error(`Unknown academy program: ${programId}`);
  }

  return program;
}

export function getAcademyProgramsByStatus(
  status: AcademyProgram["status"],
): readonly AcademyProgram[] {
  return ACADEMY_PROGRAMS.filter(
    (program) => program.status === status,
  );
}
