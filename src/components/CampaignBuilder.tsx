import React, { useState, useCallback } from 'react';
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Node,
  Edge,
  Connection,
  Position,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, Plus, ArrowLeft } from 'lucide-react';
import TriggerNode from './nodes/TriggerNode';
import OutreachNode from './nodes/OutreachNode';
import ActionNode from './nodes/ActionNode';
import DecisionNode from './nodes/DecisionNode';
import WaitNode from './nodes/WaitNode';
import KnowledgeNode from './nodes/KnowledgeNode';
import EndNode from './nodes/EndNode';
import NodeConfigurationModal from './NodeConfigurationModal';
import CampaignConfiguration from './CampaignConfiguration';

const nodeTypes = {
  trigger: (props: any) => <TriggerNode {...props} onEdit={() => props.data.onEdit?.(props.id)} />,
  outreach: (props: any) => <OutreachNode {...props} onEdit={() => props.data.onEdit?.(props.id)} />,
  action: (props: any) => <ActionNode {...props} onEdit={() => props.data.onEdit?.(props.id)} />,
  decision: (props: any) => <DecisionNode {...props} onEdit={() => props.data.onEdit?.(props.id)} />,
  wait: (props: any) => <WaitNode {...props} onEdit={() => props.data.onEdit?.(props.id)} />,
  knowledge: (props: any) => <KnowledgeNode {...props} onEdit={() => props.data.onEdit?.(props.id)} />,
  end: (props: any) => <EndNode {...props} onEdit={() => props.data.onEdit?.(props.id)} />,
};

const initialNodes: Node[] = [
  {
    id: 'start',
    type: 'trigger',
    position: { x: 100, y: 100 },
    data: { 
      label: 'Campaign Start', 
      category: '🎯 Triggers',
      config: {
        gapType: 'General',
        daysOverdue: 0
      },
      onEdit: (nodeId: string) => {} // Will be replaced in component
    },
  },
];

const initialEdges: Edge[] = [];

interface CampaignBuilderProps {
  onBack: () => void;
  onSave?: (campaign: any) => void;
}

