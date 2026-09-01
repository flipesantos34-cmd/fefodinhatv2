import { useEffect, useRef, useState } from 'react';
import { Palette, Check } from 'lucide-react';
import type { ThemeName } from '@/types';

interface ThemeSelectorProps {
  theme: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
}

const THEMES: { id: ThemeName; label: string; swatch: string }[] = [
  { id: 'blue', label: 'Azul Neon', swatch: '#00d2ff' },
  { id: 'pink', label: 'Rosa Neon', swatch: '#ff00a0' },
  { id: 'green', label: 'Verde Neon', swatch: '#c8ff00' },
];

export function ThemeSelector({ theme, onThemeChange }: ThemeSelectorProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const escHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('keydown', escHandler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('keydown', escHandler);
    };
  }, [open]);

  const current = THEMES.find((t) => t.id === theme)!;

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        className="btn btn-ghost btn-icon"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Tema atual: ${current.label}. Alterar tema`}
        onClick={() => setOpen((v) => !v)}
      >
        <Palette size={18} aria-hidden="true" />
      </button>
      {open && (
        <div
          ref={menuRef}
          role="menu"
          aria-label="Selecionar tema"
          className="absolute right-0 top-12 z-50 w-48 surface p-3"
        >
          <p className="px-3 py-2 text-xs text-text-secondary uppercase tracking-wide">
            Tema
          </p>
          {THEMES.map((t) => (
            <button
              key={t.id}
              role="menuitemradio"
              aria-checked={theme === t.id}
              type="button"
              className="flex w-full items-center gap-3 px-3 py-3 text-sm text-text-primary hover:bg-accent-dim transition-colors rounded-xs"
              onClick={() => {
                onThemeChange(t.id);
                setOpen(false);
                buttonRef.current?.focus();
              }}
            >
              <span
                className="inline-block w-4 h-4 rounded-xs border border-border-mid"
                style={{ backgroundColor: t.swatch }}
                aria-hidden="true"
              />
              <span className="flex-1 text-left">{t.label}</span>
              {theme === t.id && (
                <Check size={16} className="text-accent" aria-hidden="true" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
