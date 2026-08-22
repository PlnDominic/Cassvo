"use client";

import { useMemo, useState } from "react";
import { UserTabs, type UserTab } from "./user-tabs";
import { UsersTable } from "./users-table";
import type { UserRow } from "./types";

export function UsersBoard({ users: initialUsers }: { users: UserRow[] }) {
  const [tab, setTab] = useState<UserTab>("all");
  const [users, setUsers] = useState(initialUsers);

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

  return (
    <div className="flex flex-col gap-4">
      <UserTabs active={tab} onChange={setTab} counts={counts} />
      <UsersTable users={filtered} onSuspend={suspendUser} />
    </div>
  );
}
