import { Avatar } from '@/components/ui/Avatar';
import { ChannelTag } from '@/components/ui/ChannelTag';
import { HandlerChip } from '@/components/ui/HandlerChip';
import { Icon } from '@/components/ui/Icon';
import type { AvatarColor, TicketResumo } from '@/types';

const SLA_COR: Record<string, string> = {
  ok: 'var(--ok)',
  warn: 'var(--warn)',
  bad: 'var(--bad)',
};

interface TicketCardProps {
  ticket: TicketResumo;
  onSelect?: (id: string) => void;
  onAssumir?: (id: string) => void;
}

/** Cartão de atendimento na fila. */
export function TicketCard({ ticket, onSelect, onAssumir }: TicketCardProps) {
  const cor: AvatarColor = ticket.cor;
  return (
    <div
      className={'optA__ticket' + (ticket.ativo ? ' is-active' : '')}
      onClick={() => onSelect?.(ticket.id)}
    >
      <div className="optA__trow">
        <Avatar nome={ticket.motoristaNome} size={30} color={cor} />
        <span className="optA__tname">{ticket.motoristaNome}</span>
        <span className="optA__ttime">{ticket.tempo}</span>
      </div>
      <div className="optA__tsubj">{ticket.assunto}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11.5, color: 'var(--ink-3)' }}>
        <Icon name="truck" size={13} />
        {ticket.veiculo} ·{' '}
        <span className="mono" style={{ fontWeight: 600 }}>
          {ticket.placa}
        </span>
      </div>
      <div className="optA__tmeta">
        <ChannelTag canal={ticket.canal} />
        <HandlerChip responsavel={ticket.responsavel} />
        {ticket.responsavel === 'ia' && (
          <button
            className="assumir"
            onClick={(e) => {
              e.stopPropagation();
              onAssumir?.(ticket.id);
            }}
          >
            <Icon name="hand" size={12} />
            Assumir
          </button>
        )}
        <span
          className="optA__sla"
          style={{ color: SLA_COR[ticket.sessaoStatus], marginLeft: 'auto' }}
          title="Tempo restante da sessão de 24h"
        >
          ⏳ {ticket.sessaoRestante}
        </span>
      </div>
    </div>
  );
}
