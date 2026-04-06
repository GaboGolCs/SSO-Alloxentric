import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPatch, apiPost } from '@/lib/api-client';
import type { Incident, IncidentDetail, PaginatedResponse, CorrectiveAction, Comment } from '@/types';

export interface IncidentFilters {
  status?: string;
  isIap?: boolean;
  zoneId?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export function useIncidents(filters: IncidentFilters = {}) {
  const queryParams = new URLSearchParams();
  if (filters.status) queryParams.append('status', filters.status);
  if (filters.isIap) queryParams.append('isIap', 'true');
  if (filters.zoneId) queryParams.append('zoneId', filters.zoneId);
  if (filters.search) queryParams.append('search', filters.search);
  if (filters.page) queryParams.append('page', String(filters.page));
  if (filters.pageSize) queryParams.append('pageSize', String(filters.pageSize));

  return useQuery({
    queryKey: ['incidents', filters],
    queryFn: async () => {
      const url = `/incidents?${queryParams.toString()}`;
      return apiGet<PaginatedResponse<Incident>>(url);
    },
  });
}

export function useIncident(id: string) {
  return useQuery({
    queryKey: ['incident', id],
    queryFn: async () => {
      return apiGet<IncidentDetail>(`/incidents/${id}`);
    },
    enabled: !!id,
  });
}

export function useUpdateIncident() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; status?: string; responsible?: { id: string; name: string }; slaDeadline?: string }) => {
      return apiPatch(`/incidents/${data.id}`, {
        status: data.status,
        responsible: data.responsible,
        slaDeadline: data.slaDeadline,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['incident', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    },
  });
}

export function useCreateAction(incidentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { description: string; assignedTo: { id: string; name: string }; dueDate: string }) => {
      return apiPost(`/incidents/${incidentId}/actions`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incident', incidentId] });
    },
  });
}

export function useUpdateAction(incidentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { actionId: string; status: string }) => {
      return apiPatch(`/incidents/${incidentId}/actions/${data.actionId}`, {
        status: data.status,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incident', incidentId] });
    },
  });
}

export function useAddComment(incidentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (text: string) => {
      return apiPost(`/incidents/${incidentId}/comments`, { text });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incident', incidentId] });
    },
  });
}
