import type { OnboardBusinessData } from "./types";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 text-xs text-[#939393]">{label}</p>
      <p className="text-sm font-medium text-[#060606]">{value || "–"}</p>
    </div>
  );
}

export function ReviewStep({ data }: { data: OnboardBusinessData }) {
  return (
    <div className="flex flex-col gap-8">
      <section>
        <h3 className="mb-4 text-sm font-medium text-[#060606]">Business Info</h3>
        <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Business Name" value={data.name} />
          <Field label="Category" value={data.category} />
          <Field label="Business Type" value={data.businessType} />
          <Field label="Description" value={data.description} />
        </div>
      </section>

      <section className="border-t border-[#ececed] pt-6">
        <h3 className="mb-4 text-sm font-medium text-[#060606]">Details</h3>
        <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Address" value={data.address} />
          <Field label="City" value={data.city} />
          <Field label="Region" value={data.region} />
          <Field label="Phone" value={data.phone} />
          <Field label="Email" value={data.email} />
          <Field label="Website" value={data.website} />
          <Field label="Open Hours" value={data.openHours} />
        </div>
      </section>

      <section className="border-t border-[#ececed] pt-6">
        <h3 className="mb-4 text-sm font-medium text-[#060606]">Verification</h3>
        <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Legal Business Name" value={data.legalName} />
          <Field label="Registration Number" value={data.registrationNumber} />
          <Field label="Tax ID" value={data.taxId} />
          <Field label="Date Registered" value={data.dateRegistered} />
        </div>
      </section>
    </div>
  );
}
