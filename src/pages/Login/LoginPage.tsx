import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { useAuth } from '@/hooks/useAuth';
import { BrandPanel } from './BrandPanel';
import { Field } from './Field';

/**
 * Tela de Login — MODO APRESENTAÇÃO (acesso livre).
 * Qualquer credencial (ou nenhuma) entra e vai para o dashboard de desempenho.
 */
export function LoginPage() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('mariana.costa@fblog.com.br');
  const [senha, setSenha] = useState('••••••••••');
  const [manter, setManter] = useState(true);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await login({ email, senha });
    navigate('/dashboard');
  }

  return (
    <div className="ab auth">
      <BrandPanel />
      <div className="auth__panel">
        <form className="auth__form" onSubmit={handleSubmit}>
          <h2 className="auth__h">Acessar a plataforma</h2>
          <p className="auth__sub">Entre com suas credenciais para acessar seu painel de desempenho.</p>

          <Field
            label="E-mail"
            icon="mail"
            placeholder="seu.nome@fblog.com.br"
            value={email}
            onChange={setEmail}
          />
          <Field
            label="Senha"
            icon="clip"
            type="password"
            placeholder="••••••••••"
            value={senha}
            onChange={setSenha}
          />

          <div className="auth__meta">
            <span
              className="auth__check"
              onClick={() => setManter((v) => !v)}
              role="checkbox"
              aria-checked={manter}
            >
              <span className={'auth__box' + (manter ? ' is-on' : '')}>
                {manter && <Icon name="check" size={12} />}
              </span>
              Manter conectado
            </span>
            <span className="auth__link">Esqueci minha senha</span>
          </div>

          <button className="auth__submit" type="submit" disabled={loading}>
            <Icon name="arrow" size={17} style={{ color: '#fff' }} />
            {loading ? 'Entrando…' : 'Entrar'}
          </button>

          <div className="auth__alt">
            Problemas para acessar? <b>Fale com o administrador</b>
          </div>
        </form>
      </div>
    </div>
  );
}
