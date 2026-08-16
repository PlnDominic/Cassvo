import { FileText, CheckCircle2, Trash2 } from "lucide-react";
import type { VerificationDocument } from "./types";

export function DocumentList({
  documents,
  onRemove,
}: {
  documents: VerificationDocument[];
  onRemove?: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      {documents.map((doc) => (
        <div key={doc.id} className="flex items-center gap-3 rounded-xl border border-[#ececed] bg-white p-4">
          <FileText size={20} className="shrink-0 text-brand-red" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-[#060606]">{doc.title}</p>
            <p className="truncate text-xs text-[#939393]">{doc.filename}</p>
            <p className="text-xs text-[#939393]">{doc.meta}</p>
          </div>
          <CheckCircle2 size={20} className="shrink-0 fill-emerald-500 text-white" />
          {onRemove && (
            <button
              type="button"
              onClick={() => onRemove(doc.id)}
              aria-label={`Remove ${doc.title}`}
              className="shrink-0 text-[#939393] hover:text-brand-red"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      ))}
      {documents.length === 0 && (
        <p className="rounded-xl border border-dashed border-[#ececed] p-4 text-center text-sm text-[#939393]">
          No documents uploaded yet.
        </p>
      )}
    </div>
  );
}
