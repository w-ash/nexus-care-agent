import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Play, RotateCcw, MessageSquare } from 'lucide-react';

interface SimulationControlsProps {
  currentStep: number;
  totalSteps: number;
  onSimulateNext: () => void;
  onSimulateResponse: (response: string) => void;
  onReset: () => void;
}

const SimulationControls: React.FC<SimulationControlsProps> = ({
  currentStep,
  totalSteps,
  onSimulateNext,
  onSimulateResponse,
  onReset
}) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  const responseOptions = [
    'YES - Schedule for this week',
    'YES - but need afternoon appointment',
    'YES - but different location preferred',
    'NO - not interested',
    'STOP - opt out'
  ];

  const getStepDescription = (step: number) => {
    switch (step) {
      case 1: return 'Initial campaign applied';
      case 2: return 'AI detects bundling opportunity';
      case 3: return 'Member responds to bundled message';
      case 4: return 'User provides guidance to AI';
      case 5: return 'Campaign completion';
      default: return 'Demo complete';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="h-5 w-5" />
          Demo Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{currentStep}/{totalSteps}</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="text-xs text-muted-foreground">
            {getStepDescription(currentStep)}
          </div>
        </div>

        <div className="space-y-2">
          <Button
            onClick={onSimulateNext}
            disabled={currentStep >= totalSteps}
            className="w-full"
            size="sm"
          >
            <Play className="h-4 w-4 mr-2" />
            Simulate Next Step
          </Button>

          {currentStep >= 2 && currentStep < totalSteps && (
            <div className="space-y-2">
              <div className="text-xs font-medium flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                Simulate Member Response
              </div>
              <Select onValueChange={onSimulateResponse}>
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Choose response..." />
                </SelectTrigger>
                <SelectContent>
                  {responseOptions.map((option, index) => (
                    <SelectItem key={index} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button
            onClick={onReset}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Demo
          </Button>
        </div>

        <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
          <strong>Demo Flow:</strong>
          <ol className="list-decimal list-inside mt-1 space-y-1">
            <li>Initial HbA1c campaign</li>
            <li>AI bundles with mammogram</li>
            <li>Member responds</li>
            <li>User guides AI adaptation</li>
            <li>Successful completion</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimulationControls;