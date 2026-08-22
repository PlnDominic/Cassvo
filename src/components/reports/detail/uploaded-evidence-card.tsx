export function UploadedEvidenceCard({ images }: { images: string[] }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.04)]">
      <div>
        <h3 className="text-sm font-medium text-[#060606]">Uploaded Evidence</h3>
        <p className="text-xs text-[#939393]">Images</p>
      </div>
      {images.length === 0 ? (
        <p className="py-6 text-center text-sm text-[#939393]">No evidence uploaded.</p>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {images.map((image, i) => (
            <div key={i} className="relative aspect-square overflow-hidden rounded-xl bg-[#f7f7f8]">
              {/* eslint-disable-next-line @next/next/no-img-element -- remote Supabase storage URL */}
              <img src={image} alt="" className="size-full object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
