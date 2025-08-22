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
import { Send, Plus } from 'lucide-react';
import Header from '@/components/ui/header';
import { NODE_DEFINITIONS, NODE_CATEGORIES, NodeType } from '@/data/nodeDefinitions';
import {
  GapTriggerNode,
  EnrollmentTriggerNode,
  HealthEventNode,
  SmsNode,
  EmailNode,
  PhoneNode,
  MailNode,
  AgeCheckNode,
  ResponseCheckNode,
  RiskCheckNode,
  HistoryCheckNode,
  WaitNode,
  ScheduleTimeNode,
  ScheduleAppointmentNode,
  EscalateNode,
  UpdateRecordNode,
  AddTagNode,
  SuccessNode,
  IncompleteNode
} from './nodes/SpecificNodes';
import NodeConfigurationModal from './NodeConfigurationModal';
import CampaignConfiguration from './CampaignConfiguration';

// Generate nodeTypes object from NODE_DEFINITIONS
const nodeTypes = Object.keys(NODE_DEFINITIONS).reduce((acc, nodeType) => {
  const componentMap: any = {
    gap_trigger: GapTriggerNode,
    enrollment_trigger: EnrollmentTriggerNode,
    health_event: HealthEventNode,
    sms: SmsNode,
    email: EmailNode,
    phone: PhoneNode,
    mail: MailNode,
    age_check: AgeCheckNode,
    response_check: ResponseCheckNode,
    risk_check: RiskCheckNode,
    history_check: HistoryCheckNode,
    wait: WaitNode,
    schedule_time: ScheduleTimeNode,
    schedule_appointment: ScheduleAppointmentNode,
    escalate: EscalateNode,
    update_record: UpdateRecordNode,
    add_tag: AddTagNode,
    success: SuccessNode,
    incomplete: IncompleteNode
  };
  
  const Component = componentMap[nodeType];
  if (Component) {
    acc[nodeType] = (props: any) => <Component {...props} onEdit={() => props.data.onEdit?.(props.id)} />;
  }
  return acc;
}, {} as any);

