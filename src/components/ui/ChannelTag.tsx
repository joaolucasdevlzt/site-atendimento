import type { Channel } from '@/types';

const CANAL: Record<Channel, { label: string; cor: string }> = {
  chat: { label: 'Chat', cor: 'oklch(0.55 0.13 256)' },
  email: { label: 'E-mail', cor: 'oklch(0.55 0.1 300)' },
  telefone: { label: 'Telefone', cor: 'oklch(0.6 0.12 158)' },
  whatsapp: { label: 'WhatsApp', cor: 'oklch(0.62 0.13 150)' },
};

/** Etiqueta de canal (ponto colorido + rótulo). */
export function ChannelTag({ canal }: { canal: Channel }) {
  const { label, cor } = CANAL[canal];
  return (
    <span className="chan">
      <span className="dot" style={{ background: cor }} />
      {label}
    </span>
  );
}
