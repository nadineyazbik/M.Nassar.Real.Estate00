import React from 'react';
import { Building2, Phone, Mail, MapPin, ShieldCheck, MessageCircle, Lock, UserCheck } from 'lucide-react';
import { MAIN_REGIONS } from '../data/regions';
import { SocialLinks, SOCIAL_URLS } from './SocialLinks';
import { QRCodeSection } from './QRCodeSection';

interface FooterProps {
  onOpenChat: () => void;
  onSelectRegion?: (regionId: string) => void;
  onOpenAdmin?: () => void;
  onOpenVisitorCheckIn?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenChat,
  onSelectRegion,
  onOpenAdmin,
  onOpenVisitorCheckIn,
}) => {
  return (
    <footer className="w-full border-t border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-black pt-16 pb-12 text-right text-neutral-900 dark:text-neutral-100 transition-colors duration-300" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 space-y-12">
        
        {/* Top: Official Social Media Integration Banner */}
        <div className="p-6 rounded-3xl bg-neutral-200/70 dark:bg-neutral-950 border border-neutral-300 dark:border-white/10 shadow-lg">
          <SocialLinks variant="footer" />
        </div>

        {/* Dedicated Clean QR Code Section */}
        <div>
          <QRCodeSection variant="card" />
        </div>

        {/* Middle Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1: Brand & Office */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.svg"
                alt="م. نصار العقارية"
                className="h-14 w-auto object-contain drop-shadow-md rounded-full"
              />
              <div>
                <h3 className="text-base font-black text-neutral-900 dark:text-white leading-tight">
                  م. نصار العقارية
                </h3>
                <p className="text-[11px] text-amber-600 dark:text-amber-400 font-bold">
                  وساطة • استثمار • تطوير عقاري
                </p>
              </div>
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-sm">
              المؤسسة العقارية الموثوقة في بيروت وجبل لبنان. متخصصة في بيع وتأجير الشقق السكنية الفاخرة والعقارات التجارية (محل، مستودع، مكتب) بسندات طابو خضراء مفرزة 2400 سهم واستشارات قانونية واستثمارية شاملة.
            </p>

            <div className="pt-2 flex flex-col gap-2.5 text-xs text-neutral-700 dark:text-neutral-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0" />
                <span>بيروت، الجمهورية اللبنانية</span>
              </div>
              <a href="tel:+96176743414" className="flex items-center gap-2 hover:text-emerald-600 dark:hover:text-white transition-colors font-medium">
                <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span dir="ltr">+961 76 743 414</span>
              </a>
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-amber-400 shrink-0" />
                <span>معتمدون بسند طابو أخضر نظامي 2400 سهم</span>
              </div>
            </div>
          </div>

          {/* Col 2: Main Regions */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-neutral-950 dark:text-white tracking-wide">التقسيم الجغرافي</h4>
            <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
              {MAIN_REGIONS.map((region) => (
                <li key={region.id}>
                  <a
                    href="#properties"
                    onClick={() => onSelectRegion && onSelectRegion(region.id)}
                    className="hover:text-amber-600 dark:hover:text-amber-300 transition-colors flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-600" />
                    <span>{region.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Categories */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-neutral-950 dark:text-white tracking-wide">أنواع وتصنيفات العقارات</h4>
            <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
              <li>
                <a href="#properties" className="hover:text-amber-600 dark:hover:text-amber-300 transition-colors">
                  شقق سكنية للبيع
                </a>
              </li>
              <li>
                <a href="#properties" className="hover:text-amber-600 dark:hover:text-amber-300 transition-colors">
                  شقق سكنية للإيجار
                </a>
              </li>
              <li>
                <a href="#properties" className="hover:text-amber-600 dark:hover:text-amber-300 transition-colors">
                  عقار تجاري • محلات
                </a>
              </li>
              <li>
                <a href="#properties" className="hover:text-amber-600 dark:hover:text-amber-300 transition-colors">
                  عقار تجاري • مكاتب شركات
                </a>
              </li>
              <li>
                <a href="#properties" className="hover:text-amber-600 dark:hover:text-amber-300 transition-colors">
                  عقار تجاري • مستودعات تخزين
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Management & Services */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-neutral-950 dark:text-white tracking-wide">لوحة الإدارة والخدمات</h4>
            <ul className="space-y-2.5 text-xs text-neutral-600 dark:text-neutral-400">
              <li>
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold hover:underline cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>لوحة تحكم المشرف (CMS)</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenVisitorCheckIn}
                  className="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>تسجيل زائر / استفسار خاص</span>
                </button>
              </li>
              <li>
                <a href="#valuation" className="hover:text-amber-600 dark:hover:text-amber-300 transition-colors">
                  التثمين العقاري بالذكاء الاصطناعي
                </a>
              </li>
              <li>
                <a href="#investing" className="hover:text-amber-600 dark:hover:text-amber-300 transition-colors">
                  عوائد الاستثمار والتأجير بالدولار
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenChat}
                  className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>محادثة المستشار العقاري الذكي</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-300 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 dark:text-neutral-400">
          <div>
            © {new Date().getFullYear()} مؤسسة م. نصار العقارية. جميع الحقوق محفوظة لوساطة وتطوير العقارات في لبنان.
          </div>
          <div className="flex items-center gap-4">
            <span>سند أخضر مفرز 2400 سهم</span>
            <span>•</span>
            <span>بيروت - جبل لبنان</span>
            <span>•</span>
            <span dir="ltr">+961 76 743 414</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
