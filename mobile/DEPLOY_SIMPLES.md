# 🚀 Guia Simplificado de Deploy - Play Store

Eu preparei tudo para você! Agora é só seguir estes passos simples:

## ✅ O Que Já Foi Configurado

- ✅ `app.json` atualizado com informações do Android
- ✅ `eas.json` criado com perfis de build
- ✅ Ícone e splash screen gerados
- ✅ Script de deploy automatizado criado

---

## 📱 Passo 1: Atualizar os Ícones (IMPORTANTE)

Eu gerei os ícones para você, mas preciso que você copie manualmente:

1. **Ícone do App**: Copie a imagem do ícone que aparece acima para:
   - `mobile/assets/icon.png`
   - `mobile/assets/adaptive-icon.png`

2. **Splash Screen**: Copie a imagem da splash screen para:
   - `mobile/assets/splash-icon.png`

> **Dica**: Clique com botão direito nas imagens geradas → "Salvar como" → salve nos locais indicados

---

## 🚀 Passo 2: Executar o Deploy

Agora é MUITO simples! No terminal WSL:

```bash
cd "/home/admin21/Ordem de Servico/mobile"
./deploy.sh
```

O script vai:
1. ✅ Verificar se o EAS CLI está instalado (instala se necessário)
2. ✅ Verificar seu login no Expo (pede login se necessário)
3. ✅ Perguntar qual tipo de build você quer:
   - **Preview (APK)**: Para testar rapidamente no celular
   - **Production (AAB)**: Para enviar à Play Store

---

## 📝 Passo 3: Primeira Vez? Crie as Contas

### Conta Expo (Grátis)
1. Acesse [expo.dev](https://expo.dev)
2. Clique em "Sign Up"
3. Crie sua conta

### Conta Google Play Console ($25 USD - uma vez)
1. Acesse [play.google.com/console](https://play.google.com/console)
2. Pague a taxa de $25 USD
3. Crie sua conta de desenvolvedor

---

## 🎯 Fluxo Recomendado

### Para Testar Primeiro (Recomendado)
```bash
./deploy.sh
# Escolha opção 1 (Preview)
```
- Gera um APK
- Você instala direto no celular
- Testa tudo antes de enviar para a loja

### Para Publicar na Play Store
```bash
./deploy.sh
# Escolha opção 2 (Production)
```
- Gera um AAB (formato exigido pela Play Store)
- Faça upload no Google Play Console
- Siga as instruções na tela

---

## 📦 Depois do Build

Quando o build terminar:

1. **Você receberá um link** no terminal
2. **Clique no link** para baixar o arquivo
3. **Para APK**: Instale direto no celular
4. **Para AAB**: Faça upload no Google Play Console

---

## 🔄 Atualizações Futuras

Para atualizar o app depois:

1. Edite `mobile/app.json`:
   ```json
   "version": "1.0.1",  // Aumente a versão
   "android": {
     "versionCode": 2   // Aumente o código
   }
   ```

2. Execute novamente:
   ```bash
   ./deploy.sh
   ```

---

## 💡 Dicas Importantes

- **Teste Interno**: Na Play Console, use "Teste Interno" primeiro. É instantâneo!
- **Revisão**: A primeira publicação pode levar 1-7 dias para ser revisada
- **Política de Privacidade**: Você vai precisar de uma URL. Posso gerar uma para você depois!

---

## 🆘 Problemas?

### "eas: command not found"
```bash
npm install -g eas-cli
```

### "Not logged in"
```bash
eas login
```

### Erro no build
- Verifique se copiou os ícones corretamente
- Verifique se está na pasta `mobile`
- Execute `npm install` antes

---

## 🎉 Pronto!

Agora você tem um processo **super simplificado**:
1. Execute `./deploy.sh`
2. Escolha o tipo de build
3. Aguarde
4. Baixe e publique!

**Muito mais fácil do que fazer tudo manualmente!** 🚀
