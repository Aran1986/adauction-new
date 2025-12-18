
import React, { useState, useRef, useEffect } from 'react';
import { UserRole, AppNotification } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  notifications: AppNotification[];
  onMarkRead: (id: string) => void;
  onCreateCampaign: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeTab, 
  setActiveTab, 
  userRole, 
  searchQuery, 
  onSearchChange,
  notifications,
  onMarkRead,
  onCreateCampaign
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter(n => !n.read).length;

  const menuItems = [
    { id: 'dashboard', label: 'پیشخوان مدیریتی', icon: '💎', desc: 'مشاهده آمار رشد، درآمد کل و وضعیت کمپین‌ها در یک نگاه.' },
    { id: 'marketplace', label: 'بازارچه کمپین‌ها', icon: '🛒', desc: 'جستجو در لیست آگهی‌های فعال و فیلتر بر اساس بودجه و پلتفرم.' },
    { id: 'my-deals', label: 'قراردادهای هوشمند', icon: '📝', desc: 'مدیریت پروژه‌های جاری، سیستم امانت (Escrow) و چت‌های فعال.' },
    { id: 'messages', label: 'مرکز گفتگو', icon: '💬', desc: 'ارتباط مستقیم با برندها و مذاکره بر اساس بریف پروژه.' },
    { id: 'analytics', label: 'گزارشات تحلیلی', icon: '📊', desc: 'تحلیل دقیق بازخورد مخاطبان و نرخ تبدیل کمپین‌های اجرا شده.' },
    { id: 'wallet', label: 'کیف پول و امانت', icon: '💳', desc: 'مدیریت واریز وجه، برداشت درآمد و مشاهده تراکنش‌های امن.' },
    { id: 'api-dev', label: 'سرویس‌های API', icon: '🚀', desc: 'دسترسی به مستندات فنی و کلیدهای API برای خودکارسازی.' },
    { id: 'profile', label: 'پروفایل حرفه‌ای', icon: '✨', desc: 'نمایش رزومه، شبکه‌های اجتماعی متصل و ویرایش اطلاعات فردی.' },
    { id: 'settings', label: 'پیکربندی سیستم', icon: '⚙️', desc: 'تنظیمات امنیتی، فعال‌سازی اعلان‌ها و شخصی‌سازی حساب.' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden" dir="rtl">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-l border-slate-200 flex flex-col shadow-sm z-30 relative">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <span className="bg-indigo-600 text-white p-2 rounded-xl text-xl shadow-lg shadow-indigo-100">🚀</span>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">AdAuction</h1>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-1.5 custom-scrollbar relative">
          {menuItems.map((item) => (
            <div 
              key={item.id} 
              className="relative"
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === item.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm font-bold">{item.label}</span>
              </button>

              {/* Enhanced Tooltip: Positioned Fixed to avoid overflow issues */}
              {hoveredItem === item.id && (
                <div 
                  className="fixed right-72 mr-4 w-56 bg-slate-900/95 backdrop-blur-md text-white p-4 rounded-2xl text-[11px] shadow-2xl z-[100] animate-in fade-in slide-in-from-right-4 pointer-events-none"
                  style={{ top: 'auto', marginTop: '-45px' }}
                >
                  <div className="font-black mb-1.5 border-b border-white/20 pb-1.5 flex items-center gap-2">
                    <span>{item.icon}</span>
                    {item.label}
                  </div>
                  <p className="leading-relaxed text-slate-300 font-medium">{item.desc}</p>
                  <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-slate-900 rotate-45"></div>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 bg-white">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">👤</div>
            <div className="flex-1 overflow-hidden">
               <p className="text-xs font-bold text-slate-800 truncate">علی محمدی</p>
               <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">کاربر ویژه</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative bg-slate-50/50">
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100 p-4 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-black text-slate-800">
              {menuItems.find(i => i.id === activeTab)?.label}
            </h2>
            <div className="relative">
              <input 
                type="text" 
                placeholder="جستجو در پلتفرم..." 
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="bg-slate-100 border-none rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-indigo-200 w-64 transition-all"
              />
              <span className="absolute left-3 top-2.5 opacity-30 text-xs">🔍</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="relative" ref={notificationRef}>
               <button onClick={() => setShowNotifications(!showNotifications)} className="p-2.5 bg-slate-100 rounded-xl relative hover:bg-slate-200 transition-colors">
                 🔔 {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[8px] flex items-center justify-center rounded-full border border-white font-bold">{unreadCount}</span>}
               </button>
             </div>
             <button onClick={onCreateCampaign} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">+ ثبت پروژه جدید</button>
          </div>
        </header>
        <div className="p-8 pb-24">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
