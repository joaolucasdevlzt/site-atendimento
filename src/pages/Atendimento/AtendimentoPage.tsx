import { useState } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { ChannelTag } from '@/components/ui/ChannelTag';
import { Icon } from '@/components/ui/Icon';
import { NavRail } from '@/components/layout/NavRail';
import { atendimentosService } from '@/api/atendimentosService';
import { useAtendimento, useFila, useTicketRecebido } from '@/hooks/useAtendimentos';
import type { Handler } from '@/types';
import { TicketCard } from './TicketCard';
import { Conversa } from './Conversa';
import { ContextoMotorista } from './ContextoMotorista';

type Filtro = 'todos' | 'urgentes' | 'aguardando';

/** Tela principal — Console de atendimentos ativos (3 colunas). */
export function AtendimentoPage() {
  const { fila } = useFila();
  const { ticket } = useTicketRecebido();
  const [selecionado, setSelecionado] = useState('a-04812');
  const { atendimento } = useAtendimento(selecionado);
  const [filtro, setFiltro] = useState<Filtro>('todos');
  const [responsavel, setResponsavel] = useState<Handler>('you');

  return (
    <div className="ab optA">
      <NavRail active="Atender" />

      {/* Fila */}
      <section className="optA__queue">
        <div className="optA__qhead">
          <div className="optA__qtitle">
            Atendimentos ativos <span className="optA__qcount">{fila.length}</span>
          </div>
          <div className="optA__qsub">Atribuídos a você · sessões abertas (24h)</div>
          <div className="optA__filters">
            {(['todos', 'urgentes', 'aguardando'] as Filtro[]).map((f) => (
              <span
                key={f}
                className={'optA__filter' + (filtro === f ? ' is-active' : '')}
                onClick={() => setFiltro(f)}
              >
                {f === 'todos' ? 'Todos' : f === 'urgentes' ? 'Urgentes' : 'Aguardando'}
              </span>
            ))}
          </div>
        </div>

        <div className="optA__qlist">
          {ticket && (
            <div className="optA__incoming">
              <Icon name="bolt" size={18} style={{ color: 'var(--accent-d)' }} />
              <div style={{ flex: 1 }}>
                <div className="pill">NOVO TICKET RECEBIDO</div>
                <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>
                  {ticket.nome} · WhatsApp
                </div>
              </div>
              <button className="mini2" onClick={() => atendimentosService.assumirDaIa(ticket.id)}>
                <Icon name="ai" size={13} />
                Deixar com IA
              </button>
              <button
                className="btn btn--primary"
                style={{ padding: '7px 13px' }}
                onClick={() => atendimentosService.aceitarTicket(ticket.id)}
              >
                Aceitar
              </button>
            </div>
          )}

          {fila.map((t) => (
            <TicketCard
              key={t.id}
              ticket={{ ...t, ativo: t.id === selecionado }}
              onSelect={setSelecionado}
              onAssumir={(id) => atendimentosService.assumirDaIa(id)}
            />
          ))}
        </div>
      </section>

      {/* Conversa */}
      <main className="optA__main">
        {atendimento && (
          <>
            <header className="optA__chead">
              <Avatar nome={atendimento.motorista.nome} size={42} color={atendimento.motorista.cor} />
              <div>
                <h2>{atendimento.motorista.nome}</h2>
                <div className="sub">
                  <span className="mono">{atendimento.protocolo}</span> ·{' '}
                  <ChannelTag canal={atendimento.canal} /> ·{' '}
                  <span className="session" style={{ padding: '2px 8px' }}>
                    <Icon name="clock" size={13} />
                    Sessão 24h · <span className="mono">{atendimento.sessaoRestante}</span>
                  </span>
                </div>
              </div>
              <div className="optA__cactions">
                <div className="htoggle" title="Quem responde este atendimento">
                  <button
                    className={responsavel === 'you' ? 'is-on' : ''}
                    onClick={() => setResponsavel('you')}
                  >
                    <Icon name="user" size={14} />
                    Você
                  </button>
                  <button
                    className={responsavel === 'ia' ? 'is-on' : ''}
                    onClick={() => setResponsavel('ia')}
                  >
                    <Icon name="ai" size={14} />
                    IA no automático
                  </button>
                </div>
                <button className="btn">
                  <Icon name="user" size={15} />
                  Transferir
                </button>
                <button className="btn btn--ok">
                  <Icon name="check" size={15} />
                  Fechar atendimento
                </button>
              </div>
            </header>

            <div className="optA__body">
              <Conversa
                motoristaNome={atendimento.motorista.nome}
                motoristaCor={atendimento.motorista.cor}
                mensagens={atendimento.mensagens}
              />
              <ContextoMotorista atendimento={atendimento} />
            </div>

            <div className="optA__composer">
              <div className="optA__inputbar">
                Digite sua resposta para {atendimento.motorista.nome.split(' ')[0]}…
              </div>
              <div className="optA__comp-actions">
                <button className="btn">
                  <Icon name="clip" size={15} />
                  Anexar
                </button>
                <button className="btn">
                  <Icon name="doc" size={15} />
                  Resposta rápida
                </button>
                <button className="btn btn--primary" style={{ marginLeft: 'auto' }}>
                  <Icon name="send" size={15} />
                  Enviar resposta
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
