'use client';

import { useEffect, useState, useMemo } from 'react';
import DataCards from '@/components/DataCards';
import InsightCards from '@/components/InsightCards';
import { loadCweAnalysis } from '@/lib/data';
import { formatNumber } from '@/lib/utils';
import type { CweAnalysis } from '@/lib/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts';

const BAR_COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4'];

export default function CwePage() {
  const [data, setData] = useState<CweAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 25;

  useEffect(() => {
    loadCweAnalysis()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!data) return [];
    let list = [...data.top_cwes];
    if (search) {
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.id.includes(search)
      );
    }
    return list;
  }, [data, search]);

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

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
    return <p className="text-[var(--color-muted)]">Failed to load CWE data.</p>;
  }

  const topCwe = data.top_cwes[0];
  const top5Total = data.top_cwes.slice(0, 5).reduce((s, c) => s + c.count, 0);
  const total = data.total_cves_with_cwe;
  const top5Share = total > 0 ? ((top5Total / total) * 100).toFixed(1) : '0';

  const cards = [
    { label: 'Unique CWEs', value: formatNumber(data.total_unique_cwes), icon: '🔍', subtext: 'Weakness types' },
    { label: 'CVEs with CWE', value: formatNumber(data.total_cves_with_cwe), icon: '📊', subtext: 'Classified vulnerabilities' },
    { label: 'Most Common', value: topCwe?.name.split(':')[1]?.trim() || 'N/A', icon: '🎯', subtext: `${formatNumber(topCwe?.count || 0)} CVEs` },
    { label: 'Top 5 Share', value: `${top5Share}%`, icon: '🏆', subtext: 'Combined dominance' },
  ];

  const top15 = data.top_cwes.slice(0, 15).map((c) => ({
    ...c,
    shortName: c.name.length > 50 ? c.name.substring(0, 50) + '...' : c.name,
  }));

  const insights = [
    { icon: '🎯', title: 'Most Critical', text: `${topCwe?.name || 'N/A'} is the most prevalent weakness with ${formatNumber(topCwe?.count || 0)} occurrences.` },
    { icon: '📈', title: 'CWE Coverage', text: `${formatNumber(data.total_cves_with_cwe)} CVEs (${((data.total_cves_with_cwe / 340144) * 100).toFixed(1)}%) are classified with CWEs.` },
    { icon: '📊', title: 'Concentration', text: `Top 5 CWEs account for ${top5Share}% of all classified vulnerabilities.` },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">CWE Intelligence Dashboard</h1>
        <p className="text-sm text-[var(--color-muted)] mt-1">
          Common Weakness Enumeration — Data & Trends
        </p>
      </div>

      <DataCards cards={cards} />

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
        <p className="text-sm font-medium text-[var(--color-muted)] mb-4">Top Common Weakness Enumerations</p>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={top15}
            layout="vertical"
            margin={{ top: 4, right: 16, left: 4, bottom: 4 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fill: '#64748b', fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: '#1e293b' }}
              tickFormatter={formatNumber}
            />
            <YAxis
              type="category"
              dataKey="shortName"
              tick={{ fill: '#64748b', fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              width={220}
            />
            <Tooltip
              contentStyle={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '13px' }}
              labelStyle={{ color: '#e2e8f0', fontWeight: 600 }}
              formatter={(value: number) => [formatNumber(value), 'CVEs']}
            />
            <Bar dataKey="count" radius={[0, 3, 3, 0]} maxBarSize={16}>
              {top15.map((_, idx) => (
                <Cell key={idx} fill={BAR_COLORS[idx % BAR_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <InsightCards insights={insights} />

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <h2 className="text-lg font-semibold">Detailed CWE Analysis</h2>
          <input
            type="text"
            placeholder="Search CWEs..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-1.5 text-sm w-full sm:w-64"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left py-2 px-2 text-[var(--color-muted)] font-medium">Rank</th>
                <th className="text-left py-2 px-2 text-[var(--color-muted)] font-medium">CWE ID</th>
                <th className="text-left py-2 px-2 text-[var(--color-muted)] font-medium">Description</th>
                <th className="text-right py-2 px-2 text-[var(--color-muted)] font-medium">CVE Count</th>
                <th className="text-right py-2 px-2 text-[var(--color-muted)] font-medium">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((cwe, i) => (
                <tr key={cwe.id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-card-hover)] transition-colors">
                  <td className="py-2 px-2 text-[var(--color-muted)]">{(page - 1) * perPage + i + 1}</td>
                  <td className="py-2 px-2 font-mono text-xs">CWE-{cwe.id}</td>
                  <td className="py-2 px-2 max-w-md truncate">{cwe.name}</td>
                  <td className="py-2 px-2 text-right">{formatNumber(cwe.count)}</td>
                  <td className="py-2 px-2 text-right text-[var(--color-muted)]">
                    {total > 0 ? ((cwe.count / total) * 100).toFixed(1) : '0'}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-md px-3 py-1 text-xs border border-[var(--color-border)] disabled:opacity-40"
            >
              Prev
            </button>
            <span className="text-xs text-[var(--color-muted)]">{page} / {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-md px-3 py-1 text-xs border border-[var(--color-border)] disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
