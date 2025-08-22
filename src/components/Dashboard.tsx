
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  mockCampaigns, 
  getMembersByGapCount, 
  simulateTimeProgression, 
  getOverallMetrics,
  type Campaign 
} from '@/data/mockData';
import { 
  Activity, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Plus, 
  AlertCircle,
  BarChart3,
  Zap
} from 'lucide-react';

interface DashboardProps {
  onCreateCampaign: () => void;
  onViewMember: (memberId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onCreateCampaign, onViewMember }) => {
  const [campaigns, setCampaigns] = useState(mockCampaigns);
  const metrics = getOverallMetrics();
  const multiGapMembers = getMembersByGapCount(2);

  const handleSimulate = () => {
    simulateTimeProgression(3);
    setCampaigns([...mockCampaigns]); // Trigger re-render
  };

  const getPriorityBadgeVariant = (priority: Campaign['priority']) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold text-gradient">Healthcare Campaign Manager</h1>
            <p className="text-muted-foreground">AI-powered care gap closure platform</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleSimulate} className="gap-2">
              <Zap className="w-4 h-4" />
              Simulate 3 Days
            </Button>
            <Button onClick={onCreateCampaign} className="gap-2 bg-gradient-ai">
              <Plus className="w-4 h-4" />
              Create Campaign
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="metric-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Active Members</p>
                <p className="text-2xl font-bold">{metrics.totalMembers.toLocaleString()}</p>
              </div>
              <Users className="w-8 h-8 text-white/60" />
            </div>
          </div>
          
          <div className="metric-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Gap Closure Rate</p>
                <p className="text-2xl font-bold">{metrics.avgClosureRate}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-white/60" />
            </div>
          </div>
          
          <div className="metric-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Avg Cost/Gap</p>
                <p className="text-2xl font-bold">${metrics.avgCostPerGap}</p>
              </div>
              <DollarSign className="w-8 h-8 text-white/60" />
            </div>
          </div>
          
          <div className="metric-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">AI Efficiency</p>
                <p className="text-2xl font-bold">2.1x</p>
              </div>
              <Activity className="w-8 h-8 text-white/60" />
            </div>
          </div>
        </div>

        {/* Alert for Multi-gap Members */}
        {multiGapMembers.length > 0 && (
          <Card className="border-warning/50 bg-warning-muted">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-warning" />
                <div>
                  <p className="font-medium">Bundling Opportunities</p>
                  <p className="text-sm text-muted-foreground">
                    {multiGapMembers.length} members have multiple gaps that could be bundled
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onViewMember(multiGapMembers[0].id)}
              >
                View Details
              </Button>
            </div>
          </Card>
        )}

        {/* A/B Test Comparison */}
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">AI vs Static Performance</h3>
              <BarChart3 className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">AI Agent Campaigns</p>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Closure Rate</span>
                    <span className="font-medium text-success">73%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gaps per Visit</span>
                    <span className="font-medium text-success">2.1</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cost per Gap</span>
                    <span className="font-medium text-success">$32</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Static Workflows</p>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Closure Rate</span>
                    <span className="font-medium">38%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gaps per Visit</span>
                    <span className="font-medium">1.2</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cost per Gap</span>
                    <span className="font-medium">$47</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Campaign Cards */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Active Campaigns</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="campaign-card">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-lg">{campaign.name}</h3>
                  <Badge variant={getPriorityBadgeVariant(campaign.priority)}>
                    {campaign.priority}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Members</span>
                    <span className="font-medium">{campaign.activeMembers.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Closure Rate</span>
                    <span className="font-medium text-success">{campaign.closureRate}%</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">ROI</span>
                    <span className="font-medium">${campaign.roi}/gap</span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-gradient-ai h-2 rounded-full transition-all duration-500"
                        style={{ width: `${campaign.closureRate}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      {campaign.closureRate}% closure rate
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Analytics
                  </Button>
                  <Button variant="outline" size="sm" className="ai-badge">
                    AI Active
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
