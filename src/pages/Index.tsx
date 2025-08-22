
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from '@/components/Dashboard';
import CampaignBuilder from '@/components/CampaignBuilder';

const Index = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'campaign-builder'>('dashboard');
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);

  const handleCreateCampaign = () => {
    setCurrentPage('campaign-builder');
  };

  const handleViewMember = (memberId: string) => {
    // Use React Router navigation instead of internal routing
    navigate(`/member/${memberId}`);
  };

  const handleEditCampaign = (campaignId: string) => {
    setSelectedCampaignId(campaignId);
    setCurrentPage('campaign-builder');
  };

  const handleBackToDashboard = () => {
    setCurrentPage('dashboard');
    setSelectedCampaignId(null);
  };

  if (currentPage === 'dashboard') {
    return (
      <Dashboard 
        onCreateCampaign={handleCreateCampaign}
        onViewMember={handleViewMember}
        onNavigateHome={handleBackToDashboard}
        onEditCampaign={handleEditCampaign}
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

};

export default Index;
