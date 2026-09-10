import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { WelcomeBanner } from "@/components/business-profile/welcome-banner";
import { InfoBar } from "@/components/business-profile/info-bar";
import { BusinessHero } from "@/components/business-profile/business-hero";
import { ProfileTabs } from "@/components/business-profile/profile-tabs";
import { OverviewTab } from "@/components/business-profile/overview-tab";
import { PhotosTab } from "@/components/business-profile/photos-tab";
import { BusinessInfoTab } from "@/components/business-profile/business-info-tab";
import { ReportsTab } from "@/components/business-profile/reports-tab";
import { getBusiness } from "@/lib/data/businesses";
import { getBusinessReports } from "@/lib/data/reports";
import { getCurrentAdmin } from "@/lib/data/admins";
import { formatDate, formatNumber } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function BusinessProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [business, admin] = await Promise.all([getBusiness(id), getCurrentAdmin()]);
  if (!business) notFound();

  const reports = await getBusinessReports(id);

  const address = [business.address, business.cityArea].filter(Boolean).join(", ") || "—";

  return (
    <DashboardShell title="Business Profile" backHref="/businesses">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <WelcomeBanner
              name={admin?.name ?? ""}
              initial={admin?.name?.trim().charAt(0).toUpperCase() ?? "?"}
              subtitle="Everything about a registered business"
            />
          </div>
          {admin?.role === "Admin" && (
            <Link
              href={`/businesses/${id}/edit`}
              className="flex shrink-0 items-center gap-2 self-start rounded-xl bg-brand-red px-5 py-2.5 text-sm font-medium text-white sm:self-auto"
            >
              <Pencil size={16} />
              Edit Business
            </Link>
          )}
        </div>

        <InfoBar
          items={[
            { label: "Category", value: business.category },
            { label: "Region", value: business.region ?? "—" },
            { label: "Total Reviews", value: formatNumber(business.reviewCount) },
            {
              label: "Status",
              value: (
                <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                  {business.status === "confirmed" ? "Active Business" : business.status}
                </span>
              ),
            },
          ]}
        />

        <BusinessHero
          business={{
            name: business.name,
            category: business.category,
            location: business.cityArea ?? "—",
            rating: business.rating ?? 0,
            reviewCount: business.reviewCount,
            photoUrl: business.coverImageUrl,
            verified: business.status === "confirmed",
            featured: business.featured,
            socials: [],
          }}
          reviewsHref={`/businesses/${id}/reviews`}
          photosHref={`/businesses/${id}?tab=photos`}
        />

        <InfoBar
          items={[
            { label: "Business Type", value: business.businessType ?? "—" },
            { label: "Phone", value: business.phone ?? "—" },
            { label: "Email", value: business.email ?? "—" },
            { label: "Website", value: business.website ?? "—" },
            { label: "Open Hours", value: business.operatingHours ?? "—" },
          ]}
        />

        <ProfileTabs
          photoCount={business.photos.length}
          reportCount={reports.length}
          overview={
            <OverviewTab
              about={business.description ?? "No description added yet."}
              address={address}
              mapQuery={address}
              amenities={business.amenities}
            />
          }
          photos={<PhotosTab photos={business.photos} />}
          businessInfo={
            <BusinessInfoTab
              info={{
                legalName: business.legalName ?? "—",
                registrationNumber: business.registrationNumber ?? "—",
                category: business.category,
                address: business.address ?? "—",
                city: business.cityArea ?? "—",
                region: business.region ?? "—",
                taxId: business.taxId ?? "—",
                dateRegistered: formatDate(business.dateRegistered),
              }}
            />
          }
          reports={<ReportsTab reports={reports} />}
        />
      </div>
    </DashboardShell>
  );
}
