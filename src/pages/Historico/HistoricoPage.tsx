import { useMemo, useState } from 'react';
import { AppShell, StatCard } from '@/components/layout/AppShell';
import { Avatar } from '@/components/ui/Avatar';
import { ChannelTag } from '@/components/ui/ChannelTag';
import { Icon } from '@/components/ui/Icon';
import { HandlerChip } from '@/components/ui/HandlerChip';
import { useHistorico } from '@/hooks/useHistorico';

type Periodo = 'hoje' | 'semana' | 'mes' | 'tudo';

const PERIODOS: { key: Periodo; label: string }[] = [
  { key: 'hoje', label: 'Diário' },
  { key: 'semana', label: 'Semanal' },
  { key: 'mes', label: 'Mensal' },
  { key: 'tudo', label: 'Tudo' },
];

/** Diferença em dias entre 'YYYY-MM-DD' e hoje. */
function diasAtras(iso: string): number {
  const d = new Date(iso + 'T00:00:00');
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  return Math.round((hoje.getTime() - d.getTime()) / 86_400_000);
}

/** Histórico de atendimentos finalizados — filtros por período e nome. */
export function HistoricoPage() {
  const { historico, loading } = useHistorico();
  const [periodo, setPeriodo] = useState<Periodo>('mes');
  const [busca, setBusca] = useState('');

  const hojeMes = new Date().toISOString().slice(0, 7); // YYYY-MM

  const filtrados = useMemo(() => {
    const t = busca.trim().toLowerCase();
    return historico
      .filter((h) => {
        if (periodo === 'tudo') return true;
        if (periodo === 'hoje') return diasAtras(h.data) === 0;
        if (periodo === 'semana') return diasAtras(h.data) <= 7;
        return h.data.slice(0, 7) === hojeMes; // mês
      })
      .filter(
        (h) =>
          !t ||
          h.motoristaNome.toLowerCase().includes(t) ||
          h.placa.toLowerCase().includes(t) ||
          h.protocolo.toLowerCase().includes(t) ||
          h.assunto.toLowerCase().includes(t),
      );
  }, [historico, periodo, busca, hojeMes]);

  const fechados = filtrados.filter((h) => h.conversaoStatus === 'ok').length;
  const taxa = filtrados.length ? Math.round((fechados / filtrados.length) * 100) : 0;
  const porIa = filtrados.filter((h) => h.resolvidoPor === 'ia').length;

  return (
    <AppShell
      active="Histórico"
      title="Histórico de atendimentos"
      subtitle="Atendimentos finalizados"
      search
      onSearch={setBusca}
      searchPlaceholder="Buscar por nome, placa ou protocolo…"
    >
      <div className="app__stats app__stats--4">
        <StatCard label="No período" value={filtrados.length} tone="accent" icon="history" />
        <StatCard label="Fretes fechados" value={fechados} tone="ok" icon="check" />
        <StatCard label="Conversão" value={taxa + '%'} tone="accent" icon="route" />
        <StatCard label="Resolvidos pela IA" value={porIa} tone="mut" icon="ai" />
      </div>

      <div className="app__filterbar">
        {PERIODOS.map((p) => (
          <span
            key={p.key}
            className={'chip' + (periodo === p.key ? ' is-active' : '')}
            onClick={() => setPeriodo(p.key)}
          >
            {p.label}
          </span>
        ))}
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <table className="optB__table">
          <thead>
            <tr>
              <th>Motorista / Protocolo</th>
              <th>Assunto</th>
              <th>Canal</th>
              <th>Resolvido por</th>
              <th>Data</th>
              <th>Duração</th>
              <th>Conversão</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((h) => (
              <tr key={h.id}>
                <td>
                  <div className="optB__cust">
                    <Avatar nome={h.motoristaNome} size={32} color={h.cor} />
                    <div>
                      <div className="nm">{h.motoristaNome}</div>
                      <div className="pr">
                        {h.protocolo} · <span className="mono">{h.placa}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td style={{ color: 'var(--ink-2)' }}>{h.assunto}</td>
                <td>
                  <ChannelTag canal={h.canal} />
                </td>
                <td>
                  <HandlerChip responsavel={h.resolvidoPor} size={13} />
                </td>
                <td style={{ fontSize: 12, color: 'var(--ink-2)' }}>{h.dataLabel}</td>
                <td>
                  <span className="mono" style={{ fontSize: 12.5, fontWeight: 600 }}>
                    {h.duracao}
                  </span>
                </td>
                <td>
                  <span className={'badge badge--' + h.conversaoStatus}>{h.conversao}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <div className="app__empty">Carregando histórico…</div>}
        {!loading && filtrados.length === 0 && (
          <div className="app__empty">
            <Icon name="history" size={22} style={{ color: 'var(--ink-3)' }} />
            <span>Nenhum atendimento encontrado neste período.</span>
          </div>
        )}
      </div>
    </AppShell>
  );
}
