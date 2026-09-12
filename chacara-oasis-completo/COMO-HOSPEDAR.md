# Como hospedar de graça — Chácara Oasis

Três serviços gratuitos, sem cartão de crédito:

| Peça | Onde | Por quê |
|---|---|---|
| Banco de dados | **Neon** (neon.tech) | Postgres grátis permanente (0,5 GB, nunca expira) |
| Backend (API) | **Render** (render.com) | Roda o FastAPI de graça (dorme após 15 min sem uso) |
| Frontend (site) | **Cloudflare Workers** | O projeto já vem pré-configurado pra isso, 100 mil requisições/dia grátis |

Testei essa combinação (Postgres real + backend) antes de te mandar este guia — funciona.

---

## 1. Criar o banco no Neon

1. Crie uma conta em **https://neon.tech** (pode entrar com GitHub/Google).
2. Clique em **"New Project"**. Dê um nome, ex: `chacara-oasis`.
3. Na tela do projeto, procure o botão **"Connection string"** (ou aba "Connect").
4. Copie a string. Ela se parece com:
   ```
   postgresql://usuario:senha@ep-xxxxx-pooler.neon.tech/neondb?sslmode=require
   ```
5. Guarde essa string — vai usar no passo 3.

## 2. Atualizar o código no GitHub

O Render precisa puxar o código de um repositório GitHub. Se você já tem o
repositório `Sistema-de-Agendamento-Oasis`, é só atualizar com os arquivos
corrigidos deste pacote (a pasta `backend/` aqui já tem o `crud.py` corrigido
e o `requirements.txt` com o driver do Postgres adicionado).

No terminal, dentro da pasta onde você clonou o repositório do GitHub:

```
copy caminho\para\chacara-oasis-completo\backend\app\crud.py app\crud.py
copy caminho\para\chacara-oasis-completo\backend\requirements.txt requirements.txt
git add .
git commit -m "Corrige bug de criação de reserva e adiciona suporte a Postgres"
git push
```

(Ajuste os caminhos conforme onde cada pasta estiver no seu computador.)

## 3. Deploy do backend no Render

1. Crie uma conta em **https://render.com** (dá pra entrar com GitHub).
2. Clique em **"New +" → "Web Service"**.
3. Conecte sua conta do GitHub e escolha o repositório `Sistema-de-Agendamento-Oasis`.
4. Preencha:
   - **Root Directory**: `Sistema-de-Agendamento-Oasis-corrigido` (o nome da pasta onde está o `app/` e o `requirements.txt` dentro do repositório)
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: Free
5. Em **"Environment Variables"**, adicione:
   - `DATABASE_URL` = a connection string do Neon que você copiou
   - `SMTP_USER`, `SMTP_PASSWORD`, `ADMIN_EMAIL` = se quiser o e-mail automático (veja instruções anteriores sobre a senha de app do Gmail)
6. Clique em **"Create Web Service"**. Espere o deploy (alguns minutos).
7. Ao terminar, você vai ter uma URL pública tipo:
   ```
   https://sistema-de-agendamento-oasis.onrender.com
   ```
   Guarde essa URL — é o endereço do seu backend.

Teste no navegador: `https://sua-url.onrender.com/docs` deve abrir o Swagger da API.

## 4. Deploy do frontend no Cloudflare Workers

Na pasta `frontend/` deste pacote, no terminal:

```
npm install
npm install -g wrangler
```

Edite o arquivo `.env` da pasta `frontend/` e coloque a URL do Render do passo 3:

```
VITE_API_URL=https://sua-url.onrender.com
```

Agora gere o build de produção e faça login no Cloudflare:

```
npm run build
wrangler login
```

Isso abre o navegador pra você autorizar (crie uma conta gratuita se ainda não tiver).
Depois, publique:

```
npx wrangler deploy
```

Ao final, o terminal mostra a URL pública do site, algo como:

```
https://tanstack-start-ts.SEU-USUARIO.workers.dev
```

Esse é o link do site no ar, funcionando com o backend real.

## 5. (Opcional, mas recomendado) Travar o CORS

No arquivo `backend/app/main.py`, troque:

```python
allow_origins=["*"],
```

por:

```python
allow_origins=["https://tanstack-start-ts.SEU-USUARIO.workers.dev"],
```

usando a URL real do seu site no Cloudflare Workers. Isso impede que outros
sites façam requisições para a sua API. Depois de editar, faça `git push` de
novo — o Render reimplanta sozinho a cada push.

## Resumo do fluxo depois de pronto

```
Cliente acessa o site (Cloudflare Workers)
        │
        ▼
Formulário de reserva → chama a API (Render)
        │
        ▼
API salva no banco (Neon, permanente)
        │
        ▼
E-mail automático pro ADM (se configurado)
```

## Limitações do plano grátis (bom saber)

- **Render free**: a API "dorme" depois de 15 min sem acesso. A primeira
  requisição depois disso demora uns 30-60 segundos pra responder — depois
  volta ao normal. Isso é aceitável para um site de reservas de baixo volume.
- **Neon free**: 0,5 GB de armazenamento — mais que suficiente para milhares
  de reservas de uma chácara.
- **Cloudflare Workers free**: 100 mil requisições por dia — bem acima do que
  um site desse porte vai usar.
