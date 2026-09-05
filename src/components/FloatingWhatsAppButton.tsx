import React, { useState } from 'react';
import { WhatsAppIcon } from './SocialLinks';

interface FloatingWhatsAppButtonProps {
  phoneNumber?: string;
  defaultMessage?: string;
}

export const FloatingWhatsAppButton: React.FC<FloatingWhatsAppButtonProps> = ({
  phoneNumber = '96176743414',
  defaultMessage = 'السلام عليكم م. نصار العقارية، أود الاستفسار عن عقار في بيروت',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3"
      dir="rtl"
    >
      {/* Tooltip / Label that shows on hover or permanently subtle */}
      <div
        className={`hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-neutral-900/95 dark:bg-neutral-900/95 text-white text-xs font-semibold shadow-2xl border border-white/15 backdrop-blur-md transition-all duration-300 pointer-events-none select-none ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-90 translate-x-1'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-[#25D366] animate-ping" />
        <div className="flex flex-col text-right">
          <span className="font-bold text-white leading-tight">تواصل عبر واتساب</span>
          <span className="text-[10px] text-emerald-400 font-mono" dir="ltr">
            +961 76 743 414
          </span>
        </div>
      </div>

      {/* Official WhatsApp Floating Button */}
      <a
        id="btn-floating-whatsapp"
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="تواصل مع م. نصار العقارية عبر واتساب"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative group w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-[0_8px_30px_rgb(37,211,102,0.4)] hover:shadow-[0_10px_35px_rgb(37,211,102,0.6)] transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer"
      >
        {/* Subtle pulsing aura behind the button */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping pointer-events-none group-hover:opacity-0 transition-opacity" />

        {/* Official WhatsApp SVG */}
        <WhatsAppIcon className="w-7 h-7 fill-current relative z-10 drop-shadow-md" />

        {/* Online Status Pill on the button */}
        <span className="absolute top-0 right-0 w-4 h-4 bg-emerald-300 border-2 border-white rounded-full flex items-center justify-center shadow-sm z-20">
          <span className="w-1.5 h-1.5 bg-emerald-700 rounded-full" />
        </span>
      </a>
    </div>
  );
};
