import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Zap } from 'lucide-react';

interface ActiveCampaignsProps {
  campaigns: string[];
  bundledGaps?: string[];
}

const ActiveCampaigns: React.FC<ActiveCampaignsProps> = ({ campaigns, bundledGaps = [] }) => {
  const campaignIcons: Record<string, string> = {
    'HbA1c Testing': '🩸',
    'Mammogram Screening': '🎯',
    'Flu Shot': '💉',
    'Eye Exam': '👁️'
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Active Campaigns ({campaigns.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {campaigns.map((campaign, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">{campaignIcons[campaign] || '🏁'}</span>
                <span className="text-sm font-medium">{campaign}</span>
              </div>
              <Badge variant="outline" className="text-xs">
                Active
              </Badge>
            </div>
            
            <div className="flex items-center gap-2 ml-6">
              <Button variant="ghost" size="sm" className="h-6 text-xs">
                View Template
                <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        ))}
        
        {bundledGaps.length > 0 && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-800">AI Bundling Active</span>
            </div>
            <div className="text-xs text-green-700">
              Combined: {bundledGaps.join(' + ')}
            </div>
            <div className="text-xs text-green-600 mt-1">
              ✓ Same facility available
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActiveCampaigns;