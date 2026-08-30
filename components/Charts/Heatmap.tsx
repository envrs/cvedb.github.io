'use client';

import { useMemo, useState } from 'react';
import type { CalendarAnalysis } from '@/lib/types';
import { formatNumber } from '@/lib/utils';

interface HeatmapProps {
  data: CalendarAnalysis;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getIntensity(value: number, max: number): string {
  if (max === 0) return 'bg-zinc-900';
  const ratio = value / max;
  if (ratio > 0.8) return 'bg-emerald-400';
  if (ratio > 0.6) return 'bg-emerald-500';
  if (ratio > 0.4) return 'bg-emerald-600';
  if (ratio > 0.2) return 'bg-emerald-700';
  if (ratio > 0.05) return 'bg-emerald-800';
  return 'bg-zinc-800';
}

export default function Heatmap({ data }: HeatmapProps) {
  const [year, setYear] = useState(data.statistics.current_year.year);

  const years = useMemo(() => {
    const start = parseInt(data.statistics.date_range.start.split('-')[0]);
    const end = parseInt(data.statistics.date_range.end.split('-')[0]);
    const y: number[] = [];
    for (let i = end; i >= start; i--) y.push(i);
    return y;
  }, [data]);

  const yearData = useMemo(() => {
    return data.daily_data.filter((d) => d.date.startsWith(String(year)));
  }, [data, year]);

  const maxVal = useMemo(
    () => Math.max(...yearData.map((d) => d.value), 1),
    [yearData]
  );

  const monthlyData = useMemo(() => {
    const months: { month: number; total: number; days: number; max: number }[] = [];
    for (let m = 0; m < 12; m++) {
      const days = yearData.filter((d) => {
        const month = parseInt(d.date.split('-')[1]);
        return month === m + 1;
      });
      months.push({
        month: m,
        total: days.reduce((s, d) => s + d.value, 0),
        days: days.length,
        max: Math.max(...days.map((d) => d.value), 0),
      });
    }
    return months;
  }, [yearData]);

  const weeks = useMemo(() => {
    const result: { week: number; days: { date: string; value: number }[] }[] = [];
    const sorted = [...yearData].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    if (sorted.length === 0) return result;

    const firstDate = new Date(sorted[0].date);
    const startDayOfWeek = firstDate.getDay();

    let currentWeek: { date: string; value: number }[] = [];
    let weekIndex = 0;

    for (let i = 0; i < startDayOfWeek; i++) {
      currentWeek.push({ date: '', value: 0 });
    }

    for (const day of sorted) {
      const d = new Date(day.date);
      if (d.getDay() === 0 && currentWeek.length > startDayOfWeek ? true : currentWeek.length > 7) {
        result.push({ week: weekIndex++, days: currentWeek });
        currentWeek = [];
      }
      currentWeek.push({ date: day.date, value: day.value });
    }
    if (currentWeek.length > 0) {
      result.push({ week: weekIndex, days: currentWeek });
    }
    return result;
  }, [yearData]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <select
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          className="rounded-md border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-1 text-sm text-[var(--color-foreground)]"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2 text-xs text-[var(--color-muted)] ml-auto">
          <span>Less</span>
          <div className="flex gap-0.5">
            {['bg-zinc-800', 'bg-emerald-800', 'bg-emerald-700', 'bg-emerald-600', 'bg-emerald-500', 'bg-emerald-400'].map(
              (c) => (
                <div key={c} className={`h-3 w-3 rounded-sm ${c}`} />
              )
            )}
          </div>
          <span>More</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="overflow-x-auto">
          <div className="flex gap-0.5" style={{ minWidth: 720 }}>
            <div className="flex flex-col gap-0.5 mr-1">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <div key={d} className="h-3 text-[10px] text-[var(--color-muted)] leading-3">
                  {d[0]}
                </div>
              ))}
            </div>
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-0.5">
                {week.days.map((day, di) => (
                  <div
                    key={di}
                    className={`h-3 w-3 rounded-sm ${day.value > 0 ? getIntensity(day.value, maxVal) : 'bg-zinc-900'}`}
                    title={day.date ? `${day.date}: ${formatNumber(day.value)} CVEs` : ''}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-[var(--color-muted)]">Monthly Summary</p>
          <div className="space-y-1">
            {monthlyData.map((m) => (
              <div key={m.month} className="flex items-center gap-3">
                <span className="text-xs text-[var(--color-muted)] w-8">{MONTHS[m.month]}</span>
                <div className="flex-1 h-4 rounded bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full rounded bg-[var(--color-accent)] transition-all"
                    style={{ width: `${(m.total / Math.max(...monthlyData.map((x) => x.total), 1)) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-[var(--color-muted)] w-20 text-right">
                  {formatNumber(m.total)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
