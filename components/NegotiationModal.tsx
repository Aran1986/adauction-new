
import React, { useState } from 'react';
import { Campaign, DealStatus, UserRole } from '../types';
import { getNegotiationAdvice } from '../services/geminiService';

interface NegotiationModalProps {
  campaign: Campaign;
  userRole: UserRole;
  userNiche?: string;
  onClose: () => void;
  onUpdateStatus: (id: string, newStatus: DealStatus, additionalData?: any) => void;
}

const NegotiationModal: React.FC<NegotiationModalProps> = ({ campaign, userRole, userNiche, onClose, onUpdateStatus }) => {
  const [activeStep, setActiveStep] = useState<'details' | 'chat' | 'escrow'>(
    campaign.status === DealStatus.OPEN ? 'details' : 'escrow'
  );
  const [bidAmount, setBidAmount] = useState(campaign.finalPrice || campaign.budget);
  const [submissionLink, setSubmissionLink] = useState(campaign.submissionLink || '');
  
  // AI Advice State
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);
  const [refinementText, setRefinementText] = useState('');

  // Rating State
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [ratings, setRatings] = useState({ completion: 5, quality: 5, feedback: 5 });
  const [reviewComment, setReviewComment] = useState('');

  const handleLockFunds = () => {
    onUpdateStatus(campaign.id, DealStatus.ESCROW_LOCKED, { finalPrice: bidAmount });
    setActiveStep('escrow');
  };

  const handleCancelEscrow = () => {
    if (confirm('آیا مطمئن هستید که می‌خواهید قرارداد را لغو کنید؟ وجه مسدود شده به حساب شما بازگردانده می‌شود.')) {
      onUpdateStatus(campaign.id, DealStatus.OPEN, { finalPrice: null, submissionLink: null });
      onClose();
    }
  };

  const handleSubmitWork = () => {
    onUpdateStatus(campaign.id, DealStatus.WORK_SUBMITTED, { submissionLink });
  };

  const handleConfirmRelease = () => {
    setShowRatingForm(true);
  };

  const handleFinalSubmit = () => {
    onUpdateStatus(campaign.id, DealStatus.COMPLETED, { 
      ratings, 
      comment: reviewComment 
    });
    setShowRatingForm(false);
  };

  const handleFetchAdvice = async (isRefinement = false) => {
    setIsLoadingAdvice(true);
    if (!isRefinement) setAiAdvice(null);
    try {
      const context = `
        Campaign Title: ${campaign.title}
        Industry/Niche: ${campaign.niche || 'Not specified'}
        Platform: ${campaign.platform}
        Min Followers: ${campaign.minFollowers}
        Description: ${campaign.description}
      `;
      const advice = await getNegotiationAdvice(
        userRole, 
        bidAmount, 
        context, 
        userNiche, 
        isRefinement ? refinementText : undefined,
        aiAdvice || undefined
      );
      setAiAdvice(advice);
      if (isRefinement) setRefinementText('');
    } catch (error) {
      setAiAdvice("متاسفانه در دریافت مشاوره خطایی رخ داد. لطفا دوباره تلاش کنید.");
    } finally {
      setIsLoadingAdvice(false);
    }
  };

  const RatingInput = ({ label, field }: { label: string, field: keyof typeof ratings }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-[10px] font-bold">
        <span className="text-slate-500">{label}</span>
        <span className="text-indigo-600">{ratings[field]} / 5</span>
      </div>
      <input 
        type="range" min="1" max="5" step="1" 
        value={ratings[field]} 
        onChange={e => setRatings(prev => ({...prev, [field]: Number(e.target.value)}))}
        className="w-full accent-indigo-600 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-950/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white">
          <div className="flex items-center gap-4">
             <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${
               campaign.status === DealStatus.OPEN ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'
             }`}>
               {campaign.status === DealStatus.OPEN ? '📄' : '🔒'}
             </div>
             <div>
                <h2 className="text-xl font-bold text-slate-800">{campaign.title}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider ${
                    campaign.status === DealStatus.OPEN ? 'bg-green-100 text-green-700' :
                    campaign.status === DealStatus.ESCROW_LOCKED ? 'bg-amber-100 text-amber-700' :
                    'bg-indigo-100 text-indigo-700'
                  }`}>
                    {campaign.status}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">ID: {campaign.id}</span>
                </div>
             </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 rounded-full text-slate-400 transition-colors">✕</button>
        </div>

        <div className="flex-1 overflow-hidden flex">
          <div className="w-56 bg-slate-50 border-l border-slate-100 p-6 space-y-2">
            {[
              { id: 'details', label: 'جزئیات بریف', icon: '📝' },
              { id: 'chat', label: 'چت و مذاکره', icon: '💬' },
              { id: 'escrow', label: 'سیستم امانت', icon: '🔐' }
            ].map(step => (
              <button 
                key={step.id}
                onClick={() => setActiveStep(step.id as any)}
                className={`w-full text-right p-4 rounded-2xl text-xs font-bold transition-all flex items-center gap-3 ${
                  activeStep === step.id ? 'bg-white shadow-md text-indigo-600 border border-slate-100' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <span>{step.icon}</span> {step.label}
              </button>
            ))}
          </div>

          <div className="flex-1 p-10 overflow-y-auto bg-white custom-scrollbar">
            {activeStep === 'details' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <h4 className="font-bold text-slate-700 mb-3 text-sm">شرح پروژه</h4>
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{campaign.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                    <p className="text-[10px] text-indigo-400 mb-1 font-bold uppercase tracking-widest">بودجه پیشنهادی</p>
                    <p className="text-lg font-black text-indigo-700">{campaign.budget.toLocaleString()} <span className="text-[10px] font-normal">تومان</span></p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] text-slate-400 mb-1 font-bold uppercase tracking-widest">پلتفرم هدف</p>
                    <p className="text-lg font-bold text-slate-700">{campaign.platform}</p>
                  </div>
                </div>

                {campaign.status === DealStatus.OPEN && userRole === UserRole.BRAND && (
                  <div className="bg-amber-50 p-8 rounded-[2.5rem] border border-amber-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xl">💰</span>
                      <label className="text-sm font-bold text-amber-900">تایید نهایی مبلغ و ورود به اسکرو</label>
                    </div>
                    <div className="flex gap-4">
                      <input 
                        type="number" 
                        value={bidAmount}
                        onChange={(e) => setBidAmount(Number(e.target.value))}
                        className="flex-1 bg-white border border-amber-200 rounded-2xl px-5 py-4 text-xl font-black text-slate-700 focus:ring-4 focus:ring-amber-200 outline-none transition-all shadow-inner"
                      />
                      <button 
                        onClick={handleLockFunds}
                        className="bg-amber-500 text-white px-10 py-4 rounded-2xl font-black hover:bg-amber-600 shadow-xl shadow-amber-200 active:scale-95 transition-all text-sm"
                      >
                        قفل وجه در امانت
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeStep === 'chat' && (
              <div className="h-full flex flex-col gap-6">
                <div className="flex-1 flex flex-col bg-slate-50 rounded-[3rem] p-8 border border-slate-100 shadow-inner overflow-hidden">
                  <div className="flex-1 space-y-6 overflow-y-auto mb-6 p-2 custom-scrollbar">
                     <div className="bg-white p-5 rounded-3xl rounded-tr-none text-xs text-slate-600 border border-slate-100 self-start max-w-[85%] shadow-sm leading-relaxed">
                        سلام! ما از رزومه و محتوای شما خیلی خوشمان آمد. آماده شروع همکاری در این کمپین هستیم. آیا مبلغ {campaign.budget.toLocaleString()} تومان برای شما مناسب است؟
                     </div>
                     <div className="bg-indigo-600 p-5 rounded-3xl rounded-tl-none text-xs text-white self-end max-w-[85%] mr-auto shadow-xl shadow-indigo-100 leading-relaxed">
                        سلام، خوشحالم از همکاری. بله، با توجه به حجم کار و بریف ارائه شده، این مبلغ مورد تایید است. لطفاً وجه را در سیستم اسکرو (امانت) فعال کنید تا کار را استارت بزنم.
                     </div>
                     
                     {aiAdvice && (
                       <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-0.5 rounded-[2.5rem] animate-in slide-in-from-bottom-4 fade-in duration-700 shadow-2xl shadow-indigo-200">
                          <div className="bg-white rounded-[2.4rem] p-7">
                            <div className="flex items-center justify-between mb-5">
                               <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-xl shadow-inner">✨</div>
                                  <div>
                                     <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">AdAuction AI Strategist</p>
                                     <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">مشاور اختصاصی مذاکره</p>
                                  </div>
                               </div>
                               <button onClick={() => setAiAdvice(null)} className="text-slate-300 hover:text-rose-500 transition-colors">✕</button>
                            </div>
                            <div className="text-xs text-slate-700 leading-loose whitespace-pre-wrap font-medium">
                               {aiAdvice}
                            </div>
                            
                            {/* Refinement UI */}
                            <div className="mt-6 pt-5 border-t border-slate-100 space-y-4">
                               <div className="flex gap-2">
                                 <input 
                                   type="text"
                                   placeholder="مثلاً: 'لحن را دوستانه‌تر کن' یا 'روی ROI تمرکز کن'..."
                                   value={refinementText}
                                   onChange={e => setRefinementText(e.target.value)}
                                   className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-[10px] outline-none focus:ring-2 focus:ring-indigo-100"
                                 />
                                 <button 
                                   onClick={() => handleFetchAdvice(true)}
                                   disabled={!refinementText || isLoadingAdvice}
                                   className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-[10px] font-black hover:bg-indigo-700 disabled:opacity-50 transition-all"
                                 >
                                   اعمال تغییرات
                                 </button>
                               </div>
                               <div className="flex justify-between items-center">
                                 <span className="text-[9px] text-slate-400 italic">پیشنهاد شده بر اساس تحلیل هوشمند بریف و تخصص شما ({userNiche || 'عمومی'})</span>
                                 <button onClick={() => handleFetchAdvice()} className="text-[10px] font-black text-indigo-600 hover:underline">تحلیل مجدد 🔄</button>
                               </div>
                            </div>
                          </div>
                       </div>
                     )}

                     {isLoadingAdvice && (
                       <div className="flex flex-col items-center gap-4 bg-white/50 backdrop-blur-sm p-10 rounded-[3rem] self-center border border-white shadow-sm w-full">
                          <div className="relative">
                            <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center text-xs">✨</div>
                          </div>
                          <div className="text-center">
                            <span className="text-xs font-black text-slate-700 block mb-1">در حال تدوین استراتژی شخصی‌سازی شده...</span>
                            <span className="text-[9px] text-slate-400 font-bold">هوش مصنوعی در حال بررسی شاخص‌های بازار و بریف پروژه است</span>
                          </div>
                       </div>
                     )}
                  </div>

                  <div className="flex gap-3">
                     <input className="flex-1 bg-white rounded-2xl px-6 py-4 text-xs outline-none border border-slate-200 focus:ring-4 focus:ring-indigo-100 shadow-sm transition-all font-medium" placeholder="پیام خود را در اینجا بنویسید..." />
                     <button className="bg-indigo-600 text-white px-8 rounded-2xl font-black text-xs hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-100">ارسال پیام</button>
                  </div>
                </div>

                {!aiAdvice && !isLoadingAdvice && (
                  <button 
                    onClick={() => handleFetchAdvice()}
                    className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] animate-gradient text-white py-5 rounded-[2rem] font-black text-sm shadow-2xl shadow-indigo-200 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-4 group"
                  >
                    <span className="text-2xl group-hover:rotate-12 transition-transform">✨</span>
                    <span>دریافت استراتژی مذاکره هوشمند (AdAuction AI)</span>
                    <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold">Pro Feature</span>
                  </button>
                )}
              </div>
            )}

            {activeStep === 'escrow' && (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 animate-in zoom-in-95 duration-300">
                 {!showRatingForm ? (
                   <>
                     {campaign.status === DealStatus.OPEN ? (
                       <div className="space-y-6">
                          <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center text-6xl mx-auto shadow-inner border border-slate-100">🤝</div>
                          <div>
                            <h3 className="text-2xl font-black text-slate-800">در انتظار توافق نهایی</h3>
                            <p className="text-xs text-slate-400 max-w-xs mx-auto mt-3 leading-relaxed">پس از تایید مبلغ در بخش گفتگو، برند باید وجه را در صندوق امانت قفل کند تا پروژه به صورت رسمی آغاز شود.</p>
                          </div>
                          <button onClick={() => setActiveStep('chat')} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold text-xs">بازگشت به گفتگو</button>
                       </div>
                     ) : campaign.status === DealStatus.ESCROW_LOCKED ? (
                       <div className="w-full max-w-md space-y-8">
                          <div className="relative">
                            <div className="w-28 h-28 bg-amber-500 text-white rounded-[2.5rem] flex items-center justify-center text-5xl mx-auto shadow-2xl shadow-amber-200 border-8 border-white animate-in zoom-in-50 duration-500">🔒</div>
                            <div className="absolute top-0 right-1/2 translate-x-12 bg-white text-amber-600 px-3 py-1 rounded-full text-[10px] font-black border border-amber-100 shadow-sm">ACTIVE ESCROW</div>
                          </div>
                          
                          <div>
                            <h3 className="text-2xl font-black text-slate-800">وجه در امانت قفل شده است</h3>
                            <p className="text-xs text-slate-500 mt-2 font-bold bg-slate-50 inline-block px-4 py-2 rounded-full border border-slate-100">
                               مبلغ نهایی: <span className="text-indigo-600 font-black">{campaign.finalPrice?.toLocaleString()}</span> تومان
                            </p>
                          </div>
                          
                          {userRole === UserRole.INFLUENCER ? (
                            <div className="space-y-4 pt-6 border-t border-slate-100">
                               <div className="text-right">
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">لینک محتوای نهایی (پست یا استوری)</label>
                                 <input 
                                   placeholder="https://instagram.com/p/..." 
                                   value={submissionLink}
                                   onChange={e => setSubmissionLink(e.target.value)}
                                   className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono focus:ring-4 focus:ring-indigo-100 outline-none transition-all shadow-inner" 
                                 />
                               </div>
                               <button onClick={handleSubmitWork} className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black shadow-2xl shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all text-sm">تحویل پروژه و درخواست آزادسازی وجه</button>
                            </div>
                          ) : (
                            <div className="space-y-6 pt-6 border-t border-slate-100">
                               <div className="flex flex-col items-center">
                                 <div className="flex gap-2 mb-4">
                                   <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce delay-75"></div>
                                   <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce delay-150"></div>
                                   <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce delay-300"></div>
                                 </div>
                                 <span className="text-[10px] text-amber-700 font-black bg-amber-50 px-6 py-2.5 rounded-full border border-amber-100 tracking-tight">منتظر تحویل محتوا توسط اینفلوئنسر هستیم...</span>
                               </div>
                               <button onClick={handleCancelEscrow} className="text-rose-500 font-black text-[10px] hover:underline uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">لغو قرارداد و عودت وجه به کیف پول</button>
                            </div>
                          )}
                       </div>
                     ) : campaign.status === DealStatus.WORK_SUBMITTED ? (
                       <div className="w-full max-w-md space-y-8">
                          <div className="w-28 h-28 bg-blue-600 text-white rounded-[2.5rem] flex items-center justify-center text-5xl mx-auto border-8 border-white shadow-2xl shadow-blue-100">📥</div>
                          <h3 className="text-2xl font-black text-slate-800">محتوا تحویل داده شد</h3>
                          
                          <div className="bg-indigo-50 p-6 rounded-[2rem] border border-indigo-100 shadow-sm">
                            <p className="text-[10px] font-black text-indigo-400 mb-3 uppercase tracking-widest text-center">لینک محتوای ارسالی</p>
                            <a 
                              href={campaign.submissionLink} 
                              target="_blank" 
                              className="text-sm font-bold text-indigo-700 underline break-all block text-center"
                            >
                              {campaign.submissionLink}
                            </a>
                          </div>
                          
                          {userRole === UserRole.BRAND ? (
                            <div className="flex flex-col gap-4">
                               <button onClick={handleConfirmRelease} className="w-full bg-green-600 text-white py-5 rounded-2xl font-black text-sm hover:bg-green-700 shadow-2xl shadow-green-200 active:scale-95 transition-all">تایید کیفیت و آزادسازی وجه</button>
                               <button onClick={handleCancelEscrow} className="text-rose-500 font-black text-[10px] hover:underline uppercase tracking-widest">رد محتوا و ثبت شکایت (Dispute)</button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-4">
                               <div className="flex items-center gap-3 bg-indigo-50 px-8 py-3 rounded-full border border-indigo-100 animate-pulse">
                                 <span className="text-xs text-indigo-700 font-black">در انتظار تایید نهایی برند...</span>
                               </div>
                               <p className="text-[10px] text-slate-400 max-w-[200px]">برند حداکثر ۴۸ ساعت فرصت دارد تا محتوا را بررسی و تایید کند.</p>
                            </div>
                          )}
                       </div>
                     ) : campaign.status === DealStatus.COMPLETED && (
                       <div className="space-y-8 animate-in zoom-in-90 duration-700">
                          <div className="relative">
                             <div className="w-32 h-32 bg-emerald-500 text-white rounded-full flex items-center justify-center text-6xl mx-auto shadow-[0_0_50px_rgba(16,185,129,0.4)] border-8 border-white">🏆</div>
                          </div>
                          <div>
                            <h3 className="text-3xl font-black text-slate-800">همکاری با موفقیت ثبت شد</h3>
                            <p className="text-sm text-slate-500 max-w-xs mx-auto mt-4 leading-relaxed font-medium">وجه از امانت آزاد شد و امتیاز این همکاری در پروفایل هر دو طرف ثبت گردید.</p>
                          </div>
                          <button onClick={onClose} className="bg-slate-900 text-white px-16 py-5 rounded-2xl font-black shadow-2xl shadow-slate-200 hover:bg-black transition-all text-sm active:scale-95">بستن پنجره</button>
                       </div>
                     )}
                   </>
                 ) : (
                   <div className="w-full max-w-lg space-y-8 animate-in slide-in-from-bottom-8 duration-500">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-inner">⭐</div>
                        <h3 className="text-2xl font-black text-slate-800 mb-2">ثبت بازخورد نهایی</h3>
                      </div>

                      <div className="space-y-8 bg-slate-50 p-10 rounded-[3rem] border border-slate-100 shadow-inner">
                        <RatingInput label="کیفیت و خلاقیت محتوا" field="quality" />
                        <RatingInput label="زمان‌بندی و تعهد به ددلاین" field="completion" />
                        <RatingInput label="نحوه تعامل و پاسخگویی" field="feedback" />
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mr-2">متن نظر (اختیاری)</label>
                        <textarea 
                          rows={3} 
                          placeholder="تجربه خود را در چند جمله کوتاه بنویسید..."
                          value={reviewComment}
                          onChange={e => setReviewComment(e.target.value)}
                          className="w-full p-5 bg-white border border-slate-200 rounded-[2rem] text-xs focus:ring-4 focus:ring-indigo-100 outline-none transition-all shadow-sm font-medium"
                        />
                      </div>

                      <button 
                        onClick={handleFinalSubmit}
                        className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] font-black shadow-2xl shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all text-base"
                      >
                        ثبت نظر و آزادسازی نهایی وجه
                      </button>
                   </div>
                 )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NegotiationModal;
