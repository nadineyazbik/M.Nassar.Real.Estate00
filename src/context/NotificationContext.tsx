import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'listing' | 'price_drop' | 'broadcast' | 'legal';
  read: boolean;
  propertyId?: string;
  actionText?: string;
}

const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'عقار جديد: شقة فاخرة بإطلالة بحرية في فردان',
    description: 'تم إدراج شقة 280م² بسند ملكية طابو أخضر 2400 سهم وكهرباء 24/24 وموقفين.',
    time: 'منذ 15 دقيقة',
    type: 'listing',
    read: false,
    propertyId: 'p-1',
    actionText: 'عرض العقار',
  },
  {
    id: 'notif-2',
    title: 'تخفيض سعر شقة مفروشة في الحمرا',
    description: 'تم تحديث بدل الإيجار الشهري لشقة ديلوكس مفروشة في الحمرا إلى 850$ فريش.',
    time: 'منذ ساعتين',
    type: 'price_drop',
    read: false,
    propertyId: 'p-4',
    actionText: 'تفقد العرض',
  },
  {
    id: 'notif-3',
    title: 'تنويه إداري: التثمين العقاري بالذكاء الاصطناعي متاح',
    description: 'يمكنك الآن حساب القيمة التقديرية لعقارك في بيروت فورياً وبدقة عبر أداة التثمين الذكية.',
    time: 'اليوم',
    type: 'broadcast',
    read: false,
    actionText: 'جرب الأداة',
  },
  {
    id: 'notif-4',
    title: 'خدمات المغتربين اللبنانيين متوفرة',
    description: 'فريق م. نصار العقارية يوفر خدمة فحص الصحيفة العقارية وإدارة الأملاك ومتابعة المعاملات عن بعد.',
    time: 'أمس',
    type: 'legal',
    read: true,
  },
  {
    id: 'notif-5',
    title: 'فرصة تجارية: مستودع مرخص في وطى المصيطبة',
    description: 'مستودع 350م² مع مدخل شاحنات وسند مفرز جاهز للاستثمار أو التخزين.',
    time: 'منذ يومين',
    type: 'listing',
    read: true,
    propertyId: 'p-6',
    actionText: 'تفاصيل المستودع',
  }
];

const STORAGE_KEY_NOTIFICATIONS = 'nassar_app_notifications_v2';

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  addNotification: (notification: Omit<AppNotification, 'id' | 'read' | 'time'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    if (typeof window === 'undefined') return DEFAULT_NOTIFICATIONS;
    try {
      const stored = localStorage.getItem(STORAGE_KEY_NOTIFICATIONS);
      return stored ? JSON.parse(stored) : DEFAULT_NOTIFICATIONS;
    } catch {
      return DEFAULT_NOTIFICATIONS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(notifications));
    } catch (e) {
      console.warn('Failed to persist notifications:', e);
    }
  }, [notifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const addNotification = (item: Omit<AppNotification, 'id' | 'read' | 'time'>) => {
    const newNotif: AppNotification = {
      ...item,
      id: `notif-${Date.now()}`,
      time: 'الآن',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
        addNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};
