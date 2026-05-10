import { Monitor, Moon, PanelLeft, PanelTop, Palette, Sun } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';
type LayoutStyle = 'top' | 'sidebar';

function getInitialTheme(): Theme {
  const storedTheme = localStorage.getItem('theme');
  return storedTheme === 'dark' || storedTheme === 'system' ? storedTheme : 'light';
}

export default function AppearanceDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [layoutStyle, setLayoutStyle] = useState<LayoutStyle>(() => {
    return (localStorage.getItem('layoutStyle') as LayoutStyle) || 'top';
  });

  const dropdownRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');

    const applyTheme = () => {
      root.classList.remove('light', 'dark');
      if (theme === 'system') {
        root.classList.add(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        return;
      }
      root.classList.add(theme);
    };

    applyTheme();
    localStorage.setItem('theme', theme);

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener('change', applyTheme);
    return () => media.removeEventListener('change', applyTheme);
  }, [theme]);

  useEffect(() => {
    document.body.setAttribute('data-layout', layoutStyle);
    localStorage.setItem('layoutStyle', layoutStyle);
    window.dispatchEvent(new Event('layoutChange'));
  }, [layoutStyle]);

  const themeOptions = [
    { value: 'light' as Theme, label: 'Light', icon: Sun },
    { value: 'dark' as Theme, label: 'Dark', icon: Moon },
    { value: 'system' as Theme, label: 'System', icon: Monitor },
  ];

  const layoutOptions = [
    { value: 'top' as LayoutStyle, label: 'Top', icon: PanelTop },
    { value: 'sidebar' as LayoutStyle, label: 'Sidebar', icon: PanelLeft },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-[10px] p-2 text-stone-600 transition hover:bg-[#F5F4F0] hover:text-[#714B67] dark:text-stone-300 dark:hover:bg-stone-800"
        title="Appearance settings"
      >
        <Palette size={20} />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-[14px] border border-[#E8E6E0] bg-white shadow-lg dark:border-stone-700 dark:bg-stone-900">
          <div className="border-b border-[#E8E6E0] px-4 py-3 dark:border-stone-700">
            <h3 className="font-sora text-sm font-semibold text-[#1C1917] dark:text-stone-100">
              Appearance
            </h3>
          </div>

          <div className="space-y-4 p-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
                Theme
              </p>
              <div className="grid grid-cols-3 gap-2">
                {themeOptions.map((option) => {
                  const Icon = option.icon;
                  const isActive = theme === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setTheme(option.value)}
                      className={`flex flex-col items-center gap-1 rounded-[10px] px-2 py-2 text-xs font-medium transition ${
                        isActive
                          ? 'bg-[#714B67] text-white'
                          : 'bg-[#F5F4F0] text-stone-600 hover:bg-fuchsia-50 hover:text-[#5D3E55] dark:bg-stone-800 dark:text-stone-300'
                      }`}
                    >
                      <Icon size={16} />
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
                Layout
              </p>
              <div className="grid grid-cols-2 gap-2">
                {layoutOptions.map((option) => {
                  const Icon = option.icon;
                  const isActive = layoutStyle === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setLayoutStyle(option.value)}
                      className={`flex items-center justify-center gap-2 rounded-[10px] px-3 py-2 text-sm font-medium transition ${
                        isActive
                          ? 'bg-[#714B67] text-white'
                          : 'bg-[#F5F4F0] text-stone-600 hover:bg-fuchsia-50 hover:text-[#5D3E55] dark:bg-stone-800 dark:text-stone-300'
                      }`}
                    >
                      <Icon size={16} />
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
