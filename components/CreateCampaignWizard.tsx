
import React, { useState, useEffect, useMemo } from 'react';
import { Platform, AdType, DealStatus, Campaign } from '../types';

interface CreateCampaignWizardProps {
  onClose: () => void;
  onSave: (campaigns: Campaign[]) => void;
}

interface BatchCampaignInput {
  platform: Platform;
  adType: AdType;
  budget: number;
  minFollowers: number;
  deadline: string;
}

const PLATFORM_AD_TYPE_MAP: Record<Platform, AdType[]> = {
  [Platform.INSTAGRAM]: [AdType.POST, AdType.STORY, AdType.REELS],
  [Platform.YOUTUBE]: [AdType.VIDEO, AdType.PODCAST],
  [Platform.TELEGRAM]: [AdType.POST, AdType.STORY],
  [Platform.TIKTOK]: [AdType.VIDEO, AdType.REELS],
  [Platform.X]: [AdType.POST, AdType.VIDEO],
  [Platform.FACEBOOK]: [AdType.POST, AdType.STORY, AdType.REELS],
};

const CreateCampaignWizard: React.FC<CreateCampaignWizardProps> = ({ onClose, onSave }) => {
  const [step, setStep] = useState(1);
  const [baseData, setBaseData] = useState({
    title: '',
    description: '',
    niche: '',
    platforms: [] as Platform[],
    adTypes: [] as AdType[],
    globalBudget: 5000000,
    globalFollowers: 1000,
    globalDeadline: '۱۴۰۳/۰۶/۰۱',
  });

  const [batchItems, setBatchItems] = useState<BatchCampaignInput[]>([]);

  // Calculate allowed AdTypes based on the union of all selected platforms
  const allowedAdTypes = useMemo(() => {
    if (baseData.platforms.length === 0) return Object.values(AdType);
    const types = new Set<AdType>();
    baseData.platforms.forEach(p => {
      PLATFORM_AD_TYPE_MAP[p].forEach(t => types.add(t));
    });
    return Array.from(types);
  }, [baseData.platforms]);

  // Prune selected adTypes if they are no longer supported by ANY of the selected platforms
  useEffect(() => {
    if (baseData.platforms.length > 0) {
      const pruned = baseData.adTypes.filter(t => allowedAdTypes.includes(t));
      if (pruned.length !== baseData.adTypes.length) {
        setBaseData(prev => ({ ...prev, adTypes: pruned }));
      }
    }
  }, [allowedAdTypes, baseData.platforms]);

  // Generate distinct combinations ONLY for valid platform-adType pairs when entering step 3
  useEffect(() => {
    if (step === 3) {
      const combos: BatchCampaignInput[] = [];
      baseData.platforms.forEach(p => {
        const validTypesForThisPlatform = PLATFORM_AD_TYPE_MAP[p];
        baseData.adTypes.forEach(t => {
          // Verify this specific combination is valid for the current platform
          if (validTypesForThisPlatform.includes(t)) {
            combos.push({
              platform: p,
              adType: t,
              budget: baseData.globalBudget,
              minFollowers: baseData.globalFollowers,
              deadline: baseData.globalDeadline
            });
          }
        });
      });
      setBatchItems(combos);
    }
  }, [step]); // Only regenerate when moving between steps to avoid overwriting manual edits in Step 3

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleFinalSave = () => {
    const finalCampaigns: Campaign[] = batchItems.map((item, idx) => ({
      id: `c-${Date.now()}-${idx}`,
      brandId: 'b-current',
      title: `${baseData.title} (${item.adType} - ${item.platform})`,
      description: baseData.description,
      budget: item.budget,
      platform: item.platform,
      adType: item.adType,
      minFollowers: item.minFollowers,
      deadline: item.deadline,
      expirationDate: item.deadline,
      status: DealStatus.OPEN,
      isAuction: false,
      bids: [],
      niche: baseData.niche
    }));
    onSave(finalCampaigns);
  };

  const togglePlatform = (p: Platform) => {
    setBaseData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(p) 
        ? prev.platforms.filter(item => item !== p) 
        : [...prev.platforms, p]
    }));
  };

  const toggleAdType = (t: AdType) => {
    setBaseData(prev => ({
      ...prev,
      adTypes: prev.adTypes.includes(t) 
        ? prev.adTypes.filter(item => item !== t) 
        : [...prev.adTypes, t]
    }));
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

  const getAdTypeIcon = (t: AdType) => {
    switch (t) {
      case AdType.POST: return '🖼️';
      case AdType.STORY: return '⏳';
      case AdType.REELS: return '🎬';
      case AdType.VIDEO: return '📽️';
      case AdType.PODCAST: return '🎙️';
      default: return '📄';
    }
  };

  const totalPlannedBudget = batchItems.reduce((acc, curr) => acc + curr.budget, 0);

  // Count potential combinations for visual feedback in Step 2
  const potentialCount = useMemo(() => {
    let count = 0;
    baseData.platforms.forEach(p => {
      const validTypes = PLATFORM_AD_TYPE_MAP[p];
      baseData.adTypes.forEach(t => {
        if (validTypes.includes(t)) count++;
      });
    });
    return count;
  }, [baseData.platforms, baseData.adTypes]);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-indigo-950/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-5xl rounded-[3rem] shadow-2xl flex flex-col overflow-hidden max-h-[95vh]">
        {/* Header */}
        <div className="p-8 border-b border-slate-50">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">ایجاد کمپین هوشمند</h2>
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 rounded-full text-slate-400 transition-colors">✕</button>
          </div>
          
          <div className="relative flex justify-between px-12">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
            <div 
              className="absolute top-1/2 left-0 h-0.5 bg-indigo-600 -translate-y-1/2 z-0 transition-all duration-500" 
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            />
            {['اطلاعات بریف', 'پلتفرم و نوع', 'مدیریت سرمایه', 'تایید نهایی'].map((title, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center gap-2 bg-white px-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  step > idx + 1 ? 'bg-indigo-600 text-white' : 
                  step === idx + 1 ? 'bg-white border-4 border-indigo-600 text-indigo-600 scale-110 shadow-lg' : 
                  'bg-slate-100 text-slate-400'
                }`}>
                  {step > idx + 1 ? '✓' : idx + 1}
                </div>
                <span className={`text-[10px] font-bold ${step === idx + 1 ? 'text-indigo-600' : 'text-slate-400'}`}>
                  {title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-left-4 duration-300">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">عنوان پایه کمپین</label>
                <input 
                  type="text" 
                  placeholder="مثلا: معرفی کالکشن تابستانه"
                  value={baseData.title}
                  onChange={e => setBaseData({...baseData, title: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">توضیحات بریف (کپی برای تمام واحدها)</label>
                <textarea 
                  rows={4}
                  placeholder="سناریو و اهداف کلی برند را بنویسید..."
                  value={baseData.description}
                  onChange={e => setBaseData({...baseData, description: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">بودجه پایه هر واحد (تومان)</label>
                  <input 
                    type="number"
                    value={baseData.globalBudget || ''}
                    onChange={e => setBaseData({...baseData, globalBudget: Number(e.target.value)})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">ددلاین پیشنهادی</label>
                  <input 
                    type="text"
                    placeholder="۱۴۰۳/۰۶/۰۱"
                    value={baseData.globalDeadline}
                    onChange={e => setBaseData({...baseData, globalDeadline: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-12 animate-in slide-in-from-left-4 duration-500">
              <div>
                <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                   <span className="bg-indigo-50 p-2 rounded-xl text-xl">🌐</span> مرحله اول: انتخاب پلتفرم‌ها
                </h3>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                  {Object.values(Platform).map(p => {
                    const isSelected = baseData.platforms.includes(p);
                    return (
                      <div
                        key={p}
                        onClick={() => togglePlatform(p)}
                        className={`p-4 rounded-[2rem] border-2 transition-all cursor-pointer flex flex-col items-center gap-2 relative ${
                          isSelected ? 'border-indigo-600 bg-indigo-50 shadow-lg shadow-indigo-100' : 'border-slate-100 bg-white hover:border-slate-300'
                        }`}
                      >
                        <span className="text-3xl">{getPlatformIcon(p)}</span>
                        <span className={`text-[10px] font-black ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`}>{p}</span>
                        {isSelected && <div className="absolute top-2 left-2 text-indigo-600 font-bold text-xs">✓</div>}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className={`text-xl font-black mb-6 flex items-center gap-2 transition-opacity ${baseData.platforms.length === 0 ? 'opacity-30' : 'opacity-100'}`}>
                   <span className="bg-emerald-50 p-2 rounded-xl text-xl">🎞️</span> مرحله دوم: انتخاب نوع محتوا
                </h3>
                {baseData.platforms.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                    <p className="text-xs font-bold text-slate-400">ابتدا حداقل یک پلتفرم را از بالا انتخاب کنید تا گزینه‌های مجاز نمایش داده شوند.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {Object.values(AdType).map(t => {
                      const isAllowed = allowedAdTypes.includes(t);
                      const isSelected = baseData.adTypes.includes(t);
                      
                      if (!isAllowed) return null;

                      return (
                        <div
                          key={t}
                          onClick={() => toggleAdType(t)}
                          className={`p-4 rounded-[2rem] border-2 transition-all cursor-pointer flex flex-col items-center gap-2 animate-in fade-in zoom-in-95 ${
                            isSelected ? 'border-emerald-600 bg-emerald-50 shadow-lg shadow-emerald-100' : 'border-slate-100 bg-white hover:border-slate-300'
                          }`}
                        >
                          <span className="text-3xl">{getAdTypeIcon(t)}</span>
                          <span className={`text-[10px] font-black ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`}>{t}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {potentialCount > 0 && (
                <div className="bg-indigo-600 text-white p-6 rounded-[2.5rem] flex items-center justify-between shadow-2xl shadow-indigo-100 animate-in slide-in-from-bottom-4">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl">🧩</div>
                      <div>
                        <p className="text-xs font-black">آماده‌سازی خودکار پکیج کمپین</p>
                        <p className="text-[10px] opacity-70">سیستم بر اساس انتخاب‌های شما، {potentialCount} آگهی مجزا ایجاد خواهد کرد.</p>
                      </div>
                   </div>
                   <div className="text-2xl font-black">{potentialCount} <span className="text-xs font-normal">کمپین</span></div>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in slide-in-from-left-4 duration-500">
              <div className="bg-amber-50 border border-amber-200 p-6 rounded-[2rem] flex items-center gap-6 shadow-sm">
                <div className="text-4xl">🛡️</div>
                <div className="flex-1">
                  <h4 className="font-black text-amber-900 mb-1 text-sm">مدیریت سرمایه واحدها</h4>
                  <p className="text-[11px] text-amber-700 leading-relaxed">
                    تعداد <span className="font-black underline">{batchItems.length} واحد کمپین مجزا</span> شناسایی شد. می‌توانید بودجه هر کدام را به صورت تکی تغییر دهید.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {batchItems.map((item, idx) => (
                  <div key={idx} className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 hover:border-indigo-200 transition-all group relative">
                    <div className="absolute top-4 left-4 flex gap-2">
                       <span className="bg-white px-3 py-1 rounded-xl text-[9px] font-black shadow-sm border border-slate-100">{item.platform}</span>
                       <span className="bg-white px-3 py-1 rounded-xl text-[9px] font-black shadow-sm border border-slate-100">{item.adType}</span>
                    </div>
                    <div className="flex items-center gap-4 mb-6 pt-4">
                       <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-slate-100">
                         {getPlatformIcon(item.platform)}
                       </div>
                       <div>
                         <h5 className="text-xs font-black text-slate-800">{baseData.title || 'بدون عنوان'}</h5>
                         <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">واحد شماره {idx + 1}</p>
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] font-black text-slate-400 mb-1 block">بودجه واحد (تومان)</label>
                        <input 
                          type="number"
                          value={item.budget}
                          onChange={e => {
                            const newItems = [...batchItems];
                            newItems[idx].budget = Number(e.target.value);
                            setBatchItems(newItems);
                          }}
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-black outline-none focus:border-indigo-500 transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-black text-slate-400 mb-1 block">حداقل فالوئر</label>
                        <input 
                          type="number"
                          value={item.minFollowers}
                          onChange={e => {
                            const newItems = [...batchItems];
                            newItems[idx].minFollowers = Number(e.target.value);
                            setBatchItems(newItems);
                          }}
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-black outline-none focus:border-indigo-500 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center space-y-8 animate-in zoom-in-95 duration-500 py-10">
               <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-[2.5rem] flex items-center justify-center text-5xl mx-auto shadow-inner">🚀</div>
               <div>
                  <h3 className="text-3xl font-black text-slate-800 mb-4">آماده انتشار پکیج تبلیغاتی</h3>
                  <p className="text-sm text-slate-500 max-w-lg mx-auto leading-loose">
                    با تایید نهایی، سیستم به صورت خودکار <span className="font-black text-indigo-600">{batchItems.length} کمپین مجزا</span> در بازارچه ایجاد خواهد کرد تا اینفلوئنسرهای هر حوزه بتوانند پروپوزال‌های خود را ارسال کنند.
                  </p>
               </div>
               
               <div className="max-w-md mx-auto bg-slate-50 p-8 rounded-[3rem] border border-slate-100 shadow-inner">
                  <div className="flex justify-between mb-4 pb-4 border-b border-slate-200">
                     <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">تعداد کل آگهی‌ها</span>
                     <span className="text-sm font-black text-slate-800">{batchItems.length} مورد</span>
                  </div>
                  <div className="flex justify-between">
                     <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">جمع کل سرمایه اختصاصی</span>
                     <span className="text-sm font-black text-indigo-600">{totalPlannedBudget.toLocaleString()} تومان</span>
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-slate-50 bg-slate-50/30 flex justify-between gap-4">
          <button 
            onClick={step === 1 ? onClose : prevStep}
            className="px-10 py-4 rounded-2xl text-sm font-bold text-slate-500 hover:bg-white hover:shadow-sm transition-all"
          >
            {step === 1 ? 'انصراف' : 'مرحله قبلی'}
          </button>
          
          <button 
            disabled={
              (step === 1 && !baseData.title) || 
              (step === 2 && (baseData.platforms.length === 0 || baseData.adTypes.length === 0)) ||
              (step === 3 && batchItems.length === 0)
            }
            onClick={step === 4 ? handleFinalSave : nextStep}
            className={`px-12 py-4 rounded-2xl text-sm font-black text-white shadow-xl transition-all flex items-center gap-3 ${
              step === 4 ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'
            } disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            {step === 4 ? 'تایید و انتشار سراسری' : 'ادامه فرآیند'}
            {step < 4 && <span>➜</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCampaignWizard;
