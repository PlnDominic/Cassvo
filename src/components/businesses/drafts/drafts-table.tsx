import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { ProgressBar } from "./progress-bar";
import { DraftStatusBadge } from "./draft-status-badge";
import type { BusinessDraft } from "./types";

export function DraftsTable({ drafts, onDelete }: { drafts: BusinessDraft[]; onDelete: (id: string) => void }) {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-[6px_6px_54px_0px_rgba(0,0,0,0.04)]">
      <table className="w-full min-w-[760px] text-sm">
        <thead>
          <tr className="border-b border-[#ececed] text-left text-sm text-[#060606]">
            <th className="px-6 py-4 font-medium">Business</th>
            <th className="px-6 py-4 font-medium">Progress</th>
            <th className="px-6 py-4 font-medium">Last Updated</th>
            <th className="px-6 py-4 font-medium">Status</th>
            <th className="px-6 py-4 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {drafts.map((draft) => (
            <tr key={draft.id} className="border-b border-[#ececed] last:border-b-0">
              <td className="px-6 py-4 font-medium text-[#060606]">{draft.name}</td>
              <td className="px-6 py-4">
                <ProgressBar percent={draft.progress} />
              </td>
              <td className="px-6 py-4 text-[#606060]">{draft.lastUpdated}</td>
              <td className="px-6 py-4">
                <DraftStatusBadge status={draft.status} />
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <Link href="/businesses/new" aria-label={`Continue editing ${draft.name}`} className="text-[#060606] hover:text-brand-red">
                    <Pencil size={16} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => onDelete(draft.id)}
                    aria-label={`Delete ${draft.name} draft`}
                    className="text-brand-red hover:text-brand-red/70"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {drafts.length === 0 && (
            <tr>
              <td colSpan={5} className="px-6 py-10 text-center text-sm text-[#939393]">
                No drafts in this queue.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
