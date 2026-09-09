'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Database, ShieldCheck, TrendingUp } from 'lucide-react';
import DataCards from '@/components/DataCards';
import InsightCards from '@/components/InsightCards';
import { YearlyTrends } from '@/components/Charts';
import { loadCveAll } from '@/lib/data';
import { formatNumber } from '@/lib/utils';
import type { CveAll } from '@/lib/types';

export default function Home() {
  const [data, setData] = useState<CveAll | null>(null);
  useEffect(() => { loadCveAll().then(setData).catch(() => setData(null)); }, []);
  if (!data) return <div className="flex min-h-[60vh] items-center justify-center text-sm text-muted">Loading intelligence layer…</div>;
  const cards = [
    { label: 'Total CVEs', value: formatNumber(data.total_cves), icon: '01', subtext: `Coverage across ${data.years_covered} years` },
    { label: 'Current year', value: formatNumber(data.current_year_cves), icon: '02', subtext: `${data.current_year} year to date` },
    { label: 'Peak year', value: String(data.peak_year), icon: '03', subtext: `${formatNumber(data.peak_count)} records published` },
    { label: 'YoY change', value: `${data.yoy_growth_rate >= 0 ? '+' : ''}${data.yoy_growth_rate.toFixed(1)}%`, icon: '04', subtext: data.yoy_growth_rate >= 0 ? 'Activity accelerating' : 'Activity declining' },
  ];
  const insights = [
    { icon: 'A', title: 'Coverage', text: `${formatNumber(data.total_cves)} vulnerabilities indexed from 1999 through ${data.current_year}.` },
    { icon: 'B', title: 'Momentum', text: `${data.current_year} activity is ${data.yoy_growth_rate >= 0 ? 'up' : 'down'} ${Math.abs(data.yoy_growth_rate).toFixed(1)}% against the previous period.` },
    { icon: 'C', title: 'Peak activity', text: `${data.peak_year} remains the highest-volume year at ${formatNumber(data.peak_count)} published CVEs.` },
  ];
  return <div className="animate-fade-in space-y-8">
    <section className="data-grid panel relative overflow-hidden px-5 py-8 sm:px-8 sm:py-10"><div className="relative max-w-3xl"><p className="eyebrow">Open vulnerability intelligence / 2026</p><h1 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-5xl">See the vulnerability landscape clearly.</h1><p className="mt-4 max-w-xl text-sm leading-6 text-muted sm:text-base">A focused view of CVE volume, scoring systems, weakness patterns, products, and the organizations publishing them.</p><div className="mt-7 flex flex-wrap gap-3"><Link href="/cvss" className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-accent-hover">Explore CVSS <ArrowRight className="size-4" /></Link><Link href="/cna" className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground hover:border-accent/50">View CNAs</Link></div></div><div className="absolute right-8 top-8 hidden font-mono text-right text-[10px] uppercase tracking-[.2em] text-muted/60 md:block"><p>System status</p><p className="mt-2 flex items-center justify-end gap-2 text-success"><span className="size-1.5 rounded-full bg-success" /> Data synced</p></div></section>
    <DataCards cards={cards} />
    <section className="panel p-5 sm:p-6"><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><p className="eyebrow">Historical signal</p><h2 className="mt-2 text-lg font-semibold">CVEs published by year</h2></div><div className="flex items-center gap-2 text-xs text-muted"><TrendingUp className="size-4 text-accent" /> 1999—{data.current_year}</div></div><YearlyTrends data={data.yearly_trend} /></section>
    <div className="grid gap-4 lg:grid-cols-[1.35fr_.65fr]"><InsightCards insights={insights} /><div className="panel flex flex-col justify-between p-5"><div><p className="eyebrow">Data layer</p><h2 className="mt-2 text-lg font-semibold">Built for investigation</h2><p className="mt-3 text-sm leading-6 text-muted">Move from macro trends to scoring, weakness, product, and authority-level detail.</p></div><div className="mt-6 flex items-center gap-3 text-xs text-muted"><Database className="size-4 text-accent" /><span>Static, reproducible public dataset</span><ShieldCheck className="ml-auto size-4 text-success" /></div></div></div>
  </div>;
}
