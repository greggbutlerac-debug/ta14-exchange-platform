// Real-browser check of the Refrigeration Consequence Boundary showroom (Chrome DevTools Protocol).
// Usage: node scripts/refrigeration-boundary/browser-check.mjs <base-url> <work-dir>
// Requires Google Chrome and a running server (next start). Prints a JSON report; exit code 1 on failure.
import { spawn } from "node:child_process";
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [base = "http://localhost:3917", work = "/tmp/rcb-browser-check"] = process.argv.slice(2);
const URL_ = `${base}/showrooms/refrigeration-consequence-boundary`;
const CHROME = process.env.CHROME ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9333;
mkdirSync(join(work, "downloads"), { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const chrome = spawn(CHROME, ["--headless=new", "--disable-gpu", `--remote-debugging-port=${PORT}`, `--user-data-dir=${join(work, "profile")}`, "about:blank"], { stdio: "ignore" });
let target;
for (let i = 0; i < 50 && !target; i++) { try { target = (await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()).find((t) => t.type === "page"); } catch { await sleep(200); } }
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r));
let id = 0; const waiting = new Map(); const consoleErrors = [];
ws.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  if (m.id && waiting.has(m.id)) { waiting.get(m.id)(m); waiting.delete(m.id); }
  if (m.method === "Runtime.exceptionThrown") consoleErrors.push(m.params.exceptionDetails.exception?.description ?? m.params.exceptionDetails.text);
  if (m.method === "Runtime.consoleAPICalled" && m.params.type === "error") consoleErrors.push(m.params.args.map((a) => a.value ?? a.description).join(" "));
});
const send = (method, params = {}) => new Promise((r) => { const i = ++id; waiting.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const evaluate = async (expr) => (await send("Runtime.evaluate", { expression: `(async () => { ${expr} })()`, awaitPromise: true, returnByValue: true })).result?.result?.value;
const load = async () => { await send("Page.navigate", { url: URL_ }); await sleep(3500); };

await send("Page.enable"); await send("Runtime.enable"); await send("DOM.enable");
await send("Browser.setDownloadBehavior", { behavior: "allow", downloadPath: join(work, "downloads") });
await load();

const helpers = `
  const byText = (sel, re) => [...document.querySelectorAll(sel)].find((e) => re.test(e.textContent));
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const until = async (f, ms = 8000) => { const t = Date.now(); while (Date.now() - t < ms) { const v = f(); if (v) return v; await wait(100); } return null; };
`;
const report = {};
report.lessons = await evaluate(`${helpers}
  const title = () => document.querySelector('article h2')?.textContent;
  const r = { initial: title() };
  byText('button', /NEXT/).click(); await wait(200); r.afterNext = title();
  byText('button', /PREVIOUS/).click(); await wait(200); r.afterPrevious = title();
  byText('nav[aria-label="Lesson list"] button', /^08$/).click(); await wait(200); r.jumpTo08 = title();
  r.nextDisabledOnLast = byText('button', /NEXT/).disabled;
  const ex = byText('button', /EXPLAIN/); ex.click(); await wait(200);
  r.explainExpanded = ex.getAttribute('aria-expanded'); r.explainItems = document.querySelectorAll('[id^="explain-"] li').length;
  r.imagePresent = !!document.querySelector('article figure');
  r.imageCaption = document.querySelector('article figure figcaption')?.textContent;
  r.reviewClaims = document.querySelector('article figure')?.textContent?.includes('27') && document.querySelector('article figure')?.textContent?.includes('S6');
  const auto = document.querySelector('input[type="checkbox"]'); auto.click(); r.autoplayChecked = auto.checked; auto.click();
  r.hashAfterNav = location.hash;
  r.figure08Matrix = !!document.querySelector('article table');
  return r;`);

report.narration = await evaluate(`${helpers}
  const r = { speechSynthesisAvailable: 'speechSynthesis' in window, voices: speechSynthesis.getVoices().length };
  const play = byText('button', /PLAY/); r.playDisabled = play.disabled; play.click(); await wait(800);
  r.speakingAfterPlay = speechSynthesis.speaking; r.pendingAfterPlay = speechSynthesis.pending;
  r.buttonAfterPlay = [...document.querySelectorAll('article button')].map((b) => b.textContent).find((t) => /PAUSE|PLAY|RESUME/.test(t));
  byText('button', /STOP/)?.click(); return r;`);

report.demo = await evaluate(`${helpers}
  const r = {};
  const tabs = [...document.querySelectorAll('[role="tab"]')].map((t) => t.textContent); r.tabs = tabs;
  byText('[role="tab"]', /^S2$/).click(); await wait(300);
  r.s2Heading = document.querySelector('#demonstration h3')?.textContent;
  byText('button', /VERIFY IN THIS BROWSER/).click();
  r.s2Verify = await until(() => { const s = [...document.querySelectorAll('#demonstration [role="status"]')].map((e) => e.textContent).find((t) => /VALID|INVALID|Could not/.test(t)); return s; });
  const link = byText('#demonstration a', /DOWNLOAD RECORD/); r.downloadName = link.getAttribute('download'); r.downloadHref = link.getAttribute('href');
  link.click(); await wait(1500);
  byText('[role="tab"]', /^E1$/).click(); await wait(300);
  r.e1Heading = document.querySelector('#demonstration h3')?.textContent;
  r.e1HasEmergencySteps = /EMERGENCY_MEASURE_EXECUTED/.test(document.querySelector('#demonstration').textContent);
  r.e1Claims = [...document.querySelectorAll('#demonstration li span')].map((s) => s.textContent).filter((t) => /PASS|FAIL|NOT DEMONSTRATED/.test(t));
  r.emergencySection = !!document.querySelector('#emergency-pathway table');
  r.pdfStatus = (await fetch(document.querySelector('a[href$=".pdf"]').getAttribute('href'))).status;
  return r;`);

// Real download landed on disk?
await sleep(1000);
const dl = readdirSync(join(work, "downloads"));
report.downloadedFiles = dl;
// Uploads: the downloaded record as-is, and a tampered copy.
const recordFile = dl.find((f) => f.endsWith(".json"));
if (recordFile) {
  const original = join(work, "downloads", recordFile);
  const tampered = join(work, "tampered.json");
  const data = JSON.parse(readFileSync(original, "utf8"));
  data.incidentRecord.entries[40].payload.productC = -30;
  writeFileSync(tampered, JSON.stringify(data));
  const input = (await send("Runtime.evaluate", { expression: `document.querySelector('#demonstration input[type="file"]')` })).result.result.objectId;
  for (const [label, file] of [["untouched", original], ["tampered", tampered]]) {
    await send("DOM.setFileInputFiles", { files: [file], objectId: input });
    report[`upload_${label}`] = await evaluate(`${helpers} return await until(() => [...document.querySelectorAll('#demonstration [role="status"]')].map((e) => e.textContent).find((t) => t.includes(${JSON.stringify(label === "untouched" ? recordFile : "tampered.json")})));`);
  }
}

// Phone width.
await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 2, mobile: false, screenWidth: 390, screenHeight: 844 });
await load();
report.mobile = await evaluate(`return { innerWidth: innerWidth, scrollWidth: document.documentElement.scrollWidth, overflowing: [...document.querySelectorAll('body *')].filter((e) => { const r = e.getBoundingClientRect(); return r.right > innerWidth + 1 && getComputedStyle(e).position !== 'fixed' && !e.closest('[style*="overflow-x"], [style*="overflow: auto"]'); }).slice(0, 5).map((e) => e.tagName + ':' + (e.textContent || '').slice(0, 40)) };`);
const shot = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
writeFileSync(join(work, "mobile.png"), Buffer.from(shot.result.data, "base64"));
report.consoleErrors = consoleErrors;

