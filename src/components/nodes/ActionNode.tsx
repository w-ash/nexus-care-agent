import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Phone, Mail } from 'lucide-react';

interface ActionNodeData {
  label: string;
  actionType: 'sms' | 'phone' | 'email';
  message?: string;
}

interface ActionNodeProps {
  data: ActionNodeData;
  selected?: boolean;
}

const ActionNode: React.FC<ActionNodeProps> = ({ data, selected }) => {
  const getIcon = () => {
    switch (data.actionType) {
      case 'sms':
        return <MessageSquare className="h-3 w-3 text-white" />;
      case 'phone':
        return <Phone className="h-3 w-3 text-white" />;
      case 'email':
        return <Mail className="h-3 w-3 text-white" />;
      default:
        return <MessageSquare className="h-3 w-3 text-white" />;
    }
  };

  const getColor = () => {
    switch (data.actionType) {
      case 'sms':
        return 'bg-blue-500';
      case 'phone':
        return 'bg-green-500';
      case 'email':
        return 'bg-purple-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className={`bg-card border-2 rounded-lg px-4 py-3 min-w-[140px] shadow-sm ${
      selected ? 'border-primary' : 'border-border'
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
        <Badge variant="secondary" className="text-xs">
          {data.actionType.toUpperCase()}
        </Badge>
      </div>
      
      <div className="text-sm font-medium text-foreground mb-1">
        {data.label}
      </div>
      
      {data.message && (
        <div className="text-xs text-muted-foreground truncate max-w-[120px]">
          "{data.message}"
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