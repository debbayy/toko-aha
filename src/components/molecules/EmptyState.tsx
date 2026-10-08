import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/atoms/Icon";

/**
 * MOLECULE: EmptyState
 * Tampilan saat data kosong. Selalu beri arahan apa yang bisa dilakukan selanjutnya.
 */

type EmptyStateProps = {
  icon: IconName;
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-panel border border-dashed border-line px-6 py-14 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-surface text-ink-muted">
        <Icon name={icon} className="size-6" />
      </span>
      <h2 className="text-base font-bold">{title}</h2>
      <p className="max-w-sm text-sm text-ink-muted">{description}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
