import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'dd/MM/yyyy', { locale: es });
}

export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'dd/MM/yyyy HH:mm', { locale: es });
}

export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true, locale: es });
}

export function getRiskColor(level: 'high' | 'medium' | 'low'): string {
  switch (level) {
    case 'high':
      return 'bg-risk-high';
    case 'medium':
      return 'bg-risk-medium';
    case 'low':
      return 'bg-risk-low';
    default:
      return 'bg-gray-500';
  }
}

export function getRiskTextColor(level: 'high' | 'medium' | 'low'): string {
  switch (level) {
    case 'high':
      return 'text-risk-high';
    case 'medium':
      return 'text-risk-medium';
    case 'low':
      return 'text-risk-low';
    default:
      return 'text-gray-400';
  }
}

export function getStatusBadgeColor(status: string): { bg: string; text: string } {
  const statusMap: Record<string, { bg: string; text: string }> = {
    submitted: { bg: 'bg-blue-900', text: 'text-blue-200' },
    under_review: { bg: 'bg-yellow-900', text: 'text-yellow-200' },
    action_assigned: { bg: 'bg-purple-900', text: 'text-purple-200' },
    closed: { bg: 'bg-green-900', text: 'text-green-200' },
    overdue: { bg: 'bg-risk-high', text: 'text-white' },
    pending: { bg: 'bg-blue-900', text: 'text-blue-200' },
    in_progress: { bg: 'bg-yellow-900', text: 'text-yellow-200' },
    completed: { bg: 'bg-green-900', text: 'text-green-200' },
    cancelled: { bg: 'bg-gray-700', text: 'text-gray-300' },
  };

  return statusMap[status] || { bg: 'bg-gray-700', text: 'text-gray-300' };
}

export function getSlaColor(status: 'on_time' | 'at_risk' | 'overdue'): string {
  switch (status) {
    case 'on_time':
      return '#2ED573';
    case 'at_risk':
      return '#FFA502';
    case 'overdue':
      return '#FF4757';
    default:
      return '#8B949E';
  }
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    submitted: 'Reportado',
    under_review: 'Bajo Revisión',
    action_assigned: 'Acción Asignada',
    closed: 'Cerrado',
    overdue: 'Vencido',
    pending: 'Pendiente',
    in_progress: 'En Progreso',
    completed: 'Completado',
    cancelled: 'Cancelado',
    active: 'Activa',
    resolved: 'Resuelta',
    processing: 'Procesando',
    ready: 'Listo',
    failed: 'Fallido',
  };

  return labels[status] || status;
}

export function getShiftLabel(shift: string): string {
  const labels: Record<string, string> = {
    morning: 'Matutino',
    afternoon: 'Vespertino',
    night: 'Nocturno',
  };

  return labels[shift] || shift;
}

export function getIncidentTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    unsafe_act: 'Acto Inseguro',
    unsafe_condition: 'Condición Insegura',
  };

  return labels[type] || type;
}

export function getAlertTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    iap: 'Investigación de Acto Peligroso',
    sla: 'Vencimiento SLA',
    zone: 'Zona Crítica',
    auto: 'Alerta Automática',
    manual: 'Alerta Manual',
  };

  return labels[type] || type;
}

export function getAlertTypeColor(type: string): string {
  const colors: Record<string, string> = {
    iap: 'bg-risk-high',
    sla: 'bg-risk-medium',
    zone: 'bg-yellow-900',
    auto: 'bg-blue-900',
    manual: 'bg-purple-900',
  };

  return colors[type] || 'bg-gray-700';
}
