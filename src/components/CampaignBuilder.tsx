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

const nodeTypes = {
  trigger: TriggerNode,
  outreach: OutreachNode,
  action: ActionNode,
  decision: DecisionNode,
  wait: WaitNode,
  knowledge: KnowledgeNode,
  end: EndNode,
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
      }
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
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
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
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node.id);
  }, []);

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
      data: getDefaultNodeData(nodeType),
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-semibold">Campaign Builder</h1>
          </div>
          <Button onClick={handleDeploy} disabled={!campaignName.trim()}>
            Deploy Campaign
          </Button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - React Flow Canvas */}
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
            className="bg-muted/5"
          >
            <Background />
            <Controls />
          </ReactFlow>

          {/* Node Palette */}
          <Card className="absolute bottom-4 left-4 w-80 shadow-lg border-muted/20">
            <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-primary/10">
              <CardTitle className="text-sm font-medium">Add Node</CardTitle>
            </CardHeader>
            <CardContent className="pt-3">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addNodeFromPalette('outreach')}
                  className="h-12 flex-col gap-1 text-xs hover:bg-blue-50 hover:border-blue-200 transition-colors"
                >
                  💬 Outreach
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addNodeFromPalette('decision')}
                  className="h-12 flex-col gap-1 text-xs hover:bg-purple-50 hover:border-purple-200 transition-colors"
                >
                  🤔 Decision
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addNodeFromPalette('wait')}
                  className="h-12 flex-col gap-1 text-xs hover:bg-amber-50 hover:border-amber-200 transition-colors"
                >
                  ⏰ Wait
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addNodeFromPalette('action')}
                  className="h-12 flex-col gap-1 text-xs hover:bg-teal-50 hover:border-teal-200 transition-colors"
                >
                  📅 Action
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addNodeFromPalette('knowledge')}
                  className="h-12 flex-col gap-1 text-xs hover:bg-pink-50 hover:border-pink-200 transition-colors"
                >
                  🧠 Knowledge
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addNodeFromPalette('end')}
                  className="h-12 flex-col gap-1 text-xs hover:bg-gray-50 hover:border-gray-200 transition-colors"
                >
                  ✅ End
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel */}
        <div className="w-96 border-l bg-card flex flex-col">
          {/* Node Configuration Panel */}
          {selectedNode && (() => {
            const node = nodes.find(n => n.id === selectedNode);
            if (!node) return null;
            
            return (
              <div className="p-4 border-b bg-muted/10">
                <h3 className="font-medium mb-3">Configure Node</h3>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="node-label">Node Label</Label>
                    <Input
                      id="node-label"
                      value={typeof node.data.label === 'string' ? node.data.label : ''}
                      onChange={(e) => updateNodeLabel(selectedNode, e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  {/* Outreach Node Configuration */}
                  {node.type === 'outreach' && (
                    <>
                      <div>
                        <Label htmlFor="channel">Channel Type</Label>
                        <Select 
                          value={(node.data.config as any)?.channel || 'sms'}
                          onValueChange={(value) => updateNodeConfig(selectedNode, { channel: value })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sms">SMS</SelectItem>
                            <SelectItem value="phone">Phone</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="mail">Direct Mail</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {(node.data.config as any)?.channel === 'sms' && (
                        <div>
                          <Label htmlFor="time-of-day">Time of Day</Label>
                          <Select 
                            value={(node.data.config as any)?.timeOfDay || 'morning'}
                            onValueChange={(value) => updateNodeConfig(selectedNode, { timeOfDay: value })}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="morning">Morning</SelectItem>
                              <SelectItem value="afternoon">Afternoon</SelectItem>
                              <SelectItem value="evening">Evening</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      
                      {(node.data.config as any)?.channel === 'phone' && (
                        <>
                          <div>
                            <Label htmlFor="call-type">Call Type</Label>
                            <Select 
                              value={(node.data.config as any)?.callType || 'automated'}
                              onValueChange={(value) => updateNodeConfig(selectedNode, { callType: value })}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="automated">Automated</SelectItem>
                                <SelectItem value="live_agent">Live Agent</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="max-attempts">Max Attempts</Label>
                            <Input
                              id="max-attempts"
                              type="number"
                              value={(node.data.config as any)?.maxAttempts || 3}
                              onChange={(e) => updateNodeConfig(selectedNode, { maxAttempts: parseInt(e.target.value) })}
                              className="mt-1"
                            />
                          </div>
                        </>
                      )}
                      
                      <div>
                        <Label htmlFor="template">Template</Label>
                        <Input
                          id="template"
                          value={(node.data.config as any)?.template || ''}
                          onChange={(e) => updateNodeConfig(selectedNode, { template: e.target.value })}
                          placeholder="e.g., reminder_friendly"
                          className="mt-1"
                        />
                      </div>
                    </>
                  )}
                  
                  {/* Wait Node Configuration */}
                  {node.type === 'wait' && (
                    <>
                      <div>
                        <Label htmlFor="duration">Duration</Label>
                        <Input
                          id="duration"
                          type="number"
                          value={(node.data.config as any)?.duration || 1}
                          onChange={(e) => updateNodeConfig(selectedNode, { duration: parseInt(e.target.value) })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="unit">Unit</Label>
                        <Select 
                          value={(node.data.config as any)?.unit || 'days'}
                          onValueChange={(value) => updateNodeConfig(selectedNode, { unit: value })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hours">Hours</SelectItem>
                            <SelectItem value="days">Days</SelectItem>
                            <SelectItem value="weeks">Weeks</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSelectedNode(null)}
                    className="w-full mt-3"
                  >
                    Close Configuration
                  </Button>
                </div>
              </div>
            );
          })()}

          {/* Chat Interface */}
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b">
              <h3 className="font-medium">AI Assistant</h3>
              <p className="text-sm text-muted-foreground">Describe your campaign workflow</p>
            </div>
            
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

            <form onSubmit={handleChatSubmit} className="p-4 border-t">
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

          <Separator />

          {/* Campaign Configuration Panel */}
          <div className="p-4 space-y-4 bg-muted/20">
            <h3 className="font-medium">Campaign Configuration</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="campaign-name">Campaign Name</Label>
                <Input
                  id="campaign-name"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="e.g., Mammogram Screening Q1 2025"
                />
              </div>

              <div>
                <Label htmlFor="priority">Priority & ROI</Label>
                <div className="flex gap-2">
                  <Input
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    placeholder="Medium"
                    className="flex-1"
                  />
                  <Input
                    value={estimatedROI}
                    onChange={(e) => setEstimatedROI(e.target.value)}
                    placeholder="380"
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label>Bundling Rules</Label>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="hba1c" 
                      checked={bundlingRules.hba1c}
                      onCheckedChange={(checked) => setBundlingRules(prev => ({ ...prev, hba1c: !!checked }))}
                    />
                    <Label htmlFor="hba1c" className="text-sm">HbA1c Testing</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="flu" 
                      checked={bundlingRules.fluShot}
                      onCheckedChange={(checked) => setBundlingRules(prev => ({ ...prev, fluShot: !!checked }))}
                    />
                    <Label htmlFor="flu" className="text-sm">Flu Shot</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="mammogram" 
                      checked={bundlingRules.mammogram}
                      onCheckedChange={(checked) => setBundlingRules(prev => ({ ...prev, mammogram: !!checked }))}
                    />
                    <Label htmlFor="mammogram" className="text-sm">Mammogram</Label>
                  </div>
                </div>
              </div>

              <div>
                <Label>A/B Split: {splitPercentage[0]}% AI Agent</Label>
                <Slider
                  value={splitPercentage}
                  onValueChange={setSplitPercentage}
                  max={100}
                  step={5}
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignBuilder;