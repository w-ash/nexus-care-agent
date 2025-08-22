import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Users, 
  Clock,
  Phone,
  Mail,
  MessageSquare,
  ExternalLink
} from 'lucide-react';
import { EligibleMember, searchEligibleMembers } from '@/data/eligibleMembers';

interface ExpandableCampaignCardProps {
  campaign: {
    id: string;
    name: string;
    priority: 'high' | 'medium' | 'low';
    activeMembers: number;
    closureRate: number;
    roi: number;
  };
  onEditCampaign?: (campaignId: string) => void;
  onViewMember?: (memberId: string) => void;
}

const ExpandableCampaignCard: React.FC<ExpandableCampaignCardProps> = ({
  campaign,
  onEditCampaign,
  onViewMember
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [eligibleMembers, setEligibleMembers] = useState<EligibleMember[]>([]);

  // Load members when expanded
  const handleToggleExpanded = () => {
    if (!isExpanded) {
      const members = searchEligibleMembers(campaign.id, '');
      setEligibleMembers(members);
    }
    setIsExpanded(!isExpanded);
  };

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const members = searchEligibleMembers(campaign.id, value);
    setEligibleMembers(members);
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'sms': return <MessageSquare className="h-3 w-3" />;
      case 'email': return <Mail className="h-3 w-3" />;
      case 'phone': return <Phone className="h-3 w-3" />;
      default: return <MessageSquare className="h-3 w-3" />;
    }
  };

  const formatLastContact = (date?: Date) => {
    if (!date) return 'No contact';
    const days = Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    return `${days}d ago`;
  };

  // Calculate metrics
  const eligiblePopulation = Math.floor(campaign.activeMembers * 1.15);
  const numerator = Math.floor(eligiblePopulation * (campaign.closureRate / 100));
  const performanceRate = ((numerator / eligiblePopulation) * 100);
  const openGaps = eligiblePopulation - numerator;
  const avgTimeToClose = Math.floor(30 + Math.random() * 35);
  const engagementRate = Math.floor(65 + Math.random() * 25);

  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        {/* Header with campaign name, metrics, and expand button */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-xl">{campaign.name}</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditCampaign?.(campaign.id)}
                  className="gap-2 shrink-0"
                >
                  <ExternalLink className="w-4 h-4" />
                  Edit Campaign
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleToggleExpanded}
                  className="gap-2"
                >
                  <Users className="w-4 h-4" />
                  Members
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <Badge variant={getPriorityBadgeVariant(campaign.priority)}>
                {campaign.priority}
              </Badge>
              <span className="text-sm text-muted-foreground">
                HEDIS Measure
              </span>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Performance Rate</p>
            <p className="text-2xl font-bold text-success mb-1">{performanceRate.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground">
              {numerator.toLocaleString()}/{eligiblePopulation.toLocaleString()} EPOP
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Open Gaps</p>
            <p className="text-2xl font-bold mb-1">{openGaps.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Remaining members</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Avg Time to Close</p>
            <p className="text-2xl font-bold mb-1">{avgTimeToClose}d</p>
            <p className="text-xs text-muted-foreground">Target: 45-60d</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Engagement Rate</p>
            <p className="text-2xl font-bold mb-1">{engagementRate}%</p>
            <p className="text-xs text-muted-foreground">Target: 75%</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Cost per Gap</p>
            <p className="text-2xl font-bold mb-1">${campaign.roi}</p>
            <p className="text-xs text-muted-foreground">Target: $50-150</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Eligible Population</p>
            <p className="text-2xl font-bold mb-1">{eligiblePopulation.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">EPOP total</p>
          </div>
        </div>
      </div>

      {/* Expandable Members Section */}
      {isExpanded && (
        <CardContent className="border-t bg-muted/20 p-6">
          <div className="space-y-4">
            {/* Search Header */}
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-lg">Eligible Members</h4>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Members List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {eligibleMembers.length > 0 ? (
                eligibleMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 bg-background rounded-lg border hover:border-primary/50 transition-colors cursor-pointer group"
                    onClick={() => onViewMember?.('maria')}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium group-hover:text-primary transition-colors">
                            {member.name}
                          </span>
                          <Badge className={`text-xs ${getRiskColor(member.riskLevel)}`}>
                            {member.riskLevel}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                          <span>Age {member.age}</span>
                          <span>{member.gapType}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {member.daysOverdue}d overdue
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        {getChannelIcon(member.preferredChannel)}
                        {member.preferredChannel}
                      </span>
                      <span>{formatLastContact(member.lastContact)}</span>
                      <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {searchTerm ? `No members found matching "${searchTerm}"` : 'No eligible members found'}
                </div>
              )}
            </div>

            {eligibleMembers.length > 0 && (
              <div className="text-xs text-muted-foreground text-center pt-2 border-t">
                Showing {eligibleMembers.length} of {eligibleMembers.length} members
                {searchTerm && ` matching "${searchTerm}"`}
                {eligibleMembers.length === 10 && ' (max 10 shown)'}
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default ExpandableCampaignCard;