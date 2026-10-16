import { NextResponse } from "next/server";

const lines = [
  "TA-14 ACADEMY",
  "Evidence Before Intervention",
  "HVAC Service Competency & Assessment Blueprint v0.2",
  "",
  "ACADEMY-GROUNDED WORKING SPECIFICATION",
  "Created and architected by Greggory Don Butler.",
  "",
  "NINE PROOF ELEMENTS - IN REQUIRED ORDER",
  "1. Sequence - Establish safe order and record the initial concern.",
  "2. Non-Invasive Evidence - Preserve operating context and observations before disturbance.",
  "3. NIRET - Decide whether refrigerant-side entry is evidentially necessary.",
  "4. Refrigerant-Side Evidence - Collect only if justified, safe, and separately authorized.",
  "5. Original-State HVAC Performance Record - Preserve identity, raw observations, provenance, uncertainty, and baseline.",
  "6. Declared Diagnostic Determination - State what evidence supports and what remains unresolved.",
  "7. Evidence-Based Intervention - Act only within applicable authority and established standing.",
  "8. HVAC Post-Performance Record - Preserve the observed state after intervention.",
  "9. Proof of Performance - Compare preserved original and post-intervention records and declare the supported outcome.",
  "Verified outcome follows the comparison; it is not a shortcut or substitute for proof.",
  "",
  "GOVERNING QUESTION",
  "Does this proposed consequence have sufficient Admissible Evidence, Applicable Authority, and Established Standing to become reality NOW?",
  "",
  "SEQUENCE",
  "The 14-step field sequence protects the order of observation and prevents symptom chasing, skipped evidence, and premature intervention. Candidates are assessed on preserving the required order, not merely recalling it.",
  "",
  "BASELINE / HVAC PERFORMANCE RECORD",
  "The HVAC Performance Record preserves equipment and observer identity, timestamps, operating context, raw observations, instruments, measurement points, units, NIRET decision, any justified refrigerant-side evidence, and uncertainty before consequential intervention. It is the immutable comparison anchor for later Proof of Performance.",
  "",
  "NIRET",
  "NIRET means Non-Invasive Refrigerant Entry Threshold. Refrigerant-system entry is not a neutral first step. The candidate must demonstrate that the current TA-14 Academy NIRET has been satisfied before attaching gauges or otherwise crossing the invasive refrigerant boundary. This blueprint does not invent a numeric threshold; the operative NIRET criteria come from the current Academy standard and scenario version.",
  "",
  "DECLARED DIAGNOSTIC DETERMINATION",
  "The candidate declares the diagnostic determination before intervention and identifies the evidence supporting it, including unresolved conditions and limitations. The determination may not be silently back-filled after the system has been changed.",
  "",
  "INTERVENTION",
  "The intervention must correspond to the preserved evidence and declared determination. Unsupported scope expansion, unrelated intervention, or refrigerant movement without the required evidence boundary is a critical process failure.",
  "",
  "HVAC POST-PERFORMANCE RECORD",
  "The service chain is not complete when the repair ends. The technician preserves post-intervention raw observations separately from the original record and any adjustments. Proof of Performance compares records under documented comparable conditions to support IMPROVED, RESTORED, UNCHANGED, DEGRADED, or UNRESOLVED.",
  "",
  "ASSESSMENT WEIGHTS",
  "Sequence + Non-Invasive Evidence: 20%",
  "NIRET + Original-State Record: 20%",
  "Declared Diagnostic Determination: 15%",
  "Evidence-Based Intervention: 15%",
  "HVAC Post-Performance Record: 15%",
  "Proof of Performance: 15%",
  "",
  "RECOMMENDED PILOT PASSING RULE",
  "Pilot recommendation only: 80% overall, no critical failure, and no score below 70% in NIRET, original-state record preservation, or Proof of Performance. This is not a final psychometrically validated cut score.",
  "",
  "CRITICAL FAILURE EXAMPLES",
  "- Intervention before the original HVAC Performance Record is preserved.",
  "- Refrigerant entry before the applicable NIRET is satisfied.",
  "- Fabricating, reconstructing, or silently changing baseline evidence.",
  "- Failing to declare the diagnostic determination before intervention.",
  "- Intervention that is materially unsupported by the evidence or declared determination.",
  "- Claiming improvement without a comparable HVAC Post-Performance Record.",
  "- Creating an unsafe condition or violating applicable legal or safety requirements.",
  "",
  "MINIMUM PRACTICAL-ASSESSMENT EVIDENCE PACKET",
  "1. Candidate and session identity.",
  "2. Equipment/system identity and scenario conditions.",
  "3. Sequence execution record.",
  "4. Original HVAC Performance Record / baseline.",
  "5. NIRET evidence set and entry decision.",
  "6. Declared Diagnostic Determination.",
  "7. Intervention scope and execution record.",
  "8. HVAC Post-Performance Record.",
  "9. Proof of Performance - baseline-to-post comparison.",
  "10. Verified outcome / disposition.",
  "11. Assessor scoring and critical-failure review.",
  "",
  "ACADEMY / CREDENTIAL BOUNDARY",
  "TA-14 Academy teaches sequence, evidence discipline, stop rules, scenario reasoning, and professional field conduct. This blueprint does not confer HVAC trade licensure, government certification, manufacturer authorization, code approval, or a guarantee of technical outcome. A mature credential pathway may use an independent third-party assessment body to validate candidate performance.",
  "",
  "CANONICAL FIELD STATEMENT",
  "Sequence -> Non-Invasive Evidence -> NIRET -> Refrigerant-Side Evidence (if justified) -> Original-State HVAC Performance Record -> Declared Diagnostic Determination -> Evidence-Based Intervention -> HVAC Post-Performance Record -> Proof of Performance -> Verified Outcome.",
  "",
  "Evidence first. Truth preserved. Intervention earned.",
];

