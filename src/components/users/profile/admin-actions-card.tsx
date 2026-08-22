"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText } from "lucide-react";

const ITEM_CLASS = "flex items-center gap-2 text-sm font-medium";

export function AdminActionsCard({ userName }: { userName: string }) {
  const [message, setMessage] = useState<string | null>(null);

  function announce(text: string) {
    setMessage(text);
    window.setTimeout(() => setMessage(null), 2500);
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.04)]">
      <h3 className="text-base font-medium text-[#060606]">Admin Actions</h3>
      <div className="flex flex-col gap-4">
        <button type="button" onClick={() => announce(`${userName} suspended`)} className={`${ITEM_CLASS} text-brand-red`}>
          <FileText size={16} className="shrink-0 text-brand-red" />
          Suspend User
        </button>
        <button type="button" onClick={() => announce(`${userName} verified`)} className={`${ITEM_CLASS} text-emerald-600`}>
          <FileText size={16} className="shrink-0 text-brand-red" />
          Verify User
        </button>
        <button type="button" onClick={() => announce(`Warning sent to ${userName}`)} className={`${ITEM_CLASS} text-amber-500`}>
          <FileText size={16} className="shrink-0 text-brand-red" />
          Send Warning
        </button>
        <Link href="/reports" className={`${ITEM_CLASS} text-[#060606]`}>
          <FileText size={16} className="shrink-0 text-brand-red" />
          View Reports
        </Link>
      </div>
      {message && <p className="text-xs font-medium text-emerald-600">{message}</p>}
    </div>
  );
}
