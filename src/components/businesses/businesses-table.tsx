import { MoreHorizontal } from "lucide-react";
import { VerificationBadge, BusinessStatusBadge } from "./status-badges";
import type { Business } from "./types";

export function BusinessesTable({ businesses }: { businesses: Business[] }) {
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
              <td className="px-6 py-4 font-medium text-[#060606]">{business.name}</td>
              <td className="px-6 py-4 text-[#606060]">{business.category}</td>
              <td className="px-6 py-4">
                <VerificationBadge status={business.status} />
              </td>
              <td className="px-6 py-4 text-[#606060]">{business.reviews !== null ? business.reviews.toLocaleString() : "–"}</td>
              <td className="px-6 py-4">
                <BusinessStatusBadge status={business.status} />
              </td>
              <td className="px-6 py-4">
                <button type="button" aria-label="Business actions" className="text-[#939393] hover:text-[#060606]">
                  <MoreHorizontal size={18} />
                </button>
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
