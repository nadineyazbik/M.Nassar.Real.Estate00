import React from 'react';
import { Bed, Bath, Square, MapPin, Zap, ShieldCheck, ArrowLeft, Building, Store, Warehouse, Heart } from 'lucide-react';
import { Property } from '../types';
import { useWishlist } from '../context/WishlistContext';

interface PropertyCardProps {
  property: Property;
  onSelect: (prop: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onSelect }) => {
  const { isFavorite, toggleFavorite } = useWishlist();
  const favorited = isFavorite(property.id);

  const getCategoryLabel = () => {
    if (property.category === 'residential') {
      return 'شقة سكنية';
    }
    if (property.commercialType === 'shop') return 'تجاري • محل';
    if (property.commercialType === 'warehouse') return 'تجاري • مستودع';
    if (property.commercialType === 'office') return 'تجاري • مكتب';
    return 'عقار تجاري';
  };

  const getCommercialIcon = () => {
    if (property.commercialType === 'shop') return <Store className="w-3.5 h-3.5" />;
    if (property.commercialType === 'warehouse') return <Warehouse className="w-3.5 h-3.5" />;
    return <Building className="w-3.5 h-3.5" />;
  };

  return (
    <div
      onClick={() => onSelect(property)}
      className="group bg-white dark:bg-neutral-900/80 hover:bg-slate-50 dark:hover:bg-neutral-900 border border-slate-200 dark:border-white/10 hover:border-amber-400/50 dark:hover:border-white/25 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col cursor-pointer shadow-md hover:shadow-2xl text-right"
      dir="rtl"
    >
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-neutral-950">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 right-3 flex flex-wrap gap-2 z-10">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md shadow-md ${
              property.listingType === 'sale'
                ? 'bg-black/75 text-white border border-white/20'
                : 'bg-emerald-900/80 text-emerald-200 border border-emerald-500/40'
            }`}
          >
            {property.listingType === 'sale' ? 'للبيع' : 'للإيجار'}
          </span>

          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-900/80 text-neutral-200 border border-white/20 backdrop-blur-md flex items-center gap-1.5">
            {property.category === 'commercial' ? getCommercialIcon() : <Building className="w-3.5 h-3.5 text-amber-400" />}
            <span>{getCategoryLabel()}</span>
          </span>
        </div>

        {/* Top Left Badges & Heart Button */}
        <div className="absolute top-3 left-3 flex items-start gap-2 z-20">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(property.id);
            }}
            title={favorited ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
            className={`p-2 rounded-xl backdrop-blur-md transition-all duration-200 cursor-pointer shadow-md hover:scale-110 active:scale-95 ${
              favorited
                ? 'bg-rose-600/90 text-white border border-rose-400/50 shadow-rose-900/40'
                : 'bg-black/60 hover:bg-black/80 text-white/80 hover:text-white border border-white/20'
            }`}
          >
            <Heart
              className={`w-4 h-4 transition-transform ${
                favorited ? 'fill-white text-white scale-110' : ''
              }`}
            />
          </button>

          <div className="flex flex-col gap-1.5 items-end">
            {property.hasGreenDeed && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 backdrop-blur-md flex items-center gap-1 shadow">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>سند أخضر 2400</span>
              </span>
            )}

            {property.electricity24_7 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-black/70 text-amber-300 border border-amber-500/30 backdrop-blur-md flex items-center gap-1 shadow">
                <Zap className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                <span>كهرباء 24/24</span>
              </span>
            )}
          </div>
        </div>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-black/85 backdrop-blur-md border border-white/20 text-white z-10">
          <div className="text-base font-bold tracking-tight">
            ${property.price.toLocaleString()}
            {property.listingType === 'rent' && (
              <span className="text-xs font-normal text-neutral-300 mr-1">
                / شهرياً
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Main region & Sub-district */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 mb-2">
            <MapPin className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0" />
            <span className="font-semibold text-slate-700 dark:text-neutral-300">{property.mainRegionName}</span>
            <span className="text-neutral-400 dark:text-neutral-500">•</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-bold">{property.subDistrict}</span>
          </div>

          <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug">
            {property.title}
          </h4>

          {property.streetOrDetails && (
            <p className="text-xs text-slate-500 dark:text-neutral-400 line-clamp-1 mt-1">
              {property.streetOrDetails}
            </p>
          )}
        </div>

        <div>
          {/* Key Specs */}
          <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs text-slate-500 dark:text-neutral-400">
            <div className="flex items-center gap-1">
              <Square className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500" />
              <span className="font-bold text-slate-900 dark:text-white">{property.areaSqM}</span>
              <span>م²</span>
            </div>

            {property.bedrooms !== undefined && property.bedrooms > 0 && (
              <div className="flex items-center gap-1">
                <Bed className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500" />
                <span className="font-bold text-slate-900 dark:text-white">{property.bedrooms}</span>
                <span>نوم</span>
              </div>
            )}

            {property.bathrooms !== undefined && property.bathrooms > 0 && (
              <div className="flex items-center gap-1">
                <Bath className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500" />
                <span className="font-bold text-slate-900 dark:text-white">{property.bathrooms}</span>
                <span>حمام</span>
              </div>
            )}

            <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-300 group-hover:text-amber-700 dark:group-hover:text-white font-bold transition-colors">
              <span>التفاصيل</span>
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
