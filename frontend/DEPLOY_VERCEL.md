# 🚀 Deploy no Vercel - Guia Completo

Este guia mostra como fazer o deploy do frontend na Vercel.

## 📋 Pré-requisitos

1. **Conta na Vercel** (grátis)
   - Acesse [vercel.com](https://vercel.com)
   - Faça login com GitHub, GitLab ou email

2. **Projeto no Git** (opcional mas recomendado)
   - GitHub, GitLab ou Bitbucket
   - Se não tiver, pode fazer upload manual

---

## 🚀 Método 1: Deploy via Git (Recomendado)

### Passo 1: Conectar Repositório

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Clique em "Import Git Repository"
3. Selecione seu repositório
4. Clique em "Import"

### Passo 2: Configurar Projeto

A Vercel detecta automaticamente que é um projeto Vite. Verifique:

- **Framework Preset**: Vite
- **Root Directory**: `frontend` (se o repo tiver múltiplas pastas)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Passo 3: Adicionar Variáveis de Ambiente

Clique em "Environment Variables" e adicione:

```
VITE_FIREBASE_API_KEY=AIzaSyCayskPNuk1re0To5n6Op7HnwCFiEmcvpk
VITE_FIREBASE_AUTH_DOMAIN=ordem-de-servico-2025.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=ordem-de-servico-2025
VITE_FIREBASE_STORAGE_BUCKET=ordem-de-servico-2025.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=21332335828
VITE_FIREBASE_APP_ID=1:21332335828:web:4fca8d6d089257864d2f41
```

> ⚠️ **Importante**: Essas são suas credenciais Firebase. Copie do arquivo de configuração do Firebase.

### Passo 4: Deploy

1. Clique em "Deploy"
2. Aguarde o build (1-3 minutos)
3. Pronto! Seu app está no ar 🎉

---

## 🚀 Método 2: Deploy Manual (CLI)

### Passo 1: Instalar Vercel CLI

```bash
npm install -g vercel
```

### Passo 2: Login

```bash
vercel login
```

### Passo 3: Deploy

No diretório `frontend`:

```bash
cd "/home/admin21/Ordem de Servico/frontend"
vercel
```

Responda as perguntas:
- Set up and deploy? **Y**
- Which scope? (sua conta)
- Link to existing project? **N**
- Project name? **ordem-de-servico**
- In which directory is your code? **./`**
- Want to override settings? **N**

### Passo 4: Adicionar Variáveis de Ambiente

```bash
vercel env add VITE_FIREBASE_API_KEY
# Cole o valor quando solicitado
# Repita para cada variável
```

Ou adicione via dashboard: [vercel.com/dashboard](https://vercel.com/dashboard)

### Passo 5: Deploy de Produção

```bash
vercel --prod
```

---

## 🔄 Atualizações Automáticas

Com Git conectado:
- ✅ Cada push na branch `main` → deploy automático
- ✅ Pull requests → preview deploy
- ✅ Rollback fácil pelo dashboard

---

## 🌐 Domínio Personalizado

1. Vá em **Settings** → **Domains**
2. Adicione seu domínio
3. Configure DNS conforme instruções
4. Pronto! Seu app em `seudominio.com`

---

## 📊 Monitoramento

A Vercel oferece:
- ✅ Analytics de performance
- ✅ Logs de build e runtime
- ✅ Métricas de uso
- ✅ Alertas de erro

Acesse em: **Analytics** no dashboard

---

## 🆘 Problemas Comuns

### Build falha com erro de TypeScript
```bash
# Localmente, teste o build:
npm run build

# Se funcionar local mas falhar na Vercel:
# Verifique a versão do Node.js em Settings → General
```

### Variáveis de ambiente não funcionam
- Certifique-se que começam com `VITE_`
- Redeploy após adicionar variáveis
- Verifique se estão no ambiente correto (Production/Preview)

### Rotas 404
- O `vercel.json` já está configurado para SPA
- Se ainda tiver problema, verifique se o arquivo existe na raiz do projeto

---

## ✅ Checklist de Deploy

- [ ] Conta Vercel criada
- [ ] Projeto conectado (Git ou CLI)
- [ ] Variáveis de ambiente configuradas
- [ ] Build testado localmente (`npm run build`)
- [ ] Deploy realizado
- [ ] App testado em produção
- [ ] Domínio configurado (opcional)

---

## 🎉 Pronto!

Seu frontend está no ar! URL: `https://seu-projeto.vercel.app`

**Próximos passos:**
- Configure domínio personalizado
- Ative analytics
- Configure alertas de erro
