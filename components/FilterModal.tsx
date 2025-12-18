
import React, { useState } from 'react';
import { Platform, AdType, FilterState } from '../types';
import { CATEGORIES } from '../constants';

interface FilterModalProps {
  currentFilters: FilterState;
  onApply: (filters: FilterState) => void;
  onClose: () => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ currentFilters, onApply, onClose }) => {
  const [tempFilters, setTempFilters] = useState<FilterState>(currentFilters);

  const togglePlatform = (p: Platform) => {
    setTempFilters(prev => ({
      ...prev,
      platforms: prev.platforms.includes(p)
        ? prev.platforms.filter(item => item !== p)
        : [...prev.platforms, p]
    }));
  };

  const toggleAdType = (t: AdType) => {
    setTempFilters(prev => ({
      ...prev,
      adTypes: prev.adTypes.includes(t)
        ? prev.adTypes.filter(item => item !== t)
        : [...prev.adTypes, t]
    }));
  };

  const handleApply = () => {
    onApply(tempFilters);
    onClose();
  };

  const handleReset = () => {
    const reset: FilterState = {
      platforms: [],
      adTypes: [],
      minBudget: null,
      maxBudget: null,
      minFollowers: null,
      isAuction: null,
      niche: null
    };
    setTempFilters(reset);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>🎨</span> فیلترهای پیشرفته
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          {/* Platforms */}
          <div>
            <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">🌐 پلتفرم‌های مورد نظر</h4>
            <div className="flex flex-wrap gap-2">
              {Object.values(Platform).map(p => (
                <button
                  key={p}
                  onClick={() => togglePlatform(p)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                    tempFilters.platforms.includes(p)
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Ad Types */}
          <div>
            <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">🎞️ نوع محتوا</h4>
            <div className="flex flex-wrap gap-2">
              {Object.values(AdType).map(t => (
                <button
                  key={t}
                  onClick={() => toggleAdType(t)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                    tempFilters.adTypes.includes(t)
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-100'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Budget Range */}
          <div>
            <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">💰 محدوده بودجه (تومان)</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-slate-400 mb-1 block">حداقل</label>
                <input
                  type="number"
                  placeholder="مثلا ۵,۰۰۰,۰۰۰"
                  value={tempFilters.minBudget || ''}
                  onChange={e => setTempFilters(prev => ({ ...prev, minBudget: e.target.value ? Number(e.target.value) : null }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-400 outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 mb-1 block">حداکثر</label>
                <input
                  type="number"
                  placeholder="مثلا ۱۰۰,۰۰۰,۰۰۰"
                  value={tempFilters.maxBudget || ''}
                  onChange={e => setTempFilters(prev => ({ ...prev, maxBudget: e.target.value ? Number(e.target.value) : null }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-400 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Followers */}
            <div>
              <h4 className="text-sm font-bold text-slate-700 mb-4">👥 حداقل دنبال‌کننده</h4>
              <select
                value={tempFilters.minFollowers || ''}
                onChange={e => setTempFilters(prev => ({ ...prev, minFollowers: e.target.value ? Number(e.target.value) : null }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-400 outline-none"
              >
                <option value="">همه</option>
                <option value="1000">بیش از ۱,۰۰۰</option>
                <option value="10000">بیش از ۱۰,۰۰۰</option>
                <option value="50000">بیش از ۵۰,۰۰۰</option>
                <option value="100000">بیش از ۱۰۰,۰۰۰</option>
                <option value="500000">بیش از ۵۰۰,۰۰۰</option>
              </select>
            </div>

            {/* Campaign Type (isAuction) */}
            <div>
              <h4 className="text-sm font-bold text-slate-700 mb-4">⚡ وضعیت مزایده</h4>
              <div className="flex gap-2">
                <button
                  onClick={() => setTempFilters(prev => ({ ...prev, isAuction: prev.isAuction === true ? null : true }))}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${
                    tempFilters.isAuction === true
                      ? 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-100'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-amber-300'
                  }`}
                >
                  مزایده‌ای
                </button>
                <button
                  onClick={() => setTempFilters(prev => ({ ...prev, isAuction: prev.isAuction === false ? null : false }))}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${
                    tempFilters.isAuction === false
                      ? 'bg-blue-500 text-white border-blue-600 shadow-md shadow-blue-100'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-blue-300'
                  }`}
                >
                  ثابت (عادی)
                </button>
              </div>
            </div>
          </div>

          {/* Niche/Category */}
          <div>
            <h4 className="text-sm font-bold text-slate-700 mb-4">🏷️ حوزه فعالیت</h4>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setTempFilters(prev => ({ ...prev, niche: prev.niche === cat ? null : cat }))}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all border ${
                    tempFilters.niche === cat
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-sm'
                      : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-between gap-3">
          <button
            onClick={handleReset}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-50 transition-colors"
          >
            پاک کردن همه
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-200 transition-colors"
            >
              انصراف
            </button>
            <button
              onClick={handleApply}
              className="px-10 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100"
            >
              اعمال فیلترها
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
