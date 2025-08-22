import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';

const JourneyLegend: React.FC = () => {
  const legendItems = [
    {
      label: 'Completed',
      color: 'bg-gray-200 border-gray-400',
      description: 'Already executed'
    },
    {
      label: 'Current',
      color: 'bg-blue-500 border-blue-700 text-white animate-pulse',
      description: 'Happening now'
    },
    {
      label: 'Scheduled',
      color: 'bg-white border-gray-400 border-dashed',
      description: 'Future planned'
    },
    {
      label: 'AI Bundled',
      color: 'bg-green-500 border-green-700 text-white',
      description: 'Combined by AI'
    },
    {
      label: 'AI Adapted',
      color: 'bg-purple-500 border-purple-700 text-white',
      description: 'Modified by AI'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Info className="h-4 w-4" />
          Journey Legend
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {legendItems.map((item, index) => (
            <div key={index} className="flex flex-col items-center gap-2 text-center">
              <div 
                className={`w-12 h-8 rounded border-2 ${item.color} flex items-center justify-center`}
              />
              <div className="space-y-1">
                <div className="text-xs font-medium">{item.label}</div>
                <div className="text-xs text-muted-foreground">{item.description}</div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-xs text-blue-800">
            <strong>AI Intelligence:</strong> Watch how the AI adapts Maria's journey in real-time, 
            bundling care gaps and personalizing based on her preferences and responses.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JourneyLegend;