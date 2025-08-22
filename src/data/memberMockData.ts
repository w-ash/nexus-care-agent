export interface MemberProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  riskLevel: 'low' | 'medium' | 'high';
  preferredChannel: 'sms' | 'email' | 'phone';
  preferredTime: 'morning' | 'afternoon' | 'evening';
  language: string;
  gaps: Array<{
    type: string;
    daysOverdue: number;
    priority: 'low' | 'medium' | 'high' | 'critical';
  }>;
  activeCampaigns: string[];
}

export interface ChatMessage {
  sender: 'user' | 'agent';
  content: string;
  timestamp: Date;
}

export interface AgentDecision {
  timestamp: Date;
  action: string;
  reasoning: string;
  affectedGaps: string[];
  outcome?: 'pending' | 'success' | 'failed';
}

export interface Interaction {
  date: Date;
  type: 'outreach' | 'response' | 'appointment' | 'gap_closed';
  channel: 'sms' | 'email' | 'phone' | 'mail';
  content: string;
  status: 'sent' | 'delivered' | 'read' | 'responded' | 'failed';
}

export interface JourneyState {
  nodes: any[];
  edges: any[];
  currentNodeId: string;
}

export const getMemberMockData = (memberId: string): MemberProfile | null => {
  const members: Record<string, MemberProfile> = {
    maria: {
      id: 'member_maria_rodriguez',
      name: 'Maria Rodriguez',
      age: 52,
      gender: 'Female',
      riskLevel: 'medium',
      preferredChannel: 'sms',
      preferredTime: 'evening',
      language: 'English',
      gaps: [
        { type: 'HbA1c', daysOverdue: 95, priority: 'high' },
        { type: 'Mammogram', daysOverdue: 45, priority: 'medium' },
        { type: 'Flu Shot', daysOverdue: 30, priority: 'low' },
        { type: 'Eye Exam', daysOverdue: 60, priority: 'medium' }
      ],
      activeCampaigns: ['HbA1c Testing', 'Mammogram Screening']
    }
  };

  return members[memberId] || null;
};

export const getInitialJourneyState = (): JourneyState => {
  return {
    nodes: [
      {
        id: 'trigger_hba1c',
        type: 'gap_trigger',
        position: { x: 400, y: 50 },
        data: {
          label: 'HbA1c Overdue',
          state: 'completed',
          completedAt: '2025-01-15T09:00:00Z',
          config: {
            gapType: 'HbA1c',
            daysOverdue: 90
          }
        }
      },
      {
        id: 'initial_sms',
        type: 'sms',
        position: { x: 400, y: 150 },
        data: {
          label: 'Initial SMS',
          state: 'completed',
          config: {
            template: 'hba1c_reminder_initial',
            timing: 'evening'
          }
        }
      },
      {
        id: 'wait_response',
        type: 'wait',
        position: { x: 400, y: 250 },
        data: {
          label: 'Wait 3 Days',
          state: 'completed',
          config: { duration: 3, unit: 'days' }
        }
      },
      {
        id: 'bundled_sms_1',
        type: 'sms',
        position: { x: 400, y: 350 },
        data: {
          label: 'Bundled: HbA1c + Mammogram',
          state: 'current',
          isBundled: true,
          bundledGaps: ['HbA1c', 'Mammogram'],
          config: {
            template: 'bundled_reminder',
            timing: 'evening'
          }
        }
      },
      {
        id: 'response_check',
        type: 'response_check',
        position: { x: 400, y: 450 },
        data: {
          label: 'Response Check',
          state: 'scheduled',
          config: {
            checkFor: 'appointment_booking'
          }
        }
      },
      {
        id: 'end_success',
        type: 'success',
        position: { x: 250, y: 550 },
        data: {
          label: 'Both Gaps Closed',
          state: 'scheduled',
          config: { outcome: 'bundled_completion' }
        }
      },
      {
        id: 'followup_sms',
        type: 'sms',
        position: { x: 550, y: 550 },
        data: {
          label: 'Follow-up SMS',
          state: 'scheduled',
          config: {
            template: 'second_reminder',
            timing: 'evening'
          }
        }
      }
    ],
    edges: [
      { id: 'e1', source: 'trigger_hba1c', target: 'initial_sms', type: 'smoothstep' },
      { id: 'e2', source: 'initial_sms', target: 'wait_response', type: 'smoothstep' },
      { id: 'e3', source: 'wait_response', target: 'bundled_sms_1', type: 'smoothstep' },
      { id: 'e4', source: 'bundled_sms_1', target: 'response_check', type: 'smoothstep' },
      { id: 'e5', source: 'response_check', target: 'end_success', sourceHandle: 'true', type: 'smoothstep' },
      { id: 'e6', source: 'response_check', target: 'followup_sms', sourceHandle: 'false', type: 'smoothstep' }
    ],
    currentNodeId: 'bundled_sms_1'
  };
};