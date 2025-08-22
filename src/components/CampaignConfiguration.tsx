import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { X } from 'lucide-react';

interface BundlingRules {
  selectedCampaigns: string[];
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
  const [isOpen, setIsOpen] = useState(false);
  
  // Available campaigns to bundle with
  const availableCampaigns = [
    "HbA1c Testing Campaign",
    "Flu Shot Initiative", 
    "Blood Pressure Screening",
    "Mammogram Outreach",
    "Diabetes Prevention Program",
    "Cholesterol Management",
    "Preventive Care Reminders",
    "Annual Wellness Visits"
  ];

  const addCampaign = (campaign: string) => {
    if (!bundlingRules.selectedCampaigns.includes(campaign)) {
      setBundlingRules(prev => ({
        selectedCampaigns: [...prev.selectedCampaigns, campaign]
      }));
    }
    setIsOpen(false);
  };

  const removeCampaign = (campaign: string) => {
    setBundlingRules(prev => ({
      selectedCampaigns: prev.selectedCampaigns.filter(c => c !== campaign)
    }));
  };
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
          <div className="mt-2 space-y-2">
            {/* Selected campaigns as pills */}
            <div className="flex flex-wrap gap-2">
              {bundlingRules.selectedCampaigns.map((campaign) => (
                <Badge key={campaign} variant="secondary" className="flex items-center gap-1">
                  {campaign}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-destructive" 
                    onClick={() => removeCampaign(campaign)}
                  />
                </Badge>
              ))}
            </div>
            
            {/* Add campaign picker */}
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-muted-foreground">
                  + Add campaigns to bundle
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search campaigns..." />
                  <CommandList>
                    <CommandEmpty>No campaigns found.</CommandEmpty>
                    {availableCampaigns
                      .filter(campaign => !bundlingRules.selectedCampaigns.includes(campaign))
                      .map((campaign) => (
                        <CommandItem
                          key={campaign}
                          onSelect={() => addCampaign(campaign)}
                        >
                          {campaign}
                        </CommandItem>
                      ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
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