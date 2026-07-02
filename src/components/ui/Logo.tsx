interface LogoMarkProps {
  size?: number;
  color?: string;
}

/** Marca FBLog — pin de localização (rastreio/logística). */
export function LogoMark({ size = 22, color = '#fff' }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      style={{ width: size, height: size, display: 'block' }}
      aria-hidden="true"
    >
      <path
        fill={color}
        d="M12 2.2c-3.7 0-6.7 3-6.7 6.7 0 4.7 6.7 12.9 6.7 12.9s6.7-8.2 6.7-12.9c0-3.7-3-6.7-6.7-6.7z"
      />
      <circle cx="12" cy="9" r="2.6" fill="var(--navy)" />
    </svg>
  );
}

/** Lockup completo: pin + "FBLog" + sufixo opcional. */
export function LogoWord({ suffix = 'Atende' }: { suffix?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9, fontWeight: 800, fontSize: 16, letterSpacing: '-0.03em' }}>
      <span
        style={{
          width: 30,
          height: 30,
          borderRadius: 8,
          background: 'var(--navy)',
          display: 'grid',
          placeItems: 'center',
          flex: 'none',
        }}
      >
        <LogoMark size={19} />
      </span>
      <span style={{ color: 'var(--navy)' }}>
        FB<span style={{ color: 'var(--accent)' }}>Log</span>
        {suffix && (
          <span style={{ color: 'var(--ink-3)', fontWeight: 600, marginLeft: 4 }}>{suffix}</span>
        )}
      </span>
    </div>
  );
}
