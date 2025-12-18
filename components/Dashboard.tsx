
import React from 'react';

const Dashboard: React.FC = () => {
  const stats = [
    { label: 'کل بودجه صرف شده', value: '۱۲۵,۰۰۰,۰۰۰', unit: 'تومان', icon: '💰', color: 'text-emerald-600' },
    { label: 'کمپین‌های فعال', value: '۱۲', unit: 'واحد', icon: '🚀', color: 'text-indigo-600' },
    { label: 'نرخ کلیک میانگین', value: '۴.۸', unit: 'درصد', icon: '📈', color: 'text-rose-600' },
    { label: 'اینفلوئنسرهای همکار', value: '۸۵', unit: 'نفر', icon: '🤝', color: 'text-amber-600' },
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
            وضعیت رشد کمپین‌ها
          </h3>
          <div className="h-64 flex items-end gap-4 px-4">
             {[40, 70, 45, 90, 65, 80, 50, 85, 60, 95, 75, 100].map((h, i) => (
               <div key={i} className="flex-1 bg-indigo-100 rounded-t-xl relative group transition-all hover:bg-indigo-600">
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-800 text-white text-[8px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {h}%
                  </div>
                  <div className="w-full bg-indigo-600 rounded-t-xl transition-all" style={{ height: `${h}%` }}></div>
               </div>
             ))}
          </div>
          <div className="flex justify-between mt-4 px-2 text-[8px] font-bold text-slate-400 uppercase tracking-widest">
            <span>فروردین</span>
            <span>اسفند</span>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
           <h3 className="text-lg font-black text-slate-800 mb-6">فعالیت‌های اخیر</h3>
           <div className="space-y-6">
              {[
                { text: 'کمپین جدید Z-Phone تایید شد', time: '۲ ساعت پیش', type: 'system' },
                { text: 'واریز ۱۰ میلیون تومان به امانت', time: '۵ ساعت پیش', type: 'wallet' },
                { text: 'پیشنهاد جدید از علی محمدی', time: 'دیروز', type: 'bid' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start">
                   <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0"></div>
                   <div>
                      <p className="text-xs font-bold text-slate-700">{item.text}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{item.time}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
