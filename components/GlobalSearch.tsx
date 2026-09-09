'use client';

import { Search, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

const destinations = [
  { label: 'CVE Overview', href: '/', hint: 'Dashboard' },
  { label: 'CNA Intelligence', href: '/cna', hint: 'Authorities' },
  { label: 'CVSS Scoring', href: '/cvss', hint: 'Severity' },
  { label: 'CWE Weaknesses', href: '/cwe', hint: 'Root causes' },
  { label: 'CPE Products', href: '/cpe', hint: 'Affected products' },
  { label: 'Calendar Analysis', href: '/calendar', hint: 'Daily activity' },
  { label: 'Growth Trends', href: '/growth', hint: 'Year over year' },
];

export default function GlobalSearch() {
  const [query, setQuery] = useState('');
  const results = destinations.filter((item) => `${item.label} ${item.hint}`.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="relative hidden w-64 sm:block">
      <Search className="pointer-events-none absolute left-3 top-2.5 size-4 text-muted" />
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search surfaces" aria-label="Search dashboard surfaces" className="h-9 w-full rounded-md border border-border bg-card pl-9 pr-3 text-sm outline-none placeholder:text-muted focus:border-accent" />
      {query && <div className="absolute left-0 right-0 top-11 z-50 overflow-hidden rounded-lg border border-border bg-card shadow-2xl">
        {results.length ? results.map((item) => <Link key={item.href} href={item.href} onClick={() => setQuery('')} className="flex items-center justify-between gap-3 px-3 py-2.5 text-sm hover:bg-card-hover"><span>{item.label}<span className="ml-2 text-xs text-muted">{item.hint}</span></span><ArrowUpRight className="size-3.5 text-muted" /></Link>) : <p className="px-3 py-3 text-sm text-muted">No matching surface.</p>}
      </div>}
    </div>
  );
}
