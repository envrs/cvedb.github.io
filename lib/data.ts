import type {
  CveAll,
  CnaAnalysis,
  CnaSummary,
  CvssAnalysis,
  CweAnalysis,
  CpeAnalysis,
  GrowthAnalysis,
  CalendarAnalysis,
} from './types';

async function loadJson<T>(path: string): Promise<T> {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return res.json();
}

export function loadCveAll(): Promise<CveAll> {
  return loadJson<CveAll>('/data/cve_all.json');
}

export function loadCnaAnalysis(): Promise<CnaAnalysis> {
  return loadJson<CnaAnalysis>('/data/cna_analysis.json');
}

export function loadCnaSummary(): Promise<CnaSummary[]> {
  return loadJson<CnaSummary[]>('/data/cna_summary.json');
}

export function loadCvssAnalysis(): Promise<CvssAnalysis> {
  return loadJson<CvssAnalysis>('/data/cvss_analysis.json');
}

export function loadCweAnalysis(): Promise<CweAnalysis> {
  return loadJson<CweAnalysis>('/data/cwe_analysis.json');
}

export function loadCpeAnalysis(): Promise<CpeAnalysis> {
  return loadJson<CpeAnalysis>('/data/cpe_analysis.json');
}

export function loadGrowthAnalysis(): Promise<GrowthAnalysis> {
  return loadJson<GrowthAnalysis>('/data/growth_analysis.json');
}

export function loadCalendarAnalysis(): Promise<CalendarAnalysis> {
  return loadJson<CalendarAnalysis>('/data/calendar_analysis.json');
}
