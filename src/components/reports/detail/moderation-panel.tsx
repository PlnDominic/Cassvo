"use client";

import { useState } from "react";
import { AlertTriangle, ChevronDown } from "lucide-react";
import type { ReportDetailData } from "./types";

export function ModerationPanel({
  report,
  moderators,
  initialNotes,
}: {
  report: ReportDetailData;
  reportId: string;
  moderators: string[];
  initialNotes: string;
}) {
  const [notes, setNotes] = useState(initialNotes);
  const [moderator, setModerator] = useState(moderators[0] ?? "");

  return (
    <div className="flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.04)]">
      <div>
        <h3 className="mb-1 text-sm font-medium text-[#060606]">Moderation Panel</h3>
        <p className="mb-4 text-xs text-[#939393]">Current Recommendation</p>
        <div className="flex gap-3 rounded-xl border border-brand-red/30 bg-brand-red/5 p-4">
          <AlertTriangle size={20} className="mt-0.5 shrink-0 text-brand-red" />
          <div>
            <p className="text-sm font-medium text-[#060606]">{report.recommendationTitle}</p>
            <p className="mt-1 text-xs text-[#606060]">{report.recommendationText}</p>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="investigation-notes" className="mb-2 block text-sm font-medium text-[#060606]">
          Notes
        </label>
        <textarea
          id="investigation-notes"
          rows={4}
          placeholder="Add investigation notes..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full resize-none rounded-xl border border-[#ececed] bg-white px-4 py-3 text-sm font-medium text-[#060606] placeholder:text-[#939393] focus:border-brand-red focus:outline-none"
        />
        <p className="mt-2 text-xs text-[#939393]">These notes are internal and not visible to users</p>
      </div>

      <div>
        <label htmlFor="assign-moderator" className="mb-2 block text-sm font-medium text-[#060606]">
          Assign Moderator
        </label>
        <div className="relative">
          <select
            id="assign-moderator"
            value={moderator}
            onChange={(e) => setModerator(e.target.value)}
            className="h-[52px] w-full appearance-none rounded-xl border border-[#ececed] bg-white px-4 pr-10 text-sm font-medium text-[#060606] focus:border-brand-red focus:outline-none"
          >
            {moderators.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#939393]" />
        </div>
      </div>
    </div>
  );
}
