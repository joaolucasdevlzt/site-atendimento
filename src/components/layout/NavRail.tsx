import { useNavigate } from 'react-router-dom';
import { Avatar } from '@/components/ui/Avatar';
import { Icon, type IconName } from '@/components/ui/Icon';
import { LogoMark } from '@/components/ui/Logo';
import { useAuth } from '@/hooks/useAuth';

interface NavItem {
  icon: IconName;
  label: string;
  to?: string;
}

const ITEMS: NavItem[] = [
  { icon: 'inbox', label: 'Atender', to: '/atendimento' },
  { icon: 'list', label: 'Fila', to: '/fila' },
  { icon: 'truck', label: 'Motor.', to: '/motoristas' },
  { icon: 'history', label: 'Histór.', to: '/historico' },
  { icon: 'chart', label: 'Desemp.', to: '/dashboard' },
];

/** Barra de navegação lateral (rail) do console de atendimento. */
export function NavRail({ active = 'Atender' }: { active?: string }) {
  const navigate = useNavigate();
  const { usuario } = useAuth();

  return (
    <nav className="optA__nav">
      <div className="optA__logo" title="FBLog Atende" style={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
        <LogoMark size={22} />
      </div>
      {ITEMS.map((item) => (
        <div
          key={item.label}
          className={'optA__navbtn' + (item.label === active ? ' is-active' : '')}
          onClick={() => item.to && navigate(item.to)}
        >
          <Icon name={item.icon} />
          {item.label}
        </div>
      ))}
      <div className="optA__nav-sp" />
      <div
        className="optA__presence"
        title="Meu perfil"
        style={{ cursor: 'pointer' }}
        onClick={() => navigate('/perfil')}
      >
        <Avatar nome={usuario?.nome ?? 'Atendente'} size={44} color={usuario?.cor ?? 'violet'} />
      </div>
    </nav>
  );
}
