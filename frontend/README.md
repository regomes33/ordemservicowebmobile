# Sistema de Ordem de Serviço - Frontend

Sistema web para gerenciamento de ordens de serviço de manutenção e reparo de ar condicionado.

## Tecnologias Utilizadas

- **React** - Biblioteca JavaScript para construção de interfaces
- **Vite** - Build tool e dev server
- **React Router** - Navegação entre páginas
- **Firebase** - Backend (Authentication, Firestore, Storage)
- **Tailwind CSS** - Framework CSS para estilização
- **Lucide React** - Biblioteca de ícones
- **date-fns** - Manipulação de datas

## Instalação

### Pré-requisitos
- Node.js 16+ instalado
- npm ou yarn

### Passos

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Iniciar servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

3. **Acessar aplicação:**
   - Abra o navegador em `http://localhost:5173`

## Estrutura do Projeto

```
frontend/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── Navbar.jsx       # Barra de navegação
│   │   ├── ClientForm.jsx   # Formulário de cliente
│   │   ├── PhotoUploader.jsx # Upload de fotos
│   │   └── MaterialSelector.jsx # Seletor de materiais
│   ├── pages/               # Páginas da aplicação
│   │   ├── Dashboard.jsx    # Dashboard principal
│   │   ├── Clients.jsx      # Gerenciamento de clientes
│   │   ├── ServiceOrders.jsx # Lista de ordens
│   │   ├── ServiceOrderForm.jsx # Formulário de ordem
│   │   ├── Budgets.jsx      # Orçamentos
│   │   └── Reports.jsx      # Relatórios
│   ├── services/            # Serviços e integrações
│   │   └── firebaseService.js # Funções Firebase
│   ├── App.jsx              # Componente principal
│   ├── Login.jsx            # Tela de login
│   ├── firebase.js          # Configuração Firebase
│   ├── index.css            # Estilos globais
│   └── main.jsx             # Entry point
├── index.html               # HTML principal
├── package.json             # Dependências
├── tailwind.config.js       # Configuração Tailwind
└── vite.config.js           # Configuração Vite
```

## Funcionalidades

### ✅ Autenticação
- Login com email e senha
- Registro de novos usuários
- Proteção de rotas privadas

### ✅ Dashboard
- Estatísticas em tempo real
- Contadores de clientes e ordens
- Ações rápidas

### ✅ Gerenciamento de Clientes
- Cadastro de clientes
- Edição e exclusão
- Busca e filtros
- Visualização de ordens por cliente

### ✅ Ordens de Serviço
- Criação de ordens
- Upload de múltiplas fotos
- Seleção de materiais com cálculo automático
- Controle de status (Pendente, Em Andamento, Concluída)
- Filtros por status e cliente

### ✅ Orçamentos
- Geração automática de orçamentos
- Aprovação/rejeição
- Visualização detalhada de itens

### ✅ Relatórios
- Estatísticas mensais
- Análise de receita
- Breakdown por tipo de serviço
- Top clientes

## Configuração do Firebase

O projeto já está configurado com Firebase. As credenciais estão em `src/firebase.js`.

### Coleções Firestore:
- `clients` - Dados dos clientes
- `serviceOrders` - Ordens de serviço
- `materials` - Catálogo de materiais
- `budgets` - Orçamentos gerados

### Firebase Storage:
- Fotos armazenadas em `service-orders/{orderId}/`

## Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run preview` - Preview do build de produção

## Próximos Passos

1. Adicionar materiais iniciais no Firestore
2. Testar todas as funcionalidades
3. Ajustar estilos conforme necessário
4. Configurar PWA para uso offline
5. Deploy para produção
