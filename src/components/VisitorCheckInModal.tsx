import React, { useState, useEffect } from 'react';
import { saveInquiry } from '../services/propertyStore';
import { Building2, User, Phone, CheckCircle, X, Sparkles, ShieldCheck } from 'lucide-react';

interface VisitorCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const VisitorCheckInModal: React.FC<VisitorCheckInModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [interest, setInterest] = useState<'buy' | 'rent' | 'list' | 'consult'>('buy');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    saveInquiry({
      name: name.trim(),
      phone: phone.trim(),
      interestType: interest,
      notes: notes.trim() || 'تسجيل دخول زائر جديد من البوابة الرئيسية للموقع',
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
      if (onSuccess) onSuccess();
    }, 1500);
  };

  const handleGuestBrowse = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" dir="rtl">
      <div className="relative w-full max-w-md bg-neutral-900 border border-white/15 rounded-3xl shadow-2xl p-6 sm:p-8 text-right space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-emerald-500/20 border border-white/20 flex items-center justify-center text-white">
            <Building2 className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white leading-tight">
              أهلاً بكم في م. نصار العقارية
            </h3>
            <span className="text-xs text-neutral-400">
              بوابتك الموثوقة لعقارات بيروت وجبل لبنان
            </span>
          </div>
        </div>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">تم تسجيل حضوركم واهتمامكم بنجاح!</h4>
            <p className="text-xs text-neutral-400">
              سيتواصل معكم مستشارنا العقاري المعتمد عبر الواتساب لتزويدكم بأحدث العروض المناسبة.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-xs text-neutral-300 leading-relaxed">
              سجّل حضورك للحصول على استشارة عقارية مجانية وتنبيهات فورية بأحدث الشقق والعقارات التجارية بسندات طابو خضراء 2400 سهم.
            </p>

            {/* Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-300">الاسم الكامل *</label>
              <div className="relative">
                <User className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: جهاد خليل"
                  className="w-full bg-neutral-950 border border-white/15 rounded-xl pr-9 pl-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-300">رقم الهاتف / الواتساب *</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+961 70 000 000"
                  className="w-full bg-neutral-950 border border-white/15 rounded-xl pr-9 pl-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 font-mono"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Interest */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-300">نوع الاهتمام الرئيسي</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setInterest('buy')}
                  className={`py-2 px-3 rounded-xl border text-center font-medium cursor-pointer transition-colors ${
                    interest === 'buy'
                      ? 'bg-amber-400 text-black border-amber-400 font-bold'
                      : 'bg-neutral-950 text-neutral-300 border-white/10 hover:border-white/20'
                  }`}
                >
                  شراء شقة أو عقار
                </button>
                <button
                  type="button"
                  onClick={() => setInterest('rent')}
                  className={`py-2 px-3 rounded-xl border text-center font-medium cursor-pointer transition-colors ${
                    interest === 'rent'
                      ? 'bg-emerald-500 text-white border-emerald-500 font-bold'
                      : 'bg-neutral-950 text-neutral-300 border-white/10 hover:border-white/20'
                  }`}
                >
                  استئجار عقار
                </button>
                <button
                  type="button"
                  onClick={() => setInterest('list')}
                  className={`py-2 px-3 rounded-xl border text-center font-medium cursor-pointer transition-colors ${
                    interest === 'list'
                      ? 'bg-white text-black border-white font-bold'
                      : 'bg-neutral-950 text-neutral-300 border-white/10 hover:border-white/20'
                  }`}
                >
                  عرض عقاري للبيع/الإيجار
                </button>
                <button
                  type="button"
                  onClick={() => setInterest('consult')}
                  className={`py-2 px-3 rounded-xl border text-center font-medium cursor-pointer transition-colors ${
                    interest === 'consult'
                      ? 'bg-amber-400 text-black border-amber-400 font-bold'
                      : 'bg-neutral-950 text-neutral-300 border-white/10 hover:border-white/20'
                  }`}
                >
                  استشارة قانونية أو طابو
                </button>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-300">ملاحظات إضافية (اختياري)</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="المنطقة المفضلة، الميزانية، أو أي تفاصيل خاصة..."
                className="w-full bg-neutral-950 border border-white/15 rounded-xl p-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Action buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold text-xs transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>تأكيد الحضور وبدء التصفح</span>
              </button>

              <button
                type="button"
                onClick={handleGuestBrowse}
                className="w-full py-2.5 rounded-xl bg-transparent hover:bg-white/5 text-neutral-400 hover:text-white font-medium text-xs transition-colors cursor-pointer"
              >
                المتابعة السريعة كزائر عام دون تسجيل
              </button>
            </div>
          </form>
        )}

        <div className="pt-2 border-t border-white/10 flex items-center justify-center gap-2 text-[11px] text-neutral-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>خصوصيتكم وبياناتكم مصونة بالكامل بموجب معايير م. نصار العقارية</span>
        </div>
      </div>
    </div>
  );
};
