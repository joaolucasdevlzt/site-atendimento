import { Icon } from '@/components/ui/Icon';
import { LogoMark } from '@/components/ui/Logo';

/** Painel lateral de marca (lado esquerdo do login). */
export function BrandPanel() {
  return (
    <div className="auth__brand">
      <div className="auth__brand-top">
        <div className="auth__brand-mark">
          <LogoMark size={24} />
        </div>
        <div>
          <div className="auth__brand-name">
            FB<span style={{ color: 'var(--accent)' }}>Log</span> Atende
          </div>
          <div className="auth__brand-tag">na rota do crescimento</div>
        </div>
      </div>

      <div className="auth__brand-body">
        <h1 className="auth__brand-h">A central de atendimento a motoristas da FBLog.</h1>
        <p className="auth__brand-p">
          Gerencie chamados por protocolo, acompanhe o cadastro dos motoristas e acompanhe seu
          desempenho — tudo em um só lugar.
        </p>
        <div className="auth__points">
          <div className="auth__point">
            <span className="ck">
              <Icon name="inbox" size={15} />
            </span>
            Atendimentos ativos por protocolo (sessão 24h)
          </div>
          <div className="auth__point">
            <span className="ck">
              <Icon name="truck" size={15} />
            </span>
            Cadastro e documentos do motorista
          </div>
          <div className="auth__point">
            <span className="ck">
              <Icon name="route" size={15} />
            </span>
            TMR e conversão de fretes em tempo real
          </div>
        </div>
      </div>

      <div className="auth__brand-foot">F B SERVIÇOS LTDA · Uberlândia — MG · © 2026</div>
    </div>
  );
}
