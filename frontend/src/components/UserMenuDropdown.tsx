import { LogOut, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogoutModal } from './LogoutModal';

function getInitials(nameOrEmail?: string) {
  if (!nameOrEmail) return 'TL';

  const pieces = nameOrEmail.includes('@')
    ? [nameOrEmail.split('@')[0]]
    : nameOrEmail.trim().split(/\s+/);

  return pieces
    .slice(0, 2)
    .map((piece) => piece.charAt(0).toUpperCase())
    .join('');
}

export default function UserMenuDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const userEmail = user?.email || 'traveler@example.com';
  const userName =
    user?.user_metadata?.full_name ||
    [user?.user_metadata?.first_name, user?.user_metadata?.last_name].filter(Boolean).join(' ') ||
    userEmail.split('@')[0];
  const userInitials = getInitials(userName || userEmail);

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

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await signOut();
      setShowLogoutConfirm(false);
      setIsOpen(false);
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      setLogoutLoading(false);
    }
  };

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 rounded-[10px] px-2 py-1.5 text-stone-700 transition hover:bg-[#F5F4F0] dark:text-stone-200 dark:hover:bg-stone-800 sm:px-3"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#714B67] text-sm font-semibold text-white">
            {userInitials}
          </div>
          <span className="hidden max-w-28 truncate text-sm font-medium sm:block">{userName}</span>
          <svg
            className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-[14px] border border-[#E8E6E0] bg-white shadow-lg dark:border-stone-700 dark:bg-stone-900">
            <div className="border-b border-[#E8E6E0] px-4 py-3 dark:border-stone-700">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#714B67] text-lg font-semibold text-white">
                  {userInitials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-[#1C1917] dark:text-stone-100">{userName}</p>
                  <p className="truncate text-xs text-stone-600 dark:text-stone-300">{userEmail}</p>
                </div>
              </div>
            </div>

            <div className="py-1">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  navigate('/profile');
                }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-stone-700 transition hover:bg-[#F5F4F0] dark:text-stone-200 dark:hover:bg-stone-800"
              >
                <User size={18} className="text-stone-400" />
                My Profile
              </button>
            </div>

            <div className="border-t border-[#E8E6E0] py-1 dark:border-stone-700">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(true)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 transition hover:bg-red-50 dark:hover:bg-red-500/10"
                disabled={logoutLoading}
              >
                <LogOut size={18} />
                {logoutLoading ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        )}
      </div>

      {showLogoutConfirm && (
        <LogoutModal
          isOpen={showLogoutConfirm}
          isLoading={logoutLoading}
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutConfirm(false)}
        />
      )}
    </>
  );
}
