# AgentFlow

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

**AgentFlow** is a modern, scalable Nx monorepo designed for building agentic applications. This workspace provides a robust foundation for developing AI-powered applications with a clean separation of concerns between frontend, backend, and shared libraries.

## 🏗️ Project Structure

This monorepo follows standard Nx conventions with a well-organized structure:

```
agent-flow/
├── apps/                    # Applications
│   ├── api/                # NestJS API server
│   ├── web/                # React web application
│   ├── api-e2e/           # API end-to-end tests
│   └── web-e2e/           # Web end-to-end tests
├── libs/                    # Shared libraries
│   ├── shared/             # Common shared code
│   │   ├── types/         # TypeScript type definitions
│   │   ├── utils/         # Utility functions
│   │   └── constants/     # Application constants
│   ├── agents/            # AI agent implementations
│   └── ui/                # Shared UI components
├── tools/                   # Custom build tools and scripts
└── dist/                   # Build output directory
```

### Applications (`apps/`)

- **`api/`** - NestJS backend API server providing RESTful endpoints
- **`web/`** - React frontend application with modern UI
- **`api-e2e/`** - End-to-end tests for the API
- **`web-e2e/`** - End-to-end tests for the web application

### Libraries (`libs/`)

- **`shared/types/`** - Common TypeScript interfaces and type definitions
- **`shared/utils/`** - Utility functions used across applications
- **`shared/constants/`** - Application-wide constants and configuration
- **`agents/`** - AI agent implementations and related logic
- **`ui/`** - Reusable UI components and design system

### Tools (`tools/`)

- Custom build scripts, deployment tools, and development utilities

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd agent-flow

# Install dependencies
npm install
```

### Development

#### Start the API Server

```bash
# Start the NestJS API server on port 3002
npx nx serve api

# Or with custom port
PORT=3001 npx nx serve api
```

The API will be available at `http://localhost:3002/api`

#### Start the Web Application

```bash
# Start the React web application
npx nx serve web
```

The web app will be available at `http://localhost:4200`

#### Start Both Applications

```bash
# Terminal 1: Start API
npx nx serve api

# Terminal 2: Start Web
npx nx serve web
```

## 🛠️ Available Commands

### Build Commands

```bash
# Build all applications
npx nx run-many --target=build --all

# Build specific application
npx nx build api
npx nx build web
```

### Test Commands

```bash
# Run all tests
npx nx run-many --target=test --all

# Run unit tests for specific app
npx nx test api
npx nx test web

# Run e2e tests
npx nx e2e api-e2e
npx nx e2e web-e2e
```

### Lint Commands

```bash
# Lint all projects
npx nx run-many --target=lint --all

# Lint specific project
npx nx lint api
npx nx lint web
```

## 📦 Adding New Projects

### Generate a New Application

```bash
# Generate a new React app
npx nx g @nx/react:app admin --directory=apps/admin

# Generate a new NestJS app
npx nx g @nx/nest:app worker --directory=apps/worker
```

### Generate a New Library

```bash
# Generate a shared library
npx nx g @nx/js:lib database --directory=libs/shared/database

# Generate a React component library
npx nx g @nx/react:lib components --directory=libs/ui/components
```

## 🔧 Configuration

### Environment Variables

Create `.env` files for environment-specific configuration:

```bash
# .env.local (for local development)
PORT=3002
DATABASE_URL=postgresql://localhost:5432/agentflow
JWT_SECRET=your-jwt-secret
```

### TypeScript Paths

Shared libraries can be imported using TypeScript path mapping defined in `tsconfig.base.json`:

```typescript
// Example imports
import { UserType } from '@agent-flow/shared/types';
import { formatDate } from '@agent-flow/shared/utils';
import { API_ENDPOINTS } from '@agent-flow/shared/constants';
```

## 🧪 Testing Strategy

- **Unit Tests**: Jest for individual components and functions
- **Integration Tests**: Testing API endpoints and component interactions
- **E2E Tests**: Playwright for full application workflows

## 📈 Development Workflow

1. **Feature Development**: Create feature branches from `main`
2. **Code Quality**: Run linting and tests before commits
3. **Build Verification**: Ensure all applications build successfully
4. **Testing**: Run unit and e2e tests
5. **Code Review**: Submit pull requests for review

## 🔍 Project Visualization

Visualize the project structure and dependencies:

```bash
# Generate dependency graph
npx nx graph
```

## 📚 Technology Stack

- **Frontend**: React, TypeScript, Vite
- **Backend**: NestJS, Node.js, TypeScript
- **Testing**: Jest, Playwright
- **Build System**: Nx, Webpack
- **Code Quality**: ESLint, Prettier

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**For AI Code Assistants**: This is an Nx monorepo with applications in `apps/` and shared libraries in `libs/`. The main applications are a NestJS API (`apps/api/`) and React web app (`apps/web/`). Use `npx nx serve api` and `npx nx serve web` to start development servers. Follow the established patterns for adding new features and libraries.
