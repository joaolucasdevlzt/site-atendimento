import { Avatar } from '@/components/ui/Avatar';
import { ChannelTag } from '@/components/ui/ChannelTag';
import { HandlerChip } from '@/components/ui/HandlerChip';
import { Icon } from '@/components/ui/Icon';
import type { HistoricoAtendimento, MotoristaFrota, MotoristaStatus } from '@/types';

const STATUS_META: Record<
  MotoristaStatus,
  { label: string; badge: 'ok' | 'blue' | 'warn' | 'bad' | 'mut' }
> = {
  disponivel: { label: 'Disponível', badge: 'ok' },
  em_carga: { label: 'Em carga', badge: 'blue' },
  descanso: { label: 'Descanso', badge: 'warn' },
  manutencao: { label: 'Manutenção', badge: 'bad' },
  offline: { label: 'Offline', badge: 'mut' },
};

const FRETE_STATUS: Record<string, { label: string; badge: 'ok' | 'blue' | 'bad' }> = {
  entregue: { label: 'Entregue', badge: 'ok' },
  em_curso: { label: 'Em curso', badge: 'blue' },
  cancelado: { label: 'Cancelado', badge: 'bad' },
};

/** Situação da CNH a partir de "MM/AAAA" (relativo a hoje). */
function situacaoCnh(validade: string): { texto: string; tom: 'ok' | 'warn' | 'bad' } {
  const [mes, ano] = validade.split('/').map(Number);
  if (!mes || !ano) return { texto: 'CNH válida', tom: 'ok' };
  const venc = new Date(ano, mes, 0); // último dia do mês de validade
  const hoje = new Date();
  const meses = (venc.getFullYear() - hoje.getFullYear()) * 12 + (venc.getMonth() - hoje.getMonth());
  if (meses < 0) return { texto: 'CNH vencida', tom: 'bad' };
  if (meses <= 3) return { texto: 'Vence em breve', tom: 'warn' };
  return { texto: 'CNH válida', tom: 'ok' };
}

interface Props {
  motorista: MotoristaFrota;
  atendimentos?: HistoricoAtendimento[];
  onClose: () => void;
}

