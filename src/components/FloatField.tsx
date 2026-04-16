'use client';

import { ChevronDown } from 'lucide-react';

type Transform = 'capitalize' | 'uppercase' | 'lowercase' | 'phone' | 'none';

function applyTransform(value: string, transform: Transform): string {
  switch (transform) {
    case 'capitalize':
      return value.replace(/[^a-zA-ZÀ-ÿ\s-]/g, '').replace(/\b\w/g, (c) => c.toUpperCase());
    case 'uppercase':
      return value.replace(/[^a-zA-ZÀ-ÿ\s-]/g, '').toUpperCase();
    case 'lowercase':
      return value.toLowerCase();
    case 'phone':
      return value.replace(/[^\d+]/g, '').replace(/(?!^)\+/g, '');
    default:
      return value;
  }
}

interface FloatInputProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  transform?: Transform;
  error?: boolean;
}

export function FloatInput({ id, label, type = 'text', value, onChange, required = false, transform = 'none', error = false }: FloatInputProps) {
  const borderClass = error
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
    : 'border-[var(--color-card-border)] focus:border-primary focus:ring-primary/20';
  return (
    <div className="relative">
      <input
        type={type}
        id={id}
        value={value}
        onChange={(e) => onChange(applyTransform(e.target.value, transform))}
        placeholder=" "
        className={`peer w-full bg-surface-container-low border rounded-xl pt-6 pb-2 px-4 text-sm focus:ring-2 ${borderClass}`}
      />
      <label
        htmlFor={id}
        className="absolute left-4 top-[50%] -translate-y-[50%] text-sm text-on-surface/40 pointer-events-none transition-all duration-200 peer-focus:top-[10px] peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-[10px] peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-primary"
      >
        {label}{required && <span className="text-red-500"> *</span>}
      </label>
    </div>
  );
}

interface FloatTextareaProps {
  id: string;
  label: string;
  rows?: number;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

interface FloatSelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  options: { value: string; label: string }[];
}

export function FloatSelect({ id, label, value, onChange, required = false, options }: FloatSelectProps) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="peer w-full bg-surface-container-low border border-[var(--color-card-border)] rounded-xl pt-6 pb-2 px-4 pr-10 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none"
      >
        <option value=""></option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <label
        htmlFor={id}
        className={`absolute left-4 pointer-events-none transition-all duration-200 ${value ? 'top-[10px] translate-y-0 text-xs text-primary' : 'top-[50%] -translate-y-[50%] text-sm text-on-surface/40'}`}
      >
        {label}{required && <span className="text-red-500"> *</span>}
      </label>
      <ChevronDown className="absolute right-4 top-[50%] -translate-y-[50%] w-4 h-4 text-on-surface/40 pointer-events-none" />
    </div>
  );
}

export function FloatTextarea({ id, label, rows = 6, value, onChange, required = false }: FloatTextareaProps) {
  return (
    <div className="relative">
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder=" "
        className="peer w-full bg-surface-container-low border border-[var(--color-card-border)] rounded-xl pt-6 pb-2 px-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
      />
      <label
        htmlFor={id}
        className="absolute left-4 top-[18px] -translate-y-[50%] text-sm text-on-surface/40 pointer-events-none transition-all duration-200 peer-focus:top-[10px] peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-[10px] peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-primary"
      >
        {label}{required && <span className="text-red-500"> *</span>}
      </label>
    </div>
  );
}
