import { Star } from "lucide-react";

export function StarRating({
  rating,
  count,
  size = 14,
  className = "",
  textClassName = "text-[#939393]",
}: {
  rating: number;
  count?: number;
  size?: number;
  className?: string;
  textClassName?: string;
}) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={size}
            className={i < Math.round(rating) ? "fill-brand-red text-brand-red" : "fill-line text-line"}
          />
        ))}
      </div>
      <span className={`text-sm font-medium tracking-[0.01em] ${textClassName}`}>
        {rating.toFixed(1)}
        {count !== undefined ? `(${count})` : ""}
      </span>
    </div>
  );
}
