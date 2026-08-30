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
  AreaChart,
  Area,
  Cell,
} from 'recharts';
import type { GrowthAnalysis } from '@/lib/types';
import { formatNumber, formatPercent, cn } from '@/lib/utils';

interface GrowthChartProps {
  data: GrowthAnalysis;
}

export default function GrowthChart({ data }: GrowthChartProps) {
  const [view, setView] = useState<'absolute' | 'rate'>('absolute');

  const chartData = data.growth_data.filter((d) => !d.is_ytd);

  const cumulativeData = chartData.reduce<{ year: number; cumulative: number }[]>(
    (acc, d) => {
      const prev = acc[acc.length - 1]?.cumulative || 0;
      acc.push({ year: d.year, cumulative: prev + d.cves });
      return acc;
    },
    []
  );

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <button
          onClick={() => setView('absolute')}
          className={cn(
            'rounded-md px-3 py-1 text-xs font-medium transition-all',
            view === 'absolute'
              ? 'bg-[var(--color-accent)] text-white'
              : 'bg-[var(--color-card)] text-[var(--color-muted)] border border-[var(--color-border)]'
          )}
        >
          Absolute
        </button>
        <button
          onClick={() => setView('rate')}
          className={cn(
            'rounded-md px-3 py-1 text-xs font-medium transition-all',
            view === 'rate'
              ? 'bg-[var(--color-accent)] text-white'
              : 'bg-[var(--color-card)] text-[var(--color-muted)] border border-[var(--color-border)]'
          )}
        >
          Growth Rate
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <p className="text-sm font-medium mb-2 text-[var(--color-muted)]">
            CVE Growth Trends
          </p>
          <ResponsiveContainer width="100%" height={350}>
            {view === 'absolute' ? (
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  dataKey="year"
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: '#1e293b' }}
                />
                <YAxis
                  tick={{ fill: '#64748b', fontSize: 11 }}
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
                  formatter={(value: number) => [formatNumber(value), 'CVEs']}
                />
                <Bar dataKey="cves" fill="#3b82f6" radius={[3, 3, 0, 0]} maxBarSize={30}>
                  {chartData.map((entry, idx) => (
                    <Cell
                      key={idx}
                      fill={entry.growth_rate >= 0 ? '#3b82f6' : '#ef4444'}
                    />
                  ))}
                </Bar>
              </BarChart>
            ) : (
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  dataKey="year"
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: '#1e293b' }}
                />
                <YAxis
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v: number) => `${v}%`}
                />
                <Tooltip
                  contentStyle={{
                    background: '#111827',
                    border: '1px solid #1e293b',
                    borderRadius: '8px',
                    fontSize: '13px',
                  }}
                  formatter={(value: number) => [formatPercent(value), 'Growth Rate']}
                />
                <Bar dataKey="growth_rate" radius={[3, 3, 0, 0]} maxBarSize={30}>
                  {chartData.map((entry, idx) => (
                    <Cell
                      key={idx}
                      fill={entry.growth_rate >= 0 ? '#10b981' : '#ef4444'}
                    />
                  ))}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        <div>
          <p className="text-sm font-medium mb-2 text-[var(--color-muted)]">
            Cumulative CVE Growth
          </p>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={cumulativeData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="year"
                tick={{ fill: '#64748b', fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: '#1e293b' }}
              />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 11 }}
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
                formatter={(value: number) => [formatNumber(value), 'Total CVEs']}
              />
              <Area
                type="monotone"
                dataKey="cumulative"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.15}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
