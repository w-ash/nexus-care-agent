import React, { useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain } from 'lucide-react';
import { JourneyState } from '@/data/memberMockData';

// Import node types from campaign builder
import {
  GapTriggerNode,
  SmsNode,
  WaitNode,
  ResponseCheckNode,
  SuccessNode
} from '@/components/nodes/SpecificNodes';

interface PersonalizedJourneyProps {
  journeyState: JourneyState;
  simulationStep: number;
}

const nodeTypes = {
  gap_trigger: GapTriggerNode,
  sms: SmsNode,
  wait: WaitNode,
  response_check: ResponseCheckNode,
  success: SuccessNode,
};

const PersonalizedJourney: React.FC<PersonalizedJourneyProps> = ({ 
  journeyState, 
  simulationStep 
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(journeyState.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(journeyState.edges);

  // Enhanced node styling based on state
  const getNodeStyle = useCallback((node: Node) => {
    const baseStyle = {
      border: '2px solid',
      borderRadius: '8px',
      padding: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    };

    switch (node.data.state) {
      case 'completed':
        return {
          ...baseStyle,
          backgroundColor: '#E5E7EB',
          borderColor: '#9CA3AF',
          opacity: 0.7,
        };
      case 'current':
        return {
          ...baseStyle,
          backgroundColor: '#3B82F6',
          borderColor: '#1D4ED8',
          color: 'white',
          animation: 'pulse 2s infinite',
        };
      case 'scheduled':
        return {
          ...baseStyle,
          backgroundColor: '#FFFFFF',
          borderColor: '#9CA3AF',
          borderStyle: 'dashed',
        };
      default:
        if (node.data.isBundled) {
          return {
            ...baseStyle,
            backgroundColor: '#10B981',
            borderColor: '#059669',
            color: 'white',
          };
        }
        if (node.data.isAdapted) {
          return {
            ...baseStyle,
            backgroundColor: '#8B5CF6',
            borderColor: '#7C3AED',
            color: 'white',
          };
        }
        return baseStyle;
    }
  }, []);

  // Apply enhanced styling to nodes
  const styledNodes = nodes.map(node => ({
    ...node,
    style: getNodeStyle(node),
  }));

  // Enhanced edge styling
  const styledEdges = edges.map(edge => {
    const sourceNode = nodes.find(n => n.id === edge.source);
    const targetNode = nodes.find(n => n.id === edge.target);
    
    if (sourceNode?.data.state === 'completed' && targetNode?.data.state === 'completed') {
      return {
        ...edge,
        style: { stroke: '#9CA3AF', strokeWidth: 2 },
        animated: false,
      };
    }
    
    if (sourceNode?.data.state === 'current' || targetNode?.data.state === 'current') {
      return {
        ...edge,
        style: { stroke: '#3B82F6', strokeWidth: 3 },
        animated: true,
      };
    }
    
    if (targetNode?.data.state === 'scheduled') {
      return {
        ...edge,
        style: { stroke: '#9CA3AF', strokeWidth: 2, strokeDasharray: '5,5' },
        animated: false,
      };
    }

    return edge;
  });

  return (
    <Card className="h-[600px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Maria's Personalized Journey
          {simulationStep >= 2 && (
            <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
              AI Bundling Active
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-full">
        <div className="h-full w-full">
          <ReactFlow
            nodes={styledNodes}
            edges={styledEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
            attributionPosition="bottom-left"
            style={{ backgroundColor: '#F9FAFB' }}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
          >
            <MiniMap 
              zoomable 
              pannable 
              style={{
                backgroundColor: '#F3F4F6',
                border: '1px solid #E5E7EB',
              }}
            />
            <Controls 
              style={{
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
              }}
            />
            <Background 
              gap={20} 
              size={1} 
              color="#E5E7EB"
            />
          </ReactFlow>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalizedJourney;