import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Phone, Mail, Mailbox } from 'lucide-react';

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
}

const OutreachNode: React.FC<OutreachNodeProps> = ({ data, selected }) => {
  const getIcon = () => {
    switch (data.config?.channel) {
      case 'sms':
        return <MessageSquare className="h-3 w-3 text-white" />;
      case 'phone':
        return <Phone className="h-3 w-3 text-white" />;
      case 'email':
        return <Mail className="h-3 w-3 text-white" />;
      case 'mail':
        return <Mailbox className="h-3 w-3 text-white" />;
      default:
        return <MessageSquare className="h-3 w-3 text-white" />;
    }
  };

  const getChannelColor = () => {
    switch (data.config?.channel) {
      case 'sms': return 'bg-blue-500';
      case 'phone': return 'bg-green-500';
      case 'email': return 'bg-purple-500';
      case 'mail': return 'bg-orange-500';
      default: return 'bg-blue-500';
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
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-primary border-2 border-background"
      />
      
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-6 h-6 rounded-full ${getChannelColor()} flex items-center justify-center`}>
          {getIcon()}
        </div>
        <Badge variant="secondary" className="text-xs font-medium">💬 Outreach</Badge>
      </div>
      
      <div className="text-sm font-semibold text-foreground mb-1">
        {data.label}
      </div>
      
      {data.config?.channel && (
        <div className="text-xs text-muted-foreground mb-1">
          {data.config.channel.toUpperCase()}
        </div>
      )}
      
      {data.config?.timeOfDay && (
        <div className="text-xs text-muted-foreground">
          {data.config.timeOfDay}
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

export default OutreachNode;