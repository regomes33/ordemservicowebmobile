# 🚀 Guia Completo de Deploy - Sistema Ordem de Serviço

Este guia unifica o processo de deploy do **Frontend (Vercel)** e **Mobile (Play Store)**.

---

## 📱 Parte 1: Deploy do Frontend na Vercel

### Opção Rápida: Deploy Automático

1. **Acesse**: [vercel.com/new](https://vercel.com/new)
2. **Importe** seu repositório Git
3. **Configure**:
   - Root Directory: `frontend`
   - Framework: Vite (detectado automaticamente)
4. **Adicione variáveis de ambiente** (veja `.env.example`)
5. **Deploy** 🎉

### Opção CLI

```bash
cd "/home/admin21/Ordem de Servico/frontend"
npm install -g vercel
vercel login
vercel
```

📖 **Guia completo**: [`DEPLOY_VERCEL.md`](./DEPLOY_VERCEL.md)

---

## 📱 Parte 2: Deploy do Mobile na Play Store

### Preparação (Já feito!)

✅ Configurações criadas:
- `app.json` configurado
- `eas.json` criado
- Ícones gerados
- Script de deploy pronto

### Deploy em 3 Passos

#### 1. Copiar Ícones

Copie as imagens geradas para:
- `mobile/assets/icon.png`
- `mobile/assets/adaptive-icon.png`
- `mobile/assets/splash-icon.png`

#### 2. Executar Script

```bash
cd "/home/admin21/Ordem de Servico/mobile"
./deploy.sh
```

Escolha:
- **Opção 1**: Preview (APK para testar)
- **Opção 2**: Production (AAB para Play Store)

#### 3. Upload na Play Store

1. Acesse [play.google.com/console](https://play.google.com/console)
2. Crie novo app
3. Faça upload do `.aab`
4. Preencha informações da loja
5. Envie para revisão

📖 **Guias completos**:
- [`DEPLOY_SIMPLES.md`](../mobile/DEPLOY_SIMPLES.md) - Guia simplificado
- [`DEPLOY_PLAYSTORE.md`](../mobile/DEPLOY_PLAYSTORE.md) - Guia detalhado

---

## 🎯 Ordem Recomendada

### 1️⃣ Primeiro: Frontend (Vercel)
- ⏱️ Tempo: 5-10 minutos
- 💰 Custo: Grátis
- ✅ Deploy instantâneo

### 2️⃣ Depois: Mobile (Play Store)
- ⏱️ Tempo: 30-60 minutos (build + configuração)
- 💰 Custo: $25 USD (uma vez)
- ⏳ Revisão: 1-7 dias

**Por quê?**
- O mobile precisa das credenciais Firebase
- É bom testar o sistema web primeiro
- Você pode usar o APK preview enquanto aguarda aprovação

---

## 📋 Checklist Completo

### Frontend (Vercel)
- [ ] Conta Vercel criada
- [ ] Repositório Git configurado (opcional)
- [ ] Variáveis de ambiente adicionadas
- [ ] Deploy realizado
- [ ] App testado em produção

### Mobile (Play Store)
- [ ] Conta Expo criada (grátis)
- [ ] Conta Google Play criada ($25)
- [ ] Ícones copiados para `assets/`
- [ ] EAS CLI instalado (`npm install -g eas-cli`)
- [ ] Build de preview testado
- [ ] Build de produção gerado
- [ ] App criado no Play Console
- [ ] Informações da loja preenchidas
- [ ] AAB enviado para revisão

---

## 💡 Dicas Importantes

### Firebase
- As mesmas credenciais funcionam para web e mobile
- Não precisa configurar nada adicional no Firebase

### Testes
1. **Web**: Teste imediatamente após deploy na Vercel
2. **Mobile Preview**: Gere APK e teste antes de enviar para loja
3. **Mobile Teste Interno**: Use na Play Store para testar antes da produção

### Custos
- **Vercel**: Grátis (plano hobby)
- **Expo/EAS**: Grátis (builds limitados/mês)
- **Play Store**: $25 USD (pagamento único)
- **Total**: ~$25 USD

---

## 🆘 Suporte

### Vercel
- Docs: [vercel.com/docs](https://vercel.com/docs)
- Discord: [vercel.com/discord](https://vercel.com/discord)

### Expo/EAS
- Docs: [docs.expo.dev](https://docs.expo.dev)
- Forums: [forums.expo.dev](https://forums.expo.dev)

### Play Store
- Docs: [developer.android.com](https://developer.android.com)
- Console: [play.google.com/console](https://play.google.com/console)

---

## 🎉 Resultado Final

Após completar ambos os deploys:

✅ **Web App**: `https://seu-projeto.vercel.app`
✅ **Mobile App**: Disponível na Google Play Store
✅ **Sincronização**: Ambos conectados ao mesmo Firebase
✅ **Dados**: Compartilhados entre web e mobile

**Seu sistema completo estará no ar!** 🚀
