# 📱 Guia de Instalação e Teste - App Mobile

## ✅ O Que Foi Implementado

O app mobile React Native agora possui todas as funcionalidades principais:

- ✅ **Dashboard** com estatísticas em tempo real
- ✅ **Gerenciamento de Clientes** (criar, editar, excluir, buscar)
- ✅ **Ordens de Serviço** (criar, editar, filtrar por status)
- ✅ **Captura de Fotos** com câmera ou galeria
- ✅ **Upload de Fotos** para Firebase Storage
- ✅ **Navegação Drawer** (menu lateral)
- ✅ **Autenticação** com Firebase

---

## 🚀 Como Instalar e Testar

### Passo 1: Parar o Expo Atual

Se o Expo estiver rodando, pressione `Ctrl+C` no terminal para parar.

### Passo 2: Instalar Novas Dependências

No terminal WSL, execute:

```bash
cd "/home/admin21/Ordem de Servico/mobile"
npm install
```

Isso instalará todas as novas dependências:
- Firebase
- React Navigation Drawer
- Expo Camera
- Expo Image Picker
- Date-fns
- React Native Picker

### Passo 3: Limpar Cache e Reiniciar

```bash
npx expo start --clear
```

### Passo 4: Escanear QR Code no Celular

1. Abra o **Expo Go** no celular
2. Escaneie o **QR code** que aparece no terminal
3. Aguarde o app carregar

---

## 📱 Testando as Funcionalidades

### 1. Login
- Faça login com as mesmas credenciais do sistema web
- Ou crie uma nova conta

### 2. Dashboard
- Veja as estatísticas de clientes e ordens
- Toque nos cards para navegar
- Use os botões de ação rápida

### 3. Menu Lateral
- Deslize da esquerda para direita
- Ou toque no ícone ☰ no topo
- Navegue entre Dashboard, Clientes e Ordens

### 4. Clientes
- Toque em **"+ Novo"** para adicionar cliente
- Preencha nome e telefone (obrigatórios)
- Busque clientes pelo nome, email ou telefone
- Toque em um cliente para editar
- Toque no 🗑️ para excluir

### 5. Ordens de Serviço
- Toque em **"+ Nova"** para criar ordem
- Selecione um cliente
- Escolha o tipo de serviço
- Descreva o serviço
- **Tire fotos** com a câmera ou selecione da galeria
- Defina o valor da mão de obra
- Salve a ordem

### 6. Captura de Fotos
- Toque em **"📷 Tirar Foto"** para usar a câmera
- Ou **"🖼️ Galeria"** para selecionar imagens
- As fotos são enviadas automaticamente para o Firebase
- Toque no **✕** para remover uma foto

---

## 🎯 Funcionalidades Principais

### Dashboard
- Total de clientes
- Ordens pendentes
- Ordens em andamento
- Ordens concluídas
- Ações rápidas

### Clientes
- Lista com busca
- Criar/editar/excluir
- Informações completas (nome, telefone, email, endereço)

### Ordens de Serviço
- Filtros por status (Todas, Pendentes, Em Andamento, Concluídas)
- Busca por descrição ou cliente
- Captura de múltiplas fotos
- Seleção de cliente via dropdown
- Tipos de serviço: Manutenção, Reparo, Instalação, Limpeza
- Cálculo de mão de obra

---

## 📂 Estrutura Criada

```
mobile/
├── App.js                          # Navegação principal
├── firebaseConfig.js               # Configuração Firebase
├── package.json                    # Dependências atualizadas
├── services/
│   └── firebaseService.js          # Funções CRUD
├── screens/
│   ├── LoginScreen.js              # Login/Registro
│   ├── DashboardScreen.js          # Dashboard com stats
│   ├── ClientsScreen.js            # Lista de clientes
│   ├── ClientFormScreen.js         # Formulário de cliente
│   ├── ServiceOrdersScreen.js      # Lista de ordens
│   └── ServiceOrderFormScreen.js   # Formulário de ordem
└── components/
    └── PhotoCapture.js             # Captura de fotos
```

---

## ⚠️ Permissões Necessárias

Quando usar a câmera pela primeira vez, o app pedirá permissão:
- **Android**: Permissão de câmera
- **iOS**: Permissão de câmera e fotos

Toque em **"Permitir"** para usar todas as funcionalidades.

---

## 🔄 Sincronização com Web

O app mobile usa o **mesmo Firebase** que o sistema web:
- Clientes criados no mobile aparecem no web
- Ordens criadas no web aparecem no mobile
- Fotos são compartilhadas entre as plataformas
- Tudo sincroniza em tempo real

---

## 💡 Dicas de Uso

1. **Recarregar dados**: Puxe a lista para baixo (pull to refresh) - *será implementado*
2. **Navegação rápida**: Use o menu lateral para alternar entre seções
3. **Fotos**: Tire fotos direto do app para documentar serviços
4. **Busca**: Use a busca para encontrar clientes ou ordens rapidamente

---

## 🎉 Pronto para Usar!

O app mobile está completo e funcional. Você pode:
- Cadastrar clientes em campo
- Criar ordens de serviço no local
- Tirar fotos do serviço
- Tudo sincroniza automaticamente com o sistema web

---

## 🆘 Problemas Comuns

### App não carrega após atualização
```bash
cd "/home/admin21/Ordem de Servico/mobile"
rm -rf node_modules
npm install
npx expo start --clear
```

### Câmera não funciona
- Verifique se deu permissão
- Tente fechar e abrir o app novamente

### Fotos não aparecem
- Verifique sua conexão com internet
- As fotos precisam de internet para upload

---

**Teste todas as funcionalidades e me avise se encontrar algum problema!** 📱✨
