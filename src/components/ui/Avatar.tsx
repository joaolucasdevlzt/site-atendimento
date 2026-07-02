import type { CSSProperties } from 'react';
import type { AvatarColor } from '@/types';

export const AVATAR_COLORS: Record<AvatarColor, string> = {
  blue: 'oklch(0.55 0.13 256)',
  teal: 'oklch(0.58 0.1 200)',
  violet: 'oklch(0.55 0.13 300)',
  amber: 'oklch(0.62 0.13 65)',
  rose: 'oklch(0.6 0.14 10)',
  green: 'oklch(0.58 0.12 158)',
  slate: 'oklch(0.5 0.03 260)',
};

interface AvatarProps {
  nome: string;
  size?: number;
  color?: AvatarColor;
  style?: CSSProperties;
}

/** Avatar circular com iniciais. */
export function Avatar({ nome, size = 36, color = 'blue', style }: AvatarProps) {
  const iniciais = nome
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <span
      className="avatar"
      style={{
        width: size,
        height: size,
        background: AVATAR_COLORS[color],
        fontSize: size * 0.36,
        ...style,
      }}
    >
      {iniciais}
    </span>
  );
}
