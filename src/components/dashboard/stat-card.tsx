import Image from "next/image";
import { TrendingUp, AlertTriangle, Users } from "lucide-react";
import statCardBg from "../../../public/images/dashboard/stat-card-bg.png";

interface StatCardProps {
  label: string;
  value: string;
  trend: { type: "up"; text: string } | { type: "attention"; text: string };
}

export function StatCard({ label, value, trend }: StatCardProps) {
  return (
    <div className="relative h-[154px] w-full overflow-hidden rounded-[14px] shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)]">
      <Image src={statCardBg} alt="" fill className="object-cover" />
      <div className="absolute inset-0 bg-black/80" />
      <div className="absolute right-4 top-4 flex size-11 items-center justify-center rounded-full bg-brand-red/20">
        <Users size={22} className="text-brand-red" />
      </div>
      <div className="relative flex h-full flex-col justify-between p-5">
        <div>
          <p className="text-base font-medium text-white/70">{label}</p>
          <p className="mt-2 text-[32px] leading-none text-white">{value}</p>
        </div>
        {trend.type === "up" ? (
          <div className="flex items-center gap-1.5 text-[16px] tracking-[0.01em]">
            <TrendingUp size={20} className="text-[#34c759]" />
            <span className="font-medium text-[#34c759]">{trend.text.split(" ")[0]}</span>
            <span className="text-[#e6e6e6]">{trend.text.split(" ").slice(1).join(" ")}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-[16px] tracking-[0.01em]">
            <AlertTriangle size={18} className="text-brand-red" />
            <span className="font-medium text-brand-red">{trend.text}</span>
          </div>
        )}
      </div>
    </div>
  );
}
