import { FormField, SelectField, TextareaField } from "./form-field";
import { ImageUploadBox } from "./image-upload-box";
import type { OnboardBusinessData } from "./types";
import type { CategoryOption } from "@/lib/data/categories";

export function BusinessInfoStep({
  data,
  categories,
  onChange,
}: {
  data: OnboardBusinessData;
  /** Real categories.id/title rows — replaces what used to be a free-text field (see supabase real-schema check, businesses.category_id is a foreign key). */
  categories: CategoryOption[];
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
        <SelectField
          id="business-category"
          label="Category"
          value={data.category}
          onChange={(e) => onChange({ category: e.target.value })}
          options={[
            { value: "", label: categories.length === 0 ? "No categories found" : "Select a category" },
            ...categories.map((c) => ({ value: c.id, label: c.title })),
          ]}
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
          onChange={(file, preview) => onChange({ coverImageFile: file, coverImagePreview: preview })}
        />
        <ImageUploadBox
          label="Business Logo (Optional — preview only, not saved yet)"
          placeholder={data.name || "Logo preview"}
          preview={data.logoImagePreview}
          // businesses has no logo column (only cover_image) — this never
          // gets uploaded or persisted, only shown in this wizard's own
          // preview card. See createBusiness()'s own comment for why.
          onChange={(_file, preview) => onChange({ logoImagePreview: preview })}
        />
      </div>
    </div>
  );
}
