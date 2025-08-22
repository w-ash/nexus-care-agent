import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Header from '@/components/ui/header';
import MemberInfo from '@/components/member/LeftPanel/MemberInfo';
import ActiveCampaigns from '@/components/member/LeftPanel/ActiveCampaigns';
import MemberTimeline from '@/components/member/LeftPanel/MemberTimeline';
import SimulationControls from '@/components/member/LeftPanel/SimulationControls';
import PersonalizedJourney from '@/components/member/CenterPanel/PersonalizedJourney';
import JourneyLegend from '@/components/member/CenterPanel/JourneyLegend';
import AgentHistory from '@/components/member/RightPanel/AgentHistory';
import { getMemberMockData, getInitialJourneyState, AgentDecision, Interaction } from '@/data/memberMockData';

const MemberDetail: React.FC = () => {
  const { memberId } = useParams<{ memberId: string }>();
  const navigate = useNavigate();
  
  const [member, setMember] = useState(getMemberMockData(memberId || 'maria'));
  const [journeyState, setJourneyState] = useState(getInitialJourneyState());
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ type: 'user' | 'ai', message: string }>>([
    { type: 'ai', message: 'Hello! I\'m analyzing Maria\'s care gaps and looking for optimization opportunities. I can explain my decisions or adapt based on your guidance.' }
  ]);
  const [agentHistory, setAgentHistory] = useState<AgentDecision[]>([
    {
      timestamp: new Date('2025-01-15T09:00:00Z'),
      action: 'Campaign Application',
      reasoning: 'Applied HbA1c campaign template for member with 95-day gap. Initial SMS sent at preferred evening time.',
      affectedGaps: ['HbA1c'],
      outcome: 'pending'
    }
  ]);
  const [timeline, setTimeline] = useState<Interaction[]>([
    {
      date: new Date('2025-01-15T19:30:00Z'),
      type: 'outreach',
      channel: 'sms',
      content: 'Hi Maria! Your HbA1c test is due. Schedule at Riverside Medical: bit.ly/schedule-hba1c Reply STOP to opt out.',
      status: 'delivered'
    }
  ]);
  const [simulationStep, setSimulationStep] = useState(1);

  const handleBackToDashboard = () => {
    navigate('/');
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    // Add user message to chat
    setChatHistory(prev => [...prev, { type: 'user', message: chatInput }]);
    
    // Simulate agent response
    setTimeout(() => {
      const aiResponse = `I understand. I'll incorporate your guidance: "${chatInput}" into Maria's journey. This will help improve the personalization.`;
      setChatHistory(prev => [...prev, { type: 'ai', message: aiResponse }]);
    }, 1000);
    
    setChatInput('');
  };

  const handleSimulateNext = () => {
    setSimulationStep(prev => Math.min(prev + 1, 5));
    
    if (simulationStep === 1) {
      // Step 2: AI Detects Bundling Opportunity
      const bundlingDecision: AgentDecision = {
        timestamp: new Date(),
        action: 'Campaign Bundling Decision',
        reasoning: 'Detected opportunity to bundle HbA1c and Mammogram. Both procedures available at Riverside Medical. Member prefers fewer communications. Bundling increases completion rate by 40%.',
        affectedGaps: ['HbA1c', 'Mammogram'],
        outcome: 'pending'
      };
      
      setAgentHistory(prev => [bundlingDecision, ...prev]);
      
      // Update journey to show bundled approach
      setJourneyState(prev => ({
        ...prev,
        currentNodeId: 'bundled_sms_1'
      }));
    }
  };

  const handleSimulateResponse = (response: string) => {
    const responseInteraction: Interaction = {
      date: new Date(),
      type: 'response',
      channel: 'sms',
      content: response,
      status: 'delivered'
    };
    
    setTimeline(prev => [responseInteraction, ...prev]);
  };

  const handleReset = () => {
    setSimulationStep(1);
    setJourneyState(getInitialJourneyState());
    setAgentHistory(agentHistory.slice(-1)); // Keep only initial decision
    setTimeline(timeline.slice(-1)); // Keep only initial SMS
  };

  if (!member) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          onTitleClick={handleBackToDashboard}
          showCreateButton={false}
          showSimulateButton={false}
          showResetButton={false}
        />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Member not found</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header 
        onTitleClick={handleBackToDashboard}
        showCreateButton={false}
        showSimulateButton={false}
        showResetButton={false}
      />

      <div className="flex-1 flex">
        {/* Left Panel - Member Information & Controls */}
        <div className="w-96 border-r bg-card overflow-y-auto">
          <div className="p-6 space-y-6">
            <MemberInfo member={member} />
            <ActiveCampaigns 
              campaigns={member.activeCampaigns}
              bundledGaps={simulationStep >= 2 ? ['HbA1c', 'Mammogram'] : []}
            />
            <MemberTimeline interactions={timeline} />
            <SimulationControls
              currentStep={simulationStep}
              totalSteps={5}
              onSimulateNext={handleSimulateNext}
              onSimulateResponse={handleSimulateResponse}
              onReset={handleReset}
            />
          </div>
        </div>

        {/* Center Panel - Journey Visualization */}
        <div className="flex-1 p-6">
          <div className="h-full space-y-6">
            <PersonalizedJourney 
              journeyState={journeyState}
              simulationStep={simulationStep}
            />
            <JourneyLegend />
          </div>
        </div>

        {/* Right Panel - Agent History & AI Assistant */}
        <div className="w-96 border-l bg-card flex flex-col h-full">
          {/* Agent History - Top Half */}
          <div className="flex-1 overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="font-medium">Agent Reasoning</h3>
              <p className="text-sm text-muted-foreground">AI decision history</p>
            </div>
            <div className="h-full overflow-hidden">
              <AgentHistory decisions={agentHistory} />
            </div>
          </div>

          {/* AI Assistant - Bottom Half */}
          <div className="flex-1 border-t flex flex-col">
            {/* Chat Header */}
            <div className="flex-shrink-0 p-4 border-b">
              <h3 className="font-medium">AI Assistant</h3>
              <p className="text-sm text-muted-foreground">Guide Maria's care journey</p>
            </div>
            
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
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

            {/* Chat Input */}
            <div className="flex-shrink-0 p-4 border-t">
              <form onSubmit={handleChatSubmit}>
                <div className="flex gap-2">
                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Guide the AI agent..."
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
    </div>
  );
};

export default MemberDetail;