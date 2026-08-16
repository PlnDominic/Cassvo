import { FormField, TextareaField } from "./form-field";
import { ImageUploadBox } from "./image-upload-box";
import type { OnboardBusinessData } from "./types";

export function BusinessInfoStep({
  data,
  onChange,
}: {
  data: OnboardBusinessData;
  onChange: (patch: Partial<OnboardBusinessData>) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
      <div className="flex flex-col gap-6">
        <FormField
          id="business-name"
          label="Business name"
          placeholder="Sunset Restaurant"
          value={data.name}
          onChange={(e) => onChange({ name: e.target.value })}
        />
        <FormField
          id="business-category"
          label="Category"
          placeholder="Food & Dining"
          value={data.category}
          onChange={(e) => onChange({ category: e.target.value })}
        />
        <FormField
          id="business-type"
          label="Business Type"
          placeholder="Online"
          value={data.businessType}
          onChange={(e) => onChange({ businessType: e.target.value })}
        />
        <TextareaField
          id="business-description"
          label="Description"
          placeholder="A Cozy Restaurant ...."
          value={data.description}
          onChange={(e) => onChange({ description: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-6">
        <ImageUploadBox
          label="Cover Image ( Image Banner )"
          placeholder={data.name || "Cover image preview"}
          preview={data.coverImagePreview}
          onChange={(preview) => onChange({ coverImagePreview: preview })}
        />
        <ImageUploadBox
          label="Business Logo (Optional )"
          placeholder={data.name || "Logo preview"}
          preview={data.logoImagePreview}
          onChange={(preview) => onChange({ logoImagePreview: preview })}
        />
      </div>
    </div>
  );
}
