'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import GlobalSearch from '@/components/GlobalSearch';

const links = [
  { href: '/', label: 'Overview' }, { href: '/cna', label: 'CNAs' }, { href: '/cvss', label: 'CVSS' },
  { href: '/cwe', label: 'CWEs' }, { href: '/cpe', label: 'Products' }, { href: '/calendar', label: 'Calendar' }, { href: '/growth', label: 'Growth' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
    <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
      <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="CVEDB overview"><span className="grid size-8 place-items-center rounded-md border border-accent/40 bg-accent/10"><Activity className="size-4 text-accent" /></span><span className="font-mono text-sm font-bold tracking-[.18em]">CVEDB</span></Link>
      <nav className="hidden items-center gap-0.5 lg:flex">{links.map((link) => <Link key={link.href} href={link.href} className={cn('rounded-md px-2.5 py-2 text-[13px] font-medium transition-colors', pathname === link.href ? 'bg-accent/10 text-accent' : 'text-muted hover:bg-card hover:text-foreground')}>{link.label}</Link>)}</nav>
      <div className="flex items-center gap-3"><GlobalSearch /><button onClick={() => setOpen(!open)} className="rounded-md p-2 text-muted hover:bg-card hover:text-foreground lg:hidden" aria-label={open ? 'Close navigation' : 'Open navigation'}>{open ? <X className="size-5" /> : <Menu className="size-5" />}</button></div>
    </div>
    {open && <nav className="border-t border-border bg-card px-4 py-3 lg:hidden"><div className="grid grid-cols-2 gap-1 sm:grid-cols-4">{links.map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className={cn('rounded-md px-3 py-2.5 text-sm', pathname === link.href ? 'bg-accent/10 text-accent' : 'text-muted hover:bg-card-hover hover:text-foreground')}>{link.label}</Link>)}</div></nav>}
  </header>;
}
