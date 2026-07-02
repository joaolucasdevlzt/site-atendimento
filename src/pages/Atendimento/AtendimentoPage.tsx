import { useEffect, useMemo, useRef, useState } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { ChannelTag } from '@/components/ui/ChannelTag';
import { Icon } from '@/components/ui/Icon';
import { NavRail } from '@/components/layout/NavRail';
import { atendimentosService } from '@/api/atendimentosService';
import { useAtendimento, useFila, useTicketRecebido } from '@/hooks/useAtendimentos';
import type { Handler, Message, TicketResumo } from '@/types';
import { TicketCard } from './TicketCard';
import { Conversa } from './Conversa';
import { ContextoMotorista } from './ContextoMotorista';

type Filtro = 'todos' | 'urgentes' | 'aguardando';

const FILTROS: { key: Filtro; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'urgentes', label: 'Urgentes' },
  { key: 'aguardando', label: 'Aguardando' },
];

/** Respostas rápidas do atendente (templates). */
const RESPOSTAS_RAPIDAS = [
  'Olá! Aqui é da FBLog Atende. Como posso te ajudar?',
  'Só um instante, já estou verificando isso no sistema.',
  'Localizei seu protocolo, vou resolver agora mesmo.',
  'Pode me enviar a foto do documento por aqui, por favor?',
  'Prontinho! Posso ajudar em mais alguma coisa?',
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
  const [filaLocal, setFilaLocal] = useState<TicketResumo[]>([]);
  const [selecionado, setSelecionado] = useState('a-04812');
  const { atendimento } = useAtendimento(selecionado);
  const [filtro, setFiltro] = useState<Filtro>('todos');

  // Quem responde por ticket (Você/IA), conversa por ticket e rascunho.
  const [handlerPorId, setHandlerPorId] = useState<Record<string, Handler>>({});
  const [threads, setThreads] = useState<Record<string, Message[]>>({});
  const [rascunho, setRascunho] = useState('');
  const [digitandoId, setDigitandoId] = useState<string | null>(null);
  const [menuRapidas, setMenuRapidas] = useState(false);
  const [ticketVisivel, setTicketVisivel] = useState(true);
  const [aviso, setAviso] = useState('');

  const respostaIdx = useRef(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const timers = useRef<number[]>([]);

  // Fila mockada -> estado local (permite encerrar/assumir/aceitar).
  useEffect(() => {
    if (fila.length) setFilaLocal((prev) => (prev.length ? prev : fila));
  }, [fila]);

  // Semeia a conversa e o responsável ao abrir um atendimento ainda não visto.
  useEffect(() => {
    if (!atendimento) return;
    setThreads((t) => (t[atendimento.id] ? t : { ...t, [atendimento.id]: atendimento.mensagens }));
    setHandlerPorId((h) => (atendimento.id in h ? h : { ...h, [atendimento.id]: atendimento.responsavel }));
  }, [atendimento]);

  // Toast some sozinho; timers são limpos ao desmontar.
  useEffect(() => {
    if (!aviso) return;
    const t = setTimeout(() => setAviso(''), 2600);
    return () => clearTimeout(t);
  }, [aviso]);
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const responsavel: Handler = handlerPorId[selecionado] ?? atendimento?.responsavel ?? 'you';
  const mensagens = threads[selecionado] ?? atendimento?.mensagens ?? [];

  const adiciona = (id: string, msg: Message) =>
    setThreads((t) => ({ ...t, [id]: [...(t[id] ?? []), msg] }));

  const setResponsavel = (h: Handler) => setHandlerPorId((m) => ({ ...m, [selecionado]: h }));

  const filaFiltrada = useMemo(
    () =>
      filaLocal.filter((t) => {
        if (filtro === 'urgentes') return t.prioridade === 'bad' || t.sessaoStatus === 'bad';
        if (filtro === 'aguardando') return t.responsavel === 'ia';
        return true;
      }),
    [filaLocal, filtro],
  );

  /** Simula uma mensagem recebida do motorista. */
  const receberMock = (id: string, texto?: string) => {
    setDigitandoId(id);
    const t = window.setTimeout(() => {
      const msg = texto ?? RESPOSTAS_MOCK[respostaIdx.current++ % RESPOSTAS_MOCK.length];
      adiciona(id, { id: 'in-' + Date.now(), autor: 'in', hora: horaAgora(), texto: msg });
      setDigitandoId((cur) => (cur === id ? null : cur));
    }, 1400);
    timers.current.push(t);
  };

  /** Envia a resposta (como Você ou como IA, conforme o toggle). */
  const enviar = () => {
    const texto = rascunho.trim();
    if (!texto || !atendimento) return;
    const autor = responsavel === 'ia' ? 'ia' : 'out';
    adiciona(selecionado, { id: 'out-' + Date.now(), autor, hora: horaAgora(), texto });
    setRascunho('');
    setMenuRapidas(false);
    atendimentosService.enviarMensagem(selecionado, texto);
    receberMock(selecionado); // resposta automática do motorista (mock)
  };

  const usarResposta = (texto: string) => {
    setRascunho((r) => (r.trim() ? r.trimEnd() + ' ' + texto : texto));
    setMenuRapidas(false);
  };

  const anexar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    adiciona(selecionado, { id: 'file-' + Date.now(), autor: 'out', hora: horaAgora(), texto: `📎 ${file.name}` });
    setAviso('Anexo enviado ao motorista');
    receberMock(selecionado, 'Recebi o arquivo, obrigado!');
    e.target.value = '';
  };

  const assumir = (id: string) => {
    setHandlerPorId((m) => ({ ...m, [id]: 'you' }));
    setFilaLocal((f) => f.map((t) => (t.id === id ? { ...t, responsavel: 'you' } : t)));
    setSelecionado(id);
    // Só insere o marcador se a conversa já foi carregada (evita perder o histórico semeado).
    if (threads[id]) {
      adiciona(id, { id: 'take-' + Date.now(), autor: 'take', texto: `Você assumiu o atendimento da IA · ${horaAgora()}` });
    }
    setAviso('Você assumiu o atendimento');
  };

  const encerrar = () => {
    if (!atendimento) return;
    const restantes = filaLocal.filter((t) => t.id !== selecionado);
    atendimentosService.fecharAtendimento(selecionado);
    setFilaLocal(restantes);
    setSelecionado(restantes[0]?.id ?? '');
    setAviso(`Atendimento ${atendimento.protocolo} encerrado ✓`);
  };

  const aceitarRecebido = () => {
    if (!ticket) return;
    const novo: TicketResumo = {
      id: ticket.id,
      protocolo: '#FB-2026-04833',
      motoristaNome: ticket.nome,
      assunto: ticket.assunto ?? 'Frete de retorno disponível?',
      canal: ticket.canal,
      veiculo: 'Volvo FH 460',
      placa: ticket.placa ?? 'SGT-6P21',
      tempo: 'agora',
      sessaoRestante: '23h58',
      sessaoStatus: 'ok',
      prioridade: 'warn',
      responsavel: 'you',
      cor: ticket.cor,
    };
    setFilaLocal((f) => (f.some((t) => t.id === novo.id) ? f : [novo, ...f]));
    setHandlerPorId((m) => ({ ...m, [novo.id]: 'you' }));
    setSelecionado(novo.id);
    setTicketVisivel(false);
    setAviso('Ticket aceito — atendimento iniciado');
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
          {ticket && ticketVisivel && (
            <div className="optA__incoming">
              <Icon name="bolt" size={18} style={{ color: 'var(--accent-d)' }} />
              <div style={{ flex: 1 }}>
                <div className="pill">NOVO TICKET RECEBIDO</div>
                <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>
                  {ticket.nome} · WhatsApp
                </div>
              </div>
              <button className="mini2" onClick={() => setTicketVisivel(false)}>
                <Icon name="ai" size={13} />
                Deixar com IA
              </button>
              <button className="btn btn--primary" style={{ padding: '7px 13px' }} onClick={aceitarRecebido}>
                Aceitar
              </button>
            </div>
          )}

          {filaFiltrada.length === 0 && (
            <div className="optA__qempty">
              <Icon name="checks" size={22} style={{ color: 'var(--ok)' }} />
              Nenhum atendimento neste filtro.
            </div>
          )}

          {filaFiltrada.map((t) => (
            <TicketCard
              key={t.id}
              ticket={{ ...t, ativo: t.id === selecionado }}
              onSelect={setSelecionado}
              onAssumir={assumir}
            />
          ))}
        </div>
      </section>

      {/* Conversa */}
      <main className="optA__main">
        {atendimento && selecionado ? (
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
                  <button className={responsavel === 'you' ? 'is-on' : ''} onClick={() => setResponsavel('you')}>
                    <Icon name="user" size={14} />
                    Você
                  </button>
                  <button className={responsavel === 'ia' ? 'is-on' : ''} onClick={() => setResponsavel('ia')}>
                    <Icon name="ai" size={14} />
                    IA no automático
                  </button>
                </div>
                <button className="btn" onClick={() => setAviso('Transferência registrada (mock)')}>
                  <Icon name="user" size={15} />
                  Transferir
                </button>
                <button className="btn btn--ok" onClick={encerrar}>
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
                digitando={digitandoId === selecionado}
              />
              <ContextoMotorista atendimento={atendimento} />
            </div>

            <div className="optA__composer">
              {menuRapidas && (
                <div className="qr">
                  <div className="qr__title">Respostas rápidas</div>
                  {RESPOSTAS_RAPIDAS.map((r) => (
                    <button key={r} className="qr__item" onClick={() => usarResposta(r)}>
                      {r}
                    </button>
                  ))}
                </div>
              )}
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
                <input ref={fileRef} type="file" hidden onChange={anexar} />
                <button className="btn" onClick={() => fileRef.current?.click()}>
                  <Icon name="clip" size={15} />
                  Anexar
                </button>
                <button
                  className={'btn' + (menuRapidas ? ' is-on' : '')}
                  onClick={() => setMenuRapidas((v) => !v)}
                >
                  <Icon name="doc" size={15} />
                  Resposta rápida
                </button>
                <button
                  className="btn"
                  title="Simular uma mensagem recebida do motorista"
                  onClick={() => receberMock(selecionado)}
                >
                  <Icon name="refresh" size={15} />
                  Simular recebida
                </button>
                <span className="optA__hint">Enter envia · Shift+Enter quebra linha</span>
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
        ) : (
          <div className="optA__mainempty">
            <Icon name="checks" size={30} style={{ color: 'var(--ok)' }} />
            <h2>Tudo em dia!</h2>
            <p>Você não tem atendimentos abertos. Novos tickets aparecem na fila à esquerda.</p>
          </div>
        )}
      </main>

      {aviso && (
        <div className="toast">
          <Icon name="check" size={15} />
          {aviso}
        </div>
      )}
    </div>
  );
}
