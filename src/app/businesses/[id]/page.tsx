import { DashboardShell } from "@/components/layout/dashboard-shell";
import { WelcomeBanner } from "@/components/business-profile/welcome-banner";
import { InfoBar } from "@/components/business-profile/info-bar";
import { BusinessHero, type BusinessHeroData } from "@/components/business-profile/business-hero";
import { ProfileTabs } from "@/components/business-profile/profile-tabs";
import { OverviewTab } from "@/components/business-profile/overview-tab";
import { PhotosTab } from "@/components/business-profile/photos-tab";
import { BusinessInfoTab, type BusinessInfoData } from "@/components/business-profile/business-info-tab";
import { ReportsTab, type Report } from "@/components/business-profile/reports-tab";
import { Avatar } from "@/components/dashboard/avatar";
import skyLounge from "../../../../public/images/dashboard/photo-sky-lounge.png";
import photoBusiness1 from "../../../../public/images/dashboard/photo-business-1.png";
import photoBusiness2 from "../../../../public/images/dashboard/photo-business-2.png";

const business: BusinessHeroData = {
  name: "Sky Lounge",
  category: "NightLife",
  location: "East Legon, Accra",
  rating: 4.8,
  reviewCount: 128,
  photo: skyLounge,
  verified: true,
  featured: true,
  socials: ["IG", "FB", "X"],
};

const owner = { name: "Kwame D.", lastActive: "2mins ago" };

const contactInfo = [
  { label: "Business Type", value: "Lounge & Bar" },
  { label: "Phone", value: "+233 20 125 4567" },
  { label: "Email", value: "info@skylounge.com" },
  { label: "Website", value: "www.skylounge.com" },
  { label: "Open Hours", value: "5:00 PM – 2:00 AM" },
];

const about =
  "Sky Lounge is a sophisticated lounge in the Greater Accra region of Ghana. Specifically located at Osu. We are known for or excellence in customer service, clean environments and …";

const businessInfoData: BusinessInfoData = {
  legalName: "Sky Lounge Ventures Ltd.",
  registrationNumber: "BN-2021-884213",
  category: "Lounge & Bar",
  address: "12 Lagos Ave, Osu",
  city: "Accra",
  region: "Greater Accra",
  taxId: "TIN-C0119284X",
  dateRegistered: "1st July, 2021",
};

const reports: Report[] = [
  { reporter: "Ella M", reason: "Suspicious review activity", date: "2 days ago", status: "Pending" },
  { reporter: "Kwame D.", reason: "Incorrect opening hours", date: "5 days ago", status: "Resolved" },
  { reporter: "Angela A.", reason: "Duplicate listing", date: "1 week ago", status: "Dismissed" },
  { reporter: "Abena K.", reason: "Outdated contact information", date: "2 weeks ago", status: "Resolved" },
];

export default async function BusinessProfilePage({ params }: { params: Promise<{ id: string }> }) {
  await params;

  return (
    <DashboardShell title="Business Profile" backHref="/businesses">
      <div className="flex flex-col gap-6">
        <WelcomeBanner name="Angela. A" initial="A" subtitle="Everything about a registered business" />

        <InfoBar
          items={[
            {
              label: "Business Owner",
              value: (
                <div className="flex items-center gap-2">
                  <Avatar name={owner.name} size={32} />
                  <span>
                    {owner.name} <span className="font-normal text-[#939393]">{owner.lastActive}</span>
                  </span>
                </div>
              ),
            },
            { label: "Member Since", value: "1st July" },
            { label: "Total Reviews", value: "564" },
            {
              label: "Status",
              value: (
                <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                  Active Business
                </span>
              ),
            },
          ]}
        />

        <BusinessHero business={business} reviewsHref="/review-moderation" />

        <InfoBar items={contactInfo} />

        <ProfileTabs
          overview={<OverviewTab about={about} />}
          photos={<PhotosTab photos={[skyLounge, photoBusiness1, photoBusiness2, skyLounge, photoBusiness1, photoBusiness2]} />}
          businessInfo={<BusinessInfoTab info={businessInfoData} />}
          reports={<ReportsTab reports={reports} />}
        />
      </div>
    </DashboardShell>
  );
}
