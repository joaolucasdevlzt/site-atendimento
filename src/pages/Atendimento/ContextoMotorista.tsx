import { Icon } from '@/components/ui/Icon';
import type { Atendimento } from '@/types';

const DOC_ICON = {
  cnh: { name: 'idcard' as const, bg: 'var(--accent-sf)', fg: 'var(--accent-d)' },
  crlv: { name: 'doc' as const, bg: 'var(--ok-sf)', fg: 'oklch(0.45 0.1 158)' },
  outro: { name: 'doc' as const, bg: 'var(--surface-3)', fg: 'var(--ink-2)' },
};

/** Painel lateral direito: contexto do motorista, documentos e histórico. */
export function ContextoMotorista({ atendimento }: { atendimento: Atendimento }) {
  const { motorista, documentos, historico } = atendimento;

  return (
    <aside className="optA__side">
      <div className="drv">
        <div className="drv__ic">
          <Icon name="truck" size={20} />
        </div>
        <div style={{ flex: 1 }}>
          <div className="drv__name">{motorista.nome}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 4 }}>
            <span className="drv__plate">{motorista.placa}</span>
            <span className={'badge badge--' + (motorista.cadastrado ? 'ok' : 'warn')}>
              {motorista.cadastrado ? 'Cadastrado' : 'Novo cadastro'}
            </span>
          </div>
        </div>
      </div>

      <div className="optA__sblock">
        <div className="optA__slabel">Contexto do motorista</div>
        <div className="optA__grid2">
          <div className="optA__field">
            <span className="k">Veículo</span>
            <span className="v">{motorista.veiculo}</span>
          </div>
          <div className="optA__field">
            <span className="k">Placa</span>
            <span className="v mono">{motorista.placa}</span>
          </div>
          <div className="optA__field">
            <span className="k">CNH</span>
            <span className="v mono">{motorista.cnh}</span>
          </div>
          <div className="optA__field">
            <span className="k">Categoria</span>
            <span className="v">{motorista.categoria}</span>
          </div>
          <div className="optA__field">
            <span className="k">ANTT (RNTRC)</span>
            <span className="v mono">{motorista.antt}</span>
          </div>
          <div className="optA__field">
            <span className="k">Validade CNH</span>
            <span className="v">{motorista.validadeCnh}</span>
          </div>
        </div>
      </div>

      <div className="optA__sblock">
        <div className="optA__slabel">Documentos do protocolo</div>
        <div className="docs">
          {documentos.map((doc) => {
            const cfg = DOC_ICON[doc.tipo];
            return (
              <div className="doc" key={doc.id}>
                <span className="doc__ic" style={{ background: cfg.bg, color: cfg.fg }}>
                  <Icon name={cfg.name} size={16} />
                </span>
                <div>
                  <div className="doc__nm">{doc.nome}</div>
                  <div className="doc__mt">{doc.meta}</div>
                </div>
                <span className="doc__dl">
                  <Icon name="download" size={16} />
                </span>
              </div>
            );
          })}
          <div className="addcad">
            <Icon name="plus" size={15} />
            Atualizar cadastro do motorista
          </div>
        </div>
      </div>

      <div className="optA__sblock">
        <div className="optA__slabel">Protocolos anteriores</div>
        {historico.map((h, i) => (
          <div className="optA__hist" key={i}>
            <div className="ln">
              <span className="dot" style={i === historico.length - 1 ? { background: 'var(--border-2)' } : undefined} />
              {i < historico.length - 1 && <span className="bar" />}
            </div>
            <div>
              <div className="ht">{h.titulo}</div>
              <div className="hs">{h.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
