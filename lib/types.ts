export interface CveAll {
  generated_at: string;
  total_cves: number;
  years_covered: number;
  current_year: number;
  current_year_cves: number;
  peak_year: number;
  peak_count: number;
  yoy_growth_rate: number;
  yearly_trend: YearlyTrend[];
}

export interface YearlyTrend {
  year: number;
  count: number;
}

export interface CnaAnalysis {
  generated_at: string;
  total_cnas: number;
  active_cnas: number;
  inactive_cnas: number;
  high_volume_cnas: number;
  market_concentration: number;
  median_years_active: number;
  type_distribution: {
    sorted_types: [string, number][];
    type_percentages: Record<string, number>;
  };
  cna_list: CnaEntry[];
}

export interface CnaEntry {
  name: string;
  org_id: string;
  count: number;
  years_active: number;
  first_cve_year: number;
  last_cve_year: number;
  first_cve_date: string;
  last_cve_date: string;
  cna_types: string[];
  activity_status: "Active" | "Inactive";
  days_since_last_cve: number;
}

export interface CnaSummary {
  cnaId: string;
  shortName: string;
  overallScore: number;
  grade: string;
  previousPeriodCveCount: number;
  cveCount: number;
  type: string;
  trend: string;
}

export interface CvssAnalysis {
  generated_at: string;
  total_cves_with_cvss: number;
  total_by_version: Record<string, number>;
  severity_distribution: Record<string, Record<string, number>>;
  score_distribution: Record<string, Record<string, number>>;
  binned_score_distribution: Record<string, Record<string, number>>;
  temporal_data: Record<string, Record<string, number>>;
}

export interface CweAnalysis {
  generated_at: string;
  total_cves_with_cwe: number;
  total_unique_cwes: number;
  top_cwes: CweEntry[];
}

export interface CweEntry {
  id: string;
  name: string;
  count: number;
  description: string;
}

export interface CpeAnalysis {
  generated_at: string;
  total_unique_cpes: number;
  total_cpe_entries: number;
  total_cves_with_cpes: number;
  total_unique_vendors: number;
  total_unique_products: number;
  top_cpes: CpeEntry[];
  top_vendors: { vendor: string; count: number }[];
  cpe_type_distribution: { type: string; count: number }[];
  cves_with_most_cpes: { cve: string; count: number; year: number }[];
}

export interface CpeEntry {
  cpe: string;
  count: number;
  vendor: string;
  product: string;
  type: string;
}

export interface GrowthAnalysis {
  generated_at: string;
  growth_data: GrowthDataEntry[];
  avg_annual_growth: number;
  highest_growth_year: { year: number; rate: number };
  lowest_growth_year: { year: number; rate: number };
}

export interface GrowthDataEntry {
  year: number;
  cves: number;
  growth_rate: number;
  growth_absolute: number;
  is_ytd: boolean;
  growth_rate_3yr_avg: number;
}

export interface CalendarAnalysis {
  generated_at: string;
  statistics: CalendarStats;
  daily_data: CalendarDay[];
}

export interface CalendarStats {
  total_cves: number;
  total_days_with_data: number;
  date_range: { start: string; end: string };
  daily_stats: {
    average_per_day: number;
    max_per_day: number;
    min_per_day: number;
    peak_day: { date: string; count: number };
  };
  cvss_stats: { average_score: number; total_with_scores: number };
  current_year: { year: number; total_cves: number; days_with_data: number };
}

export interface CalendarDay {
  date: string;
  value: number;
  avg_cvss: number;
  cvss_count: number;
}
