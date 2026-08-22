"use client";

import { useState } from "react";
import { downloadCsv } from "@/lib/download-csv";
import type { LoginActivityRow } from "./types";

export function ProfileActions({ loginActivity }: { loginActivity: LoginActivityRow[] }) {
  const [message, setMessage] = useState<string | null>(null);

  function handleSignOutOthers() {
    setMessage("Signed out of all other devices");
    window.setTimeout(() => setMessage(null), 2500);
  }

  function handleDownload() {
    downloadCsv(
      "login-history.csv",
      ["Device", "Browser", "Location", "Time", "Status"],
      loginActivity.map((row) => [
        row.device,
        row.browser,
        row.location,
        row.time,
        row.status === "active" ? "Active Now" : "Successful",
      ])
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-3">
      {message && <span className="mr-auto text-sm font-medium text-emerald-600">{message}</span>}
      <button
        type="button"
        onClick={handleSignOutOthers}
        className="rounded-xl border border-[#ececed] bg-white px-6 py-3 text-sm font-medium text-[#060606]"
      >
        Sign Out other Devices
      </button>
      <button
        type="button"
        onClick={handleDownload}
        className="rounded-xl bg-brand-red px-6 py-3 text-sm font-medium text-white"
      >
        Download Login History
      </button>
    </div>
  );
}