ws.close(); chrome.kill();
const failures = [];
const L = report.lessons, D = report.demo;
if (!/^02/.test(L.afterNext) || !/^01/.test(L.afterPrevious) || !/^08/.test(L.jumpTo08) || !L.nextDisabledOnLast) failures.push("lesson navigation");
if (L.explainExpanded !== "true" || L.explainItems < 1) failures.push("EXPLAIN control");
if (!L.imagePresent || !/SIMULATION/.test(L.imageCaption ?? "") || !L.reviewClaims) failures.push("review teaching diagram");
if (!/VALID · \d+ entries/.test(D.s2Verify ?? "") || /INVALID/.test(D.s2Verify ?? "")) failures.push("in-browser verification");
if (!dl.some((f) => f.includes("S2"))) failures.push("download");
if (!/VALID/.test(report.upload_untouched ?? "") || /INVALID/.test(report.upload_untouched ?? "")) failures.push("upload untouched");
if (!/INVALID/.test(report.upload_tampered ?? "")) failures.push("upload tampered");
if (!D.e1HasEmergencySteps || !D.emergencySection || D.pdfStatus !== 200) failures.push("E1 / emergency / PDF");
if (report.mobile.innerWidth !== 390 || report.mobile.scrollWidth > report.mobile.innerWidth || report.mobile.overflowing.length) failures.push("mobile layout at 390 px");
if (consoleErrors.length) failures.push("console errors");
report.failures = failures;
console.log(JSON.stringify(report, null, 1));
process.exit(failures.length ? 1 : 0);
