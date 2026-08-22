export function PermissionAccessCard({ permissions }: { permissions: string[] }) {
  const mid = Math.ceil(permissions.length / 2);
  const columns = [permissions.slice(0, mid), permissions.slice(mid)];

  return (
    <div className="flex-1 rounded-2xl bg-white p-6 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.04)]">
      <p className="mb-4 text-sm font-medium text-[#060606]">Permission &amp; Access</p>
      <p className="mb-2 text-xs text-[#939393]">Permissions</p>
      {permissions.length === 0 && <p className="text-sm text-[#939393]">No permissions assigned.</p>}
      <div className="grid grid-cols-2 gap-x-8 gap-y-2">
        {columns.map((column, i) => (
          <div key={i} className="flex flex-col gap-2">
            {column.map((permission) => (
              <p key={permission} className="text-sm font-medium text-[#060606]">
                {permission}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
