// Tipos de domínio — FBLog Atende

export type AvatarColor =
  | 'blue'
  | 'teal'
  | 'violet'
  | 'amber'
  | 'rose'
  | 'green'
  | 'slate';

export type Channel = 'chat' | 'email' | 'telefone' | 'whatsapp';

/** Prioridade / status (usado também para o tempo de sessão). */
export type Status = 'ok' | 'warn' | 'bad';

/** Quem está conduzindo o atendimento. */
export type Handler = 'you' | 'ia';

export type Funcao = 'atendente' | 'admin';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  cor: AvatarColor;
  funcao: Funcao;
}

export interface Motorista {
  id: string;
  nome: string;
  veiculo: string;
  placa: string;
  cnh: string;
  categoria: string;
  antt: string;
  validadeCnh: string;
  cadastrado: boolean;
  cor: AvatarColor;
}

/** Item resumido exibido na fila de atendimentos ativos. */
export interface TicketResumo {
  id: string;
  protocolo: string;
  motoristaNome: string;
  assunto: string;
  canal: Channel;
  veiculo: string;
  placa: string;
  tempo: string;
  sessaoRestante: string;
  sessaoStatus: Status;
  prioridade: Status;
  responsavel: Handler;
  cor: AvatarColor;
  ativo?: boolean;
}

/** Ticket recém-chegado, ainda não aceito. */
export interface TicketRecebido {
  id: string;
  nome: string;
  canal: Channel;
  cor: AvatarColor;
  placa?: string;
  assunto?: string;
}

export type MessageAuthor = 'in' | 'out' | 'ia' | 'take';

export interface Message {
  id: string;
  autor: MessageAuthor;
  hora?: string;
  texto: string;
}

export interface Documento {
  id: string;
  nome: string;
  meta: string;
  tipo: 'cnh' | 'crlv' | 'outro';
}

export interface HistoricoProtocolo {
  titulo: string;
  sub: string;
  encerrado: boolean;
}

/** Atendimento completo (tela de conversa). */
export interface Atendimento {
  id: string;
  protocolo: string;
  assunto: string;
  categoria: string;
  canal: Channel;
  responsavel: Handler;
  sessaoRestante: string;
  sessaoStatus: Status;
  prioridade: Status;
  motorista: Motorista;
  mensagens: Message[];
  documentos: Documento[];
  historico: HistoricoProtocolo[];
}

// ---- Dashboard ------------------------------------------------------------

export interface Kpi {
  k: string;
  v: string;
  d: string;
  up: boolean;
  ic: string;
  cor: string;
  fundo: string;
}

export interface HistoricoRow {
  protocolo: string;
  nome: string;
  cor: AvatarColor;
  assunto: string;
  placa: string;
  duracao: string;
  duracaoCor: string;
  conversao: string;
  conversaoStatus: 'blue' | 'ok' | 'bad' | 'mut';
}

export interface RecebidoAgora {
  id: string;
  nome: string;
  cor: AvatarColor;
  canal: Channel;
  tempo: string;
  assunto: string;
  placa: string;
  novo: boolean;
}

export interface FilaProximo {
  nome: string;
  cor: AvatarColor;
  canal: Channel;
  tempo: string;
}

export interface DashboardData {
  kpis: Kpi[];
  historico: HistoricoRow[];
  recebidos: RecebidoAgora[];
  proximos: FilaProximo[];
}

// ---- Fila de espera -------------------------------------------------------

/** Motorista aguardando atendimento (ainda não aceito). */
export interface FilaEsperaItem {
  id: string;
  posicao: number;
  nome: string;
  cor: AvatarColor;
  canal: Channel;
  placa: string;
  veiculo: string;
  assunto: string;
  espera: string;
  prioridade: Status;
  responsavel: Handler;
}

// ---- Frota de motoristas --------------------------------------------------

export type MotoristaStatus =
  | 'disponivel'
  | 'em_carga'
  | 'descanso'
  | 'manutencao'
  | 'offline';

/** Frete em andamento associado a um motorista. */
export interface FreteAtual {
  origem: string;
  destino: string;
  progresso: number; // 0-100
  eta: string;
}

/** Frete concluído/registrado no histórico do motorista. */
export interface FreteHistorico {
  id: string;
  rota: string;
  data: string;
  valor: string;
  status: 'entregue' | 'em_curso' | 'cancelado';
}

/** Motorista da frota (visão de gestão). */
export interface MotoristaFrota {
  id: string;
  nome: string;
  cor: AvatarColor;
  veiculo: string;
  placa: string;
  categoria: string;
  status: MotoristaStatus;
  telefone: string;
  email?: string;
  cidadeBase?: string;
  localizacao: string;
  ultimaAtividade: string;
  cadastroCompleto: boolean;
  fretesMes: number;
  // Documentação
  cnh: string;
  validadeCnh: string;
  antt: string;
  desde?: string;
  avaliacao?: number; // 0-5
  frete?: FreteAtual;
  fretesHistorico: FreteHistorico[];
}

// ---- Histórico de atendimentos -------------------------------------------

/** Atendimento finalizado (tela de histórico). */
export interface HistoricoAtendimento {
  id: string;
  protocolo: string;
  motoristaNome: string;
  cor: AvatarColor;
  placa: string;
  assunto: string;
  canal: Channel;
  atendente: string;
  resolvidoPor: Handler;
  data: string; // ISO 'YYYY-MM-DD'
  dataLabel: string;
  duracao: string;
  conversao: string;
  conversaoStatus: 'blue' | 'ok' | 'bad' | 'mut';
}

// ---- Perfil do atendente --------------------------------------------------

export interface PerfilAtendente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cor: AvatarColor;
  funcao: Funcao;
  metaDiaria: number;
  disponivel: boolean;
}
