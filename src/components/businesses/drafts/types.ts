export type DraftStatus = "in-progress" | "pending-verification" | "incomplete";

export interface BusinessDraft {
  id: string;
  name: string;
  progress: number;
  lastUpdated: string;
  status: DraftStatus;
}
