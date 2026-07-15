import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="surface flex min-h-[280px] flex-col items-center justify-center px-6 py-14 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-lau-light text-lau-green">
        <Icon className="h-6 w-6" />
      </div>
      <h2 className="mt-5 text-xl font-bold text-zinc-950">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-zinc-600">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
