import { DocumentList } from "./document-list";
import { PhotoGallery } from "./photo-gallery";
import type { OnboardBusinessData } from "./types";

const PRICE_LEVEL: Record<string, number> = { Budget: 1, Moderate: 2, Premium: 3, Luxury: 4 };

function PreviewBox({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[#ececed] bg-white p-4">
      <p className="mb-1 text-xs text-[#939393]">{label}</p>
      <div className="text-sm font-medium text-[#060606]">{children}</div>
    </div>
  );
}

export function ReviewStep({ data }: { data: OnboardBusinessData }) {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div>
        <h3 className="mb-4 text-sm font-medium text-[#060606]">Business Preview</h3>
        <div className="flex flex-col gap-4">
          <PreviewBox label="Business Name">{data.name || "–"}</PreviewBox>
          <PreviewBox label="Category">{data.category || "–"}</PreviewBox>
          <PreviewBox label="Business Type">{data.businessType || "–"}</PreviewBox>
          <PreviewBox label="Description">{data.description || "–"}</PreviewBox>

          <div className="rounded-xl border border-[#ececed] bg-white p-4">
            <p className="mb-3 text-xs text-[#939393]">More details</p>
            <div className="grid grid-cols-2 gap-4 text-sm font-medium text-[#060606]">
              <div className="flex flex-col gap-1.5">
                <span>{data.phone || "–"}</span>
                <span>{data.email || "–"}</span>
                <span>{data.businessAddress || "–"}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span>{data.operatingHours || "–"}</span>
                <span className="flex items-center gap-1">
                  Price <span className="text-base">{"¢".repeat(PRICE_LEVEL[data.price] ?? 1)}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex h-[100px] w-[100px] shrink-0 items-center justify-center rounded-xl border border-[#ececed] bg-[#f7f7f8] text-xs font-medium text-[#939393]">
              {data.logoImagePreview ? (
                // eslint-disable-next-line @next/next/no-img-element -- user-uploaded blob preview
                <img src={data.logoImagePreview} alt="Logo" className="size-full rounded-xl object-cover" />
              ) : (
                "Logo"
              )}
            </div>
            <div className="h-[100px] flex-1 overflow-hidden rounded-xl bg-[#f7f7f8]">
              {data.coverImagePreview && (
                // eslint-disable-next-line @next/next/no-img-element -- user-uploaded blob preview
                <img src={data.coverImagePreview} alt="Cover" className="size-full object-cover" />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <div>
          <h3 className="mb-4 text-sm font-medium text-[#060606]">Verification Document</h3>
          <DocumentList documents={data.documents} />
        </div>
        <div>
          <h3 className="mb-4 text-sm font-medium text-[#060606]">Additional Photos</h3>
          <PhotoGallery photos={data.additionalPhotos} editable={false} />
        </div>
      </div>
    </div>
  );
}
