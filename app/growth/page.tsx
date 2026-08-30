'use client';

import { useEffect, useState } from 'react';
import DataCards from '@/components/DataCards';
import InsightCards from '@/components/InsightCards';
import { GrowthChart } from '@/components/Charts';
import { loadGrowthAnalysis } from '@/lib/data';
import { formatNumber } from '@/lib/utils';
import type { GrowthAnalysis } from '@/lib/types';

export default function GrowthPage() {
  const [data, setData] = useState<GrowthAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGrowthAnalysis()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-[var(--color-card)] rounded animate-pulse-slow" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-[var(--color-card)] rounded-xl animate-pulse-slow" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return <p className="text-[var(--color-muted)]">Failed to load growth data.</p>;
  }

  const latest = data.growth_data[data.growth_data.length - 1];
  const totalCves = data.growth_data.reduce((s, d) => s + d.cves, 0);

  const cards = [
    { label: 'Total CVEs', value: formatNumber(totalCves), icon: '📊', subtext: 'All time' },
    { label: 'Avg Annual Growth', value: `${data.avg_annual_growth.toFixed(1)}%`, icon: '📈', subtext: 'Year over year' },
    { label: 'Peak Growth Year', value: String(data.highest_growth_year.year), icon: '🚀', subtext: `${data.highest_growth_year.rate.toFixed(1)}% growth` },
    { label: `YTD ${latest?.year || ''}`, value: formatNumber(latest?.cves || 0), icon: '📅', subtext: latest?.is_ytd ? 'Year to date' : 'Complete year' },
  ];

  const insights = [
    { icon: '📈', title: 'Highest Growth', text: `${data.highest_growth_year.year} saw the highest growth rate of ${data.highest_growth_year.rate.toFixed(1)}%.` },
    { icon: '📉', title: 'Lowest Growth', text: `${data.lowest_growth_year.year} saw the lowest growth rate of ${data.lowest_growth_year.rate.toFixed(1)}%.` },
    { icon: '📊', title: 'Long-term Trend', text: `Average annual growth rate of ${data.avg_annual_growth.toFixed(1)}% across all years.` },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Growth Intelligence Dashboard</h1>
        <p className="text-sm text-[var(--color-muted)] mt-1">
          CVE Publication & Growth Trends Over Time
        </p>
      </div>

      <DataCards cards={cards} />

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
        <GrowthChart data={data} />
      </div>

      <InsightCards insights={insights} />

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
        <h2 className="text-lg font-semibold mb-4">Year-over-Year Growth Data</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left py-2 px-2 text-[var(--color-muted)] font-medium">Year</th>
                <th className="text-right py-2 px-2 text-[var(--color-muted)] font-medium">Total CVEs</th>
                <th className="text-right py-2 px-2 text-[var(--color-muted)] font-medium">Growth Rate</th>
                <th className="text-right py-2 px-2 text-[var(--color-muted)] font-medium">Absolute Change</th>
                <th className="text-right py-2 px-2 text-[var(--color-muted)] font-medium">3-Year Avg</th>
              </tr>
            </thead>
            <tbody>
              {[...data.growth_data].reverse().map((d) => (
                <tr
                  key={d.year}
                  className="border-b border-[var(--color-border)] hover:bg-[var(--color-card-hover)] transition-colors"
                >
                  <td className="py-2 px-2 font-medium">{d.year}</td>
                  <td className="py-2 px-2 text-right">{formatNumber(d.cves)}</td>
                  <td className={`py-2 px-2 text-right ${d.growth_rate >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {d.growth_rate.toFixed(1)}%
                  </td>
                  <td className={`py-2 px-2 text-right ${d.growth_absolute >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {d.growth_absolute >= 0 ? '+' : ''}{formatNumber(d.growth_absolute)}
                  </td>
                  <td className="py-2 px-2 text-right text-[var(--color-muted)]">
                    {d.growth_rate_3yr_avg.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
