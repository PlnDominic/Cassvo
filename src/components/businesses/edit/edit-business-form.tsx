"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, TriangleAlert, X } from "lucide-react";
import { FormField, SelectField, TextareaField } from "../onboard/form-field";
import { ImageUploadBox } from "../onboard/image-upload-box";
import { PRICE_OPTIONS } from "../onboard/types";
import { updateBusiness } from "@/lib/actions/businesses";
import { uploadImage } from "@/lib/upload-image";
import type { BusinessDetail } from "@/lib/data/businesses";
import type { CategoryOption } from "@/lib/data/categories";

interface PhotoItem {
  id: string;
  preview: string;
  /** null for an existing, already-uploaded photo (its `preview` is the real URL); set for a newly picked file not yet uploaded. */
  file: File | null;
}

interface FormState {
  name: string;
  categoryId: string;
  description: string;
  phone: string;
  website: string;
  price: string;
  waitTime: string;
  cityArea: string;
  operatingHours: string;
  amenities: string;
  businessAddress: string;
  coverImagePreview: string | null;
  coverImageFile: File | null;
  photos: PhotoItem[];
}

function toFormState(business: BusinessDetail): FormState {
  return {
    name: business.name,
    categoryId: business.categoryId ?? "",
    description: business.description ?? "",
    phone: business.phone ?? "",
    website: business.website ?? "",
    price: business.priceRange ?? "Premium",
    waitTime: business.waitTime ?? "",
    cityArea: business.cityArea ?? "",
    operatingHours: business.operatingHours ?? "",
    amenities: business.amenities.join(", "),
    businessAddress: business.address ?? "",
    coverImagePreview: business.coverImageUrl,
    coverImageFile: null,
    photos: business.photos.map((url, i) => ({ id: `existing-${i}-${url}`, preview: url, file: null })),
  };
}

export function EditBusinessForm({ business, categories }: { business: BusinessDetail; categories: CategoryOption[] }) {
  const router = useRouter();
  const [data, setData] = useState<FormState>(() => toFormState(business));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  function patch(update: Partial<FormState>) {
    setData((prev) => ({ ...prev, ...update }));
  }

  function addPhoto(file: File | undefined) {
    if (!file) return;
    setData((prev) => ({
      ...prev,
      photos: [...prev.photos, { id: crypto.randomUUID(), preview: URL.createObjectURL(file), file }],
    }));
  }

  function removePhoto(id: string) {
    setData((prev) => ({ ...prev, photos: prev.photos.filter((p) => p.id !== id) }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const coverImageUrl = data.coverImageFile
      ? await uploadImage("business-covers", data.coverImageFile)
      : data.coverImagePreview;

    const imageUrls = (
      await Promise.all(data.photos.map((p) => (p.file ? uploadImage("business-photos", p.file) : Promise.resolve(p.preview))))
    ).filter((url): url is string => Boolean(url));

    const result = await updateBusiness(business.id, {
      name: data.name,
      categoryId: data.categoryId,
      description: data.description,
      phone: data.phone,
      website: data.website,
      priceRange: data.price,
      waitTime: data.waitTime,
      cityArea: data.cityArea,
      operatingHours: data.operatingHours,
      amenities: data.amenities,
      businessAddress: data.businessAddress,
      coverImageUrl,
      imageUrls,
    });

    setSubmitting(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }

    router.push(`/businesses/${business.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="rounded-2xl bg-white p-6 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.04)] sm:p-8">
        <p className="mb-6 text-sm font-medium text-[#060606]">Business Info</p>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
          <div className="flex flex-col gap-6">
            <FormField
              id="edit-name"
              label="Business name"
              value={data.name}
              onChange={(e) => patch({ name: e.target.value })}
            />
            <SelectField
              id="edit-category"
              label="Category"
              value={data.categoryId}
              onChange={(e) => patch({ categoryId: e.target.value })}
              options={[
                { value: "", label: categories.length === 0 ? "No categories found" : "Select a category" },
                ...categories.map((c) => ({ value: c.id, label: c.title })),
              ]}
            />
            <TextareaField
              id="edit-description"
              label="Description"
              value={data.description}
              onChange={(e) => patch({ description: e.target.value })}
            />
          </div>

          <ImageUploadBox
            label="Cover Image ( Image Banner )"
            placeholder={data.name || "Cover image preview"}
            preview={data.coverImagePreview}
            onChange={(file, preview) => patch({ coverImageFile: file, coverImagePreview: preview })}
          />
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.04)] sm:p-8">
        <p className="mb-6 text-sm font-medium text-[#060606]">Details</p>
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 lg:grid-cols-2">
          <FormField id="edit-phone" label="Phone Number" value={data.phone} onChange={(e) => patch({ phone: e.target.value })} />
          <FormField id="edit-wait-time" label="Wait Time" value={data.waitTime} onChange={(e) => patch({ waitTime: e.target.value })} />
          <FormField id="edit-city-area" label="City/Area" value={data.cityArea} onChange={(e) => patch({ cityArea: e.target.value })} />
          <FormField id="edit-website" label="Website" value={data.website} onChange={(e) => patch({ website: e.target.value })} />
          <FormField
            id="edit-operating-hours"
            label="Operating Hours"
            value={data.operatingHours}
            onChange={(e) => patch({ operatingHours: e.target.value })}
          />
          <SelectField id="edit-price" label="Price" options={PRICE_OPTIONS} value={data.price} onChange={(e) => patch({ price: e.target.value })} />
          <TextareaField
            id="edit-amenities"
            label="Amenities ( eg. swimming pool, breakfast in bed, etc )"
            rows={4}
            value={data.amenities}
            onChange={(e) => patch({ amenities: e.target.value })}
          />
          <FormField
            id="edit-address"
            label="Business Address"
            value={data.businessAddress}
            onChange={(e) => patch({ businessAddress: e.target.value })}
          />
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.04)] sm:p-8">
        <p className="mb-1 text-sm font-medium text-[#060606]">Photos</p>
        <p className="mb-4 text-xs text-[#939393]">Interior, exterior, products etc.</p>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {data.photos.map((photo) => (
            <div key={photo.id} className="group relative aspect-square overflow-hidden rounded-xl bg-[#f7f7f8]">
              {/* eslint-disable-next-line @next/next/no-img-element -- mix of remote Supabase URLs and local blob previews */}
              <img src={photo.preview} alt="" className="size-full object-cover" />
              <button
                type="button"
                onClick={() => removePhoto(photo.id)}
                aria-label="Remove photo"
                className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              addPhoto(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => photoInputRef.current?.click()}
            className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-[#c9c9cb] text-xs font-medium text-[#939393] hover:border-brand-red hover:text-brand-red"
          >
            <Plus size={18} />
            Add
          </button>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        {error && (
          <span className="flex items-center gap-1.5 text-sm font-medium text-brand-red">
            <TriangleAlert size={16} />
            {error}
          </span>
        )}
        <button
          type="button"
          onClick={() => router.push(`/businesses/${business.id}`)}
          className="rounded-xl border border-[#ececed] bg-white px-6 py-3 text-sm font-medium text-[#060606]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-2 rounded-xl bg-brand-red px-6 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting && <Loader2 size={16} className="animate-spin" />}
          {submitting ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
