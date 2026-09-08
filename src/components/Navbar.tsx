import React from 'react';
import {
  Building2,
  MessageCircle,
  Phone,
  Sun,
  Moon,
  Lock,
  UserCheck,
  Heart,
  Bell,
  Sparkles,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useWishlist } from '../context/WishlistContext';
import { useNotifications } from '../context/NotificationContext';
import { SocialLinks } from './SocialLinks';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  onOpenChat?: () => void;
  onOpenAdmin?: () => void;
  onOpenVisitorCheckIn?: () => void;
  onOpenWishlist?: () => void;
  onOpenNotifications?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenChat,
  onOpenAdmin,
  onOpenVisitorCheckIn,
  onOpenWishlist,
  onOpenNotifications,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { count: wishlistCount } = useWishlist();
  const { unreadCount } = useNotifications();

  return (
    <header className="w-full px-2 sm:px-6 lg:px-12 pt-3 sm:pt-4 relative z-30">
      <nav
        id="navbar"
        className="liquid-glass rounded-2xl px-2 sm:px-5 py-2 sm:py-2.5 flex items-center justify-between border border-amber-400/20 dark:border-white/15 shadow-2xl transition-all duration-300"
      >
        {/* Right side in RTL: Official Brand Logo & Identity */}
        <a
          href="#"
          id="logo-nassar"
          className="flex items-center gap-2 sm:gap-3 select-none group shrink-0"
        >
          <img
            src="/logo.svg"
            alt="م. نصار العقارية"
            className="h-9 w-9 sm:h-13 sm:w-13 object-contain rounded-full transition-transform duration-300 group-hover:scale-105 shadow-md drop-shadow"
          />
          <div className="flex flex-col text-right">
            <span className="text-xs sm:text-base font-black text-white tracking-tight group-hover:text-amber-300 transition-colors leading-tight">
              م. نصار العقارية
            </span>
            <span className="text-[9px] sm:text-[10px] text-amber-300/90 font-semibold hidden sm:inline leading-none mt-0.5">
              وساطة • استثمار • تطوير عقاري
            </span>
          </div>
        </a>

        {/* Center: Navigation links */}
        <div className="hidden xl:flex items-center gap-5 text-xs font-bold text-neutral-200">
          <a
            href="#properties"
            className="hover:text-amber-300 transition-colors cursor-pointer py-1"
          >
            العقارات المعروضة
          </a>
          <a
            href="#regions"
            className="hover:text-amber-300 transition-colors cursor-pointer py-1"
          >
            مناطق بيروت
          </a>
          <a
            href="#investing"
            className="hover:text-amber-300 transition-colors cursor-pointer py-1"
          >
            عوائد الاستثمار
          </a>
          <a
            href="#building"
            className="hover:text-amber-300 transition-colors cursor-pointer py-1"
          >
            المشاريع والتطوير
          </a>
          <a
            href="#valuation"
            className="hover:text-amber-300 transition-colors cursor-pointer py-1"
          >
            التثمين والسند الأخضر
          </a>
          <a
            href="#story"
            className="hover:text-amber-300 transition-colors cursor-pointer py-1"
          >
            عن المؤسسة
          </a>
        </div>

        {/* Left side in RTL: Interactive Features, Controls & CTAs */}
        <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-end">
          {/* PWA Install Button */}
          <div className="scale-90 sm:scale-100">
            <PWAInstallButton />
          </div>

          {/* Favorites / Wishlist Heart Button with Live Counter Badge */}
          <button
            type="button"
            id="wishlist-nav-btn"
            onClick={onOpenWishlist}
            aria-label="قائمة العقارات المفضلة"
            title={`المفضلة (${wishlistCount} عقار محفوظ)`}
            className="relative w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-neutral-200 hover:text-rose-400 flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
          >
            <Heart
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform ${
                wishlistCount > 0
                  ? 'fill-rose-500 text-rose-500 scale-110'
                  : 'text-neutral-200'
              }`}
            />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-600 text-[10px] font-extrabold text-white shadow-md ring-2 ring-neutral-900 animate-in zoom-in-50">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Real-time Notifications Bell Button with Live Alert Badge */}
          <button
            type="button"
            id="notifications-nav-btn"
            onClick={onOpenNotifications}
            aria-label="التنبيهات العقارية"
            title={`التنبيهات (${unreadCount} تنبيه جديد)`}
            className="relative w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-neutral-200 hover:text-amber-300 flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
          >
            <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-200" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-red-600 text-[10px] font-extrabold text-white shadow-md ring-2 ring-neutral-900 animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Theme Toggle Button (Light / Dark Mode) */}
          <button
            type="button"
            id="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label="تبديل المظهر"
            title={theme === 'dark' ? 'التحويل إلى الوضع الفاتح' : 'التحويل إلى الوضع الداكن'}
            className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-neutral-200 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-105"
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
            ) : (
              <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-300" />
            )}
          </button>

          {/* Admin CMS Access Button (Lock Icon) */}
          <button
            type="button"
            id="admin-cms-nav-btn"
            onClick={onOpenAdmin}
            title="لوحة تحكم المشرف وإدارة العقارات (CMS)"
            className="flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 hover:text-amber-200 text-[11px] sm:text-xs font-bold transition-all cursor-pointer shadow-sm hover:scale-105"
          >
            <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
            <span className="hidden md:inline">لوحة الإدارة</span>
          </button>

          {/* Visitor Check-in Quick Button */}
          <button
            type="button"
            onClick={onOpenVisitorCheckIn}
            title="تسجيل طلب أو استفسار زائر"
            className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-neutral-200 text-xs font-medium transition-colors cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>تسجيل زائر</span>
          </button>

          {/* Official Social Links (Desktop) */}
          <div className="hidden lg:flex items-center pl-1 border-l border-white/15">
            <SocialLinks variant="navbar" />
          </div>

          {/* AI Chat Button */}
          <button
            type="button"
            id="nav-btn-chat"
            onClick={onOpenChat}
            className="flex items-center gap-1 bg-gradient-to-r from-emerald-600 to-[#004d26] hover:from-emerald-500 hover:to-[#006332] text-white px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-sm font-bold transition-all cursor-pointer shadow-lg hover:scale-105 border border-amber-400/30"
          >
            <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
            <span className="hidden sm:inline">المستشار الذكي</span>
            <span className="sm:hidden">استشارة</span>
          </button>
        </div>
      </nav>
    </header>
  );
};