const CampaignBuilder: React.FC<CampaignBuilderProps> = ({ onBack, onSave }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ type: 'user' | 'ai', message: string }>>([
    { type: 'ai', message: 'Hi! I can help you create a campaign workflow. Try: "Create a mammogram screening campaign for women 40-74 who are overdue. For women 40-49, send educational SMS first, then scheduling help. For 50+, go straight to scheduling. Try SMS, wait 5 days, then phone call."' }
  ]);

  // Campaign configuration state
  const [campaignName, setCampaignName] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [estimatedROI, setEstimatedROI] = useState('380');
  const [bundlingRules, setBundlingRules] = useState({
    hba1c: true,
    fluShot: true,
    bloodPressure: false,
    mammogram: true,
  });
  const [splitPercentage, setSplitPercentage] = useState([25]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({
      ...params,
      style: { strokeWidth: 2, stroke: 'hsl(var(--primary))' },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'hsl(var(--primary))' }
    }, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    // Node click disabled - editing only through pencil icon
  }, []);

  const handleNodeEdit = useCallback((nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      setSelectedNode(node);
      setIsModalOpen(true);
    }
  }, [nodes]);

  // Update initial nodes with edit callback after component mounts
  React.useEffect(() => {
    setNodes(nodes => nodes.map(node => ({
      ...node,
      data: { ...node.data, onEdit: handleNodeEdit }
    })));
  }, [handleNodeEdit]);

  const updateNodeConfig = (nodeId: string, newConfig: any) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId 
        ? { 
            ...node, 
            data: { 
              ...node.data, 
              config: { 
                ...(typeof node.data.config === 'object' && node.data.config !== null ? node.data.config : {}), 
                ...newConfig 
              } 
            } 
          }
        : node
    ));
  };

  const updateNodeLabel = (nodeId: string, newLabel: string) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId 
        ? { ...node, data: { ...node.data, label: newLabel } }
        : node
    ));
  };

  const handleModalSave = (nodeId: string, label: string, config: any) => {
    updateNodeLabel(nodeId, label);
    updateNodeConfig(nodeId, config);
    setIsModalOpen(false);
    setSelectedNode(null);
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    // Add user message to chat
    setChatHistory(prev => [...prev, { type: 'user', message: chatInput }]);

    // Process keywords and generate comprehensive mammogram workflow
    const input = chatInput.toLowerCase();
    let aiResponse = "I've analyzed your request and created a complete mammogram screening workflow. ";
    let newNodes: Node[] = [];
    let newEdges: Edge[] = [];

    if (input.includes('create a mammogram screening campaign')) {
      // Generate the complete mammogram workflow as specified
      const workflowNodes = [
        {
          id: 'trigger_mammogram',
          type: 'trigger',
          position: { x: 100, y: 200 },
          data: {
            label: 'Mammogram Overdue',
            category: '🎯 Triggers',
            config: {
              gapType: 'Mammogram',
              daysOverdue: 365,
              gender: 'female',
              ageRange: { min: 40, max: 74 }
            }
          }
        },
        {
          id: 'age_check',
          type: 'decision',
          position: { x: 300, y: 200 },
          data: {
            label: 'Age Group Check',
            category: '🤔 Decisions',
            config: {
              condition: 'age',
              branches: [
                { operator: '<', value: 50, label: '40-49' },
                { operator: '>=', value: 50, label: '50+' }
              ]
            }
          }
        },
        {
          id: 'sms_education',
          type: 'outreach',
          position: { x: 500, y: 100 },
          data: {
            label: 'Educational SMS',
            category: '💬 Outreach',
            config: {
              channel: 'sms',
              template: 'mammogram_guidelines_40s',
              timeOfDay: 'morning'
            }
          }
        },
        {
          id: 'wait_edu',
          type: 'wait',
          position: { x: 700, y: 100 },
          data: {
            label: 'Wait 2 Days',
            category: '⏰ Wait',
            config: { duration: 2, unit: 'days' }
          }
        },
        {
          id: 'sms_schedule_young',
          type: 'outreach',
          position: { x: 900, y: 100 },
          data: {
            label: 'Scheduling SMS',
            category: '💬 Outreach',
            config: {
              channel: 'sms',
              template: 'schedule_mammogram'
            }
          }
        },
        {
          id: 'sms_schedule_older',
          type: 'outreach',
          position: { x: 500, y: 300 },
          data: {
            label: 'Scheduling SMS',
            category: '💬 Outreach',
            config: {
              channel: 'sms',
              template: 'schedule_mammogram_urgent'
            }
          }
        },
        {
          id: 'wait_main',
          type: 'wait',
          position: { x: 700, y: 250 },
          data: {
            label: 'Wait 5 Days',
            category: '⏰ Wait',
            config: { duration: 5, unit: 'days' }
          }
        },
        {
          id: 'phone_followup',
          type: 'outreach',
          position: { x: 900, y: 250 },
          data: {
            label: 'Phone Follow-up',
            category: '💬 Outreach',
            config: {
              channel: 'phone',
              callType: 'automated'
            }
          }
        },
        {
          id: 'response_check',
          type: 'decision',
          position: { x: 1100, y: 250 },
          data: {
            label: 'Response Check',
            category: '🤔 Decisions',
            config: {
              condition: 'response_received',
              branches: [
                { value: true, label: 'Responded' },
                { value: false, label: 'No Response' }
              ]
            }
          }
        },
        {
          id: 'end_success',
          type: 'end',
          position: { x: 1300, y: 200 },
          data: {
            label: 'Campaign Complete',
            category: '✅ End',
            config: { outcome: 'success' }
          }
        },
        {
          id: 'end_incomplete',
          type: 'end',
          position: { x: 1300, y: 350 },
          data: {
            label: 'Max Attempts',
            category: '✅ End',
            config: { outcome: 'incomplete' }
          }
        }
      ];

      const workflowEdges = [
        { id: 'e1', source: 'trigger_mammogram', target: 'age_check' },
        { id: 'e2', source: 'age_check', target: 'sms_education', sourceHandle: 'true', label: '40-49' },
        { id: 'e3', source: 'age_check', target: 'sms_schedule_older', sourceHandle: 'false', label: '50+' },
        { id: 'e4', source: 'sms_education', target: 'wait_edu' },
        { id: 'e5', source: 'wait_edu', target: 'sms_schedule_young' },
        { id: 'e6', source: 'sms_schedule_young', target: 'wait_main' },
        { id: 'e7', source: 'sms_schedule_older', target: 'wait_main' },
        { id: 'e8', source: 'wait_main', target: 'phone_followup' },
        { id: 'e9', source: 'phone_followup', target: 'response_check' },
        { id: 'e10', source: 'response_check', target: 'end_success', sourceHandle: 'true', label: 'Responded' },
        { id: 'e11', source: 'response_check', target: 'end_incomplete', sourceHandle: 'false', label: 'No Response' }
      ];

      newNodes = workflowNodes;
      newEdges = workflowEdges;
      aiResponse = "Created complete mammogram screening workflow with age-based branching, educational messaging for younger women, SMS/phone progression, and proper end states.";
    }

    // Handle high-risk branch addition
    if (input.includes('high-risk') || input.includes('family history')) {
      const riskNodes = [
        {
          id: `knowledge_risk_${Date.now()}`,
          type: 'knowledge',
          position: { x: 50, y: 350 },
          data: {
            label: 'Check Family History',
            category: '🧠 Knowledge',
            config: {
              dataSource: 'health_data_engine',
              check: 'breast_cancer_family_history'
            }
          }
        },
        {
          id: `risk_check_${Date.now()}`,
          type: 'decision',
          position: { x: 200, y: 350 },
          data: {
            label: 'Risk Assessment',
            category: '🤔 Decisions',
            config: {
              condition: 'family_history',
              branches: [
                { value: 'high_risk', label: 'High Risk' },
                { value: 'normal', label: 'Normal Risk' }
              ]
            }
          }
        },
        {
          id: `phone_urgent_${Date.now()}`,
          type: 'outreach',
          position: { x: 400, y: 450 },
          data: {
            label: 'Urgent Phone Call',
            category: '💬 Outreach',
            config: {
              channel: 'phone',
              callType: 'live_agent',
              priority: 'high'
            }
          }
        }
      ];

      newNodes = [...newNodes, ...riskNodes];
      aiResponse += " Added high-risk pathway with family history check and urgent phone outreach.";
    }

    // Replace all nodes and edges for mammogram campaign
    if (newNodes.length > 0) {
      setNodes(newNodes);
      setEdges(newEdges);
    } else {
      aiResponse = "I didn't recognize specific actions in your message. You can drag nodes from the palette below to build your workflow manually.";
    }

    // Add AI response to chat
    setChatHistory(prev => [...prev, { type: 'ai', message: aiResponse }]);
    setChatInput('');
  };

  const addNodeFromPalette = (nodeType: string) => {
    const newNode: Node = {
      id: `${nodeType}-${Date.now()}`,
      type: nodeType,
      position: { x: Math.random() * 300 + 100, y: Math.random() * 200 + 200 },
      data: { ...getDefaultNodeData(nodeType), onEdit: handleNodeEdit },
    };
    setNodes(prev => [...prev, newNode]);
  };

  const getDefaultNodeData = (nodeType: string) => {
    switch (nodeType) {
      case 'outreach':
        return { 
          label: 'Send Message', 
          category: '💬 Outreach',
          config: { channel: 'sms', template: 'default_reminder' }
        };
      case 'action':
        return { 
          label: 'Schedule Appointment', 
          category: '📅 Actions',
          config: { appointmentType: 'general', schedulingMethod: 'auto' }
        };
      case 'decision':
        return { 
          label: 'Check Condition', 
          category: '🤔 Decisions',
          config: { 
            condition: 'age', 
            branches: [
              { operator: '>=', value: 50, label: 'Over 50' },
              { operator: '<', value: 50, label: 'Under 50' }
            ]
          }
        };
      case 'wait':
        return { 
          label: 'Wait Period', 
          category: '⏰ Wait',
          config: { duration: 3, unit: 'days' }
        };
      case 'knowledge':
        return {
          label: 'Check Data',
          category: '🧠 Knowledge',
          config: { dataSource: 'health_data_engine', check: 'previous_screening' }
        };
      case 'end':
        return {
          label: 'End Campaign',
          category: '✅ End',
          config: { outcome: 'success' }
        };
      default:
        return { label: 'New Node', category: '🎯 Triggers' };
    }
  };

  const handleDeploy = () => {
    const campaignData = {
      id: `campaign-${Date.now()}`,
      name: campaignName || 'Untitled Campaign',
      priority,
      estimatedROI: parseInt(estimatedROI),
      bundlingRules,
      splitPercentage: splitPercentage[0],
      nodes,
      edges,
      status: 'deployed',
      createdAt: new Date().toISOString(),
    };

    if (onSave) {
      onSave(campaignData);
    }
    onBack();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card px-6 py-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-semibold">Campaign Builder</h1>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Campaign Configuration */}
        <div className="w-80 border-r bg-card">
          <CampaignConfiguration
            campaignName={campaignName}
            setCampaignName={setCampaignName}
            priority={priority}
            setPriority={setPriority}
            estimatedROI={estimatedROI}
            setEstimatedROI={setEstimatedROI}
            bundlingRules={bundlingRules}
            setBundlingRules={setBundlingRules}
            splitPercentage={splitPercentage}
            setSplitPercentage={setSplitPercentage}
            onDeploy={handleDeploy}
            isDeployDisabled={!campaignName.trim()}
          />
        </div>

        {/* Center Panel - React Flow Canvas */}
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            defaultViewport={{ x: 0, y: 0, zoom: 0.5 }}
            fitViewOptions={{ padding: 0.1, maxZoom: 0.5 }}
            className="bg-muted/5"
          >
            <Background />
            <Controls />
          </ReactFlow>

          {/* Node Palette - Minimizable */}
          {isPaletteOpen && (
            <>
              {/* Backdrop for click-away */}
              <div 
                className="absolute inset-0 z-10" 
                onClick={() => setIsPaletteOpen(false)}
              />
              <Card className="absolute bottom-20 right-4 w-80 shadow-lg border-muted/20 z-20 animate-scale-in">
                <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-primary/10">
                  <CardTitle className="text-sm font-medium">Add Node</CardTitle>
                </CardHeader>
                <CardContent className="pt-3">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        addNodeFromPalette('outreach');
                        setIsPaletteOpen(false);
                      }}
                      className="h-12 flex-col gap-1 text-xs hover:bg-blue-50 hover:border-blue-200 transition-colors"
                    >
                      💬 Outreach
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        addNodeFromPalette('decision');
                        setIsPaletteOpen(false);
                      }}
                      className="h-12 flex-col gap-1 text-xs hover:bg-purple-50 hover:border-purple-200 transition-colors"
                    >
                      🤔 Decision
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        addNodeFromPalette('wait');
                        setIsPaletteOpen(false);
                      }}
                      className="h-12 flex-col gap-1 text-xs hover:bg-amber-50 hover:border-amber-200 transition-colors"
                    >
                      ⏰ Wait
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        addNodeFromPalette('action');
                        setIsPaletteOpen(false);
                      }}
                      className="h-12 flex-col gap-1 text-xs hover:bg-teal-50 hover:border-teal-200 transition-colors"
                    >
                      📅 Action
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        addNodeFromPalette('knowledge');
                        setIsPaletteOpen(false);
                      }}
                      className="h-12 flex-col gap-1 text-xs hover:bg-pink-50 hover:border-pink-200 transition-colors"
                    >
                      🧠 Knowledge
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        addNodeFromPalette('end');
                        setIsPaletteOpen(false);
                      }}
                      className="h-12 flex-col gap-1 text-xs hover:bg-gray-50 hover:border-gray-200 transition-colors"
                    >
                      ✅ End
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Add Node Button */}
          <Button
            onClick={() => setIsPaletteOpen(!isPaletteOpen)}
            className="absolute bottom-4 right-4 w-12 h-12 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground hover:scale-110 transition-all duration-200 z-30"
            size="icon"
          >
            <Plus className={`w-6 h-6 transition-transform duration-200 ${isPaletteOpen ? 'rotate-45' : ''}`} />
          </Button>
        </div>

        {/* Right Panel - AI Assistant */}
        <div className="w-96 border-l bg-card flex flex-col max-h-full">
          {/* Chat Interface */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b">
              <h3 className="font-medium">AI Assistant</h3>
              <p className="text-sm text-muted-foreground">Describe your campaign workflow</p>
            </div>
            
            {/* Scrollable Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatHistory.map((message, index) => (
                <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                    message.type === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}>
                    {message.message}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer with Input */}
            <div className="p-4 border-t">
              <form onSubmit={handleChatSubmit}>
                <div className="flex gap-2">
                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Describe your campaign..."
                    className="flex-1"
                  />
                  <Button type="submit" size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <NodeConfigurationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedNode(null);
        }}
        node={selectedNode}
        onSave={handleModalSave}
      />
    </div>
  );
};

export default CampaignBuilder;