import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '@/components/ui/Avatar';
import { ChannelTag } from '@/components/ui/ChannelTag';
import { HandlerChip } from '@/components/ui/HandlerChip';
import { Icon } from '@/components/ui/Icon';
import { LogoMark } from '@/components/ui/Logo';
import { useAuth } from '@/hooks/useAuth';
import { useAtendimento, useFila } from '@/hooks/useAtendimentos';

/** Layout alternativo — atendimento focado (conversa em destaque). */
export function AtendimentoFocoPage() {
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();
  const { fila } = useFila();
  const [selecionado, setSelecionado] = useState('a-04812');
  const { atendimento } = useAtendimento(selecionado);

  return (
    <div className="ab optC">
      <header className="optC__bar">
        <div className="optC__wm">
          <span
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              background: 'var(--navy)',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <LogoMark size={17} />
          </span>
          FB<span style={{ color: 'var(--accent)' }}>Log</span>
          <span style={{ color: 'var(--ink-3)', fontWeight: 600 }}>&nbsp;Atende</span>
        </div>
        <nav className="optC__tabs">
          <div className="optC__tab is-active">
            <Icon name="inbox" size={17} />
            Ativos <span className="n">{fila.length}</span>
          </div>
          <div className="optC__tab">
            <Icon name="history" size={17} />
            Histórico
          </div>
          <div className="optC__tab">
            <Icon name="truck" size={17} />
            Motoristas
          </div>
          <div className="optC__tab" onClick={() => navigate('/dashboard')}>
            <Icon name="chart" size={17} />
            Desempenho
          </div>
        </nav>
        <div className="optC__me">
          <span className="dot" style={{ background: 'var(--ok)' }} />
          <span style={{ fontWeight: 600 }}>Disponível</span>
          <span onClick={logout} title="Sair" style={{ cursor: 'pointer' }}>
            <Avatar nome={usuario?.nome ?? 'Atendente'} size={34} color={usuario?.cor ?? 'violet'} />
          </span>
        </div>
      </header>

      <div className="optC__wrap">
        <aside className="optC__list">
          <div className="optC__lh">Atendimentos ativos · {fila.length}</div>
          {fila.map((t) => (
            <div
              key={t.id}
              className={'optC__item' + (t.id === selecionado ? ' is-active' : '')}
              onClick={() => setSelecionado(t.id)}
            >
              <div className="optC__irow">
                <Avatar nome={t.motoristaNome} size={34} color={t.cor} />
                <span className="optC__iname">{t.motoristaNome}</span>
                <span className="optC__itime">{t.tempo}</span>
              </div>
              <div className="optC__isub">{t.assunto}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, opacity: 0.7 }}>
                  <Icon name="truck" size={12} />
                  <span className="mono" style={{ fontWeight: 600 }}>
                    {t.placa}
                  </span>
                </div>
                <HandlerChip responsavel={t.responsavel} size={12} style={{ marginLeft: 'auto' }} />
              </div>
            </div>
          ))}
        </aside>

        {atendimento && (
          <main className="optC__stage">
            <div className="optC__hero">
              <div className="optC__eyebrow">
                {atendimento.protocolo} · {atendimento.categoria}
              </div>
              <h1 className="optC__htitle">{atendimento.assunto}</h1>
              <div className="optC__hmeta">
                <div className="it">
                  <Avatar nome={atendimento.motorista.nome} size={38} color={atendimento.motorista.cor} />
                  <div>
                    <div className="k">Motorista</div>
                    <div className="v">{atendimento.motorista.nome}</div>
                  </div>
                </div>
                <div className="it">
                  <div>
                    <div className="k">Veículo</div>
                    <div className="v">{atendimento.motorista.veiculo}</div>
                  </div>
                </div>
                <div className="it">
                  <div>
                    <div className="k">Placa</div>
                    <div className="v mono">{atendimento.motorista.placa}</div>
                  </div>
                </div>
                <div className="it">
                  <div>
                    <div className="k">ANTT</div>
                    <div className="v mono">{atendimento.motorista.antt}</div>
                  </div>
                </div>
                <div className="it">
                  <div>
                    <div className="k">Responsável</div>
                    <div className="v">
                      Você <span style={{ color: 'var(--ink-3)', fontWeight: 500 }}>(assumido da IA)</span>
                    </div>
                  </div>
                </div>
                <div className="it">
                  <div>
                    <div className="k">Sessão (24h)</div>
                    <div className="v mono" style={{ color: 'var(--ok)' }}>
                      {atendimento.sessaoRestante} restantes
                    </div>
                  </div>
                </div>
              </div>
              <div className="optC__hactions">
                <button className="btn btn--ok">
                  <Icon name="check" size={15} />
                  Fechar atendimento
                </button>
                <button className="btn">
                  <Icon name="ai" size={15} />
                  Passar para IA
                </button>
                <button className="btn">
                  <Icon name="idcard" size={15} />
                  Ver cadastro do motorista
                </button>
              </div>
            </div>

            <div className="optC__conv">
              <div className="optC__mlabel">Conversa · hoje, 23 de junho</div>
              {atendimento.mensagens
                .filter((m) => m.autor !== 'take')
                .map((m) => {
                  const quem =
                    m.autor === 'out'
                      ? 'Você'
                      : m.autor === 'ia'
                        ? 'Assistente IA'
                        : atendimento.motorista.nome;
                  const cor = m.autor === 'out' ? usuario?.cor ?? 'violet' : atendimento.motorista.cor;
                  return (
                    <div key={m.id} className="optC__turn">
                      <Avatar nome={quem} size={38} color={cor} />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 9 }}>
                          <span className="who">{quem}</span>
                          <span className="tm">{m.hora}</span>
                        </div>
                        <div className="tx">{m.texto}</div>
                      </div>
                    </div>
                  );
                })}
            </div>

            <div className="optC__reply">
              <div className="ph">Escreva sua resposta para {atendimento.motorista.nome.split(' ')[0]}…</div>
              <div className="optC__reply-actions">
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
                  Enviar
                </button>
              </div>
            </div>
          </main>
        )}
      </div>
    </div>
  );
}
