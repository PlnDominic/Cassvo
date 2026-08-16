import { FormField } from "./form-field";
import { ImageUploadBox } from "./image-upload-box";
import type { OnboardBusinessData } from "./types";

export function VerificationStep({
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
          id="legal-name"
          label="Legal Business Name"
          placeholder="Sunset Restaurant Ventures Ltd."
          value={data.legalName}
          onChange={(e) => onChange({ legalName: e.target.value })}
        />
        <FormField
          id="registration-number"
          label="Registration Number"
          placeholder="BN-2021-884213"
          value={data.registrationNumber}
          onChange={(e) => onChange({ registrationNumber: e.target.value })}
        />
        <FormField
          id="tax-id"
          label="Tax ID"
          placeholder="TIN-C0119284X"
          value={data.taxId}
          onChange={(e) => onChange({ taxId: e.target.value })}
        />
        <FormField
          id="date-registered"
          label="Date Registered"
          placeholder="1st July, 2021"
          value={data.dateRegistered}
          onChange={(e) => onChange({ dateRegistered: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-6">
        <ImageUploadBox
          label="Registration Document"
          placeholder="Upload registration certificate"
          preview={data.verificationDocPreview}
          onChange={(preview) => onChange({ verificationDocPreview: preview })}
        />
      </div>
    </div>
  );
}
