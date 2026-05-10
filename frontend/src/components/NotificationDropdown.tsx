import { Bell, CheckCheck, Clock, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  read: boolean;
  timestamp: Date;
}

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Paris Trip',
      message: 'Paris trip starts in 3 days',
      type: 'info',
      read: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 25),
    },
    {
      id: '2',
      title: 'Budget Alert',
      message: 'Budget alert: 80% spent on Bali trip',
      type: 'warning',
      read: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
    {
      id: '3',
      title: 'Itinerary Ready',
      message: 'Tokyo itinerary is ready for your final review',
      type: 'success',
      read: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
  ]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((notification) => !notification.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const markAsRead = (id: string) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((current) => current.map((notification) => ({ ...notification, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((current) => current.filter((notification) => notification.id !== id));
  };

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'warning':
        return 'bg-fuchsia-50 text-fuchsia-700 dark:bg-fuchsia-400/10 dark:text-fuchsia-300';
      case 'success':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300';
      default:
        return 'bg-sky-50 text-sky-700 dark:bg-sky-400/10 dark:text-sky-300';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-[10px] p-2 text-stone-600 transition hover:bg-[#F5F4F0] hover:text-[#714B67] dark:text-stone-300 dark:hover:bg-stone-800"
        title="Travel notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#714B67] text-[10px] font-semibold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-[22rem] overflow-hidden rounded-[14px] border border-[#E8E6E0] bg-white shadow-lg dark:border-stone-700 dark:bg-stone-900 sm:w-96">
          <div className="flex items-center justify-between border-b border-[#E8E6E0] px-4 py-3 dark:border-stone-700">
            <div className="flex items-center gap-2">
              <Bell size={18} className="text-[#714B67]" />
              <h3 className="font-sora text-sm font-semibold text-[#1C1917] dark:text-stone-100">
                Notifications
              </h3>
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="flex items-center gap-1 text-xs font-medium text-[#5D3E55] hover:underline dark:text-fuchsia-300"
              >
                <CheckCheck size={14} />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-12 text-center text-stone-500 dark:text-stone-400">
                <Bell size={42} className="mx-auto mb-3 opacity-40" />
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`border-b border-[#E8E6E0] px-4 py-3 transition hover:bg-[#F5F4F0] dark:border-stone-800 dark:hover:bg-stone-800 ${
                    !notification.read ? 'bg-fuchsia-50/50 dark:bg-fuchsia-400/5' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${getTypeColor(notification.type)}`}>
                      <Clock size={16} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-semibold text-[#1C1917] dark:text-stone-100">
                          {notification.title}
                        </h4>
                        <button
                          type="button"
                          onClick={() => deleteNotification(notification.id)}
                          className="flex-shrink-0 text-stone-400 transition hover:text-red-600"
                          title="Delete notification"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <p className="mt-1 text-xs text-stone-600 dark:text-stone-300">
                        {notification.message}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-stone-500 dark:text-stone-400">
                          {getTimeAgo(notification.timestamp)}
                        </span>
                        {!notification.read && (
                          <button
                            type="button"
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs font-medium text-[#5D3E55] hover:underline dark:text-fuchsia-300"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
