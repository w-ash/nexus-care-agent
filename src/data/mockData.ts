
export interface Campaign {
  id: string;
  name: string;
  priority: 'high' | 'medium' | 'low';
  roi: number;
  targetMembers: number;
  activeMembers: number;
  closureRate: number;
  costPerGap: number;
  bundlingRules: {
    canBundleWith: string[];
    maxGapsPerMessage: number;
    facilityRequired: boolean;
  };
  flowDefinition: {
    nodes: FlowNode[];
    edges: FlowEdge[];
  };
  status: 'active' | 'paused' | 'draft';
  createdAt: string;
}

export interface FlowNode {
  id: string;
  type: 'trigger' | 'action' | 'decision' | 'wait';
  position: { x: number; y: number };
  data: {
    label: string;
    config?: any;
  };
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface Member {
  id: string;
  name: string;
  age: number;
  riskLevel: 'low' | 'medium' | 'high';
  gaps: Gap[];
  preferredChannel: 'sms' | 'phone' | 'email';
  responseHistory: Response[];
  lastVisit: string;
  facility: string;
}

export interface Gap {
  type: string;
  description: string;
  priority: number;
  dueDate: string;
  campaignId?: string;
}

export interface Response {
  timestamp: string;
  message: string;
  responseType: 'positive' | 'negative' | 'neutral';
  channel: 'sms' | 'phone' | 'email';
}

export interface AgentDecision {
  id: string;
  memberId: string;
  campaignId: string;
  timestamp: string;
  reasoning: string;
  actions: string[];
  bundledGaps?: string[];
}

// Mock Campaigns
export const mockCampaigns: Campaign[] = [
  {
    id: 'campaign-1',
    name: 'Diabetes HbA1c Testing',
    priority: 'high',
    roi: 480,
    targetMembers: 450,
    activeMembers: 423,
    closureRate: 68,
    costPerGap: 38,
    bundlingRules: {
      canBundleWith: ['mammogram', 'flu-shot', 'eye-exam'],
      maxGapsPerMessage: 2,
      facilityRequired: true
    },
    flowDefinition: {
      nodes: [
        { id: 'start', type: 'trigger', position: { x: 100, y: 100 }, data: { label: 'HbA1c Due' } },
        { id: 'sms', type: 'action', position: { x: 300, y: 100 }, data: { label: 'Send SMS Reminder' } },
        { id: 'wait', type: 'wait', position: { x: 500, y: 100 }, data: { label: 'Wait 3 Days' } },
        { id: 'call', type: 'action', position: { x: 700, y: 100 }, data: { label: 'Phone Outreach' } }
      ],
      edges: [
        { id: 'e1', source: 'start', target: 'sms' },
        { id: 'e2', source: 'sms', target: 'wait' },
        { id: 'e3', source: 'wait', target: 'call' }
      ]
    },
    status: 'active',
    createdAt: '2024-09-15'
  },
  {
    id: 'campaign-2',
    name: 'Blood Pressure Management',
    priority: 'medium',
    roi: 320,
    targetMembers: 340,
    activeMembers: 312,
    closureRate: 71,
    costPerGap: 42,
    bundlingRules: {
      canBundleWith: ['cholesterol'],
      maxGapsPerMessage: 1,
      facilityRequired: false
    },
    flowDefinition: {
      nodes: [
        { id: 'start', type: 'trigger', position: { x: 100, y: 100 }, data: { label: 'BP Check Due' } },
        { id: 'email', type: 'action', position: { x: 300, y: 100 }, data: { label: 'Send Email' } }
      ],
      edges: [
        { id: 'e1', source: 'start', target: 'email' }
      ]
    },
    status: 'active',
    createdAt: '2024-08-20'
  },
  {
    id: 'campaign-3',
    name: 'Annual Flu Shot',
    priority: 'medium',
    roi: 180,
    targetMembers: 650,
    activeMembers: 623,
    closureRate: 45,
    costPerGap: 28,
    bundlingRules: {
      canBundleWith: ['hba1c', 'mammogram', 'eye-exam'],
      maxGapsPerMessage: 3,
      facilityRequired: false
    },
    flowDefinition: {
      nodes: [
        { id: 'start', type: 'trigger', position: { x: 100, y: 100 }, data: { label: 'Flu Season Start' } },
        { id: 'sms', type: 'action', position: { x: 300, y: 100 }, data: { label: 'Flu Shot Reminder' } }
      ],
      edges: [
        { id: 'e1', source: 'start', target: 'sms' }
      ]
    },
    status: 'active',
    createdAt: '2024-09-01'
  }
];

// Mock Members
export const mockMembers: Member[] = [
  {
    id: 'member-1',
    name: 'Maria Rodriguez',
    age: 52,
    riskLevel: 'medium',
    gaps: [
      { type: 'hba1c', description: 'HbA1c Test', priority: 1, dueDate: '2024-10-15', campaignId: 'campaign-1' },
      { type: 'mammogram', description: 'Annual Mammogram', priority: 2, dueDate: '2024-11-01' },
      { type: 'flu-shot', description: 'Flu Vaccination', priority: 3, dueDate: '2024-10-30', campaignId: 'campaign-3' },
      { type: 'eye-exam', description: 'Diabetic Eye Exam', priority: 2, dueDate: '2024-12-01' }
    ],
    preferredChannel: 'sms',
    responseHistory: [
      { timestamp: '2024-10-01T09:00:00Z', message: 'Time for your diabetes check', responseType: 'neutral', channel: 'sms' },
      { timestamp: '2024-10-03T14:00:00Z', message: 'YES but need afternoon', responseType: 'positive', channel: 'sms' }
    ],
    lastVisit: '2024-06-15',
    facility: 'Riverside Medical Center'
  },
  {
    id: 'member-2',
    name: 'John Chen',
    age: 45,
    riskLevel: 'high',
    gaps: [
      { type: 'hba1c', description: 'HbA1c Test', priority: 1, dueDate: '2024-10-20', campaignId: 'campaign-1' },
      { type: 'mammogram', description: 'Prostate Screening', priority: 2, dueDate: '2024-11-15' },
      { type: 'colonoscopy', description: 'Colonoscopy', priority: 1, dueDate: '2024-10-01' }
    ],
    preferredChannel: 'phone',
    responseHistory: [
      { timestamp: '2024-09-28T10:00:00Z', message: 'Screening reminder sent', responseType: 'neutral', channel: 'phone' }
    ],
    lastVisit: '2024-08-10',
    facility: 'Downtown Health Clinic'
  },
  {
    id: 'member-3',
    name: 'Patricia Williams',
    age: 48,
    riskLevel: 'low',
    gaps: [
      { type: 'mammogram', description: 'Annual Mammogram', priority: 2, dueDate: '2024-11-01' },
      { type: 'flu-shot', description: 'Flu Vaccination', priority: 3, dueDate: '2024-10-30', campaignId: 'campaign-3' }
    ],
    preferredChannel: 'email',
    responseHistory: [],
    lastVisit: '2024-07-22',
    facility: 'Riverside Medical Center'
  }
];

// Mock Agent Decisions
export const mockAgentDecisions: AgentDecision[] = [
  {
    id: 'decision-1',
    memberId: 'member-1',
    campaignId: 'campaign-1',
    timestamp: '2024-10-03T09:15:00Z',
    reasoning: 'Maria has 4 gaps with 2 at Riverside Medical. Bundling HbA1c + Mammogram for same facility visit. High bundling success rate (73%) for similar profiles.',
    actions: ['bundle_gaps', 'send_sms', 'schedule_appointment'],
    bundledGaps: ['hba1c', 'mammogram']
  },
  {
    id: 'decision-2',
    memberId: 'member-2',
    campaignId: 'campaign-1',
    timestamp: '2024-10-01T08:30:00Z',
    reasoning: 'John is high-risk with multiple facility requirements. Colonoscopy urgent (overdue). Keeping campaigns separate to avoid confusion.',
    actions: ['prioritize_urgent', 'send_phone_call', 'escalate_to_care_manager'],
    bundledGaps: []
  }
];

// Utility Functions
export const getMembersByGapCount = (minGaps: number = 2): Member[] => {
  return mockMembers.filter(member => member.gaps.length >= minGaps);
};

export const getBundleableCampaigns = (member: Member): Campaign[] => {
  const memberGapTypes = member.gaps.map(gap => gap.type);
  return mockCampaigns.filter(campaign => 
    campaign.bundlingRules.canBundleWith.some(bundleType => 
      memberGapTypes.includes(bundleType)
    )
  );
};

export const simulateTimeProgression = (days: number): void => {
  // Mock function - in real app would update metrics and member states
  console.log(`Simulating ${days} days of campaign progression...`);
  
  // Update closure rates
  mockCampaigns.forEach(campaign => {
    campaign.closureRate = Math.min(campaign.closureRate + Math.random() * 5, 85);
    campaign.activeMembers = Math.max(campaign.activeMembers - Math.floor(Math.random() * 10), campaign.targetMembers * 0.7);
  });
};

export const getOverallMetrics = () => {
  const totalMembers = mockCampaigns.reduce((sum, campaign) => sum + campaign.activeMembers, 0);
  const avgClosureRate = mockCampaigns.reduce((sum, campaign) => sum + campaign.closureRate, 0) / mockCampaigns.length;
  const avgCostPerGap = mockCampaigns.reduce((sum, campaign) => sum + campaign.costPerGap, 0) / mockCampaigns.length;
  
  return {
    totalMembers,
    avgClosureRate: Math.round(avgClosureRate),
    avgCostPerGap: Math.round(avgCostPerGap)
  };
};
