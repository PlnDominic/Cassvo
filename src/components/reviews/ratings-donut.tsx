export interface RatingSegment {
  label: string;
  percent: number;
  color: string;
}

export function RatingsDonut({
  segments,
  total,
  size = 154,
  strokeWidth = 16,
}: {
  segments: RatingSegment[];
  total: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Running start offset for each arc, precomputed so nothing mutates during render.
  const arcs = segments.reduce<{ segment: RatingSegment; start: number }[]>((acc, segment) => {
    const start = acc.length === 0 ? 0 : acc[acc.length - 1].start + acc[acc.length - 1].segment.percent;
    return [...acc, { segment, start }];
  }, []);

  return (
    <div className="flex items-center gap-6">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#ececed" strokeWidth={strokeWidth} />
          {arcs.map(({ segment, start }) => {
            const length = circumference * (segment.percent / 100);
            const offset = circumference * (1 - start / 100);
            return (
              <circle
                key={segment.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${length} ${circumference - length}`}
                strokeDashoffset={offset}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[28px] leading-none text-[#060606]">{total}</span>
          <span className="mt-1 text-xs text-[#939393]">Total</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {segments.map((segment) => (
          <div key={segment.label} className="flex items-center gap-2 text-sm">
            <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: segment.color }} />
            <span className="text-[#060606]">
              {segment.label} <span className="text-[#939393]">({segment.percent}%)</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
