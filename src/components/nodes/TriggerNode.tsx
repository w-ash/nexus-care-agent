import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';
import { Play } from 'lucide-react';

interface TriggerNodeData {
  label: string;
  trigger?: string;
}

interface TriggerNodeProps {
  data: TriggerNodeData;
  selected?: boolean;
}

const TriggerNode: React.FC<TriggerNodeProps> = ({ data, selected }) => {
  return (
    <div className={`bg-card border-2 rounded-lg px-4 py-3 min-w-[120px] shadow-sm ${
      selected ? 'border-primary' : 'border-border'
    }`}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
          <Play className="h-3 w-3 text-white fill-white" />
        </div>
        <Badge variant="secondary" className="text-xs">Start</Badge>
      </div>
      
      <div className="text-sm font-medium text-foreground mb-1">
        {data.label}
      </div>
      
      {data.trigger && (
        <div className="text-xs text-muted-foreground">
          Trigger: {data.trigger}
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

export default TriggerNode;