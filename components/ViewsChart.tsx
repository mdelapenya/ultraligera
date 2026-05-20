import type { Locale } from "@/lib/i18n";

export type ChartSeries = {
  name: string;
  color: string;
  points: { date: string; value: number }[];
};

type Props = {
  title: string;
  subtitle?: string;
  series: ChartSeries[];
  emptyLabel: string;
  locale: Locale;
  height?: number;
};

function formatCompact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1)}k`;
  return String(n);
}

function formatDate(iso: string, locale: Locale): string {
  const d = new Date(iso + "T00:00:00Z");
  return new Intl.DateTimeFormat(locale === "es" ? "es-ES" : "en-US", {
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
  }).format(d);
}

export function ViewsChart({
  title,
  subtitle,
  series,
  emptyLabel,
  locale,
  height = 220,
}: Props) {
  const allDates = Array.from(
    new Set(series.flatMap((s) => s.points.map((p) => p.date))),
  ).sort();

  const allValues = series.flatMap((s) => s.points.map((p) => p.value));
  const hasEnoughData = allDates.length >= 2 && allValues.length > 0;

  return (
    <div className="border border-[color:var(--border)] p-6 md:p-8">
      <div className="mb-6">
        <h3 className="display text-2xl md:text-3xl">{title}</h3>
        {subtitle ? (
          <p className="mt-1 text-xs font-mono uppercase tracking-widest text-white/40">
            {subtitle}
          </p>
        ) : null}
        {series.length > 1 ? (
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs">
            {series.map((s) => (
              <li key={s.name} className="flex items-center gap-2 text-white/70">
                <span
                  aria-hidden
                  className="inline-block w-3 h-[2px] shrink-0"
                  style={{ background: s.color }}
                />
                <span>{s.name}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {hasEnoughData ? (
        <ChartSvg
          series={series}
          allDates={allDates}
          height={height}
          locale={locale}
        />
      ) : (
        <p className="text-sm text-white/50 py-10 text-center font-mono uppercase tracking-widest">
          {emptyLabel}
        </p>
      )}
    </div>
  );
}

function ChartSvg({
  series,
  allDates,
  height,
  locale,
}: {
  series: ChartSeries[];
  allDates: string[];
  height: number;
  locale: Locale;
}) {
  const W = 800;
  const H = height;
  const PAD = { top: 12, right: 12, bottom: 28, left: 52 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const values = series.flatMap((s) => s.points.map((p) => p.value));
  const minV = Math.min(...values);
  const maxV = Math.max(...values);
  const range = maxV - minV || 1;
  // Pad the Y range by 8% so points don't sit on the axes.
  const yMin = Math.max(0, minV - range * 0.08);
  const yMax = maxV + range * 0.08;

  const xForIndex = (i: number) =>
    PAD.left + (allDates.length === 1 ? innerW / 2 : (i * innerW) / (allDates.length - 1));
  const yForValue = (v: number) =>
    PAD.top + innerH - ((v - yMin) / (yMax - yMin || 1)) * innerH;

  const indexByDate = new Map(allDates.map((d, i) => [d, i]));

  // 4 horizontal grid lines for readability.
  const gridSteps = 4;
  const gridValues = Array.from({ length: gridSteps + 1 }, (_, i) =>
    yMin + ((yMax - yMin) * i) / gridSteps,
  );

  // X labels: first, last, and ~3 in between when there's room.
  const xLabelIdx = pickXLabels(allDates.length);

  // Format a tooltip value with full thousands separators — the compact
  // formatter is only used for axis labels.
  const nf = new Intl.NumberFormat(locale === "es" ? "es-ES" : "en-US");

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-auto"
      style={{ overflow: "visible" }}
      role="img"
      aria-label="Trending chart"
    >
      <style>{`
        .vc-point .vc-tip { opacity: 0; transition: opacity 100ms ease-out; pointer-events: none; }
        .vc-point:hover .vc-tip, .vc-point:focus-within .vc-tip { opacity: 1; }
        .vc-point .vc-dot { transition: r 100ms ease-out; }
        .vc-point:hover .vc-dot { r: 5; }
        /* Overlapping series on a black background — without blending, the
           series drawn last hides the ones below. Screen blending mixes the
           strokes so collisions become visible (blue+green=cyan, etc.). */
        .vc-line, .vc-dot { mix-blend-mode: screen; }
      `}</style>
      {gridValues.map((gv, i) => {
        const y = yForValue(gv);
        return (
          <g key={i}>
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={y}
              y2={y}
              stroke="currentColor"
              strokeOpacity={0.08}
              strokeWidth={1}
            />
            <text
              x={PAD.left - 8}
              y={y}
              fontSize={10}
              textAnchor="end"
              dominantBaseline="middle"
              fill="currentColor"
              fillOpacity={0.45}
              fontFamily="var(--font-mono, monospace)"
            >
              {formatCompact(gv)}
            </text>
          </g>
        );
      })}

      {xLabelIdx.map((i) => {
        const x = xForIndex(i);
        return (
          <text
            key={i}
            x={x}
            y={H - 8}
            fontSize={10}
            textAnchor="middle"
            fill="currentColor"
            fillOpacity={0.45}
            fontFamily="var(--font-mono, monospace)"
          >
            {formatDate(allDates[i], locale)}
          </text>
        );
      })}

      {series.map((s) => {
        const pts = s.points
          .map((p) => {
            const idx = indexByDate.get(p.date);
            if (idx === undefined) return null;
            return {
              x: xForIndex(idx),
              y: yForValue(p.value),
              date: p.date,
              value: p.value,
            };
          })
          .filter(
            (p): p is { x: number; y: number; date: string; value: number } =>
              p !== null,
          );
        if (pts.length === 0) return null;
        const dStr = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
        return (
          <g key={s.name}>
            <path className="vc-line" d={dStr} fill="none" stroke={s.color} strokeWidth={2} />
            {pts.map((p, i) => {
              const label = `${nf.format(p.value)} · ${formatDate(p.date, locale)}`;
              return (
                <g key={i} className="vc-point" tabIndex={0}>
                  <circle
                    className="vc-dot"
                    cx={p.x}
                    cy={p.y}
                    r={3}
                    fill={s.color}
                  />
                  {/* Larger transparent target makes hover/touch easier. */}
                  <circle cx={p.x} cy={p.y} r={12} fill="transparent" />
                  <text
                    className="vc-tip"
                    x={p.x}
                    y={p.y - 12}
                    fontSize={11}
                    textAnchor="middle"
                    fill="white"
                    stroke="rgba(0,0,0,0.85)"
                    strokeWidth={3}
                    paintOrder="stroke"
                    fontFamily="var(--font-mono, monospace)"
                  >
                    {label}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

function pickXLabels(total: number): number[] {
  if (total <= 1) return [0];
  if (total <= 5) return Array.from({ length: total }, (_, i) => i);
  const step = Math.max(1, Math.floor((total - 1) / 4));
  const set = new Set<number>();
  for (let i = 0; i < total; i += step) set.add(i);
  set.add(total - 1);
  return Array.from(set).sort((a, b) => a - b);
}
