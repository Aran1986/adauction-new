
import React from 'react';
import { User, Campaign, DealStatus } from '../types';

interface DashboardProps {
  user: User;
  campaigns: Campaign[];
}

const Dashboard: React.FC<DashboardProps> = ({ user, campaigns }) => {
  const activeCampaigns = campaigns.filter(c => c.status !== DealStatus.COMPLETED && c.status !== DealStatus.OPEN).length;
  const completedCampaigns = campaigns.filter(c => c.status === DealStatus.COMPLETED).length;
  const totalRevenue = user.wallet.totalEarned;
  
  const stats = [
    { label: 'کل درآمد کسب شده', value: totalRevenue.toLocaleString(), unit: 'تومان', icon: '💰', color: 'text-emerald-600' },
    { label: 'پروژه‌های در جریان', value: activeCampaigns.toString(), unit: 'واحد', icon: '🚀', color: 'text-indigo-600' },
    { label: 'نرخ تکمیل موفقیت‌آمیز', value: '۱۰۰', unit: 'درصد', icon: '📈', color: 'text-rose-600' },
    { label: 'مجموع بیدهای فعال', value: campaigns.reduce((acc, c) => acc + c.bids.length, 0).toString(), unit: 'مورد', icon: '🤝', color: 'text-amber-600' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl">{stat.icon}</div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${stat.color}`}>+۱۲٪ رشد</span>
            </div>
            <p className="text-[10px] font-bold text-slate-400 mb-1">{stat.label}</p>
            <h4 className="text-xl font-black text-slate-800">{stat.value} <span className="text-[10px] font-normal text-slate-400">{stat.unit}</span></h4>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
          <h3 className="text-lg font-black text-slate-800 mb-8 flex items-center gap-3">
            <span className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-sm">📊</span>
            روند درآمدهای هفتگی
          </h3>
          <div className="h-64 flex items-end gap-6 px-4">
             {[30, 60, 40, 80, 50, 90, 70].map((h, i) => (
               <div key={i} className="flex-1 group relative">
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-800 text-white text-[8px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {h * 100}k
                  </div>
                  <div className="w-full bg-indigo-100 rounded-xl transition-all hover:bg-indigo-600" style={{ height: `${h}%` }}></div>
                  <div className="mt-4 text-[8px] font-bold text-slate-400 text-center uppercase">روز {i + 1}</div>
               </div>
             ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
           <h3 className="text-lg font-black text-slate-800 mb-6">توزیع موجودی</h3>
           <div className="space-y-6">
              <div className="p-5 bg-emerald-50 rounded-[1.5rem] border border-emerald-100">
                <p className="text-[10px] text-emerald-600 font-bold mb-1">قابل برداشت</p>
                <p className="text-xl font-black text-emerald-800">{user.wallet.availableBalance.toLocaleString()} <span className="text-[10px] font-normal opacity-50">تومان</span></p>
              </div>
              <div className="p-5 bg-amber-50 rounded-[1.5rem] border border-amber-100">
                <p className="text-[10px] text-amber-600 font-bold mb-1">در صندوق امانت</p>
                <p className="text-xl font-black text-amber-800">{user.wallet.escrowBalance.toLocaleString()} <span className="text-[10px] font-normal opacity-50">تومان</span></p>
              </div>
              <div className="p-5 bg-indigo-50 rounded-[1.5rem] border border-indigo-100">
                <p className="text-[10px] text-indigo-600 font-bold mb-1">مجموع درآمد</p>
                <p className="text-xl font-black text-indigo-800">{user.wallet.totalEarned.toLocaleString()} <span className="text-[10px] font-normal opacity-50">تومان</span></p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
