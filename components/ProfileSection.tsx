
import React, { useState } from 'react';
import { User, Platform } from '../types';

interface ProfileSectionProps {
  user: User;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    bio: user.bio,
    niche: user.niche.join(', ')
  });

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

  const handleSave = () => {
    // In a real app, this would be an API call
    setIsEditing(false);
    alert('تغییرات با موفقیت ذخیره شد.');
  };

  const RatingBar = ({ label, value, color }: { label: string, value: number, color: string }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
        <span className="text-slate-500">{label}</span>
        <span className={color}>{value} / 5</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
        <div 
          className={`h-full transition-all duration-1000 ${color.replace('text', 'bg')}`} 
          style={{ width: `${(value / 5) * 100}%` }} 
        />
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in slide-in-from-bottom-8 duration-700 pb-20">
      <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full -mr-32 -mt-32 blur-3xl" />
        
        <div className="relative shrink-0">
          <div className="relative">
            <img src={user.avatar} className="w-48 h-48 rounded-[3rem] object-cover border-8 border-slate-50 shadow-2xl" alt="" />
            <button 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className={`absolute -bottom-2 -left-2 p-4 rounded-2xl shadow-xl transition-all border-4 border-white ${isEditing ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
            >
              {isEditing ? '💾' : '✏️'}
            </button>
          </div>
        </div>

        <div className="flex-1 text-center md:text-right z-10">
          {isEditing ? (
            <div className="space-y-4 max-w-lg">
               <div className="space-y-1">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">نام کاربری / برند</label>
                 <input 
                   value={formData.name}
                   onChange={e => setFormData({...formData, name: e.target.value})}
                   className="w-full text-2xl font-black bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 outline-none focus:border-indigo-400 transition-all"
                 />
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">بیوگرافی و معرفی</label>
                 <textarea 
                   value={formData.bio}
                   rows={3}
                   onChange={e => setFormData({...formData, bio: e.target.value})}
                   className="w-full text-sm bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 outline-none focus:border-indigo-400 transition-all font-medium"
                 />
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">دسته‌بندی‌ها (جدا شده با کاما)</label>
                 <input 
                   value={formData.niche}
                   onChange={e => setFormData({...formData, niche: e.target.value})}
                   className="w-full text-xs font-bold bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 outline-none focus:border-indigo-400 transition-all"
                 />
               </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                <h2 className="text-4xl font-black text-slate-800">{formData.name}</h2>
                <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">Verified Account</div>
              </div>
              <p className="text-slate-500 mb-8 leading-relaxed text-sm max-w-xl font-medium">{formData.bio}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                 {user.platformStats.map(stat => (
                   <div key={stat.platform} className="bg-slate-50 p-4 rounded-[1.5rem] border border-slate-100 text-right group hover:border-indigo-200 transition-all hover:bg-white hover:shadow-md">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xl shrink-0">{getPlatformIcon(stat.platform)}</span>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{stat.platform}</p>
                      </div>
                      <p className="text-lg font-black text-slate-800">{stat.followers.toLocaleString()}</p>
                      <p className="text-[8px] text-indigo-500 font-bold mt-1 uppercase tracking-tighter">{stat.handle}</p>
                   </div>
                 ))}
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                {formData.niche.split(',').map(n => n.trim() && (
                  <span key={n} className="bg-indigo-50 text-indigo-600 px-5 py-2.5 rounded-2xl text-[10px] font-black border border-indigo-100 shadow-sm">
                    #{n.trim()}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="bg-indigo-900 p-10 rounded-[3.5rem] text-center min-w-[240px] shadow-2xl shadow-indigo-100 border border-white/10 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent pointer-events-none" />
          <div className="text-6xl font-black text-white mb-2 relative">{user.averageRating}</div>
          <div className="text-amber-400 text-2xl mb-4">★★★★★</div>
          <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest leading-loose">امتیاز رضایت کارفرما</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
          <h4 className="font-black text-slate-800 text-lg flex items-center gap-3">📊 شاخص‌های کیفی</h4>
          <RatingBar label="تعهد به زمان‌بندی" value={user.ratingBreakdown.completion} color="text-indigo-600" />
          <RatingBar label="کیفیت تولید محتوا" value={user.ratingBreakdown.quality} color="text-emerald-600" />
          <RatingBar label="پاسخگویی و تعامل" value={user.ratingBreakdown.feedback} color="text-amber-600" />
        </div>

        <div className="md:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
          <h4 className="font-black text-slate-800 text-lg mb-8">💬 نظرات کارفرمایان قبلی</h4>
          <div className="space-y-6">
            {user.recentReviews?.map(rev => (
              <div key={rev.id} className="p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <img src={rev.brandAvatar} className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-sm" alt="" />
                    <div>
                      <p className="font-black text-slate-800 text-sm">{rev.brandName}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{rev.timestamp}</p>
                    </div>
                  </div>
                  <div className="text-amber-400 text-xs">{'★'.repeat(rev.rating)}</div>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed italic">"{rev.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
