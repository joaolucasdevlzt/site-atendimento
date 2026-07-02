import { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Avatar, AVATAR_COLORS } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import { perfilService } from '@/api/perfilService';
import { usePerfil } from '@/hooks/usePerfil';
import { useAuth } from '@/hooks/useAuth';
import type { AvatarColor, Funcao, PerfilAtendente } from '@/types';

const CORES: AvatarColor[] = ['violet', 'teal', 'blue', 'amber', 'rose', 'green', 'slate'];

/** Perfil do atendente — visualização e edição (mockado). */
export function PerfilPage() {
  const { perfil } = usePerfil();
  const { logout } = useAuth();
  const [form, setForm] = useState<PerfilAtendente | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [salvo, setSalvo] = useState(false);

  useEffect(() => {
    if (perfil) setForm(perfil);
  }, [perfil]);

  if (!form) return <AppShell active="" title="Meu perfil">{null}</AppShell>;

  const set = <K extends keyof PerfilAtendente>(k: K, v: PerfilAtendente[K]) => {
    setForm((f) => (f ? { ...f, [k]: v } : f));
    setSalvo(false);
  };

  const salvar = async () => {
    if (!form) return;
    setSalvando(true);
    await perfilService.updatePerfil(form);
    setSalvando(false);
    setSalvo(true);
  };

  return (
    <AppShell
      active=""
      title="Meu perfil"
      subtitle="Gerencie seus dados e preferências de atendimento"
    >
      <div className="perfil">
        {/* Cartão de identidade */}
        <div className="card perfil__id">
          <Avatar nome={form.nome} size={84} color={form.cor} />
          <div className="perfil__idinfo">
            <h2>{form.nome}</h2>
            <p>{form.email}</p>
            <div className="perfil__badges">
              <span className="badge badge--blue" style={{ textTransform: 'capitalize' }}>
                {form.funcao}
              </span>
              <span className={'badge badge--' + (form.disponivel ? 'ok' : 'mut')}>
                {form.disponivel ? 'Disponível para atender' : 'Indisponível'}
              </span>
            </div>
          </div>
          <button className="btn perfil__logout" onClick={logout}>
            <Icon name="arrow" size={15} />
            Sair da conta
          </button>
        </div>

        {/* Formulário */}
        <div className="card">
          <div className="card__h">
            <Icon name="idcard" size={18} style={{ color: 'var(--accent)' }} />
            <h3>Dados do atendente</h3>
          </div>
          <div className="perfil__form">
            <label className="field">
              <span className="field__label">Nome completo</span>
              <input
                className="field__input"
                value={form.nome}
                onChange={(e) => set('nome', e.target.value)}
              />
            </label>
            <label className="field">
              <span className="field__label">E-mail</span>
              <input
                className="field__input"
                type="email"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
              />
            </label>
            <label className="field">
              <span className="field__label">Telefone</span>
              <input
                className="field__input"
                value={form.telefone}
                onChange={(e) => set('telefone', e.target.value)}
              />
            </label>
            <label className="field">
              <span className="field__label">Função</span>
              <select
                className="field__input"
                value={form.funcao}
                onChange={(e) => set('funcao', e.target.value as Funcao)}
              >
                <option value="atendente">Atendente</option>
                <option value="admin">Administrador</option>
              </select>
            </label>
            <label className="field">
              <span className="field__label">Meta diária de atendimentos</span>
              <input
                className="field__input"
                type="number"
                min={0}
                value={form.metaDiaria}
                onChange={(e) => set('metaDiaria', Number(e.target.value))}
              />
            </label>

            <div className="field">
              <span className="field__label">Cor do avatar</span>
              <div className="perfil__cores">
                {CORES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={'perfil__cor' + (form.cor === c ? ' is-on' : '')}
                    style={{ background: AVATAR_COLORS[c] }}
                    onClick={() => set('cor', c)}
                    aria-label={c}
                  />
                ))}
              </div>
            </div>

            <label className="field field--switch">
              <span className="field__label">Disponível para atender</span>
              <button
                type="button"
                className={'switch' + (form.disponivel ? ' is-on' : '')}
                onClick={() => set('disponivel', !form.disponivel)}
                role="switch"
                aria-checked={form.disponivel}
              >
                <span className="switch__dot" />
              </button>
            </label>
          </div>

          <div className="perfil__foot">
            {salvo && (
              <span className="perfil__saved">
                <Icon name="check" size={15} />
                Alterações salvas
              </span>
            )}
            <button
              className="btn btn--primary"
              style={{ marginLeft: 'auto' }}
              onClick={salvar}
              disabled={salvando}
            >
              <Icon name="check" size={15} />
              {salvando ? 'Salvando…' : 'Salvar alterações'}
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
