export interface User {
  id: string;
  name: string;
  email: string;
  role: 'worker' | 'area_chief' | 'analyst' | 'sso_manager';
  planTier: string;
  assignedAreas?: string[];
}

export interface Zone {
  zoneId: string;
  name: string;
  riskScore: number;
  riskLevel: 'high' | 'medium' | 'low';
  openReports: number;
  overdueActions: number;
  trend: 'rising' | 'stable' | 'falling';
  polygon?: [number, number][];
  color?: string;
}

export interface KPIs {
  period: string;
  totalReports: number;
  totalReportsDelta: number;
  activeIap: number;
  activeIapDelta: number;
  slaComplianceRate: number;
  overdueActions: number;
  closedToday: number;
}

export interface TrendDataPoint {
  date: string;
  globalRiskScore: number;
  openReports: number;
}

export interface Incident {
  id: string;
  status: 'submitted' | 'under_review' | 'action_assigned' | 'closed' | 'overdue';
  zoneName: string;
  shift: 'morning' | 'afternoon' | 'night';
  type: 'unsafe_act' | 'unsafe_condition';
  isIap: boolean;
  photoUrl: string;
  responsible?: { id: string; name: string };
  slaDeadline?: string;
  slaStatus: 'on_time' | 'at_risk' | 'overdue';
  createdAt: string;
}

export interface IncidentDetail extends Incident {
  areaId: string;
  description: string;
  reportedBy: { id: string; name: string };
  actions: CorrectiveAction[];
  comments: Comment[];
  timeline: TimelineEvent[];
}

export interface CorrectiveAction {
  id: string;
  description: string;
  assignedTo: { id: string; name: string };
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
}

export interface Comment {
  id: string;
  text: string;
  author: { id: string; name: string; role: string };
  createdAt: string;
}

export interface TimelineEvent {
  status: string;
  at: string;
}

export interface Alert {
  id: string;
  type: 'iap' | 'sla' | 'zone' | 'auto' | 'manual';
  title: string;
  body: string;
  zoneId?: string;
  zoneName?: string;
  incidentId?: string;
  status: 'active' | 'resolved';
  createdAt: string;
}

export interface AlertStats {
  activeAlerts: number;
  pendingReview: number;
  resolvedToday: number;
  autoSentToday: number;
}

export interface ExportTemplate {
  id: string;
  name: string;
  description: string;
  formats: string[];
}

export interface ExportJob {
  exportId: string;
  status: 'processing' | 'ready' | 'failed';
  format: string;
  filename?: string;
  fileSizeKb?: number;
  downloadUrl?: string;
  createdAt: string;
  completedAt?: string;
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

export interface AppError {
  message: string;
  statusCode?: number;
  details?: Record<string, unknown>;
}
