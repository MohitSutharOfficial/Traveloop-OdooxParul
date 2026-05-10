import { useEffect } from 'react';

type KeyCombo = {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
};

export function useKeyboard(combo: KeyCombo, callback: (e: KeyboardEvent) => void) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!event.key || !combo.key) return;

      const match =
        event.key.toLowerCase() === combo.key.toLowerCase() &&
        (combo.ctrlKey === undefined || event.ctrlKey === combo.ctrlKey) &&
        (combo.metaKey === undefined || event.metaKey === combo.metaKey) &&
        (combo.shiftKey === undefined || event.shiftKey === combo.shiftKey) &&
        (combo.altKey === undefined || event.altKey === combo.altKey);

      if (match) {
        event.preventDefault();
        callback(event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [combo, callback]);
}
