import { useEffect, useRef } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import type { AvatarColor, Message } from '@/types';

interface ConversaProps {
  motoristaNome: string;
  motoristaCor: AvatarColor;
  mensagens: Message[];
  digitando?: boolean;
}

/** Thread da conversa, incluindo mensagens da IA e o handoff IA → humano. */
export function Conversa({ motoristaNome, motoristaCor, mensagens, digitando }: ConversaProps) {
  const fimRef = useRef<HTMLDivElement>(null);

  // Rola para a última mensagem sempre que a conversa muda.
  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [mensagens.length, digitando]);

  return (
    <div className="optA__thread">
      <div className="optA__daysep">Hoje</div>
      {mensagens.map((m) => {
        if (m.autor === 'take') {
          return (
            <div key={m.id} className="takeover">
              <Icon name="hand" size={14} />
              {m.texto}
            </div>
          );
        }

        const meta =
          m.autor === 'out'
            ? { label: 'Você', icon: 'user' as const, cls: 'is-you' }
            : m.autor === 'ia'
              ? { label: 'Assistente IA', icon: 'ai' as const, cls: 'is-ia' }
              : { label: motoristaNome.split(' ')[0], icon: null, cls: 'is-drv' };

        return (
          <div key={m.id} className={'msg msg--' + m.autor}>
            {m.autor === 'in' && <Avatar nome={motoristaNome} size={30} color={motoristaCor} />}
            {m.autor === 'ia' && (
              <span className="iabot">
                <Icon name="ai" size={16} />
              </span>
            )}
            <div className="msg__col">
              <div className={'msg__who ' + meta.cls}>
                {meta.icon && <Icon name={meta.icon} size={12} />}
                {meta.label}
              </div>
              <div className="msg__b">{m.texto}</div>
              <div className="msg__t">{m.hora}</div>
            </div>
          </div>
        );
      })}

      {digitando && (
        <div className="msg msg--in">
          <Avatar nome={motoristaNome} size={30} color={motoristaCor} />
          <div className="msg__col">
            <div className="msg__who is-drv">{motoristaNome.split(' ')[0]}</div>
            <div className="msg__b msg__typing">
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      )}

      <div ref={fimRef} />
    </div>
  );
}
