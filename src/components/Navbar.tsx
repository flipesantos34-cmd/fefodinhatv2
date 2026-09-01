import { useState } from 'react';
import { Menu, X, Trophy, Home, Info, Calendar } from 'lucide-react';
import { ThemeSelector } from './ThemeSelector';
import type { ThemeName } from '@/types';

interface NavbarProps {
  theme: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
}

const NAV_LINKS = [
  { label: 'Canais', icon: Home, href: '#canais' },
  { label: 'Agenda', icon: Calendar, href: '#agenda' },
  { label: 'Sobre', icon: Info, href: '#sobre' },
];

export function Navbar({ theme, onThemeChange }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-40 bg-bg/70 backdrop-blur-md border-b border-border transition-all"
      role="banner"
    >
      <nav className="mx-auto max-w-7xl px-5 sm:px-6 flex items-center justify-between h-16" aria-label="Navegação principal">
        
        {/* Logo clica e volta para Canais */}
        <a href="#canais" className="flex items-center gap-3 text-text-primary font-bold text-lg shrink-0">
          <span className="w-9 h-9 rounded-xs flex items-center justify-center bg-accent text-accent-contrast">
            <Trophy size={20} />
          </span>
          <span className="tracking-tight">
            Fefodinha<span className="text-accent">TV</span>
          </span>
        </a>

        {/* Menu PC */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ label, icon: Icon, href }) => (
            <li key={label}>
              <a href={href} className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:text-accent hover:bg-white/5 transition-colors rounded-lg">
                <Icon size={16} />
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeSelector theme={theme} onThemeChange={onThemeChange} />
          <button type="button" className="btn btn-ghost btn-icon md:hidden" onClick={() => setMobileOpen((v) => !v)}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Menu Celular */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-surface/95 backdrop-blur-md">
          <ul className="px-5 py-3 flex flex-col gap-1">
            {NAV_LINKS.map(({ label, icon: Icon, href }) => (
              <li key={label}>
                <a href={href} className="flex items-center gap-3 px-4 py-3 text-sm text-text-secondary hover:text-accent hover:bg-accent-dim transition-colors rounded-lg" onClick={() => setMobileOpen(false)}>
                  <Icon size={18} />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}