# 📚 Guia Completo - SAME Dashboard

Um dashboard moderno de gestão de vendas e fluxo de caixa construído com React, Firebase e Tailwind CSS.

---

## 🏗️ Arquitetura do Projeto

```
SAME-dashboard-web-v2/
├── dev/                          # Pasta principal do desenvolvimento
│   ├── src/
│   │   ├── components/           # Componentes reutilizáveis
│   │   ├── pages/                # Páginas da aplicação
│   │   ├── hooks/                # Custom hooks (autenticação, dados)
│   │   ├── layouts/              # Layouts (MainLayout)
│   │   ├── services/             # Serviços (Firebase)
│   │   ├── styles/               # CSS global
│   │   ├── theme/                # Configurações de tema
│   │   ├── utils/                # Funções utilitárias
│   │   ├── App.jsx               # Componente raiz com rotas
│   │   └── main.jsx              # Entry point
│   ├── vite.config.js            # Configuração do Vite
│   ├── tailwind.config.js        # Configuração do Tailwind
│   ├── postcss.config.js         # Configuração do PostCSS
│   └── index.html                # HTML principal
├── package.json                  # Dependências do projeto
└── tailwind.config.js            # Tailwind na raiz (compatibilidade)
```

---

## 🚀 Stack Tecnológico

### Frontend
- **React 18.2.0** - Biblioteca UI moderna
- **React Router 6.20.0** - Roteamento de páginas
- **Vite 5.0.8** - Build tool rápido
- **Tailwind CSS 3.4.1** - Utilitários CSS
- **Lucide React 0.308.0** - Ícones SVG

### Backend
- **Firebase 10.7.0** - BaaS (autenticação, banco de dados, storage)
  - Authentication (Email/Senha, Google)
  - Firestore (banco de dados NoSQL)

### Utilitários
- **Recharts 2.15.4** - Gráficos e visualizações
- **jsPDF + jsPDF-autotable** - Geração de PDFs
- **PostCSS + Autoprefixer** - Processamento CSS

---

## 🔑 Conceitos Principais

### 1. Estrutura de Pastas

#### `src/components/` - Componentes Reutilizáveis
Componentes que são usados em múltiplas páginas:
- `Sidebar.jsx` - Menu lateral com navegação e toggle de minimizar
- `Header.jsx` - Cabeçalho da aplicação
- `MetricCard.jsx` - Card para exibir métricas
- `CashFlowChart.jsx` - Gráfico de fluxo de caixa
- `ProductAlerts.jsx` - Alertas de produtos
- Formulários e tabelas

#### `src/pages/` - Páginas da Aplicação
Cada página é uma rota diferente:
- `Login.jsx` - Página de autenticação
- `ForgotPassword.jsx` - Recuperação de senha
- `Dashboard.jsx` - Página inicial com métricas
- `Products.jsx` - Gestão de produtos
- `Suppliers.jsx` - Gestão de fornecedores
- `Sales.jsx` - Histórico de vendas
- `Accounts.jsx` - Contas/clientes
- `CashFlow.jsx` - Fluxo de caixa
- `Relatorios.jsx` - Relatórios

#### `src/hooks/` - Custom Hooks
Hooks customizados para lógica reutilizável:
- `useAuth.jsx` - Contexto de autenticação
- `useProducts.jsx` - Hook para dados de produtos
- `useSales.js` - Hook para vendas
- `useCashFlow.jsx` - Hook para fluxo de caixa
- Outros hooks para dados específicos

#### `src/layouts/` - Layouts
- `MainLayout.jsx` - Layout principal (Sidebar + Header + Conteúdo)

#### `src/services/` - Serviços Externos
- `firebase.js` - Configuração e funções do Firebase

---

## 🔐 Sistema de Autenticação

### `useAuth.jsx` - Gerenciador de Autenticação

```javascript
// Contexto de autenticação que fornece:
{
  user,              // Usuário logado (uid, email, displayName)
  loading,           // Status de carregamento
  logout,            // Função para fazer logout
  signIn,            // Login com email e senha
  signUp,            // Criar nova conta
  signInWithGoogle,  // Login com Google
  resetPassword      // Resetar senha
}
```

#### Fluxo de Autenticação:

1. **Login com Email/Senha:**
   ```javascript
   await signIn(email, password);
   // Autentica com Firebase
   // Carrega dados do usuário do Firestore
   // Redireciona para dashboard
   ```

2. **Login com Google:**
   ```javascript
   await signInWithGoogle();
   // Abre pop-up do Google
   // Firebase gerencia a autenticação
   // Carrega perfil do Google
   ```

3. **Criar Conta:**
   ```javascript
   await signUp(email, password);
   // Cria novo usuário no Firebase
   // Inicializa estrutura no Firestore
   ```

4. **Recuperar Senha:**
   ```javascript
   await resetPassword(email);
   // Envia email com link de recuperação
   ```

### Proteção de Rotas
```javascript
// Em MainLayout.jsx:
if (!user) {
  return <Navigate to="/login" replace />;
}
// Garante que apenas usuários autenticados acessem
```

---

## 📊 Estrutura de Dados (Firestore)

