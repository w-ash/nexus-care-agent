import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';
import { Edit2 } from 'lucide-react';

interface TriggerNodeData {
  label: string;
  category: string;
  config?: {
    gapType?: string;
    daysOverdue?: number;
    gender?: string;
    ageRange?: { min: number; max: number };
    planType?: string;
    eventType?: string;
  };
}

interface TriggerNodeProps {
  data: TriggerNodeData;
  selected?: boolean;
  onEdit?: () => void;
}

const TriggerNode: React.FC<TriggerNodeProps> = ({ data, selected, onEdit }) => {
  return (
    <div className={`relative bg-card border-2 rounded-lg px-4 py-3 min-w-[160px] shadow-lg transition-all ${
      selected ? 'border-primary shadow-primary/20' : 'border-border hover:border-primary/50'
    }`}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit?.();
        }}
        className="absolute top-2 right-2 p-1 rounded hover:bg-muted transition-colors opacity-60 hover:opacity-100"
      >
        <Edit2 className="h-3 w-3" />
      </button>
      
      <div className="mb-3">
        <Badge variant="secondary" className="text-xs font-medium mb-2">🎯 Trigger</Badge>
        <div className="text-sm font-semibold text-foreground leading-tight">
          {data.label}
        </div>
      </div>
      
      <div className="space-y-1">
        {data.config?.gapType && (
          <div className="text-xs text-muted-foreground">
            Gap: {data.config.gapType}
          </div>
        )}
        
        {data.config?.daysOverdue && (
          <div className="text-xs text-muted-foreground">
            {data.config.daysOverdue}+ days overdue
          </div>
        )}
      </div>
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-emerald-500 border-2 border-background"
      />
    </div>
  );
};

export default TriggerNode;