import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Avatar } from '@/components/ui/Avatar';
import { ChannelTag } from '@/components/ui/ChannelTag';
import { Icon, type IconName } from '@/components/ui/Icon';
import { useAuth } from '@/hooks/useAuth';
import { useDashboard } from '@/hooks/useDashboard';
import type { Kpi } from '@/types';

function KpiCard({ kpi }: { kpi: Kpi }) {
  return (
    <div className="kpi">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div className="kpi__k">{kpi.k}</div>
        <div className="kpi__ic" style={{ background: kpi.fundo, color: kpi.cor }}>
          <Icon name={kpi.ic as IconName} size={17} />
        </div>
      </div>
      <div className="kpi__v">{kpi.v}</div>
      <div className={'kpi__d ' + (kpi.up ? 'up' : 'down')}>
        <Icon name={kpi.up ? 'arrow' : 'bolt'} size={13} />
        {kpi.d}
      </div>
    </div>
  );
}

/** Dashboard do atendente — KPIs, histórico pessoal, recebidos e fila. */
export function DashboardPage() {
  const { usuario } = useAuth();
  const { dashboard } = useDashboard();
  const [disponivel, setDisponivel] = useState(true);

  const statusToggle = (
    <button
      className={'app__status' + (disponivel ? ' is-on' : '')}
      onClick={() => setDisponivel((v) => !v)}
    >
      <span className="dot" style={{ background: disponivel ? 'var(--ok)' : 'var(--ink-3)' }} />
      {disponivel ? 'Disponível para atender' : 'Indisponível'}
    </button>
  );

  return (
    <AppShell
      active="Desemp."
      title="Dashboard do atendente"
      subtitle={`${usuario?.nome ?? 'Atendente'} · desempenho de hoje · 5 sessões ainda abertas`}
      actions={statusToggle}
    >
      {!dashboard ? (
        <div className="app__empty">Carregando desempenho…</div>
      ) : (
        <>
          <div className="optB__kpis">
            {dashboard.kpis.map((k, i) => (
              <KpiCard key={i} kpi={k} />
            ))}
          </div>

          <div className="optB__grid">
            <div className="card">
              <div className="card__h">
                <Icon name="history" size={18} style={{ color: 'var(--accent)' }} />
                <h3>Meu histórico de atendimentos</h3>
                <span className="link">Ver todos →</span>
              </div>
              <table className="optB__table">
                <thead>
                  <tr>
                    <th>Motorista / Protocolo</th>
                    <th>Assunto</th>
                    <th>Placa</th>
                    <th>Duração</th>
                    <th>Conversão</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.historico.map((r) => (
                    <tr key={r.protocolo}>
                      <td>
                        <div className="optB__cust">
                          <Avatar nome={r.nome} size={32} color={r.cor} />
                          <div>
                            <div className="nm">{r.nome}</div>
                            <div className="pr">{r.protocolo}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ color: 'var(--ink-2)' }}>{r.assunto}</td>
                      <td>
                        <span className="mono" style={{ fontSize: 12, fontWeight: 600 }}>
                          {r.placa}
                        </span>
                      </td>
                      <td>
                        <span className="mono" style={{ fontSize: 12.5, fontWeight: 600, color: r.duracaoCor }}>
                          {r.duracao}
                        </span>
                      </td>
                      <td>
                        <span className={'badge badge--' + r.conversaoStatus}>{r.conversao}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="card">
                <div className="card__h">
                  <span className="dot" style={{ background: 'var(--accent)' }} />
                  <h3>Recebidos agora</h3>
                </div>
                <div className="optB__feed">
                  {dashboard.recebidos.map((f) => (
                    <div key={f.id} className={'optB__fcard' + (f.novo ? ' is-new' : '')}>
                      <Avatar nome={f.nome} size={36} color={f.cor} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontWeight: 650, fontSize: 13.5 }}>{f.nome}</span>
                          <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--ink-3)' }}>
                            {f.tempo}
                          </span>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            fontSize: 11.5,
                            color: 'var(--ink-3)',
                            margin: '3px 0',
                          }}
                        >
                          <Icon name="truck" size={12} />
                          <span className="mono" style={{ fontWeight: 600 }}>
                            {f.placa}
                          </span>
                        </div>
                        <div style={{ fontSize: 12.5, color: 'var(--ink-2)', marginBottom: 8 }}>
                          {f.assunto}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                          <ChannelTag canal={f.canal} />
                          <button
                            className="btn btn--primary"
                            style={{ marginLeft: 'auto', padding: '5px 12px', fontSize: 12 }}
                          >
                            Aceitar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <div className="card__h">
                  <Icon name="list" size={17} style={{ color: 'var(--ink-3)' }} />
                  <h3>Próximos da fila</h3>
                </div>
                <div>
                  {dashboard.proximos.map((n, i) => (
                    <div key={i} className="optB__nq">
                      <span className="num">{i + 1}</span>
                      <Avatar nome={n.nome} size={30} color={n.cor} />
                      <span style={{ fontWeight: 600, fontSize: 13 }}>{n.nome}</span>
                      <span style={{ marginLeft: 'auto' }}>
                        <ChannelTag canal={n.canal} />
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--ink-3)', width: 42, textAlign: 'right' }}>
                        {n.tempo}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </AppShell>
  );
}
