import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BundlingRules {
  hba1c: boolean;
  fluShot: boolean;
  bloodPressure: boolean;
  mammogram: boolean;
}

interface CampaignConfigurationProps {
  campaignName: string;
  setCampaignName: (value: string) => void;
  priority: string;
  setPriority: (value: string) => void;
  estimatedROI: string;
  setEstimatedROI: (value: string) => void;
  bundlingRules: BundlingRules;
  setBundlingRules: (value: BundlingRules | ((prev: BundlingRules) => BundlingRules)) => void;
  splitPercentage: number[];
  setSplitPercentage: (value: number[]) => void;
  onDeploy: () => void;
  isDeployDisabled: boolean;
}

const CampaignConfiguration: React.FC<CampaignConfigurationProps> = ({
  campaignName,
  setCampaignName,
  priority,
  setPriority,
  estimatedROI,
  setEstimatedROI,
  bundlingRules,
  setBundlingRules,
  splitPercentage,
  setSplitPercentage,
  onDeploy,
  isDeployDisabled,
}) => {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <h3 className="font-medium">Campaign Configuration</h3>
        <p className="text-sm text-muted-foreground">Set up your campaign parameters</p>
      </div>
      
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
          <Label>Priority & Financial Impact</Label>
          <div className="flex gap-2">
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                value={estimatedROI}
                onChange={(e) => setEstimatedROI(e.target.value)}
                placeholder="380,000"
                className="pl-7"
              />
            </div>
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
                id="blood-pressure" 
                checked={bundlingRules.bloodPressure}
                onCheckedChange={(checked) => setBundlingRules(prev => ({ ...prev, bloodPressure: !!checked }))}
              />
              <Label htmlFor="blood-pressure" className="text-sm">Blood Pressure</Label>
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

      {/* Footer */}
      <div className="p-4 border-t">
        <Button onClick={onDeploy} disabled={isDeployDisabled} className="w-full">
          Deploy Campaign
        </Button>
      </div>
    </div>
  );
};

export default CampaignConfiguration;