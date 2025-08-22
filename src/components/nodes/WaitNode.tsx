import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';
import { Clock, Timer, Calendar } from 'lucide-react';

interface WaitNodeData {
  label: string;
  category: string;
  config?: {
    duration: number;
    unit: 'hours' | 'days' | 'weeks';
    businessDaysOnly?: boolean;
  };
}

interface WaitNodeProps {
  data: WaitNodeData;
  selected?: boolean;
}

const WaitNode: React.FC<WaitNodeProps> = ({ data, selected }) => {
  const getIcon = () => {
    switch (data.config?.unit) {
      case 'hours': return <Timer className="h-3 w-3 text-white" />;
      case 'weeks': return <Calendar className="h-3 w-3 text-white" />;
      default: return <Clock className="h-3 w-3 text-white" />;
    }
  };

  const getDurationText = () => {
    if (!data.config) return '';
    const { duration, unit } = data.config;
    return `${duration} ${unit}${duration !== 1 ? '' : unit.slice(0, -1)}`;
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
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-primary border-2 border-background"
      />
      
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
          {getIcon()}
        </div>
        <Badge variant="secondary" className="text-xs font-medium">⏰ Wait</Badge>
      </div>
      
      <div className="text-sm font-semibold text-foreground mb-1">
        {data.label}
      </div>
      
      {data.config && (
        <div className="text-xs text-muted-foreground">
          {getDurationText()}
        </div>
      )}
      
      {data.config?.businessDaysOnly && (
        <div className="text-xs text-muted-foreground">
          Business days only
        </div>
      )}
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-primary border-2 border-background"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-primary border-2 border-background"
      />
    </div>
  );
};

export default WaitNode;