const initialNodes: Node[] = [
  {
    id: 'start',
    type: 'gap_trigger',
    position: { x: 100, y: 100 },
    data: { 
      label: 'Campaign Start', 
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
  onNavigateHome: () => void;
}

const CampaignBuilder: React.FC<CampaignBuilderProps> = ({ onBack, onSave, onNavigateHome }) => {
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
    selectedCampaigns: []
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
          type: 'gap_trigger',
          position: { x: 100, y: 200 },
          data: {
            label: 'Mammogram Overdue',
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
          type: 'age_check',
          position: { x: 300, y: 200 },
          data: {
            label: 'Age Group Check',
            config: {
              branches: [
                { operator: '<', value: 50, label: '40-49' },
                { operator: '>=', value: 50, label: '50+' }
              ]
            }
          }
        },
        {
          id: 'sms_education',
          type: 'sms',
          position: { x: 500, y: 100 },
          data: {
            label: 'Educational SMS',
            config: {
              template: 'mammogram_guidelines_40s',
              timing: 'morning'
            }
          }
        },
        {
          id: 'wait_edu',
          type: 'wait',
          position: { x: 700, y: 100 },
          data: {
            label: 'Wait 2 Days',
            config: { duration: 2, unit: 'days' }
          }
        },
        {
          id: 'sms_schedule_young',
          type: 'sms',
          position: { x: 900, y: 100 },
          data: {
            label: 'Scheduling SMS',
            config: {
              template: 'schedule_mammogram'
            }
          }
        },
        {
          id: 'sms_schedule_older',
          type: 'sms',
          position: { x: 500, y: 300 },
          data: {
            label: 'Scheduling SMS',
            config: {
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
            config: { duration: 5, unit: 'days' }
          }
        },
        {
          id: 'phone_followup',
          type: 'phone',
          position: { x: 900, y: 250 },
          data: {
            label: 'Phone Follow-up',
            config: {
              callType: 'automated'
            }
          }
        },
        {
          id: 'response_check',
          type: 'response_check',
          position: { x: 1100, y: 250 },
          data: {
            label: 'Response Check',
            config: {
              responseType: 'any',
              waitHours: 48
            }
          }
        },
        {
          id: 'end_success',
          type: 'success',
          position: { x: 1300, y: 200 },
          data: {
            label: 'Campaign Complete',
            config: { outcome: 'appointment_scheduled' }
          }
        },
        {
          id: 'end_incomplete',
          type: 'incomplete',
          position: { x: 1300, y: 350 },
          data: {
            label: 'Max Attempts',
            config: { 
              reason: 'max_attempts',
              followUpAction: 'retry_next_quarter'
            }
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
          type: 'history_check',
          position: { x: 50, y: 350 },
          data: {
            label: 'Check Family History',
            config: {
              checkType: 'family_history',
              lookback: 'all_time'
            }
          }
        },
        {
          id: `risk_check_${Date.now()}`,
          type: 'risk_check',
          position: { x: 200, y: 350 },
          data: {
            label: 'Risk Assessment',
            config: {
              riskModel: 'Clinical',
              branches: ['high', 'medium', 'low']
            }
          }
        },
        {
          id: `phone_urgent_${Date.now()}`,
          type: 'phone',
          position: { x: 400, y: 450 },
          data: {
            label: 'Urgent Phone Call',
            config: {
              callType: 'live_agent',
              maxAttempts: 3,
              leaveVoicemail: false
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

  const addNodeFromPalette = (nodeType: NodeType) => {
    const newNode: Node = {
      id: `${nodeType}-${Date.now()}`,
      type: nodeType,
      position: { x: Math.random() * 300 + 100, y: Math.random() * 200 + 200 },
      data: { ...getDefaultNodeData(nodeType), onEdit: handleNodeEdit },
    };
    setNodes(prev => [...prev, newNode]);
  };

  const getDefaultNodeData = (nodeType: NodeType) => {
    const definition = NODE_DEFINITIONS[nodeType];
    if (!definition) {
      return { label: 'New Node', config: {} };
    }
    
    // Create default config based on schema
    const defaultConfig: any = {};
    Object.entries(definition.configSchema).forEach(([key, schema]: [string, any]) => {
      if ('default' in schema) {
        defaultConfig[key] = schema.default;
      } else if (schema.type === 'select' && schema.options) {
        defaultConfig[key] = schema.options[0];
      } else if (schema.type === 'boolean') {
        defaultConfig[key] = false;
      } else if (schema.type === 'number') {
        defaultConfig[key] = 1;
      }
    });
    
    return {
      label: definition.defaultLabel,
      config: defaultConfig
    };
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
    <div className="h-screen bg-background flex flex-col">
      <Header 
        onTitleClick={onNavigateHome}
        showCreateButton={false}
        showSimulateButton={false}
        showResetButton={false}
      />
      <div className="border-b bg-card px-6 py-2">
        <Button variant="ghost" size="sm" onClick={onBack} className="text-primary hover:text-primary/80">
          ← Back to Dashboard
        </Button>
      </div>
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Campaign Configuration */}
        <div className="w-80 border-r bg-card flex flex-col">
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
        <div className="flex-1 relative overflow-hidden">
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
              <Card className="absolute bottom-20 right-4 w-80 max-h-[70vh] shadow-lg border-muted/20 z-20 animate-scale-in flex flex-col">
                <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-primary/10 flex-shrink-0">
                  <CardTitle className="text-sm font-medium">Add Node</CardTitle>
                </CardHeader>
                <CardContent className="pt-3 flex-1 overflow-y-auto min-h-0">
                   <div className="space-y-3">
                     {Object.entries(NODE_CATEGORIES).map(([category, nodes]) => (
                       <div key={category}>
                         <h4 className="text-xs font-medium text-muted-foreground mb-2">{category}</h4>
                         <div className="space-y-1">
                           {nodes.map((node) => (
                             <Button
                               key={node.type}
                               variant="outline"
                               size="sm"
                               onClick={() => {
                                 addNodeFromPalette(node.type as NodeType);
                                 setIsPaletteOpen(false);
                               }}
                               className="w-full h-10 flex items-center justify-start gap-3 px-3 text-sm hover:bg-primary/5 hover:border-primary/20 transition-colors"
                               title={node.description}
                             >
                               <span className="text-base flex-shrink-0">{node.emoji}</span>
                               <span className="text-left truncate">{node.label}</span>
                             </Button>
                           ))}
                         </div>
                       </div>
                     ))}
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
        <div className="w-96 border-l bg-card flex flex-col h-full">
          {/* Fixed Header */}
          <div className="flex-shrink-0 p-4 border-b">
            <h3 className="font-medium">AI Assistant</h3>
            <p className="text-sm text-muted-foreground">Describe your campaign workflow</p>
          </div>
          
          {/* Scrollable Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
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

          {/* Fixed Footer with Input */}
          <div className="flex-shrink-0 p-4 border-t">
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