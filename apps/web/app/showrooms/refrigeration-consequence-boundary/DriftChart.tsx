/*
 * Temperature drift chart drawn directly from simulation series (SIMULATION data).
 * Lines: simulation ground truth (solid), independent EIN readings (dots), and the controller's
 * self-report (dashed). The status strip shows the EIN classification over time.
 */
export type ChartPoint = { minute: number; truthAirC: number; truthProductC: number; einAirC: number | null; einProductC: number | null; controllerReportedAirC: number; status: string };

const STATUS_COLOR: Record<string, string> = { NORMAL: '#2f6f5e', WATCH: '#E8B04B', EVIDENCE_INSUFFICIENT: '#8A9BA8', EXCEPTION: '#E86A5B', FAULT: '#c0392b' };
export const statusColor = (s: string) => STATUS_COLOR[s] ?? '#8A9BA8';

export function DriftChart({ series, band, productLimit, title, events = [] }: { series: ChartPoint[]; band: [number, number]; productLimit: number; title: string; events?: Array<{ minute: number; label: string }> }) {
  const W = 960, H = 360, L = 52, R = 16, T = 28, B = 64;
  const minT = -30, maxT = 20;
  const x = (m: number) => L + (m / 1440) * (W - L - R);
  const y = (c: number) => T + ((maxT - Math.max(minT, Math.min(maxT, c))) / (maxT - minT)) * (H - T - B);
  const path = (pick: (p: ChartPoint) => number | null) => {
    let d = '';
    let penDown = false; // a missing reading lifts the pen, so gaps stay visible
    for (const p of series) {
      const v = pick(p);
      if (v === null) { penDown = false; continue; }
      d += `${penDown ? 'L' : 'M'}${x(p.minute).toFixed(1)},${y(v).toFixed(1)} `;
      penDown = true;
    }
    return d;
  };
  return (
    <figure style={{ margin: 0 }}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${title}. Simulation data.`} style={{ width: '100%', height: 'auto', background: '#031a2e', borderRadius: 12, border: '1px solid #285b78' }}>
        <text x={L} y={18} fill="#B9D9EB" fontSize="13" fontWeight="700">{title} · SIMULATION</text>
        <rect x={L} y={y(band[1])} width={W - L - R} height={y(band[0]) - y(band[1])} fill="#7BAFD4" opacity="0.12" />
        <line x1={L} x2={W - R} y1={y(productLimit)} y2={y(productLimit)} stroke="#E8B04B" strokeDasharray="6 4" />
        <text x={W - R - 4} y={y(productLimit) - 4} fill="#E8B04B" fontSize="11" textAnchor="end">product limit {productLimit} °C</text>
        {[-30, -20, -10, 0, 10, 20].map((c) => <g key={c}><line x1={L - 4} x2={L} y1={y(c)} y2={y(c)} stroke="#89A9BF" /><text x={L - 8} y={y(c) + 4} fill="#89A9BF" fontSize="11" textAnchor="end">{c}</text></g>)}
        {[0, 240, 480, 720, 960, 1200, 1440].map((m) => <text key={m} x={x(m)} y={H - B + 16} fill="#89A9BF" fontSize="11" textAnchor="middle">{String(Math.floor(m / 60) % 24).padStart(2, '0')}:00</text>)}
        <path d={path((p) => p.truthAirC)} fill="none" stroke="#7BAFD4" strokeWidth="1.6" />
        <path d={path((p) => p.truthProductC)} fill="none" stroke="#ffffff" strokeWidth="2" />
        <path d={path((p) => p.controllerReportedAirC)} fill="none" stroke="#E86A5B" strokeWidth="1.6" strokeDasharray="5 4" />
        {series.map((p) => p.einProductC === null ? null : <circle key={`p${p.minute}`} cx={x(p.minute)} cy={y(p.einProductC)} r="1.8" fill="#B9D9EB" />)}
        {series.map((p) => <rect key={`s${p.minute}`} x={x(p.minute)} y={H - B + 26} width={Math.max(1, x(10) - x(0))} height="10" fill={statusColor(p.status)} />)}
        {events.map((e) => <g key={e.label}><line x1={x(e.minute)} x2={x(e.minute)} y1={T} y2={H - B} stroke="#B9D9EB" strokeDasharray="2 3" opacity="0.6" /><text x={x(e.minute) + 3} y={T + 12} fill="#B9D9EB" fontSize="10">{e.label}</text></g>)}
        <text x={L} y={H - 8} fill="#89A9BF" fontSize="11">── truth air · ━ truth product (simulation only) · ┄ controller self-report · • independent product probes · strip: EIN status</text>
      </svg>
    </figure>
  );
}
