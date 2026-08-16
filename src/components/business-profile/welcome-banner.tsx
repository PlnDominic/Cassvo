import Image from "next/image";
import bg from "../../../public/images/dashboard/stat-card-bg.png";

export function WelcomeBanner({
  name,
  initial,
  subtitle,
  greeting = "Welcome",
}: {
  name: string;
  initial: string;
  subtitle: string;
  greeting?: string;
}) {
  return (
    <div className="relative flex items-center gap-5 overflow-hidden rounded-2xl bg-[#0b0b0c] px-6 py-6">
      <Image src={bg} alt="" fill className="object-cover opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20" />
      <div className="relative z-10 flex size-13 shrink-0 items-center justify-center rounded-full bg-brand-red text-xl font-medium text-white">
        {initial}
      </div>
      <div className="relative z-10">
        <h2 className="text-lg font-medium text-white">
          {greeting} {name}
        </h2>
        <p className="text-sm text-white/70">{subtitle}</p>
      </div>
    </div>
  );
}
