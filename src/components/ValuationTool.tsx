import React, { useState } from 'react';
import { Sparkles, Calculator, CheckCircle2, Phone, ArrowLeft, Building2 } from 'lucide-react';
import { MAIN_REGIONS } from '../data/regions';
import { ValuationFormState, MainRegionId, ListingType, PropertyCategory, CommercialSubType } from '../types';

export const ValuationTool: React.FC = () => {
  const [formData, setFormData] = useState<ValuationFormState>({
    propertyTitle: 'شقة سكنية في بيروت',
    mainRegion: 'ras_beirut',
    subDistrict: 'الحمرا',
    listingType: 'sale',
    category: 'residential',
    commercialType: 'office',
    price: 320000,
    areaSqM: 180,
    bedrooms: 3,
    bathrooms: 2,
    description: 'سند أخضر 2400 سهم، اشتراك كهرباء ومولد، موقفان تحت الأرض، بناية حديثة.',
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const currentRegionDef = MAIN_REGIONS.find((r) => r.id === formData.mainRegion) || MAIN_REGIONS[0];

  const handleRegionChange = (newRegionId: MainRegionId) => {
    const target = MAIN_REGIONS.find((r) => r.id === newRegionId);
    setFormData({
      ...formData,
      mainRegion: newRegionId,
      subDistrict: target?.subDistricts[0] || '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const typeLabel = formData.listingType === 'sale' ? 'بيع' : 'إيجار';
    const catLabel =
      formData.category === 'residential'
        ? 'شقة سكنية'
        : `عقار تجاري (${formData.commercialType === 'shop' ? 'محل' : formData.commercialType === 'warehouse' ? 'مستودع' : 'مكتب'})`;

    const payload = {
      propertyTitle: formData.propertyTitle,
      location: `${currentRegionDef.name} - حي ${formData.subDistrict}`,
      price: formData.price,
      propertyType: `${catLabel} - ${typeLabel}`,
      areaSqM: formData.areaSqM,
      bedrooms: formData.bedrooms,
      bathrooms: formData.bathrooms,
      description: formData.description,
    };

    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setResult(data.evaluation || 'تم إتمام التقييم بنجاح.');
    } catch (err) {
      console.error(err);
      setResult(
        'تعذر الاتصال بخادم التقييم. يمكنك التواصل المباشر مع مكتب م. نصار العقارية على +961 76 743 414 لمعاينة العقار وتثمينه رسمياً.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full rounded-3xl bg-neutral-900/90 border border-white/10 p-6 md:p-8 backdrop-blur-md text-right" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>نظام التثمين العقاري الذكي بالذكاء الاصطناعي</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            قيّم عقارك أو استثمارك في بيروت ولبنان فوراً
          </h3>
          <p className="text-sm text-neutral-400 mt-1">
            تحليل فوري لمتوسط سعر المتر المربع، العائد الإيجاري المتوقع بالدولار الفريش، والتوصيات القانونية للسند الأخضر.
          </p>
        </div>

        <a
          href="https://wa.me/96176743414?text=Hello%20M.Nassar%20Real%20Estate,%20I%20want%20to%20appraise%20my%20property"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold transition-all"
        >
          <Phone className="w-4 h-4 text-emerald-400" />
          <span dir="ltr">+961 76 743 414</span>
          <ArrowLeft className="w-3.5 h-3.5 text-neutral-400" />
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Column */}
        <form onSubmit={handleSubmit} className="lg:col-span-6 space-y-4">
          {/* Main Region and Sub-district */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-neutral-300 font-semibold mb-1.5">
                المنطقة الرئيسية
              </label>
              <select
                value={formData.mainRegion}
                onChange={(e) => handleRegionChange(e.target.value as MainRegionId)}
                className="w-full bg-neutral-950 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                {MAIN_REGIONS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-neutral-300 font-semibold mb-1.5">
                الحي الفرعي
              </label>
              <select
                value={formData.subDistrict}
                onChange={(e) => setFormData({ ...formData, subDistrict: e.target.value })}
                className="w-full bg-neutral-950 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                {currentRegionDef.subDistricts.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Listing Type & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-neutral-300 font-semibold mb-1.5">
                نوع الإعلان
              </label>
              <select
                value={formData.listingType}
                onChange={(e) => setFormData({ ...formData, listingType: e.target.value as ListingType })}
                className="w-full bg-neutral-950 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="sale">بيع</option>
                <option value="rent">إيجار</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-neutral-300 font-semibold mb-1.5">
                نوع العقار
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as PropertyCategory })}
                className="w-full bg-neutral-950 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="residential">شقق سكنية</option>
                <option value="commercial">عقار تجاري</option>
              </select>
            </div>
          </div>

          {formData.category === 'commercial' && (
            <div>
              <label className="block text-xs text-neutral-300 font-semibold mb-1.5">
                تفرع العقار التجاري
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['shop', 'warehouse', 'office'] as CommercialSubType[]).map((subType) => (
                  <button
                    key={subType}
                    type="button"
                    onClick={() => setFormData({ ...formData, commercialType: subType })}
                    className={`py-2 text-xs rounded-xl font-semibold border transition-colors cursor-pointer ${
                      formData.commercialType === subType
                        ? 'bg-amber-400 text-black border-amber-400'
                        : 'bg-neutral-950 text-neutral-300 border-white/15 hover:border-white/30'
                    }`}
                  >
                    {subType === 'shop' ? 'محل' : subType === 'warehouse' ? 'مستودع' : 'مكتب'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-neutral-300 font-semibold mb-1.5">
                السعر التقديري ($)
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) || '' })}
                placeholder="مثال: 320000"
                className="w-full bg-neutral-950 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-neutral-300 font-semibold mb-1.5">
                المساحة (م²)
              </label>
              <input
                type="number"
                value={formData.areaSqM}
                onChange={(e) => setFormData({ ...formData, areaSqM: Number(e.target.value) || '' })}
                placeholder="مثال: 180"
                className="w-full bg-neutral-950 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-neutral-300 font-semibold mb-1.5">
                الغرف / الحمامات
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <input
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) || '' })}
                  placeholder="نوم"
                  title="عدد غرف النوم"
                  className="bg-neutral-950 border border-white/15 rounded-xl px-2 py-2.5 text-sm text-white text-center focus:outline-none focus:border-amber-400"
                />
                <input
                  type="number"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) || '' })}
                  placeholder="حمام"
                  title="عدد الحمامات"
                  className="bg-neutral-950 border border-white/15 rounded-xl px-2 py-2.5 text-sm text-white text-center focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs text-neutral-300 font-semibold mb-1.5">
              مواصفات إضافية (سند أخضر، طابق، مصعد، كهرباء 24/24...)
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="مثال: سند مفرز 2400 سهم، اشتراك مولد، مواقف تحت الأرض..."
              className="w-full bg-neutral-950 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg text-sm"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                <span>جاري معالجة التقييم الاستثماري...</span>
              </>
            ) : (
              <>
                <Calculator className="w-4 h-4" />
                <span>إجراء تقييم استثماري فوري بـ</span>
              </>
            )}
          </button>
        </form>

        {/* Output Column */}
        <div className="lg:col-span-6 bg-neutral-950 rounded-2xl border border-white/10 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
              <span className="text-xs font-bold text-neutral-300">
                تقرير التثمين والاستثمار العقاري الصادر
              </span>
              {result && (
                <span className="text-xs text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>اكتمل التقييم</span>
                </span>
              )}
            </div>

            {result ? (
              <div className="text-sm text-neutral-200 leading-relaxed whitespace-pre-line space-y-2 max-h-[360px] overflow-y-auto pr-1">
                {result}
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center text-neutral-500 space-y-3">
                <Sparkles className="w-8 h-8 text-neutral-600 animate-pulse" />
                <p className="text-sm max-w-sm">
                  أدخل بيانات العقار وحدد المنطقة والحي واضغط على &quot;إجراء تقييم استثماري فوري&quot; لعرض دراسة مقارنة ومردود الإيجار المتوقع.
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
            <span>المرجع: م. نصار العقارية • بيروت</span>
            <a
              href="https://wa.me/96176743414?text=Hello,%20I%20have%20an%20evaluation%20inquiry"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>مراجعة الخبير الميداني</span>
              <ArrowLeft className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
