import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';
import { Database, Search, FileText, Heart } from 'lucide-react';

interface KnowledgeNodeData {
  label: string;
  category: string;
  config?: {
    dataSource: string;
    check: string;
    timeframe?: string;
  };
}

interface KnowledgeNodeProps {
  data: KnowledgeNodeData;
  selected?: boolean;
}

const KnowledgeNode: React.FC<KnowledgeNodeProps> = ({ data, selected }) => {
  const getIcon = () => {
    switch (data.config?.dataSource) {
      case 'health_data_engine': return <Heart className="h-3 w-3 text-white" />;
      case 'member_profile': return <FileText className="h-3 w-3 text-white" />;
      default: return <Database className="h-3 w-3 text-white" />;
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
        <div className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center">
          {getIcon()}
        </div>
        <Badge variant="secondary" className="text-xs font-medium">🧠 Knowledge</Badge>
      </div>
      
      <div className="text-sm font-semibold text-foreground mb-1">
        {data.label}
      </div>
      
      {data.config?.check && (
        <div className="text-xs text-muted-foreground mb-1">
          {data.config.check.replace(/_/g, ' ')}
        </div>
      )}
      
      {data.config?.timeframe && (
        <div className="text-xs text-muted-foreground">
          {data.config.timeframe.replace(/_/g, ' ')}
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

export default KnowledgeNode;