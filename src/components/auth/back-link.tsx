import Link from "next/link";
import { BackArrowIcon } from "@/components/icons/back-arrow";

export function BackLink({ href }: { href: string }) {
  return (
    <Link
      href={href}
      aria-label="Go back"
      className="absolute left-6 top-6 text-white sm:left-10 sm:top-10"
    >
      <BackArrowIcon className="h-4 w-4" />
    </Link>
  );
}
