import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';
import { Edit2 } from 'lucide-react';

interface ActionNodeData {
  label: string;
  category: string;
  config?: {
    appointmentType?: string;
    schedulingMethod?: 'auto' | 'transfer_to_scheduler';
    allowBundling?: boolean;
    escalationType?: string;
    priority?: 'high' | 'medium' | 'low';
    reason?: string;
    updateType?: string;
    value?: string;
  };
}

interface ActionNodeProps {
  data: ActionNodeData;
  selected?: boolean;
  onEdit?: () => void;
}

const ActionNode: React.FC<ActionNodeProps> = ({ data, selected, onEdit }) => {
  return (
    <div className={`relative bg-card border-2 rounded-lg px-4 py-3 min-w-[160px] shadow-lg transition-all ${
      selected ? 'border-primary shadow-primary/20' : 'border-border hover:border-primary/50'
    }`}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-primary border-2 border-background"
      />
      
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
        <Badge variant="secondary" className="text-xs font-medium mb-2">📅 Action</Badge>
        <div className="text-sm font-semibold text-foreground leading-tight">
          {data.label}
        </div>
      </div>
      
      <div className="space-y-1">
        {data.config?.appointmentType && (
          <div className="text-xs text-muted-foreground">
            {data.config.appointmentType.replace(/_/g, ' ')}
          </div>
        )}
        
        {data.config?.escalationType && (
          <div className="text-xs text-muted-foreground">
            To: {data.config.escalationType.replace(/_/g, ' ')}
          </div>
        )}
        
        {data.config?.priority && (
          <div className="text-xs text-muted-foreground">
            Priority: {data.config.priority}
          </div>
        )}
      </div>
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-primary border-2 border-background"
      />
    </div>
  );
};

export default ActionNode;