'use client';

import { cn } from '@/lib/utils';

interface DataCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: string;
}

function DataCard({ label, value, subtext, icon }: DataCardProps) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 transition-colors hover:bg-[var(--color-card-hover)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-[var(--color-muted)] uppercase tracking-wider">{label}</p>
          <p className="mt-1 text-2xl font-bold tracking-tight">{value}</p>
          {subtext && (
            <p className="mt-0.5 text-xs text-[var(--color-muted)]">{subtext}</p>
          )}
        </div>
        {icon && <span className="text-xl">{icon}</span>}
      </div>
    </div>
  );
}

interface DataCardsProps {
  cards: DataCardProps[];
  className?: string;
}

export default function DataCards({ cards, className }: DataCardsProps) {
  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4', className)}>
      {cards.map((card, i) => (
        <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
          <DataCard {...card} />
        </div>
      ))}
    </div>
  );
}
