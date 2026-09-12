# Chácara Oasis — Sistema de Reservas (Backend + Frontend)

Este pacote contém os dois projetos já integrados e testados juntos:

```
chacara-oasis-completo/
├── backend/    → API FastAPI (Python) — reservas, disponibilidade, e-mail ao ADM
└── frontend/   → Site (React + TanStack Start) — calendário e formulário de reserva
```

O bug que derrubava toda criação de reserva (erro 500 em `POST /api/bookings`)
já foi corrigido no `backend/app/crud.py` — detalhes em `backend/CORRECAO-APLICADA.md`.

## Pré-requisitos

- **Python 3.11+** (para o backend)
- **Node.js 20+** (para o frontend)

## 1. Subir o backend

```bash
cd backend
python -m venv venv

# Ativar o ambiente virtual:
# Linux/Mac:
source venv/bin/activate
# Windows:
venv\Scripts\activate

pip install -r requirements.txt

# Copie o arquivo de exemplo (opcional — os padrões já funcionam com SQLite)
cp .env.example .env

uvicorn app.main:app --reload --port 8000
```

Deixe esse terminal aberto. A API sobe em `http://localhost:8000` e a
documentação interativa (Swagger) fica em `http://localhost:8000/docs`.

O banco de dados é SQLite e é criado automaticamente (`chacara_oasis.db`) —
não precisa instalar nem configurar nada além disso para testar localmente.

## 2. Subir o frontend

Em **outro terminal**:

```bash
cd frontend
npm install

# Copie o arquivo de exemplo e confirme que aponta para o backend acima
cp .env.example .env
# .env deve conter: VITE_API_URL=http://localhost:8000

npm run dev
```

O terminal vai mostrar o endereço local (algo como `http://localhost:3000`).
Abra esse endereço no navegador.

## 3. Testar o fluxo completo

1. Na seção de reservas do site, escolha uma data de entrada e uma de saída no calendário.
2. Preencha o formulário (nome, e-mail, telefone, CPF, tipo de evento, número de pessoas).
3. Clique em **"Enviar no WhatsApp"** ou **"Solicitar por e-mail"**.
4. Você deve ver a mensagem de sucesso com o **código da reserva**.
5. Recarregue a página e veja que as datas escolhidas agora aparecem como ocupadas no calendário.
6. Tente reservar o mesmo período de novo — o sistema deve recusar (data indisponível).

Se quiser conferir direto na API, acesse `http://localhost:8000/docs` e teste
os endpoints manualmente pelo Swagger.

## 4. (Opcional) Ativar o e-mail de notificação ao ADM

No `backend/.env`, preencha:

```
SMTP_USER=seuemail@gmail.com
SMTP_PASSWORD=sua-app-password-do-gmail   # não é a senha normal da conta
ADMIN_EMAIL=email-que-vai-receber-as-reservas@exemplo.com
```

Gere a "App Password" nas configurações de segurança da conta Google
(com a verificação em duas etapas ativada). Sem isso, o site funciona
normalmente — só não chega e-mail para o ADM a cada nova reserva.

## Colocando em produção (resumo)

- **Backend:** troque `DATABASE_URL` para um PostgreSQL de produção e rode
  atrás de um servidor ASGI como o próprio `uvicorn` (com `gunicorn -k uvicorn.workers.UvicornWorker`)
  ou em um serviço como Railway, Render ou Fly.io.
- **Frontend:** rode `npm run build` dentro de `frontend/` e publique o
  resultado (o projeto usa Nitro/TanStack Start, com suporte a deploy em
  Cloudflare, Node ou Vercel). Ajuste `VITE_API_URL` para a URL pública do
  backend antes do build.
- Restrinja `allow_origins` no CORS do backend (`app/main.py`) para o domínio
  real do site em vez de `"*"`, por segurança.
