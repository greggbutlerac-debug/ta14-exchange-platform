import { NextResponse } from "next/server";

const lines = [
  "TA-14 ACADEMY",
  "Evidence Before Intervention",
  "HVAC Service Competency & Assessment Blueprint v0.1",
  "",
  "No admissible evidence. No admissible intervention.",
  "",
  "PURPOSE",
  "This blueprint defines a bounded HVAC service competency focused on whether a technician can establish sufficient evidence before creating a consequence-bearing intervention, especially before entering a sealed refrigerant circuit.",
  "",
  "CORE SERVICE SEQUENCE",
  "1. Baseline - Create a non-invasive operating baseline before disturbance.",
  "2. Evidence Sufficiency - Identify what is known, unknown, measured, inferred, and still required.",
  "3. Entry Threshold - Determine whether refrigerant-side entry is justified by available evidence.",
  "4. Diagnostic Determination - State the bounded determination before intervention.",
  "5. Intervention - Perform only the intervention supported by determination and scope.",
  "6. Post-Intervention Record - Re-measure performance and compare against baseline.",
  "7. Outcome Closure - State what changed, what remains unresolved, and whether the intended outcome was achieved.",
  "",
  "ASSESSMENT DOMAINS",
  "Baseline establishment: 20%",
  "Evidence sufficiency and diagnostic determination: 25%",
  "Refrigerant-entry admissibility: 25%",
  "Evidence-governed intervention: 15%",
  "Outcome verification: 15%",
  "",
  "CRITICAL-FAILURE CONDITIONS",
  "- Entering the sealed refrigerant circuit before the defined entry threshold is established.",
  "- Refrigerant transfer without a supported determination and applicable authority.",
  "- Fabricating, backfilling, or silently changing baseline evidence.",
  "- Performing intervention beyond declared scope or contrary to the candidate determination.",
  "- Failing to preserve the post-intervention performance record needed to evaluate outcome.",
  "- Creating an unsafe condition or violating applicable safety or legal requirements.",
  "",
  "SCORING MODEL",
  "Recommended pilot passing standard: 80/100 overall, no domain below 70%, and no critical failure. This is a blueprint recommendation for pilot validation, not a final psychometrically validated cut score.",
  "",
  "INSTRUCTION / ASSESSMENT SEPARATION",
  "TA-14 Academy may teach doctrine, simulations, practice cases, evidence discipline, labs, and candidate preparation. A mature credential pathway should preserve independence between instruction and final credential determination wherever feasible.",
  "",
  "Evidence before intervention. Determination before disturbance. Verification after consequence.",
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
    if (used + wrapped.length > 47) { pages.push([]); used = 0; }
    pages[pages.length - 1].push(...wrapped);
    used += wrapped.length;
  }

  const objects: string[] = [];
  const add = (body: string) => { objects.push(body); return objects.length; };
  const font = add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  const bold = add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");
  const pageIds: number[] = [];
  const contentIds: number[] = [];

  for (const page of pages) {
    let y = 742;
    const ops: string[] = ["BT"];
    page.forEach((text, index) => {
      const heading = text === text.toUpperCase() && text.length > 0 && !/^\d/.test(text) && !text.startsWith("-");
      const title = index < 3 && pages.indexOf(page) === 0;
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
    contentIds.push(add(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`));
    pageIds.push(0);
  }

  const pagesId = objects.length + pages.length + 1;
  for (let i = 0; i < pages.length; i++) {
    const pageId = add(`<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 ${font} 0 R /F2 ${bold} 0 R >> >> /Contents ${contentIds[i]} 0 R >>`);
    pageIds[i] = pageId;
  }
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
      "Content-Disposition": 'attachment; filename="TA14_Evidence_Before_Intervention_HVAC_Service_Competency_Assessment_Blueprint_v0_1.pdf"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
