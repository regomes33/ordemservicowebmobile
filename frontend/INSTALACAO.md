# Guia de Instalação - Sistema de Ordem de Serviço

## ⚠️ Resolvendo o Erro de Import

O erro que você está vendo acontece porque as dependências ainda não foram instaladas. Siga os passos abaixo:

## 📋 Passo a Passo

### 1. Abrir Terminal WSL

Abra o Windows Terminal ou PowerShell e execute:

```bash
wsl -d Ubuntu-24.04
```

### 2. Navegar até a Pasta do Frontend

```bash
cd "/home/admin21/Ordem de Servico/frontend"
```

### 3. Instalar Dependências

```bash
npm install
```

Este comando irá instalar todas as dependências necessárias, incluindo:
- `react` e `react-dom`
- `firebase`
- `lucide-react` (ícones)
- `date-fns` (datas)
- `tailwindcss` (estilos)
- E outras...

**Aguarde a instalação completar** (pode levar alguns minutos na primeira vez).

### 4. Iniciar o Servidor de Desenvolvimento

Após a instalação concluir, execute:

```bash
npm run dev
```

### 5. Acessar a Aplicação

Abra seu navegador e acesse:

```
http://localhost:5173
```

## 🔧 Solução Alternativa (Se o Erro Persistir)

Se o erro continuar após instalar as dependências, tente:

### Opção 1: Limpar Cache e Reinstalar

```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Opção 2: Verificar Versão do Node

```bash
node --version
```

Certifique-se de ter Node.js 16 ou superior. Se não tiver, instale:

```bash
# Instalar NVM (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Recarregar terminal
source ~/.bashrc

# Instalar Node.js 18
nvm install 18
nvm use 18
```

### Opção 3: Instalar Dependências Manualmente

Se alguma dependência específica estiver faltando:

```bash
npm install lucide-react
npm install date-fns
npm install firebase
npm install react react-dom
npm install react-router-dom
npm install react-firebase-hooks
```

## 📝 Checklist de Verificação

- [ ] WSL Ubuntu 24.04 está instalado
- [ ] Node.js 16+ está instalado
- [ ] Navegou até a pasta correta do frontend
- [ ] Executou `npm install` com sucesso
- [ ] Executou `npm run dev`
- [ ] Acessou `http://localhost:5173` no navegador

## 🎯 Próximos Passos Após Instalação

1. **Criar uma conta** na tela de login
2. **Fazer login** com suas credenciais
3. **Adicionar materiais** ao catálogo (opcional)
4. **Cadastrar clientes**
5. **Criar ordens de serviço**

## 💡 Dica

Se você estiver usando VS Code, pode abrir o terminal integrado diretamente na pasta do projeto:

1. Abra VS Code
2. File → Open Folder
3. Selecione: `\\wsl.localhost\Ubuntu-24.04\home\admin21\Ordem de Servico\frontend`
4. Terminal → New Terminal
5. Execute: `npm install` e depois `npm run dev`

## 🆘 Precisa de Ajuda?

Se o erro persistir, me envie:
1. A mensagem de erro completa
2. A versão do Node.js (`node --version`)
3. O conteúdo do arquivo `package.json`
