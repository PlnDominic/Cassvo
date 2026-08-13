export interface BusinessInfoData {
  legalName: string;
  registrationNumber: string;
  category: string;
  address: string;
  city: string;
  region: string;
  taxId: string;
  dateRegistered: string;
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 text-xs text-[#939393]">{label}</p>
      <p className="text-sm font-medium text-[#060606]">{value}</p>
    </div>
  );
}

export function BusinessInfoTab({ info }: { info: BusinessInfoData }) {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
      <Field label="Legal Business Name" value={info.legalName} />
      <Field label="Registration Number" value={info.registrationNumber} />
      <Field label="Category" value={info.category} />
      <Field label="Address" value={info.address} />
      <Field label="City" value={info.city} />
      <Field label="Region" value={info.region} />
      <Field label="Tax ID" value={info.taxId} />
      <Field label="Date Registered" value={info.dateRegistered} />
    </div>
  );
}
