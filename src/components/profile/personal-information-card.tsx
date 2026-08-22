export interface PersonalInfo {
  fullName: string;
  email: string;
  role: string;
  location: string;
}

export function PersonalInformationCard({ info }: { info: PersonalInfo }) {
  const rows: { label: string; value: string }[] = [
    { label: "Full Name", value: info.fullName },
    { label: "Email", value: info.email },
    { label: "Role", value: info.role },
    { label: "Location", value: info.location },
  ];

  return (
    <div className="rounded-2xl bg-white p-6 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.04)]">
      <p className="mb-5 text-sm font-medium text-[#060606]">Personal Information</p>
      <div className="grid grid-cols-1 gap-x-12 gap-y-5 sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label}>
            <p className="mb-1 text-xs text-[#939393]">{row.label}</p>
            <p className="text-sm font-medium text-[#060606]">{row.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
