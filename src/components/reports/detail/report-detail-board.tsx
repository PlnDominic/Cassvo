"use client";

import { useState } from "react";
import { ReportActionsToolbar } from "./report-actions-toolbar";
import { ReportSummaryBar } from "./report-summary-bar";
import { ReportMetaRow } from "./report-meta-row";
import { EvidenceCard } from "./evidence-card";
import { UploadedEvidenceCard } from "./uploaded-evidence-card";
import { ModerationPanel } from "./moderation-panel";
import type { ReportDetailData } from "./types";
import type { ReportStatus } from "../types";

export function ReportDetailBoard({ report: initialReport }: { report: ReportDetailData }) {
  const [report, setReport] = useState(initialReport);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  function updateStatus(status: ReportStatus, message: string) {
    setReport((prev) => ({ ...prev, status }));
    setActionMessage(message);
    window.setTimeout(() => setActionMessage(null), 2500);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <ReportActionsToolbar
          onResolve={() => updateStatus("resolved", "Marked as resolved")}
          onRemoveReview={() => updateStatus("resolved", "Review removed")}
          onRequestMoreReview={() => updateStatus("investigating", "Requested more review")}
          onSuspendUser={() => setActionMessage("User suspended")}
        />
        {actionMessage && <p className="text-sm font-medium text-emerald-600">{actionMessage}</p>}
      </div>

      <ReportSummaryBar report={report} />
      <ReportMetaRow report={report} />

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <EvidenceCard report={report} />
          <UploadedEvidenceCard images={report.images} />
        </div>
        <ModerationPanel report={report} />
      </div>
    </div>
  );
}
