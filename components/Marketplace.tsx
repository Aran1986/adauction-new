
import React from 'react';
import CampaignCard from './CampaignCard';
import { Campaign, FilterState, Platform, AdType } from '../types';

interface MarketplaceProps {
  campaigns: Campaign[];
  filters: FilterState;
  onOpenFilters: () => void;
  onRemoveFilter: (key: keyof FilterState, value?: any) => void;
  onViewDetails: (c: Campaign) => void;
  getPlatformIcon: (p: Platform) => string;
}

const Marketplace: React.FC<MarketplaceProps> = ({ 
  campaigns, 
  filters, 
  onOpenFilters, 
  onRemoveFilter, 
  onViewDetails,
  getPlatformIcon 
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800">اکتشاف فرصت‌های همکاری</h3>
          <button 
            onClick={onOpenFilters}
            className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-all border border-indigo-100 flex items-center gap-2"
          >
            <span>⚙️</span> فیلتر پیشرفته
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {filters.platforms.map(p => (
            <span key={p} className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-2 animate-in zoom-in-90 shadow-sm">
              <span className="text-xs">{getPlatformIcon(p)}</span>
              {p} 
              <button onClick={() => onRemoveFilter('platforms', p)} className="hover:text-rose-200 transition-colors mr-1">✕</button>
            </span>
          ))}
          {filters.adTypes.map(t => (
            <span key={t} className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-2 animate-in zoom-in-90 shadow-sm">
              <span>🎞️</span>
              {t} 
              <button onClick={() => onRemoveFilter('adTypes', t)} className="hover:text-rose-200 transition-colors mr-1">✕</button>
            </span>
          ))}
          {filters.isAuction !== null && (
            <span className={`px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-2 animate-in zoom-in-90 shadow-sm ${filters.isAuction ? 'bg-amber-500' : 'bg-blue-500'} text-white`}>
              <span>{filters.isAuction ? '⚡ مزایده‌ای' : '💎 ثابت'}</span>
              <button onClick={() => onRemoveFilter('isAuction')} className="hover:text-slate-200 transition-colors mr-1">✕</button>
            </span>
          )}
          {filters.niche && (
            <span className="bg-slate-800 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-2 animate-in zoom-in-90 shadow-sm">
              <span>🏷️</span> دسته: {filters.niche} 
              <button onClick={() => onRemoveFilter('niche')} className="hover:text-rose-200 transition-colors mr-1">✕</button>
            </span>
          )}
          {filters.minBudget !== null && (
            <span className="bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-2 animate-in zoom-in-90 shadow-sm">
              <span>💰</span> از {filters.minBudget.toLocaleString()} 
              <button onClick={() => onRemoveFilter('minBudget')} className="hover:text-rose-500 transition-colors mr-1">✕</button>
            </span>
          )}
          {filters.maxBudget !== null && (
            <span className="bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-2 animate-in zoom-in-90 shadow-sm">
              <span>💰</span> تا {filters.maxBudget.toLocaleString()} 
              <button onClick={() => onRemoveFilter('maxBudget')} className="hover:text-rose-500 transition-colors mr-1">✕</button>
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map(c => (
          <CampaignCard key={c.id} campaign={c} onViewDetails={onViewDetails} />
        ))}
      </div>
      
      {campaigns.length === 0 && (
        <div className="p-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
          <div className="text-5xl mb-4 opacity-10">📭</div>
          <p className="text-slate-400 font-bold">موردی یافت نشد. فیلترها را تغییر دهید.</p>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
