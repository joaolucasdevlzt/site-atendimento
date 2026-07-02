import { Avatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import type { AvatarColor, Message } from '@/types';

interface ConversaProps {
  motoristaNome: string;
  motoristaCor: AvatarColor;
  mensagens: Message[];
}

/** Thread da conversa, incluindo mensagens da IA e o handoff IA → humano. */
export function Conversa({ motoristaNome, motoristaCor, mensagens }: ConversaProps) {
  return (
    <div className="optA__thread">
      <div className="optA__daysep">Hoje · 23 de junho</div>
      {mensagens.map((m) => {
        if (m.autor === 'take') {
          return (
            <div key={m.id} className="takeover">
              <Icon name="hand" size={14} />
              {m.texto}
            </div>
          );
        }
        const quem =
          m.autor === 'out' ? 'Mariana' : m.autor === 'ia' ? 'Assistente IA' : motoristaNome.split(' ')[0];
        return (
          <div key={m.id} className={'msg msg--' + m.autor}>
            {m.autor === 'in' && <Avatar nome={motoristaNome} size={30} color={motoristaCor} />}
            {m.autor === 'ia' && (
              <span className="iabot">
                <Icon name="ai" size={16} />
              </span>
            )}
            <div>
              <div className="msg__b">{m.texto}</div>
              <div className="msg__t">
                {quem} · {m.hora}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
