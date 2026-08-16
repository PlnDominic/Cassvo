import { DocumentList } from "./document-list";
import { PhotoGallery } from "./photo-gallery";
import type { OnboardBusinessData } from "./types";

export function VerificationStep({
  data,
  onChange,
}: {
  data: OnboardBusinessData;
  onChange: (patch: Partial<OnboardBusinessData>) => void;
}) {
  function removeDocument(id: string) {
    onChange({ documents: data.documents.filter((doc) => doc.id !== id) });
  }

  function addPhoto(preview: string) {
    onChange({ additionalPhotos: [...data.additionalPhotos, { id: crypto.randomUUID(), preview }] });
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div>
        <h3 className="text-sm font-medium text-[#060606]">Verification Document</h3>
        <p className="mb-4 text-xs text-[#939393]">Upload documents to verify this business</p>
        <DocumentList documents={data.documents} onRemove={removeDocument} />
      </div>

      <div>
        <h3 className="text-sm font-medium text-[#060606]">Additional Photos</h3>
        <p className="mb-4 text-xs text-[#939393]">Add Photos of Businesses ( interior, exterior, products etc )</p>
        <PhotoGallery photos={data.additionalPhotos} onAdd={addPhoto} />
      </div>
    </div>
  );
}
