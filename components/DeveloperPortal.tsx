
import React from 'react';

interface ApiKey {
  key: string;
  label: string;
  date: string;
}

interface DeveloperPortalProps {
  apiKeys: ApiKey[];
  onGenerateKey: () => void;
}

const DeveloperPortal: React.FC<DeveloperPortalProps> = ({ apiKeys, onGenerateKey }) => {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in slide-in-from-bottom-8 duration-700 pb-20">
      <div className="bg-slate-900 text-white p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-[80px]" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="shrink-0 w-24 h-24 bg-white/10 backdrop-blur-md rounded-[2rem] flex items-center justify-center text-4xl shadow-inner border border-white/5">⚡</div>
          <div className="flex-1 text-center md:text-right">
            <h2 className="text-3xl font-black mb-4">مرکز توسعه‌دهندگان AdAuction</h2>
            <p className="text-slate-400 text-sm max-w-2xl leading-loose">
              با استفاده از SDK اختصاصی و API قدرتمند ما، فرآیندهای تبلیغاتی خود را خودکار کنید. 
              دسترسی به بازارچه، مدیریت بودجه و نظارت بر کمپین‌ها به صورت کاملاً برنامه‌نویسی شده در دسترس شماست.
            </p>
          </div>
          <button 
            onClick={onGenerateKey}
            className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-sm hover:bg-slate-100 transition-all shadow-xl shadow-white/5"
          >
            تولید کلید جدید
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 text-sm">🔑</span>
              مدیریت کلیدهای API
            </h3>
            <div className="space-y-4">
              {apiKeys.map(k => (
                <div key={k.key} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group hover:bg-white hover:shadow-md transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-600/10 text-indigo-600 rounded-xl flex items-center justify-center font-black text-xs">API</div>
                    <div>
                      <p className="text-xs font-black text-slate-800">{k.label}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-1">{k.key}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-bold text-slate-400">{k.date}</span>
                    <button className="text-slate-300 hover:text-indigo-600 transition-colors">📋</button>
                    <button className="text-slate-300 hover:text-rose-500 transition-colors">🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800 p-8 rounded-[3rem] text-white shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-black flex items-center gap-3">
                <span className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-xs">JS</span>
                نمونه کد Node.js
              </h3>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              </div>
            </div>
            <pre className="text-[11px] font-mono text-indigo-200 leading-relaxed overflow-x-auto p-4 bg-slate-900/50 rounded-2xl border border-white/5">
{`const AdAuction = require('@adauction/sdk');

const client = new AdAuction.Client({
  apiKey: 'YOUR_API_KEY_HERE'
});

// ایجاد کمپین جدید به صورت برنامه‌نویسی شده
const createCampaign = async () => {
  const result = await client.campaigns.create({
    title: 'تست ای‌پی‌آی',
    budget: 50000000,
    platform: 'INSTAGRAM'
  });
  console.log('کمپین با موفقیت ثبت شد:', result.id);
};`}
            </pre>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-indigo-600 p-8 rounded-[3rem] text-white shadow-xl shadow-indigo-100">
            <h4 className="text-base font-black mb-4">آمار فراخوانی API</h4>
            <div className="space-y-6">
              <div className="bg-white/10 p-4 rounded-2xl">
                <p className="text-[10px] text-indigo-200 uppercase tracking-widest font-bold mb-1">فراخوانی‌های امروز</p>
                <p className="text-2xl font-black">۴۳۲ / ۵,۰۰۰</p>
                <div className="h-1 bg-white/10 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-white w-1/4"></div>
                </div>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl">
                <p className="text-[10px] text-indigo-200 uppercase tracking-widest font-bold mb-1">میانگین زمان پاسخ</p>
                <p className="text-2xl font-black">۱۲۰ میلی‌ثانیه</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
            <h4 className="font-black text-slate-800 mb-4">لینک‌های مفید</h4>
            <div className="space-y-3">
              {['مستندات کامل API', 'نمونه‌های GitHub', 'وب‌هوک‌ها (Webhooks)', 'پشتیبانی توسعه‌دهندگان'].map(link => (
                <a key={link} href="#" className="flex justify-between items-center p-3 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-all group">
                  {link}
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">➜</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperPortal;
