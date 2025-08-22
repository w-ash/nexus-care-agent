import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';
import { Edit2 } from 'lucide-react';

interface OutreachNodeData {
  label: string;
  category: string;
  config?: {
    channel: 'sms' | 'phone' | 'email' | 'mail';
    template?: string;
    timeOfDay?: 'morning' | 'afternoon' | 'evening';
    callType?: 'automated' | 'live_agent';
    maxAttempts?: number;
    priority?: 'high' | 'medium' | 'low';
  };
}

interface OutreachNodeProps {
  data: OutreachNodeData;
  selected?: boolean;
  onEdit?: () => void;
}

const OutreachNode: React.FC<OutreachNodeProps> = ({ data, selected, onEdit }) => {
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
        <Badge variant="secondary" className="text-xs font-medium mb-2">💬 Outreach</Badge>
        <div className="text-sm font-semibold text-foreground leading-tight">
          {data.label}
        </div>
      </div>
      
      <div className="space-y-1">
        {data.config?.channel && (
          <div className="text-xs text-muted-foreground">
            {data.config.channel.toUpperCase()}
          </div>
        )}
        
        {data.config?.timeOfDay && (
          <div className="text-xs text-muted-foreground">
            {data.config.timeOfDay}
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

export default OutreachNode;