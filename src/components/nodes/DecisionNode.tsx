import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';
import { GitBranch } from 'lucide-react';

interface DecisionNodeData {
  label: string;
  condition?: string;
  trueLabel?: string;
  falseLabel?: string;
}

interface DecisionNodeProps {
  data: DecisionNodeData;
  selected?: boolean;
}

const DecisionNode: React.FC<DecisionNodeProps> = ({ data, selected }) => {
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
        <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center">
          <GitBranch className="h-3 w-3 text-white" />
        </div>
        <Badge variant="secondary" className="text-xs">Decision</Badge>
      </div>
      
      <div className="text-sm font-medium text-foreground mb-1">
        {data.label}
      </div>
      
      {data.condition && (
        <div className="text-xs text-muted-foreground mb-2">
          {data.condition}
        </div>
      )}

      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{data.trueLabel || 'Yes'}</span>
        <span>{data.falseLabel || 'No'}</span>
      </div>
      
      <Handle
        type="source"
        position={Position.Bottom}
        id="true"
        className="w-3 h-3 bg-green-500 border-2 border-background"
        style={{ left: '25%' }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        className="w-3 h-3 bg-red-500 border-2 border-background"
        style={{ left: '75%' }}
      />
    </div>
  );
};

export default DecisionNode;