import { notFound, redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { WelcomeBanner } from "@/components/business-profile/welcome-banner";
import { EditBusinessForm } from "@/components/businesses/edit/edit-business-form";
import { getBusiness } from "@/lib/data/businesses";
import { getCategories } from "@/lib/data/categories";
import { getCurrentAdmin } from "@/lib/data/admins";

export const dynamic = "force-dynamic";

/**
 * Admin-only, same posture as updateBusiness() itself (and as Add
 * Business) — a moderator landing here directly would just hit
 * updateBusiness()'s own rejection on submit, but redirecting up front
 * is more honest than showing a form that can't actually save.
 */
export default async function EditBusinessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [business, categories, admin] = await Promise.all([getBusiness(id), getCategories(), getCurrentAdmin()]);

  if (!business) notFound();
  if (admin?.role !== "Admin") redirect(`/businesses/${id}`);

  return (
    <DashboardShell title="Edit Business" backHref={`/businesses/${id}`}>
      <div className="flex flex-col gap-6">
        <WelcomeBanner
          name={admin.name}
          initial={admin.name.trim().charAt(0).toUpperCase() || "?"}
          subtitle={`Editing ${business.name}`}
          greeting="Hi,"
        />
        <EditBusinessForm business={business} categories={categories} />
      </div>
    </DashboardShell>
  );
}
