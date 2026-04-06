import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { useIncident, useAddComment } from './api';
import { IncidentStatusForm } from './components/IncidentStatusForm';
import { ActionForm } from './components/ActionForm';
import { StatusBadge } from './components/StatusBadge';
import { SLABadge } from './components/SLABadge';
import {
  formatDateTime,
  getIncidentTypeLabel,
  getShiftLabel,
  getStatusLabel,
} from '@/lib/utils';

export function IncidentDetailPage(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState({
    actions: true,
    comments: true,
    timeline: false,
  });
  const [commentText, setCommentText] = useState('');

  const { data: incident, isLoading } = useIncident(id || '');
  const addComment = useAddComment(id || '');

  const toggleSection = (section: keyof typeof expandedSections): void => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleAddComment = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await addComment.mutateAsync(commentText);
      setCommentText('');
    } catch (err: any) {
      console.error('Error adding comment:', err);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <Spinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (!incident) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-96">
          <p className="text-text-secondary">No se encontró el incidente</p>
          <button
            onClick={() => navigate('/incidents')}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-orange-600 transition-colors"
          >
            Volver a Incidentes
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/incidents')}
            className="p-2 hover:bg-bg-card rounded-md transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Incidente {incident.id}</h1>
            <p className="text-text-secondary">
              {formatDateTime(incident.createdAt)}
            </p>
          </div>
        </div>

        {/* Hero Photo */}
        {incident.photoUrl && (
          <Card>
            <img
              src={incident.photoUrl}
              alt="Incident"
              className="w-full h-96 object-cover rounded-lg"
            />
          </Card>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Metadata Card */}
            <Card title="Información del Incidente">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-text-secondary mb-1">Área</p>
                  <p className="font-medium text-text-primary">{incident.zoneName}</p>
                </div>
                <div>
                  <p className="text-xs text-text-secondary mb-1">Turno</p>
                  <p className="font-medium text-text-primary">
                    {getShiftLabel(incident.shift)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-secondary mb-1">Tipo</p>
                  <p className="font-medium text-text-primary">
                    {getIncidentTypeLabel(incident.type)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-secondary mb-1">Reportado por</p>
                  <p className="font-medium text-text-primary">
                    {incident.reportedBy?.name}
                  </p>
                </div>
                {incident.isIap && (
                  <div className="col-span-2">
                    <span className="inline-block px-3 py-1 rounded-full text-xs bg-risk-high text-white font-medium">
                      Investigación de Acto Peligroso (IAP)
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-xs text-text-secondary mb-2">Descripción</p>
                <p className="text-text-primary">{incident.description}</p>
              </div>
            </Card>

            {/* SLA Section */}
            <Card title="Estado SLA">
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-text-secondary mb-2">Estado</p>
                  <SLABadge status={incident.slaStatus} />
                </div>
                {incident.slaDeadline && (
                  <div>
                    <p className="text-xs text-text-secondary mb-2">Fecha Límite</p>
                    <p className="font-medium text-text-primary">
                      {formatDateTime(incident.slaDeadline)}
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Actions Section */}
            <Card
              title="Acciones Correctivas"
              action={
                <button
                  onClick={() => toggleSection('actions')}
                  className="p-1 hover:bg-bg-elevated rounded-md transition-colors"
                >
                  {expandedSections.actions ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
              }
            >
              {expandedSections.actions && (
                <div className="space-y-6">
                  {/* Existing Actions */}
                  {incident.actions && incident.actions.length > 0 && (
                    <div className="space-y-3">
                      {incident.actions.map((action) => (
                        <div
                          key={action.id}
                          className="p-4 rounded-lg bg-bg-elevated border border-border"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <p className="font-medium text-text-primary">
                              {action.description}
                            </p>
                            <span
                              className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                action.status === 'completed'
                                  ? 'bg-green-900 text-green-200'
                                  : action.status === 'in_progress'
                                    ? 'bg-yellow-900 text-yellow-200'
                                    : 'bg-blue-900 text-blue-200'
                              }`}
                            >
                              {getStatusLabel(action.status)}
                            </span>
                          </div>
                          <p className="text-xs text-text-secondary mb-2">
                            Asignado a: {action.assignedTo.name}
                          </p>
                          <p className="text-xs text-text-secondary">
                            Vencimiento: {formatDateTime(action.dueDate)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add New Action Form */}
                  <div className="border-t border-border pt-6">
                    <h4 className="font-medium text-text-primary mb-4">
                      Nueva Acción Correctiva
                    </h4>
                    <ActionForm
                      incidentId={incident.id}
                      onSuccess={() => toggleSection('actions')}
                    />
                  </div>
                </div>
              )}
            </Card>

            {/* Comments Section */}
            <Card
              title="Comentarios"
              action={
                <button
                  onClick={() => toggleSection('comments')}
                  className="p-1 hover:bg-bg-elevated rounded-md transition-colors"
                >
                  {expandedSections.comments ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
              }
            >
              {expandedSections.comments && (
                <div className="space-y-4">
                  {/* Existing Comments */}
                  {incident.comments && incident.comments.length > 0 && (
                    <div className="space-y-3 mb-6 pb-6 border-b border-border">
                      {incident.comments.map((comment) => (
                        <div key={comment.id} className="flex gap-4">
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {comment.author.name
                              .split(' ')
                              .map((n) => n.charAt(0))
                              .join('')
                              .toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-text-primary">
                                {comment.author.name}
                              </p>
                              <p className="text-xs text-text-secondary">
                                {comment.author.role}
                              </p>
                            </div>
                            <p className="text-text-primary text-sm mb-1">
                              {comment.text}
                            </p>
                            <p className="text-xs text-text-secondary">
                              {formatDateTime(comment.createdAt)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Comment Form */}
                  <form onSubmit={handleAddComment} className="space-y-3">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Agregar un comentario..."
                      className="w-full px-4 py-2 rounded-md bg-bg-elevated border border-border text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors resize-none"
                      rows={3}
                      disabled={addComment.isPending}
                    />
                    <button
                      type="submit"
                      disabled={addComment.isPending || !commentText.trim()}
                      className="px-4 py-2 rounded-md bg-primary text-white font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {addComment.isPending ? 'Enviando...' : 'Enviar Comentario'}
                    </button>
                  </form>
                </div>
              )}
            </Card>
          </div>

          {/* Right Column: Status Form */}
          <div>
            <Card title="Actualizar Estado">
              <IncidentStatusForm
                incidentId={incident.id}
                currentStatus={incident.status}
                currentResponsible={incident.responsible}
              />
            </Card>

            {/* Timeline */}
            {incident.timeline && incident.timeline.length > 0 && (
              <Card
                title="Historial"
                action={
                  <button
                    onClick={() => toggleSection('timeline')}
                    className="p-1 hover:bg-bg-elevated rounded-md transition-colors"
                  >
                    {expandedSections.timeline ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                }
                className="mt-6"
              >
                {expandedSections.timeline && (
                  <div className="space-y-4">
                    {incident.timeline.map((event, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 rounded-full bg-primary" />
                          {idx < incident.timeline.length - 1 && (
                            <div className="w-0.5 h-12 bg-border my-2" />
                          )}
                        </div>
                        <div className="pb-4">
                          <p className="font-medium text-text-primary">
                            {getStatusLabel(event.status)}
                          </p>
                          <p className="text-xs text-text-secondary">
                            {formatDateTime(event.at)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
