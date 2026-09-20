"use client";

import { useMemo, useState, useTransition } from "react";
import { Check, TriangleAlert } from "lucide-react";
import { UserTabs, type UserTab } from "./user-tabs";
import { UsersTable } from "./users-table";
import { deleteUser } from "@/lib/actions/users";
import type { ActionResult } from "@/lib/actions/settings";
import type { UserRow } from "./types";

export function UsersBoard({ users: initialUsers }: { users: UserRow[] }) {
  const [tab, setTab] = useState<UserTab>("all");
  const [users, setUsers] = useState(initialUsers);
  const [result, setResult] = useState<ActionResult | null>(null);
  const [, startTransition] = useTransition();

  const counts = useMemo(
    () => ({
      all: users.length,
      active: users.filter((u) => u.category === "active").length,
      warned: users.filter((u) => u.category === "warned").length,
      suspended: users.filter((u) => u.category === "suspended").length,
      guest: users.filter((u) => u.category === "guest").length,
    }),
    [users]
  );

  const filtered = tab === "all" ? users : users.filter((u) => u.category === tab);

  function suspendUser(id: string) {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, category: "suspended", verified: false } : u)));
  }

  function announce(outcome: ActionResult) {
    setResult(outcome);
    if (outcome.ok) window.setTimeout(() => setResult(null), 3000);
  }

  function handleDelete(id: string) {
    const previous = users;
    setUsers((prev) => prev.filter((u) => u.id !== id));
    startTransition(async () => {
      const outcome = await deleteUser(id);
      if (!outcome.ok) setUsers(previous);
      announce(outcome);
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <UserTabs active={tab} onChange={setTab} counts={counts} />
      {result && (
        <span
          className={`flex items-center gap-1.5 text-sm font-medium ${result.ok ? "text-emerald-600" : "text-brand-red"}`}
        >
          {result.ok ? <Check size={16} /> : <TriangleAlert size={16} />}
          {result.message}
        </span>
      )}
      <UsersTable users={filtered} onSuspend={suspendUser} onDelete={handleDelete} />
    </div>
  );
}