### Banco de Dados Firebase
```
firestore/
├── tenants/                 # Coleção de empresas/inquilinos
│   └── {userId}/
│       ├── meta/
│       │   └── settings     # Nome fantasia, configs
│       ├── products/        # Produtos da empresa
│       ├── sales/           # Vendas realizadas
│       ├── suppliers/       # Fornecedores
│       ├── accounts/        # Contas/clientes
│       └── cashflow/        # Fluxo de caixa
```

### Exemplo: Documento de Produto
```javascript
{
  id: "prod_123",
  name: "Notebook",
  price: 2500.00,
  quantity: 5,
  sku: "NB-001",
  minStock: 2,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

---

## 🎨 Styling - Tailwind CSS + CSS Global

### Configuração (tailwind.config.js)
```javascript
// Define cores customizadas
colors: {
  primary: {
    600: '#a855f7',  // Roxo principal
    700: '#9333ea'   // Roxo mais escuro
  }
}

// Extensões de tema
extend: {
  // Cores customizadas
  // Tipografia
  // Animações
}
```

### Classe Global (globals.css)
- Importa Tailwind (`@tailwind base; @tailwind components; @tailwind utilities;`)
- Define variáveis CSS (cores, espaçamentos)
- Cria classes utilitárias customizadas
- Reset de estilos padrão

### Exemplo de Uso
```jsx
<div className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
  Botão
</div>
```

---

## 📱 Componentes Principais

### `Sidebar.jsx` - Menu Lateral
```jsx
Props:
- isOpen (boolean)    // Se está expandido ou minimizado
- onToggle (function) // Callback para alternar estado

Recurso:
- Menu com 7 itens de navegação
- Indica página ativa com cor roxa
- Botão de logout
- Toggle para minimizar (80px width)
- Animação suave de transição
```

### `MainLayout.jsx` - Layout Principal
```jsx
Estrutura:
┌─────────────────────────────────┐
│ Header                          │
├──────────┬──────────────────────┤
│          │                      │
│ Sidebar  │  Conteúdo Principal  │
│          │   (rotas)            │
│          │                      │
└──────────┴──────────────────────┘

Funcionalidades:
- Gerencia estado da sidebar (aberta/fechada)
- Protege rotas (requer autenticação)
- Renderiza página correta conforme rota
```

### `Dashboard.jsx` - Página Inicial
```jsx
Exibe:
- 4 cards de métricas (Receita, Despesas, Lucro, Vendas)
- Filtro por período (Dia, Mês, Ano)
- Gráfico de fluxo de caixa
- Alertas de produtos
- Produtos com estoque baixo

Cálculos:
- Compara período atual vs anterior
- Calcula variação percentual
- Filtra dados por data
```

---

## 🔄 Fluxo de Dados (Firebase)

### Exemplo: Fetch de Produtos
```javascript
// Em useProducts.jsx:
1. Cria query no Firestore:
   const q = query(
     collection(db, `tenants/${user.uid}/products`),
     orderBy("name")
   );

2. Escuta mudanças em tempo real:
   onSnapshot(q, (snapshot) => {
     const products = snapshot.docs.map(doc => ({
       id: doc.id,
       ...doc.data()
     }));
     setProducts(products);
   });

3. Atualiza estado React quando dados mudam
```

### Padrão em Todo Hook
```javascript
// useProducts.jsx, useSales.jsx, etc.
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  // Busca dados do Firestore
  // Escuta mudanças em tempo real
  // Atualiza estado
}, [user]);

return { data, loading, error };
```

---

## 🛣️ Roteamento (React Router)

### Estrutura de Rotas (`App.jsx`)
```javascript
/login              → Login.jsx          (pública)
/forgot-password    → ForgotPassword.jsx (pública)
/                   → Dashboard.jsx      (protegida)
/cashflow           → CashFlow.jsx       (protegida)
/sales              → Sales.jsx          (protegida)
/products           → Products.jsx       (protegida)
/suppliers          → Suppliers.jsx      (protegida)
/accounts           → Accounts.jsx       (protegida)
/relatorios         → Relatorios.jsx     (protegida)
```

### Navegação
```javascript
// Usar Link para navegação sem reload
import { Link } from "react-router-dom";
<Link to="/products">Ver Produtos</Link>

// Usar useNavigate para redireção programática
const navigate = useNavigate();
navigate("/dashboard");
```

---

## 💾 CRUD - Exemplos Práticos

### Create (Criar)
```javascript
// Em Products.jsx
import { addDoc, collection } from "firebase/firestore";

const productData = {
  name: "Notebook",
  price: 2500,
  quantity: 5
};

await addDoc(
  collection(db, `tenants/${user.uid}/products`),
  productData
);
```

### Read (Ler)
```javascript
// Em useProducts.jsx
import { onSnapshot, query, collection } from "firebase/firestore";

const q = query(collection(db, `tenants/${user.uid}/products`));
onSnapshot(q, (snapshot) => {
  const products = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
});
```

### Update (Atualizar)
```javascript
// Em Products.jsx
import { updateDoc, doc } from "firebase/firestore";