function esc(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)").replace(/[^\x20-\x7e]/g, "-");
}

function wrap(value: string, max = 86): string[] {
  if (!value) return [""];
  const words = value.split(/\s+/);
  const out: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= max) current = next;
    else { if (current) out.push(current); current = word; }
  }
  if (current) out.push(current);
  return out;
}

function makePdf() {
  const pages: string[][] = [[]];
  let used = 0;
  for (const source of lines) {
    const wrapped = wrap(source);
    if (used + wrapped.length > 46) { pages.push([]); used = 0; }
    pages[pages.length - 1].push(...wrapped);
    used += wrapped.length;
  }

  const objects: string[] = [];
  const add = (body: string) => { objects.push(body); return objects.length; };
  const font = add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  const bold = add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");
  const contentIds: number[] = [];
  const pageBodies: string[] = [];

  for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
    const page = pages[pageIndex];
    let y = 742;
    const ops: string[] = ["BT"];
    page.forEach((text, index) => {
      const heading = text === text.toUpperCase() && text.length > 0 && !/^\d/.test(text) && !text.startsWith("-");
      const title = pageIndex === 0 && index < 3;
      const size = title ? (index === 1 ? 20 : index === 2 ? 12 : 9) : heading ? 11 : 9;
      const face = title || heading ? "F2" : "F1";
      if (title && index === 0) ops.push("0.08 0.35 0.48 rg");
      else if (heading) ops.push("0.05 0.32 0.42 rg");
      else ops.push("0.08 0.12 0.17 rg");
      ops.push(`/${face} ${size} Tf`, `1 0 0 1 54 ${y} Tm`, `(${esc(text)}) Tj`);
      y -= title ? 26 : heading ? 20 : 14;
    });
    ops.push("ET");
    const stream = ops.join("\n");
    const contentId = add(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
    contentIds.push(contentId);
    pageBodies.push("");
  }

  const pageStartId = objects.length + 2;
  const pagesId = pageStartId + pages.length;
  for (let i = 0; i < pages.length; i++) {
    pageBodies[i] = `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 ${font} 0 R /F2 ${bold} 0 R >> >> /Contents ${contentIds[i]} 0 R >>`;
    add(pageBodies[i]);
  }
  const pageIds = Array.from({length: pages.length}, (_, i) => pageStartId + i);
  const actualPagesId = add(`<< /Type /Pages /Kids [${pageIds.map(id => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`);
  const catalog = add(`<< /Type /Catalog /Pages ${actualPagesId} 0 R >>`);

  let pdf = "%PDF-1.4\n%TA14\n";
  const offsets = [0];
  objects.forEach((body, index) => { offsets[index + 1] = pdf.length; pdf += `${index + 1} 0 obj\n${body}\nendobj\n`; });
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= objects.length; i++) pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalog} 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new TextEncoder().encode(pdf);
}

export async function GET() {
  const pdf = makePdf();
  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="TA14_Evidence_Before_Intervention_HVAC_Service_Competency_Assessment_Blueprint_v0_2.pdf"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
