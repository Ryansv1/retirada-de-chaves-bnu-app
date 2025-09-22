# vite-boilerplate

> Repositório privado de frontend utilizando Vite, React e TypeScript com ESLint Flat Config.

---

## 📄 Descrição

Este projeto é um boilerplate frontend moderno, criado com Vite, React 19, TypeScript e Tailwind CSS. Configurado para alta qualidade de código utilizando ESLint Flat Config e Prettier, além de várias integrações com plugins e bibliotecas populares.

## 🚀 Tecnologias Principais

- **Vite** – Ferramenta de build ultra rápida para projetos frontend. ([docs](https://vitejs.dev/))
- **React 19** – Biblioteca UI reativa. ([docs](https://reactjs.org/))
- **TypeScript** – Superset de JavaScript tipado. ([docs](https://www.typescriptlang.org/))
- **Tailwind CSS** – Framework CSS utilitário. ([docs](https://tailwindcss.com/))
- **ESLint Flat Config** – Nova abordagem de configuração do ESLint. ([docs](https://eslint.org/docs/latest/use/configure/configuration-files#using-flat-configs))
- **Prettier** – Formatador de código consistente. ([docs](https://prettier.io/))

## 📦 Dependências Instaladas

### Dependências de Produção

- `react`, `react-dom` ([docs](https://reactjs.org/))
- `@tanstack/react-query`, `@tanstack/react-query-devtools` ([docs](https://tanstack.com/query))
- `@tanstack/react-router`, `@tanstack/react-router-devtools` ([docs](https://tanstack.com/router))
- `@tanstack/react-table` ([docs](https://tanstack.com/table))
- `@radix-ui/react-*` (Accordion, Dialog, Popover, etc.) ([docs](https://www.radix-ui.com/))
- `clsx`, `class-variance-authority` – Auxiliares de className
- `date-fns`, `luxon` – Manipulação de datas
- `recharts` – Biblioteca de gráficos para React
- `react-day-picker` – Seletor de datas para React
- `react-hook-form` e `@hookform/resolvers` – Gerenciamento de formulários
- `yup`, `zod` – Validação de schemas e tipos
- `zustand` – Gerenciamento de estado global
- `tailwind-merge` – Otimização de classes Tailwind
- `vaul` – Auxílio em genéricos avançados de TypeScript

### Dependências de Desenvolvimento

- **ESLint** e Flat Config:
  - `eslint`, `@eslint/js`, `@eslint/compat`
  - `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`
  - `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`
  - `eslint-plugin-import`, `eslint-plugin-unicorn`
  - `eslint-config-prettier`
- **TypeScript**:
  - `typescript`, `@types/node`, `@types/react`, `@types/react-dom`
- **Vite**:
  - `vite`, `@vitejs/plugin-react`, `@tailwindcss/vite`
- **Outros**:
  - `prettier`, `globals`, `tw-animate-css`
  - `@total-typescript/ts-reset`, `@tanstack/router-plugin`

## ⚙️ Scripts Disponíveis

```bash
# Inicia servidor de desenvolvimento (HMR)
npm run dev

# Compila TypeScript e gera build estática
npm run build

# Executa ESLint em todo o projeto
npm run lint

# Preview do build gerado
npm run preview
```

## ⚙️ Configuração de ESLint Flat Config

1. Certifique-se de ter configurado no VS Code:
   ```json
   {
   	"eslint.experimental.useFlatConfig": true,
   	"eslint.validate": [
   		"javascript",
   		"javascriptreact",
   		"typescript",
   		"typescriptreact"
   	]
   }
   ```
2. Arquivo de configuração principal: `eslint.config.js` (Flat Config).
3. Plugins e regras foram agrupados em módulos:
   - `baseESLintConfig`
   - `typescriptConfig`
   - `reactConfig`
   - `unicornConfig`
4. Prettier é aplicado por último para desabilitar regras conflitantes.

---

Made with ❤️ by your team. Feel free to adapt! 🚀
