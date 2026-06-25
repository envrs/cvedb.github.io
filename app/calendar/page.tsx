'use client';

import { useEffect, useState, useMemo } from 'react';
import DataCards from '@/components/DataCards';
import InsightCards from '@/components/InsightCards';
import { Heatmap } from '@/components/Charts';
import { loadCalendarAnalysis } from '@/lib/data';
import { formatNumber } from '@/lib/utils';
import type { CalendarAnalysis } from '@/lib/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';

export default function CalendarPage() {
  const [data, setData] = useState<CalendarAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCalendarAnalysis()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const monthlyPattern = useMemo(() => {
    if (!data) return [];
    const months = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      total: 0,
      days: 0,
    }));

    for (const day of data.daily_data) {
      const m = parseInt(day.date.split('-')[1]) - 1;
      months[m].total += day.value;
      months[m].days += 1;
    }

    return months.map((m) => ({
      name: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][m.month - 1],
      total: m.total,
      avg: m.days > 0 ? Math.round(m.total / m.days) : 0,
    }));
  }, [data]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-56 bg-[var(--color-card)] rounded animate-pulse-slow" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-[var(--color-card)] rounded-xl animate-pulse-slow" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return <p className="text-[var(--color-muted)]">Failed to load calendar data.</p>;
  }

  const stats = data.statistics;
  const cards = [
    { label: 'Total CVEs', value: formatNumber(stats.total_cves), icon: '📊', subtext: `${stats.total_days_with_data} days of data` },
    { label: 'Average Per Day', value: formatNumber(Math.round(stats.daily_stats.average_per_day)), icon: '📈', subtext: 'Daily publication rate' },
    { label: 'Peak Day', value: formatNumber(stats.daily_stats.max_per_day), icon: '🔥', subtext: stats.daily_stats.peak_day.date },
    { label: 'Avg CVSS Score', value: stats.cvss_stats.average_score.toFixed(2), icon: '🎯', subtext: `${formatNumber(stats.cvss_stats.total_with_scores)} scored CVEs` },
  ];

  const insights = [
    { icon: '📅', title: 'Date Range', text: `Data available from ${stats.date_range.start} to ${stats.date_range.end}.` },
    { icon: '📈', title: 'Publication Rate', text: `Average of ${formatNumber(Math.round(stats.daily_stats.average_per_day))} CVEs published per day.` },
    { icon: '📊', title: 'Current Year', text: `${formatNumber(stats.current_year.total_cves)} CVEs in ${stats.current_year.year} across ${stats.current_year.days_with_data} days.` },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Calendar Intelligence Dashboard</h1>
        <p className="text-sm text-[var(--color-muted)] mt-1">
          Daily CVE Publication Patterns & Temporal Analysis
        </p>
      </div>

      <DataCards cards={cards} />

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
        <h2 className="text-lg font-semibold mb-4">Publication Calendar</h2>
        <Heatmap data={data} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
          <p className="text-sm font-medium text-[var(--color-muted)] mb-4">Monthly Publication Patterns</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyPattern} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#1e293b' }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={formatNumber} />
              <Tooltip
                contentStyle={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '13px' }}
                formatter={(value: number) => [formatNumber(value), 'CVEs']}
              />
              <Bar dataKey="total" fill="#3b82f6" radius={[3, 3, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
          <p className="text-sm font-medium text-[var(--color-muted)] mb-4">Average Daily CVEs by Month</p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyPattern} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#1e293b' }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={formatNumber} />
              <Tooltip
                contentStyle={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '13px' }}
                formatter={(value: number) => [formatNumber(value), 'Avg Daily']}
              />
              <Line type="monotone" dataKey="avg" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <InsightCards insights={insights} />
    </div>
  );
}
