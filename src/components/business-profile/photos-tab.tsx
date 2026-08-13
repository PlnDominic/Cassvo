import Image, { type StaticImageData } from "next/image";

export function PhotosTab({ photos }: { photos: StaticImageData[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {photos.map((photo, i) => (
        <div key={i} className="relative aspect-square overflow-hidden rounded-2xl bg-[#f7f7f8]">
          <Image src={photo} alt="" fill className="object-cover" />
        </div>
      ))}
    </div>
  );
}
