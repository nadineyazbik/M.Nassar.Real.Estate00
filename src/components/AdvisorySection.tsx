import React from 'react';
import { Shield, FileText, CheckCircle2, Phone, ArrowLeft, Building2, Award } from 'lucide-react';

interface AdvisorySectionProps {
  onOpenChat: () => void;
}

export const AdvisorySection: React.FC<AdvisorySectionProps> = ({ onOpenChat }) => {
  const ADVISORY_TOPICS = [
    {
      title: 'سند الملكية الأخضر المفرز (2400 سهم)',
      desc: 'في القانون اللبناني، الملكية التامة للعقار أو الشقة تعادل 2400 سهم بالتمام والكمال. السند الأخضر المفرز يضمن ملكية حرة مطلقة لا لبس فيها، ومسجلة رسمياً لدى أمانة السجل العقاري بدون أي شراكات أو نزاعات شيوع.',
      badge: 'حماية قانونية تامة',
    },
    {
      title: 'فحص الصحيفة العقارية وخلو الحجوزات',
      desc: 'قبل توقيع أي عقد أو تسديد أي دفعة، يتولى مكتبنا الاستحصال على إفادة عقارية شاملة حديثة للتأكد من خلو العقار من أي رهونات مصرفية، حجوزات احتياطية، ديون بلدية، أو إشارات دعاوى قضائية.',
      badge: 'فحص وتدقيق شامل',
    },
    {
      title: 'تراخيص العقارات التجارية (محل، مستودع، مكتب)',
      desc: 'مراجعة دقيقة لصفة الاستثمار التجاري في تصنيف المنطقة والبلدية، التأكد من قانونية السدة (الميزانين)، تراخيص الإشغال والإعلانات، وتوفر مخارج الطوارئ ومواقف السيارات النظامية.',
      badge: 'مطابقة تجارية',
    },
    {
      title: 'تسهيلات المغتربين والوكالات الرسمية',
      desc: 'خدمة مخصصة للمغتربين اللبنانيين في الخليج، أفريقيا، أوروبا، وأمريكا، تشمل صياغة الوكالات الخاصة المعتمدة لدى القنصليات اللبنانية، وإنهاء معاملات البيع والشراء بالدولار الفريش دون الحاجة للحضور الشخصي.',
      badge: 'خدمة المغتربين',
    },
  ];

  return (
    <div className="w-full space-y-8 text-right" dir="rtl" id="advisory">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-300 text-xs font-semibold mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>الاستشارات القانونية والدوائر العقارية</span>
          </div>
          <h3 className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            حماية استثمارك العقاري بسند طابو أخضر نظامي
          </h3>
          <p className="text-sm text-slate-600 dark:text-neutral-400 mt-2 max-w-2xl leading-relaxed">
            خبرة ميدانية طويلة لدى أمانات السجل العقاري وبلديات بيروت وجبل لبنان لضمان خلو العقار من أي التزامات مالية أو شوائب قانونية.
          </p>
        </div>

        <button
          onClick={onOpenChat}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white/10 text-white hover:bg-slate-800 dark:hover:bg-white/20 border border-transparent dark:border-white/15 text-xs font-semibold transition-colors cursor-pointer shadow-sm"
        >
          <span>استشر الذكاء الاصطناعي الآن</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ADVISORY_TOPICS.map((topic, index) => (
          <div
            key={index}
            className="p-6 rounded-2xl bg-white dark:bg-neutral-900/60 border border-slate-200 dark:border-white/10 hover:border-amber-400/50 dark:hover:border-white/20 transition-all flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 font-semibold border border-amber-500/20">
                  {topic.badge}
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white pt-1">{topic.title}</h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-300 leading-relaxed">{topic.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Cadastral Guarantee Strip */}
      <div className="p-6 sm:p-8 rounded-3xl bg-emerald-50/80 dark:bg-gradient-to-r dark:from-emerald-950/40 dark:via-neutral-900 dark:to-amber-950/30 border border-emerald-500/25 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">ضمانة وساطة م. نصار العقارية</h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-300 mt-1 max-w-xl leading-relaxed">
              جميع العقارات المعروضة تخضع للمعاينة الميدانية والتدقيق الطابوغرافي والقانوني قبل إدراجها. كما نقدم عقود إيجار وبيوع موثقة تحفظ كامل حقوق المؤجر والمستأجر، البائع والشاري.
            </p>
          </div>
        </div>

        <a
          href="https://wa.me/96176743414?text=السلام%20عليكم%20م.%20نصار%20العقارية،%20أحتاج%20استشارة%20قانونية%20وعقارية"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-lg"
        >
          <Phone className="w-4 h-4" />
          <span>طلب استشارة قانونية مباشرة</span>
        </a>
      </div>
    </div>
  );
};
