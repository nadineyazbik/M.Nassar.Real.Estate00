import React, { useState, useMemo, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { AnimatedHeading } from './components/AnimatedHeading';
import { FadeIn } from './components/FadeIn';
import { ChatDrawer } from './components/ChatDrawer';
import { PropertyCard } from './components/PropertyCard';
import { PropertyModal } from './components/PropertyModal';
import { AdminCMSModal } from './components/AdminCMSModal';
import { VisitorCheckInModal } from './components/VisitorCheckInModal';
import { WishlistModal } from './components/WishlistModal';
import { NotificationsDropdown } from './components/NotificationsDropdown';
import { FloatingWhatsAppButton } from './components/FloatingWhatsAppButton';
import { ValuationTool } from './components/ValuationTool';
import { AdvisorySection } from './components/AdvisorySection';
import { Footer } from './components/Footer';
import { MAIN_REGIONS } from './data/regions';
import { Property, MainRegionId, ListingType, PropertyCategory, CommercialSubType } from './types';
import {
  loadPropertiesFromStorage,
  savePropertiesToStorage,
  resetPropertiesToDefault,
} from './services/propertyStore';
import {
  Search,
  PlusCircle,
  TrendingUp,
  Building2,
  Phone,
  MessageCircle,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  MapPin,
  CheckCircle,
  Building,
  Store,
  Warehouse,
  Filter,
  RotateCcw,
  Compass,
  Lock,
  UserCheck,
} from 'lucide-react';

export default function App() {
  // Modal states
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isVisitorCheckInOpen, setIsVisitorCheckInOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Global Anti-Freeze Safety Guard: Guarantees page scrolling is never locked when modals close
  useEffect(() => {
    if (!selectedProperty && !isAdminOpen && !isChatOpen && !isWishlistOpen && !isVisitorCheckInOpen && !isNotificationsOpen) {
      document.body.style.overflow = '';
    }
  }, [selectedProperty, isAdminOpen, isChatOpen, isWishlistOpen, isVisitorCheckInOpen, isNotificationsOpen]);

  // Dynamic Properties managed via Store (persisted to localStorage)
  const [properties, setProperties] = useState<Property[]>(() => loadPropertiesFromStorage());

  const handleUpdateProperties = (updated: Property[]) => {
    setProperties(updated);
    savePropertiesToStorage(updated);
  };

  const handleResetProperties = () => {
    const defaults = resetPropertiesToDefault();
    setProperties(defaults);
  };

  // Geographic & Property Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [mainRegionFilter, setMainRegionFilter] = useState<'all' | MainRegionId>('all');
  const [subDistrictFilter, setSubDistrictFilter] = useState<string>('all');
  const [listingFilter, setListingFilter] = useState<'all' | ListingType>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | PropertyCategory>('all');
  const [commercialSubTypeFilter, setCommercialSubTypeFilter] = useState<'all' | CommercialSubType>('all');
  const [greenDeedOnly, setGreenDeedOnly] = useState(false);
  const [electricityOnly, setElectricityOnly] = useState(false);

  const scrollToProperties = () => {
    document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToRegions = () => {
    document.getElementById('regions')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Get current region definition for sub-districts list
  const currentRegionDef = useMemo(() => {
    if (mainRegionFilter === 'all') return null;
    return MAIN_REGIONS.find((r) => r.id === mainRegionFilter) || null;
  }, [mainRegionFilter]);

  // When changing main region from dropdown or cards
  const handleMainRegionChange = (newRegion: 'all' | MainRegionId) => {
    setMainRegionFilter(newRegion);
    setSubDistrictFilter('all'); // reset subdistrict when switching main region
  };

  // Quick select a main region and jump to filtered properties
  const handleSelectMainRegionCard = (regionId: MainRegionId) => {
    setMainRegionFilter(regionId);
    setSubDistrictFilter('all');
    scrollToProperties();
  };

  // Quick select a subdistrict
  const handleSelectSubDistrictChip = (subDistrict: string) => {
    if (subDistrictFilter === subDistrict) {
      setSubDistrictFilter('all');
    } else {
      setSubDistrictFilter(subDistrict);
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setMainRegionFilter('all');
    setSubDistrictFilter('all');
    setListingFilter('all');
    setCategoryFilter('all');
    setCommercialSubTypeFilter('all');
    setGreenDeedOnly(false);
    setElectricityOnly(false);
  };

  // Filtered properties over dynamic store
  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      // 1. Main Region
      if (mainRegionFilter !== 'all' && p.mainRegion !== mainRegionFilter) return false;

      // 2. Sub District
      if (subDistrictFilter !== 'all' && p.subDistrict !== subDistrictFilter) return false;

      // 3. Listing Type (بيع / إيجار)
      if (listingFilter !== 'all' && p.listingType !== listingFilter) return false;

      // 4. Category (شقق سكنية / عقار تجاري)
      if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;

      // 5. Commercial sub-type (محل / مستودع / مكتب)
      if (
        categoryFilter === 'commercial' &&
        commercialSubTypeFilter !== 'all' &&
        p.commercialType !== commercialSubTypeFilter
      ) {
        return false;
      }

      // 6. Green deed
      if (greenDeedOnly && !p.hasGreenDeed) return false;

      // 7. 24/7 Electricity
      if (electricityOnly && !p.electricity24_7) return false;

      // 8. Text Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = p.title.toLowerCase().includes(q);
        const inDesc = p.description.toLowerCase().includes(q);
        const inRegion = p.mainRegionName.toLowerCase().includes(q);
        const inSub = p.subDistrict.toLowerCase().includes(q);
        const inStreet = (p.streetOrDetails || '').toLowerCase().includes(q);
        return inTitle || inDesc || inRegion || inSub || inStreet;
      }

      return true;
    });
  }, [
    properties,
    searchQuery,
    mainRegionFilter,
    subDistrictFilter,
    listingFilter,
    categoryFilter,
    commercialSubTypeFilter,
    greenDeedOnly,
    electricityOnly,
  ]);

  // Counts for regions
  const getRegionCount = (regionId: MainRegionId) => {
    return properties.filter((p) => p.mainRegion === regionId).length;
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white font-sans antialiased text-right transition-colors duration-300" dir="rtl">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (PRESERVED RAW BACKGROUND VIDEO - NO OVERLAYS) */}
      {/* ========================================================================= */}
      <section
        id="hero"
        className="relative w-full h-screen min-h-[640px] flex flex-col justify-between overflow-hidden bg-black text-white font-sans"
      >
        {/* Full-screen background video - RAW, NO OVERLAYS, NO GRADIENTS */}
        <video
          id="hero-video"
          autoPlay
          loop
          muted
          playsInline
          poster="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1024&h=768&auto=format&fit=crop"
          className="video-bg pointer-events-none select-none"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4"
            type="video/mp4"
          />
        </video>

        {/* Top Navbar */}
        <Navbar
          onOpenChat={() => setIsChatOpen(true)}
          onOpenAdmin={() => setIsAdminOpen(true)}
          onOpenVisitorCheckIn={() => setIsVisitorCheckInOpen(true)}
          onOpenWishlist={() => setIsWishlistOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
        />

        {/* Hero Content at the Bottom */}
        <div className="relative z-10 w-full px-6 md:px-12 lg:px-16 flex-1 flex flex-col justify-end pb-12 lg:pb-16">
          <div className="w-full lg:grid lg:grid-cols-2 lg:items-end gap-8">
            {/* Right Column in RTL: Main Hero Text */}
            <div className="flex flex-col">
              <AnimatedHeading
                text={'م. نصار العقارية\nنصنع معايير الاستثمار العقاري.'}
                className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] mb-5 text-white"
              />

              <FadeIn delay={600} duration={800}>
                <p className="text-base md:text-lg text-neutral-200 mb-8 max-w-xl leading-relaxed">
                  بوابتك الموثوقة لشراء وتأجير الشقق السكنية الفاخرة والعقارات التجارية (محل، مستودع، مكتب) في بيروت وخارجها، بسندات طابو خضراء مفرزة 2400 سهم واستشارات ذكية.
                </p>
              </FadeIn>

              <FadeIn delay={900} duration={800}>
                <div className="flex flex-wrap gap-4 items-center">
                  <button
                    type="button"
                    id="btn-explore-properties"
                    onClick={scrollToProperties}
                    className="bg-white text-black px-7 py-3 rounded-xl font-bold transition-all duration-200 hover:bg-neutral-200 cursor-pointer shadow-xl text-sm"
                  >
                    استكشف العقارات والأحياء
                  </button>

                  <button
                    type="button"
                    id="btn-open-ai-chat"
                    onClick={() => setIsChatOpen(true)}
                    className="liquid-glass border border-white/20 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:bg-white/10 cursor-pointer flex items-center gap-2 text-sm"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>المستشار الذكي</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsVisitorCheckInOpen(true)}
                    className="hidden sm:flex items-center gap-2 text-neutral-300 hover:text-white px-4 py-3 text-xs font-semibold cursor-pointer underline underline-offset-4"
                  >
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                    <span>طلب استشارة أو معاينة خاصة</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsAdminOpen(true)}
                    className="hidden xl:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 text-xs font-bold transition-all cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>لوحة الإدارة</span>
                  </button>
                </div>
              </FadeIn>
            </div>

            {/* Left Column in RTL: Tag Badge */}
            <div className="flex items-end justify-start lg:justify-start mt-8 lg:mt-0">
              <FadeIn delay={1100} duration={800}>
                <div
                  id="hero-tag"
                  className="liquid-glass border border-white/20 px-6 py-3.5 rounded-2xl inline-flex flex-col gap-1 text-right"
                >
                  <span className="text-base sm:text-lg font-bold text-white tracking-tight">
                    وساطة • استثمار • تطوير عقاري
                  </span>
                  <span className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>سند طابو أخضر 2400 سهم • بيروت وجبل لبنان</span>
                  </span>
                </div>
              </FadeIn>
            </div>
          </div>

          {/* Subtle scroll cue */}
          <div className="mt-8 flex items-center justify-center">
            <button
              onClick={scrollToProperties}
              className="flex items-center gap-2 text-xs text-white/70 hover:text-white transition-colors cursor-pointer animate-bounce"
            >
              <span>تصفح العقارات حسب المنطقة والحي</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. GEOGRAPHIC EXPLORER SECTION (#regions) */}
      {/* ========================================================================= */}
      <section id="regions" className="w-full pt-20 pb-12 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-8 pb-6 border-b border-slate-200 dark:border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>التقسيم الجغرافي المعتمد لعقارات بيروت وخارجها</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
              اختر المنطقة الرئيسية لاستعراض أحيائها وعقاراتها
            </h2>
            <p className="text-sm text-slate-600 dark:text-neutral-400 mt-2 max-w-2xl leading-relaxed">
              تنقسم بيروت إلى 3 مناطق رئيسية تضم كافة الأحياء التاريخية والتجارية والسكنية، بالإضافة إلى خارج بيروت (الجبل ومناطق أخرى).
            </p>
          </div>

          <button
            onClick={() => handleMainRegionChange('all')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer shrink-0 ${
              mainRegionFilter === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-black border-transparent dark:border-white'
                : 'bg-white dark:bg-white/5 text-slate-700 dark:text-neutral-300 border-slate-300 dark:border-white/15 hover:border-amber-400'
            }`}
          >
            عرض جميع المناطق ({properties.length} عقار)
          </button>
        </div>

        {/* 4 Main Regions Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MAIN_REGIONS.map((region) => {
            const isSelected = mainRegionFilter === region.id;
            const count = getRegionCount(region.id);

            return (
              <div
                key={region.id}
                onClick={() => handleSelectMainRegionCard(region.id)}
                className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'bg-amber-500/10 dark:bg-neutral-800 border-amber-500 dark:border-amber-400 shadow-xl ring-2 ring-amber-400/40'
                    : 'bg-white dark:bg-neutral-900/60 border-slate-200 dark:border-white/10 hover:border-amber-400/50 hover:bg-slate-50 dark:hover:bg-neutral-900 shadow-sm'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{region.subDistricts.length} حي معتمد</span>
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-white font-bold">
                      {count} عقار
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white pt-1">{region.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                    {region.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-neutral-400">تصفية حسب هذه المنطقة</span>
                  <span className={`font-bold ${isSelected ? 'text-amber-600 dark:text-amber-400' : 'text-slate-700 dark:text-neutral-300'}`}>
                    {isSelected ? 'مفعلة حالياً ✓' : 'انقر للعرض ←'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. COMPREHENSIVE FILTER & PROPERTIES SECTION (#properties) */}
      {/* ========================================================================= */}
      <section id="properties" className="w-full pt-8 pb-24 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto">
        {/* Header with Title and Add Property Button */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-700 dark:text-neutral-300 text-xs font-semibold mb-2">
              <Building2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
              <span>محفظة العقارات المتاحة</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              العقارات المعروضة للبيع والإيجار
            </h2>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setIsVisitorCheckInOpen(true)}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black transition-colors text-xs sm:text-sm font-bold cursor-pointer shadow-md"
            >
              <UserCheck className="w-4 h-4" />
              <span>طلب استشارة أو معاينة عقار</span>
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* Comprehensive Filter Control Panel */}
        {/* ------------------------------------------------------------- */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-neutral-900/90 border border-slate-200 dark:border-white/15 backdrop-blur-md mb-8 space-y-5 shadow-xl">
          {/* Top Row: Search input + Region Selector + Sub-District Selector */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث باسم الحي، الشارع، أو المواصفات (مثال: الحمرا، فردان، مكتب، سند أخضر)..."
                className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-300 dark:border-white/15 rounded-xl pr-10 pl-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Main Region Dropdown */}
            <div className="md:col-span-4">
              <select
                value={mainRegionFilter}
                onChange={(e) => handleMainRegionChange(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-300 dark:border-white/15 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-400 cursor-pointer font-medium"
              >
                <option value="all">كافة المناطق الرئيسية (بيروت وخارجها)</option>
                {MAIN_REGIONS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sub-District Dropdown */}
            <div className="md:col-span-3">
              <select
                value={subDistrictFilter}
                onChange={(e) => setSubDistrictFilter(e.target.value)}
                className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-300 dark:border-white/15 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-400 cursor-pointer font-medium"
              >
                <option value="all">
                  {mainRegionFilter === 'all'
                    ? 'كافة الأحياء الفرعية'
                    : `جميع أحياء ${currentRegionDef?.name}`}
                </option>

                {mainRegionFilter !== 'all' && currentRegionDef
                  ? currentRegionDef.subDistricts.map((sub) => (
                      <option key={sub} value={sub}>
                        حي: {sub}
                      </option>
                    ))
                  : MAIN_REGIONS.flatMap((r) =>
                      r.subDistricts.map((sub) => (
                        <option key={`${r.id}-${sub}`} value={sub}>
                          {r.name} • {sub}
                        </option>
                      ))
                    )}
              </select>
            </div>
          </div>

          {/* Second Row: Listing Type (بيع / إيجار) + Property Type (سكني / تجاري) + Commercial Subtypes */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Listing Type: بيع / إيجار */}
            <div className="md:col-span-4 flex rounded-xl bg-slate-100 dark:bg-neutral-950 p-1 border border-slate-200 dark:border-white/15">
              <button
                type="button"
                onClick={() => setListingFilter('all')}
                className={`flex-1 py-1.5 text-xs rounded-lg font-bold transition-colors cursor-pointer ${
                  listingFilter === 'all'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-black shadow-sm'
                    : 'text-slate-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                }`}
              >
                كافة الإعلانات
              </button>
              <button
                type="button"
                onClick={() => setListingFilter('sale')}
                className={`flex-1 py-1.5 text-xs rounded-lg font-bold transition-colors cursor-pointer ${
                  listingFilter === 'sale'
                    ? 'bg-amber-400 text-black shadow-sm'
                    : 'text-slate-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                }`}
              >
                بيع
              </button>
              <button
                type="button"
                onClick={() => setListingFilter('rent')}
                className={`flex-1 py-1.5 text-xs rounded-lg font-bold transition-colors cursor-pointer ${
                  listingFilter === 'rent'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                }`}
              >
                إيجار
              </button>
            </div>

            {/* Property Category: شقق سكنية / عقار تجاري */}
            <div className="md:col-span-4 flex rounded-xl bg-slate-100 dark:bg-neutral-950 p-1 border border-slate-200 dark:border-white/15">
              <button
                type="button"
                onClick={() => {
                  setCategoryFilter('all');
                  setCommercialSubTypeFilter('all');
                }}
                className={`flex-1 py-1.5 text-xs rounded-lg font-bold transition-colors cursor-pointer ${
                  categoryFilter === 'all'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-black shadow-sm'
                    : 'text-slate-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                }`}
              >
                كل الأنواع
              </button>
              <button
                type="button"
                onClick={() => {
                  setCategoryFilter('residential');
                  setCommercialSubTypeFilter('all');
                }}
                className={`flex-1 py-1.5 text-xs rounded-lg font-bold transition-colors cursor-pointer ${
                  categoryFilter === 'residential'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-black shadow-sm'
                    : 'text-slate-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                }`}
              >
                شقق سكنية
              </button>
              <button
                type="button"
                onClick={() => setCategoryFilter('commercial')}
                className={`flex-1 py-1.5 text-xs rounded-lg font-bold transition-colors cursor-pointer ${
                  categoryFilter === 'commercial'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-black shadow-sm'
                    : 'text-slate-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                }`}
              >
                عقار تجاري
              </button>
            </div>

            {/* Commercial Subtype Pills (محل، مستودع، مكتب) */}
            <div className="md:col-span-4">
              {categoryFilter === 'commercial' ? (
                <div className="flex rounded-xl bg-slate-100 dark:bg-neutral-950 p-1 border border-amber-500/40">
                  <button
                    type="button"
                    onClick={() => setCommercialSubTypeFilter('all')}
                    className={`flex-1 py-1.5 text-[11px] rounded-lg font-bold transition-colors cursor-pointer ${
                      commercialSubTypeFilter === 'all'
                        ? 'bg-amber-400 text-black shadow-sm'
                        : 'text-slate-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    كل التجاري
                  </button>
                  <button
                    type="button"
                    onClick={() => setCommercialSubTypeFilter('shop')}
                    className={`flex-1 py-1.5 text-[11px] rounded-lg font-bold transition-colors cursor-pointer ${
                      commercialSubTypeFilter === 'shop'
                        ? 'bg-amber-400 text-black shadow-sm'
                        : 'text-slate-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    محل
                  </button>
                  <button
                    type="button"
                    onClick={() => setCommercialSubTypeFilter('warehouse')}
                    className={`flex-1 py-1.5 text-[11px] rounded-lg font-bold transition-colors cursor-pointer ${
                      commercialSubTypeFilter === 'warehouse'
                        ? 'bg-amber-400 text-black shadow-sm'
                        : 'text-slate-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    مستودع
                  </button>
                  <button
                    type="button"
                    onClick={() => setCommercialSubTypeFilter('office')}
                    className={`flex-1 py-1.5 text-[11px] rounded-lg font-bold transition-colors cursor-pointer ${
                      commercialSubTypeFilter === 'office'
                        ? 'bg-amber-400 text-black shadow-sm'
                        : 'text-slate-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    مكتب
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4 px-2 text-xs text-slate-600 dark:text-neutral-400">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={greenDeedOnly}
                      onChange={(e) => setGreenDeedOnly(e.target.checked)}
                      className="rounded border-slate-300 dark:border-white/20 bg-slate-50 dark:bg-neutral-950 text-emerald-500 focus:ring-0 w-4 h-4 cursor-pointer"
                    />
                    <ShieldCheck className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                    <span>سند أخضر 2400</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={electricityOnly}
                      onChange={(e) => setElectricityOnly(e.target.checked)}
                      className="rounded border-slate-300 dark:border-white/20 bg-slate-50 dark:bg-neutral-950 text-amber-500 focus:ring-0 w-4 h-4 cursor-pointer"
                    />
                    <span className="text-amber-500">⚡</span>
                    <span>كهرباء 24/24</span>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Third Row: Sub-District Chips for Quick Filtering */}
          {mainRegionFilter !== 'all' && currentRegionDef && (
            <div className="pt-3 border-t border-slate-200 dark:border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-neutral-400">
                <span className="font-semibold text-slate-800 dark:text-neutral-300">
                  الأحياء التابعة لـ {currentRegionDef.name}: (اضغط على الحي للتصفية المباشرة)
                </span>
                {subDistrictFilter !== 'all' && (
                  <button
                    type="button"
                    onClick={() => setSubDistrictFilter('all')}
                    className="text-amber-600 dark:text-amber-400 hover:underline cursor-pointer font-bold"
                  >
                    إلغاء حصر الحي والرجوع لكافة أحياء {currentRegionDef.name}
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
                <button
                  type="button"
                  onClick={() => setSubDistrictFilter('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    subDistrictFilter === 'all'
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-black'
                      : 'bg-slate-100 dark:bg-neutral-950 text-slate-700 dark:text-neutral-300 hover:bg-slate-200 dark:hover:bg-neutral-800 border border-slate-200 dark:border-white/10'
                  }`}
                >
                  جميع أحياء المنطقة
                </button>

                {currentRegionDef.subDistricts.map((sub) => {
                  const isSelected = subDistrictFilter === sub;
                  return (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => handleSelectSubDistrictChip(sub)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                        isSelected
                          ? 'bg-amber-400 text-black font-bold shadow-sm'
                          : 'bg-slate-100 dark:bg-neutral-950 text-slate-700 dark:text-neutral-300 hover:bg-slate-200 dark:hover:bg-neutral-800 border border-slate-200 dark:border-white/10'
                      }`}
                    >
                      <MapPin className="w-3 h-3 text-neutral-400" />
                      <span>{sub}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bottom Summary Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-white/10 text-xs text-slate-500 dark:text-neutral-400">
            <div className="flex items-center gap-3">
              <span className="font-bold text-slate-900 dark:text-white">
                تم العثور على {filteredProperties.length} عقاراً مطابقاً
              </span>
              {(mainRegionFilter !== 'all' ||
                subDistrictFilter !== 'all' ||
                listingFilter !== 'all' ||
                categoryFilter !== 'all' ||
                commercialSubTypeFilter !== 'all' ||
                greenDeedOnly ||
                electricityOnly ||
                searchQuery.trim() !== '') && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="flex items-center gap-1 text-amber-600 dark:text-amber-400 hover:underline cursor-pointer font-bold"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>إعادة ضبط جميع الفلاتر</span>
                </button>
              )}
            </div>

            <div className="text-slate-500 dark:text-neutral-400">
              {mainRegionFilter !== 'all' && (
                <span>
                  المنطقة: {currentRegionDef?.name}
                  {subDistrictFilter !== 'all' ? ` / حي ${subDistrictFilter}` : ''}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* Properties Grid */}
        {/* ------------------------------------------------------------- */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((prop) => (
              <PropertyCard
                key={prop.id}
                property={prop}
                onSelect={(p) => setSelectedProperty(p)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-neutral-900/40 rounded-3xl border border-slate-200 dark:border-white/10 space-y-4 max-w-2xl mx-auto shadow-sm">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center mx-auto text-slate-500 dark:text-neutral-400">
              <Filter className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              لم نعثر على عقارات مطابقة لمعايير البحث الحالية
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 max-w-md mx-auto leading-relaxed">
              جرّب تغيير المنطقة أو الحي الفرعي، أو تصفح كافة الإعلانات (بيع وإيجار). يمكنك أيضاً طلب مواصفات خاصة مباشرة من مكتبنا.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 rounded-xl bg-amber-400 text-black font-bold text-xs hover:bg-amber-300 transition-colors cursor-pointer"
              >
                إعادة ضبط عوامل التصفية
              </button>
              <button
                onClick={() => setIsChatOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-neutral-800 text-white font-semibold text-xs hover:bg-slate-800 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
              >
                اسأل المستشار الذكي عن هذا العقار
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 4. INVESTING SECTION (#investing) */}
      {/* ========================================================================= */}
      <section id="investing" className="w-full py-24 bg-slate-100 dark:bg-neutral-950 border-t border-b border-slate-200 dark:border-white/10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 space-y-12">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>الاستثمار العقاري والعوائد النقدية</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                عوائد كاش بالدولار الفريش وأمان استثماري
              </h2>
              <p className="text-sm text-slate-600 dark:text-neutral-400 mt-2 max-w-2xl leading-relaxed">
                يتميز السوق العقاري في بيروت بارتفاع الطلب على الشقق المؤثثة والمكاتب التجارية بالدولار الفريش، مع نسب عوائد صافية تتراوح بين 7% و10% سنوياً.
              </p>
            </div>

            <button
              onClick={() => setIsChatOpen(true)}
              className="shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-black hover:bg-slate-800 dark:hover:bg-neutral-200 transition-colors text-sm font-bold cursor-pointer shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>استشر ذكاء نصار الاستثماري</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900/60 border border-slate-200 dark:border-white/10 space-y-3 shadow-sm">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">7% - 10%</div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                عائد إيجاري نقدي بالدولار الفريش
              </h4>
              <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed">
                للشقق المفروشة في الحمرا، الروشة، وفردان، والمكاتب في كليمنصو وبدارو المستأجرة من شركات ومنظمات دولية ودبلوماسيين.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900/60 border border-slate-200 dark:border-white/10 space-y-3 shadow-sm">
              <div className="text-3xl font-bold text-slate-900 dark:text-white">2400 / 2400</div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                ملكية حرة تامة بسند أخضر مفرز
              </h4>
              <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed">
                كافة عقاراتنا المعروضة تخضع للفحص المسبق في أمانة السجل العقاري لضمان خلوها من أي ديون أو شوائب قانونية.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900/60 border border-slate-200 dark:border-white/10 space-y-3 shadow-sm">
              <div className="text-3xl font-bold text-amber-600 dark:text-amber-400" dir="ltr">+961 76 743 414</div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                إدارة وتأجير العقار للمغتربين
              </h4>
              <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed">
                يتولى مكتب م. نصار العقارية فحص المستأجرين، توثيق العقود، وتحصيل الإيجار وتحويله لحسابكم المصرفي مباشرة.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. BUILDING & DEVELOPMENTS SECTION (#building) */}
      {/* ========================================================================= */}
      <section id="building" className="w-full py-24 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-neutral-300 text-xs font-bold mb-2">
              <Building2 className="w-3.5 h-3.5 text-amber-500" />
              <span>الإنشاءات والمشاريع العقارية</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
              مشاريع إنشائية وإشراف هندسي وتطوير
            </h2>
            <p className="text-sm text-slate-600 dark:text-neutral-400 mt-2 max-w-2xl leading-relaxed">
              من الأراضي والمباني التجارية إلى الشقق الفاخرة والفيلات الجبلية المستقلة بالحجر الطبيعي اللبناني.
            </p>
          </div>

          <a
            href="https://wa.me/96176743414?text=السلام%20عليكم%20م.%20نصار%20العقارية،%20أرغب%20في%20استشارة%20هندسية%20أو%20تطوير%20عقاري"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 dark:bg-white/10 hover:bg-slate-800 dark:hover:bg-white/20 border border-transparent dark:border-white/15 text-white transition-colors text-xs sm:text-sm font-semibold shadow-sm"
          >
            <Phone className="w-4 h-4 text-emerald-400" />
            <span>طلب استشارة هندسية ميدانية</span>
          </a>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group rounded-2xl overflow-hidden bg-white dark:bg-neutral-900 border border-slate-200 dark:border-white/10 flex flex-col shadow-sm hover:shadow-lg transition-all">
            <div className="aspect-[16/10] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop"
                alt="تطوير ورخص الأراضي"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-6 space-y-2">
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">تطوير الأراضي والرخص</h4>
              <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed">
                دراسة نسب الاستثمار السطحي والعام، استخراج رخص البناء، وإفراز العقارات لدى الدوائر الفنية ونقابة المهندسين.
              </p>
            </div>
          </div>

          <div className="group rounded-2xl overflow-hidden bg-white dark:bg-neutral-900 border border-slate-200 dark:border-white/10 flex flex-col shadow-sm hover:shadow-lg transition-all">
            <div className="aspect-[16/10] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop"
                alt="تشطيبات فاخرة وتجديد التراث"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-6 space-y-2">
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">تشطيبات فاخرة وتجديد التراث</h4>
              <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed">
                ترميم المباني والشقق التراثية في الأشرفية وبيروت مع تحديث أنظمة الطاقة الشمسية والعزل وتجهيزات المولدات.
              </p>
            </div>
          </div>

          <div className="group rounded-2xl overflow-hidden bg-white dark:bg-neutral-900 border border-slate-200 dark:border-white/10 flex flex-col shadow-sm hover:shadow-lg transition-all">
            <div className="aspect-[16/10] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop"
                alt="فيلات جبلية خاصة"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-6 space-y-2">
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">فيلات جبلية وسكنية خاصة</h4>
              <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed">
                تصميم وتنفيذ قصور وفيلات في المتن وكسروان والشوف بالحجر اللبناني الطبيعي والمسابح الخاصة المستقلة.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. ADVISORY & AI VALUATION SECTION (#advisory, #valuation) */}
      {/* ========================================================================= */}
      <section id="valuation" className="w-full py-24 bg-slate-100 dark:bg-neutral-950 border-t border-b border-slate-200 dark:border-white/10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 space-y-16">
          {/* AI Valuation Tool */}
          <ValuationTool />

          {/* Legal Advisory & Cadastral Guide */}
          <AdvisorySection onOpenChat={() => setIsChatOpen(true)} />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. STORY & ABOUT SECTION (#story) */}
      {/* ========================================================================= */}
      <section id="story" className="w-full py-24 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-neutral-300 text-xs font-bold">
              <span>عن م. نصار العقارية</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
              ثقة راسخة في قلب بيروت وجبل لبنان
            </h2>
            <p className="text-sm text-slate-600 dark:text-neutral-300 leading-relaxed">
              تأسست م. نصار العقارية انطلاقاً من مبدأ راسخ: تقديم وساطة واستشارات عقارية شفافة وموثوقة بنسبة 100%، تجمع بين الفهم العميق لخصوصية السوق اللبناني والتمسك الصارم بسلامة السندات والوثائق القانونية.
            </p>
            <p className="text-sm text-slate-600 dark:text-neutral-300 leading-relaxed">
              سواء كنت تبحث عن شقة عائلية في تلة الخياط أو قريطم، أو مكتب تجاري في كليمنصو وبدارو، أو محل في بربور وبشارة الخوري، أو مستودع في وطى المصيطبة، أو فيلا في الجبل، فإننا نرافقك في كل خطوة حتى تسليم المفاتيح وتسجيل سندك الأخضر.
            </p>

            <div className="pt-4 flex flex-wrap gap-4 items-center">
              <a
                href="tel:+96176743414"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-black font-bold hover:bg-slate-800 dark:hover:bg-neutral-200 transition-colors text-sm cursor-pointer shadow-md"
              >
                <Phone className="w-4 h-4 text-emerald-400 dark:text-black" />
                <span dir="ltr">+961 76 743 414</span>
              </a>

              <a
                href="https://wa.me/96176743414?text=السلام%20عليكم%20م.%20نصار%20العقارية"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors text-sm shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>محادثة واتساب مباشرة</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop"
                alt="بيروت العقارية"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-8">
                <div className="text-xl font-bold text-white mb-1">
                  م. نصار العقارية • بيروت
                </div>
                <div className="text-xs text-neutral-300 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>بيروت، لبنان • هاتف: <span dir="ltr">+961 76 743 414</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. FOOTER */}
      {/* ========================================================================= */}
      <Footer
        onOpenChat={() => setIsChatOpen(true)}
        onSelectRegion={(rId) => handleSelectMainRegionCard(rId as MainRegionId)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenVisitorCheckIn={() => setIsVisitorCheckInOpen(true)}
      />

      {/* ========================================================================= */}
      {/* 9. FLOATING ACTION BUTTONS */}
      {/* ========================================================================= */}
      {/* Official Floating WhatsApp Button (Fixed on side/corner) */}
      <FloatingWhatsAppButton />

      {/* Floating AI Chat Advisor Trigger (Positioned on the other corner) */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={() => setIsChatOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-slate-900/95 dark:bg-neutral-900/95 hover:bg-slate-900 dark:hover:bg-neutral-900 border border-slate-700/50 dark:border-white/20 text-white shadow-2xl backdrop-blur-md transition-all cursor-pointer hover:scale-105"
          title="فتح المستشار العقاري الذكي"
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-emerald-500 to-amber-500 flex items-center justify-center text-white">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold pl-1">المستشار الذكي</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 10. MODALS & DRAWERS */}
      {/* ========================================================================= */}
      <ChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />

      <PropertyModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
      />

      <AdminCMSModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        properties={properties}
        onUpdateProperties={handleUpdateProperties}
        onResetProperties={handleResetProperties}
      />

      <VisitorCheckInModal
        isOpen={isVisitorCheckInOpen}
        onClose={() => setIsVisitorCheckInOpen(false)}
      />

      {/* Wishlist Saved Properties Modal */}
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        properties={properties}
        onSelectProperty={(prop) => setSelectedProperty(prop)}
      />

      {/* Real-time Alerts & Notifications Dropdown */}
      <NotificationsDropdown
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        properties={properties}
        onSelectProperty={(propId) => {
          const prop = properties.find((p) => p.id === propId);
          if (prop) setSelectedProperty(prop);
        }}
      />
    </div>
  );
}
