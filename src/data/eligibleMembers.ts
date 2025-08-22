// Mock data for eligible members in campaigns
export interface EligibleMember {
  id: string;
  name: string;
  age: number;
  riskLevel: 'low' | 'medium' | 'high';
  gapType: string;
  daysOverdue: number;
  lastContact?: Date;
  preferredChannel: 'sms' | 'email' | 'phone';
}

export const mockEligibleMembers: Record<string, EligibleMember[]> = {
  'campaign-1': [ // Diabetes HbA1c Testing
    {
      id: 'maria-rodriguez',
      name: 'Maria Rodriguez',
      age: 52,
      riskLevel: 'medium',
      gapType: 'HbA1c',
      daysOverdue: 95,
      lastContact: new Date('2025-01-15'),
      preferredChannel: 'sms'
    },
    {
      id: 'robert-smith',
      name: 'Robert Smith',
      age: 58,
      riskLevel: 'high',
      gapType: 'HbA1c',
      daysOverdue: 95,
      lastContact: new Date('2025-01-11'),
      preferredChannel: 'phone'
    },
    {
      id: 'david-jones',
      name: 'David Jones',
      age: 62,
      riskLevel: 'high',
      gapType: 'HbA1c',
      daysOverdue: 134,
      lastContact: new Date('2025-01-08'),
      preferredChannel: 'email'
    },
    {
      id: 'michael-taylor',
      name: 'Michael Taylor',
      age: 45,
      riskLevel: 'medium',
      gapType: 'HbA1c',
      daysOverdue: 67,
      preferredChannel: 'sms'
    },
    {
      id: 'james-anderson',
      name: 'James Anderson',
      age: 55,
      riskLevel: 'low',
      gapType: 'HbA1c',
      daysOverdue: 42,
      lastContact: new Date('2025-01-17'),
      preferredChannel: 'sms'
    },
    {
      id: 'william-thomas',
      name: 'William Thomas',
      age: 61,
      riskLevel: 'high',
      gapType: 'HbA1c',
      daysOverdue: 112,
      preferredChannel: 'phone'
    },
    {
      id: 'charles-jackson',
      name: 'Charles Jackson',
      age: 49,
      riskLevel: 'medium',
      gapType: 'HbA1c',
      daysOverdue: 78,
      lastContact: new Date('2025-01-13'),
      preferredChannel: 'email'
    },
    {
      id: 'joseph-white',
      name: 'Joseph White',
      age: 53,
      riskLevel: 'low',
      gapType: 'HbA1c',
      daysOverdue: 29,
      preferredChannel: 'sms'
    },
    {
      id: 'daniel-harris',
      name: 'Daniel Harris',
      age: 47,
      riskLevel: 'medium',
      gapType: 'HbA1c',
      daysOverdue: 83,
      lastContact: new Date('2025-01-15'),
      preferredChannel: 'phone'
    },
    {
      id: 'matthew-martin',
      name: 'Matthew Martin',
      age: 59,
      riskLevel: 'high',
      gapType: 'HbA1c',
      daysOverdue: 105,
      preferredChannel: 'email'
    },
    {
      id: 'anthony-thompson',
      name: 'Anthony Thompson',
      age: 52,
      riskLevel: 'low',
      gapType: 'HbA1c',
      daysOverdue: 38,
      lastContact: new Date('2025-01-19'),
      preferredChannel: 'sms'
    }
  ],
  'campaign-2': [ // Blood Pressure Management
    {
      id: 'sarah-johnson',
      name: 'Sarah Johnson',
      age: 48,
      riskLevel: 'high',
      gapType: 'Blood Pressure',
      daysOverdue: 120,
      lastContact: new Date('2025-01-10'),
      preferredChannel: 'email'
    },
    {
      id: 'jessica-chen',
      name: 'Jessica Chen',
      age: 55,
      riskLevel: 'low',
      gapType: 'Blood Pressure',
      daysOverdue: 30,
      lastContact: new Date('2025-01-18'),
      preferredChannel: 'phone'
    },
    {
      id: 'amanda-williams',
      name: 'Amanda Williams',
      age: 41,
      riskLevel: 'medium',
      gapType: 'Blood Pressure',
      daysOverdue: 67,
      preferredChannel: 'sms'
    },
    {
      id: 'rachel-brown',
      name: 'Rachel Brown',
      age: 49,
      riskLevel: 'high',
      gapType: 'Blood Pressure',
      daysOverdue: 89,
      lastContact: new Date('2025-01-12'),
      preferredChannel: 'email'
    },
    {
      id: 'emily-davis',
      name: 'Emily Davis',
      age: 53,
      riskLevel: 'low',
      gapType: 'Blood Pressure',
      daysOverdue: 22,
      preferredChannel: 'sms'
    },
    {
      id: 'nicole-miller',
      name: 'Nicole Miller',
      age: 46,
      riskLevel: 'medium',
      gapType: 'Blood Pressure',
      daysOverdue: 55,
      lastContact: new Date('2025-01-16'),
      preferredChannel: 'phone'
    },
    {
      id: 'lisa-wilson',
      name: 'Lisa Wilson',
      age: 50,
      riskLevel: 'high',
      gapType: 'Blood Pressure',
      daysOverdue: 98,
      preferredChannel: 'email'
    },
    {
      id: 'michelle-garcia',
      name: 'Michelle Garcia',
      age: 44,
      riskLevel: 'low',
      gapType: 'Blood Pressure',
      daysOverdue: 35,
      lastContact: new Date('2025-01-14'),
      preferredChannel: 'sms'
    }
  ],
  'campaign-3': [ // Annual Flu Shot
    {
      id: 'stephanie-martinez',
      name: 'Stephanie Martinez',
      age: 47,
      riskLevel: 'medium',
      gapType: 'Flu Shot',
      daysOverdue: 71,
      preferredChannel: 'phone'
    },
    {
      id: 'kevin-lee',
      name: 'Kevin Lee',
      age: 51,
      riskLevel: 'medium',
      gapType: 'Flu Shot',
      daysOverdue: 245,
      lastContact: new Date('2025-01-09'),
      preferredChannel: 'email'
    },
    {
      id: 'mark-gonzalez',
      name: 'Mark Gonzalez',
      age: 57,
      riskLevel: 'high',
      gapType: 'Flu Shot',
      daysOverdue: 412,
      preferredChannel: 'phone'
    },
    {
      id: 'steven-robinson',
      name: 'Steven Robinson',
      age: 63,
      riskLevel: 'low',
      gapType: 'Flu Shot',
      daysOverdue: 189,
      lastContact: new Date('2025-01-16'),
      preferredChannel: 'sms'
    },
    {
      id: 'paul-clark',
      name: 'Paul Clark',
      age: 54,
      riskLevel: 'medium',
      gapType: 'Flu Shot',
      daysOverdue: 298,
      preferredChannel: 'email'
    },
    {
      id: 'andrew-rodriguez',
      name: 'Andrew Rodriguez',
      age: 48,
      riskLevel: 'high',
      gapType: 'Flu Shot',
      daysOverdue: 356,
      lastContact: new Date('2025-01-07'),
      preferredChannel: 'phone'
    },
    {
      id: 'joshua-lewis',
      name: 'Joshua Lewis',
      age: 52,
      riskLevel: 'low',
      gapType: 'Flu Shot',
      daysOverdue: 167,
      preferredChannel: 'sms'
    },
    {
      id: 'kenneth-walker',
      name: 'Kenneth Walker',
      age: 59,
      riskLevel: 'medium',
      gapType: 'Flu Shot',
      daysOverdue: 278,
      lastContact: new Date('2025-01-12'),
      preferredChannel: 'email'
    }
  ]
};

export const getEligibleMembers = (campaignId: string): EligibleMember[] => {
  return mockEligibleMembers[campaignId] || [];
};

export const searchEligibleMembers = (campaignId: string, searchTerm: string): EligibleMember[] => {
  const members = getEligibleMembers(campaignId);
  if (!searchTerm.trim()) {
    return members.slice(0, 10); // Return max 10 members
  }
  
  const filtered = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return filtered.slice(0, 10); // Return max 10 members
};