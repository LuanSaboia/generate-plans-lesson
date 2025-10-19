# 🧩 Gerador de Planos de Aula — Supabase + Gemini

## 🧠 Sobre o Projeto
Aplicação desenvolvida para o **Teste Técnico 2 – Desenvolvedor Júnior / Estagiário (Supabase Backend Dev 2025)**.  
Gera **planos de aula completos** com IA (Google Gemini) e salva tudo no **Supabase**. O plano contém:

- **Introdução lúdica**
- **Objetivo BNCC**
- **Passo a passo**
- **Rúbrica de avaliação**

---

## ⚙️ Tecnologias
- **Supabase** (Postgres + RLS + Edge Functions)
- **Google Gemini API** (`@google/generative-ai`)
- **React + TypeScript**
- **Supabase JS SDK**
- **Postman** (testes da função)

---

## 🧱 Banco de Dados

### Tabela `lesson_plans`
```sql
create table lesson_plans (
  id uuid primary key default uuid_generate_v4(),
  tema text not null,
  serie text not null,
  duracao text not null,
  disciplina text not null,
  objetivo text not null,
  introducao_ludica text,
  objetivo_bncc text,
  passo_a_passo text,
  rubrica_avaliacao text,
  created_at timestamp default now()
);
```

### Políticas (RLS)
> RLS ativo com acesso público controlado para leitura e inserção (sem autenticação).

```sql
alter table lesson_plans enable row level security;

create policy "Public Select Lesson Plans"
on lesson_plans
for select
to public
using (true);

create policy "Public Insert Lesson Plans"
on lesson_plans
for insert
to public
with check (true);
```

---

## ⚡ Edge Function — `generate_lesson_plan`

**Fluxo:** recebe o JSON → chama Gemini (`gemini-2.5-flash-lite`) → parseia resposta → insere em `lesson_plans`.

**Exemplo (Postman):**
```http
POST https://xgevwldvvuougszyjxkc.supabase.co/functions/v1/generate_lesson_plan
Content-Type: application/json
Authorization: Bearer <ANON_KEY>

{
  "tema": "Fotossíntese e o papel das plantas",
  "serie": "6º ano",
  "duracao": "45 minutos",
  "disciplina": "Ciências",
  "objetivo": "Compreender o processo da fotossíntese e sua importância"
}
```

---

## 💻 Frontend (React + TS)

### `GeneratePlan`
- Formulário com: **Tema, Duração, Série, Disciplina, Objetivo**.
- Envia para a **Edge Function** e exibe o **PlanModal** com o plano gerado.

### `PlanList`
- Lista todos os planos em tabela.
- Ao clicar numa linha, abre modal com detalhes.

### `PlanModal`
- Exibe o plano completo.
- **Parse dinâmico** dos campos que podem vir como JSON ou texto:
  - `passo_a_passo`: array/objeto/texto
  - `rubrica_avaliacao`: array/objeto/texto
- Botão **“X”** no topo.

---

## 🧠 Decisões Técnicas

| Tema | Decisão |
|------|--------|
| Modelo IA | `gemini-2.5-flash-lite` (5s a 10s de execução) adotado após testes com `gemini-2.5-flash` (<30s de execução) |
| Arq. Backend | Edge Function no Supabase faz o parse e insere no banco |
| Estrutura DB | Uma tabela simples (`lesson_plans`) e RLS com políticas públicas |

---

## 🧩 Desafios e Soluções

1. **Modelo Gemini**  
   - *Problema:* `gemini-2.5-flash` possuia um tempo de resposta muito maior do que o esperado.
   - *Solução:* troca para `gemini-2.5-flash-lite` (mais rápido).

2. **Variação de formato JSON da IA**  
   - *Problema:* `passo_a_passo` e `rubrica_avaliacao` variavam entre **array, objeto ou texto**.  
   - *Solução:* parse dinâmico no `PlanModal` com fallback seguro para texto.

3. **RLS bloqueando leitura/escrita**  
   - *Problema:* ao ativar RLS sem policies, o front não listava dados.  
   - *Solução:* políticas `SELECT` e `INSERT` para `public`.

4. **Gemini gerando imagens**  
   - *Problema:* ao realizar testes a IA tentava deixar mais lúdico repassando imagens.  
   - *Solução:* inserido no prompt uma obsersação final `nunca gere imagens, apenas texto`.

---

## 🚀 Como Rodar

### 1) Clonar e instalar
```bash
gh repo clone LuanSaboia/generate-plans-lesson
cd generate-plans-lesson
npm install
```

### 2) Variáveis de ambiente (`.env.local`)
```bash
REACT_APP_SUPABASE_URL=https://xgevwldvvuougszyjxkc.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnZXZ3bGR2dnVvdWdzenlqeGtjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3MDI0NTAsImV4cCI6MjA3NjI3ODQ1MH0.n4aooOH4BR2B2wyloYgF3702lywszpssC9CHL8L2FXc
```


### 3) Rodar em dev
```bash
npm start
```
