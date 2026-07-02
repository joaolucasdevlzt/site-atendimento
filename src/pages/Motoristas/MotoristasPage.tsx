import { useMemo, useState } from 'react';
import { AppShell, StatCard } from '@/components/layout/AppShell';
import { Avatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import { useMotoristas } from '@/hooks/useMotoristas';
import type { MotoristaStatus } from '@/types';

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

type Filtro = 'todos' | MotoristaStatus;

const FILTROS: { key: Filtro; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'disponivel', label: 'Disponíveis' },
  { key: 'em_carga', label: 'Em carga' },
  { key: 'descanso', label: 'Descanso' },
  { key: 'manutencao', label: 'Manutenção' },
  { key: 'offline', label: 'Offline' },
];

/** Frota de motoristas — visão de gestão (status, frete atual, localização). */
export function MotoristasPage() {
  const { motoristas, loading } = useMotoristas();
  const [filtro, setFiltro] = useState<Filtro>('todos');
  const [busca, setBusca] = useState('');

  const contagem = useMemo(() => {
    const c: Record<MotoristaStatus, number> = {
      disponivel: 0,
      em_carga: 0,
      descanso: 0,
      manutencao: 0,
      offline: 0,
    };
    motoristas.forEach((m) => (c[m.status] += 1));
    return c;
  }, [motoristas]);

  const filtrados = useMemo(() => {
    const t = busca.trim().toLowerCase();
    return motoristas
      .filter((m) => (filtro === 'todos' ? true : m.status === filtro))
      .filter(
        (m) =>
          !t ||
          m.nome.toLowerCase().includes(t) ||
          m.placa.toLowerCase().includes(t) ||
          m.veiculo.toLowerCase().includes(t),
      );
  }, [motoristas, filtro, busca]);

  return (
    <AppShell
      active="Motor."
      title="Motoristas"
      subtitle={`${motoristas.length} motoristas na frota · ${contagem.disponivel} disponíveis para carregar`}
      search
      onSearch={setBusca}
      searchPlaceholder="Buscar motorista, placa ou veículo…"
    >
      <div className="app__stats app__stats--5">
        <StatCard label="Disponíveis" value={contagem.disponivel} tone="ok" icon="hand" />
        <StatCard label="Em carga" value={contagem.em_carga} tone="accent" icon="truck" />
        <StatCard label="Descanso" value={contagem.descanso} tone="warn" icon="clock" />
        <StatCard label="Manutenção" value={contagem.manutencao} tone="bad" icon="bolt" />
        <StatCard label="Offline" value={contagem.offline} tone="mut" icon="user" />
      </div>

      <div className="app__filterbar">
        {FILTROS.map((f) => (
          <span
            key={f.key}
            className={'chip' + (filtro === f.key ? ' is-active' : '')}
            onClick={() => setFiltro(f.key)}
          >
            {f.label}
          </span>
        ))}
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <table className="optB__table motoristas__table">
          <thead>
            <tr>
              <th>Motorista</th>
              <th>Veículo / Placa</th>
              <th>Status</th>
              <th>Frete atual</th>
              <th>Localização</th>
              <th>Atividade</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filtrados.map((m) => {
              const st = STATUS_META[m.status];
              return (
                <tr key={m.id}>
                  <td>
                    <div className="optB__cust">
                      <Avatar nome={m.nome} size={34} color={m.cor} />
                      <div>
                        <div className="nm">
                          {m.nome}
                          {!m.cadastroCompleto && (
                            <span className="dot-warn" title="Cadastro incompleto" />
                          )}
                        </div>
                        <div className="pr">{m.fretesMes} fretes no mês · CNH {m.categoria}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: 12.5, fontWeight: 600 }}>{m.veiculo}</div>
                    <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>
                      {m.placa}
                    </div>
                  </td>
                  <td>
                    <span className={'badge badge--' + st.badge}>{st.label}</span>
                  </td>
                  <td style={{ minWidth: 190 }}>
                    {m.frete ? (
                      <div>
                        <div style={{ fontSize: 12, color: 'var(--ink-2)', marginBottom: 5 }}>
                          {m.frete.origem} → {m.frete.destino}
                        </div>
                        <div className="prog">
                          <div className="prog__bar" style={{ width: m.frete.progresso + '%' }} />
                        </div>
                        <div style={{ fontSize: 10.5, color: 'var(--ink-3)', marginTop: 4 }}>
                          {m.frete.progresso}% · chega {m.frete.eta}
                        </div>
                      </div>
                    ) : (
                      <span style={{ color: 'var(--ink-3)', fontSize: 12.5 }}>—</span>
                    )}
                  </td>
                  <td style={{ fontSize: 12.5, color: 'var(--ink-2)' }}>{m.localizacao}</td>
                  <td style={{ fontSize: 12, color: 'var(--ink-3)' }}>{m.ultimaAtividade}</td>
                  <td>
                    <button className="btn" style={{ padding: '6px 11px' }} title={`Ligar para ${m.telefone}`}>
                      <Icon name="phone" size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {loading && <div className="app__empty">Carregando frota…</div>}
        {!loading && filtrados.length === 0 && (
          <div className="app__empty">Nenhum motorista neste filtro.</div>
        )}
      </div>
    </AppShell>
  );
}
