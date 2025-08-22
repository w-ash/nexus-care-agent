import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';
import { Play, Users, Calendar, Edit2 } from 'lucide-react';

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
  const getIcon = () => {
    if (data.config?.gapType) return <Calendar className="h-3 w-3 text-white" />;
    if (data.config?.planType) return <Users className="h-3 w-3 text-white" />;
    return <Play className="h-3 w-3 text-white fill-white" />;
  };

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
      
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
          {getIcon()}
        </div>
        <Badge variant="secondary" className="text-xs font-medium">🎯 Trigger</Badge>
      </div>
      
      <div className="text-sm font-semibold text-foreground mb-1">
        {data.label}
      </div>
      
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
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-emerald-500 border-2 border-background"
      />
    </div>
  );
};

export default TriggerNode;