export type IssueStatus =
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "VERIFIED"
  | "FORWARDED"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "CLOSED";

export type ProjectStatus = "PLANNED" | "ONGOING" | "COMPLETED" | "CANCELLED";

export type AdminRole = "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "MODERATOR";

export interface GeoLocation {
  latitude: number;
  longitude: number;
}

export interface Ward {
  _id: string;
  number: number;
  name?: string;
  nameEn?: string;
  isDemoData?: boolean;
}

export interface IssueUpdateEntry {
  _id: string;
  status: IssueStatus;
  note?: string;
  createdAt: string;
}

export interface Issue {
  _id: string;
  referenceNumber: string;
  title: string;
  category: string;
  ward: string;
  area: string;
  description: string;
  photos: string[];
  location?: GeoLocation;
  status: IssueStatus;
  isPublic: boolean;
  isDemoData?: boolean;
  createdAt: string;
  updatedAt: string;
  updates?: IssueUpdateEntry[];
}

export interface Institution {
  _id: string;
  name: string;
  category: string;
  ward: string;
  address?: string;
  location?: GeoLocation;
  contact?: string;
  description?: string;
  image?: string;
  isDemoData?: boolean;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: ProjectStatus;
  startDate?: string;
  endDate?: string;
  location?: GeoLocation;
  ward?: string;
  target?: string;
  beneficiaries?: number;
  volunteers?: number;
  photos: string[];
  outcomes?: string;
  partners?: string[];
  isDemoData?: boolean;
}

export interface Activity {
  _id: string;
  title: string;
  date: string;
  location?: string;
  description: string;
  category: string;
  photos: string[];
  relatedProject?: string;
  isPublished: boolean;
  isDemoData?: boolean;
}

export interface Volunteer {
  _id: string;
  name: string;
  mobile: string;
  email?: string;
  ward: string;
  profession?: string;
  interests: string[];
  skills?: string;
  availability?: string;
  message?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalIssues: number;
  verifiedIssues: number;
  inProgressIssues: number;
  resolvedIssues: number;
  issuesByCategory: { category: string; count: number }[];
  issuesByWard: { ward: string; count: number }[];
  issuesByStatus: { status: IssueStatus; count: number }[];
  monthlyTrend: { month: string; count: number }[];
}

export interface GalleryImage {
  _id: string;
  url: string;
  caption?: string;
}

export interface GalleryAlbum {
  _id: string;
  title: string;
  coverImage?: string;
  images: GalleryImage[];
  relatedActivity?: string;
  isDemoData?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
