"use client";

import { useMemo, useState } from "react";
import { UserTabs, type UserTab } from "./user-tabs";
import { UsersTable } from "./users-table";
import type { UserRow } from "./types";

export function UsersBoard({ users }: { users: UserRow[] }) {
  const [tab, setTab] = useState<UserTab>("all");

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

  return (
    <div className="flex flex-col gap-4">
      <UserTabs active={tab} onChange={setTab} counts={counts} />
      <UsersTable users={filtered} />
    </div>
  );
}
