
import React, { useState } from 'react';
import { Wallet } from '../types';

interface WalletSectionProps {
  wallet: Wallet;
}

const WalletSection: React.FC<WalletSectionProps> = ({ wallet }) => {
  const [showAction, setShowAction] = useState<'DEPOSIT' | 'WITHDRAW' | null>(null);
  const [amount, setAmount] = useState('');

  const handleAction = () => {
    if (!amount) return;
    alert(`${showAction === 'DEPOSIT' ? 'در حال انتقال به درگاه بانکی برای مبلغ ' : 'درخواست برداشت ثبت شد برای مبلغ '} ${Number(amount).toLocaleString()} تومان`);
    setShowAction(null);
    setAmount('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
          <p className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-widest">موجودی نقدی</p>
          <h4 className="text-2xl font-black text-slate-800 mb-6">{wallet.availableBalance.toLocaleString()} <span className="text-[10px] font-normal">تومان</span></h4>
          <div className="flex gap-2">
             <button 
               onClick={() => setShowAction('DEPOSIT')}
               className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl text-[10px] font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
             >
               واریز وجه
             </button>
             <button 
               onClick={() => setShowAction('WITHDRAW')}
               className="flex-1 bg-slate-100 text-slate-600 py-2.5 rounded-xl text-[10px] font-black hover:bg-slate-200 transition-all"
             >
               برداشت
             </button>
          </div>
        </div>
        <div className="bg-amber-500 p-8 rounded-[2.5rem] shadow-xl shadow-amber-100 text-white relative overflow-hidden">
          <div className="absolute -right-4 -top-4 text-white/20 text-6xl rotate-12">🔒</div>
          <p className="text-[10px] font-bold text-white/70 mb-1 uppercase tracking-widest">صندوق امانت (Escrow)</p>
          <h4 className="text-2xl font-black mb-4">{wallet.escrowBalance.toLocaleString()} <span>تومان</span></h4>
          <p className="text-[9px] font-medium leading-relaxed opacity-80">این مبالغ تا زمان تایید نهایی محتوا در پروژه‌های جاری مسدود است.</p>
        </div>
        <div className="bg-indigo-900 p-8 rounded-[2.5rem] shadow-xl shadow-indigo-100 text-white">
          <p className="text-[10px] font-bold text-indigo-300 mb-1 uppercase tracking-widest">مجموع درآمدهای شما</p>
          <h4 className="text-2xl font-black mb-4">{wallet.totalEarned.toLocaleString()} <span>تومان</span></h4>
          <div className="h-1.5 bg-white/10 rounded-full mt-6 overflow-hidden">
            <div className="h-full bg-indigo-400 w-3/4"></div>
          </div>
        </div>
      </div>

      {showAction && (
        <div className="bg-indigo-50 border-2 border-indigo-100 p-10 rounded-[3rem] animate-in slide-in-from-top-4 duration-300 shadow-inner">
          <div className="flex justify-between items-center mb-6">
            <h5 className="font-black text-indigo-900 text-lg flex items-center gap-3">
               {showAction === 'DEPOSIT' ? '💳 شارژ کیف پول' : '🏦 درخواست تسویه حساب'}
            </h5>
            <button onClick={() => setShowAction(null)} className="w-8 h-8 bg-white text-indigo-300 rounded-full flex items-center justify-center hover:text-indigo-600 transition-colors">✕</button>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
             <div className="flex-1 relative">
               <input 
                 type="number" 
                 placeholder="مبلغ مورد نظر (تومان)..."
                 value={amount}
                 onChange={e => setAmount(e.target.value)}
                 className="w-full bg-white border-2 border-indigo-100 rounded-2xl px-6 py-4 text-sm outline-none font-bold focus:border-indigo-500 transition-all"
               />
               <span className="absolute left-6 top-4.5 text-[10px] font-bold text-slate-300">IRT</span>
             </div>
             <button 
               onClick={handleAction}
               className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95"
             >
               {showAction === 'DEPOSIT' ? 'اتصال به درگاه امن' : 'تایید و ثبت درخواست'}
             </button>
          </div>
          <p className="text-[9px] text-indigo-400 mt-4 font-bold uppercase tracking-widest">نکته: تسویه حساب‌های بالای ۵ میلیون تومان تا ۲۴ ساعت کاری زمان می‌برند.</p>
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-50 font-bold text-slate-800 flex justify-between items-center">
          <span className="flex items-center gap-2">📜 تاریخچه تراکنش‌ها</span>
          <button className="text-[10px] bg-slate-50 text-slate-400 px-3 py-1 rounded-lg">مشاهده همه</button>
        </div>
        <div className="divide-y divide-slate-50 max-h-[400px] overflow-y-auto custom-scrollbar">
          {wallet.transactions.map(t => (
            <div key={t.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm ${
                  t.type === 'INCOME' || t.type === 'DEPOSIT' ? 'bg-emerald-50 text-emerald-600' : 
                  t.type === 'WITHDRAW' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-400'
                }`}>
                  {t.type === 'ESCROW_LOCK' ? '🔒' : t.type === 'WITHDRAW' ? '📤' : '💰'}
                </div>
                <div>
                  <p className="text-xs font-black text-slate-800">{t.description}</p>
                  <p className="text-[9px] text-slate-400 mt-1 font-medium">{t.timestamp}</p>
                </div>
              </div>
              <div className="text-left">
                <p className={`font-black text-sm ${
                  t.type === 'WITHDRAW' || t.type === 'ESCROW_LOCK' ? 'text-rose-500' : 'text-emerald-600'
                }`}>
                  {t.type === 'WITHDRAW' || t.type === 'ESCROW_LOCK' ? '-' : '+'}{t.amount.toLocaleString()}
                </p>
                <span className={`text-[8px] font-black px-2 py-0.5 rounded-full ${
                  t.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-500' : 
                  t.status === 'PENDING' ? 'bg-amber-50 text-amber-500' : 'bg-rose-50 text-rose-500'
                }`}>
                  {t.status === 'SUCCESS' ? 'موفق' : t.status === 'PENDING' ? 'در انتظار' : 'ناموفق'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WalletSection;
