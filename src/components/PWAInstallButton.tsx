import React, { useState } from 'react';
import { Download, Check, Share, PlusSquare, Smartphone, Monitor, X, QrCode } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { QRCodeSection } from './QRCodeSection';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'navbar' | 'compact' | 'modal';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'navbar',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);

  // If running in standalone app mode
  if (isInstalled) {
    return (
      <div
        className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium select-none ${className}`}
        title="التطبيق مثبت على جهازك"
      >
        <Check className="w-3.5 h-3.5 text-emerald-400" />
        <span className="hidden sm:inline text-[11px]">التطبيق مُثبّت</span>
      </div>
    );
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const outcome = await install();
      if (!outcome) {
        setShowGuideModal(true);
      }
    } else {
      setShowGuideModal(true);
    }
  };

  return (
    <>
      <button
        type="button"
        id="pwa-install-header-btn"
        onClick={handleInstallClick}
        title="تثبيت منصة م. نصار العقارية كتطبيق سريع على هاتفك أو حاسوبك (PWA)"
        className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-emerald-600/90 to-[#004d26] hover:from-emerald-500 hover:to-[#006332] border border-amber-400/40 text-white text-xs font-bold transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg hover:scale-105 active:scale-95 ${className}`}
      >
        <Download className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
        <span className="hidden sm:inline">تثبيت التطبيق (PWA)</span>
        <span className="sm:hidden">تثبيت</span>
      </button>

      {/* Guided Install Modal - Clean Floating Overlay with high z-index */}
      {showGuideModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
          dir="rtl"
          onClick={() => setShowGuideModal(false)}
        >
          <div
            className="relative w-full max-w-lg bg-neutral-950 border border-amber-400/40 rounded-3xl p-6 sm:p-7 shadow-2xl text-right overflow-hidden my-6 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowGuideModal(false)}
              className="absolute top-4 left-4 p-2.5 rounded-full bg-white/10 hover:bg-rose-600 text-neutral-300 hover:text-white transition-all cursor-pointer border border-white/15 select-none"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3.5 mb-5 pl-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#004d26] to-[#002b15] border border-amber-400/50 flex items-center justify-center text-amber-300 shrink-0 shadow-lg">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  تثبيت منصة م. نصار العقارية
                </h3>
                <p className="text-xs text-neutral-300 mt-0.5">
                  تطبيق ويب تقدمي خفيف وسريع يعمل دون الحاجة لمتجر التطبيقات
                </p>
              </div>
            </div>

            {/* Instructions by Device */}
            <div className="space-y-4 my-5 text-xs sm:text-sm text-neutral-200">
              {isIOS ? (
                <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 space-y-3">
                  <div className="font-bold text-amber-300 flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-amber-400" />
                    <span>خطوات التثبيت على أجهزة آيفون وآيباد (iOS Safari):</span>
                  </div>
                  <ol className="space-y-2.5 pr-4 list-decimal text-neutral-200 leading-relaxed text-xs">
                    <li className="flex items-center gap-2 flex-wrap">
                      <span>اضغط على زر المشاركة</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/10 border border-white/20 text-sky-300">
                        <Share className="w-3.5 h-3.5 text-sky-400" />
                        <span>مشاركة</span>
                      </span>
                      <span>في شريط Safari السفلي.</span>
                    </li>
                    <li className="flex items-center gap-2 flex-wrap">
                      <span>مرر للأسفل واختر</span>
                      <strong className="text-amber-300">"إضافة إلى الصفحة الرئيسية"</strong>
                      <PlusSquare className="w-4 h-4 text-emerald-400 inline" />
                    </li>
                    <li>اضغط على <strong className="text-emerald-400">"إضافة (Add)"</strong> في الزاوية العلوية ليظهر التطبيق فوراً.</li>
                  </ol>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 space-y-3">
                  <div className="font-bold text-emerald-300 flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-emerald-400" />
                    <span>خطوات التثبيت على أندرويد والمتصفحات (Chrome / Edge):</span>
                  </div>
                  <ul className="space-y-2.5 text-neutral-200 leading-relaxed text-xs">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                      <span>اضغط على أيقونة التثبيت <Download className="w-3.5 h-3.5 inline text-amber-400 mx-1" /> في شريط العنوان أعلى المتصفح.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                      <span className="min-w-0 break-words">أو افتح قائمة الخيارات (ثلاث نقاط ⋮) واختر <strong>"تثبيت التطبيق"</strong>.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                      <span className="min-w-0 break-words">ستتمكن من تصفح كافة العقارات بسرعة فائقة دون استهلاك للذاكرة.</span>
                    </li>
                  </ul>
                </div>
              )}

              {/* Compact QR Code helper inside modal */}
              <div className="pt-1">
                <QRCodeSection variant="compact" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              {isInstallable && (
                <button
                  type="button"
                  onClick={async () => {
                    await install();
                    setShowGuideModal(false);
                  }}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-[#004d26] hover:brightness-110 text-white font-bold text-xs transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4 text-amber-300" />
                  <span>تأكيد التثبيت الآن</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

