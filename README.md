# 🎨 CNAPNE - Sistema de Gestão de Estudantes (Frontend)

Interface web do sistema **CNAPNE**, desenvolvida para consumo da API backend e voltada à gestão e acompanhamento de estudantes com necessidades específicas.

Este frontend foi projetado com foco em **usabilidade, organização de dados sensíveis e controle de acesso por perfil**.

---

## 🎯 Objetivo

Fornecer uma interface intuitiva para:

* 👥 Equipe multidisciplinar acompanhar estudantes
* 📄 Gerenciar laudos e documentos
* 🔐 Garantir acesso seguro baseado em permissões
* 📊 Visualizar informações organizadas do prontuário

---

## 🚀 Tecnologias Utilizadas

* **React**
* **TypeScript**
* **Vite**
* **React Router**
* **Axios** (consumo da API)
* **Context API / Hooks**
* **ESLint + boas práticas de código**

---

## 🧱 Arquitetura do Frontend

O projeto segue uma organização escalável:

* **Separação por responsabilidade**

  * `pages` → telas principais
  * `components` → componentes reutilizáveis
  * `services` → comunicação com API
  * `contexts` → gerenciamento de estado global (auth, etc.)

* **Tipagem forte com TypeScript**

* **Gerenciamento de autenticação via JWT**

* **Proteção de rotas baseada em perfil (RBAC)**

---

## 🔐 Autenticação e Controle de Acesso

* Login integrado com o backend
* Armazenamento de token JWT
* Proteção de rotas privadas
* Renderização condicional baseada em perfil:

Perfis suportados:

* `COORDENACAO_CNAPNE`
* `EQUIPE_AEE`
* `EQUIPE_ACOMPANHAMENTO`
* `ESTUDANTE`

---

## ⚙️ Funcionalidades

### 🔑 Autenticação

* Tela de login integrada com API
* Controle de sessão com JWT

### 🎓 Gestão de Estudantes

* Listagem de alunos
* Visualização de prontuário
* Exibição de dados estruturados

### 📄 Documentos

* Upload de arquivos
* Listagem de documentos
* Visualização/download

### 👨‍💼 Profissionais

* Listagem da equipe
* Visualização de dados

---

## 🔌 Integração com Backend

Este frontend consome a API do projeto:

👉 Backend: [https://github.com/paulorvidal/cnapne](https://github.com/paulorvidal/cnapne)

* Comunicação via **REST API**
* Tratamento de erros (401, 403, etc.)
* Interceptação de requisições (Axios)

---

## ⚡ Execução

```bash
npm install
npm run dev
```

Aplicação disponível em:

👉 [http://localhost:3000](http://localhost:3000)

---

## 📂 Diferenciais

✔️ Integração completa com backend real
✔️ Controle de acesso por perfil (não é só UI)
✔️ Organização de código escalável
✔️ Uso de TypeScript (forte para mercado)
✔️ Separação clara de responsabilidades

---

## 🧠 O que este projeto demonstra

* Construção de interfaces modernas com React
* Consumo de APIs REST reais
* Gerenciamento de autenticação no frontend
* Organização de código para aplicações escaláveis
* Uso de boas práticas com TypeScript

---

## 🚧 Melhorias planejadas

* [ ] Implementar gerenciamento de estado com Zustand ou Redux
* [ ] Melhorar UX/UI (feedback visual, loading states)
* [ ] Testes (React Testing Library)
* [ ] Deploy (Vercel / Netlify)
* [ ] Responsividade completa

---

