
import React, { useState } from 'react';
import Dashboard from '@/components/Dashboard';
import CampaignBuilder from '@/components/CampaignBuilder';
import Header from '@/components/ui/header';

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

  if (currentPage === 'dashboard') {
    return (
      <Dashboard 
        onCreateCampaign={handleCreateCampaign}
        onViewMember={handleViewMember}
        onNavigateHome={handleBackToDashboard}
      />
    );
  }

  if (currentPage === 'campaign-builder') {
    return (
      <CampaignBuilder 
        onBack={handleBackToDashboard}
        onNavigateHome={handleBackToDashboard}
        onSave={(campaign) => {
          // TODO: Save campaign to mock data
          console.log('Saving campaign:', campaign);
        }}
      />
    );
  }

  // Placeholder for member detail page
  return (
    <div className="min-h-screen bg-background">
      <Header 
        onTitleClick={handleBackToDashboard}
        showCreateButton={false}
        showSimulateButton={false}
        showResetButton={false}
      />
      <div className="max-w-4xl mx-auto p-6">
        <button 
          onClick={handleBackToDashboard}
          className="mb-4 text-primary hover:underline"
        >
          ← Back to Dashboard
        </button>
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">
            Member Detail - Coming Soon
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
