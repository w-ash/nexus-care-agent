import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
}) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardTitle className="text-lg font-medium">Campaign Configuration</CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
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
      </CardContent>
    </Card>
  );
};

export default CampaignConfiguration;