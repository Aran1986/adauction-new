
import { Platform, UserRole, User, Campaign, DealStatus, AdType } from './types';

export const MOCK_USER: User = {
  id: 'u1',
  name: 'علی محمدی',
  role: UserRole.INFLUENCER,
  isVerified: true,
  avatar: 'https://picsum.photos/seed/u1/200',
  bio: 'تولیدکننده محتوا در حوزه تکنولوژی و لایف‌استایل. بررسی تخصصی گجت‌ها و آموزش ترفندهای موبایل.',
  followersCount: 150000,
  platformStats: [
    { platform: Platform.INSTAGRAM, followers: 85000, handle: '@ali_tech' },
    { platform: Platform.YOUTUBE, followers: 45000, handle: 'AliMohammadiTV' },
    { platform: Platform.TELEGRAM, followers: 20000, handle: '@ali_tech_channel' }
  ],
  niche: ['تکنولوژی', 'لایف‌استایل'],
  averageRating: 4.8,
  reviewsCount: 24,
  ratingBreakdown: {
    completion: 4.9,
    quality: 4.7,
    feedback: 4.8
  },
  wallet: {
    availableBalance: 12500000,
    escrowBalance: 35000000,
    totalEarned: 150000000,
    transactions: [
      {
        id: 't1',
        type: 'ESCROW_LOCK',
        amount: 35000000,
        description: 'واریز به امانت برای کمپین Z-Phone',
        timestamp: '۱۴۰۲/۱۰/۱۲ - ۱۴:۳۰',
        status: 'SUCCESS'
      },
      {
        id: 't2',
        type: 'INCOME',
        amount: 15000000,
        description: 'آزادسازی وجه کمپین تِک‌نو',
        timestamp: '۱۴۰۲/۱۰/۰۵ - ۰۹:۱۵',
        status: 'SUCCESS'
      },
      {
        id: 't3',
        type: 'WITHDRAW',
        amount: 5000000,
        description: 'درخواست برداشت وجه از کیف پول',
        timestamp: '۱۴۰۲/۱۰/۱۵ - ۱۸:۰۰',
        status: 'PENDING'
      },
      {
        id: 't4',
        type: 'DEPOSIT',
        amount: 2000000,
        description: 'افزایش موجودی ناموفق (خطای بانکی)',
        timestamp: '۱۴۰۲/۱۰/۱۸ - ۱۱:۲۰',
        status: 'FAILED'
      }
    ]
  },
  recentReviews: [
    {
      id: 'rev1',
      brandName: 'دیجی‌شاپ',
      brandAvatar: 'https://picsum.photos/seed/brand1/40',
      comment: 'همکاری بسیار عالی بود. محتوا دقیقا طبق بریف و در زمان مقرر تحویل داده شد.',
      rating: 5,
      timestamp: '۲ هفته پیش'
    }
  ]
};

export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: 'c1',
    brandId: 'b1',
    title: 'کمپین معرفی گوشی هوشمند جدید Z-Phone',
    description: 'ما به دنبال ۳ اینفلوئنسر در حوزه تکنولوژی هستیم تا محصول جدید ما را آنباکس کنند.',
    budget: 50000000,
    platform: Platform.INSTAGRAM,
    // Fix: Added missing adType property
    adType: AdType.POST,
    minFollowers: 50000,
    deadline: '1402/12/25',
    expirationDate: '1403/01/10',
    status: DealStatus.OPEN,
    isAuction: true,
    bids: []
  },
  {
    id: 'c2',
    brandId: 'b2',
    title: 'تبلیغ دوره آموزشی ارز دیجیتال',
    description: 'نیاز به استوری‌های بازدیدی با بازدهی بالا در پلتفرم تلگرام.',
    budget: 20000000,
    platform: Platform.TELEGRAM,
    // Fix: Added missing adType property
    adType: AdType.STORY,
    minFollowers: 10000,
    deadline: '1402/12/10',
    expirationDate: '1402/12/20',
    status: DealStatus.OPEN,
    isAuction: false,
    bids: []
  }
];

export const CATEGORIES = ['تکنولوژی', 'آرایشی', 'آموزشی', 'سرگرمی', 'غذا', 'ورزشی'];
