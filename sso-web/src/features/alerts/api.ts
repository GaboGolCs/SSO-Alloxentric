import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPatch, apiPost } from '@/lib/api-client';
import type { Alert, AlertStats, PaginatedResponse } from '@/types';

export interface AlertFilters {
  type?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export function useAlerts(filters: AlertFilters = {}) {
  const queryParams = new URLSearchParams();
  if (filters.type) queryParams.append('type', filters.type);
  if (filters.status) queryParams.append('status', filters.status);
  if (filters.page) queryParams.append('page', String(filters.page));
  if (filters.pageSize) queryParams.append('pageSize', String(filters.pageSize));

  return useQuery({
    queryKey: ['alerts', filters],
    queryFn: async () => {
      const url = `/alerts?${queryParams.toString()}`;
      return apiGet<PaginatedResponse<Alert>>(url);
    },
  });
}

export function useAlertStats() {
  return useQuery({
    queryKey: ['alert-stats'],
    queryFn: async () => {
      return apiGet<AlertStats>('/alerts/stats');
    },
  });
}

export function useResolveAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (alertId: string) => {
      return apiPatch(`/alerts/${alertId}`, { status: 'resolved' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      queryClient.invalidateQueries({ queryKey: ['alert-stats'] });
    },
  });
}

export function useCreateManualAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      body: string;
      zoneName?: string;
      severity: 'low' | 'medium' | 'high';
    }) => {
      return apiPost('/alerts/manual', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      queryClient.invalidateQueries({ queryKey: ['alert-stats'] });
    },
  });
}
