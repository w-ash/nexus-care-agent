import React from 'react';
import BaseNode from './BaseNode';
import { NodeType } from '@/data/nodeDefinitions';

// Generate specific node components for each type
const createSpecificNode = (nodeType: NodeType) => {
  const NodeComponent: React.FC<any> = (props) => (
    <BaseNode {...props} type={nodeType} />
  );
  NodeComponent.displayName = `${nodeType}Node`;
  return NodeComponent;
};

// Export specific node components
export const GapTriggerNode = createSpecificNode('gap_trigger');
export const EnrollmentTriggerNode = createSpecificNode('enrollment_trigger');
export const HealthEventNode = createSpecificNode('health_event');

export const SmsNode = createSpecificNode('sms');
export const EmailNode = createSpecificNode('email');
export const PhoneNode = createSpecificNode('phone');
export const MailNode = createSpecificNode('mail');

export const AgeCheckNode = createSpecificNode('age_check');
export const ResponseCheckNode = createSpecificNode('response_check');
export const RiskCheckNode = createSpecificNode('risk_check');
export const HistoryCheckNode = createSpecificNode('history_check');

export const WaitNode = createSpecificNode('wait');
export const ScheduleTimeNode = createSpecificNode('schedule_time');

export const ScheduleAppointmentNode = createSpecificNode('schedule_appointment');
export const EscalateNode = createSpecificNode('escalate');
export const UpdateRecordNode = createSpecificNode('update_record');
export const AddTagNode = createSpecificNode('add_tag');

export const SuccessNode = createSpecificNode('success');
export const IncompleteNode = createSpecificNode('incomplete');