export type ListingType = 'sale' | 'rent'; // بيع | إيجار

export type PropertyCategory = 'residential' | 'commercial'; // شقق سكنية | عقار تجاري

export type CommercialSubType = 'shop' | 'warehouse' | 'office'; // محل | مستودع | مكتب

export type MainRegionId = 
  | 'mazraa'      // المزرعة ومحيطها
  | 'msaitbeh'    // المصيطبة ومحيطها
  | 'ras_beirut'  // راس بيروت ومحيطها
  | 'outside';    // خارج بيروت

export interface Property {
  id: string;
  title: string;
  mainRegion: MainRegionId;
  mainRegionName: string; // "المزرعة ومحيطها" | "المصيطبة ومحيطها" | "راس بيروت ومحيطها" | "خارج بيروت"
  subDistrict: string; // الحي الفرعي المحدد (مثل: الحمرا، مار الياس، كورنيش المزرعة، الجبل...)
  streetOrDetails?: string; // تفاصيل إضافية عن الشارع أو المعلم
  price: number;
  listingType: ListingType; // 'sale' = 'بيع', 'rent' = 'إيجار'
  category: PropertyCategory; // 'residential' = 'شقق سكنية', 'commercial' = 'عقار تجاري'
  commercialType?: CommercialSubType; // محل | مستودع | مكتب
  areaSqM: number;
  bedrooms?: number;
  bathrooms?: number;
  floor?: number | string;
  parkingSpaces?: number;
  hasGreenDeed: boolean; // سند طابو أخضر 2400 سهم
  electricity24_7: boolean;
  featured?: boolean;
  images: string[];
  description: string;
  features: string[];
  agentPhone: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface ValuationFormState {
  propertyTitle: string;
  mainRegion: MainRegionId;
  subDistrict: string;
  listingType: ListingType;
  category: PropertyCategory;
  commercialType?: CommercialSubType;
  price: number | '';
  areaSqM: number | '';
  bedrooms: number | '';
  bathrooms: number | '';
  description: string;
}

export interface MainRegionDefinition {
  id: MainRegionId;
  name: string;
  subDistricts: string[];
  description: string;
}
