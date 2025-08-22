
import React, { useState } from 'react';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'campaign-builder' | 'member-detail'>('dashboard');
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  const handleCreateCampaign = () => {
    setCurrentPage('campaign-builder');
  };

  const handleViewMember = (memberId: string) => {
    setSelectedMemberId(memberId);
    setCurrentPage('member-detail');
  };

  const handleBackToDashboard = () => {
    setCurrentPage('dashboard');
    setSelectedMemberId(null);
  };

  // For now, just render the Dashboard
  // We'll add the other pages in subsequent phases
  if (currentPage === 'dashboard') {
    return (
      <Dashboard 
        onCreateCampaign={handleCreateCampaign}
        onViewMember={handleViewMember}
      />
    );
  }

  // Placeholder for other pages
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={handleBackToDashboard}
          className="mb-4 text-primary hover:underline"
        >
          ← Back to Dashboard
        </button>
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">
            {currentPage === 'campaign-builder' ? 'Campaign Builder' : 'Member Detail'} 
            - Coming Soon
          </h2>
          <p className="text-muted-foreground">
            This page will be implemented in the next phase
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
