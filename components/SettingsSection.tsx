
import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface SettingsSectionProps {
  currentUser: User;
  onUpdateRole: (role: UserRole) => void;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ currentUser, onUpdateRole }) => {
  const [settings, setSettings] = useState([
    { id: '2fa', label: 'احراز هویت دو مرحله‌ای (2FA)', active: true, desc: 'امنیت ورود به حساب را با تایید پیامکی افزایش دهید.' },
    { id: 'show_balance', label: 'نمایش موجودی در پیشخوان', active: true, desc: 'موجودی کیف پول را در بخش خلاصه آمار نمایش می‌دهد.' },
    { id: 'auto_approve', label: 'تایید خودکار پیشنهادات هم‌قیمت بودجه', active: false, desc: 'پیشنهاداتی که دقیقاً مطابق بودجه شما هستند فوراً تایید می‌شوند.' },
    { id: 'notif_email', label: 'دریافت اعلان‌ها از طریق ایمیل', active: true, desc: 'گزارش‌های روزانه و پیام‌های جدید به ایمیل شما ارسال شود.' },
  ]);

  const toggleSetting = (id: string) => {
    setSettings(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm animate-in fade-in duration-500 pb-20">
      <h3 className="text-2xl font-black text-slate-800 mb-10 flex items-center gap-4">
        <span className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-xl">⚙️</span>
        تنظیمات عملیاتی سیستم
      </h3>

      <div className="space-y-12">
        {/* Role Switched - CRITICAL for Demo Operationality */}
        <section className="bg-indigo-50 p-8 rounded-[2.5rem] border border-indigo-100">
          <h4 className="text-sm font-black text-indigo-900 mb-4 flex items-center gap-2">
            <span>🎭</span> تغییر نقش کاربری (تست سناریو)
          </h4>
          <p className="text-[10px] text-indigo-600 mb-6 leading-relaxed">برای تست کامل سیستم "امانت" و "مذاکره"، می‌توانید بین نقش برند و اینفلوئنسر جابجا شوید.</p>
          <div className="flex gap-4">
            <button 
              onClick={() => onUpdateRole(UserRole.INFLUENCER)}
              className={`flex-1 py-4 rounded-2xl text-xs font-black transition-all ${
                currentUser.role === UserRole.INFLUENCER 
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' 
                : 'bg-white text-indigo-400 hover:bg-white/50'
              }`}
            >
              من اینفلوئنسر هستم
            </button>
            <button 
              onClick={() => onUpdateRole(UserRole.BRAND)}
              className={`flex-1 py-4 rounded-2xl text-xs font-black transition-all ${
                currentUser.role === UserRole.BRAND 
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' 
                : 'bg-white text-indigo-400 hover:bg-white/50'
              }`}
            >
              من برند (کارفرما) هستم
            </button>
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">تنظیمات امنیتی و نمایش</h4>
          </div>
          <div className="space-y-4">
             {settings.map((s) => (
               <div 
                 key={s.id} 
                 onClick={() => toggleSetting(s.id)}
                 className="flex justify-between items-center p-6 bg-slate-50 rounded-2xl border border-transparent hover:border-indigo-100 transition-all cursor-pointer group shadow-sm hover:shadow-md"
               >
                  <div>
                    <span className="text-xs font-bold text-slate-700 group-hover:text-indigo-600 transition-colors block mb-1">{s.label}</span>
                    <p className="text-[10px] text-slate-400">{s.desc}</p>
                  </div>
                  <div className={`w-12 h-6 rounded-full p-1 transition-all duration-300 flex items-center ${s.active ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                     <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 transform ${s.active ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </div>
               </div>
             ))}
          </div>
        </section>

        <section>
          <h4 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6">اتصال پلتفرم‌های خارجی</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {[
               { name: 'اینستاگرام', status: 'متصل', icon: '📸' },
               { name: 'یوتیوب', status: 'عدم اتصال', icon: '🎬' },
               { name: 'تلگرام', status: 'متصل', icon: '✈️' },
               { name: 'تیک‌تاک', status: 'عدم اتصال', icon: '📱' }
             ].map(p => (
               <div key={p.name} className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <span className="text-xl grayscale group-hover:grayscale-0 transition-all">{p.icon}</span>
                    <span className="text-xs font-bold text-slate-700">{p.name}</span>
                  </div>
                  <button className={`text-[10px] font-black px-3 py-1 rounded-lg ${p.status === 'متصل' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 bg-slate-100'}`}>
                    {p.status}
                  </button>
               </div>
             ))}
          </div>
        </section>

        <div className="pt-6 border-t border-slate-50">
          <button className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-sm shadow-xl hover:bg-black transition-all">بروزرسانی نهایی تنظیمات</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsSection;
