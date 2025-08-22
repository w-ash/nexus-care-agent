import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Clock, MessageSquare, Globe } from 'lucide-react';
import { MemberProfile } from '@/data/memberMockData';

interface MemberInfoProps {
  member: MemberProfile;
}

const MemberInfo: React.FC<MemberInfoProps> = ({ member }) => {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityCount = (priority: string) => {
    return member.gaps.filter(gap => gap.priority === priority).length;
  };

  const channelIcons = {
    sms: '📱',
    email: '📧',
    phone: '☎️'
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Member Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">{member.name}</h3>
          <p className="text-sm text-muted-foreground">
            {member.gender}, Age {member.age}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Risk Level:</span>
          <Badge className={getRiskColor(member.riskLevel)}>
            {member.riskLevel.toUpperCase()}
          </Badge>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Care Gaps ({member.gaps.length})</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span>Critical:</span>
              <Badge variant="destructive" className="text-xs">
                {getPriorityCount('critical')}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>High:</span>
              <Badge variant="secondary" className="text-xs bg-red-100 text-red-800">
                {getPriorityCount('high')}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Medium:</span>
              <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                {getPriorityCount('medium')}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Low:</span>
              <Badge variant="secondary" className="text-xs">
                {getPriorityCount('low')}
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Preferences</h4>
          <div className="space-y-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-3 w-3" />
              <span>Channel: {channelIcons[member.preferredChannel]} {member.preferredChannel.toUpperCase()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3" />
              <span>Time: {member.preferredTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-3 w-3" />
              <span>Language: {member.language}</span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t">
          <div className="grid grid-cols-2 gap-4 text-center">
            {member.gaps.map((gap, index) => (
              <div key={index} className="space-y-1">
                <div className="text-xs font-medium">{gap.type}</div>
                <div className="text-xs text-muted-foreground">
                  {gap.daysOverdue} days
                </div>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${
                    gap.priority === 'high' ? 'border-red-300 text-red-700' :
                    gap.priority === 'medium' ? 'border-yellow-300 text-yellow-700' :
                    'border-gray-300 text-gray-700'
                  }`}
                >
                  {gap.priority}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MemberInfo;