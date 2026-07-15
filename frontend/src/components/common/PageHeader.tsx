import type { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: PageHeaderProps) {
  return (
    <div className="border-b border-black/[0.06] bg-white">
      <div className="page-container py-10 md:py-14">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl md:text-5xl">
              {title}
            </h1>
            {description && (
              <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">
                {description}
              </p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      </div>
    </div>
  );
}
