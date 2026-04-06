import { FileText } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import type { ExportTemplate } from '@/types';

interface TemplateCardProps {
  template: ExportTemplate;
  isSelected?: boolean;
  onSelect?: (template: ExportTemplate) => void;
}

export function TemplateCard({
  template,
  isSelected,
  onSelect,
}: TemplateCardProps): React.ReactElement {
  return (
    <button
      onClick={() => onSelect?.(template)}
      className={`p-6 rounded-lg border transition-all text-left ${
        isSelected
          ? 'border-primary bg-bg-elevated/50'
          : 'border-border bg-bg-card hover:border-primary hover:bg-bg-elevated/30'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <FileText className={`w-8 h-8 ${isSelected ? 'text-primary' : 'text-text-secondary'}`} />
        {isSelected && (
          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
            <span className="text-white text-xs font-bold">✓</span>
          </div>
        )}
      </div>

      <h3 className="font-semibold text-text-primary mb-2">{template.name}</h3>
      <p className="text-sm text-text-secondary mb-4">{template.description}</p>

      <div className="flex flex-wrap gap-2">
        {template.formats.map((format) => (
          <Badge key={format} variant="info">
            {format}
          </Badge>
        ))}
      </div>
    </button>
  );
}
