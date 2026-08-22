import { WelcomeBanner } from "@/components/business-profile/welcome-banner";
import { getCurrentAdmin } from "@/lib/data/admins";

/**
 * WelcomeBanner bound to the signed-in admin, so pages never hardcode a name.
 * Client components that need it (settings, onboarding) take `adminName` as a
 * prop instead, since their subtitle changes with local state.
 */
export async function AdminWelcomeBanner({
  subtitle,
  greeting,
}: {
  subtitle: string;
  greeting?: string;
}) {
  const admin = await getCurrentAdmin();
  const name = admin?.name ?? "";

  return (
    <WelcomeBanner
      name={name}
      initial={admin?.name?.trim().charAt(0).toUpperCase() ?? "?"}
      subtitle={subtitle}
      greeting={greeting}
    />
  );
}
