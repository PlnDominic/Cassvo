import { DashboardShell } from "@/components/layout/dashboard-shell";
import { WelcomeBanner } from "@/components/business-profile/welcome-banner";
import { DraftsBoard } from "@/components/businesses/drafts/drafts-board";
import type { BusinessDraft } from "@/components/businesses/drafts/types";

const drafts: BusinessDraft[] = [
  { id: "kikibees", name: "KikiBees", progress: 50, lastUpdated: "Today, 10:30 am", status: "in-progress" },
  { id: "sky-lounge", name: "Sky Lounge", progress: 25, lastUpdated: "Today, 02:50 pm", status: "in-progress" },
  { id: "bill-different", name: "Bill different", progress: 75, lastUpdated: "Yesterday, 05:43 pm", status: "pending-verification" },
  { id: "coco-lounge", name: "Coco lounge", progress: 50, lastUpdated: "May 11th, 12:00 am", status: "in-progress" },
  { id: "afrochella-hair-studio", name: "Afrochella Hair Studio", progress: 0, lastUpdated: "May 31st, 09:46 pm", status: "incomplete" },
  { id: "lilys-catering-services", name: "Lilys Catering Services", progress: 25, lastUpdated: "May 20th, 03:15 pm", status: "in-progress" },
];

export default function BusinessDraftsPage() {
  return (
    <DashboardShell title="Businesses">
      <div className="flex flex-col gap-6">
        <WelcomeBanner name="Angela. A" initial="A" subtitle="Continue or manage your saved onboarding draft" greeting="Hi," />
        <DraftsBoard drafts={drafts} />
      </div>
    </DashboardShell>
  );
}
