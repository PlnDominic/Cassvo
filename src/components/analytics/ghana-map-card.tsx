import Image from "next/image";
import ghanaMap from "../../../public/images/analytics/ghana-map.png";

export function GhanaMapCard() {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-white p-5 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.08)]">
      <div className="relative h-full w-full max-w-[300px]">
        <Image src={ghanaMap} alt="Reviews across Ghana's regions" fill className="object-contain" />
      </div>
    </div>
  );
}
