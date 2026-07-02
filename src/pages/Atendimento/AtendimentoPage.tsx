import { useEffect, useMemo, useRef, useState } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { ChannelTag } from '@/components/ui/ChannelTag';
import { Icon } from '@/components/ui/Icon';
import { NavRail } from '@/components/layout/NavRail';
import { atendimentosService } from '@/api/atendimentosService';
import { useAtendimento, useFila, useTicketRecebido } from '@/hooks/useAtendimentos';
import type { Handler, Message } from '@/types';
import { TicketCard } from './TicketCard';
import { Conversa } from './Conversa';
import { ContextoMotorista } from './ContextoMotorista';

type Filtro = 'todos' | 'urgentes' | 'aguardando';

const FILTROS: { key: Filtro; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'urgentes', label: 'Urgentes' },
  { key: 'aguardando', label: 'Aguardando' },
];

/** Respostas simuladas do motorista (mock de mensagens recebidas). */
const RESPOSTAS_MOCK = [
  'Perfeito, muito obrigado pela ajuda! 👍',
  'Entendi. Vou conferir aqui e já te retorno.',
  'Show, anotei a placa e o número do protocolo.',
  'Beleza, pode deixar. Fico no aguardo do comprovante.',
  'Combinado! Qualquer coisa eu chamo por aqui mesmo.',
  'Ok, acabei de enviar a foto do documento.',
];

/** Hora atual no formato HH:MM. */
function horaAgora(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

/** Tela principal — Console de atendimentos ativos (3 colunas). */
export function AtendimentoPage() {
  const { fila } = useFila();
  const { ticket } = useTicketRecebido();
  const [selecionado, setSelecionado] = useState('a-04812');
  const { atendimento } = useAtendimento(selecionado);
  const [filtro, setFiltro] = useState<Filtro>('todos');
  const [responsavel, setResponsavel] = useState<Handler>('you');

  // Mensagens da conversa em estado local (permite enviar/receber mockado).
  const [mensagens, setMensagens] = useState<Message[]>([]);
  const [rascunho, setRascunho] = useState('');
  const [digitando, setDigitando] = useState(false);
  const respostaIdx = useRef(0);

  // Recarrega as mensagens sempre que troca o atendimento selecionado.
  useEffect(() => {
    if (atendimento) setMensagens(atendimento.mensagens);
  }, [atendimento?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const filaFiltrada = useMemo(
    () =>
      fila.filter((t) => {
        if (filtro === 'urgentes') return t.prioridade === 'bad' || t.sessaoStatus === 'bad';
        if (filtro === 'aguardando') return t.responsavel === 'ia';
        return true;
      }),
    [fila, filtro],
  );

  /** Simula uma mensagem recebida do motorista. */
  const receberMock = (texto?: string) => {
    setDigitando(true);
    window.setTimeout(() => {
      const t = texto ?? RESPOSTAS_MOCK[respostaIdx.current++ % RESPOSTAS_MOCK.length];
      setMensagens((prev) => [
        ...prev,
        { id: 'in-' + Date.now(), autor: 'in', hora: horaAgora(), texto: t },
      ]);
      setDigitando(false);
    }, 1400);
  };

  /** Envia a resposta (como Você ou como IA, conforme o toggle). */
  const enviar = () => {
    const texto = rascunho.trim();
    if (!texto || !atendimento) return;
    const autor = responsavel === 'ia' ? 'ia' : 'out';
    setMensagens((prev) => [
      ...prev,
      { id: 'out-' + Date.now(), autor, hora: horaAgora(), texto },
    ]);
    setRascunho('');
    atendimentosService.enviarMensagem(atendimento.id, texto);
    receberMock(); // resposta automática do motorista (mock)
  };

  return (
    <div className="ab optA">
      <NavRail active="Atender" />

      {/* Fila */}
      <section className="optA__queue">
        <div className="optA__qhead">
          <div className="optA__qtitle">
            Atendimentos ativos <span className="optA__qcount">{filaFiltrada.length}</span>
          </div>
          <div className="optA__qsub">Atribuídos a você · sessões abertas (24h)</div>
          <div className="optA__filters">
            {FILTROS.map((f) => (
              <span
                key={f.key}
                className={'optA__filter' + (filtro === f.key ? ' is-active' : '')}
                onClick={() => setFiltro(f.key)}
              >
                {f.label}
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

          {filaFiltrada.length === 0 && (
            <div className="optA__qempty">
              <Icon name="check" size={20} style={{ color: 'var(--ink-3)' }} />
              Nenhum atendimento neste filtro.
            </div>
          )}

          {filaFiltrada.map((t) => (
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
                mensagens={mensagens}
                digitando={digitando}
              />
              <ContextoMotorista atendimento={atendimento} />
            </div>

            <div className="optA__composer">
              <div className={'optA__inputbar' + (responsavel === 'ia' ? ' is-ia' : '')}>
                <span className="optA__sendtag">
                  <Icon name={responsavel === 'ia' ? 'ai' : 'user'} size={13} />
                  {responsavel === 'ia' ? 'Enviar como IA' : 'Enviar como você'}
                </span>
                <textarea
                  className="optA__input"
                  rows={1}
                  value={rascunho}
                  placeholder={`Digite sua resposta para ${atendimento.motorista.nome.split(' ')[0]}…`}
                  onChange={(e) => setRascunho(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      enviar();
                    }
                  }}
                />
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
                <button
                  className="btn"
                  title="Simular uma mensagem recebida do motorista"
                  onClick={() => receberMock()}
                >
                  <Icon name="refresh" size={15} />
                  Simular recebida
                </button>
                <button
                  className="btn btn--primary"
                  style={{ marginLeft: 'auto' }}
                  onClick={enviar}
                  disabled={!rascunho.trim()}
                >
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
