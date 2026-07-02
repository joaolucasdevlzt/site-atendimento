import type { CSSProperties } from 'react';

export const ICONS = {
  inbox: 'M3 12h4l2 3h6l2-3h4M3 12v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6M3 12l3-7h12l3 7',
  list: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
  clock: 'M12 7v5l3 2 M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z',
  doc: 'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5M9 13h6M9 17h4',
  chart: 'M3 3v18h18M8 14v4M13 9v9M18 5v13',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3',
  phone:
    'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.4 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.8 2.1z',
  mail: 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 7l-10 6L2 7',
  chat: 'M21 11.5a8.4 8.4 0 0 1-9 8.4 8.4 8.4 0 0 1-3.8-.9L3 20l1.3-4.2A8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5z',
  send: 'M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z',
  check: 'M20 6 9 17l-5-5',
  checks: 'M1 13l4 4L15 7M9 13l4 4L23 5',
  user: 'M20 21a8 8 0 0 0-16 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  clip: 'M21 12.5 12.5 21a5 5 0 0 1-7-7l8.5-8.5a3.3 3.3 0 0 1 4.7 4.7L9.5 18.5a1.7 1.7 0 0 1-2.3-2.3l7.8-7.8',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  star: 'M12 3l2.6 5.3 5.9.9-4.2 4.1 1 5.8-5.3-2.8-5.3 2.8 1-5.8L3.5 9.2l5.9-.9L12 3z',
  bolt: 'M13 2 4 14h7l-1 8 9-12h-7l1-8z',
  tag: 'M20.6 13.4 12 22l-9-9V3h10l7.6 7.6a2 2 0 0 1 0 2.8zM7 7h.01',
  filter: 'M3 5h18l-7 8v6l-4-2v-4z',
  refresh: 'M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5',
  history: 'M3 3v5h5M3.05 13a9 9 0 1 0 2.6-6.4L3 8M12 7v5l3 2',
  truck:
    'M1 3h15v13H1zM16 8h4l3 3v5h-7M5.5 19a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM18.5 19a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  idcard:
    'M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zM8 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM5 16c.5-1.7 1.8-2.5 3-2.5s2.5.8 3 2.5M14 9h5M14 12h5M14 15h3',
  plus: 'M12 5v14M5 12h14',
  download: 'M12 3v12M7 11l5 4 5-4M5 21h14',
  route: 'M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM18 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM8 17h6a3 3 0 0 0 3-3V9M6 15V8',
  ai: 'M12 3l1.7 4.1L18 8.8l-4.3 1.7L12 15l-1.7-4.5L6 8.8l4.3-1.7zM5 16l.8 2 .2.8 2-.8.8-.2-.8-2-2 .8zM18 15l.6 1.6L20 17l-1.4.4-.6 1.6-.6-1.6L16 17l1.4-.4z',
  hand: 'M18 11V6a2 2 0 0 0-4 0v5M14 10V4a2 2 0 0 0-4 0v7M10 10.5V6a2 2 0 0 0-4 0v8a7 7 0 0 0 7 7h1a6 6 0 0 0 6-6v-2a2 2 0 0 0-4 0',
} as const;

export type IconName = keyof typeof ICONS;

interface IconProps {
  name: IconName;
  size?: number;
  style?: CSSProperties;
}

/** Ícone SVG traçado. Cada path é separado pelo delimitador "M". */
export function Icon({ name, size, style }: IconProps) {
  const d = ICONS[name] ?? '';
  const segments = d.split('M').filter(Boolean);
  return (
    <svg
      className="icon"
      viewBox="0 0 24 24"
      style={{ width: size, height: size, ...style }}
      aria-hidden="true"
    >
      {segments.map((seg, i) => (
        <path key={i} d={'M' + seg} />
      ))}
    </svg>
  );
}
