import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';
import { Edit2 } from 'lucide-react';
import { NODE_DEFINITIONS, NodeType } from '@/data/nodeDefinitions';

interface BaseNodeProps {
  id: string;
  type: NodeType;
  data: {
    label: string;
    config?: any;
  };
  selected?: boolean;
  onEdit?: () => void;
}

const BaseNode: React.FC<BaseNodeProps> = ({ id, type, data, selected, onEdit }) => {
  const definition = NODE_DEFINITIONS[type];
  
  // Determine if node needs handles based on category
  const needsTargetHandle = definition.category !== 'Triggers';
  const needsSourceHandle = definition.category !== 'Endpoints';
  const isDecisionNode = definition.category === 'Logic';

  return (
    <div className={`relative bg-card border-2 rounded-lg px-4 py-3 min-w-[160px] shadow-lg transition-all ${
      selected ? 'border-primary shadow-primary/20' : 'border-border hover:border-primary/50'
    }`}>
      {needsTargetHandle && (
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 bg-primary border-2 border-background"
        />
      )}
      
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
        <Badge variant="secondary" className="text-xs font-medium mb-2">
          {definition.emoji} {definition.category}
        </Badge>
        <div className="text-sm font-semibold text-foreground leading-tight">
          {data.label}
        </div>
      </div>
      
      {data.config && (
        <div className="space-y-0.5">
          {Object.entries(data.config).slice(0, 2).map(([key, value]) => (
            <div key={key} className="text-xs text-muted-foreground">
              {typeof value === 'string' ? value.replace(/_/g, ' ') : String(value)}
            </div>
          ))}
        </div>
      )}
      
      {needsSourceHandle && (
        <>
          {isDecisionNode ? (
            <>
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
                className="w-3 h-3 bg-red-500 border-2 border-background"
                style={{ left: '75%' }}
              />
            </>
          ) : (
            <Handle
              type="source"
              position={Position.Bottom}
              className="w-3 h-3 bg-primary border-2 border-background"
            />
          )}
        </>
      )}
    </div>
  );
};

export default BaseNode;