import React from 'react';

export const SOCIAL_URLS = {
  instagram: 'https://www.instagram.com/m_nassar_real_estate?igsh=d2Q3cWFkajg3YXkx',
  facebook: 'https://www.facebook.com/share/1EodiJ6aNv/',
  tiktok: 'https://www.tiktok.com/@m_nassar_real_estate?_r=1&_t=ZS-987TzADVDMr',
  whatsapp: 'https://wa.me/96176743414?text=السلام%20عليكم%20م.%20نصار%20العقارية،%20أود%20الاستفسار%20عن%20العقارات',
  phone: 'tel:+96176743414',
  phoneFormatted: '+961 76 743 414',
};

// Official Brand SVGs
export const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="Instagram">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

export const FacebookIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="Facebook">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export const TikTokIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="TikTok">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.27 6.27 0 0 0 1.97-4.52V8.92a8.28 8.28 0 0 0 4.8 1.51v-3.5a4.8 4.8 0 0 1-1-.24z" />
  </svg>
);

export const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="WhatsApp">
    <path d="M17.472 14.382c-.301-.15-1.78-.879-2.056-.98-.276-.1-.477-.15-.678.15-.2.3-.778.98-.954 1.18-.175.2-.351.225-.652.075-.301-.15-1.27-.468-2.42-1.494-.895-.799-1.5-1.786-1.676-2.087-.175-.301-.019-.464.132-.613.136-.135.301-.351.452-.527.15-.175.2-.301.3-.502.1-.2.05-.376-.025-.526-.075-.15-.678-1.636-.93-2.242-.244-.59-.493-.51-.678-.52l-.578-.01c-.2 0-.527.075-.803.376s-1.054 1.03-1.054 2.512c0 1.482 1.079 2.912 1.23 3.113.15.2 2.122 3.24 5.141 4.544.718.31 1.278.495 1.715.634.722.23 1.38.197 1.9.12.58-.087 1.78-.728 2.03-1.431.25-.704.25-1.307.175-1.432-.075-.125-.276-.2-.577-.35zm-5.452 7.41c-1.803 0-3.571-.486-5.124-1.408l-.368-.219-3.808.998 1.016-3.712-.24-.382a10.026 10.026 0 0 1-1.536-5.32c0-5.541 4.508-10.05 10.057-10.05 2.686 0 5.21 1.047 7.11 2.948 1.9 1.902 2.947 4.427 2.946 7.112 0 5.543-4.509 10.052-10.053 10.052zm8.53-18.577A12.015 12.015 0 0 0 12.02 0C5.393 0 .004 5.388.004 12.015c0 2.115.553 4.181 1.603 5.998L0 24l6.169-1.618a11.966 11.966 0 0 0 5.85 1.512h.005c6.626 0 12.016-5.389 12.016-12.016 0-3.21-1.25-6.227-3.52-8.498z" />
  </svg>
);

interface SocialLinksProps {
  variant?: 'navbar' | 'footer' | 'contact' | 'compact';
  className?: string;
}

