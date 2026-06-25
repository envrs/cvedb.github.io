'use client';

import { useEffect, useState } from 'react';
import DataCards from '@/components/DataCards';
import InsightCards from '@/components/InsightCards';
import { loadCpeAnalysis } from '@/lib/data';
import { formatNumber } from '@/lib/utils';
import type { CpeAnalysis } from '@/lib/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const TYPE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function CpePage() {
  const [data, setData] = useState<CpeAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCpeAnalysis()
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
    return <p className="text-[var(--color-muted)]">Failed to load CPE data.</p>;
  }

  const avgCpesPerCve = data.total_cves_with_cpes > 0
    ? (data.total_cpe_entries / data.total_cves_with_cpes).toFixed(1)
    : '0';

  const cards = [
    { label: 'Unique CPEs', value: formatNumber(data.total_unique_cpes), icon: '🔗', subtext: 'Platform identifiers' },
    { label: 'CVEs with CPEs', value: formatNumber(data.total_cves_with_cpes), icon: '📊', subtext: `${avgCpesPerCve} avg per CVE` },
    { label: 'Unique Vendors', value: formatNumber(data.total_unique_vendors), icon: '🏢', subtext: 'Organizations' },
    { label: 'Unique Products', value: formatNumber(data.total_unique_products), icon: '📦', subtext: 'Platforms' },
  ];

  const insights = [
    { icon: '🎯', title: 'Most Targeted', text: `${data.top_cpes[0]?.vendor || 'N/A'} / ${data.top_cpes[0]?.product || 'N/A'} is the most frequently referenced platform.` },
    { icon: '🏢', title: 'Leading Vendor', text: `${data.top_vendors[0]?.vendor || 'N/A'} has the most CPE entries with ${formatNumber(data.top_vendors[0]?.count || 0)}.` },
    { icon: '📊', title: 'Platform Coverage', text: `${formatNumber(data.total_unique_cpes)} unique platforms tracked across ${formatNumber(data.total_unique_vendors)} vendors.` },
  ];

  const topVendors = data.top_vendors.slice(0, 15);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">CPE Analysis Dashboard</h1>
        <p className="text-sm text-[var(--color-muted)] mt-1">
          Common Platform Enumeration — Data & Trends
        </p>
      </div>

      <DataCards cards={cards} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
          <p className="text-sm font-medium text-[var(--color-muted)] mb-4">CPE Type Distribution</p>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.cpe_type_distribution}
                dataKey="count"
                nameKey="type"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
              >
                {data.cpe_type_distribution.map((_, idx) => (
                  <Cell key={idx} fill={TYPE_COLORS[idx % TYPE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '13px' }}
                formatter={(value: number) => [formatNumber(value), 'Entries']}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
          <p className="text-sm font-medium text-[var(--color-muted)] mb-4">Top Vendors by CPE Count</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topVendors} layout="vertical" margin={{ top: 4, right: 16, left: 4, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={{ stroke: '#1e293b' }} tickFormatter={formatNumber} />
              <YAxis type="category" dataKey="vendor" tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} width={100} />
              <Tooltip
                contentStyle={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '13px' }}
                formatter={(value: number) => [formatNumber(value), 'CPEs']}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[0, 3, 3, 0]} maxBarSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <InsightCards insights={insights} />

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
        <h2 className="text-lg font-semibold mb-4">Top CPEs by Frequency</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left py-2 px-2 text-[var(--color-muted)] font-medium">Rank</th>
                <th className="text-left py-2 px-2 text-[var(--color-muted)] font-medium">CPE String</th>
                <th className="text-right py-2 px-2 text-[var(--color-muted)] font-medium">Count</th>
                <th className="text-left py-2 px-2 text-[var(--color-muted)] font-medium">Vendor</th>
                <th className="text-left py-2 px-2 text-[var(--color-muted)] font-medium">Product</th>
                <th className="text-left py-2 px-2 text-[var(--color-muted)] font-medium">Type</th>
              </tr>
            </thead>
            <tbody>
              {data.top_cpes.slice(0, 25).map((cpe, i) => (
                <tr key={cpe.cpe} className="border-b border-[var(--color-border)] hover:bg-[var(--color-card-hover)] transition-colors">
                  <td className="py-2 px-2 text-[var(--color-muted)]">{i + 1}</td>
                  <td className="py-2 px-2 font-mono text-xs max-w-xs truncate">{cpe.cpe}</td>
                  <td className="py-2 px-2 text-right">{formatNumber(cpe.count)}</td>
                  <td className="py-2 px-2">{cpe.vendor}</td>
                  <td className="py-2 px-2">{cpe.product}</td>
                  <td className="py-2 px-2">
                    <span className="rounded-full bg-[var(--color-accent)]/10 px-2 py-0.5 text-xs text-[var(--color-accent)]">
                      {cpe.type}
                    </span>
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
