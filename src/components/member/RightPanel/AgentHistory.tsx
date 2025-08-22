import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, ChevronDown, ChevronUp, Brain, Zap } from 'lucide-react';
import { AgentDecision } from '@/data/memberMockData';

interface AgentHistoryProps {
  decisions: AgentDecision[];
}

const AgentHistory: React.FC<AgentHistoryProps> = ({ decisions }) => {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set([0])); // Expand first item by default

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  const getOutcomeColor = (outcome?: string) => {
    switch (outcome) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionIcon = (action: string) => {
    if (action.toLowerCase().includes('bundling')) {
      return <Zap className="h-3 w-3 text-green-600" />;
    }
    return <Brain className="h-3 w-3 text-blue-600" />;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const sortedDecisions = [...decisions].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return (
    <Card className="h-[400px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Clock className="h-4 w-4" />
          Agent Reasoning Log
        </CardTitle>
        <div className="text-xs text-muted-foreground">
          Transparent AI decision-making process
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto space-y-3 p-4 pt-0">
        {sortedDecisions.map((decision, index) => (
          <div key={index} className="border border-border rounded-lg overflow-hidden">
            <div className="p-3 bg-muted/30">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2 flex-1">
                  {getActionIcon(decision.action)}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium line-clamp-1">
                      {decision.action}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {formatTime(decision.timestamp)}
                    </div>
                    <div className="flex gap-1 mt-2">
                      {decision.affectedGaps.map((gap, gapIndex) => (
                        <Badge key={gapIndex} variant="outline" className="text-xs">
                          {gap}
                        </Badge>
                      ))}
                      {decision.outcome && (
                        <Badge className={`text-xs ${getOutcomeColor(decision.outcome)}`}>
                          {decision.outcome}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpanded(index)}
                  className="h-6 w-6 p-0 ml-2"
                >
                  {expandedItems.has(index) ? 
                    <ChevronUp className="h-3 w-3" /> : 
                    <ChevronDown className="h-3 w-3" />
                  }
                </Button>
              </div>
            </div>

            {expandedItems.has(index) && (
              <div className="p-3 bg-background">
                <div className="text-xs text-foreground">
                  <div className="font-medium mb-2">Reasoning:</div>
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {decision.reasoning}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {sortedDecisions.length === 0 && (
          <div className="text-center text-muted-foreground text-sm py-8">
            No decisions logged yet. The AI agent will explain its reasoning here as it adapts Maria's journey.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AgentHistory;