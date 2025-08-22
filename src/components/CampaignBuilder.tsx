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
import { Send, Plus, ArrowLeft } from 'lucide-react';
import TriggerNode from './nodes/TriggerNode';
import ActionNode from './nodes/ActionNode';
import DecisionNode from './nodes/DecisionNode';
import WaitNode from './nodes/WaitNode';

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  decision: DecisionNode,
  wait: WaitNode,
};

const initialNodes: Node[] = [
  {
    id: 'start',
    type: 'trigger',
    position: { x: 250, y: 50 },
    data: { label: 'Campaign Start', trigger: 'member_eligible' },
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
    { type: 'ai', message: 'Hi! I can help you create a campaign workflow. Try describing your campaign in natural language, like: "Send SMS to members over 50, wait 3 days, then call those who didn\'t respond"' }
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

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    // Add user message to chat
    setChatHistory(prev => [...prev, { type: 'user', message: chatInput }]);

    // Process keywords and generate nodes
    const input = chatInput.toLowerCase();
    let aiResponse = "I've analyzed your request. ";
    let newNodes: Node[] = [];

    // Keyword matching logic
    if (input.includes('mammogram') || input.includes('screening')) {
      newNodes.push({
        id: `action-${Date.now()}`,
        type: 'action',
        position: { x: 250, y: 150 },
        data: { label: 'Mammogram Outreach', actionType: 'sms', message: 'Time for your mammogram screening' },
      });
      aiResponse += "Created mammogram outreach action. ";
    }

    if (input.includes('age') || input.includes('40-49') || input.includes('50+')) {
      newNodes.push({
        id: `decision-${Date.now()}`,
        type: 'decision',
        position: { x: 400, y: 150 },
        data: { label: 'Age Check', condition: 'age >= 50', trueLabel: '50+', falseLabel: '40-49' },
      });
      aiResponse += "Added age-based decision point. ";
    }

    if (input.includes('sms')) {
      newNodes.push({
        id: `action-sms-${Date.now()}`,
        type: 'action',
        position: { x: 250, y: 250 },
        data: { label: 'Send SMS', actionType: 'sms', message: 'Healthcare reminder' },
      });
      aiResponse += "Added SMS action. ";
    }

    if (input.includes('wait') || input.includes('days')) {
      const waitMatch = input.match(/wait (\d+) days?/);
      const days = waitMatch ? waitMatch[1] : '5';
      newNodes.push({
        id: `wait-${Date.now()}`,
        type: 'wait',
        position: { x: 400, y: 250 },
        data: { label: `Wait ${days} Days`, duration: parseInt(days) },
      });
      aiResponse += `Added ${days}-day wait period. `;
    }

    if (input.includes('phone') || input.includes('call')) {
      newNodes.push({
        id: `action-phone-${Date.now()}`,
        type: 'action',
        position: { x: 550, y: 250 },
        data: { label: 'Phone Call', actionType: 'phone', message: 'Follow-up call' },
      });
      aiResponse += "Added phone call action. ";
    }

    // Add new nodes to the flow
    if (newNodes.length > 0) {
      setNodes(prev => [...prev, ...newNodes]);
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
      case 'action':
        return { label: 'New Action', actionType: 'sms', message: 'Default message' };
      case 'decision':
        return { label: 'Decision Point', condition: 'age >= 50', trueLabel: 'Yes', falseLabel: 'No' };
      case 'wait':
        return { label: 'Wait Period', duration: 3 };
      default:
        return { label: 'New Node' };
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
          <Card className="absolute bottom-4 left-4 w-80">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Node Palette</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addNodeFromPalette('action')}
                  className="h-12 flex-col gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Action
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addNodeFromPalette('decision')}
                  className="h-12 flex-col gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Decision
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addNodeFromPalette('wait')}
                  className="h-12 flex-col gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Wait
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addNodeFromPalette('action')}
                  className="h-12 flex-col gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Phone
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel */}
        <div className="w-96 border-l bg-card flex flex-col">
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

          {/* Configuration Panel */}
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