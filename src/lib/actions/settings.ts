"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { PlatformSettings, SettingsSectionKey } from "@/lib/settings-schema";

export interface ActionResult {
  ok: boolean;
  message: string;
}

const NOT_CONFIGURED: ActionResult = {
  ok: false,
  message: "Supabase is not configured yet — changes cannot be saved.",
};

/** Persists one section of the platform settings row. */
export async function savePlatformSettings<K extends SettingsSectionKey>(
  section: K,
  values: PlatformSettings[K],
): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return NOT_CONFIGURED;

  const { error } = await supabase
    .from("platform_settings")
    .update({ [section]: values, updated_at: new Date().toISOString() })
    .eq("id", true);

  if (error) {
    console.error("savePlatformSettings:", error.message);
    return { ok: false, message: error.message };
  }

  revalidatePath("/settings");
  return { ok: true, message: "Saved" };
}

// ---------------------------------------------------------------- admins

export async function inviteAdmin(input: {
  fullName: string;
  email: string;
  role: string;
  permissions: string[];
}): Promise<ActionResult> {
  const fullName = input.fullName.trim();
  const email = input.email.trim().toLowerCase();

  if (!fullName) return { ok: false, message: "Full name is required." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, message: "Enter a valid email address." };
  if (!input.role) return { ok: false, message: "Select a role." };

  const supabase = await createClient();
  if (!supabase) return NOT_CONFIGURED;

  const { error } = await supabase.from("admin_users").insert({
    full_name: fullName,
    email,
    role: input.role,
    permissions: input.permissions,
    active: false,
    invite_pending: true,
  });

  if (error) {
    console.error("inviteAdmin:", error.message);
    const message = error.code === "23505" ? "An admin with that email already exists." : error.message;
    return { ok: false, message };
  }

  revalidatePath("/settings");
  return { ok: true, message: `Invite sent to ${email}` };
}

export async function removeAdmin(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return NOT_CONFIGURED;

  const { error } = await supabase.from("admin_users").delete().eq("id", id);

  if (error) {
    console.error("removeAdmin:", error.message);
    return { ok: false, message: error.message };
  }

  revalidatePath("/settings");
  return { ok: true, message: "Admin removed" };
}

export async function updateAdminRole(id: string, role: string): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return NOT_CONFIGURED;

  const { error } = await supabase.from("admin_users").update({ role }).eq("id", id);

  if (error) {
    console.error("updateAdminRole:", error.message);
    return { ok: false, message: error.message };
  }

  revalidatePath("/settings");
  return { ok: true, message: "Role updated" };
}

export async function setAdminActive(id: string, active: boolean): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return NOT_CONFIGURED;

  const { error } = await supabase.from("admin_users").update({ active }).eq("id", id);

  if (error) {
    console.error("setAdminActive:", error.message);
    return { ok: false, message: error.message };
  }

  revalidatePath("/settings");
  return { ok: true, message: active ? "Admin activated" : "Admin deactivated" };
}

// ---------------------------------------------------------------- sessions

/** Ends one recorded admin session. */
export async function revokeSession(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return NOT_CONFIGURED;

  const { error } = await supabase.from("login_activity").delete().eq("id", id);

  if (error) {
    console.error("revokeSession:", error.message);
    return { ok: false, message: error.message };
  }

  revalidatePath("/settings");
  return { ok: true, message: "Session revoked" };
}
