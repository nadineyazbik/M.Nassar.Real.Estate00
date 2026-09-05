import React, { useState, useEffect } from 'react';
import { X, Bed, Bath, Square, Car, ShieldCheck, Zap, Phone, MessageCircle, Share2, Check, MapPin, Building, Store, Warehouse, Layers, Heart } from 'lucide-react';
import { Property } from '../types';
import { useWishlist } from '../context/WishlistContext';

interface PropertyModalProps {
  property: Property | null;
  onClose: () => void;
}

export const PropertyModal: React.FC<PropertyModalProps> = ({ property, onClose }) => {
  if (!property) return null;

  const { isFavorite, toggleFavorite } = useWishlist();
  const favorited = isFavorite(property.id);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  // Close on ESC key & prevent body background scroll
  useEffect(() => {
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
  }, [onClose]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCategoryText = () => {
    if (property.category === 'residential') return 'شقة سكنية';
    if (property.commercialType === 'shop') return 'عقار تجاري • محل';
    if (property.commercialType === 'warehouse') return 'عقار تجاري • مستودع';
    if (property.commercialType === 'office') return 'عقار تجاري • مكتب';
    return 'عقار تجاري';
  };

  const whatsappMessage = encodeURIComponent(
    `السلام عليكم م. نصار العقارية، أنا مهتم بالعقار التالي المعروض على موقعكم:\n- العنوان: ${property.title}\n- المنطقة: ${property.mainRegionName} - ${property.subDistrict}\n- السعر: $${property.price.toLocaleString()} (${property.listingType === 'sale' ? 'بيع' : 'إيجار'})\nيرجى تزويدي بمزيد من التفاصيل أو تحديد موعد للمعاينة الميدانية.`
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
      dir="rtl"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-neutral-950 border border-white/20 rounded-3xl overflow-hidden shadow-2xl my-6 text-white max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Prominent Top-Right Close Button with text and icon */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-30 flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-black/80 hover:bg-rose-600 text-white border border-white/30 backdrop-blur-md shadow-2xl transition-all duration-200 cursor-pointer font-bold text-xs group select-none"
          aria-label="إغلاق تفاصيل العقار"
        >
          <X className="w-4 h-4 transition-transform group-hover:rotate-90" />
          <span>إغلاق</span>
        </button>

        {/* Top-Left Circular Close Button for quick tap */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 left-4 z-30 p-2.5 rounded-full bg-black/80 hover:bg-rose-600 text-white border border-white/30 backdrop-blur-md shadow-2xl transition-all duration-200 cursor-pointer select-none"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gallery */}
        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] bg-neutral-900 overflow-hidden">
          <img
            src={property.images[activeImageIndex]}
            alt={property.title}
            className="w-full h-full object-cover transition-all duration-300"
          />

          {/* Image Navigation Dots / Thumbnails */}
          {property.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 z-10">
              {property.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIndex(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                    i === activeImageIndex ? 'w-6 bg-amber-400' : 'bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`عرض الصورة ${i + 1}`}
                />
              ))}
            </div>
          )}

          {/* Badges on Gallery */}
          <div className="absolute top-4 right-4 flex flex-wrap gap-2 z-10">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/80 backdrop-blur-md text-white border border-white/25">
              {property.listingType === 'sale' ? 'معروض للبيع' : 'معروض للإيجار'}
            </span>

            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-neutral-900/85 backdrop-blur-md text-amber-300 border border-amber-500/30">
              {getCategoryText()}
            </span>

            {property.hasGreenDeed && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 backdrop-blur-md flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>طابو أخضر 2400 سهم</span>
              </span>
            )}
          </div>
        </div>

        {/* Details Body */}
        <div className="p-5 sm:p-8 space-y-6">
          {/* Header Info */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span className="text-white font-medium">{property.mainRegionName}</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold text-sm">{property.subDistrict}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-snug">
                {property.title}
              </h2>
              {property.streetOrDetails && (
                <p className="text-xs text-neutral-400">{property.streetOrDetails}</p>
              )}
            </div>

            <div className="flex items-center gap-4 self-start md:self-auto">
              <div className="text-right">
                <div className="text-3xl font-bold text-white tracking-tight">
                  ${property.price.toLocaleString()}
                </div>
                <div className="text-xs text-neutral-400">
                  {property.listingType === 'rent' ? 'دولار كاش شهرياً' : 'دولار فريش كاش'}
                </div>
              </div>

              <button
                type="button"
                onClick={() => toggleFavorite(property.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                  favorited
                    ? 'bg-rose-600 text-white border-rose-500 shadow-lg shadow-rose-950/50'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
                }`}
                title={favorited ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
              >
                <Heart className={`w-4 h-4 ${favorited ? 'fill-white' : ''}`} />
                <span className="hidden sm:inline text-xs font-bold">
                  {favorited ? 'محفوظ بالمفضلة' : 'حفظ بالمفضلة'}
                </span>
              </button>

              <button
                onClick={handleShare}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors cursor-pointer"
                title="مشاركة رابط العقار"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 rounded-2xl bg-neutral-900/60 border border-white/10 text-center">
            <div className="space-y-1">
              <div className="flex items-center justify-center text-neutral-400">
                <Square className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-lg font-bold">{property.areaSqM} م²</div>
              <div className="text-[11px] text-neutral-400">المساحة الإجمالية</div>
            </div>

            {property.bedrooms !== undefined && (
              <div className="space-y-1">
                <div className="flex items-center justify-center text-neutral-400">
                  <Bed className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-lg font-bold">{property.bedrooms > 0 ? property.bedrooms : '-'}</div>
                <div className="text-[11px] text-neutral-400">غرف النوم</div>
              </div>
            )}

            {property.bathrooms !== undefined && (
              <div className="space-y-1">
                <div className="flex items-center justify-center text-neutral-400">
                  <Bath className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-lg font-bold">{property.bathrooms}</div>
                <div className="text-[11px] text-neutral-400">حمامات</div>
              </div>
            )}

            <div className="space-y-1">
              <div className="flex items-center justify-center text-neutral-400">
                <Car className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-lg font-bold">{property.parkingSpaces || 1}</div>
              <div className="text-[11px] text-neutral-400">مواقف السيارات</div>
            </div>

            {property.floor && (
              <div className="space-y-1 col-span-2 sm:col-span-1">
                <div className="flex items-center justify-center text-neutral-400">
                  <Layers className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-lg font-bold">{property.floor}</div>
                <div className="text-[11px] text-neutral-400">الطابق</div>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-neutral-400 mb-2">
              تفاصيل ومواصفات العقار
            </h4>
            <p className="text-neutral-200 text-sm leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Features Checklist */}
          {property.features && property.features.length > 0 && (
            <div>
              <h4 className="text-xs uppercase tracking-wider font-bold text-neutral-400 mb-3">
                المميزات والخدمات المشمولة
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {property.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-neutral-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions & WhatsApp Booking */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 self-start sm:self-auto">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center font-bold text-amber-300 text-sm">
                نصار
              </div>
              <div>
                <div className="text-sm font-bold text-white">م. نصار العقارية</div>
                <div className="text-xs text-neutral-400">
                  مكتب بيروت • <span dir="ltr">+961 76 743 414</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <a
                href="tel:+96176743414"
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-white/15 text-white text-sm font-medium transition-colors"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>اتصال مباشر</span>
              </a>

              <a
                href={`https://wa.me/96176743414?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-emerald-950/40"
              >
                <MessageCircle className="w-4 h-4" />
                <span>تواصل عبر واتساب</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
