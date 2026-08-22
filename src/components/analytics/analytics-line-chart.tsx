"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";

export interface ChartPoint {
  label: string;
  value: number;
}

function formatValue(value: number) {
  if (value >= 1000) {
    const k = value / 1000;
    return `${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}k`;
  }
  return value.toLocaleString();
}

const WIDTH = 600;
const HEIGHT = 220;
const PAD_LEFT = 40;
const PAD_RIGHT = 12;
const PAD_TOP = 40;
const PAD_BOTTOM = 26;
const PLOT_W = WIDTH - PAD_LEFT - PAD_RIGHT;
const PLOT_H = HEIGHT - PAD_TOP - PAD_BOTTOM;

export function AnalyticsLineChart({
  title,
  total,
  changeText,
  monthLabel = "May",
  points,
}: {
  title: string;
  total: string;
  changeText: string;
  monthLabel?: string;
  points: ChartPoint[];
}) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const gradientId = useId();

  const maxValue = Math.max(...points.map((p) => p.value));
  const niceMax = Math.max(500, Math.ceil(maxValue / 500) * 500);
  const tickCount = 5;
  const ticks = Array.from({ length: tickCount }, (_, i) => (niceMax / tickCount) * (i + 1));

  const x = (i: number) => PAD_LEFT + (points.length === 1 ? 0 : (i / (points.length - 1)) * PLOT_W);
  const y = (v: number) => PAD_TOP + PLOT_H - (v / niceMax) * PLOT_H;

  const peakIndex = points.reduce((best, p, i) => (p.value > points[best].value ? i : best), 0);
  const activeIndex = hoverIndex ?? peakIndex;
  const activePoint = points[activeIndex];

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(p.value)}`).join(" ");

  function handlePointerMove(event: React.PointerEvent<SVGRectElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const relX = ((event.clientX - rect.left) / rect.width) * WIDTH;
    let nearest = 0;
    let nearestDist = Infinity;
    points.forEach((_, i) => {
      const dist = Math.abs(x(i) - relX);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = i;
      }
    });
    setHoverIndex(nearest);
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-[#060606]">{title}</p>
        <span className="flex items-center gap-1 text-xs font-medium text-[#939393]">
          {monthLabel}
          <ChevronDown size={12} />
        </span>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-medium text-[#060606]">{total}</span>
        <span className="text-sm font-medium text-emerald-500">{changeText}</span>
      </div>

      <div className="relative w-full">
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label={`${title} line chart`}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ea0505" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#ea0505" stopOpacity="0" />
            </linearGradient>
          </defs>

          {ticks.map((tick) => (
            <g key={tick}>
              <line x1={PAD_LEFT} x2={WIDTH - PAD_RIGHT} y1={y(tick)} y2={y(tick)} stroke="#ececed" strokeWidth="1" />
              <text x={PAD_LEFT - 8} y={y(tick)} textAnchor="end" dominantBaseline="middle" className="fill-[#bdbdc2] text-[9px]">
                {formatValue(tick)}
              </text>
            </g>
          ))}

          <path d={`${linePath} L ${x(points.length - 1)} ${y(0)} L ${x(0)} ${y(0)} Z`} fill={`url(#${gradientId})`} />
          <path d={linePath} fill="none" stroke="#ea0505" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

          {hoverIndex !== null && (
            <line x1={x(activeIndex)} x2={x(activeIndex)} y1={PAD_TOP} y2={y(0)} stroke="#ececed" strokeWidth="1" />
          )}

          {points.map((p, i) => (
            <circle
              key={i}
              cx={x(i)}
              cy={y(p.value)}
              r={i === activeIndex ? 5 : 4}
              fill="#ea0505"
              stroke="#ffffff"
              strokeWidth="2"
            />
          ))}

          {points.map((p, i) => (
            <text key={i} x={x(i)} y={HEIGHT - 6} textAnchor="middle" className="fill-[#bdbdc2] text-[9px]">
              {p.label}
            </text>
          ))}

          <foreignObject x={Math.max(0, Math.min(WIDTH - 60, x(activeIndex) - 30))} y={Math.max(0, y(activePoint.value) - 34)} width="60" height="24">
            <div className="flex items-center justify-center rounded-md bg-brand-red px-2 py-1 text-center text-[10px] font-medium text-white">
              {formatValue(activePoint.value)}
            </div>
          </foreignObject>

          <rect
            x={PAD_LEFT}
            y={PAD_TOP}
            width={PLOT_W}
            height={PLOT_H}
            fill="transparent"
            onPointerMove={handlePointerMove}
            onPointerLeave={() => setHoverIndex(null)}
          />
        </svg>
      </div>
    </div>
  );
}
