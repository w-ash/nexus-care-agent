import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, Flag } from 'lucide-react';

interface EndNodeData {
  label: string;
  category: string;
  config?: {
    outcome: 'success' | 'incomplete' | 'timeout' | 'escalated';
    metric?: string;
  };
}

interface EndNodeProps {
  data: EndNodeData;
  selected?: boolean;
}

const EndNode: React.FC<EndNodeProps> = ({ data, selected }) => {
  const getIcon = () => {
    switch (data.config?.outcome) {
      case 'success': return <CheckCircle className="h-3 w-3 text-white" />;
      case 'incomplete': return <XCircle className="h-3 w-3 text-white" />;
      case 'timeout': return <Clock className="h-3 w-3 text-white" />;
      case 'escalated': return <Flag className="h-3 w-3 text-white" />;
      default: return <CheckCircle className="h-3 w-3 text-white" />;
    }
  };

  const getColor = () => {
    switch (data.config?.outcome) {
      case 'success': return 'bg-emerald-500';
      case 'incomplete': return 'bg-slate-500';
      case 'timeout': return 'bg-orange-500';
      case 'escalated': return 'bg-yellow-500';
      default: return 'bg-slate-500';
    }
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
        <Badge variant="secondary" className="text-xs font-medium">✅ End</Badge>
      </div>
      
      <div className="text-sm font-semibold text-foreground mb-1">
        {data.label}
      </div>
      
      {data.config?.outcome && (
        <div className="text-xs text-muted-foreground mb-1">
          {data.config.outcome.replace('_', ' ')}
        </div>
      )}
      
      {data.config?.metric && (
        <div className="text-xs text-muted-foreground">
          {data.config.metric.replace(/_/g, ' ')}
        </div>
      )}
    </div>
  );
};

export default EndNode;