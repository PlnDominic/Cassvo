import { DashboardShell } from "@/components/layout/dashboard-shell";
import { WelcomeBanner } from "@/components/business-profile/welcome-banner";
import { StatCard } from "@/components/dashboard/stat-card";
import { BusinessesBoard } from "@/components/businesses/businesses-board";
import type { Business } from "@/components/businesses/types";
import skyLounge from "../../../public/images/dashboard/photo-sky-lounge.png";
import photoBusiness1 from "../../../public/images/dashboard/photo-business-1.png";
import photoBusiness2 from "../../../public/images/dashboard/photo-business-2.png";

const businesses: Business[] = [
  { id: "kikibees", name: "KikiBees", category: "Food & Dining", reviews: 7400, status: "confirmed", photo: photoBusiness1 },
  { id: "sky-lounge", name: "Sky Lounge", category: "NightLife", reviews: 2033, status: "pending", photo: skyLounge },
  { id: "bill-different", name: "Bill different", category: "NightLife", reviews: null, status: "pending", photo: photoBusiness2 },
  { id: "coco-lounge", name: "Coco lounge", category: "NightLife", reviews: 490, status: "confirmed", photo: skyLounge },
  { id: "afrochella-hair-studio", name: "Afrochella Hair Studio", category: "Beauty & Fashion", reviews: 3760, status: "pending", photo: photoBusiness1 },
  { id: "lilys-catering-services", name: "Lilys Catering Services", category: "Event Vendors", reviews: 600, status: "confirmed", photo: photoBusiness2 },
  { id: "volta-vibes-lounge", name: "Volta Vibes Lounge", category: "NightLife", reviews: 85, status: "suspended", photo: skyLounge },
];

export default function BusinessesPage() {
  return (
    <DashboardShell title="Businesses">
      <div className="flex flex-col gap-6">
        <WelcomeBanner name="Angela. A" initial="A" subtitle="Here is everything about reviews" greeting="Hi," />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Onboarded Businesses" value="40,689" trend={{ type: "up", text: "8.5% Up from yesterday" }} iconColor="green" />
          <StatCard label="Premium Businesses" value="40,689" trend={{ type: "up", text: "8.5% Up from yesterday" }} />
          <StatCard label="Suspended Businesses" value="40,689" trend={{ type: "up", text: "8.5% Up from yesterday" }} />
          <StatCard label="Under Review" value="40,689" trend={{ type: "up", text: "8.5% Up from yesterday" }} />
        </div>

        <BusinessesBoard businesses={businesses} initialFeaturedIds={["sky-lounge"]} />
      </div>
    </DashboardShell>
  );
}
