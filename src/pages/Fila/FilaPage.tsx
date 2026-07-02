import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell, StatCard } from '@/components/layout/AppShell';
import { Avatar } from '@/components/ui/Avatar';
import { ChannelTag } from '@/components/ui/ChannelTag';
import { Icon } from '@/components/ui/Icon';
import { atendimentosService } from '@/api/atendimentosService';
import { useFilaEspera } from '@/hooks/useAtendimentos';
import type { Status } from '@/types';

const PRIORIDADE_LABEL: Record<Status, string> = {
  bad: 'Urgente',
  warn: 'Atenção',
  ok: 'Normal',
};

/** Fila de espera — motoristas aguardando para serem atendidos. */
export function FilaPage() {
  const navigate = useNavigate();
  const { espera, loading, reload } = useFilaEspera();
  const [busca, setBusca] = useState('');

  const filtrados = useMemo(() => {
    const t = busca.trim().toLowerCase();
    if (!t) return espera;
    return espera.filter(
      (e) =>
        e.nome.toLowerCase().includes(t) ||
        e.placa.toLowerCase().includes(t) ||
        e.assunto.toLowerCase().includes(t),
    );
  }, [espera, busca]);

  const urgentes = espera.filter((e) => e.prioridade === 'bad').length;

  const aceitar = async (id: string) => {
    await atendimentosService.aceitarTicket(id);
    navigate('/atendimento');
  };

  return (
    <AppShell
      active="Fila"
      title="Fila de espera"
      subtitle={`${espera.length} motoristas aguardando atendimento`}
      search
      onSearch={setBusca}
      searchPlaceholder="Buscar por nome, placa ou assunto…"
    >
      <div className="app__stats app__stats--3">
        <StatCard label="Aguardando" value={espera.length} tone="accent" icon="list" />
        <StatCard label="Urgentes" value={urgentes} tone="bad" icon="bolt" />
        <StatCard label="Tempo médio de espera" value="4m30" tone="warn" icon="clock" />
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <div className="card__h">
          <Icon name="list" size={17} style={{ color: 'var(--accent)' }} />
          <h3>Próximos da fila</h3>
          <span className="link" onClick={reload}>
            Atualizar
          </span>
        </div>

        {loading && <div className="app__empty">Carregando fila…</div>}
        {!loading && filtrados.length === 0 && (
          <div className="app__empty">Nenhum motorista na fila.</div>
        )}

        <div className="fila">
          {filtrados.map((e) => (
            <div key={e.id} className="fila__row">
              <span className={'fila__pos fila__pos--' + e.prioridade}>{e.posicao}</span>
              <Avatar nome={e.nome} size={40} color={e.cor} />
              <div className="fila__main">
                <div className="fila__top">
                  <span className="fila__name">{e.nome}</span>
                  <span className="mono fila__plate">{e.placa}</span>
                  <span className={'badge badge--' + (e.prioridade === 'bad' ? 'bad' : e.prioridade === 'warn' ? 'warn' : 'mut')}>
                    {PRIORIDADE_LABEL[e.prioridade]}
                  </span>
                </div>
                <div className="fila__subj">{e.assunto}</div>
                <div className="fila__meta">
                  <ChannelTag canal={e.canal} />
                  <span className="fila__veh">
                    <Icon name="truck" size={13} />
                    {e.veiculo}
                  </span>
                </div>
              </div>
              <div className="fila__side">
                <span className="fila__wait">
                  <Icon name="clock" size={13} />
                  {e.espera}
                </span>
                <div className="fila__actions">
                  <button className="btn" style={{ padding: '7px 12px' }}>
                    <Icon name="ai" size={14} />
                    Deixar com IA
                  </button>
                  <button
                    className="btn btn--primary"
                    style={{ padding: '7px 14px' }}
                    onClick={() => aceitar(e.id)}
                  >
                    Aceitar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