await updateDoc(
  doc(db, `tenants/${user.uid}/products`, productId),
  { name: "Novo Nome", price: 3000 }
);
```

### Delete (Deletar)
```javascript
// Em Products.jsx
import { deleteDoc, doc } from "firebase/firestore";

await deleteDoc(
  doc(db, `tenants/${user.uid}/products`, productId)
);
```

---

## 🚀 Scripts Disponíveis

### Desenvolvimento
```bash
npm run dev
# Inicia servidor de desenvolvimento em http://localhost:5173
```

### Build
```bash
npm run build
# Cria build otimizado para produção em dist/
```

### Preview
```bash
npm run preview
# Visualiza build de produção localmente
```

---

## 🔧 Configuração do Vite

### `vite.config.js`
```javascript
- root: '.'              // Raiz do projeto está em dev/
- plugins: [react()]     // Plugin React com JSX
- css.postcss: './postcss.config.js'  // Processa Tailwind
- optimizeDeps: {...}    // Otimiza loader de .js como JSX
```

### `tailwind.config.js`
```javascript
- content: ["./index.html", "./src/**/*.{js,jsx}"]
  // Escaneia estes arquivos para classes Tailwind
- theme.extend: {...}
  // Estende tema com cores customizadas
```

### `postcss.config.js`
```javascript
- tailwindcss   // Processa @tailwind directives
- autoprefixer  // Adiciona prefixos de navegador
```

---

## 📝 Boas Práticas Implementadas

### 1. Componentização
```javascript
// ✅ Bom: Componentes pequenos e reutilizáveis
export default function MetricCard({ title, value, change, icon, color }) {
  // ...
}

// ❌ Ruim: Tudo em um componente gigante
```

### 2. Custom Hooks
```javascript
// ✅ Bom: Lógica separada em hooks
const { products, loading, error } = useProducts();

// ❌ Ruim: Lógica dentro do componente
```

### 3. Context API
```javascript
// ✅ Bom: Autenticação com contexto
const { user, logout } = useAuth();

// ❌ Ruim: Passar props por múltiplos níveis
```

### 4. Proteção de Rotas
```javascript
// ✅ Bom: Verificar autenticação
if (!user) return <Navigate to="/login" />;

// ❌ Ruim: Nenhuma proteção
```

### 5. Tratamento de Erros
```javascript
// ✅ Bom: Capturar e informar ao usuário
try {
  await saveData();
  setSuccess("Salvo com sucesso!");
} catch (error) {
  setError(error.message);
}

// ❌ Ruim: Não tratar erros
```

---

## 🎯 Fluxo Completo de Uso

### 1. Usuário Novo
```
1. Acessa /login
2. Clica em "Não tem conta? Crie uma"
3. Preenche email e senha
4. Firebase cria novo usuário
5. Firestore inicializa estrutura do inquilino
6. Redirecionado para dashboard
```

### 2. Usuário Existente - Login Email
```
1. Acessa /login
2. Preenche email e senha
3. Firebase autentica
4. useAuth carrega dados do Firestore
5. Redirecionado para dashboard
```

### 3. Usuário Existente - Login Google
```
1. Acessa /login
2. Clica em "Continuar com Google"
3. Pop-up do Google abre
4. Firebase vincula conta Google
5. Dados do perfil Google carregam
6. Redirecionado para dashboard
```

### 4. Usuário Esqueceu Senha
```
1. Acessa /login
2. Clica em "Esqueceu sua senha?"
3. Preenche email
4. Firebase envia email de recuperação
5. Usuário clica link no email
6. Cria nova senha
```

### 5. Navegar Entre Páginas
```
1. Clica em "Produtos" na sidebar
2. Router muda para /products
3. MainLayout renderiza Products.jsx
4. useProducts() busca dados do Firestore
5. Produtos aparecem na tela
```

---

## 🐛 Troubleshooting

### "Port 5173 is in use"
```bash
# Solução: Use outra porta
npm run dev -- --port 3000
```

### "Tailwind styles não aparecem"
```bash
# Solução: Limpe cache
1. Delete node_modules/.cache/
2. npm run dev
```

### "Firebase error: permission denied"
```javascript
// Solução: Adicione regras Firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tenants/{userId}/{document=**} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

### "Google login não funciona"
```javascript
// Solução: Configure domínios autorizados
1. Firebase Console → Authentication
2. Settings → Authorized domains
3. Adicione seu domínio
```

---

## 📚 Recursos Úteis

- [React Docs](https://react.dev)
- [Firebase Docs](https://firebase.google.com/docs)
- [React Router Docs](https://reactrouter.com)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Docs](https://vitejs.dev)

---

## 📦 Próximos Passos

1. **Autenticação avançada**
   - Two-factor authentication (2FA)
   - Single Sign-On (SSO)

2. **Performance**
   - Code splitting com React.lazy()
   - Virtualização de listas grandes
   - Caching com React Query

3. **Features**
   - Export de dados em Excel
   - Gráficos mais avançados
   - Sistema de notificações

4. **Segurança**
   - Rate limiting
   - Validação de dados no servidor
   - HTTPS obrigatório

---

**Desenvolvido com ❤️ usando React, Firebase e Tailwind CSS**
