# Sistema de Gestão de Aulas

Aplicação de gestão de aulas para uma escola de inglês — alunos, professores,
planos, disponibilidade, agendamento (calendário + aula experimental pública),
integração opcional com Google Calendar e um serviço de notificações
desacoplado de canal (WhatsApp/Email/Push/SMS).

A UI foi construída a partir do HTML de referência (`site.html`) e do design
system em `DESIGN.md`, preservando layout, tipografia (DM Sans + Hanken
Grotesk), cores, espaçamentos e fluxos de navegação originais.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 ·
shadcn/ui · Supabase (Postgres + Auth + RLS) · FullCalendar · React Hook Form
+ Zod · Lucide Icons · googleapis.

## Arquitetura

```
src/
├── app/                # Rotas (App Router). (app)/ = área autenticada
├── components/         # Componentes de UI reutilizáveis, por domínio
├── features/           # Server Actions + schemas de UI por domínio
├── lib/
│   ├── supabase/       # Clients (browser/server/admin) + middleware
│   └── google-calendar/# Integração isolada com Google Calendar
├── services/           # Acesso a dados / regras de negócio (Supabase)
│   └── notifications/  # NotificationService (providers plugáveis)
├── schemas/             # Validação Zod compartilhada
└── types/               # Tipos de domínio + espelho do schema Supabase

supabase/
├── migrations/          # Schema SQL, RLS, funções (versionado)
├── functions/           # Edge Functions (Deno)
└── seed.sql             # Dados de exemplo para desenvolvimento local
```

Regras de negócio (disponibilidade, conflitos de horário, notificações,
sincronização com Google Calendar) vivem em `services/`; os Server Actions em
`features/*/actions.ts` apenas validam entrada (Zod) e delegam.

## Configurando o Supabase

1. Crie um projeto em [supabase.com](https://supabase.com) (ou rode
   `supabase start` localmente com a CLI).
2. Aplique as migrations, na ordem, via SQL editor ou `supabase db push`:
   - `supabase/migrations/0001_init.sql` — tabelas, enums, triggers, e a
     constraint de exclusão que impede sobreposição de horários por professor
     (validação de conflito **no banco**, não apenas no frontend).
   - `supabase/migrations/0002_rls.sql` — Row Level Security para
     `admin` / `teacher` / `student`.
   - `supabase/migrations/0003_functions.sql` — `get_available_slots()` e
     `book_trial_lesson()`, as RPCs que alimentam o fluxo público de aula
     experimental sem expor tabelas diretamente ao usuário anônimo.
   - `supabase/migrations/0004_cron.sql` — habilita `pg_cron`/`pg_net` para
     agendar a Edge Function de lembretes (veja comentário no arquivo).
3. (Opcional, dev) rode `supabase/seed.sql` para ter planos/professores de
   exemplo.
4. Copie `.env.example` para `.env.local` e preencha
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` e
   `SUPABASE_SERVICE_ROLE_KEY`.

As migrations foram validadas ponta a ponta (schema, RLS, RPCs e a
constraint anti-conflito) contra um Postgres real antes de serem incluídas
neste repositório.

## Rodando localmente

```bash
npm install
npm run dev       # http://localhost:3000
npm run test      # Vitest — schemas e helpers
npm run lint
npm run build
```

## Autenticação e papéis

Login usa Supabase Auth (email/senha). Um trigger em `profiles` cria o
perfil automaticamente no signup, com `role` padrão `student` (defina
`admin`/`teacher` via `raw_user_meta_data.role` ao criar o usuário, ou
atualize depois com a service role key). O middleware (`src/proxy.ts`)
protege as rotas de `(app)` e cada página reforça o papel mínimo exigido via
`requireRole()`.

## Google Calendar

Isolado em `src/lib/google-calendar/`. Sem credenciais configuradas
(`GOOGLE_CALENDAR_*` em `.env`), a integração fica automaticamente inativa —
o Supabase continua sendo a fonte de verdade e nada quebra. Com credenciais:
um professor conecta sua conta em **Disponibilidade → Google Calendar** e as
aulas passam a ser criadas/atualizadas/canceladas no Google Calendar
automaticamente.

## Notificações

`src/services/notifications/notification-service.ts` expõe:

```ts
await notificationService.send({ type: "LESSON_REMINDER", userId, lessonId });
```

Providers (`whatsapp`, `email`, `sms`, `push`, `log`) implementam a mesma
interface e só "se ativam" quando as credenciais correspondentes existem em
`.env` — sem isso, tudo cai no provider `log` (grava em `notifications` e no
stdout), sem mockar uma integração que não existe.

Lembretes de aula (~10 min antes) são agendados automaticamente por um
trigger no banco e entregues por `supabase/functions/lesson-reminders`
(Edge Function agendada via `pg_cron`, ver `0004_cron.sql`).

## Fidelidade visual

Os tokens do `tailwind.config` embutido no `site.html` (cores, spacing,
tipografia, radius) foram portados 1:1 para `src/app/globals.css` via
`@theme`, então classes como `bg-mist-gray`, `font-headline`,
`text-headline`, `p-lg` funcionam exatamente como no HTML de referência. Os
ícones Material Symbols do HTML foram mapeados para o equivalente mais
próximo em Lucide (`src/lib/icons.ts`), conforme exigido pela stack.
