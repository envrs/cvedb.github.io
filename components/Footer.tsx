import { Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-card)] mt-16">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-[var(--color-accent)] mt-0.5" />
            <div>
              <p className="font-semibold text-sm">CVE Database Dashboard</p>
              <p className="text-xs text-[var(--color-muted)] mt-1">
                Comprehensive vulnerability analytics and trends for the global CVE ecosystem.
              </p>
            </div>
          </div>
          <div className="text-right text-xs text-[var(--color-muted)]">
            <p className="mb-1"><strong>Data Sources:</strong> NVD, CVE Program</p>
            <p>Built by <a href="https://cvedb.github.io" target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] hover:underline">CVEDB</a></p>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-[var(--color-border)] text-center text-xs text-[var(--color-muted)]">
          &copy; {new Date().getFullYear()} CVE Database Project. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
