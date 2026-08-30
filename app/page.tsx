'use client';

import { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import DataCards from '@/components/DataCards';
import InsightCards from '@/components/InsightCards';
import { YearlyTrends } from '@/components/Charts';
import { loadCveAll } from '@/lib/data';
import { formatNumber } from '@/lib/utils';
import type { CveAll } from '@/lib/types';

export default function Home() {
  const [data, setData] = useState<CveAll | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCveAll()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-[var(--color-card)] rounded animate-pulse-slow" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-[var(--color-card)] rounded-xl animate-pulse-slow" />
          ))}
        </div>
        <div className="h-80 bg-[var(--color-card)] rounded-xl animate-pulse-slow" />
      </div>
    );
  }

  if (!data) {
    return <p className="text-[var(--color-muted)]">Failed to load data.</p>;
  }

  const cards = [
    { label: 'Total CVEs', value: formatNumber(data.total_cves), icon: '📊', subtext: `Across ${data.years_covered} years` },
    { label: 'Current Year', value: formatNumber(data.current_year_cves), icon: '📅', subtext: `${data.current_year} YTD` },
    { label: 'Peak Year', value: String(data.peak_year), icon: '🚀', subtext: `${formatNumber(data.peak_count)} CVEs` },
    { label: 'YoY Growth', value: `${data.yoy_growth_rate.toFixed(1)}%`, icon: '📈', subtext: data.yoy_growth_rate >= 0 ? 'Positive growth' : 'Decline' },
  ];

  const insights = [
    { icon: '📊', title: 'Total Coverage', text: `${formatNumber(data.total_cves)} CVEs published across ${data.years_covered} years (1999-${data.current_year}).` },
    { icon: '📈', title: 'Annual Growth', text: data.yoy_growth_rate >= 0
        ? `Year-over-year growth of ${data.yoy_growth_rate.toFixed(1)}% in ${data.current_year}.`
        : `Year-over-year decline of ${Math.abs(data.yoy_growth_rate).toFixed(1)}% in ${data.current_year}.` },
    { icon: '🏆', title: 'Peak Activity', text: `${data.peak_year} was the most active year with ${formatNumber(data.peak_count)} CVEs published.` },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">CVE Database Dashboard</h1>
        <p className="text-sm text-[var(--color-muted)] mt-1">
          Global Vulnerability Analytics & Trends
        </p>
      </div>

      <DataCards cards={cards} />

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-[var(--color-accent)]" />
          <h2 className="text-lg font-semibold">CVEs by Year</h2>
        </div>
        <YearlyTrends data={data.yearly_trend} />
      </div>

      <InsightCards insights={insights} />

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Navigation</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { href: '/cna', label: 'CNA Intelligence', icon: '🏆' },
            { href: '/calendar', label: 'Calendar Analysis', icon: '📅' },
            { href: '/growth', label: 'Growth Trends', icon: '📈' },
            { href: '/about', label: 'About', icon: 'ℹ️' },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-3 text-sm font-medium transition-colors hover:bg-[var(--color-card-hover)] hover:border-[var(--color-accent)]"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
