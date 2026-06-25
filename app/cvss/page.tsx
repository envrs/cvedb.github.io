'use client';

import { useEffect, useState, useMemo } from 'react';
import DataCards from '@/components/DataCards';
import InsightCards from '@/components/InsightCards';
import { CVSSDistribution } from '@/components/Charts';
import { loadCvssAnalysis } from '@/lib/data';
import { formatNumber } from '@/lib/utils';
import type { CvssAnalysis } from '@/lib/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
  Cell,
} from 'recharts';

export default function CvssPage() {
  const [data, setData] = useState<CvssAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [temporalVersions, setTemporalVersions] = useState<Set<string>>(new Set(['v2.0', 'v3.0', 'v3.1', 'v4.0']));

  useEffect(() => {
    loadCvssAnalysis()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const versionAdoption = useMemo(() => {
    if (!data) return [];
    return Object.entries(data.total_by_version).map(([version, count]) => ({
      version,
      count,
    }));
  }, [data]);

  const temporalData = useMemo(() => {
    if (!data) return [];
    const years = new Set<string>();
    for (const [, yearData] of Object.entries(data.temporal_data)) {
      for (const year of Object.keys(yearData)) {
        years.add(year);
      }
    }
    return Array.from(years)
      .sort((a, b) => parseInt(a) - parseInt(b))
      .map((year) => {
        const entry: Record<string, string | number> = { year };
        for (const [version, yearData] of Object.entries(data.temporal_data)) {
          entry[version] = yearData[year] || 0;
        }
        return entry;
      });
  }, [data]);

  const toggleVersion = (v: string) => {
    setTemporalVersions((prev) => {
      const next = new Set(prev);
      if (next.has(v)) next.delete(v);
      else next.add(v);
      return next;
    });
  };

  const VERSION_COLORS: Record<string, string> = {
    'v2.0': '#3b82f6',
    'v3.0': '#10b981',
    'v3.1': '#f59e0b',
    'v4.0': '#ef4444',
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

  if (!data) {
    return <p className="text-[var(--color-muted)]">Failed to load CVSS data.</p>;
  }

  const calcAvg = (version: string) => {
    const dist = data.score_distribution[version];
    if (!dist) return 'N/A';
    let totalScore = 0;
    let totalCount = 0;
    for (const [score, count] of Object.entries(dist)) {
      totalScore += parseFloat(score) * count;
      totalCount += count;
    }
    return totalCount > 0 ? (totalScore / totalCount).toFixed(2) : 'N/A';
  };

  const cards = [
    { label: 'CVEs with CVSS', value: formatNumber(data.total_cves_with_cvss), icon: '📊', subtext: 'Total scored vulnerabilities' },
    { label: 'CVSS v3.1 Avg', value: calcAvg('v3.1'), icon: '🎯', subtext: `${formatNumber(data.total_by_version['v3.1'])} CVEs` },
    { label: 'CVSS v4.0 Avg', value: calcAvg('v4.0'), icon: '🆕', subtext: `${formatNumber(data.total_by_version['v4.0'])} CVEs` },
    { label: 'CVSS v2.0 Avg', value: calcAvg('v2.0'), icon: '📐', subtext: `${formatNumber(data.total_by_version['v2.0'])} CVEs` },
  ];

  const insights = [
    { icon: '📊', title: 'CVSS Coverage', text: `${formatNumber(data.total_cves_with_cvss)} CVEs (${((data.total_cves_with_cvss / 340144) * 100).toFixed(1)}%) have CVSS scores.` },
    { icon: '📈', title: 'Version Adoption', text: `CVSS v3.1 dominates with ${formatNumber(data.total_by_version['v3.1'])} scored CVEs (${((data.total_by_version['v3.1'] / data.total_cves_with_cvss) * 100).toFixed(0)}%).` },
    { icon: '🆕', title: 'CVSS v4.0', text: `${formatNumber(data.total_by_version['v4.0'])} CVEs scored with the latest CVSS v4.0 standard.` },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">CVSS Intelligence Dashboard</h1>
        <p className="text-sm text-[var(--color-muted)] mt-1">
          Common Vulnerability Scoring System — Data & Trends
        </p>
      </div>

      <DataCards cards={cards} />

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
        <CVSSDistribution data={data} />
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">CVSS Version Trends Over Time</h2>
          <div className="flex gap-2 flex-wrap">
            {Object.keys(VERSION_COLORS).map((v) => (
              <button
                key={v}
                onClick={() => toggleVersion(v)}
                className={`rounded-md px-2 py-0.5 text-xs font-medium transition-all ${
                  temporalVersions.has(v)
                    ? 'bg-[var(--color-card-hover)] text-[var(--color-foreground)] border border-[var(--color-accent)]'
                    : 'bg-[var(--color-card)] text-[var(--color-muted)] border border-[var(--color-border)] opacity-50'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={temporalData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="year" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#1e293b' }} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={formatNumber} />
            <Tooltip
              contentStyle={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '13px' }}
              formatter={(value: number) => [formatNumber(value), 'CVEs']}
            />
            <Legend />
            {temporalVersions.has('v2.0') && (
              <Line type="monotone" dataKey="v2.0" stroke={VERSION_COLORS['v2.0']} strokeWidth={2} dot={false} />
            )}
            {temporalVersions.has('v3.0') && (
              <Line type="monotone" dataKey="v3.0" stroke={VERSION_COLORS['v3.0']} strokeWidth={2} dot={false} />
            )}
            {temporalVersions.has('v3.1') && (
              <Line type="monotone" dataKey="v3.1" stroke={VERSION_COLORS['v3.1']} strokeWidth={2} dot={false} />
            )}
            {temporalVersions.has('v4.0') && (
              <Line type="monotone" dataKey="v4.0" stroke={VERSION_COLORS['v4.0']} strokeWidth={2} dot={false} />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
        <h2 className="text-lg font-semibold mb-4">CVSS Version Adoption</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={versionAdoption} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="version" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#1e293b' }} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={formatNumber} />
            <Tooltip
              contentStyle={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '13px' }}
              formatter={(value: number) => [formatNumber(value), 'CVEs']}
            />
            <Bar dataKey="count" radius={[3, 3, 0, 0]} maxBarSize={60}>
              {versionAdoption.map((entry, idx) => (
                <Cell key={idx} fill={VERSION_COLORS[entry.version] || '#3b82f6'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <InsightCards insights={insights} />
    </div>
  );
}
