# 🚀 Guia de Publicação na Google Play Store

Este guia detalha o processo para publicar seu aplicativo Expo na Google Play Store usando o **EAS Build**.

## 📋 Pré-requisitos

1.  **Conta de Desenvolvedor Google Play**:
    - Crie uma conta em [Google Play Console](https://play.google.com/console).
    - Custo único de **$25 USD**.
2.  **Conta Expo**:
    - Crie uma conta em [expo.dev](https://expo.dev).
    - Faça login no terminal: `npx expo login`.
3.  **EAS CLI Instalado**:
    - Execute: `npm install -g eas-cli`.

---

## 🛠️ Passo 1: Configurar o EAS Build

1.  **Instalar EAS CLI** (se ainda não instalou):
    ```bash
    npm install -g eas-cli
    ```

2.  **Login no Expo**:
    ```bash
    eas login
    ```

3.  **Configurar o Projeto**:
    No diretório `mobile`, execute:
    ```bash
    eas build:configure
    ```
    - Responda **"All"** (Android e iOS) ou **"Android"**.
    - Isso criará um arquivo `eas.json`.

4.  **Verificar `app.json`**:
    Certifique-se de que o `android.package` está definido e é único (ex: `com.seuapp.ordemdeservico`).
    ```json
    "android": {
      "package": "com.seuapp.ordemdeservico",
      "versionCode": 1
    }
    ```

---

## 📦 Passo 2: Gerar o Build de Produção (AAB)

O Google Play exige o formato **.aab** (Android App Bundle).

1.  **Executar o Build**:
    ```bash
    eas build --platform android --profile production
    ```

2.  **Gerenciamento de Credenciais**:
    - O EAS perguntará se você quer gerar uma nova Keystore.
    - Responda **"Yes"** para gerar automaticamente.
    - **IMPORTANTE**: O EAS gerencia isso para você, mas é bom fazer backup das credenciais no site do Expo.

3.  **Aguardar o Build**:
    - O processo acontece na nuvem.
    - Quando terminar, você receberá um link para baixar o arquivo `.aab`.

---

## 📲 Passo 3: Criar o App no Google Play Console

1.  Acesse o [Google Play Console](https://play.google.com/console).
2.  Clique em **"Criar app"**.
3.  Preencha os detalhes:
    - **Nome do App**: Ordem de Serviço
    - **Idioma padrão**: Português (Brasil)
    - **App ou Jogo**: App
    - **Grátis ou Pago**: Grátis
4.  Aceite os termos e clique em **"Criar app"**.

---

## 📝 Passo 4: Preencher Informações da Loja

No menu lateral, vá em **"Painel"** e siga as etapas de "Configurar seu app":

1.  **Acesso ao app**: Todas as funcionalidades estão disponíveis sem acesso especial (ou com login).
2.  **Anúncios**: "Meu app não contém anúncios".
3.  **Classificação de conteúdo**: Responda ao questionário.
4.  **Público-alvo**: Selecione a idade (ex: 18+).
5.  **Apps de notícias**: "Não".
6.  **Rastreamento de contato e status da COVID-19**: "Meu app não é...".
7.  **Segurança dos dados**: Preencha conforme o uso (Firebase coleta alguns dados).
8.  **App governamental**: "Não".
9.  **Categoria e detalhes de contato**: Ferramentas/Produtividade, seu email.
10. **Configurar a página Detalhes do app**:
    - Ícone (512x512 png)
    - Imagem de destaque (1024x500 png)
    - Screenshots do celular (min 2)

---

## 🚀 Passo 5: Enviar para Produção (ou Teste Interno)

1.  No menu lateral, vá em **"Produção"** (ou "Teste interno" para testar primeiro).
2.  Clique em **"Criar nova versão"**.
3.  **Assinatura de apps do Google Play**: Clique em "Continuar" para deixar o Google gerenciar.
4.  **App Bundles**:
    - Faça o upload do arquivo **.aab** que você baixou do EAS Build.
5.  **Nome da versão**: Coloque algo como "1.0.0 - Lançamento Inicial".
6.  **Notas da versão**: "Lançamento inicial do app de Ordem de Serviço".
7.  Clique em **"Próximo"**.
8.  Se houver avisos (warnings), revise-os. Erros (errors) impedem o envio.
9.  Clique em **"Salvar"** e depois **"Enviar para revisão"**.

---

## 🔄 Atualizações Futuras

Para atualizar o app:

1.  Aumente a versão no `app.json`:
    ```json
    "version": "1.0.1",
    "android": {
      "versionCode": 2
    }
    ```
2.  Gere um novo build: `eas build --platform android --profile production`
3.  Crie uma nova versão no Google Play Console e suba o novo `.aab`.

---

## 💡 Dicas Importantes

- **Teste Interno**: Recomendo fortemente lançar primeiro em "Teste interno". Isso permite que você adicione emails de testadores (incluindo o seu) e baixe o app pela Play Store imediatamente, sem esperar a revisão demorada da produção.
- **Revisão**: A primeira revisão do Google pode levar de 1 a 7 dias.
- **Política de Privacidade**: Você precisará de uma URL de política de privacidade. Você pode gerar uma gratuita online e hospedar no GitHub Pages ou similar.
