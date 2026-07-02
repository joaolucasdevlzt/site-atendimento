import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { NavRail } from './NavRail';

interface AppShellProps {
  /** Rótulo do item ativo na barra lateral (ex.: 'Motor.'). */
  active: string;
  title: string;
  subtitle?: string;
  /** Ações à direita do cabeçalho (botões, toggles…). */
  actions?: ReactNode;
  /** Mostra o campo de busca no cabeçalho. */
  search?: boolean;
  onSearch?: (termo: string) => void;
  searchPlaceholder?: string;
  children: ReactNode;
}

/**
 * Casca padrão das páginas internas: barra lateral fixa (NavRail) +
 * cabeçalho + área de conteúdo rolável. Mantém a navegação sempre
 * na lateral, em todas as telas.
 */
export function AppShell({
  active,
  title,
  subtitle,
  actions,
  search,
  onSearch,
  searchPlaceholder = 'Buscar protocolo, motorista, placa…',
  children,
}: AppShellProps) {
  const navigate = useNavigate();

  return (
    <div className="ab optA app">
      <NavRail active={active} />
      <div className="app__main">
        <header className="app__top">
          <div className="app__titles">
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
          {search && (
            <label className="app__search">
              <Icon name="search" size={16} />
              <input
                type="text"
                placeholder={searchPlaceholder}
                onChange={(e) => onSearch?.(e.target.value)}
              />
            </label>
          )}
          {actions && <div className="app__actions">{actions}</div>}
        </header>
        <div className="app__scroll">{children}</div>
      </div>
    </div>
  );
}

/** Cartão de indicador (KPI) reutilizável nas páginas internas. */
export function StatCard({
  label,
  value,
  hint,
  tone = 'accent',
  icon,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  tone?: 'accent' | 'ok' | 'warn' | 'bad' | 'mut';
  icon?: Parameters<typeof Icon>[0]['name'];
}) {
  const toneColor: Record<string, string> = {
    accent: 'var(--accent)',
    ok: 'var(--ok)',
    warn: 'var(--warn)',
    bad: 'var(--bad)',
    mut: 'var(--ink-3)',
  };
  const toneFill: Record<string, string> = {
    accent: 'var(--accent-sf)',
    ok: 'var(--ok-sf)',
    warn: 'var(--warn-sf)',
    bad: 'var(--bad-sf)',
    mut: 'var(--surface-3)',
  };
  return (
    <div className="kpi">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div className="kpi__k">{label}</div>
        {icon && (
          <div className="kpi__ic" style={{ background: toneFill[tone], color: toneColor[tone] }}>
            <Icon name={icon} size={17} />
          </div>
        )}
      </div>
      <div className="kpi__v" style={{ color: toneColor[tone] }}>
        {value}
      </div>
      {hint && <div className="kpi__d" style={{ color: 'var(--ink-3)' }}>{hint}</div>}
    </div>
  );
}
