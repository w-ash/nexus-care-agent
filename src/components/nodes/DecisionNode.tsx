import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';
import { GitBranch, Users, Activity, UserCheck } from 'lucide-react';

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
}

const DecisionNode: React.FC<DecisionNodeProps> = ({ data, selected }) => {
  const getIcon = () => {
    switch (data.config?.condition) {
      case 'age': return <Users className="h-3 w-3 text-white" />;
      case 'response_received': return <Activity className="h-3 w-3 text-white" />;
      case 'risk_score': return <UserCheck className="h-3 w-3 text-white" />;
      default: return <GitBranch className="h-3 w-3 text-white" />;
    }
  };

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
    <div className={`bg-card border-2 rounded-lg px-4 py-3 min-w-[160px] shadow-lg transition-all ${
      selected ? 'border-primary shadow-primary/20' : 'border-border hover:border-primary/50'
    }`}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-primary border-2 border-background"
      />
      
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center">
          {getIcon()}
        </div>
        <Badge variant="secondary" className="text-xs font-medium">🤔 Decision</Badge>
      </div>
      
      <div className="text-sm font-semibold text-foreground mb-1">
        {data.label}
      </div>
      
      {data.config?.condition && (
        <div className="text-xs text-muted-foreground mb-2">
          {data.config.condition.replace('_', ' ')}
        </div>
      )}

      <div className="flex justify-between text-xs text-muted-foreground">
        <span className="truncate">{labels.left}</span>
        <span className="truncate">{labels.right}</span>
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