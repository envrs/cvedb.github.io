'use client';

import { Shield, Github, ExternalLink, BarChart3, Calendar, Network, AlertTriangle, TrendingUp, Info } from 'lucide-react';

const features = [
  { icon: BarChart3, title: 'CNA Intelligence', desc: 'Performance metrics, rankings, and activity analysis for all CVE Numbering Authorities.' },
  { icon: Calendar, title: 'Calendar Analysis', desc: 'Daily CVE publication patterns with interactive heatmaps and monthly trends.' },
  { icon: Network, title: 'CPE Analysis', desc: 'Common Platform Enumeration data showing platform coverage and vendor statistics.' },
  { icon: AlertTriangle, title: 'CVSS & CWE Analysis', desc: 'Severity distribution, scoring trends, and weakness categorization across all CVEs.' },
  { icon: TrendingUp, title: 'Growth Trends', desc: 'Historical growth patterns with year-over-year and cumulative analysis.' },
  { icon: Info, title: 'Open Data', desc: 'All data is publicly available and updated regularly from authoritative sources.' },
];

export default function AboutPage() {
  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      <div className="text-center py-8">
        <Shield className="h-12 w-12 text-[var(--color-accent)] mx-auto mb-4" />
        <h1 className="text-3xl font-bold tracking-tight">About This Project</h1>
        <p className="text-sm text-[var(--color-muted)] mt-2">
          Transparency & Insight for the CVE Community
        </p>
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
        <p className="text-sm leading-relaxed text-[var(--color-muted)]">
          The CVE Database Dashboard is an open-source project designed to provide comprehensive analytics,
          trends, and insights into the global CVE ecosystem. It aggregates and visualizes data from multiple
          authoritative sources, focusing on CNA performance, vulnerability trends, and platform coverage.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 transition-colors hover:bg-[var(--color-card-hover)]"
              >
                <div className="flex items-start gap-3">
                  <Icon className="h-5 w-5 text-[var(--color-accent)] mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-sm">{feature.title}</h3>
                    <p className="text-xs text-[var(--color-muted)] mt-1">{feature.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
        <h2 className="text-lg font-semibold mb-4">Data Sources</h2>
        <ul className="space-y-2 text-sm text-[var(--color-muted)]">
          <li className="flex items-center gap-2">
            <ExternalLink className="h-3.5 w-3.5 shrink-0" />
            <a href="https://nvd.nist.gov/" target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] hover:underline">
              National Vulnerability Database (NVD)
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-3.5 w-3.5 shrink-0" />
            <a href="https://cve.org/" target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] hover:underline">
              CVE Program
            </a>
          </li>
        </ul>
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
        <h2 className="text-lg font-semibold mb-4">Contact & Contributions</h2>
        <p className="text-sm text-[var(--color-muted)] mb-4">
          Contributions are welcome! Please visit the GitHub repository for details or to open an issue.
        </p>
        <a
          href="https://github.com/CVEDB/cvedb.github.io"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--color-card-hover)]"
        >
          <Github className="h-4 w-4" />
          GitHub Repository
        </a>
      </div>
    </div>
  );
}
