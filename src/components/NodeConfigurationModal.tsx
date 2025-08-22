import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { X } from 'lucide-react';

interface NodeConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  node: any;
  onSave: (nodeId: string, label: string, config: any) => void;
}

const NodeConfigurationModal: React.FC<NodeConfigurationModalProps> = ({
  isOpen,
  onClose,
  node,
  onSave
}) => {
  const [label, setLabel] = useState('');
  const [config, setConfig] = useState<any>({});

  useEffect(() => {
    if (node) {
      setLabel(node.data.label || '');
      setConfig(node.data.config || {});
    }
  }, [node]);

  if (!node) return null;

  const handleSave = () => {
    onSave(node.id, label, config);
    onClose();
  };

  const getNodeTypeLabel = (type: string) => {
    switch (type) {
      case 'trigger': return 'Trigger';
      case 'outreach': return 'Outreach';
      case 'action': return 'Action';
      case 'decision': return 'Decision';
      case 'wait': return 'Wait';
      case 'knowledge': return 'Knowledge';
      case 'end': return 'End';
      default: return 'Node';
    }
  };

  const renderConfiguration = () => {
    switch (node.type) {
      case 'trigger':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="gapType">Gap Type</Label>
              <Select value={config.gapType || ''} onValueChange={(value) => setConfig({...config, gapType: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gap type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="General">General</SelectItem>
                  <SelectItem value="Mammogram">Mammogram</SelectItem>
                  <SelectItem value="Colonoscopy">Colonoscopy</SelectItem>
                  <SelectItem value="Flu_Shot">Flu Shot</SelectItem>
                  <SelectItem value="HbA1c">HbA1c</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="daysOverdue">Days Overdue</Label>
              <Input
                type="number"
                value={config.daysOverdue || ''}
                onChange={(e) => setConfig({...config, daysOverdue: parseInt(e.target.value) || 0})}
              />
            </div>
            {config.gender && (
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select value={config.gender || ''} onValueChange={(value) => setConfig({...config, gender: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="any">Any</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        );

      case 'outreach':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="channel">Channel</Label>
              <Select value={config.channel || ''} onValueChange={(value) => setConfig({...config, channel: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select channel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="mail">Mail</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="template">Template</Label>
              <Input
                value={config.template || ''}
                onChange={(e) => setConfig({...config, template: e.target.value})}
                placeholder="Template name"
              />
            </div>
            <div>
              <Label htmlFor="timeOfDay">Time of Day</Label>
              <Select value={config.timeOfDay || ''} onValueChange={(value) => setConfig({...config, timeOfDay: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning</SelectItem>
                  <SelectItem value="afternoon">Afternoon</SelectItem>
                  <SelectItem value="evening">Evening</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'action':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="appointmentType">Appointment Type</Label>
              <Input
                value={config.appointmentType || ''}
                onChange={(e) => setConfig({...config, appointmentType: e.target.value})}
                placeholder="e.g., mammogram, colonoscopy"
              />
            </div>
            <div>
              <Label htmlFor="schedulingMethod">Scheduling Method</Label>
              <Select value={config.schedulingMethod || ''} onValueChange={(value) => setConfig({...config, schedulingMethod: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="transfer_to_scheduler">Transfer to Scheduler</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={config.priority || ''} onValueChange={(value) => setConfig({...config, priority: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'decision':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="condition">Condition</Label>
              <Input
                value={config.condition || ''}
                onChange={(e) => setConfig({...config, condition: e.target.value})}
                placeholder="e.g., age, response_received"
              />
            </div>
          </div>
        );

      case 'wait':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="duration">Duration</Label>
              <Input
                type="number"
                value={config.duration || ''}
                onChange={(e) => setConfig({...config, duration: parseInt(e.target.value) || 0})}
              />
            </div>
            <div>
              <Label htmlFor="unit">Unit</Label>
              <Select value={config.unit || ''} onValueChange={(value) => setConfig({...config, unit: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minutes">Minutes</SelectItem>
                  <SelectItem value="hours">Hours</SelectItem>
                  <SelectItem value="days">Days</SelectItem>
                  <SelectItem value="weeks">Weeks</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'knowledge':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="dataSource">Data Source</Label>
              <Select value={config.dataSource || ''} onValueChange={(value) => setConfig({...config, dataSource: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select data source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="health_data_engine">Health Data Engine</SelectItem>
                  <SelectItem value="member_profile">Member Profile</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="check">Check</Label>
              <Input
                value={config.check || ''}
                onChange={(e) => setConfig({...config, check: e.target.value})}
                placeholder="e.g., previous_screening, family_history"
              />
            </div>
          </div>
        );

      case 'end':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="outcome">Outcome</Label>
              <Select value={config.outcome || ''} onValueChange={(value) => setConfig({...config, outcome: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select outcome" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="incomplete">Incomplete</SelectItem>
                  <SelectItem value="timeout">Timeout</SelectItem>
                  <SelectItem value="escalated">Escalated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configure {getNodeTypeLabel(node.type)} Node</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div>
            <Label htmlFor="label">Node Label</Label>
            <Input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Enter node label"
            />
          </div>
          
          {renderConfiguration()}
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Configuration
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NodeConfigurationModal;