import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';
import { Edit2 } from 'lucide-react';

interface DecisionNodeData {
  label: string;
  category: string;
  config?: {
    condition: string;
    branches: Array<{
      operator?: string;
      value: any;
      label: string;
    }>;
  };
}

interface DecisionNodeProps {
  data: DecisionNodeData;
  selected?: boolean;
  onEdit?: () => void;
}

const DecisionNode: React.FC<DecisionNodeProps> = ({ data, selected, onEdit }) => {
  const getBranchLabels = () => {
    if (!data.config?.branches) return { left: 'Yes', right: 'No' };
    
    if (data.config.branches.length === 2) {
      return {
        left: data.config.branches[0].label,
        right: data.config.branches[1].label
      };
    }
    
    return { left: 'Yes', right: 'No' };
  };

  const labels = getBranchLabels();

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
        <Badge variant="secondary" className="text-xs font-medium mb-2">🤔 Decision</Badge>
        <div className="text-sm font-semibold text-foreground leading-tight">
          {data.label}
        </div>
      </div>
      
      <div className="space-y-1">
        {data.config?.condition && (
          <div className="text-xs text-muted-foreground mb-2">
            {data.config.condition.replace('_', ' ')}
          </div>
        )}

        <div className="flex justify-between text-xs text-muted-foreground">
          <span className="truncate">{labels.left}</span>
          <span className="truncate">{labels.right}</span>
        </div>
      </div>
      
      <Handle
        type="source"
        position={Position.Bottom}
        id="true"
        className="w-3 h-3 bg-emerald-500 border-2 border-background"
        style={{ left: '25%' }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        className="w-3 h-3 bg-rose-500 border-2 border-background"
        style={{ left: '75%' }}
      />
    </div>
  );
};

export default DecisionNode;