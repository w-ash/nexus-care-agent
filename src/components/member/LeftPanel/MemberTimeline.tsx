import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { Interaction } from '@/data/memberMockData';

interface MemberTimelineProps {
  interactions: Interaction[];
}

const MemberTimeline: React.FC<MemberTimelineProps> = ({ interactions }) => {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'sms': return '📱';
      case 'email': return '📧';
      case 'phone': return '☎️';
      case 'mail': return '📬';
      default: return '💬';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'read': return 'bg-purple-100 text-purple-800';
      case 'responded': return 'bg-emerald-100 text-emerald-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'outreach': return 'bg-blue-100 text-blue-800';
      case 'response': return 'bg-green-100 text-green-800';
      case 'appointment': return 'bg-purple-100 text-purple-800';
      case 'gap_closed': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const sortedInteractions = [...interactions].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 max-h-96 overflow-y-auto">
        {sortedInteractions.map((interaction, index) => (
          <div key={index} className="space-y-2 pb-3 border-b border-border last:border-b-0">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm">{getChannelIcon(interaction.channel)}</span>
                <div className="flex flex-col gap-1">
                  <div className="text-xs text-muted-foreground">
                    {formatDate(interaction.date)}
                  </div>
                  <div className="flex gap-1">
                    <Badge className={`text-xs ${getTypeColor(interaction.type)}`}>
                      {interaction.type.replace('_', ' ')}
                    </Badge>
                    <Badge className={`text-xs ${getStatusColor(interaction.status)}`}>
                      {interaction.status}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleExpanded(index)}
                className="h-6 w-6 p-0"
              >
                {expandedItems.has(index) ? 
                  <ChevronUp className="h-3 w-3" /> : 
                  <ChevronDown className="h-3 w-3" />
                }
              </Button>
            </div>

            {expandedItems.has(index) && (
              <div className="mt-2 p-2 bg-muted rounded text-xs">
                {interaction.content}
              </div>
            )}

            {!expandedItems.has(index) && (
              <div className="text-xs text-muted-foreground line-clamp-1">
                {interaction.content}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default MemberTimeline;