export interface UserProfileData {
  name: string;
  avatarUrl: string | null;
  memberLabel: string;
  location: string;
  joinedDate: string;
  email: string;
  phone: string;
}

export interface CommunityStat {
  label: string;
  value: string;
}

export interface UserReview {
  business: string;
  category: string;
  text: string;
  rating: number;
  reviewCount: number;
  date: string;
  photoUrl: string | null;
}
