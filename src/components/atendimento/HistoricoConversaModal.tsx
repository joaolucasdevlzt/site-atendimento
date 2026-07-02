import { Avatar } from '@/components/ui/Avatar';
import { ChannelTag } from '@/components/ui/ChannelTag';
import { HandlerChip } from '@/components/ui/HandlerChip';
import { Icon } from '@/components/ui/Icon';
import type { HistoricoAtendimento, Message } from '@/types';

/** Extrai o horário ("08:12") do rótulo de data. */
function horaDe(dataLabel: string): string {
  const m = dataLabel.match(/(\d{1,2}:\d{2})/);
  return m ? m[1] : '';
}

/** Frase de abertura do motorista a partir do assunto. */
function abertura(h: HistoricoAtendimento): string {
  const a = h.assunto.toLowerCase();
  if (a.includes('valor') || a.includes('pagamento') || a.includes('pendente'))
    return `Oi! Estou com uma dúvida sobre ${h.assunto.toLowerCase()}. Pode me ajudar?`;
  if (a.includes('cnh') || a.includes('antt') || a.includes('cadastro') || a.includes('documento') || a.includes('veículo'))
    return `Boa! Preciso resolver a ${h.assunto.toLowerCase()} aqui no meu cadastro.`;
  if (a.includes('carga') || a.includes('rastreio') || a.includes('coleta') || a.includes('rota'))
    return `Bom dia! Sobre "${h.assunto}" — preciso de uma posição, tô parado aguardando.`;
  if (a.includes('comprovante') || a.includes('entrega'))
    return `Olá! Sobre o ${h.assunto.toLowerCase()}, você consegue me enviar?`;
  if (a.includes('avaria') || a.includes('ocorrência'))
    return `Preciso abrir uma ocorrência: ${h.assunto.toLowerCase()}.`;
  return `Olá! Meu assunto é: ${h.assunto}.`;
}

/** Resposta de quem resolveu (Você ou IA). */
function resolucao(h: HistoricoAtendimento): string {
  if (h.conversaoStatus === 'ok')
    return `Verifiquei aqui e já resolvi para você. Ficou tudo certo e o frete foi fechado. Qualquer coisa, é só chamar!`;
  if (h.conversaoStatus === 'blue')
    return `Encaminhei sua solicitação e ela já está em andamento. Assim que atualizar, você recebe a confirmação por aqui.`;
  if (h.conversaoStatus === 'bad')
    return `Consegui te ajudar com a solicitação. No momento não há frete disponível para esse trecho, mas deixei seu perfil sinalizado para as próximas ofertas.`;
  return `Prontinho, atualizei os dados no seu cadastro. Está tudo certo por aqui.`;
}

/** Monta o transcrito da conversa a partir do registro de histórico. */
function montarTranscricao(h: HistoricoAtendimento): Message[] {
  const nome = h.motoristaNome.split(' ')[0];
  const hora = horaDe(h.dataLabel);
  const msgs: Message[] = [
    { id: 'g1', autor: 'in', hora, texto: abertura(h) },
    {
      id: 'g2',
      autor: 'ia',
      hora,
      texto: `Olá, ${nome}! Sou a assistente virtual da FBLog. Localizei o protocolo ${h.protocolo} e seu cadastro. Já estou verificando isso para você.`,
    },
  ];

  if (h.resolvidoPor === 'you') {
    msgs.push({ id: 'g3', autor: 'take', texto: `${h.atendente} assumiu o atendimento da IA` });
    msgs.push({ id: 'g4', autor: 'out', hora, texto: resolucao(h) });
  } else {
    msgs.push({ id: 'g4', autor: 'ia', hora, texto: resolucao(h) });
  }

  msgs.push({ id: 'g5', autor: 'in', hora, texto: 'Perfeito, muito obrigado pela ajuda! 👍' });
  return msgs;
}

interface Props {
  atendimento: HistoricoAtendimento;
  onClose: () => void;
}

/** Modal com o transcrito (somente leitura) de um atendimento encerrado. */
export function HistoricoConversaModal({ atendimento: h, onClose }: Props) {
  const mensagens = montarTranscricao(h);

  return (
    <div
      className="hconv"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div className="hconv__panel" onClick={(e) => e.stopPropagation()}>
        <header className="hconv__head">
          <Avatar nome={h.motoristaNome} size={40} color={h.cor} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="hconv__name">{h.motoristaNome}</div>
            <div className="hconv__sub">
              <span className="mono">{h.protocolo}</span> · <span className="mono">{h.placa}</span> · {h.dataLabel}
            </div>
          </div>
          <span className={'badge badge--' + h.conversaoStatus}>{h.conversao}</span>
          <button className="drawer__close" onClick={onClose} aria-label="Fechar">
            <Icon name="close" size={18} />
          </button>
        </header>

        <div className="hconv__meta">
          <div className="hconv__mrow">
            <span className="k">Assunto</span>
            <span className="v">{h.assunto}</span>
          </div>
          <div className="hconv__mrow">
            <span className="k">Canal</span>
            <ChannelTag canal={h.canal} />
          </div>
          <div className="hconv__mrow">
            <span className="k">Resolvido por</span>
            <HandlerChip responsavel={h.resolvidoPor} size={12} />
          </div>
          <div className="hconv__mrow">
            <span className="k">Duração</span>
            <span className="v mono">{h.duracao}</span>
          </div>
        </div>

        <div className="hconv__thread">
          <div className="optA__daysep">Conversa · {h.dataLabel}</div>
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
                ? { label: h.atendente, icon: 'user' as const, cls: 'is-you' }
                : m.autor === 'ia'
                  ? { label: 'Assistente IA', icon: 'ai' as const, cls: 'is-ia' }
                  : { label: h.motoristaNome.split(' ')[0], icon: null, cls: 'is-drv' };
            return (
              <div key={m.id} className={'msg msg--' + m.autor}>
                {m.autor === 'in' && <Avatar nome={h.motoristaNome} size={30} color={h.cor} />}
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
        </div>

        <footer className="hconv__foot">
          <Icon name="check" size={14} />
          Atendimento encerrado · somente leitura
        </footer>
      </div>
    </div>
  );
}
