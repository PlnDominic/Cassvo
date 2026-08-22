import Image from "next/image";
import { MapPin, Calendar } from "lucide-react";
import bg from "../../../public/images/auth/background.png";
import type { ProfileStat } from "./types";

export function ProfileHero({
  name,
  badge,
  role,
  location,
  joined,
  stats,
}: {
  name: string;
  badge: string;
  role: string;
  location: string;
  joined: string;
  stats: ProfileStat[];
}) {
  return (
    <div className="relative flex flex-col gap-6 overflow-hidden rounded-2xl bg-[#0b0b0c] p-6 sm:flex-row sm:items-center sm:justify-between">
      <Image src={bg} alt="" fill className="object-cover opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/20" />

      <div className="relative z-10 flex items-center gap-4">
        <div className="flex size-[72px] shrink-0 items-center justify-center rounded-2xl bg-brand-red text-2xl font-medium text-white">
          {name.charAt(0)}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-lg font-medium text-white">{name}</p>
            <span className="rounded-full bg-brand-red/20 px-3 py-1 text-xs font-medium text-brand-red">{badge}</span>
          </div>
          <p className="text-sm text-white/70">{role}</p>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-white/60">
            <span className="flex items-center gap-1.5">
              <MapPin size={13} />
              {location}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={13} />
              {joined}
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-10 grid w-fit grid-cols-2 gap-x-10 gap-y-5">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-start gap-2">
            <stat.icon size={16} className="mt-0.5 shrink-0 text-white/60" />
            <div>
              <p className="text-xs text-white/60">{stat.label}</p>
              <p className="text-lg font-medium text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
