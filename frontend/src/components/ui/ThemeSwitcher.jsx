import { createElement, useEffect, useState } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import { resolveTheme } from '../../utils/theme';

const STORAGE_KEY = 'common-ground-theme';
const options = [
  { value: 'light', label: 'Sáng', icon: Sun },
  { value: 'dark', label: 'Tối', icon: Moon },
  { value: 'system', label: 'Theo thiết bị', icon: Monitor },
];

function readPreference() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return options.some(({ value }) => value === saved) ? saved : 'system';
  } catch {
    return 'system';
  }
}

export default function ThemeSwitcher({ className = '' }) {
  const [preference, setPreference] = useState(readPreference);
  const selected = options.find(({ value }) => value === preference) || options[2];

  useEffect(() => {
    const media = matchMedia('(prefers-color-scheme: dark)');
    const applyTheme = () => {
      const theme = resolveTheme(preference, media.matches);
      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = theme;
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#101713' : '#f7f4ed');
    };
    applyTheme();
    media.addEventListener('change', applyTheme);
    return () => media.removeEventListener('change', applyTheme);
  }, [preference]);

  const changeTheme = (event) => {
    const value = event.target.value;
    setPreference(value);
    try { localStorage.setItem(STORAGE_KEY, value); } catch { /* Áp dụng trong phiên hiện tại. */ }
  };

  return (
    <label className={`theme-switcher ${className}`} title={`Giao diện: ${selected.label}`}>
      {createElement(selected.icon, { size: 18, 'aria-hidden': true })}
      <select className="theme-select" value={preference} onChange={changeTheme} aria-label="Chọn giao diện">
        {options.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
      </select>
    </label>
  );
}
