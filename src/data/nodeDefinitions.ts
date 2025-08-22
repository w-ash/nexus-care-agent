// Node Type Registry - Source of truth for all node types
export const NODE_DEFINITIONS = {
  // ====== TRIGGERS ======
  gap_trigger: {
    emoji: '🏁',
    category: 'Triggers',
    defaultLabel: 'Care Gap Detected',
    description: 'Triggers when a member has an overdue care gap',
    configSchema: {
      gapType: { type: 'select', options: ['HbA1c', 'Mammogram', 'Colonoscopy', 'Eye Exam', 'Flu Shot'] },
      daysOverdue: { type: 'number', default: 90 },
      ageRange: { type: 'range', min: 0, max: 120 },
      gender: { type: 'select', options: ['any', 'male', 'female'], optional: true }
    }
  },
  
  enrollment_trigger: {
    emoji: '🆕',
    category: 'Triggers',
    defaultLabel: 'New Member Enrolled',
    description: 'Triggers when a new member joins the plan',
    configSchema: {
      planType: { type: 'select', options: ['Medicare Advantage', 'Commercial', 'Medicaid', 'Any'] },
      daysSinceEnrollment: { type: 'number', default: 0 }
    }
  },
  
  health_event: {
    emoji: '🏥',
    category: 'Triggers',
    defaultLabel: 'Health Event Occurred',
    description: 'Triggers on specific health events',
    configSchema: {
      eventType: { type: 'select', options: ['Hospital Discharge', 'ER Visit', 'New Diagnosis', 'Procedure'] },
      lookbackDays: { type: 'number', default: 7 }
    }
  },

  // ====== OUTREACH ======
  sms: {
    emoji: '📱',
    category: 'Outreach',
    defaultLabel: 'Send SMS',
    description: 'Send a text message to member',
    configSchema: {
      template: { type: 'template_picker' },
      timing: { type: 'select', options: ['morning', 'afternoon', 'evening', 'immediate'] },
      characterLimit: { type: 'number', default: 160, readOnly: true }
    }
  },
  
  email: {
    emoji: '📧',
    category: 'Outreach',
    defaultLabel: 'Send Email',
    description: 'Send an email to member',
    configSchema: {
      template: { type: 'template_picker' },
      subject: { type: 'text' },
      includeAttachments: { type: 'boolean', default: false },
      trackOpens: { type: 'boolean', default: true }
    }
  },
  
  phone: {
    emoji: '☎️',
    category: 'Outreach',
    defaultLabel: 'Phone Call',
    description: 'Automated or live phone call',
    configSchema: {
      callType: { type: 'select', options: ['automated', 'live_agent'] },
      script: { type: 'template_picker' },
      maxAttempts: { type: 'number', default: 2 },
      leaveVoicemail: { type: 'boolean', default: true }
    }
  },
  
  mail: {
    emoji: '📬',
    category: 'Outreach',
    defaultLabel: 'Send Direct Mail',
    description: 'Send physical mail to member address',
    configSchema: {
      format: { type: 'select', options: ['letter', 'postcard', 'packet'] },
      template: { type: 'template_picker' },
      priority: { type: 'select', options: ['standard', 'priority'] },
      trackDelivery: { type: 'boolean', default: false }
    }
  },

  // ====== LOGIC ======
  age_check: {
    emoji: '🎂',
    category: 'Logic',
    defaultLabel: 'Check Age',
    description: 'Branch based on member age',
    configSchema: {
      branches: { 
        type: 'condition_builder',
        operators: ['<', '<=', '>=', '>', '==', 'between'],
        maxBranches: 5
      }
    }
  },
  
  response_check: {
    emoji: '💭',
    category: 'Logic',
    defaultLabel: 'Check for Response',
    description: 'Branch based on member response',
    configSchema: {
      responseType: { type: 'select', options: ['any', 'positive', 'negative', 'no_response'] },
      waitHours: { type: 'number', default: 48 }
    }
  },
  
  risk_check: {
    emoji: '⚠️',
    category: 'Logic',
    defaultLabel: 'Check Risk Level',
    description: 'Branch based on clinical risk',
    configSchema: {
      riskModel: { type: 'select', options: ['HCC', 'SDOH', 'Clinical', 'Combined'] },
      branches: { type: 'select_multiple', options: ['high', 'medium', 'low'] }
    }
  },
  
  history_check: {
    emoji: '📊',
    category: 'Logic',
    defaultLabel: 'Check History',
    description: 'Look up member history',
    configSchema: {
      checkType: { type: 'select', options: ['previous_procedure', 'family_history', 'past_response'] },
      lookback: { type: 'select', options: ['30_days', '90_days', '1_year', '2_years', 'all_time'] }
    }
  },

  // ====== TIMING ======
  wait: {
    emoji: '⏳',
    category: 'Timing',
    defaultLabel: 'Wait Period',
    description: 'Wait before continuing',
    configSchema: {
      duration: { type: 'number', default: 3 },
      unit: { type: 'select', options: ['hours', 'days', 'weeks'] },
      businessDaysOnly: { type: 'boolean', default: false }
    }
  },
  
  schedule_time: {
    emoji: '🕐',
    category: 'Timing',
    defaultLabel: 'Wait Until Specific Time',
    description: 'Wait until a specific time of day',
    configSchema: {
      time: { type: 'time_picker', default: '09:00' },
      timezone: { type: 'select', options: ['member_local', 'ET', 'CT', 'MT', 'PT'] }
    }
  },

  // ====== ACTIONS ======
  schedule_appointment: {
    emoji: '📅',
    category: 'Actions',
    defaultLabel: 'Schedule Appointment',
    description: 'Help member schedule appointment',
    configSchema: {
      appointmentType: { type: 'select', options: ['lab', 'imaging', 'provider', 'specialist'] },
      method: { type: 'select', options: ['auto_schedule', 'transfer_to_scheduler', 'send_link'] },
      allowBundling: { type: 'boolean', default: true }
    }
  },
  
  escalate: {
    emoji: '🚨',
    category: 'Actions',
    defaultLabel: 'Escalate to Human',
    description: 'Transfer to human intervention',
    configSchema: {
      escalateTo: { type: 'select', options: ['care_coordinator', 'nurse', 'provider'] },
      priority: { type: 'select', options: ['routine', 'urgent', 'emergent'] },
      reason: { type: 'text' }
    }
  },
  
  update_record: {
    emoji: '💾',
    category: 'Actions',
    defaultLabel: 'Update Member Record',
    description: 'Update member data',
    configSchema: {
      field: { type: 'select', options: ['gap_status', 'contact_preference', 'last_contact'] },
      value: { type: 'text' }
    }
  },
  
  add_tag: {
    emoji: '🏷️',
    category: 'Actions',
    defaultLabel: 'Add Tag',
    description: 'Tag member for segmentation',
    configSchema: {
      tagCategory: { type: 'select', options: ['clinical', 'engagement', 'preference'] },
      tagValue: { type: 'text' }
    }
  },

  // ====== ENDPOINTS ======
  success: {
    emoji: '✅',
    category: 'Endpoints',
    defaultLabel: 'Success',
    description: 'Campaign succeeded',
    configSchema: {
      outcome: { type: 'select', options: ['gap_closed', 'appointment_scheduled', 'member_engaged'] }
    }
  },
  
  incomplete: {
    emoji: '❌',
    category: 'Endpoints',
    defaultLabel: 'Incomplete',
    description: 'Campaign ended without success',
    configSchema: {
      reason: { type: 'select', options: ['max_attempts', 'member_declined', 'unable_to_reach'] },
      followUpAction: { type: 'select', options: ['retry_next_quarter', 'different_campaign', 'none'] }
    }
  }
} as const;

// Generate category groupings for UI palette
export const NODE_CATEGORIES = Object.entries(NODE_DEFINITIONS).reduce((acc, [type, def]) => {
  if (!acc[def.category]) acc[def.category] = [];
  acc[def.category].push({
    type,
    emoji: def.emoji,
    label: def.defaultLabel,
    description: def.description
  });
  return acc;
}, {} as Record<string, Array<{type: string; emoji: string; label: string; description: string}>>);

// Type definitions for TypeScript
export type NodeType = keyof typeof NODE_DEFINITIONS;

export interface NodeData<T extends NodeType = NodeType> {
  label: string;
  config?: any; // Will be more specific in actual implementation
}