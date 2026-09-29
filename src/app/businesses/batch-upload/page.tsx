import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AdminWelcomeBanner } from "@/components/layout/admin-welcome-banner";
import { BatchUploadBoard } from "@/components/businesses/batch-upload/batch-upload-board";
import { getBusinesses } from "@/lib/data/businesses";
import { getCurrentAdmin } from "@/lib/data/admins";

export const dynamic = "force-dynamic";

/** Admin-only, same posture as batchSetBusinessCovers() itself and every other business-write surface. */
export default async function BatchUploadPage() {
  const [businesses, admin] = await Promise.all([getBusinesses(), getCurrentAdmin()]);
  if (admin?.role !== "Admin") redirect("/businesses");

  return (
    <DashboardShell title="Batch Upload Photos" backHref="/businesses">
      <div className="flex flex-col gap-6">
        <AdminWelcomeBanner subtitle="Match photos to businesses by filename and set their cover image all at once" />
        <BatchUploadBoard businesses={businesses.map((b) => ({ id: b.id, name: b.name }))} />
      </div>
    </DashboardShell>
  );
}
