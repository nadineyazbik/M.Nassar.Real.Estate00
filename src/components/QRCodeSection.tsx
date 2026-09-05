import React, { useState } from 'react';
import { QrCode, Copy, Check, Share2, Smartphone, ExternalLink } from 'lucide-react';

interface QRCodeSectionProps {
  variant?: 'card' | 'compact' | 'footer';
  className?: string;
}

export const QRCodeSection: React.FC<QRCodeSectionProps> = ({
  variant = 'card',
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'https://nassarrealestate.com';

  // Real QR Code API generator using official Google Chart / QR Server with SVG/PNG
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    currentUrl
  )}&color=004d26&bgcolor=FFFFFF&margin=1`;

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(currentUrl);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleWhatsAppShare = () => {
    const text = `تفضل بزيارة منصة م. نصار العقارية - استكشف أحدث الشقق والعقارات التجارية في بيروت:\n${currentUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 ${className}`}>
        <div className="w-16 h-16 bg-white p-1 rounded-xl shrink-0 shadow-md flex items-center justify-center">
          <img
            src={qrCodeUrl}
            alt="رمز الاستجابة السريعة QR Code"
            className="w-full h-full object-contain"
            loading="lazy"
          />
        </div>
        <div className="flex-1 min-w-0 text-right">
          <p className="text-xs font-bold text-white mb-1">امسح الرمز بكاميرا هاتفك</p>
          <p className="text-[11px] text-neutral-400 truncate">لفتح وتثبيت المنصة مباشرة</p>
          <button
            type="button"
            onClick={handleCopyLink}
            className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'تم نسخ الرابط!' : 'نسخ رابط المنصة'}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      id="qr-code-section"
      className={`rounded-3xl p-6 bg-gradient-to-br from-[#00361a] to-neutral-950 border border-amber-400/30 shadow-2xl relative overflow-hidden text-white ${className}`}
      dir="rtl"
    >
      {/* Decorative Gold Glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
        {/* QR Code Container with High Contrast Pure White Backing */}
        <div className="relative group shrink-0">
          <div className="w-36 h-36 sm:w-40 sm:h-40 bg-white p-2.5 rounded-2xl shadow-xl border-2 border-amber-400/50 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <img
              src={qrCodeUrl}
              alt="QR Code لموقع م. نصار العقارية"
              className="w-full h-full object-contain"
              loading="lazy"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold shadow-md border border-white/30 flex items-center gap-1">
            <Smartphone className="w-3 h-3" />
            <span>مسح سريع</span>
          </div>
        </div>

        {/* Info & Copy Actions */}
        <div className="flex-1 text-center sm:text-right space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold">
            <QrCode className="w-3.5 h-3.5 text-amber-400" />
            <span>رمز الاستجابة السريعة (QR Code)</span>
          </div>

          <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
            افتح المنصة وثبتها على هاتفك بلمسة واحدة
          </h3>

          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-lg">
            وجّه كاميرا هاتفك المحمول نحو الرمز لفتح المنصة فوراً بدون كتابة الرابط، أو شارك الموقع مع أصدقائك والمهتمين بالعقارات في بيروت.
          </p>

          {/* Interactive Action Buttons */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleCopyLink}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer shadow-md ${
                copied
                  ? 'bg-emerald-600 text-white border border-emerald-400'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              }`}
            >
              {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4 text-amber-300" />}
              <span>{copied ? 'تم نسخ الرابط بنجاح!' : 'نسخ رابط المنصة'}</span>
            </button>

            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold transition-all duration-200 cursor-pointer shadow-md"
            >
              <Share2 className="w-4 h-4" />
              <span>مشاركة عبر واتساب</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
