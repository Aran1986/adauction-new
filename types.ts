
export enum UserRole {
  INFLUENCER = 'INFLUENCER',
  BRAND = 'BRAND',
  ADMIN = 'ADMIN'
}

export enum Platform {
  INSTAGRAM = 'اینستاگرام',
  YOUTUBE = 'یوتیوب',
  TIKTOK = 'تیک‌تاک',
  TELEGRAM = 'تلگرام',
  X = 'X (توییتر)',
  FACEBOOK = 'فیس‌بوک'
}

export enum AdType {
  POST = 'پست',
  STORY = 'استوری',
  REELS = 'ریلز',
  VIDEO = 'ویدئو تبلیغاتی',
  PODCAST = 'حمایت پادکست'
}

export enum DealStatus {
  OPEN = 'باز',
  NEGOTIATING = 'در حال مذاکره',
  ESCROW_LOCKED = 'امانت (در انتظار تحویل)',
  WORK_SUBMITTED = 'کار تحویل شد',
  COMPLETED = 'تکمیل شده',
  DISPUTED = 'مورد اختلاف'
}

export interface PlatformStat {
  platform: Platform;
  followers: number;
  handle: string;
}

export interface Transaction {
  id: string;
  type: 'DEPOSIT' | 'WITHDRAW' | 'ESCROW_LOCK' | 'ESCROW_RELEASE' | 'INCOME';
  amount: number;
  description: string;
  timestamp: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
}

export interface Wallet {
  availableBalance: number;
  escrowBalance: number;
  totalEarned: number;
  transactions: Transaction[];
}

export interface RatingBreakdown {
  completion: number;
  quality: number;
  feedback: number;
}

export interface Review {
  id: string;
  brandName: string;
  brandAvatar: string;
  comment: string;
  rating: number;
  timestamp: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  bio: string;
  isVerified: boolean;
  platformStats: PlatformStat[];
  followersCount?: number;
  niche: string[];
  averageRating: number;
  reviewsCount: number;
  ratingBreakdown: RatingBreakdown;
  recentReviews?: Review[];
  wallet: Wallet;
}

export interface Campaign {
  id: string;
  brandId: string;
  title: string;
  description: string;
  budget: number;
  platform: Platform;
  adType: AdType;
  minFollowers: number;
  deadline: string;
  expirationDate: string;
  status: DealStatus;
  isAuction: boolean;
  bids: Bid[];
  niche?: string;
  finalPrice?: number;
  submissionLink?: string;
  thumbnailUrl?: string;
}

export interface FilterState {
  platforms: Platform[];
  adTypes: AdType[];
  minBudget: number | null;
  maxBudget: number | null;
  minFollowers: number | null;
  isAuction: boolean | null;
  niche: string | null;
}

export interface Bid {
  id: string;
  userId: string;
  amount: number;
  message: string;
  timestamp: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'BID' | 'UPDATE' | 'SYSTEM';
  timestamp: string;
  read: boolean;
}
