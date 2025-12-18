
import React, { useState, useEffect, useRef } from 'react';
import { Campaign, DealStatus, Platform } from '../types';
import { generateCampaignImage } from '../services/geminiService';

interface CampaignCardProps {
  campaign: Campaign;
  onViewDetails: (c: Campaign) => void;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, onViewDetails }) => {
  const [aiImageUrl, setAiImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const shareMenuRef = useRef<HTMLDivElement>(null);

  const displayImage = campaign.thumbnailUrl || aiImageUrl;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setShowShareMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isVisible || campaign.thumbnailUrl) return;

    const fetchAiImage = async () => {
      const cacheKey = `adauction_ai_img_${campaign.id}`;
      const cached = localStorage.getItem(cacheKey);
      
      if (cached) {
        setAiImageUrl(cached);
        return;
      }

      setIsGenerating(true);
      try {
        const generated = await generateCampaignImage(campaign.title, campaign.description);
        setAiImageUrl(generated);
        localStorage.setItem(cacheKey, generated);
      } catch (error) {
        console.error("AI Image generation failed:", error);
      } finally {
        setIsGenerating(false);
      }
    };

    fetchAiImage();
  }, [isVisible, campaign.id, campaign.title, campaign.description, campaign.thumbnailUrl]);

  const getPlatformIcon = (p: Platform) => {
    switch (p) {
      case Platform.INSTAGRAM: return '📸';
      case Platform.YOUTUBE: return '🎬';
      case Platform.TELEGRAM: return '✈️';
      case Platform.X: return '🐦';
      case Platform.TIKTOK: return '📱';
      default: return '📢';
    }
  };

  const getPlatformTheme = (p: Platform) => {
    switch (p) {
      case Platform.INSTAGRAM: return 'text-pink-600 bg-white/90 border-pink-100 ring-pink-500/10';
      case Platform.YOUTUBE: return 'text-red-600 bg-white/90 border-red-100 ring-red-500/10';
      case Platform.TELEGRAM: return 'text-sky-600 bg-white/90 border-sky-100 ring-sky-500/10';
      case Platform.X: return 'text-slate-900 bg-white/90 border-slate-200 ring-slate-900/10';
      case Platform.TIKTOK: return 'text-cyan-600 bg-white/90 border-cyan-100 ring-cyan-500/10';
      default: return 'text-indigo-600 bg-white/90 border-indigo-100 ring-indigo-500/10';
    }
  };

  const shareCampaign = (platform: string) => {
    const url = `https://adauction.io/campaign/${campaign.id}`;
    const text = encodeURIComponent(`این کمپین جذاب در AdAuction رو ببین: ${campaign.title}`);
    
    let shareUrl = '';
    switch (platform) {
      case 'telegram': shareUrl = `https://t.me/share/url?url=${url}&text=${text}`; break;
      case 'whatsapp': shareUrl = `https://wa.me/?text=${text}%20${url}`; break;
      case 'x': shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`; break;
      case 'copy':
        navigator.clipboard.writeText(url);
        alert('لینک کپی شد!');
        setShowShareMenu(false);
        return;
    }
    if (shareUrl) window.open(shareUrl, '_blank');
    setShowShareMenu(false);
  };

  return (
    <div 
      ref={cardRef}
      className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 group relative overflow-hidden flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="relative w-full aspect-[16/9] overflow-hidden bg-slate-50 shrink-0">
        {!isVisible && (
          <div className="absolute inset-0 bg-slate-100 flex items-center justify-center animate-pulse">
            <div className="w-10 h-10 border-2 border-indigo-100 border-t-indigo-600 rounded-full animate-spin opacity-40" />
          </div>
        )}

        {isVisible && isGenerating && (
          <div className="absolute inset-0 z-10 bg-gradient-to-br from-slate-100 via-white to-slate-50 flex flex-col items-center justify-center animate-in fade-in duration-500">
            <div className="relative">
              <div className="w-16 h-16 bg-white rounded-3xl shadow-xl flex items-center justify-center text-3xl animate-bounce">🎨</div>
              <div className="absolute -inset-1 bg-indigo-500/20 blur-xl rounded-full animate-pulse" />
            </div>
            <div className="mt-4 flex flex-col items-center gap-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] animate-pulse">Designing Asset...</span>
            </div>
          </div>
        )}

        {displayImage && (
          <img 
            src={displayImage} 
            alt={campaign.title} 
            onLoad={() => setIsLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-1000 ease-out group-hover:scale-110 ${
              isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          />
        )}
        
        {/* Floating Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none z-20">
          <div className="relative pointer-events-auto">
            <div 
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className={`text-[10px] font-bold px-3 py-1.5 rounded-xl shadow-md flex items-center gap-2 border backdrop-blur-lg transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-help ring-4 ${getPlatformTheme(campaign.platform)}`}
            >
              <span className="text-sm transition-transform duration-500 group-hover:rotate-12">{getPlatformIcon(campaign.platform)}</span>
              <span className="tracking-tight">{campaign.platform}</span>
            </div>
            {showTooltip && (
              <div className="absolute top-full left-0 mt-2 whitespace-nowrap bg-slate-900 text-white text-[9px] font-black px-3 py-1.5 rounded-lg shadow-xl animate-in fade-in zoom-in-95 duration-200 z-50">
                پلتفرم مورد نیاز: {campaign.platform}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex gap-2 mb-4">
          {campaign.isAuction && (
             <span className="text-[9px] bg-amber-50 text-amber-600 px-2.5 py-1 rounded-lg border border-amber-100 font-black uppercase tracking-wider">مزایده‌ای</span>
          )}
          <span className={`text-[9px] px-2.5 py-1 rounded-lg border font-black uppercase tracking-wider ${
            campaign.status === DealStatus.OPEN ? 'bg-green-50 text-green-600 border-green-100' : 'bg-slate-50 text-slate-500'
          }`}>
            {campaign.status === DealStatus.OPEN ? 'فعال' : 'بسته شده'}
          </span>
        </div>
        
        <h3 className="font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors leading-relaxed text-base line-clamp-1 flex items-center gap-2">
          {campaign.title}
        </h3>
        
        <p className="text-xs text-slate-500 line-clamp-2 mb-6 leading-relaxed flex-1 font-medium">
          {campaign.description}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-slate-50/70 rounded-3xl border border-slate-100/50">
          <div>
            <p className="text-[9px] text-slate-400 mb-1 font-black uppercase tracking-[0.1em]">بودجه پایه</p>
            <p className="text-sm font-black text-slate-800">
              {campaign.budget.toLocaleString()} <span className="text-[10px] font-normal text-slate-500">تومان</span>
            </p>
          </div>
          <div>
            <p className="text-[9px] text-slate-400 mb-1 font-black uppercase tracking-[0.1em]">مخاطب (حداقل)</p>
            <p className="text-sm font-black text-slate-800">
              {campaign.minFollowers.toLocaleString()}+
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-50">
          <div className="flex -space-x-2.5 rtl:space-x-reverse">
            {[1, 2, 3].map(i => (
              <img 
                key={i} 
                src={`https://picsum.photos/seed/${campaign.id}${i}/48`} 
                className="w-8 h-8 rounded-xl border-2 border-white shadow-sm ring-1 ring-slate-100"
                alt="Bidder"
              />
            ))}
          </div>
          
          <div className="flex items-center gap-2 relative">
             <div className="relative" ref={shareMenuRef}>
               <button 
                 onClick={() => setShowShareMenu(!showShareMenu)}
                 className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${showShareMenu ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                 title="اشتراک‌گذاری"
               >
                 📤
               </button>

               {showShareMenu && (
                 <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 flex flex-col gap-1 z-[100] animate-in fade-in slide-in-from-bottom-2 zoom-in-95 min-w-[120px]">
                   <button onClick={() => shareCampaign('copy')} className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-xl text-[10px] font-bold text-slate-600 transition-colors">
                     <span>🔗</span> کپی لینک
                   </button>
                   <button onClick={() => shareCampaign('telegram')} className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-xl text-[10px] font-bold text-slate-600 transition-colors">
                     <span>✈️</span> تلگرام
                   </button>
                   <button onClick={() => shareCampaign('whatsapp')} className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-xl text-[10px] font-bold text-slate-600 transition-colors">
                     <span>💬</span> واتس‌اپ
                   </button>
                   <button onClick={() => shareCampaign('x')} className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-xl text-[10px] font-bold text-slate-600 transition-colors">
                     <span>🐦</span> توییتر (X)
                   </button>
                   <div className="absolute top-full left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-b border-r border-slate-100 -mt-1.5"></div>
                 </div>
               )}
             </div>

             <button 
               onClick={() => onViewDetails(campaign)}
               className="text-xs font-black text-white bg-indigo-600 px-5 py-2.5 rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95 flex items-center gap-2"
             >
               مشاهده جزئیات
               <span className="text-[10px]">➜</span>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;
