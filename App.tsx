
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Marketplace from './components/Marketplace';
import DeveloperPortal from './components/DeveloperPortal';
import Dashboard from './components/Dashboard';
import ProfileSection from './components/ProfileSection';
import WalletSection from './components/WalletSection';
import SettingsSection from './components/SettingsSection';
import NegotiationModal from './components/NegotiationModal';
import FilterModal from './components/FilterModal';
import CreateCampaignWizard from './components/CreateCampaignWizard';
import { UserRole, Campaign, Platform, AppNotification, FilterState, DealStatus, User } from './types';
import { MOCK_USER, MOCK_CAMPAIGNS } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('marketplace');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isCreateWizardOpen, setIsCreateWizardOpen] = useState(false);
  
  const [apiKeys, setApiKeys] = useState<{key: string, label: string, date: string}[]>([
    { key: 'ix_live_4839201938bdf2819', label: 'تولید (Production)', date: '۱۴۰۲/۰۹/۱۵' }
  ]);

  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    const saved = localStorage.getItem('influex_campaigns');
    return saved ? JSON.parse(saved) : MOCK_CAMPAIGNS as any;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('influex_user');
    return saved ? JSON.parse(saved) : MOCK_USER;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    localStorage.setItem('influex_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  const [filters, setFilters] = useState<FilterState>({
    platforms: [],
    adTypes: [],
    minBudget: null,
    maxBudget: null,
    minFollowers: null,
    isAuction: null,
    niche: null
  });

  const getPlatformIcon = (p: Platform) => {
    switch (p) {
      case Platform.INSTAGRAM: return '📸';
      case Platform.YOUTUBE: return '🎬';
      case Platform.TELEGRAM: return '✈️';
      case Platform.X: return '🐦';
      case Platform.TIKTOK: return '📱';
      case Platform.FACEBOOK: return '👥';
      default: return '📢';
    }
  };

  const handleGenerateApiKey = () => {
    const newKey = {
      key: `ix_test_${Math.random().toString(36).substr(2, 16)}`,
      label: 'تست جدید',
      date: 'هم‌اکنون'
    };
    setApiKeys([...apiKeys, newKey]);
    addNotification('کلید API ایجاد شد', 'یک کلید دسترسی جدید صادر گردید.', 'SYSTEM');
  };

  const addNotification = (title: string, message: string, type: any) => {
    setNotifications(prev => [{
      id: `n-${Date.now()}`, title, message, type, timestamp: 'هم‌اکنون', read: false
    }, ...prev]);
  };

  const handleCreateCampaigns = (newCampaigns: Campaign[]) => {
    setCampaigns(prev => [...newCampaigns, ...prev]);
    setIsCreateWizardOpen(false);
    addNotification('انتشار آگهی‌ها', `${newCampaigns.length} آگهی جدید منتشر شد.`, 'SYSTEM');
  };

  const updateCampaignStatus = (id: string, newStatus: DealStatus, additionalData: any = {}) => {
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: newStatus, ...additionalData } : c));
  };

  const filteredCampaigns = campaigns.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = filters.platforms.length === 0 || filters.platforms.includes(c.platform);
    const matchesAdType = filters.adTypes.length === 0 || filters.adTypes.includes(c.adType);
    const matchesBudget = (filters.minBudget === null || c.budget >= filters.minBudget) &&
                          (filters.maxBudget === null || c.budget <= filters.maxBudget);
    const matchesFollowers = filters.minFollowers === null || c.minFollowers >= filters.minFollowers;
    const matchesAuction = filters.isAuction === null || c.isAuction === filters.isAuction;
    const matchesNiche = filters.niche === null || c.niche === filters.niche;

    return matchesSearch && matchesPlatform && matchesAdType && matchesBudget && matchesFollowers && matchesAuction && matchesNiche;
  });

  const myDealsCampaigns = campaigns.filter(c => c.status !== DealStatus.OPEN);

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      userRole={currentUser.role}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      notifications={notifications}
      onMarkRead={(id) => setNotifications(prev => prev.map(n => n.id === id ? {...n, read: true} : n))}
      onCreateCampaign={() => setIsCreateWizardOpen(true)}
    >
      {activeTab === 'dashboard' && <Dashboard />}
      
      {activeTab === 'marketplace' && (
        <Marketplace 
          campaigns={filteredCampaigns.filter(c => c.status === DealStatus.OPEN)}
          filters={filters}
          onOpenFilters={() => setIsFilterModalOpen(true)}
          onRemoveFilter={(key, val) => setFilters(prev => ({...prev, [key]: Array.isArray(prev[key]) ? (prev[key] as any).filter(v => v !== val) : null}))}
          onViewDetails={setSelectedCampaign}
          getPlatformIcon={getPlatformIcon}
        />
      )}

      {activeTab === 'my-deals' && (
        <Marketplace 
          campaigns={myDealsCampaigns}
          filters={filters}
          onOpenFilters={() => setIsFilterModalOpen(true)}
          onRemoveFilter={(key, val) => setFilters(prev => ({...prev, [key]: null}))}
          onViewDetails={setSelectedCampaign}
          getPlatformIcon={getPlatformIcon}
        />
      )}

      {activeTab === 'api-dev' && <DeveloperPortal apiKeys={apiKeys} onGenerateKey={handleGenerateApiKey} />}

      {activeTab === 'profile' && <ProfileSection user={currentUser} />}

      {activeTab === 'wallet' && <WalletSection wallet={currentUser.wallet} />}

      {activeTab === 'settings' && <SettingsSection />}

      {activeTab === 'analytics' && (
        <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-slate-100">
           <div className="text-6xl mb-4">🚀</div>
           <h3 className="text-xl font-black text-slate-800">به زودی: آنالیتیکس پیشرفته</h3>
           <p className="text-slate-400 text-xs mt-2">سیستم در حال جمع‌آوری داده‌های اولیه برای تحلیل ROI است.</p>
        </div>
      )}

      {activeTab === 'messages' && (
        <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-slate-100">
           <div className="text-6xl mb-4">💬</div>
           <h3 className="text-xl font-black text-slate-800">مرکز گفتگو</h3>
           <p className="text-slate-400 text-xs mt-2">برای شروع گفتگو، وارد یکی از کمپین‌ها در بازارچه شوید.</p>
        </div>
      )}
      
      {selectedCampaign && (
        <NegotiationModal 
          campaign={selectedCampaign} 
          userRole={currentUser.role}
          onClose={() => setSelectedCampaign(null)} 
          onUpdateStatus={updateCampaignStatus}
        />
      )}

      {isFilterModalOpen && (
        <FilterModal currentFilters={filters} onApply={setFilters} onClose={() => setIsFilterModalOpen(false)} />
      )}

      {isCreateWizardOpen && (
        <CreateCampaignWizard onClose={() => setIsCreateWizardOpen(false)} onSave={handleCreateCampaigns} />
      )}
    </Layout>
  );
};

export default App;
