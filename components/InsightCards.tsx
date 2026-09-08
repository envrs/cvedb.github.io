'use client';

interface InsightCardsProps {
  insights: { icon: string; title: string; text: string }[];
}

export default function InsightCards({ insights }: InsightCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {insights.map((item, i) => (
        <div
          key={i}
          className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 animate-fade-in"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="flex items-start gap-3">
            <span className="text-xl">{item.icon}</span>
            <div>
              <p className="text-sm font-semibold">{item.title}</p>
              <p className="text-xs text-[var(--color-muted)] mt-1">{item.text}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
