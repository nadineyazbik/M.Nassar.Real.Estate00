import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Property, MainRegionId, ListingType, PropertyCategory, CommercialSubType } from '../types';
import { MAIN_REGIONS } from '../data/regions';
import {
  ADMIN_CREDENTIALS,
  performAdminLogin,
  performAdminLogout,
  checkAdminSession,
  loadInquiriesFromStorage,
  VisitorInquiry,
} from '../services/propertyStore';
import {
  X,
  Lock,
  Unlock,
  ShieldCheck,
  Building2,
  Plus,
  Trash2,
  Edit3,
  Search,
  Eye,
  EyeOff,
  LogOut,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  MapPin,
  Image as ImageIcon,
  DollarSign,
  Phone,
  MessageSquare,
  FileText,
  Sparkles,
  UploadCloud,
  Star,
} from 'lucide-react';

interface AdminCMSModalProps {
  isOpen: boolean;
  onClose: () => void;
  properties: Property[];
  onUpdateProperties: (updated: Property[]) => void;
  onResetProperties: () => void;
}

const SAMPLE_LUXURY_IMAGES = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop',
];

export const AdminCMSModal: React.FC<AdminCMSModalProps> = ({
  isOpen,
  onClose,
  properties,
  onUpdateProperties,
  onResetProperties,
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => checkAdminSession());
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // CMS Navigation Tabs
  const [activeTab, setActiveTab] = useState<'list' | 'editor' | 'inquiries' | 'settings'>('list');

  // Search & Filter within Admin CMS
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState<'all' | MainRegionId>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | PropertyCategory>('all');

  // Editor State
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    mainRegion: MainRegionId;
    subDistrict: string;
    streetOrDetails: string;
    price: number;
    listingType: ListingType;
    category: PropertyCategory;
    commercialType: CommercialSubType;
    areaSqM: number;
    bedrooms: number;
    bathrooms: number;
    floor: string;
    parkingSpaces: number;
    hasGreenDeed: boolean;
    electricity24_7: boolean;
    featured: boolean;
    imageUrl: string;
    images: string[];
    description: string;
    featuresText: string;
  }>({
    title: '',
    mainRegion: 'ras_beirut',
    subDistrict: 'الحمرا',
    streetOrDetails: '',
    price: 250000,
    listingType: 'sale',
    category: 'residential',
    commercialType: 'office',
    areaSqM: 180,
    bedrooms: 3,
    bathrooms: 3,
    floor: '4',
    parkingSpaces: 1,
    hasGreenDeed: true,
    electricity24_7: true,
    featured: false,
    imageUrl: SAMPLE_LUXURY_IMAGES[0],
    images: [SAMPLE_LUXURY_IMAGES[0]],
    description: '',
    featuresText: 'سند طابو أخضر 2400 سهم، كهرباء ومولد 24/24، موقف سيارة',
  });

  const [notification, setNotification] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [inquiries, setInquiries] = useState<VisitorInquiry[]>(() => loadInquiriesFromStorage());

  // Real Image Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [externalUrlText, setExternalUrlText] = useState('');

  // Safe body scroll locking: restores document.body.style.overflow = '' when closed so page never freezes
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Image Processing & Compression for Fast Storage & Display
  const processFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (fileArray.length === 0) {
      showToast('يرجى اختيار ملفات صور صالحة (PNG, JPG, WebP).', 'error');
      return;
    }

    let loadedCount = 0;
    const newImages: string[] = [];

    fileArray.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const maxDimension = 1400;
            let width = img.width;
            let height = img.height;

            if (width > maxDimension || height > maxDimension) {
              if (width > height) {
                height = Math.round((height * maxDimension) / width);
                width = maxDimension;
              } else {
                width = Math.round((width * maxDimension) / height);
                height = maxDimension;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              const compressed = canvas.toDataURL('image/jpeg', 0.85);
              newImages.push(compressed);
            } else {
              newImages.push(result);
            }

            loadedCount++;
            if (loadedCount === fileArray.length) {
              setFormData((prev) => {
                const combined = [...prev.images, ...newImages];
                return {
                  ...prev,
                  images: combined,
                  imageUrl: prev.imageUrl && prev.images.length > 0 ? prev.imageUrl : combined[0],
                };
              });
              showToast(`تم رفع ${loadedCount} صورة بنجاح وإضافتها إلى معرض العقار.`);
            }
          };
          img.src = result;
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormData((prev) => {
      const updated = prev.images.filter((_, idx) => idx !== indexToRemove);
      const newCover = updated[0] || '';
      return {
        ...prev,
        images: updated,
        imageUrl: prev.imageUrl === prev.images[indexToRemove] ? newCover : prev.imageUrl,
      };
    });
    showToast('تم حذف الصورة من المعرض.');
  };

  const handleSetPrimaryImage = (indexToPrimary: number) => {
    setFormData((prev) => {
      const selected = prev.images[indexToPrimary];
      const reordered = [selected, ...prev.images.filter((_, idx) => idx !== indexToPrimary)];
      return {
        ...prev,
        images: reordered,
        imageUrl: selected,
      };
    });
    showToast('تم تعيين هذه الصورة كغلاف رئيسي للعقار ⭐');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleAddExternalUrl = () => {
    if (!externalUrlText.trim()) return;
    setFormData((prev) => {
      const combined = [...prev.images, externalUrlText.trim()];
      return {
        ...prev,
        images: combined,
        imageUrl: prev.imageUrl ? prev.imageUrl : externalUrlText.trim(),
      };
    });
    setExternalUrlText('');
    setShowUrlInput(false);
    showToast('تمت إضافة الرابط إلى صور العقار.');
  };

  // Show notification
  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Handle Admin Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const success = performAdminLogin(emailInput, passwordInput);
    if (success) {
      setIsAuthenticated(true);
      showToast('تم تسجيل الدخول بنجاح إلى لوحة الإدارة.');
    } else {
      setLoginError('البريد الإلكتروني أو كلمة المرور غير صحيحة. يرجى التحقق وإعادة المحاولة.');
    }
  };

  // Handle Fill Credentials for Fast Testing
  const handleAutoFillCredentials = () => {
    setEmailInput(ADMIN_CREDENTIALS.email);
    setPasswordInput(ADMIN_CREDENTIALS.password);
    setLoginError('');
  };

  // Handle Logout
  const handleLogout = () => {
    performAdminLogout();
    setIsAuthenticated(false);
    showToast('تم تسجيل الخروج من لوحة الإدارة.');
  };

  // Dynamic subdistricts based on selected main region
  const availableSubDistricts = useMemo(() => {
    const found = MAIN_REGIONS.find((r) => r.id === formData.mainRegion);
    return found ? found.subDistricts : [];
  }, [formData.mainRegion]);

  // Open editor for adding new property
  const handleStartAdd = () => {
    setEditingPropertyId(null);
    setFormData({
      title: '',
      mainRegion: 'ras_beirut',
      subDistrict: 'الحمرا',
      streetOrDetails: '',
      price: 250000,
      listingType: 'sale',
      category: 'residential',
      commercialType: 'office',
      areaSqM: 180,
      bedrooms: 3,
      bathrooms: 3,
      floor: '3',
      parkingSpaces: 1,
      hasGreenDeed: true,
      electricity24_7: true,
      featured: true,
      imageUrl: SAMPLE_LUXURY_IMAGES[0],
      images: [SAMPLE_LUXURY_IMAGES[0], SAMPLE_LUXURY_IMAGES[1]],
      description: 'شقة فاخرة مجهزة بأرقى المواصفات وسند طابو أخضر مفرز 2400 سهم.',
      featuresText: 'سند طابو أخضر 2400 سهم، كهرباء 24/24، موقف سيارة، تشطيب سوبر ديلوكس',
    });
    setActiveTab('editor');
  };

  // Open editor for editing an existing property
  const handleStartEdit = (prop: Property) => {
    setEditingPropertyId(prop.id);
    setFormData({
      title: prop.title,
      mainRegion: prop.mainRegion,
      subDistrict: prop.subDistrict,
      streetOrDetails: prop.streetOrDetails || '',
      price: prop.price,
      listingType: prop.listingType,
      category: prop.category,
      commercialType: prop.commercialType || 'office',
      areaSqM: prop.areaSqM,
      bedrooms: prop.bedrooms || 0,
      bathrooms: prop.bathrooms || 0,
      floor: String(prop.floor || '1'),
      parkingSpaces: prop.parkingSpaces || 1,
      hasGreenDeed: prop.hasGreenDeed,
      electricity24_7: prop.electricity24_7,
      featured: prop.featured || false,
      imageUrl: prop.images[0] || SAMPLE_LUXURY_IMAGES[0],
      images: prop.images.length > 0 ? prop.images : [SAMPLE_LUXURY_IMAGES[0]],
      description: prop.description,
      featuresText: prop.features.join('، '),
    });
    setActiveTab('editor');
  };

  // Save property (Add or Edit)
  const handleSaveProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('يرجى إدخال عنوان العقار.', 'error');
      return;
    }

    const regionObj = MAIN_REGIONS.find((r) => r.id === formData.mainRegion);
    const regionName = regionObj ? regionObj.name : 'بيروت';

    const featuresList = formData.featuresText
      .split(/[،,]/)
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingPropertyId) {
      // Update existing
      const updated = properties.map((p) => {
        if (p.id === editingPropertyId) {
          return {
            ...p,
            title: formData.title,
            mainRegion: formData.mainRegion,
            mainRegionName: regionName,
            subDistrict: formData.subDistrict,
            streetOrDetails: formData.streetOrDetails,
            price: Number(formData.price),
            listingType: formData.listingType,
            category: formData.category,
            commercialType: formData.category === 'commercial' ? formData.commercialType : undefined,
            areaSqM: Number(formData.areaSqM),
            bedrooms: Number(formData.bedrooms),
            bathrooms: Number(formData.bathrooms),
            floor: formData.floor,
            parkingSpaces: Number(formData.parkingSpaces),
            hasGreenDeed: formData.hasGreenDeed,
            electricity24_7: formData.electricity24_7,
            featured: formData.featured,
            images: formData.images.length > 0 ? formData.images : [formData.imageUrl],
            description: formData.description,
            features: featuresList.length > 0 ? featuresList : ['سند طابو أخضر 2400 سهم'],
          };
        }
        return p;
      });
      onUpdateProperties(updated);
      showToast(`تم تعديل العقار "${formData.title}" بنجاح.`);
    } else {
      // Create new
      const newProp: Property = {
        id: `prop-cms-${Date.now()}`,
        title: formData.title,
        mainRegion: formData.mainRegion,
        mainRegionName: regionName,
        subDistrict: formData.subDistrict,
        streetOrDetails: formData.streetOrDetails,
        price: Number(formData.price),
        listingType: formData.listingType,
        category: formData.category,
        commercialType: formData.category === 'commercial' ? formData.commercialType : undefined,
        areaSqM: Number(formData.areaSqM),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        floor: formData.floor,
        parkingSpaces: Number(formData.parkingSpaces),
        hasGreenDeed: formData.hasGreenDeed,
        electricity24_7: formData.electricity24_7,
        featured: formData.featured,
        images: formData.images.length > 0 ? formData.images : [formData.imageUrl],
        description: formData.description,
        features: featuresList.length > 0 ? featuresList : ['سند طابو أخضر 2400 سهم'],
        agentPhone: '+96176743414',
      };
      onUpdateProperties([newProp, ...properties]);
      showToast(`تمت إضافة العقار الجديد "${formData.title}" بنجاح.`);
    }

    setActiveTab('list');
  };

  // Delete property
  const handleDeleteProperty = (id: string, title: string) => {
    if (window.confirm(`هل أنت متأكد من حذف العقار: "${title}"؟ لا يمكن التراجع عن هذا الإجراء.`)) {
      const filtered = properties.filter((p) => p.id !== id);
      onUpdateProperties(filtered);
      showToast(`تم حذف العقار "${title}".`);
    }
  };

  // Inline price update
  const handleQuickPriceChange = (id: string, newPrice: number) => {
    const updated = properties.map((p) => (p.id === id ? { ...p, price: newPrice } : p));
    onUpdateProperties(updated);
    showToast('تم تحديث السعر بنجاح.');
  };

  // Filtered properties for CMS list view
  const filteredList = useMemo(() => {
    return properties.filter((p) => {
      if (regionFilter !== 'all' && p.mainRegion !== regionFilter) return false;
      if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.subDistrict.toLowerCase().includes(q) ||
          p.mainRegionName.toLowerCase().includes(q) ||
          (p.streetOrDetails || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [properties, regionFilter, categoryFilter, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto" dir="rtl">
      <div className="relative w-full max-w-6xl bg-neutral-900 border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Toast Notification */}
        {notification && (
          <div
            className={`absolute top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-2xl flex items-center gap-2 border animate-fade-in ${
              notification.type === 'success'
                ? 'bg-emerald-600 text-white border-emerald-400'
                : 'bg-red-600 text-white border-red-400'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{notification.text}</span>
          </div>
        )}

        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-neutral-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500/20 to-emerald-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                  نظام إدارة المحتوى والعقارات (CMS) • م. نصار العقارية
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                  {isAuthenticated ? 'جلسة محمية ونشطة' : 'منطقة محظورة للإدارة'}
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                تحكم كامل في إضافة وحذف وتعديل العقارات والأسعار والصور واستفسارات العملاء
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ============================================================ */}
        {/* VIEW 1: AUTHENTICATION LOGIN SCREEN (When not authenticated)  */}
        {/* ============================================================ */}
        {!isAuthenticated ? (
          <div className="p-6 sm:p-12 flex flex-col items-center justify-center max-w-md mx-auto w-full my-auto space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-xl">
              <Lock className="w-8 h-8" />
            </div>

            <div className="text-center space-y-2">
              <h4 className="text-xl font-bold text-white">تسجيل الدخول إلى لوحة تحكم الإدارة</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                هذه اللوحة مخصصة ومحمية حصرياً لإدارة م. نصار العقارية لتحديث العروض والأسعار.
              </p>
            </div>

            {/* Auto Fill Quick Button for Dev/Testing */}
            <div className="w-full p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs text-amber-300">
              <div className="space-y-0.5 text-right">
                <span className="font-bold block">بيانات المشرف المعتمدة:</span>
                <span className="text-[11px] font-mono text-neutral-300" dir="ltr">admin@nassarrealestate.com</span>
              </div>
              <button
                type="button"
                onClick={handleAutoFillCredentials}
                className="px-3 py-1.5 rounded-lg bg-amber-400 text-black font-bold text-xs hover:bg-amber-300 transition-colors cursor-pointer"
              >
                تعبئة تلقائية للبيانات
              </button>
            </div>

            {loginError && (
              <div className="w-full p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-300">البريد الإلكتروني للإدارة</label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="admin@nassarrealestate.com"
                  className="w-full bg-neutral-950 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 font-mono"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-300">كلمة المرور المشفرة</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-neutral-950 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 font-mono pl-10"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold text-sm transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                <span>دخول آمن للوحة التحكم</span>
              </button>
            </form>
          </div>
        ) : (
          /* ============================================================ */
          /* VIEW 2: AUTHENTICATED ADMIN CMS CONTROL DASHBOARD             */
          /* ============================================================ */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Top Navigation & Status Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-3 bg-neutral-950 border-b border-white/10 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('list')}
                  className={`px-3.5 py-2 rounded-xl font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'list'
                      ? 'bg-amber-400 text-black'
                      : 'text-neutral-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>محفظة العقارات ({properties.length})</span>
                </button>

                <button
                  onClick={handleStartAdd}
                  className={`px-3.5 py-2 rounded-xl font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'editor' && !editingPropertyId
                      ? 'bg-emerald-500 text-white'
                      : 'text-neutral-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة عقار جديد</span>
                </button>

                <button
                  onClick={() => setActiveTab('inquiries')}
                  className={`px-3.5 py-2 rounded-xl font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'inquiries'
                      ? 'bg-amber-400 text-black'
                      : 'text-neutral-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>استفسارات وطلبات العملاء ({inquiries.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`px-3.5 py-2 rounded-xl font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'settings'
                      ? 'bg-amber-400 text-black'
                      : 'text-neutral-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>إعادة ضبط واستعادة</span>
                </button>
              </div>

              {/* Admin Profile & Logout */}
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <span className="text-white font-bold block leading-tight">المسؤول: م. نصار</span>
                  <span className="text-[10px] text-emerald-400 font-mono" dir="ltr">admin@nassarrealestate.com</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/40 border border-red-500/30 text-red-300 font-bold transition-colors cursor-pointer flex items-center gap-1"
                  title="تسجيل الخروج"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>خروج</span>
                </button>
              </div>
            </div>

            {/* TAB CONTENT CONTAINER */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">

              {/* ----------------------------------------------------------- */}
              {/* TAB 1: PROPERTIES LIST & INSTANT MANAGEMENT                  */}
              {/* ----------------------------------------------------------- */}
              {activeTab === 'list' && (
                <div className="space-y-4">
                  {/* Search and Filter bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-6 relative">
                      <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="ابحث بالعنوان، الحي، أو الشارع..."
                        className="w-full bg-neutral-950 border border-white/15 rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <select
                        value={regionFilter}
                        onChange={(e) => setRegionFilter(e.target.value as any)}
                        className="w-full bg-neutral-950 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                      >
                        <option value="all">كافة المناطق الرئيسية</option>
                        {MAIN_REGIONS.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-3">
                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value as any)}
                        className="w-full bg-neutral-950 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                      >
                        <option value="all">كافة التصنيفات (سكني وتجاري)</option>
                        <option value="residential">شقق سكنية</option>
                        <option value="commercial">عقار تجاري (محل، مستودع، مكتب)</option>
                      </select>
                    </div>
                  </div>

                  {/* Table of Properties */}
                  <div className="rounded-2xl border border-white/10 bg-neutral-950/60 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-right text-xs">
                        <thead className="bg-neutral-900/80 text-neutral-300 border-b border-white/10">
                          <tr>
                            <th className="p-3">العقار</th>
                            <th className="p-3">المنطقة والحي</th>
                            <th className="p-3">النوع والإعلان</th>
                            <th className="p-3">السعر ($)</th>
                            <th className="p-3">المساحة</th>
                            <th className="p-3">المواصفات</th>
                            <th className="p-3 text-center">إجراءات الإدارة</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {filteredList.map((prop) => (
                            <tr key={prop.id} className="hover:bg-white/5 transition-colors">
                              {/* Title & Thumbnail */}
                              <td className="p-3">
                                <div className="flex items-center gap-3 min-w-[240px]">
                                  <img
                                    src={prop.images[0] || SAMPLE_LUXURY_IMAGES[0]}
                                    alt={prop.title}
                                    className="w-12 h-12 rounded-lg object-cover border border-white/10 shrink-0"
                                  />
                                  <div>
                                    <h5 className="font-bold text-white line-clamp-1">{prop.title}</h5>
                                    <span className="text-[10px] text-neutral-400 block font-mono">
                                      ID: {prop.id}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              {/* Region & Subdistrict */}
                              <td className="p-3 whitespace-nowrap">
                                <span className="font-semibold text-white block">{prop.mainRegionName}</span>
                                <span className="text-amber-400 text-[11px]">حي: {prop.subDistrict}</span>
                              </td>

                              {/* Listing & Category */}
                              <td className="p-3 whitespace-nowrap">
                                <div className="flex flex-col gap-1">
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-block w-max ${
                                      prop.listingType === 'sale'
                                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                    }`}
                                  >
                                    {prop.listingType === 'sale' ? 'بيع' : 'إيجار'}
                                  </span>
                                  <span className="text-[10px] text-neutral-400">
                                    {prop.category === 'residential'
                                      ? 'سكني'
                                      : `تجاري (${prop.commercialType || 'مكتب'})`}
                                  </span>
                                </div>
                              </td>

                              {/* Price ($) with quick change */}
                              <td className="p-3 whitespace-nowrap font-mono font-bold text-white">
                                <div className="flex items-center gap-1">
                                  <span>${prop.price.toLocaleString()}</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const entered = window.prompt('أدخل السعر الجديد بالدولار:', String(prop.price));
                                      if (entered && !isNaN(Number(entered))) {
                                        handleQuickPriceChange(prop.id, Number(entered));
                                      }
                                    }}
                                    className="p-1 rounded text-neutral-400 hover:text-amber-300"
                                    title="تعديل سريع للسعر"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                  </button>
                                </div>
                              </td>

                              {/* Area */}
                              <td className="p-3 whitespace-nowrap text-neutral-300">
                                {prop.areaSqM} م²
                              </td>

                              {/* Badges */}
                              <td className="p-3 whitespace-nowrap">
                                <div className="flex items-center gap-1.5">
                                  {prop.hasGreenDeed && (
                                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-[10px] font-semibold border border-emerald-500/30" title="سند طابو أخضر 2400 سهم">
                                      طابو 2400
                                    </span>
                                  )}
                                  {prop.electricity24_7 && (
                                    <span className="px-1.5 py-0.5 rounded bg-amber-400/15 text-amber-400 text-[10px] font-semibold border border-amber-400/30" title="كهرباء 24/24">
                                      ⚡ 24/24
                                    </span>
                                  )}
                                </div>
                              </td>

                              {/* Actions */}
                              <td className="p-3 whitespace-nowrap text-center">
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    onClick={() => handleStartEdit(prop)}
                                    className="p-1.5 rounded-lg bg-white/10 hover:bg-amber-400 hover:text-black text-neutral-200 transition-colors cursor-pointer"
                                    title="تعديل تفاصيل العقار"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    onClick={() => handleDeleteProperty(prop.id, prop.title)}
                                    className="p-1.5 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white transition-colors cursor-pointer"
                                    title="حذف العقار"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------------- */}
              {/* TAB 2: ADD / EDIT PROPERTY FORM                             */}
              {/* ----------------------------------------------------------- */}
              {activeTab === 'editor' && (
                <form onSubmit={handleSaveProperty} className="space-y-6 max-w-4xl mx-auto">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <Edit3 className="w-4 h-4 text-amber-400" />
                      <span>{editingPropertyId ? 'تعديل بيانات العقار' : 'إضافة عقار جديد إلى المحفظة'}</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => setActiveTab('list')}
                      className="text-xs text-neutral-400 hover:text-white cursor-pointer"
                    >
                      ← الرجوع لقائمة العقارات
                    </button>
                  </div>

                  {/* Form fields grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {/* Title */}
                    <div className="md:col-span-2 space-y-1">
                      <label className="font-bold text-neutral-200">عنوان العقار بالكامل *</label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="مثال: شقة دوبلكس فخمة مع تراس بإطلالة بحرية في الروشة"
                        className="w-full bg-neutral-950 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    {/* Main Region */}
                    <div className="space-y-1">
                      <label className="font-bold text-neutral-200">المنطقة الجغرافية الرئيسية *</label>
                      <select
                        value={formData.mainRegion}
                        onChange={(e) => {
                          const newRegion = e.target.value as MainRegionId;
                          const found = MAIN_REGIONS.find((r) => r.id === newRegion);
                          const firstSub = found ? found.subDistricts[0] : '';
                          setFormData({ ...formData, mainRegion: newRegion, subDistrict: firstSub });
                        }}
                        className="w-full bg-neutral-950 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                      >
                        {MAIN_REGIONS.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* SubDistrict */}
                    <div className="space-y-1">
                      <label className="font-bold text-neutral-200">الحي الفرعي المعتمد *</label>
                      <select
                        value={formData.subDistrict}
                        onChange={(e) => setFormData({ ...formData, subDistrict: e.target.value })}
                        className="w-full bg-neutral-950 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                      >
                        {availableSubDistricts.map((sub) => (
                          <option key={sub} value={sub}>
                            {sub}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Street or Landmark */}
                    <div className="space-y-1">
                      <label className="font-bold text-neutral-200">الشارع أو المعلم القريب</label>
                      <input
                        type="text"
                        value={formData.streetOrDetails}
                        onChange={(e) => setFormData({ ...formData, streetOrDetails: e.target.value })}
                        placeholder="مثال: قرب مستشفى الجامعة الأمريكية، شارع بليس"
                        className="w-full bg-neutral-950 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    {/* Price ($) */}
                    <div className="space-y-1">
                      <label className="font-bold text-neutral-200">السعر بالدولار الفريش ($) *</label>
                      <input
                        type="number"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        className="w-full bg-neutral-950 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    {/* Listing Type: Sale / Rent */}
                    <div className="space-y-1">
                      <label className="font-bold text-neutral-200">نوع الإعلان *</label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, listingType: 'sale' })}
                          className={`flex-1 py-2 rounded-xl font-bold cursor-pointer transition-colors ${
                            formData.listingType === 'sale'
                              ? 'bg-amber-400 text-black'
                              : 'bg-neutral-950 text-neutral-400 border border-white/10'
                          }`}
                        >
                          للبيع
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, listingType: 'rent' })}
                          className={`flex-1 py-2 rounded-xl font-bold cursor-pointer transition-colors ${
                            formData.listingType === 'rent'
                              ? 'bg-emerald-500 text-white'
                              : 'bg-neutral-950 text-neutral-400 border border-white/10'
                          }`}
                        >
                          للإيجار
                        </button>
                      </div>
                    </div>

                    {/* Property Category: Residential / Commercial */}
                    <div className="space-y-1">
                      <label className="font-bold text-neutral-200">نوع العقار *</label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, category: 'residential' })}
                          className={`flex-1 py-2 rounded-xl font-bold cursor-pointer transition-colors ${
                            formData.category === 'residential'
                              ? 'bg-white text-black'
                              : 'bg-neutral-950 text-neutral-400 border border-white/10'
                          }`}
                        >
                          شقق سكنية
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, category: 'commercial' })}
                          className={`flex-1 py-2 rounded-xl font-bold cursor-pointer transition-colors ${
                            formData.category === 'commercial'
                              ? 'bg-white text-black'
                              : 'bg-neutral-950 text-neutral-400 border border-white/10'
                          }`}
                        >
                          عقار تجاري
                        </button>
                      </div>
                    </div>

                    {/* Commercial Sub-Type if Commercial */}
                    {formData.category === 'commercial' && (
                      <div className="md:col-span-2 space-y-1 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                        <label className="font-bold text-amber-300">التصنيف التجاري الدقيق *</label>
                        <div className="flex gap-3">
                          {(['shop', 'warehouse', 'office'] as CommercialSubType[]).map((sub) => (
                            <label key={sub} className="flex items-center gap-2 cursor-pointer text-white">
                              <input
                                type="radio"
                                name="commercialSubType"
                                checked={formData.commercialType === sub}
                                onChange={() => setFormData({ ...formData, commercialType: sub })}
                                className="text-amber-400"
                              />
                              <span>
                                {sub === 'shop' ? 'محل تجاري' : sub === 'warehouse' ? 'مستودع تخزين' : 'مكتب شركات'}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Area SqM */}
                    <div className="space-y-1">
                      <label className="font-bold text-neutral-200">المساحة الإجمالية (م²) *</label>
                      <input
                        type="number"
                        required
                        value={formData.areaSqM}
                        onChange={(e) => setFormData({ ...formData, areaSqM: Number(e.target.value) })}
                        className="w-full bg-neutral-950 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    {/* Bedrooms & Bathrooms */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="font-bold text-neutral-200">غرف النوم</label>
                        <input
                          type="number"
                          value={formData.bedrooms}
                          onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                          className="w-full bg-neutral-950 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-neutral-200">الحمامات</label>
                        <input
                          type="number"
                          value={formData.bathrooms}
                          onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                          className="w-full bg-neutral-950 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    {/* Key Toggles */}
                    <div className="md:col-span-2 flex flex-wrap items-center gap-6 p-3 rounded-xl bg-neutral-950 border border-white/10">
                      <label className="flex items-center gap-2 cursor-pointer text-white">
                        <input
                          type="checkbox"
                          checked={formData.hasGreenDeed}
                          onChange={(e) => setFormData({ ...formData, hasGreenDeed: e.target.checked })}
                          className="w-4 h-4 text-emerald-500 rounded"
                        />
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>سند طابو أخضر 2400 سهم</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer text-white">
                        <input
                          type="checkbox"
                          checked={formData.electricity24_7}
                          onChange={(e) => setFormData({ ...formData, electricity24_7: e.target.checked })}
                          className="w-4 h-4 text-amber-400 rounded"
                        />
                        <span className="text-amber-400">⚡</span>
                        <span>كهرباء ومولد 24/24</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer text-white">
                        <input
                          type="checkbox"
                          checked={formData.featured}
                          onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                          className="w-4 h-4 text-amber-400 rounded"
                        />
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>عقار مميز (Featured)</span>
                      </label>
                    </div>

                    {/* Real Image Upload Component (Drag & Drop, Multi-file Picker, Instant Previews) */}
                    <div className="md:col-span-2 space-y-3 bg-white/[0.02] p-4 sm:p-5 rounded-2xl border border-white/10">
                      <div>
                        <label className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-amber-400" />
                          <span>معرض صور العقار الحقيقية (Property Image Gallery)</span>
                        </label>
                        <p className="text-xs text-neutral-400 mt-1">
                          قم برفع صور العقار الأصلية عالية الجودة مباشرة من هاتفك أو حاسوبك بدون الحاجة لروابط خارجية.
                        </p>
                      </div>

                      {/* Hidden File Input */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files) {
                            processFiles(e.target.files);
                          }
                          e.target.value = '';
                        }}
                      />

                      {/* Drag & Drop Upload Zone */}
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 select-none ${
                          isDragging
                            ? 'border-amber-400 bg-amber-400/10 scale-[1.01]'
                            : 'border-amber-500/30 hover:border-amber-400 bg-neutral-950/70 hover:bg-neutral-950'
                        }`}
                      >
                        <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-md">
                          <UploadCloud className="w-7 h-7" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm sm:text-base font-bold text-white flex items-center justify-center flex-wrap gap-2">
                            <span>انقر لاختيار صور من جهازك</span>
                            <span className="text-black bg-amber-400 px-2.5 py-0.5 rounded-lg text-xs font-bold inline-flex items-center gap-1 shadow-sm">
                              <Plus className="w-3.5 h-3.5" />
                              <span>رفع ملفات</span>
                            </span>
                            <span>أو اسحب الصور وأفلتها هنا</span>
                          </p>
                          <p className="text-xs text-neutral-400">
                            يدعم اختيار عدة صور معاً (PNG, JPG, WebP) مع ضغط تلقائي وحفظ سريع
                          </p>
                        </div>
                      </div>

                      {/* Immediate Thumbnail Grid Preview */}
                      {formData.images.length > 0 && (
                        <div className="space-y-2 pt-2">
                          <div className="flex items-center justify-between text-xs text-neutral-300">
                            <span className="font-bold flex items-center gap-1.5 text-amber-400">
                              <ImageIcon className="w-3.5 h-3.5" />
                              <span>الصور المحملة ({formData.images.length}):</span>
                            </span>
                            <span className="text-[11px] text-neutral-400">
                              انقر على ⭐ لتعيين الصورة كغلاف رئيسي للعقار
                            </span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {formData.images.map((img, idx) => {
                              const isPrimary = formData.imageUrl === img || (idx === 0 && !formData.imageUrl);
                              return (
                                <div
                                  key={idx}
                                  className={`group relative rounded-xl overflow-hidden border-2 aspect-[4/3] bg-neutral-950 transition-all ${
                                    isPrimary
                                      ? 'border-amber-400 shadow-lg shadow-amber-500/20 ring-2 ring-amber-400/40'
                                      : 'border-white/15 hover:border-white/50'
                                  }`}
                                >
                                  <img
                                    src={img}
                                    alt={`Property image ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                  />

                                  {/* Primary Cover Badge */}
                                  {isPrimary && (
                                    <div className="absolute top-1.5 right-1.5 bg-amber-400 text-black font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                                      <Star className="w-3 h-3 fill-black" />
                                      <span>الرئيسية</span>
                                    </div>
                                  )}

                                  {/* Hover Action Buttons */}
                                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-1">
                                    {!isPrimary && (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleSetPrimaryImage(idx);
                                        }}
                                        className="p-1.5 rounded-lg bg-amber-400 text-black hover:bg-amber-300 transition-colors shadow-md text-xs font-bold"
                                        title="تعيين كصورة رئيسية"
                                      >
                                        <Star className="w-3.5 h-3.5 fill-black" />
                                      </button>
                                    )}
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveImage(idx);
                                      }}
                                      className="p-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white transition-colors shadow-md"
                                      title="حذف الصورة"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}

                            {/* Add More Button Inside Grid */}
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="rounded-xl border-2 border-dashed border-white/20 hover:border-amber-400 text-neutral-400 hover:text-amber-400 aspect-[4/3] flex flex-col items-center justify-center gap-1 transition-all bg-white/5 hover:bg-amber-400/10 cursor-pointer select-none"
                            >
                              <Plus className="w-5 h-5" />
                              <span className="text-[11px] font-bold">إضافة المزيد</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Collapsible External URL Input */}
                      <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={() => setShowUrlInput(!showUrlInput)}
                          className="text-xs text-neutral-400 hover:text-amber-400 flex items-center gap-1.5 w-fit cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>إضافة صورة عبر رابط ويب خارجي (اختياري)</span>
                        </button>

                        {showUrlInput && (
                          <div className="flex gap-2 animate-in fade-in duration-200">
                            <input
                              type="url"
                              value={externalUrlText}
                              onChange={(e) => setExternalUrlText(e.target.value)}
                              placeholder="https://images.unsplash.com/..."
                              className="flex-1 bg-neutral-950 border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                            />
                            <button
                              type="button"
                              onClick={handleAddExternalUrl}
                              className="px-4 py-2 bg-amber-400 text-black text-xs font-bold rounded-xl hover:bg-amber-300 transition-colors cursor-pointer"
                            >
                              إضافة
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Features Tag Input */}
                    <div className="md:col-span-2 space-y-1">
                      <label className="font-bold text-neutral-200">المميزات الرئيسية (افصل بينها بفاصلة)</label>
                      <input
                        type="text"
                        value={formData.featuresText}
                        onChange={(e) => setFormData({ ...formData, featuresText: e.target.value })}
                        placeholder="مثال: سند طابو أخضر 2400 سهم، إطلالة بحرية، كهرباء 24/24، موقف سيارة مسجل"
                        className="w-full bg-neutral-950 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2 space-y-1">
                      <label className="font-bold text-neutral-200">الوصف التفصيلي للعقار</label>
                      <textarea
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="اكتب وصفاً مفصلاً عن العقار وموقعه وتجهيزاته..."
                        className="w-full bg-neutral-950 border border-white/15 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setActiveTab('list')}
                      className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-bold transition-colors cursor-pointer"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black text-xs font-bold transition-all shadow-lg cursor-pointer flex items-center gap-1.5"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingPropertyId ? 'حفظ التعديلات' : 'نشر العقار بالموقع فوراً'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* ----------------------------------------------------------- */}
              {/* TAB 3: VISITOR INQUIRIES & LEADS                             */}
              {/* ----------------------------------------------------------- */}
              {activeTab === 'inquiries' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">طلبات واستفسارات العملاء والزوار</h4>
                      <p className="text-xs text-neutral-400">
                        الطلبات الواردة مباشرة من موقع م. نصار العقارية للتواصل الفوري
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {inquiries.map((inq) => (
                      <div
                        key={inq.id}
                        className="p-4 rounded-2xl bg-neutral-950 border border-white/10 space-y-3 relative"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">{inq.name}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              {inq.interestType === 'buy'
                                ? 'مهتم بالشراء'
                                : inq.interestType === 'rent'
                                ? 'مهتم بالإيجار'
                                : inq.interestType === 'list'
                                ? 'عرض عقار'
                                : 'استشارة'}
                            </span>
                          </div>
                          <span className="text-[10px] text-neutral-500 font-mono">{inq.date}</span>
                        </div>

                        {inq.propertyTitle && (
                          <div className="text-xs text-amber-300 font-medium">
                            العقار المراد: {inq.propertyTitle}
                          </div>
                        )}

                        {inq.notes && (
                          <p className="text-xs text-neutral-300 leading-relaxed bg-white/5 p-2.5 rounded-xl border border-white/5">
                            {inq.notes}
                          </p>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                          <div className="flex items-center gap-3">
                            <a
                              href={`tel:${inq.phone}`}
                              className="flex items-center gap-1 text-neutral-300 hover:text-white"
                            >
                              <Phone className="w-3 h-3 text-emerald-400" />
                              <span dir="ltr">{inq.phone}</span>
                            </a>
                            {inq.email && (
                              <span className="text-neutral-400 hidden sm:inline" dir="ltr">
                                {inq.email}
                              </span>
                            )}
                          </div>

                          <a
                            href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                              `مرحباً بك أستاذ ${inq.name}، معك مكتب م. نصار العقارية بخصوص استفسارك.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 rounded-lg bg-[#25D366]/20 text-[#25D366] hover:bg-[#25D366] hover:text-white font-bold transition-colors text-[11px]"
                          >
                            مراسلة واتساب
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------------- */}
              {/* TAB 4: SETTINGS & RESET TO DEFAULTS                          */}
              {/* ----------------------------------------------------------- */}
              {activeTab === 'settings' && (
                <div className="space-y-6 max-w-xl mx-auto py-6 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto">
                    <RotateCcw className="w-6 h-6" />
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-base font-bold text-white">إعادة ضبط محفظة العقارات الافتراضية</h4>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      في حال الرغبة في استعادة البيانات والعقارات المرجعية الأصلية (شقق الروشة، الحمرا، قريطم، كليمنصو، بدارو، مكاتب الشركات ومستودعات المصيطبة)، يمكنك إعادة التهيئة بنقرة واحدة.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-neutral-950 border border-white/10 text-right space-y-2 text-xs">
                    <div className="font-bold text-white">معلومات الأمان:</div>
                    <div className="text-neutral-400">
                      • كلمة المرور الحالية للمسؤول: <span className="font-mono text-amber-300" dir="ltr">NassarAdmin2025!</span>
                    </div>
                    <div className="text-neutral-400">
                      • البريد المعتمد: <span className="font-mono text-amber-300" dir="ltr">admin@nassarrealestate.com</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('هل تود استعادة كافة العقارات النموذجية الافتراضية؟')) {
                        onResetProperties();
                        showToast('تمت استعادة المحفظة العقارية الافتراضية بنجاح.');
                        setActiveTab('list');
                      }
                    }}
                    className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    استعادة العقارات الافتراضية الآن
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
