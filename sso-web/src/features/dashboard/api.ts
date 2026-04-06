import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api-client';
import type { Zone, KPIs, TrendDataPoint } from '@/types';

export function useHeatmap(period: '1d' | '7d' | '30d' = '7d') {
  return useQuery({
    queryKey: ['heatmap', period],
    queryFn: async () => {
      const zones = await apiGet<Zone[]>(`/dashboard/heatmap?period=${period}`);
      return zones;
    },
  });
}

export function useKPIs(period: '1d' | '7d' | '30d' = '30d') {
  return useQuery({
    queryKey: ['kpis', period],
    queryFn: async () => {
      const kpis = await apiGet<KPIs>(`/dashboard/kpis?period=${period}`);
      return kpis;
    },
  });
}

export function useTrends(days: 7 | 30 = 7) {
  return useQuery({
    queryKey: ['trends', days],
    queryFn: async () => {
      const trends = await apiGet<TrendDataPoint[]>(`/dashboard/trends?days=${days}`);
      return trends;
    },
  });
}

export function useTopAreas(limit: number = 5, period: '1d' | '7d' | '30d' = '7d') {
  return useQuery({
    queryKey: ['top-areas', limit, period],
    queryFn: async () => {
      const areas = await apiGet<Zone[]>(`/dashboard/top-areas?limit=${limit}&period=${period}`);
      return areas;
    },
  });
}
