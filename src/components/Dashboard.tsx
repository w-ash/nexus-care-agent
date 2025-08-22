
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  mockCampaigns, 
  getMembersByGapCount, 
  simulateTimeProgression, 
  getOverallMetrics,
  resetDemoData,
  type Campaign 
} from '@/data/mockData';
import { 
  Activity, 
  Users, 
  TrendingUp, 
  DollarSign, 
  AlertCircle,
  BarChart3,
  Edit2,
  Clock,
  Target,
  UserCheck
} from 'lucide-react';
import Header from '@/components/ui/header';

interface DashboardProps {
  onCreateCampaign: () => void;
  onViewMember: (memberId: string) => void;
  onNavigateHome: () => void;
  onEditCampaign?: (campaignId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onCreateCampaign, onViewMember, onNavigateHome, onEditCampaign }) => {
  const [campaigns, setCampaigns] = useState(mockCampaigns);
  const metrics = getOverallMetrics();
  const multiGapMembers = getMembersByGapCount(2);

  const handleSimulate = () => {
    simulateTimeProgression(3);
    setCampaigns([...mockCampaigns]); // Trigger re-render
  };

  const handleReset = () => {
    resetDemoData();
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
      <Header 
        onTitleClick={onNavigateHome}
        onCreateCampaign={onCreateCampaign}
        onSimulate={handleSimulate}
        onReset={handleReset}
        showCreateButton={true}
        showSimulateButton={true}
        showResetButton={true}
      />

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
                <p className="text-2xl font-bold">{Number(metrics.avgClosureRate).toFixed(1).replace('.0', '')}%</p>
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
          <div className="space-y-4">
            {campaigns.map((campaign) => {
              // Calculate industry-standard metrics
              const eligiblePopulation = Math.floor(campaign.activeMembers * 1.15); // EPOP includes exclusions
              const numerator = Math.floor(eligiblePopulation * (campaign.closureRate / 100));
              const performanceRate = ((numerator / eligiblePopulation) * 100);
              const openGaps = eligiblePopulation - numerator;
              const avgTimeToClose = Math.floor(30 + Math.random() * 35); // 30-65 days
              const engagementRate = Math.floor(65 + Math.random() * 25); // 65-90%
              const costPerGap = campaign.roi;

              return (
                <Card key={campaign.id} className="p-6">
                  <div>
                    {/* Header with campaign name and edit button */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-xl">{campaign.name}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <Badge variant={getPriorityBadgeVariant(campaign.priority)}>
                            {campaign.priority}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            HEDIS Measure
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEditCampaign?.(campaign.id)}
                        className="gap-2 shrink-0"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit Campaign
                      </Button>
                    </div>

                    {/* Industry-standard metrics grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                      {/* Numerator/Denominator */}
                      <div>
                        <div className="flex items-start gap-1 mb-1">
                          <Target className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                          <p className="text-sm font-medium text-muted-foreground leading-tight">Performance Rate</p>
                        </div>
                        <p className="text-2xl font-bold text-success mb-1">{performanceRate.toFixed(1)}%</p>
                        <p className="text-xs text-muted-foreground">
                          {numerator.toLocaleString()}/{eligiblePopulation.toLocaleString()} EPOP
                        </p>
                      </div>

                      {/* Open Gaps */}
                      <div>
                        <div className="flex items-start gap-1 mb-1">
                          <AlertCircle className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                          <p className="text-sm font-medium text-muted-foreground leading-tight">Open Gaps</p>
                        </div>
                        <p className="text-2xl font-bold mb-1">{openGaps.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">
                          Remaining members
                        </p>
                      </div>

                      {/* Time to Closure */}
                      <div>
                        <div className="flex items-start gap-1 mb-1">
                          <Clock className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                          <p className="text-sm font-medium text-muted-foreground leading-tight">Avg Time to Close</p>
                        </div>
                        <p className="text-2xl font-bold mb-1">{avgTimeToClose}d</p>
                        <p className="text-xs text-muted-foreground">
                          Target: 45-60d
                        </p>
                      </div>

                      {/* Member Engagement */}
                      <div>
                        <div className="flex items-start gap-1 mb-1">
                          <UserCheck className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                          <p className="text-sm font-medium text-muted-foreground leading-tight">Engagement Rate</p>
                        </div>
                        <p className="text-2xl font-bold mb-1">{engagementRate}%</p>
                        <p className="text-xs text-muted-foreground">
                          Target: 75%
                        </p>
                      </div>

                      {/* Cost per Gap */}
                      <div>
                        <div className="flex items-start gap-1 mb-1">
                          <DollarSign className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                          <p className="text-sm font-medium text-muted-foreground leading-tight">Cost per Gap</p>
                        </div>
                        <p className="text-2xl font-bold mb-1">${costPerGap}</p>
                        <p className="text-xs text-muted-foreground">
                          Target: $50-150
                        </p>
                      </div>

                      {/* Eligible Population */}
                      <div>
                        <div className="flex items-start gap-1 mb-1">
                          <Users className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                          <p className="text-sm font-medium text-muted-foreground leading-tight">Eligible Population</p>
                        </div>
                        <p className="text-2xl font-bold mb-1">{eligiblePopulation.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">
                          EPOP total
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
