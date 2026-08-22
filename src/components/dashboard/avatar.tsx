"use client";

import { useState } from "react";

const PALETTE = ["#ea0505", "#f59e0b", "#14b8a6", "#6366f1", "#ec4899", "#22c55e"];

function colorFor(name: string) {
  const index = name.charCodeAt(0) % PALETTE.length;
  return PALETTE[index];
}

export function Avatar({ name, size = 39, src }: { name: string; size?: number; src?: string | null }) {
  const [broken, setBroken] = useState(false);
  const initial = name.trim().charAt(0).toUpperCase();

  if (src && !broken) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- remote Supabase storage URL
      <img
        src={src}
        alt=""
        className="shrink-0 rounded-full object-cover"
        style={{ width: size, height: size }}
        onError={() => setBroken(true)}
      />
    );
  }

  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full text-white"
      style={{ width: size, height: size, backgroundColor: colorFor(name), fontSize: size * 0.4 }}
    >
      {initial}
    </div>
  );
}