export const SocialLinks: React.FC<SocialLinksProps> = ({ variant = 'footer', className = '' }) => {
  if (variant === 'navbar') {
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        <a
          href={SOCIAL_URLS.instagram}
          target="_blank"
          rel="noopener noreferrer"
          title="م. نصار على إنستغرام"
          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-pink-600/20 text-neutral-300 hover:text-pink-400 border border-white/10 hover:border-pink-500/40 flex items-center justify-center transition-all duration-200"
        >
          <InstagramIcon className="w-4 h-4" />
        </a>
        <a
          href={SOCIAL_URLS.facebook}
          target="_blank"
          rel="noopener noreferrer"
          title="م. نصار على فيسبوك"
          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-blue-600/20 text-neutral-300 hover:text-blue-400 border border-white/10 hover:border-blue-500/40 flex items-center justify-center transition-all duration-200"
        >
          <FacebookIcon className="w-4 h-4" />
        </a>
        <a
          href={SOCIAL_URLS.tiktok}
          target="_blank"
          rel="noopener noreferrer"
          title="م. نصار على تيك توك"
          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-white/10 hover:border-white/30 flex items-center justify-center transition-all duration-200"
        >
          <TikTokIcon className="w-3.5 h-3.5" />
        </a>
        <a
          href={SOCIAL_URLS.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          title="واتساب م. نصار العقارية"
          className="w-8 h-8 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 flex items-center justify-center transition-all duration-200"
        >
          <WhatsAppIcon className="w-4 h-4" />
        </a>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`space-y-4 ${className}`}>
        <h4 className="text-sm font-bold tracking-wide flex items-center gap-2">
          <span>قنوات التواصل الرسمية</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </h4>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {/* Instagram */}
          <a
            href={SOCIAL_URLS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500/10 to-purple-500/10 hover:from-pink-500/20 hover:to-purple-500/20 border border-pink-500/20 text-neutral-200 hover:text-white transition-all group shadow-sm"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
              <InstagramIcon className="w-4 h-4" />
            </div>
            <div className="flex flex-col text-right">
              <span className="text-xs font-bold leading-tight">Instagram</span>
              <span className="text-[10px] text-neutral-400">@m_nassar</span>
            </div>
          </a>

          {/* Facebook */}
          <a
            href={SOCIAL_URLS.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-neutral-200 hover:text-white transition-all group shadow-sm"
          >
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
              <FacebookIcon className="w-4 h-4" />
            </div>
            <div className="flex flex-col text-right">
              <span className="text-xs font-bold leading-tight">Facebook</span>
              <span className="text-[10px] text-neutral-400">الصفحة الرسمية</span>
            </div>
          </a>

          {/* TikTok */}
          <a
            href={SOCIAL_URLS.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-neutral-800/60 hover:bg-neutral-800 border border-white/15 text-neutral-200 hover:text-white transition-all group shadow-sm"
          >
            <div className="w-7 h-7 rounded-lg bg-black border border-white/20 flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
              <TikTokIcon className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col text-right">
              <span className="text-xs font-bold leading-tight">TikTok</span>
              <span className="text-[10px] text-neutral-400">جولات وفيديوهات</span>
            </div>
          </a>

          {/* WhatsApp */}
          <a
            href={SOCIAL_URLS.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-neutral-200 hover:text-white transition-all group shadow-sm"
          >
            <div className="w-7 h-7 rounded-lg bg-[#25D366] flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
              <WhatsAppIcon className="w-4 h-4" />
            </div>
            <div className="flex flex-col text-right">
              <span className="text-xs font-bold leading-tight">WhatsApp</span>
              <span className="text-[10px] text-emerald-400 font-semibold" dir="ltr">+961 76 743 414</span>
            </div>
          </a>
        </div>
      </div>
    );
  }

  // Default compact
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <a
        href={SOCIAL_URLS.instagram}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-xl bg-white/5 hover:bg-pink-600/20 text-neutral-300 hover:text-pink-400 border border-white/10 transition-colors"
        title="إنستغرام"
      >
        <InstagramIcon className="w-4 h-4" />
      </a>
      <a
        href={SOCIAL_URLS.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-xl bg-white/5 hover:bg-blue-600/20 text-neutral-300 hover:text-blue-400 border border-white/10 transition-colors"
        title="فيسبوك"
      >
        <FacebookIcon className="w-4 h-4" />
      </a>
      <a
        href={SOCIAL_URLS.tiktok}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-xl bg-white/5 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-white/10 transition-colors"
        title="تيك توك"
      >
        <TikTokIcon className="w-4 h-4" />
      </a>
      <a
        href={SOCIAL_URLS.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors"
        title="واتساب"
      >
        <WhatsAppIcon className="w-4 h-4" />
      </a>
    </div>
  );
};
