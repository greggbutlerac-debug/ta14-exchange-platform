/**
 * Module 03 content integration manifest (production preparation only).
 *
 * Inventory is aligned to CurriculumRoom.tsx. All 16 lessons have browser-based\n * teaching or assessment previews; no persisted learner completion exists. Image paths refer only to assets
 * verified in apps/web/public on 2026-11-05. Association with an individual
 * lesson is PROVISIONAL and requires instructional/visual review.
 *
 * This manifest does not certify learners, persist assessments, authorize
 * interventions, or issue a Declared Diagnostic Determination (DDD).
 */
export type Module03Lesson = {
  id: string;
  title: string;
  minutes: number;
  delivery: string;
  evidenceObject: string;
  visual: {src: string; status: 'asset-found-review-pending'} | null;
  narrationStatus: 'read-along-script-integrated-audio-pending';
  assessmentStatus: 'local-practice-not-persisted';
};

export const module03ContentManifest: readonly Module03Lesson[] = [
  {
    "id": "3.01",
    "title": "Air Is Part of the System",
    "minutes": 20,
    "delivery": "VIDEO",
    "evidenceObject": "Air-system orientation record",
    "visual": {
      "src": "/Air%20Is%20Part%20of%20the%20System%20Infographic.png",
      "status": "asset-found-review-pending"
    },
    "narrationStatus": "read-along-script-integrated-audio-pending",
    "assessmentStatus": "local-practice-not-persisted"
  },
  {
    "id": "3.02",
    "title": "Airflow Path & System Boundaries",
    "minutes": 25,
    "delivery": "VIDEO + EXERCISE",
    "evidenceObject": "Airflow-path map",
    "visual": {
      "src": "/Airflow%20Path%20and%20System%20Boundaries.png",
      "status": "asset-found-review-pending"
    },
    "narrationStatus": "read-along-script-integrated-audio-pending",
    "assessmentStatus": "local-practice-not-persisted"
  },
  {
    "id": "3.03",
    "title": "Static Pressure Fundamentals",
    "minutes": 25,
    "delivery": "VIDEO",
    "evidenceObject": "Pressure relationship record",
    "visual": {
      "src": "/HVAC%20Airflow%20and%20Static%20Pressure%20Investigation.png",
      "status": "asset-found-review-pending"
    },
    "narrationStatus": "read-along-script-integrated-audio-pending",
    "assessmentStatus": "local-practice-not-persisted"
  },
  {
    "id": "3.04",
    "title": "External Static Pressure Measurement",
    "minutes": 30,
    "delivery": "GUIDED EXERCISE",
    "evidenceObject": "TESP evidence record",
    "visual": null,
    "narrationStatus": "read-along-script-integrated-audio-pending",
    "assessmentStatus": "local-practice-not-persisted"
  },
  {
    "id": "3.05",
    "title": "Pressure Drop Across Components",
    "minutes": 25,
    "delivery": "VIDEO + CASE",
    "evidenceObject": "Component pressure-drop record",
    "visual": null,
    "narrationStatus": "read-along-script-integrated-audio-pending",
    "assessmentStatus": "local-practice-not-persisted"
  },
  {
    "id": "3.06",
    "title": "Airflow Estimation & Measurement",
    "minutes": 30,
    "delivery": "VIDEO + EXERCISE",
    "evidenceObject": "Airflow measurement record",
    "visual": null,
    "narrationStatus": "read-along-script-integrated-audio-pending",
    "assessmentStatus": "local-practice-not-persisted"
  },
  {
    "id": "3.07",
    "title": "Temperature as Evidence",
    "minutes": 20,
    "delivery": "VIDEO",
    "evidenceObject": "Temperature evidence record",
    "visual": {
      "src": "/HVAC%20Temperature%20%26%20Humidity%20Training%20Infographic.png",
      "status": "asset-found-review-pending"
    },
    "narrationStatus": "read-along-script-integrated-audio-pending",
    "assessmentStatus": "local-practice-not-persisted"
  },
  {
    "id": "3.08",
    "title": "Heat Transfer & Sensible Performance",
    "minutes": 25,
    "delivery": "VIDEO + EXERCISE",
    "evidenceObject": "Sensible-performance record",
    "visual": {
      "src": "/TA-14%20Academy_%20Heat%20Transfer%20%26%20Moisture%20Control.png",
      "status": "asset-found-review-pending"
    },
    "narrationStatus": "read-along-script-integrated-audio-pending",
    "assessmentStatus": "local-practice-not-persisted"
  },
  {
    "id": "3.09",
    "title": "Moisture Fundamentals",
    "minutes": 25,
    "delivery": "VIDEO",
    "evidenceObject": "Moisture-condition record",
    "visual": {
      "src": "/HVAC%20Temperature%20%26%20Humidity%20Training%20Infographic.png",
      "status": "asset-found-review-pending"
    },
    "narrationStatus": "read-along-script-integrated-audio-pending",
    "assessmentStatus": "local-practice-not-persisted"
  },
  {
    "id": "3.10",
    "title": "Relative Humidity, Dew Point & Context",
    "minutes": 30,
    "delivery": "VIDEO + GUIDED EXERCISE",
    "evidenceObject": "Temperature / RH / dew-point record",
    "visual": {
      "src": "/HVAC%20Temperature%20%26%20Humidity%20Training%20Infographic.png",
      "status": "asset-found-review-pending"
    },
    "narrationStatus": "read-along-script-integrated-audio-pending",
    "assessmentStatus": "local-practice-not-persisted"
  },
  {
    "id": "3.11",
    "title": "Sensible vs Latent Performance",
    "minutes": 25,
    "delivery": "VIDEO + CASE",
    "evidenceObject": "Sensible / latent comparison record",
    "visual": {
      "src": "/TA-14%20Academy_%20Heat%20Transfer%20%26%20Moisture%20Control.png",
      "status": "asset-found-review-pending"
    },
    "narrationStatus": "read-along-script-integrated-audio-pending",
    "assessmentStatus": "local-practice-not-persisted"
  },
  {
    "id": "3.12",
    "title": "Dehumidification as System Performance",
    "minutes": 30,
    "delivery": "VIDEO + CASE",
    "evidenceObject": "Dehumidification performance record",
    "visual": {
      "src": "/TA-14%20Academy_%20Heat%20Transfer%20%26%20Moisture%20Control.png",
      "status": "asset-found-review-pending"
    },
    "narrationStatus": "read-along-script-integrated-audio-pending",
    "assessmentStatus": "local-practice-not-persisted"
  },
  {
    "id": "3.13",
    "title": "Airflow × Coil × Moisture Interaction",
    "minutes": 25,
    "delivery": "VIDEO",
    "evidenceObject": "Airflow / coil / moisture relationship map",
    "visual": {
      "src": "/TA-14%20Academy_%20Heat%20Transfer%20%26%20Moisture%20Control.png",
      "status": "asset-found-review-pending"
    },
    "narrationStatus": "read-along-script-integrated-audio-pending",
    "assessmentStatus": "local-practice-not-persisted"
  },
  {
    "id": "3.14",
    "title": "Airflow & Moisture Guided Practice",
    "minutes": 30,
    "delivery": "GUIDED VR",
    "evidenceObject": "Guided airflow/moisture VR record",
    "visual": null,
    "narrationStatus": "read-along-script-integrated-audio-pending",
    "assessmentStatus": "local-practice-not-persisted"
  },
  {
    "id": "3.15",
    "title": "Airflow, Heat & Moisture Perform",
    "minutes": 30,
    "delivery": "PERFORM VR",
    "evidenceObject": "Independent environmental performance record",
    "visual": null,
    "narrationStatus": "read-along-script-integrated-audio-pending",
    "assessmentStatus": "local-practice-not-persisted"
  },
  {
    "id": "3.16",
    "title": "Evidence Integration Check",
    "minutes": 20,
    "delivery": "QUIZ + CASE",
    "evidenceObject": "Module 03 assessment record",
    "visual": {
      "src": "/Independent%20Review%20Challenge%20Infographic.png",
      "status": "asset-found-review-pending"
    },
    "narrationStatus": "read-along-script-integrated-audio-pending",
    "assessmentStatus": "local-practice-not-persisted"
  }
];

export const module03ManifestSummary = {
  moduleId: '03',
  plannedMinutes: 420,
  scheduledLessonMinutes: 415,
  unscheduledMinutes: 5, // Curriculum target minus the 16 allocated lesson durations; not yet assigned to a lesson.
  lessonCount: 16,
  readiness: 'preview-integrated-production-pending',
  authorityBoundary: 'Training records are not DDDs or intervention authorizations',
} as const;
