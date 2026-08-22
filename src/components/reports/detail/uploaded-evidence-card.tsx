import Image, { type StaticImageData } from "next/image";

export function UploadedEvidenceCard({ images }: { images: StaticImageData[] }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.04)]">
      <div>
        <h3 className="text-sm font-medium text-[#060606]">Uploaded Evidence</h3>
        <p className="text-xs text-[#939393]">Images</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {images.map((image, i) => (
          <div key={i} className="relative aspect-square overflow-hidden rounded-xl bg-[#f7f7f8]">
            <Image src={image} alt="" fill className="object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}
