import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

interface WaitNodeData {
  label: string;
  duration?: number;
}

interface WaitNodeProps {
  data: WaitNodeData;
  selected?: boolean;
}

const WaitNode: React.FC<WaitNodeProps> = ({ data, selected }) => {
  return (
    <div className={`bg-card border-2 rounded-lg px-4 py-3 min-w-[120px] shadow-sm ${
      selected ? 'border-primary' : 'border-border'
    }`}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-primary border-2 border-background"
      />
      
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
          <Clock className="h-3 w-3 text-white" />
        </div>
        <Badge variant="secondary" className="text-xs">Wait</Badge>
      </div>
      
      <div className="text-sm font-medium text-foreground mb-1">
        {data.label}
      </div>
      
      {data.duration && (
        <div className="text-xs text-muted-foreground">
          {data.duration} day{data.duration !== 1 ? 's' : ''}
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

export default WaitNode;