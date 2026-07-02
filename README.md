# FBLog Atende — Plataforma de Atendimento a Motoristas

Aplicação **React + TypeScript + Vite** (modo apresentação) que replica fielmente o
design aprovado da FBLog. O login tem **acesso livre** — é uma demonstração navegável.

## ✨ Telas

| Rota | Tela |
|------|------|
| `/login` | Login (acesso livre — clique em *Entrar*) |
| `/atendimento` | Console de atendimentos ativos (fila + conversa + contexto do motorista) |
| `/atendimento/foco` | Layout alternativo — atendimento focado |
| `/dashboard` | Dashboard do atendente (KPIs, histórico, TMR, conversão de fretes) |

Destaques do domínio: tickets chegam e são **aceitos**, cada atendimento é conduzido
**por Você ou pela IA** (com handoff IA → humano), tudo vinculado a um **protocolo** e a
uma **sessão de 24h**. O painel lateral traz o **Contexto do Motorista** (veículo, placa,
CNH, ANTT) e os **documentos** do protocolo.

## 🚀 Como rodar

Pré-requisitos: **Node.js 18+** e **Yarn**.

```bash
# 1. instalar dependências
yarn install

# 2. subir o ambiente de desenvolvimento (abre em http://localhost:5173)
yarn dev
```

Outros comandos:

```bash
yarn build     # build de produção (tsc + vite)
yarn preview   # pré-visualiza o build
```

## 🧱 Arquitetura

```
src/
├── api/                    # camada de dados
│   ├── axiosInstance.ts    # instância única do Axios (interceptors de auth/erro)
│   ├── authService.ts      # login (acesso livre no mock)
│   ├── atendimentosService.ts
│   ├── dashboardService.ts
│   └── mockData.ts         # dados de apresentação
├── hooks/                  # hooks reutilizáveis
│   ├── useAsync.ts         # loading/erro/reload genérico
│   ├── useAuth.tsx         # contexto de autenticação
│   ├── useAtendimentos.ts
│   └── useDashboard.ts
├── components/
│   ├── ui/                 # Icon, Avatar, ChannelTag, Logo, HandlerChip
│   └── layout/             # NavRail
├── pages/                  # Login, Atendimento, AtendimentoFoco, Dashboard
├── routes/                 # ProtectedRoute
├── types/                  # tipos de domínio
├── styles/global.css       # design system (tokens + componentes)
├── App.tsx                 # rotas
└── main.tsx                # entrypoint
```

### Boas práticas aplicadas
- **TypeScript estrito** e tipos de domínio centralizados em `src/types`.
- **Hooks** para toda lógica de estado/efeito; componentes de apresentação sem lógica de rede.
- **Chamadas de API isoladas** em serviços que usam uma única **instância Axios** com
  interceptors (token + tratamento de erro). Alias `@/` para imports limpos.
- **Alternância mock/real**: os serviços já têm o código das chamadas reais; basta definir
  `VITE_USE_MOCK=false` (ver `.env.example`) e apontar `VITE_API_URL` para o backend.

## 🔌 Conectando um backend real
1. Copie `.env.example` para `.env` e ajuste `VITE_API_URL`.
2. Defina `VITE_USE_MOCK=false`.
3. Implemente os endpoints usados pelos serviços (`/auth/login`, `/atendimentos`,
   `/atendimentos/:id`, `/dashboard`, etc.).

---
F B SERVIÇOS LTDA · Uberlândia — MG
