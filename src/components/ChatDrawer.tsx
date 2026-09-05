import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, User, Sparkles, Phone, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: 'أهلاً بك في م. نصار العقارية. أنا مستشارك العقاري الذكي المعتمد لمناطق بيروت (المزرعة، المصيطبة، راس بيروت) وخارجها. كيف يمكنني مساعدتك اليوم؟ يمكنك سؤالي عن أسعار الشقق السكنية، المحلات والمكاتب والمستودعات التجارية، عوائد الاستثمار، أو شروط السند الأخضر 2400 سهم.',
      timestamp: 'الآن',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const promptsContainerRef = useRef<HTMLDivElement>(null);

  // Safe body overflow handling: restores '' on cleanup so page scrolling never freezes
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

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('ar-LB', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInput('');
    setLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }],
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: historyPayload,
        }),
      });

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: data.reply || 'مكتب م. نصار العقارية بخدمتكم دائماً. يرجى التواصل مباشرة على +961 76 743 414.',
        timestamp: new Date().toLocaleTimeString('ar-LB', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      const errMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: 'حدث خطأ مؤقت في الاتصال بالمستشار. يرجى محادثة مكتب م. نصار مباشرة عبر واتساب على الرقم: +961 76 743 414.',
        timestamp: 'الآن',
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const scrollPrompts = (direction: 'left' | 'right') => {
    if (promptsContainerRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      promptsContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const quickPrompts = [
    'ما هي أفضل شقق للبيع في راس بيروت (الحمرا أو الروشة)؟',
    'أبحث عن مكتب تجاري أو محل للإيجار في المصيطبة وفردان',
    'ما هي متوسطات أسعار المتر في كورنيش المزرعة وبدارو؟',
    'كيف أتأكد من صحة سند الطابو الأخضر 2400 سهم؟',
    'ما هي عوائد الاستثمار والتأجير بالدولار الفريش في بيروت؟',
    'هل تتوفر شقق مع كهرباء ومولد 24/24 ومواقف مسجلة؟',
  ];

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-start bg-black/75 backdrop-blur-sm"
      dir="rtl"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg h-full bg-neutral-950 border-l border-white/10 flex flex-col shadow-2xl text-white relative animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-neutral-900/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base">المستشار العقاري الذكي</span>
                <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  مباشر
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">م. نصار العقارية • استشارات فورية مدعومة بالذكاء الاصطناعي</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-rose-600 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  msg.role === 'user' ? 'bg-white text-black' : 'bg-neutral-800 text-amber-400 border border-white/10'
                }`}
              >
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[82%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-amber-400 text-black font-medium rounded-tr-none'
                    : 'bg-neutral-900/90 border border-white/10 text-neutral-200 rounded-tl-none whitespace-pre-line'
                }`}
              >
                {msg.text}
                <div
                  className={`text-[10px] mt-1.5 ${
                    msg.role === 'user' ? 'text-black/60 text-left' : 'text-neutral-500 text-right'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-neutral-800 text-amber-400 border border-white/10 flex items-center justify-center">
                <Bot className="w-4 h-4 animate-bounce" />
              </div>
              <div className="bg-neutral-900/90 border border-white/10 p-3.5 rounded-2xl rounded-tl-none text-xs text-neutral-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse delay-75" />
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse delay-150" />
                <span>جاري استشارة قاعدة بيانات م. نصار العقارية...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Persistent Quick Questions Bar with Smooth Horizontal Navigation Arrows */}
        <div className="px-3 sm:px-4 pt-2.5 pb-2 bg-neutral-900/98 border-t border-white/10 backdrop-blur-md">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-[11px] sm:text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>أسئلة سريعة مقترحة (انقر للاستفسار فوراً):</span>
            </span>

            {/* Clear Left and Right Scroll Navigation Arrow Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => scrollPrompts('right')}
                className="p-1 sm:p-1.5 rounded-lg bg-white/10 hover:bg-amber-400 hover:text-black text-neutral-200 transition-all cursor-pointer shadow-sm border border-white/10 active:scale-90"
                title="تمرير لليمين"
                aria-label="تمرير لليمين"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => scrollPrompts('left')}
                className="p-1 sm:p-1.5 rounded-lg bg-white/10 hover:bg-amber-400 hover:text-black text-neutral-200 transition-all cursor-pointer shadow-sm border border-white/10 active:scale-90"
                title="تمرير لليسار"
                aria-label="تمرير لليسار"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div
            ref={promptsContainerRef}
            className="flex gap-2 overflow-x-auto pb-1.5 pt-0.5 scroll-smooth select-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                disabled={loading}
                onClick={() => handleSend(prompt)}
                className="text-xs font-medium bg-white/10 hover:bg-amber-400/25 active:bg-amber-400/40 border border-white/15 hover:border-amber-400/60 text-neutral-100 hover:text-white px-3.5 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer shrink-0 shadow-sm active:scale-95 disabled:opacity-50 text-right leading-snug"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Footer Input */}
        <div className="p-4 border-t border-white/10 bg-neutral-900/90 space-y-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="اكتب استفسارك العقاري هنا..."
              className="flex-1 bg-neutral-950 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 bg-amber-400 text-black hover:bg-amber-300 disabled:opacity-50 rounded-xl transition-colors cursor-pointer"
              aria-label="إرسال"
            >
              <Send className="w-4 h-4 rotate-180" />
            </button>
          </form>

          <div className="flex items-center justify-between text-[11px] text-neutral-400 px-1 pt-1">
            <span>مكتب المعاينات: بيروت - لبنان</span>
            <a
              href="https://wa.me/96176743414"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <Phone className="w-3 h-3" />
              <span dir="ltr">+961 76 743 414</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
