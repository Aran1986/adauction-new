
import React, { useState, useEffect } from 'react';
import { Campaign, DealStatus, UserRole, Message, Chat } from '../types';
import { getNegotiationAdvice } from '../services/geminiService';

interface NegotiationModalProps {
  campaign: Campaign;
  userRole: UserRole;
  userNiche?: string;
  userId: string;
  onClose: () => void;
  onUpdateStatus: (id: string, newStatus: DealStatus, additionalData?: any) => void;
  chatData?: Chat;
  onSendMessage: (campaignId: string, text: string) => void;
}

const NegotiationModal: React.FC<NegotiationModalProps> = ({ 
  campaign, 
  userRole, 
  userNiche, 
  userId,
  onClose, 
  onUpdateStatus,
  chatData,
  onSendMessage
}) => {
  const [activeStep, setActiveStep] = useState<'details' | 'chat' | 'escrow'>(
    campaign.status === DealStatus.OPEN ? 'details' : 'escrow'
  );
  const [bidAmount, setBidAmount] = useState(campaign.finalPrice || campaign.budget);
  const [submissionLink, setSubmissionLink] = useState(campaign.submissionLink || '');
  const [newMessage, setNewMessage] = useState('');
  
  // AI Advice State
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);
  const [refinementText, setRefinementText] = useState('');

  // Rating State
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [ratings, setRatings] = useState({ completion: 5, quality: 5, feedback: 5 });
  const [reviewComment, setReviewComment] = useState('');

  const handleLockFunds = () => {
    if (confirm(`آیا از قفل کردن مبلغ ${bidAmount.toLocaleString()} تومان در صندوق امانت اطمینان دارید؟`)) {
      onUpdateStatus(campaign.id, DealStatus.ESCROW_LOCKED, { finalPrice: bidAmount });
      setActiveStep('escrow');
    }
  };

  const handleCancelEscrow = () => {
    if (confirm('آیا مطمئن هستید که می‌خواهید قرارداد را لغو کنید؟ وجه مسدود شده به حساب شما بازگردانده می‌شود.')) {
      onUpdateStatus(campaign.id, DealStatus.OPEN, { finalPrice: null, submissionLink: null });
      onClose();
    }
  };

  const handleSubmitWork = () => {
    if (!submissionLink) return alert('لطفاً لینک محتوا را وارد کنید.');
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

  const handleSend = () => {
    if (!newMessage.trim()) return;
    onSendMessage(campaign.id, newMessage);
    setNewMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-950/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white">
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

          <div className="flex-1 p-8 overflow-y-auto bg-white custom-scrollbar">
            {activeStep === 'details' && (
              <div className="space-y-6 animate-in fade-in duration-300">
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
                  <div className="bg-amber-50 p-8 rounded-[2.5rem] border border-amber-100 shadow-sm mt-8">
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
              <div className="h-full flex flex-col gap-4">
                <div className="flex-1 flex flex-col bg-slate-50 rounded-[2.5rem] p-6 border border-slate-100 shadow-inner overflow-hidden">
                  <div className="flex-1 space-y-4 overflow-y-auto mb-4 p-2 custom-scrollbar">
                     {!chatData?.messages.length && (
                       <div className="text-center p-10 opacity-30 italic text-xs">شروع گفتگو برای توافق بر سر جزئیات کمپین...</div>
                     )}
                     {chatData?.messages.map((msg) => (
                       <div 
                         key={msg.id} 
                         className={`p-4 rounded-2xl text-xs leading-relaxed max-w-[85%] shadow-sm ${
                           msg.senderId === userId 
                           ? 'bg-indigo-600 text-white self-end mr-auto rounded-tl-none' 
                           : 'bg-white text-slate-600 self-start ml-auto rounded-tr-none border border-slate-100'
                         }`}
                       >
                         {msg.text}
                         <div className={`text-[8px] mt-2 opacity-60 text-left ${msg.senderId === userId ? 'text-white' : 'text-slate-400'}`}>
                           {msg.timestamp}
                         </div>
                       </div>
                     ))}
                     
                     {aiAdvice && (
                       <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-0.5 rounded-[2rem] animate-in slide-in-from-bottom-4 fade-in duration-700 shadow-2xl">
                          <div className="bg-white rounded-[1.9rem] p-6">
                            <div className="flex items-center justify-between mb-4">
                               <div className="flex items-center gap-2">
                                  <span className="text-lg">✨</span>
                                  <p className="text-[10px] font-black text-indigo-600 uppercase">AdAuction AI Strategist</p>
                               </div>
                               <button onClick={() => setAiAdvice(null)} className="text-slate-300 hover:text-rose-500">✕</button>
                            </div>
                            <div className="text-xs text-slate-700 leading-loose whitespace-pre-wrap">{aiAdvice}</div>
                            <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
                               <input 
                                 placeholder="شخصی‌سازی پیشنهاد..."
                                 value={refinementText}
                                 onChange={e => setRefinementText(e.target.value)}
                                 className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-[10px] outline-none"
                               />
                               <button 
                                 onClick={() => handleFetchAdvice(true)}
                                 className="bg-indigo-600 text-white px-4 rounded-xl text-[10px] font-black"
                               >
                                 اعمال
                               </button>
                            </div>
                          </div>
                       </div>
                     )}

                     {isLoadingAdvice && (
                       <div className="flex flex-col items-center gap-2 p-6 rounded-3xl bg-white/50 border border-white self-center">
                          <div className="w-8 h-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                          <span className="text-[10px] font-bold text-slate-500">هوش مصنوعی در حال تحلیل...</span>
                       </div>
                     )}
                  </div>

                  <div className="flex gap-2">
                     <input 
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSend()}
                        className="flex-1 bg-white rounded-2xl px-6 py-4 text-xs outline-none border border-slate-200 focus:ring-4 focus:ring-indigo-100 shadow-sm" 
                        placeholder="پیام خود را بنویسید..." 
                     />
                     <button 
                        onClick={handleSend}
                        className="bg-indigo-600 text-white px-6 rounded-2xl font-black text-xs hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-100"
                     >
                       ارسال
                     </button>
                  </div>
                </div>

                {!aiAdvice && !isLoadingAdvice && (
                  <button 
                    onClick={() => handleFetchAdvice()}
                    className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs shadow-xl flex items-center justify-center gap-3 group"
                  >
                    <span>✨ دریافت استراتژی مذاکره هوشمند</span>
                  </button>
                )}
              </div>
            )}

            {activeStep === 'escrow' && (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 animate-in zoom-in-95">
                 {!showRatingForm ? (
                   <>
                     {campaign.status === DealStatus.OPEN ? (
                       <div className="space-y-6">
                          <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center text-6xl mx-auto shadow-inner border border-slate-100">🤝</div>
                          <h3 className="text-2xl font-black text-slate-800">در انتظار توافق مالی</h3>
                          <button onClick={() => setActiveStep('chat')} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold text-xs">بازگشت به گفتگو</button>
                       </div>
                     ) : campaign.status === DealStatus.ESCROW_LOCKED ? (
                       <div className="w-full max-w-md space-y-6">
                          <div className="w-24 h-24 bg-amber-500 text-white rounded-[2rem] flex items-center justify-center text-4xl mx-auto shadow-2xl shadow-amber-200 border-4 border-white">🔒</div>
                          <h3 className="text-2xl font-black text-slate-800">وجه در امانت قفل شده است</h3>
                          <p className="text-xs text-slate-500 bg-slate-50 inline-block px-4 py-2 rounded-full border border-slate-100">
                             مبلغ نهایی: <span className="text-indigo-600 font-black">{campaign.finalPrice?.toLocaleString()}</span> تومان
                          </p>
                          
                          {userRole === UserRole.INFLUENCER ? (
                            <div className="space-y-4 pt-6">
                               <input 
                                 placeholder="لینک محتوای نهایی..." 
                                 value={submissionLink}
                                 onChange={e => setSubmissionLink(e.target.value)}
                                 className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono outline-none shadow-inner" 
                               />
                               <button onClick={handleSubmitWork} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-xl hover:bg-indigo-700 active:scale-95 transition-all text-xs">تحویل پروژه و درخواست تسویه</button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center py-6">
                               <span className="text-[10px] text-amber-700 font-black bg-amber-50 px-6 py-2.5 rounded-full border border-amber-100 animate-pulse">در انتظار تحویل محتوا توسط اینفلوئنسر...</span>
                               <button onClick={handleCancelEscrow} className="text-rose-500 font-black text-[10px] mt-6 hover:underline">لغو قرارداد و عودت وجه</button>
                            </div>
                          )}
                       </div>
                     ) : campaign.status === DealStatus.WORK_SUBMITTED ? (
                       <div className="w-full max-w-md space-y-6">
                          <div className="w-24 h-24 bg-blue-600 text-white rounded-[2rem] flex items-center justify-center text-4xl mx-auto border-4 border-white shadow-2xl">📥</div>
                          <h3 className="text-2xl font-black text-slate-800">محتوا تحویل داده شد</h3>
                          
                          <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
                            <a href={campaign.submissionLink} target="_blank" className="text-xs font-bold text-indigo-700 underline break-all">{campaign.submissionLink}</a>
                          </div>
                          
                          {userRole === UserRole.BRAND ? (
                            <div className="flex flex-col gap-3">
                               <button onClick={handleConfirmRelease} className="w-full bg-green-600 text-white py-4 rounded-2xl font-black text-xs hover:bg-green-700 shadow-xl active:scale-95 transition-all">تایید کیفیت و آزادسازی وجه</button>
                               <button onClick={handleCancelEscrow} className="text-rose-500 font-black text-[10px] hover:underline">رد محتوا و ثبت شکایت</button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                               <span className="text-xs text-indigo-700 font-black bg-indigo-50 px-8 py-3 rounded-full border border-indigo-100 animate-pulse">در انتظار تایید نهایی برند...</span>
                            </div>
                          )}
                       </div>
                     ) : campaign.status === DealStatus.COMPLETED && (
                       <div className="space-y-6">
                          <div className="w-32 h-32 bg-emerald-500 text-white rounded-full flex items-center justify-center text-6xl mx-auto shadow-2xl border-8 border-white">🏆</div>
                          <h3 className="text-2xl font-black text-slate-800">همکاری با موفقیت پایان یافت</h3>
                          <button onClick={onClose} className="bg-slate-900 text-white px-12 py-4 rounded-2xl font-black text-xs">بستن</button>
                       </div>
                     )}
                   </>
                 ) : (
                   <div className="w-full max-w-lg space-y-6 text-right">
                      <h3 className="text-xl font-black text-slate-800 text-center mb-6">ثبت بازخورد نهایی</h3>
                      <div className="space-y-6 bg-slate-50 p-8 rounded-[2rem] shadow-inner">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold">کیفیت محتوا: {ratings.quality}/5</label>
                          <input type="range" min="1" max="5" value={ratings.quality} onChange={e => setRatings({...ratings, quality: Number(e.target.value)})} className="w-full accent-indigo-600" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold">تعهد زمانی: {ratings.completion}/5</label>
                          <input type="range" min="1" max="5" value={ratings.completion} onChange={e => setRatings({...ratings, completion: Number(e.target.value)})} className="w-full accent-indigo-600" />
                        </div>
                      </div>
                      <textarea 
                        placeholder="نظر شما..."
                        value={reviewComment}
                        onChange={e => setReviewComment(e.target.value)}
                        className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-xs mt-4 outline-none"
                      />
                      <button onClick={handleFinalSubmit} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black mt-6 shadow-xl text-xs">ثبت نظر و پایان</button>
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
