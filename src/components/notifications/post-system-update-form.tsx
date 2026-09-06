"use client";

import { useState, useTransition } from "react";
import { Check, Loader2, Megaphone, TriangleAlert } from "lucide-react";
import { postSystemUpdate } from "@/lib/actions/system-updates";

/**
 * Admin-only (see postSystemUpdate's own caller.role === "admin" check —
 * this component just hides the control from a moderator rather than
 * showing it and letting the server action reject it). Posts a real row
 * to system_updates, which src/lib/data/notifications.ts then reads back
 * as a "systemUpdate"-gated event, same as any other notification kind.
 */
export function PostSystemUpdateForm({ viewerIsAdmin }: { viewerIsAdmin: boolean }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  if (!viewerIsAdmin) return null;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult(null);
    startTransition(async () => {
      const outcome = await postSystemUpdate(title, description);
      setResult(outcome);
      if (outcome.ok) {
        setTitle("");
        setDescription("");
        setOpen(false);
      }
    });
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 self-start rounded-xl border border-[#ececed] bg-white px-4 py-2.5 text-sm font-medium text-[#060606] hover:bg-[#f7f7f8]"
      >
        <Megaphone size={16} />
        Post a System Update
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-2xl border border-[#ececed] bg-white p-4 sm:p-5"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-[#060606]">Post a System Update</p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs font-medium text-[#939393] hover:text-[#060606]"
        >
          Cancel
        </button>
      </div>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title — e.g. Scheduled maintenance completed"
        maxLength={120}
        required
        className="h-11 w-full rounded-xl border border-[#ececed] bg-white px-4 text-sm font-medium text-[#060606] placeholder:text-[#939393] focus:border-brand-red focus:outline-none"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Details (optional)"
        rows={3}
        maxLength={500}
        className="w-full resize-none rounded-xl border border-[#ececed] bg-white px-4 py-3 text-sm text-[#060606] placeholder:text-[#939393] focus:border-brand-red focus:outline-none"
      />

      <div className="flex items-center justify-end gap-3">
        {result && !result.ok && (
          <span className="flex items-center gap-1.5 text-sm font-medium text-brand-red">
            <TriangleAlert size={16} />
            {result.message}
          </span>
        )}
        {result?.ok && (
          <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
            <Check size={16} />
            Posted
          </span>
        )}
        <button
          type="submit"
          disabled={pending || !title.trim()}
          className="flex items-center gap-2 rounded-xl bg-brand-red px-5 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending && <Loader2 size={16} className="animate-spin" />}
          {pending ? "Posting…" : "Post Update"}
        </button>
      </div>
    </form>
  );
}
