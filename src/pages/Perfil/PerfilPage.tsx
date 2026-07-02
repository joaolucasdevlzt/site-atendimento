import { useEffect, useRef, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Avatar } from '@/components/ui/Avatar';
import { Icon, type IconName } from '@/components/ui/Icon';
import { perfilService } from '@/api/perfilService';
import { usePerfil } from '@/hooks/usePerfil';
import { useAuth } from '@/hooks/useAuth';
import type { Funcao, PerfilAtendente } from '@/types';

/** Indicadores de desempenho do atendente (mock de apresentação). */
const STATS: { label: string; valor: string; icon: IconName; tom: string }[] = [
  { label: 'Atendimentos hoje', valor: '18', icon: 'inbox', tom: 'var(--accent)' },
  { label: 'Conversão de fretes', valor: '62%', icon: 'route', tom: 'var(--ok)' },
  { label: 'Tempo médio', valor: '1m48', icon: 'bolt', tom: 'var(--warn)' },
  { label: 'Resolvidos pela IA', valor: '9', icon: 'ai', tom: 'oklch(0.5 0.13 300)' },
];

/** Perfil do atendente — visualização e edição (mockado). */
export function PerfilPage() {
  const { perfil } = usePerfil();
  const { logout } = useAuth();
  const [form, setForm] = useState<PerfilAtendente | null>(null);
  const [foto, setFoto] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [salvo, setSalvo] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (perfil) setForm(perfil);
  }, [perfil]);

  if (!form) return <AppShell active="" title="Meu perfil">{null}</AppShell>;

  const set = <K extends keyof PerfilAtendente>(k: K, v: PerfilAtendente[K]) => {
    setForm((f) => (f ? { ...f, [k]: v } : f));
    setSalvo(false);
  };

  const escolherFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFoto(reader.result as string);
      setSalvo(false);
    };
    reader.readAsDataURL(file);
  };

  const salvar = async () => {
    if (!form) return;
    setSalvando(true);
    await perfilService.updatePerfil(form);
    setSalvando(false);
    setSalvo(true);
  };

  return (
    <AppShell active="" title="Meu perfil" subtitle="Gerencie seus dados e preferências de atendimento">
      <div className="pf">
        {/* Capa + identidade */}
        <div className="pf__cover card">
          <div className="pf__banner" />
          <button className="btn pf__logout" onClick={logout}>
            <Icon name="arrow" size={15} />
            Sair
          </button>

          <div className="pf__idrow">
            <div className="pf__photo">
              {foto ? (
                <img className="pf__img" src={foto} alt={form.nome} />
              ) : (
                <Avatar nome={form.nome} size={104} color={form.cor} />
              )}
              <button
                type="button"
                className="pf__camera"
                title="Alterar foto"
                onClick={() => fileRef.current?.click()}
              >
                <Icon name="camera" size={15} />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={escolherFoto}
              />
            </div>

            <h2>{form.nome}</h2>
            <p className="pf__email">
              <Icon name="mail" size={13} />
              {form.email}
            </p>

            <div className="pf__badges">
              <span className="badge badge--blue" style={{ textTransform: 'capitalize' }}>
                <Icon name="idcard" size={12} />
                {form.funcao}
              </span>
              <span className={'badge badge--' + (form.disponivel ? 'ok' : 'mut')}>
                <span className="dot" style={{ background: form.disponivel ? 'var(--ok)' : 'var(--ink-3)' }} />
                {form.disponivel ? 'Disponível para atender' : 'Indisponível'}
              </span>
            </div>

            <button
              type="button"
              className={'pf__avail' + (form.disponivel ? ' is-on' : '')}
              onClick={() => set('disponivel', !form.disponivel)}
            >
              <span className={'switch' + (form.disponivel ? ' is-on' : '')}>
                <span className="switch__dot" />
              </span>
              {form.disponivel ? 'Online' : 'Offline'}
            </button>
          </div>

          <div className="pf__stats">
            {STATS.map((s) => (
              <div className="pf__stat" key={s.label}>
                <span className="pf__static" style={{ color: s.tom }}>
                  <Icon name={s.icon} size={17} />
                </span>
                <div>
                  <div className="pf__statv">{s.valor}</div>
                  <div className="pf__statk">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dados */}
        <div className="card">
          <div className="card__h">
            <Icon name="idcard" size={18} style={{ color: 'var(--accent)' }} />
            <h3>Dados do atendente</h3>
          </div>
          <div className="pf__form">
            <label className="field">
              <span className="field__label">Nome completo</span>
              <input className="field__input" value={form.nome} onChange={(e) => set('nome', e.target.value)} />
            </label>
            <label className="field">
              <span className="field__label">Telefone</span>
              <input className="field__input" value={form.telefone} onChange={(e) => set('telefone', e.target.value)} />
            </label>

            <div className="field field--full">
              <span className="field__label">
                E-mail corporativo
                <span className="field__lock">
                  <Icon name="lock" size={11} />
                  não editável
                </span>
              </span>
              <div className="field__input field__input--locked">
                <Icon name="mail" size={15} style={{ color: 'var(--ink-3)' }} />
                {form.email}
              </div>
            </div>

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
          </div>

          <div className="pf__actions">
            {salvo && (
              <span className="perfil__saved">
                <Icon name="check" size={15} />
                Alterações salvas
              </span>
            )}
            <button className="btn btn--primary" style={{ marginLeft: 'auto' }} onClick={salvar} disabled={salvando}>
              <Icon name="check" size={15} />
              {salvando ? 'Salvando…' : 'Salvar alterações'}
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
