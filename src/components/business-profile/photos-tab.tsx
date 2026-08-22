export function PhotosTab({ photos }: { photos: string[] }) {
  if (photos.length === 0) {
    return <p className="py-10 text-center text-sm text-[#939393]">No photos uploaded yet.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {photos.map((photo, i) => (
        <div key={i} className="relative aspect-square overflow-hidden rounded-2xl bg-[#f7f7f8]">
          {/* eslint-disable-next-line @next/next/no-img-element -- remote Supabase storage URL */}
          <img src={photo} alt="" className="size-full object-cover" />
        </div>
      ))}
    </div>
  );
}
