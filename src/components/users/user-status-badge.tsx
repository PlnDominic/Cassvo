import { Badge } from "../ui/badge";

export function UserStatusBadge({ verified }: { verified: boolean }) {
  return <Badge variant={verified ? "green" : "red"}>{verified ? "Verified" : "Unverified"}</Badge>;
}
