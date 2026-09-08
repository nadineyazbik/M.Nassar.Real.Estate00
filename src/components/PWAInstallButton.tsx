import React, { useState, useEffect } from 'react';
import { Download, PlusSquare, Share, Monitor } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    if (!deferredPrompt) {
      setShowIOSModal(true);
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        className="fixed bottom-4 left-4 z-50 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 transition-all duration-300 hover:scale-105 border border-emerald-400/30 backdrop-blur-md group animate-bounce"
        title="تثبيت التطبيق"
      >
        <Download className="w-5 h-5 text-emerald-200 group-hover:rotate-12 transition-transform" />
        <span className="font-bold text-sm tracking-wide">تثبيت التطبيق</span>
      </button>

      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-md w-full p-6 shadow-2xl text-white relative">
            <button
              onClick={() => setShowIOSModal(false)}
              className="absolute top-4 left-4 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 p-2 rounded-full transition-colors"
            >
              ✕
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl flex items-center justify-center mx-auto mb-3 text-emerald-400">
                <Download className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-emerald-300">تثبيت التطبيق على جهازك</h3>
              <p className="text-slate-300 text-xs mt-1">احصل على تجربة تطبيق سريع وسهل الاستخدام</p>
            </div>

            {isIOS ? (
              <div className="space-y-3 bg-emerald-950/40 border border-emerald-500/30 p-4 rounded-2xl">
                <div className="font-bold text-emerald-300 flex items-center gap-2">
                  <Share className="w-4 h-4 text-sky-400" />
                  <span>خطوات التثبيت على أجهزة أيفون وأيباد (iOS Safari):</span>
                </div>
                <ol className="space-y-2.5 text-slate-200 leading-relaxed text-xs">
                  <li className="flex items-center gap-2 flex-wrap">
                    <span>اضغط على زر المشاركة</span>
                    <Share className="w-3.5 h-3.5 text-sky-400" />
                  </li>
                  <li className="flex items-center gap-2 flex-wrap">
                    <span>مرر للأسفل واختر</span>
                    <strong className="text-amber-300">إضافة إلى الصفحة الرئيسية</strong>
                    <PlusSquare className="w-4 h-4 text-emerald-400 inline" />
                  </li>
                  <li className="flex items-center gap-2 flex-wrap">
                    <span>في الزاوية العلوية ليظهر التطبيق فوراً</span>
                    <strong className="text-emerald-400">إضافة (Add)</strong>
                  </li>
                </ol>
              </div>
            ) : (
              <div className="space-y-3 bg-emerald-950/60 border border-emerald-500/30 p-4 rounded-2xl">
                <div className="font-bold text-emerald-300 flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-emerald-400" />
                  <span>خطوات التثبيت على أندرويد والمتصفحات:</span>
                </div>
                <ul className="space-y-2.5 text-slate-200 leading-relaxed text-xs">
                  <li className="flex items-center gap-2 flex-wrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <span>في شريط العنوان أعلى المتصفح، اضغط على أيقونة التنبيه</span>
                    <Download className="w-3.5 h-3.5 inline text-amber-400 mx-1" />
                  </li>
                  <li className="flex items-center gap-2 flex-wrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <span>أو افتح قائمة الخيارات (3 نقاط) واختر <strong className="text-emerald-300">تثبيت التطبيق</strong></span>
                  </li>
                  <li className="flex items-center gap-2 flex-wrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <span>ستتمكن من تصفح كافة العقارات بسرعة فائقة دون استهلاك للذاكرة</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};