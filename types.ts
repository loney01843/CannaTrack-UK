
export enum StrainType {
  INDICA = 'Indica',
  SATIVA = 'Sativa',
  HYBRID = 'Hybrid',
}

export interface TerpeneProfile {
  name: string;
  percentage: number;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  producer: string;
  logoUrl: string;
  type: StrainType;
  thc: number; // Percentage
  cbd: number; // Percentage
  terpenes: TerpeneProfile[];
  effects: string[];
  description: string;
  imageUrl: string;
  pricePerGram?: number; // Optional
}

export enum DeviceType {
  PORTABLE_VAPORIZER = 'Portable Vaporizer',
  DESKTOP_VAPORIZER = 'Desktop Vaporizer',
  OIL_PEN = 'Oil Pen',
  WATER_PIPE = 'Water Pipe',
  PIPE = 'Pipe',
  OTHER = 'Other',
}

export interface Device {
  id: string;
  name: string;
  brand?: string;
  type: DeviceType;
  purchaseDate?: string;
  notes?: string;
}

export interface Surgery {
  id: string;
  name: string;
  address?: string;
  notes?: string;
}

export interface Pharmacy {
  id: string;
  name: string;
  address?: string;
  notes?: string;
}

export interface LogEntry {
  id: string;
  productId: string;
  date: string; // ISO date string
  rating: number; // 1-5 stars
  notes?: string;
  dosage?: string; // e.g., "0.1g"
  deviceId?: string; // ID of the device used
  surgeryId?: string; // ID of the prescribing surgery/clinic
  pharmacyId?: string; // ID of the dispensing pharmacy
}

export interface ToleranceBreak {
  id: string;
  startDate: string; // ISO date string
  endDate?: string | null; // ISO date string, null if active
  isActive: boolean;
}

export interface StockedItem {
  productId: string;
  quantity: string; // e.g., "3.5g", "1 vape cart", "50ml"
  acquisitionDate?: string; // ISO date string
}

export enum AppView {
  DASHBOARD = 'Dashboard',
  LOG_ENTRY = 'Log Entry',
  MY_LOGS = 'My Logs',
  PRODUCTS = 'Products',
  SUGGESTIONS = 'Suggestions',
  SETTINGS = 'Settings',
}