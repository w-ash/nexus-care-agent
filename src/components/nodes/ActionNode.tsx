import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';
import { Calendar, AlertTriangle, FileEdit, UserPlus } from 'lucide-react';

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
}

const ActionNode: React.FC<ActionNodeProps> = ({ data, selected }) => {
  const getIcon = () => {
    if (data.config?.appointmentType) return <Calendar className="h-3 w-3 text-white" />;
    if (data.config?.escalationType) return <AlertTriangle className="h-3 w-3 text-white" />;
    if (data.config?.updateType) return <FileEdit className="h-3 w-3 text-white" />;
    return <UserPlus className="h-3 w-3 text-white" />;
  };

  const getColor = () => {
    if (data.config?.appointmentType) return 'bg-teal-500';
    if (data.config?.escalationType) return 'bg-red-500';
    if (data.config?.updateType) return 'bg-blue-500';
    return 'bg-teal-500';
  };

  return (
    <div className={`bg-card border-2 rounded-lg px-4 py-3 min-w-[160px] shadow-lg transition-all ${
      selected ? 'border-primary shadow-primary/20' : 'border-border hover:border-primary/50'
    }`}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-primary border-2 border-background"
      />
      
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-6 h-6 rounded-full ${getColor()} flex items-center justify-center`}>
          {getIcon()}
        </div>
        <Badge variant="secondary" className="text-xs font-medium">📅 Action</Badge>
      </div>
      
      <div className="text-sm font-semibold text-foreground mb-1">
        {data.label}
      </div>
      
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
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-primary border-2 border-background"
      />
    </div>
  );
};

export default ActionNode;