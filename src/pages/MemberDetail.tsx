import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MemberInfo from '@/components/member/LeftPanel/MemberInfo';
import ActiveCampaigns from '@/components/member/LeftPanel/ActiveCampaigns';
import MemberTimeline from '@/components/member/LeftPanel/MemberTimeline';
import SimulationControls from '@/components/member/LeftPanel/SimulationControls';
import PersonalizedJourney from '@/components/member/CenterPanel/PersonalizedJourney';
import JourneyLegend from '@/components/member/CenterPanel/JourneyLegend';
import AgentChat from '@/components/member/RightPanel/AgentChat';
import AgentHistory from '@/components/member/RightPanel/AgentHistory';
import { getMemberMockData, getInitialJourneyState, ChatMessage, AgentDecision, Interaction } from '@/data/memberMockData';

const MemberDetail: React.FC = () => {
  const { memberId } = useParams<{ memberId: string }>();
  const navigate = useNavigate();
  
  const [member, setMember] = useState(getMemberMockData(memberId || 'maria'));
  const [journeyState, setJourneyState] = useState(getInitialJourneyState());
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      sender: 'agent',
      content: 'Hello! I\'m analyzing Maria\'s care gaps and looking for optimization opportunities. I can explain my decisions or adapt based on your guidance.',
      timestamp: new Date()
    }
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

  const handleSendMessage = (message: string) => {
    const userMessage: ChatMessage = {
      sender: 'user',
      content: message,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    
    // Simulate agent response
    setTimeout(() => {
      const agentResponse: ChatMessage = {
        sender: 'agent',
        content: `I understand. I'll incorporate your guidance: "${message}" into Maria's journey. This will help improve the personalization.`,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, agentResponse]);
    }, 1000);
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
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Member not found</h2>
          <Button onClick={() => navigate('/')}>Return to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <div className="h-6 w-px bg-border" />
            <h1 className="text-2xl font-bold">Member Detail</h1>
          </div>
        </div>
      </div>

      {/* Three-Column Layout */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel */}
          <div className="lg:col-span-3 space-y-6">
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

          {/* Center Panel */}
          <div className="lg:col-span-6 space-y-6">
            <PersonalizedJourney 
              journeyState={journeyState}
              simulationStep={simulationStep}
            />
            <JourneyLegend />
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-3 space-y-6">
            <AgentChat 
              messages={chatMessages}
              onSendMessage={handleSendMessage}
            />
            <AgentHistory decisions={agentHistory} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDetail;