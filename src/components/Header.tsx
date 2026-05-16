import { LayoutGrid, List, Moon, Sun, CheckSquare } from 'lucide-react';
import type { Theme, ViewMode } from '../types';

interface HeaderProps {
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
  theme: Theme;
  onToggleTheme: () => void;
}

export function Header({ view, onViewChange, theme, onToggleTheme }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg-primary/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-white shadow-glow">
            <CheckSquare className="h-5 w-5" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-xl font-bold leading-none sm:text-2xl">TaskFlow</h1>
            <p className="mt-1 hidden text-xs text-text-secondary sm:block">
              Plan it. Track it. Ship it.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            className="inline-flex items-center rounded-xl border border-border bg-bg-secondary p-1"
            role="group"
            aria-label="View mode"
          >
            <button
              type="button"
              onClick={() => onViewChange('list')}
              aria-pressed={view === 'list'}
              aria-label="List view"
              className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                view === 'list'
                  ? 'bg-accent text-white shadow'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewChange('card')}
              aria-pressed={view === 'card'}
              aria-label="Card view"
              className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                view === 'card'
                  ? 'bg-accent text-white shadow'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-bg-secondary text-text-secondary transition-colors hover:text-text-primary"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
