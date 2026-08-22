import { CheckCircle2, Trash2, AlertTriangle } from "lucide-react";

interface QuickAction {
  label: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  className: string;
  iconWrapClassName: string;
  onClick: () => void;
}

export function ReportQuickActions({
  onApprove,
  onRemove,
  onEscalate,
}: {
  onApprove: () => void;
  onRemove: () => void;
  onEscalate: () => void;
}) {
  const actions: QuickAction[] = [
    {
      label: "Approve Review",
      description: "This review is genuine and follows guidelines",
      icon: CheckCircle2,
      className: "border-emerald-200 bg-emerald-500 text-white",
      iconWrapClassName: "bg-white/20 text-white",
      onClick: onApprove,
    },
    {
      label: "Remove Review",
      description: "This review violates our guidelines and should be removed",
      icon: Trash2,
      className: "border-brand-red/20 bg-brand-red text-white",
      iconWrapClassName: "bg-white/20 text-white",
      onClick: onRemove,
    },
    {
      label: "Escalate Review",
      description: "Escalate to Senior moderator for additional review",
      icon: AlertTriangle,
      className: "border-amber-300 bg-amber-400 text-white",
      iconWrapClassName: "bg-white/20 text-white",
      onClick: onEscalate,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {actions.map((action) => (
        <button
          key={action.label}
          type="button"
          onClick={action.onClick}
          className={`flex items-start gap-3 rounded-2xl border p-5 text-left transition-transform hover:-translate-y-0.5 ${action.className}`}
        >
          <span className={`flex size-9 shrink-0 items-center justify-center rounded-full ${action.iconWrapClassName}`}>
            <action.icon size={18} />
          </span>
          <div>
            <p className="text-sm font-medium">{action.label}</p>
            <p className="mt-0.5 text-xs text-white/85">{action.description}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
