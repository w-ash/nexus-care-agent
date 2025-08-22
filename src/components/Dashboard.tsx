
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
import ExpandableCampaignCard from '@/components/ExpandableCampaignCard';

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
            {campaigns.map((campaign) => (
              <ExpandableCampaignCard
                key={campaign.id}
                campaign={campaign}
                onEditCampaign={onEditCampaign}
                onViewMember={onViewMember}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