/** Painel deslizante com a visão completa de um motorista. */
export function MotoristaDetalhe({ motorista: m, atendimentos = [], onClose }: Props) {
  const st = STATUS_META[m.status];
  const cnh = situacaoCnh(m.validadeCnh);
  const online = m.status !== 'offline';

  return (
    <div className="drawer" onClick={onClose}>
      <aside className="drawer__panel" onClick={(e) => e.stopPropagation()}>
        {/* Cabeçalho */}
        <header className="drawer__head">
          <button className="drawer__close" onClick={onClose} aria-label="Fechar">
            <Icon name="close" size={18} />
          </button>
          <div className="drawer__hero">
            <span className={'presence presence--lg' + (online ? ' is-on' : '')}>
              <Avatar nome={m.nome} size={64} color={m.cor} />
            </span>
            <div style={{ minWidth: 0 }}>
              <div className="drawer__name">
                {m.nome}
                {!m.cadastroCompleto && <span className="dot-warn" title="Cadastro incompleto" />}
              </div>
              <div className="drawer__badges">
                <span className={'badge badge--' + (online ? 'ok' : 'mut')}>
                  <span className="dot" style={{ background: online ? 'var(--ok)' : 'var(--ink-3)' }} />
                  {online ? 'Online' : 'Offline'}
                </span>
                <span className={'badge badge--' + st.badge}>{st.label}</span>
                {m.avaliacao != null && (
                  <span className="drawer__rate">
                    <Icon name="star" size={13} />
                    {m.avaliacao.toFixed(1)}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="drawer__contact">
            <a className="btn btn--primary" href={`tel:${m.telefone.replace(/\D/g, '')}`}>
              <Icon name="phone" size={15} />
              {m.telefone}
            </a>
            {m.email && (
              <a className="btn" href={`mailto:${m.email}`} title={m.email}>
                <Icon name="mail" size={15} />
                E-mail
              </a>
            )}
          </div>
        </header>

        <div className="drawer__scroll">
          {/* Métricas rápidas */}
          <div className="drawer__stats">
            <div className="drawer__stat">
              <Icon name="route" size={16} />
              <b>{m.fretesMes}</b>
              <span>fretes no mês</span>
            </div>
            <div className="drawer__stat">
              <Icon name="pin" size={16} />
              <b>{m.localizacao}</b>
              <span>localização atual</span>
            </div>
            <div className="drawer__stat">
              <Icon name="calendar" size={16} />
              <b>{m.desde ?? '—'}</b>
              <span>na frota desde</span>
            </div>
          </div>

          {/* Frete atual */}
          {m.frete && (
            <section className="drawer__sec">
              <div className="drawer__slabel">
                <Icon name="truck" size={14} /> Frete em andamento
              </div>
              <div className="drawer__frete">
                <div className="drawer__rota">
                  {m.frete.origem} <Icon name="arrow" size={14} /> {m.frete.destino}
                </div>
                <div className="prog">
                  <div className="prog__bar" style={{ width: m.frete.progresso + '%' }} />
                </div>
                <div className="drawer__fretemeta">
                  <span>{m.frete.progresso}% percorrido</span>
                  <span>chega {m.frete.eta}</span>
                </div>
              </div>
            </section>
          )}

          {/* Veículo */}
          <section className="drawer__sec">
            <div className="drawer__slabel">
              <Icon name="truck" size={14} /> Veículo
            </div>
            <div className="drawer__grid">
              <div className="drawer__field">
                <span className="k">Modelo</span>
                <span className="v">{m.veiculo}</span>
              </div>
              <div className="drawer__field">
                <span className="k">Placa</span>
                <span className="v mono">{m.placa}</span>
              </div>
              <div className="drawer__field">
                <span className="k">Categoria CNH exigida</span>
                <span className="v">{m.categoria}</span>
              </div>
              <div className="drawer__field">
                <span className="k">Cidade base</span>
                <span className="v">{m.cidadeBase ?? '—'}</span>
              </div>
            </div>
          </section>

          {/* Documentação */}
          <section className="drawer__sec">
            <div className="drawer__slabel">
              <Icon name="idcard" size={14} /> Documentação
              <span className={'badge badge--' + (cnh.tom === 'ok' ? 'ok' : cnh.tom)} style={{ marginLeft: 'auto' }}>
                {cnh.texto}
              </span>
            </div>
            <div className="drawer__grid">
              <div className="drawer__field">
                <span className="k">Nº da CNH</span>
                <span className="v mono">{m.cnh}</span>
              </div>
              <div className="drawer__field">
                <span className="k">Categoria</span>
                <span className="v">{m.categoria}</span>
              </div>
              <div className="drawer__field">
                <span className="k">Validade CNH</span>
                <span className="v">{m.validadeCnh}</span>
              </div>
              <div className="drawer__field">
                <span className="k">ANTT (RNTRC)</span>
                <span className="v mono">{m.antt}</span>
              </div>
            </div>
          </section>

          {/* Histórico de fretes */}
          <section className="drawer__sec">
            <div className="drawer__slabel">
              <Icon name="history" size={14} /> Histórico de fretes
              <span className="optA__hcount" style={{ marginLeft: 'auto' }}>
                {m.fretesHistorico.length}
              </span>
            </div>
            <div className="drawer__fretes">
              {m.fretesHistorico.map((f) => {
                const fs = FRETE_STATUS[f.status];
                return (
                  <div className="drawer__frow" key={f.id}>
                    <div className="drawer__ficon" data-st={f.status}>
                      <Icon name="route" size={15} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="drawer__frota">{f.rota}</div>
                      <div className="drawer__fdata">{f.data}</div>
                    </div>
                    <div className="drawer__fvalor">{f.valor}</div>
                    <span className={'badge badge--' + fs.badge}>{fs.label}</span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Histórico de atendimentos */}
          <section className="drawer__sec">
            <div className="drawer__slabel">
              <Icon name="inbox" size={14} /> Histórico de atendimentos
              <span className="optA__hcount" style={{ marginLeft: 'auto' }}>
                {atendimentos.length}
              </span>
            </div>
            {atendimentos.length === 0 ? (
              <div className="drawer__empty">Nenhum atendimento registrado para este motorista.</div>
            ) : (
              <div className="drawer__ats">
                {atendimentos.map((a) => (
                  <div className="drawer__at" key={a.id}>
                    <div className="drawer__atline" />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="drawer__attop">
                        <span className="drawer__atsubj">{a.assunto}</span>
                        <span className={'badge badge--' + a.conversaoStatus}>{a.conversao}</span>
                      </div>
                      <div className="drawer__atmeta">
                        <span className="mono">{a.protocolo}</span>
                        <ChannelTag canal={a.canal} />
                        <HandlerChip responsavel={a.resolvidoPor} size={12} />
                        <span className="drawer__atdate">{a.dataLabel}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </aside>
    </div>
  );
}
