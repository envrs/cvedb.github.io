'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import type { YearlyTrend } from '@/lib/types';
import { formatNumber } from '@/lib/utils';

interface YearlyTrendsProps {
  data: YearlyTrend[];
  height?: number;
}

export default function YearlyTrends({ data, height = 350 }: YearlyTrendsProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
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
          labelStyle={{ color: '#e2e8f0', fontWeight: 600 }}
          formatter={(value: number) => [formatNumber(value), 'CVEs']}
        />
        <Bar dataKey="count" fill="#3b82f6" radius={[3, 3, 0, 0]} maxBarSize={40} />
      </BarChart>
    </ResponsiveContainer>
  );
}
