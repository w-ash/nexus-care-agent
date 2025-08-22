import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Zap, RotateCcw } from 'lucide-react';

interface HeaderProps {
  onTitleClick: () => void;
  onCreateCampaign?: () => void;
  onSimulate?: () => void;
  onReset?: () => void;
  showCreateButton?: boolean;
  showSimulateButton?: boolean;
  showResetButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  onTitleClick,
  onCreateCampaign,
  onSimulate,
  onReset,
  showCreateButton = false,
  showSimulateButton = false,
  showResetButton = false,
}) => {
  return (
    <header className="border-b bg-card px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div 
          onClick={onTitleClick}
          className="cursor-pointer hover:opacity-80 transition-opacity"
        >
          <h1 className="text-2xl font-bold text-gradient">Healthcare Campaign Manager</h1>
          <p className="text-muted-foreground">AI-powered care gap closure platform</p>
        </div>
        <div className="flex gap-3">
          {showResetButton && onReset && (
            <Button variant="outline" onClick={onReset} className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Reset Demo
            </Button>
          )}
          {showSimulateButton && onSimulate && (
            <Button variant="outline" onClick={onSimulate} className="gap-2">
              <Zap className="w-4 h-4" />
              Simulate 3 Days
            </Button>
          )}
          {showCreateButton && onCreateCampaign && (
            <Button onClick={onCreateCampaign} className="gap-2 bg-gradient-ai">
              <Plus className="w-4 h-4" />
              Create Campaign
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;