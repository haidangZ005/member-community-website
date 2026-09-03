import { createElement, useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

export default function CustomSelect({ value, onChange, options, ariaLabel, className = '', compact = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const selected = options.find((option) => option.value === value) || options[0];

  useEffect(() => {
    if (!isOpen) return undefined;
    const closeOnOutsideClick = (event) => {
      if (!rootRef.current?.contains(event.target)) setIsOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isOpen]);

  return (
    <div className={`custom-select ${compact ? 'compact' : ''} ${className}`} ref={rootRef}>
      <button ref={triggerRef} className="select-trigger" type="button" aria-label={ariaLabel} aria-expanded={isOpen} onClick={() => setIsOpen((open) => !open)}>
        {selected.icon && createElement(selected.icon, { size: 18, 'aria-hidden': true })}
        <span className="select-trigger-label">{selected.label}</span>
        <ChevronDown className="select-chevron" size={16} aria-hidden="true" />
      </button>
      {isOpen && (
        <div className="select-popover">
          {options.map((option) => (
            <button key={option.value} className={`select-option ${option.value === value ? 'selected' : ''}`} type="button" onClick={() => { onChange(option.value); setIsOpen(false); triggerRef.current?.focus(); }}>
              {option.icon && createElement(option.icon, { size: 17, 'aria-hidden': true })}
              <span>{option.label}</span>
              {option.value === value && <Check size={16} aria-hidden="true" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
