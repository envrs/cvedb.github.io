'use client';

import { useEffect, useState, useMemo } from 'react';
import DataCards from '@/components/DataCards';
import InsightCards from '@/components/InsightCards';
import { CNALeaderboard } from '@/components/Charts';
import { loadCnaAnalysis } from '@/lib/data';
import { formatNumber } from '@/lib/utils';
import type { CnaAnalysis } from '@/lib/types';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PIE_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'];

export default function CnaPage() {
  const [analysis, setAnalysis] = useState<CnaAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<'count' | 'years_active'>('count');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const perPage = 25;

  useEffect(() => {
    loadCnaAnalysis().then(setAnalysis).finally(() => setLoading(false));
  }, []);

  const typeChartData = useMemo(() => {
    if (!analysis) return [];
    return analysis.type_distribution.sorted_types.map(([name, value]) => ({
      name,
      value,
    }));
  }, [analysis]);

  const filteredCnas = useMemo(() => {
    if (!analysis) return [];
    let list = [...analysis.cna_list];
    if (search) {
      list = list.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    list.sort((a, b) => {
      const mul = sortDir === 'desc' ? -1 : 1;
      return (a[sortField] - b[sortField]) * mul;
    });
    return list;
  }, [analysis, search, sortField, sortDir]);

  const paginated = filteredCnas.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filteredCnas.length / perPage);

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

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

  if (!analysis) {
    return <p className="text-[var(--color-muted)]">Failed to load CNA data.</p>;
  }

  const cards = [
    { label: 'Total CNAs', value: formatNumber(analysis.total_cnas), icon: '🏢', subtext: `${analysis.active_cnas} active` },
    { label: 'Active CNAs', value: formatNumber(analysis.active_cnas), icon: '✅', subtext: `${analysis.inactive_cnas} inactive` },
    { label: 'High-Volume CNAs', value: formatNumber(analysis.high_volume_cnas), icon: '🚀', subtext: '1000+ CVEs each' },
    { label: 'Market Concentration', value: `${analysis.market_concentration}%`, icon: '📊', subtext: 'Top 5 CNA share' },
  ];

  const insights = [
    { icon: '🏆', title: 'Top CNA', text: `${analysis.cna_list[0]?.name || 'N/A'} leads with ${formatNumber(analysis.cna_list[0]?.count || 0)} CVEs assigned.` },
    { icon: '📊', title: 'Activity Status', text: `${((analysis.active_cnas / analysis.total_cnas) * 100).toFixed(1)}% of CNAs are currently active.` },
    { icon: '📈', title: 'Median Lifespan', text: `Typical CNA remains active for ${analysis.median_years_active} years.` },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">CNA Intelligence Dashboard</h1>
        <p className="text-sm text-[var(--color-muted)] mt-1">
          CVE Numbering Authorities — Performance Metrics & Rankings
        </p>
      </div>

      <DataCards cards={cards} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
          <CNALeaderboard data={analysis.cna_list} />
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
          <p className="text-sm font-medium text-[var(--color-muted)] mb-4">CNA Type Distribution</p>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={typeChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {typeChartData.map((_, idx) => (
                  <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: '#111827',
                  border: '1px solid #1e293b',
                  borderRadius: '8px',
                  fontSize: '13px',
                }}
                formatter={(value: number) => [formatNumber(value), 'CNAs']}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <InsightCards insights={insights} />

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <h2 className="text-lg font-semibold">CNA Directory</h2>
          <input
            type="text"
            placeholder="Search CNAs..."
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
                <th className="text-left py-2 px-2 text-[var(--color-muted)] font-medium">Name</th>
                <th
                  className="text-right py-2 px-2 text-[var(--color-muted)] font-medium cursor-pointer hover:text-[var(--color-foreground)]"
                  onClick={() => toggleSort('count')}
                >
                  CVEs {sortField === 'count' ? (sortDir === 'desc' ? '▼' : '▲') : ''}
                </th>
                <th
                  className="text-right py-2 px-2 text-[var(--color-muted)] font-medium cursor-pointer hover:text-[var(--color-foreground)]"
                  onClick={() => toggleSort('years_active')}
                >
                  Years {sortField === 'years_active' ? (sortDir === 'desc' ? '▼' : '▲') : ''}
                </th>
                <th className="text-right py-2 px-2 text-[var(--color-muted)] font-medium">Last CVE</th>
                <th className="text-center py-2 px-2 text-[var(--color-muted)] font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((cna, i) => (
                <tr
                  key={cna.org_id}
                  className="border-b border-[var(--color-border)] hover:bg-[var(--color-card-hover)] transition-colors"
                >
                  <td className="py-2 px-2 text-[var(--color-muted)]">{(page - 1) * perPage + i + 1}</td>
                  <td className="py-2 px-2 font-medium">{cna.name}</td>
                  <td className="py-2 px-2 text-right">{formatNumber(cna.count)}</td>
                  <td className="py-2 px-2 text-right">{cna.years_active}</td>
                  <td className="py-2 px-2 text-right text-[var(--color-muted)] text-xs">{cna.last_cve_date}</td>
                  <td className="py-2 px-2 text-center">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                        cna.activity_status === 'Active'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-zinc-500/10 text-zinc-400'
                      }`}
                    >
                      {cna.activity_status}
                    </span>
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
            <span className="text-xs text-[var(--color-muted)]">
              {page} / {totalPages}
            </span>
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
