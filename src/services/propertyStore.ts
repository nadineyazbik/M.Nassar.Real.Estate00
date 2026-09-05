import { Property, MainRegionId, ListingType, PropertyCategory, CommercialSubType } from '../types';
import { PROPERTIES_DATA } from '../data/properties';

const STORAGE_KEY_PROPERTIES = 'nassar_properties_v2';
const STORAGE_KEY_AUTH = 'nassar_admin_auth_token_v2';
const STORAGE_KEY_INQUIRIES = 'nassar_visitor_inquiries_v2';

export const ADMIN_CREDENTIALS = {
  email: 'admin@nassarrealestate.com',
  password: 'NassarAdmin2025!',
};

export interface VisitorInquiry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  interestType: 'buy' | 'rent' | 'list' | 'consult';
  propertyTitle?: string;
  notes?: string;
  date: string;
  status: 'new' | 'contacted' | 'closed';
}

// 1. Property Management Methods
export function loadPropertiesFromStorage(): Property[] {
  if (typeof window === 'undefined') return PROPERTIES_DATA;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROPERTIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_PROPERTIES, JSON.stringify(PROPERTIES_DATA));
      return PROPERTIES_DATA;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return PROPERTIES_DATA;
  } catch (err) {
    console.error('Error loading properties from storage:', err);
    return PROPERTIES_DATA;
  }
}

export function savePropertiesToStorage(properties: Property[]): boolean {
  if (typeof window === 'undefined') return false;
  // Strict RBAC Access Control: Only authenticated Master Admin can mutate properties
  if (!checkAdminSession()) {
    console.error('Security Violation: Unauthorized attempt to mutate property records blocked. Master Admin credentials required.');
    return false;
  }
  try {
    localStorage.setItem(STORAGE_KEY_PROPERTIES, JSON.stringify(properties));
    return true;
  } catch (err) {
    console.error('Error saving properties to storage:', err);
    return false;
  }
}

export function resetPropertiesToDefault(): Property[] {
  if (typeof window === 'undefined') return PROPERTIES_DATA;
  if (!checkAdminSession()) {
    console.error('Security Violation: Unauthorized reset attempt blocked.');
    return PROPERTIES_DATA;
  }
  try {
    localStorage.setItem(STORAGE_KEY_PROPERTIES, JSON.stringify(PROPERTIES_DATA));
    return PROPERTIES_DATA;
  } catch (err) {
    console.error('Error resetting properties:', err);
    return PROPERTIES_DATA;
  }
}

// 2. Admin Authentication Methods
export function checkAdminSession(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const token = sessionStorage.getItem(STORAGE_KEY_AUTH);
    return token === 'nassar_admin_secure_session_token_granted_2025';
  } catch {
    return false;
  }
}

export function performAdminLogin(email: string, pass: string): boolean {
  if (typeof window === 'undefined') return false;
  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = pass.trim();

  if (
    cleanEmail === ADMIN_CREDENTIALS.email.toLowerCase() &&
    cleanPass === ADMIN_CREDENTIALS.password
  ) {
    sessionStorage.setItem(STORAGE_KEY_AUTH, 'nassar_admin_secure_session_token_granted_2025');
    return true;
  }
  return false;
}

export function performAdminLogout() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(STORAGE_KEY_AUTH);
}

// 3. Visitor Inquiries Management
export function loadInquiriesFromStorage(): VisitorInquiry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_INQUIRIES);
    if (!raw) {
      // Seed with initial realistic inquiries so admin has immediate insight
      const seed: VisitorInquiry[] = [
        {
          id: 'inq-1',
          name: 'د. طارق الحسامي',
          phone: '+961 3 123 456',
          email: 'tarek.h@outlook.com',
          interestType: 'buy',
          propertyTitle: 'شقة فاخرة بإطلالة بحرية في الروشة',
          notes: 'مغترب في دبي، مهتم بجدولة معاينة ميدانية الأسبوع القادم وسداد بالدولار الفريش.',
          date: '2026-09-02',
          status: 'new',
        },
        {
          id: 'inq-2',
          name: 'شركة فينكس للاستيراد والتصدير',
          phone: '+961 70 987 654',
          email: 'contact@phoenixlb.com',
          interestType: 'rent',
          propertyTitle: 'مستودع تجاري وسيع في وطى المصيطبة',
          notes: 'استفسار عن إمكانية دخول الشاحنات الكبيرة ووجود كهرباء ومولد 24/24.',
          date: '2026-09-03',
          status: 'contacted',
        },
      ];
      localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveInquiry(inquiry: Omit<VisitorInquiry, 'id' | 'date' | 'status'>) {
  if (typeof window === 'undefined') return;
  try {
    const list = loadInquiriesFromStorage();
    const newInquiry: VisitorInquiry = {
      ...inquiry,
      id: `inq-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'new',
    };
    list.unshift(newInquiry);
    localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify(list));
  } catch (err) {
    console.error('Error saving inquiry:', err);
  }
}
