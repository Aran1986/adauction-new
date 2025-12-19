
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
import { UserRole, Campaign, Platform, AppNotification, FilterState, DealStatus, User, Transaction, Chat, Message } from './types';
import { MOCK_USER, MOCK_CAMPAIGNS } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('marketplace');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isCreateWizardOpen, setIsCreateWizardOpen] = useState(false);
  
  // Persistence Keys
  const CAMPAIGNS_KEY = 'adauction_v2_campaigns';
  const USER_KEY = 'adauction_v2_user';
  const CHATS_KEY = 'adauction_v2_chats';

  // Global State
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    const saved = localStorage.getItem(CAMPAIGNS_KEY);
    return saved ? JSON.parse(saved) : MOCK_CAMPAIGNS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem(USER_KEY);
    return saved ? JSON.parse(saved) : MOCK_USER;
  });

  const [chats, setChats] = useState<Chat[]>(() => {
    const saved = localStorage.getItem(CHATS_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [apiKeys, setApiKeys] = useState<{key: string, label: string, date: string}[]>([
    { key: 'aa_live_4839201938bdf2819', label: 'تولید (Production)', date: '۱۴۰۲/۰۹/۱۵' }
  ]);

  const [filters, setFilters] = useState<FilterState>({
    platforms: [],
    adTypes: [],
    minBudget: null,
    maxBudget: null,
    minFollowers: null,
    isAuction: null,
    niche: null
  });

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(CHATS_KEY, JSON.stringify(chats));
  }, [chats]);

  const addNotification = (title: string, message: string, type: 'BID' | 'UPDATE' | 'SYSTEM') => {
    setNotifications(prev => [{
      id: `n-${Date.now()}`, title, message, type, timestamp: 'هم‌اکنون', read: false
    }, ...prev]);
  };

  const updateCampaignStatus = (id: string, newStatus: DealStatus, additionalData: any = {}) => {
    const targetCampaign = campaigns.find(c => c.id === id);
    if (!targetCampaign) return;

    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: newStatus, ...additionalData } : c));

    // Logic for Wallet Updates (Simulating Backend Logic)
    if (newStatus === DealStatus.ESCROW_LOCKED && currentUser.role === UserRole.BRAND) {
      const amount = additionalData.finalPrice || targetCampaign.budget;
      const transaction: Transaction = {
        id: `t-${Date.now()}`,
        type: 'ESCROW_LOCK',
        amount: amount,
        description: `مسدودسازی وجه در امانت: ${targetCampaign.title}`,
        timestamp: new Date().toLocaleDateString('fa-IR'),
        status: 'SUCCESS'
      };
      setCurrentUser(prev => ({
        ...prev,
        wallet: {
          ...prev.wallet,
          availableBalance: prev.wallet.availableBalance - amount,
          escrowBalance: prev.wallet.escrowBalance + amount,
          transactions: [transaction, ...prev.wallet.transactions]
        }
      }));
      addNotification('تراکنش مالی', `مبلغ ${amount.toLocaleString()} تومان در امانت قفل شد.`, 'SYSTEM');
    }

    if (newStatus === DealStatus.COMPLETED) {
      const amount = targetCampaign.finalPrice || targetCampaign.budget;
      if (currentUser.role === UserRole.INFLUENCER) {
        const transaction: Transaction = {
          id: `t-${Date.now()}`,
          type: 'INCOME',
          amount: amount,
          description: `تسویه نهایی کمپین: ${targetCampaign.title}`,
          timestamp: new Date().toLocaleDateString('fa-IR'),
          status: 'SUCCESS'
        };
        setCurrentUser(prev => ({
          ...prev,
          wallet: {
            ...prev.wallet,
            availableBalance: prev.wallet.availableBalance + amount,
            totalEarned: prev.wallet.totalEarned + amount,
            transactions: [transaction, ...prev.wallet.transactions]
          }
        }));
      } else {
        // Brand's escrow balance decreases
        setCurrentUser(prev => ({
          ...prev,
          wallet: {
            ...prev.wallet,
            escrowBalance: prev.wallet.escrowBalance - amount,
          }
        }));
      }
      addNotification('پایان پروژه', `قرارداد ${targetCampaign.title} با موفقیت تکمیل شد.`, 'UPDATE');
    }
  };

  const handleSendMessage = (campaignId: string, text: string) => {
    const newMessage: Message = {
      id: `m-${Date.now()}`,
      senderId: currentUser.id,
      text: text,
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
    };

    setChats(prev => {
      const chatIndex = prev.findIndex(c => c.campaignId === campaignId);
      if (chatIndex > -1) {
        const updated = [...prev];
        updated[chatIndex] = { ...updated[chatIndex], messages: [...updated[chatIndex].messages, newMessage] };
        return updated;
      }
      return [...prev, { campaignId, messages: [newMessage] }];
    });
  };

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
  const currentChat = selectedCampaign ? chats.find(c => c.campaignId === selectedCampaign.id) : undefined;

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
      {activeTab === 'dashboard' && <Dashboard user={currentUser} campaigns={campaigns} />}
      
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

      {activeTab === 'api-dev' && (
        <DeveloperPortal 
          apiKeys={apiKeys} 
          onGenerateKey={() => {
            const newKey = { key: `aa_test_${Math.random().toString(36).substr(2, 16)}`, label: 'تست جدید', date: 'هم‌اکنون' };
            setApiKeys([...apiKeys, newKey]);
            addNotification('سیستم توسعه‌دهنده', 'کلید API جدید صادر شد.', 'SYSTEM');
          }} 
        />
      )}

      {activeTab === 'profile' && <ProfileSection user={currentUser} />}

      {activeTab === 'wallet' && <WalletSection wallet={currentUser.wallet} />}

      {activeTab === 'settings' && (
        <SettingsSection 
          currentUser={currentUser} 
          onUpdateRole={(newRole) => {
            setCurrentUser(prev => ({ ...prev, role: newRole }));
            addNotification('تغییر نقش کاربری', `نقش شما به ${newRole === UserRole.BRAND ? 'برند' : 'اینفلوئنسر'} تغییر یافت.`, 'SYSTEM');
          }}
        />
      )}

      {activeTab === 'analytics' && (
        <div className="bg-white p-16 rounded-[3rem] text-center border border-slate-100 shadow-sm animate-in zoom-in-95">
           <div className="text-5xl mb-6">📈</div>
           <h3 className="text-2xl font-black text-slate-800">گزارشات تحلیلی پیشرفته</h3>
           <p className="text-slate-400 text-sm mt-4 leading-relaxed max-w-lg mx-auto">
             در این بخش می‌توانید نرخ بازگشت سرمایه (ROI)، تعامل مخاطبان و رشد کانال‌های خود را به صورت دقیق رصد کنید.
             <br />
             <span className="text-indigo-600 font-bold mt-2 inline-block">داده‌ها بر اساس کمپین‌های فعال شما در حال تجمیع هستند.</span>
           </p>
           <div className="grid grid-cols-3 gap-6 mt-12">
              {[
                { label: 'نرخ تعامل (ER)', value: '۵.۴٪' },
                { label: 'هزینه به ازای کلیک', value: '۱۲۰۰ تومان' },
                { label: 'رشد فالوئر ماهانه', value: '+۸۵۰ نفر' }
              ].map(stat => (
                <div key={stat.label} className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 mb-2 uppercase">{stat.label}</p>
                  <p className="text-xl font-black text-indigo-700">{stat.value}</p>
                </div>
              ))}
           </div>
        </div>
      )}

      {activeTab === 'messages' && (
        <div className="bg-white p-16 rounded-[3rem] text-center border border-slate-100 shadow-sm">
           <div className="text-5xl mb-6">💬</div>
           <h3 className="text-2xl font-black text-slate-800">مرکز گفتگوی هوشمند</h3>
           <p className="text-slate-400 text-sm mt-4">شما فعلاً گفتگوی بازی ندارید. برای شروع، وارد یکی از کمپین‌ها در بازارچه شوید.</p>
        </div>
      )}
      
      {selectedCampaign && (
        <NegotiationModal 
          campaign={selectedCampaign} 
          userRole={currentUser.role}
          userNiche={currentUser.niche.join(', ')}
          userId={currentUser.id}
          onClose={() => setSelectedCampaign(null)} 
          onUpdateStatus={updateCampaignStatus}
          chatData={currentChat}
          onSendMessage={handleSendMessage}
        />
      )}

      {isFilterModalOpen && (
        <FilterModal currentFilters={filters} onApply={setFilters} onClose={() => setIsFilterModalOpen(false)} />
      )}

      {isCreateWizardOpen && (
        <CreateCampaignWizard 
          onClose={() => setIsCreateWizardOpen(false)} 
          onSave={(newCampaigns) => {
            setCampaigns(prev => [...newCampaigns, ...prev]);
            setIsCreateWizardOpen(false);
            addNotification('انتشار آگهی', `${newCampaigns.length} کمپین جدید با موفقیت منتشر شد.`, 'SYSTEM');
          }} 
        />
      )}
    </Layout>
  );
};

export default App;
