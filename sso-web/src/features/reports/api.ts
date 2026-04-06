import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPost } from '@/lib/api-client';
import type { ExportTemplate, ExportJob } from '@/types';

export function useExportTemplates() {
  return useQuery({
    queryKey: ['export-templates'],
    queryFn: async () => {
      return apiGet<ExportTemplate[]>('/reports/templates');
    },
  });
}

export interface CreateExportRequest {
  templateId: string;
  format: string;
  startDate?: string;
  endDate?: string;
  areaFilter?: string;
}

export function useCreateExport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateExportRequest) => {
      const response = await apiPost<{ exportId: string }>('/reports/export', data);
      return response.exportId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['export-history'] });
    },
  });
}

export function useExportJob(exportId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['export-job', exportId],
    queryFn: async () => {
      return apiGet<ExportJob>(`/reports/export/${exportId}`);
    },
    enabled: enabled && !!exportId,
    refetchInterval: (data) => {
      if (data && (data.status === 'ready' || data.status === 'failed')) {
        return false;
      }
      return 2000; // Poll every 2 seconds
    },
  });
}

export function useExportHistory() {
  return useQuery({
    queryKey: ['export-history'],
    queryFn: async () => {
      return apiGet<ExportJob[]>('/reports/export-history');
    },
  });
}
