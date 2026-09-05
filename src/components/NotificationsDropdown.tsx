import React, { useState } from 'react';
import {
  Bell,
  X,
  CheckCheck,
  Trash2,
  ExternalLink,
  Sparkles,
  TrendingDown,
  Building,
  Scale,
  Clock,
} from 'lucide-react';
import { useNotifications, AppNotification } from '../context/NotificationContext';
import { Property } from '../types';

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProperty?: (propertyId: string) => void;
  properties?: Property[];
}

export const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({
  isOpen,
  onClose,
  onSelectProperty,
  properties = [],
}) => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  } = useNotifications();

  const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');

  if (!isOpen) return null;

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'unread') return !n.read;
    return true;
  });

  const getIconForType = (type: AppNotification['type']) => {
    switch (type) {
      case 'listing':
        return <Building className="w-4 h-4 text-emerald-400" />;
      case 'price_drop':
        return <TrendingDown className="w-4 h-4 text-amber-400" />;
      case 'legal':
        return <Scale className="w-4 h-4 text-sky-400" />;
      case 'broadcast':
      default:
        return <Sparkles className="w-4 h-4 text-purple-400" />;
    }
  };

  const handleNotificationClick = (item: AppNotification) => {
    markAsRead(item.id);
    if (item.propertyId && onSelectProperty) {
      onSelectProperty(item.propertyId);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center sm:justify-end p-3 sm:p-6 bg-black/60 backdrop-blur-sm sm:bg-transparent"
      dir="rtl"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md mt-16 sm:mt-14 bg-neutral-900/95 border border-amber-400/30 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-gradient-to-r from-emerald-950/80 to-neutral-900 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative p-2 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-300">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                التنبيهات العقارية
                {unreadCount > 0 && (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
                    {unreadCount} جديد
                  </span>
                )}
              </h3>
              <p className="text-xs text-neutral-400">آخر المستجدات وعروض بيروت العقارية</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toolbar & Filter Tabs */}
        <div className="px-4 py-2.5 bg-black/40 border-b border-white/5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              الكل ({notifications.length})
            </button>
            <button
              onClick={() => setActiveFilter('unread')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                activeFilter === 'unread'
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              غير مقروءة ({unreadCount})
            </button>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer font-medium"
                title="تحديد الكل كمقروء"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>قراءة الكل</span>
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={clearAll}
                className="flex items-center gap-1 text-neutral-500 hover:text-red-400 transition-colors cursor-pointer"
                title="مسح كافة التنبيهات"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-[380px] overflow-y-auto divide-y divide-white/5 p-2 space-y-1">
          {filteredNotifications.length === 0 ? (
            <div className="py-12 text-center text-neutral-400 space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-white/5 flex items-center justify-center text-neutral-500">
                <Bell className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium">لا توجد تنبيهات جديدة حالياً</p>
              <p className="text-xs text-neutral-500">سنعلمك فور توفر عروض مميزة أو تحديثات بالأسعار</p>
            </div>
          ) : (
            filteredNotifications.map((item) => (
              <div
                key={item.id}
                onClick={() => handleNotificationClick(item)}
                className={`p-3.5 rounded-2xl transition-all cursor-pointer group ${
                  item.read
                    ? 'bg-transparent hover:bg-white/5 opacity-80'
                    : 'bg-emerald-950/30 border border-emerald-500/20 hover:bg-emerald-950/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-black/40 border border-white/10 shrink-0 mt-0.5">
                    {getIconForType(item.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4
                        className={`text-xs sm:text-sm font-bold truncate ${
                          item.read ? 'text-neutral-200' : 'text-white'
                        }`}
                      >
                        {item.title}
                      </h4>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                      )}
                    </div>

                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-white/5 text-[11px] text-neutral-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.time}
                      </span>

                      <div className="flex items-center gap-2">
                        {item.actionText && (
                          <span className="flex items-center gap-1 text-amber-300 font-semibold group-hover:underline">
                            {item.actionText}
                            <ExternalLink className="w-3 h-3" />
                          </span>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(item.id);
                          }}
                          className="p-1 hover:text-red-400 text-neutral-500 transition-colors"
                          title="حذف هذا التنبيه"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-black/60 border-t border-white/10 text-center text-xs text-neutral-400">
          تنبيهات فورية لفرص الشراء والإيجار في بيروت وضواحيها
        </div>
      </div>
    </div>
  );
};
