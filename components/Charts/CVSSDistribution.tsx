'use client';

import { useState } from 'react';
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
import type { CvssAnalysis } from '@/lib/types';
import { formatNumber } from '@/lib/utils';
import { cn } from '@/lib/utils';

const versions = ['v2.0', 'v3.0', 'v3.1', 'v4.0'];
const SEVERITY_COLORS: Record<string, string> = {
  NONE: '#22d3ee',
  LOW: '#22c55e',
  MEDIUM: '#eab308',
  HIGH: '#f97316',
  CRITICAL: '#ef4444',
};

interface CVSSDistributionProps {
  data: CvssAnalysis;
}

export default function CVSSDistribution({ data }: CVSSDistributionProps) {
  const [version, setVersion] = useState('v3.1');

  const severityData = Object.entries(data.severity_distribution[version] || {}).map(
    ([name, value]) => ({ name, value })
  );

  const scoreData = Object.entries(data.score_distribution[version] || {})
    .map(([score, count]) => ({ score: parseFloat(score), count }))
    .sort((a, b) => a.score - b.score);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {versions.map((v) => (
          <button
            key={v}
            onClick={() => setVersion(v)}
            className={cn(
              'rounded-md px-3 py-1 text-xs font-medium transition-all',
              version === v
                ? 'bg-[var(--color-accent)] text-white'
                : 'bg-[var(--color-card)] text-[var(--color-muted)] border border-[var(--color-border)] hover:border-[var(--color-accent)]'
            )}
          >
            {v}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <p className="text-sm font-medium mb-2 text-[var(--color-muted)]">Severity Distribution</p>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={severityData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {severityData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={SEVERITY_COLORS[entry.name] || '#64748b'}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: '#111827',
                  border: '1px solid #1e293b',
                  borderRadius: '8px',
                  fontSize: '13px',
                }}
                formatter={(value: number) => [formatNumber(value), 'CVEs']}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div>
          <p className="text-sm font-medium mb-2 text-[var(--color-muted)]">Score Distribution</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={scoreData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="score"
                tick={{ fill: '#64748b', fontSize: 10 }}
                tickLine={false}
                axisLine={{ stroke: '#1e293b' }}
              />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatNumber}
              />
              <Tooltip
                contentStyle={{
                  background: '#111827',
                  border: '1px solid #1e293b',
                  borderRadius: '8px',
                  fontSize: '13px',
                }}
                labelStyle={{ color: '#e2e8f0' }}
                formatter={(value: number) => [formatNumber(value), 'CVEs']}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
