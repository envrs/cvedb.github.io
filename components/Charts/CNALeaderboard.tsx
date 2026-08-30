'use client';

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
import type { CnaEntry } from '@/lib/types';
import { formatNumber } from '@/lib/utils';

const COLORS = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe'];

interface CNALeaderboardProps {
  data: CnaEntry[];
  topN?: number;
  height?: number;
}

export default function CNALeaderboard({ data, topN = 15, height = 350 }: CNALeaderboardProps) {
  const top = [...data]
    .sort((a, b) => b.count - a.count)
    .slice(0, topN);

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-[var(--color-muted)]">
        Top {topN} CNAs by CVE Volume
      </p>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={top}
          layout="vertical"
          margin={{ top: 4, right: 16, left: 4, bottom: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fill: '#64748b', fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: '#1e293b' }}
            tickFormatter={formatNumber}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: '#64748b', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={140}
          />
          <Tooltip
            contentStyle={{
              background: '#111827',
              border: '1px solid #1e293b',
              borderRadius: '8px',
              fontSize: '13px',
            }}
            labelStyle={{ color: '#e2e8f0', fontWeight: 600 }}
            formatter={(value: number) => [formatNumber(value), 'CVEs Assigned']}
          />
          <Bar dataKey="count" radius={[0, 3, 3, 0]} maxBarSize={20}>
            {top.map((_, idx) => (
              <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
