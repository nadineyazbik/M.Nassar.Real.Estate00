import React, { useEffect } from 'react';
import {
  Heart,
  X,
  Trash2,
  ExternalLink,
  MapPin,
  MessageCircle,
  Building2,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { Property } from '../types';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  properties: Property[];
  onSelectProperty: (property: Property) => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  properties,
  onSelectProperty,
}) => {
  const { wishlistIds, removeFromWishlist, clearWishlist, count } = useWishlist();

  // Safe body scroll handling & Escape key listener
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

  if (!isOpen) return null;

  const favoriteProperties = properties.filter((p) => wishlistIds.includes(p.id));

  const formatPrice = (price: number, listingType: string) => {
    const formatted = new Intl.NumberFormat('en-US').format(price);
    return listingType === 'rent' ? `${formatted}$ / شهر` : `${formatted}$`;
  };

  const handleShareWishlist = () => {
    if (navigator.share) {
      navigator.share({
        title: 'عقاراتي المفضلة | م. نصار العقارية',
        text: `لقد قمت بحفظ ${count} عقار مميز على منصة م. نصار العقارية`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      alert('تم نسخ رابط المنصة للمشاركة بنجاح!');
    }
  };

  const handleWhatsAppProperty = (property: Property) => {
    const text = encodeURIComponent(
      `مرحباً م. نصار العقارية، أود الاستفسار عن عقاري المفضل على موقعكم:\n\n*${property.title}*\n📍 المنطقة: ${property.subDistrict}\n💰 السعر: ${formatPrice(property.price, property.listingType)}\n\nيرجى تزويدي بمزيد من التفاصيل وترتيب موعد للمعاينة.`
    );
    window.open(`https://wa.me/96176743414?text=${text}`, '_blank');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md"
      dir="rtl"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] flex flex-col bg-neutral-900 border border-amber-400/30 rounded-3xl shadow-2xl overflow-hidden text-right animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 bg-gradient-to-r from-emerald-950/90 to-neutral-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400">
              <Heart className="w-6 h-6 fill-rose-500 text-rose-500" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                قائمة العقارات المفضلة
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold">
                  {count} {count === 1 ? 'عقار' : 'عقارات'}
                </span>
              </h2>
              <p className="text-xs text-neutral-400">العقارات التي قمت بحفظها للمقارنة والاستفسار السريع</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {count > 0 && (
              <button
                type="button"
                onClick={handleShareWishlist}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                title="مشاركة المفضلة"
              >
                <Share2 className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {favoriteProperties.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <Heart className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">قائمة المفضلة فارغة حالياً</h3>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                  تصفح شقق بيروت وعقاراتها التجارية واضغط على أيقونة القلب لحفظ أي عقار يعجبك هنا والرجوع إليه لاحقاً.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  const el = document.getElementById('properties');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-[#004d26] text-white text-xs font-bold hover:brightness-110 transition-all cursor-pointer shadow-lg"
              >
                <Building2 className="w-4 h-4 text-amber-300" />
                استكشف العقارات الآن
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {favoriteProperties.map((property) => (
                <div
                  key={property.id}
                  className="p-3 sm:p-4 rounded-2xl bg-black/40 border border-white/10 hover:border-amber-400/30 transition-all flex flex-col sm:flex-row items-center gap-4 group"
                >
                  {/* Image */}
                  <div className="relative w-full sm:w-36 h-28 rounded-xl overflow-hidden shrink-0">
                    <img
                      src={property.imageUrl}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-[10px] font-bold text-amber-300 border border-amber-400/30">
                      {property.listingType === 'sale' ? 'للبيع' : 'للإيجار'}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 w-full min-w-0 space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-bold text-white truncate group-hover:text-amber-300 transition-colors">
                        {property.title}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeFromWishlist(property.id)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0"
                        title="إزالة من المفضلة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-neutral-400">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{property.subDistrict}</span>
                      <span>•</span>
                      <span>{property.areaSqM} م²</span>
                      {property.category === 'residential' && property.bedrooms && (
                        <>
                          <span>•</span>
                          <span>{property.bedrooms} نوم</span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <div className="text-sm font-extrabold text-amber-300">
                        {formatPrice(property.price, property.listingType)}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            onSelectProperty(property);
                            onClose();
                          }}
                          className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>التفاصيل</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleWhatsAppProperty(property)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>استفسار</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        {count > 0 && (
          <div className="p-4 sm:p-5 bg-black/60 border-t border-white/10 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={clearWishlist}
              className="text-neutral-400 hover:text-rose-400 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>تفريغ قائمة المفضلة بالكامل</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const text = encodeURIComponent(
                  `مرحباً م. نصار العقارية، قمت بحفظ ${count} عقار في مفضلتي على الموقع وأود استشارتكم بشأنها.`
                );
                window.open(`https://wa.me/96176743414?text=${text}`, '_blank');
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-[#004d26] hover:brightness-110 text-white font-bold flex items-center gap-2 cursor-pointer shadow-md"
            >
              <MessageCircle className="w-4 h-4 text-emerald-200" />
              <span>إرسال القائمة لواتساب المكتب</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
