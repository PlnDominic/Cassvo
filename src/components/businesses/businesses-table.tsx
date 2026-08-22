import Link from "next/link";
import { VerificationBadge, BusinessStatusBadge } from "./status-badges";
import { RowActionsMenu } from "../ui/row-actions-menu";
import type { Business, BusinessStatus } from "./types";

export function BusinessesTable({
  businesses,
  onSetStatus,
}: {
  businesses: Business[];
  onSetStatus: (id: string, status: BusinessStatus) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-[6px_6px_54px_0px_rgba(0,0,0,0.04)]">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="border-b border-[#ececed] text-left text-sm text-[#060606]">
            <th className="px-6 py-4 font-medium">Business name</th>
            <th className="px-6 py-4 font-medium">Category</th>
            <th className="px-6 py-4 font-medium">Verification</th>
            <th className="px-6 py-4 font-medium">Reviews</th>
            <th className="px-6 py-4 font-medium">Status</th>
            <th className="px-6 py-4 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {businesses.map((business) => (
            <tr key={business.id} className="border-b border-[#ececed] last:border-b-0">
              <td className="px-6 py-4 font-medium text-[#060606]">
                <Link href={`/businesses/${business.id}`} className="hover:text-brand-red">
                  {business.name}
                </Link>
              </td>
              <td className="px-6 py-4 text-[#606060]">{business.category}</td>
              <td className="px-6 py-4">
                <VerificationBadge status={business.status} />
              </td>
              <td className="px-6 py-4 text-[#606060]">
                {business.reviews !== null ? business.reviews.toLocaleString() : "–"}
              </td>
              <td className="px-6 py-4">
                <BusinessStatusBadge status={business.status} />
              </td>
              <td className="px-6 py-4">
                <RowActionsMenu
                  label={`Actions for ${business.name}`}
                  actions={[
                    { label: "View profile", href: `/businesses/${business.id}` },
                    { label: "View reviews", href: `/businesses/${business.id}/reviews` },
                    ...(business.status === "confirmed"
                      ? [{ label: "Suspend", danger: true, onSelect: () => onSetStatus(business.id, "suspended") }]
                      : [{ label: "Approve", onSelect: () => onSetStatus(business.id, "confirmed") }]),
                  ]}
                />
              </td>
            </tr>
          ))}
          {businesses.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-10 text-center text-sm text-[#939393]">
                No businesses in this queue.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
