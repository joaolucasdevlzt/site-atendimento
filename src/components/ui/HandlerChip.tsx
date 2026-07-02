import type { CSSProperties } from 'react';
import type { Handler } from '@/types';
import { Icon } from './Icon';

interface HandlerChipProps {
  responsavel: Handler;
  size?: number;
  style?: CSSProperties;
}

/** Chip indicando quem conduz o atendimento: Você ou IA. */
export function HandlerChip({ responsavel, size = 13, style }: HandlerChipProps) {
  const isIa = responsavel === 'ia';
  return (
    <span className={'hand ' + (isIa ? 'hand--ia' : 'hand--you')} style={style}>
      <Icon name={isIa ? 'ai' : 'user'} size={size} />
      {isIa ? 'IA' : 'Você'}
    </span>
  );
}
