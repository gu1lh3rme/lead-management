# Lead Management

Um mono-repositório com backend em **.NET 10** (Clean Architecture) e frontend em **Angular 18** (Standalone Components + Angular Material) para gerenciamento de leads e tarefas.

---

## Estrutura do Repositório

```
/lead-management
├── backend/                  ← Solução .NET 10 (abrir no Visual Studio)
│   ├── Dockerfile           ← Container para API (.NET 10)
│   ├── LeadManagement.slnx
│   ├── src/
│   │   ├── LeadManagement.Api/
│   │   ├── LeadManagement.Application/
│   │   ├── LeadManagement.Domain/
│   │   └── LeadManagement.Infrastructure/
│   └── tests/
│       └── LeadManagement.Tests/
├── frontend/                 ← Projeto Angular 18 (abrir no VS Code)
│   ├── src/
│   │   └── app/
│   │       ├── core/         (services, models, guards)
│   │       ├── pages/        (leads: list, detail, form, tasks)
│   │       ├── shared/       (componentes compartilhados)
│   │       └── integration-tests/
│   ├── Dockerfile           ← Container para produção (Nginx)
│   ├── nginx.conf           ← Configuração Nginx
│   ├── README.md            ← Instruções específicas do Angular
│   ├── TESTS.md            ← Documentação de testes Jasmine
│   └── DEPLOY.md           ← Instruções de deploy
├── README.md               ← Este arquivo (overview geral)
└── .gitignore
```

---

## Backend (.NET 10)

### Requisitos
- [Visual Studio 2022](https://visualstudio.microsoft.com/) (com workload **ASP.NET and web development**)
- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (ou SQL Server Express / LocalDB)

### Como abrir no Visual Studio
1. Abra o Visual Studio 2022
2. Clique em **Open a project or solution**
3. Navegue até `backend/` e selecione `LeadManagement.slnx`
4. O Visual Studio carregará toda a solução com os 4 projetos

### Configurar a Connection String do SQL Server
Edite o arquivo `backend/src/LeadManagement.Api/appsettings.json` e ajuste a connection string:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=LeadManagementDb;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

**Exemplos de connection strings:**
- SQL Server local (Windows Auth): `Server=localhost;Database=LeadManagementDb;Trusted_Connection=True;TrustServerCertificate=True;`
- SQL Server com usuário/senha: `Server=localhost;Database=LeadManagementDb;User Id=sa;Password=YourPassword;TrustServerCertificate=True;`
- SQL Server Express: `Server=localhost\SQLEXPRESS;Database=LeadManagementDb;Trusted_Connection=True;TrustServerCertificate=True;`
- LocalDB: `Server=(localdb)\mssqllocaldb;Database=LeadManagementDb;Trusted_Connection=True;`

### Instruções de Execução

**1. Restaurar dependências:**
```bash
cd backend
dotnet restore
```

**2. Aplicar as migrations no banco de dados:**
```bash
dotnet ef database update --project src/LeadManagement.Infrastructure --startup-project src/LeadManagement.Api
```

**3. Executar a API:**
```bash
dotnet run --project src/LeadManagement.Api
```

**4. Rodar os testes automatizados (xUnit):**
```bash
dotnet test tests/LeadManagement.Tests/LeadManagement.Tests.csproj
```

O backend estará disponível em:
- **API**: `http://localhost:5000/api`
- **Swagger UI**: `http://localhost:5000/swagger`

### Executar com Docker
```bash
cd backend

# Build da imagem
docker build -t leadmanagement-api .

# Executar o container
docker run -p 5000:5000 --name leadmanagement-api leadmanagement-api
```

**Nota**: Configure a connection string para apontar para um banco SQL Server acessível do container.
```

---

## Frontend (Angular 18)

### Documentação Específica
Para instruções detalhadas do frontend Angular, consulte:
- 📖 **[README do Frontend](frontend/README.md)** - Instruções gerais do Angular CLI
- 🧪 **[Guia de Testes](frontend/TESTS.md)** - Documentação completa dos testes Jasmine
- 🚀 **[Guia de Deploy](frontend/DEPLOY.md)** - Instruções de deploy e produção

### Requisitos
- [Node.js 18+](https://nodejs.org/)
- [Angular CLI 18](https://angular.io/cli): `npm install -g @angular/cli@18`
- [VS Code](https://code.visualstudio.com/)

### Início Rápido

**1. Instalar dependências:**
```bash
cd frontend
npm install
```

**2. Executar em desenvolvimento:**
```bash
npm start
# ou
ng serve
```

**3. Executar testes:**
```bash
npm test
```

**4. Build de produção:**
```bash
npm run build
```

O frontend estará disponível em: **`http://localhost:4200`**

### Executar com Docker (Produção)
```bash
cd frontend

# Build da imagem
docker build -t leadmanagement-frontend .

# Executar o container
docker run -p 80:80 --name leadmanagement-frontend leadmanagement-frontend
```

O frontend em produção estará disponível em: **`http://localhost`**

### Estrutura do Código
```
src/app/
├── core/                     ← Serviços, guards, models
├── pages/                    ← Páginas principais (leads, dashboard)
├── shared/                   ← Componentes compartilhados
└── integration-tests/        ← Testes de integração
```

---

## Desenvolvimento e Testes

### Backend (.NET 10)
```bash
cd backend

# Rodar todos os testes
dotnet test tests/LeadManagement.Tests/LeadManagement.Tests.csproj

# Rodar testes com coverage
dotnet test --collect:"XPlat Code Coverage"
```

### Frontend (Angular 18)
```bash
cd frontend

# Rodar testes unitários
npm test

# Rodar testes em modo headless
npx ng test --watch=false --browsers=ChromeHeadless

# Rodar testes específicos
npx ng test --include='**/lead-form.component.spec.ts'
```

Para mais detalhes sobre testes do frontend, consulte [TESTS.md](frontend/TESTS.md).

---

## Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/leads` | Listar leads (filtros: `?search=&status=`) |
| `POST` | `/api/leads` | Criar lead |
| `GET` | `/api/leads/{id}` | Buscar lead por ID |
| `PUT` | `/api/leads/{id}` | Atualizar lead |
| `DELETE` | `/api/leads/{id}` | Deletar lead |
| `GET` | `/api/leads/{id}/tasks` | Listar tarefas do lead |
| `POST` | `/api/leads/{id}/tasks` | Criar tarefa |
| `GET` | `/api/leads/{id}/tasks/{taskId}` | Buscar tarefa |
| `PUT` | `/api/leads/{id}/tasks/{taskId}` | Atualizar tarefa |
| `DELETE` | `/api/leads/{id}/tasks/{taskId}` | Deletar tarefa |

### Status dos Leads
- `New` - Novo
- `Qualified` - Qualificado
- `Won` - Ganho
- `Lost` - Perdido

### Status das Tarefas
- `Todo` - A fazer
- `Doing` - Em andamento
- `Done` - Concluído

---

## Tecnologias Utilizadas

### Backend
- .NET 10 Web API
- Entity Framework Core + SQL Server
- Mapster (mapeamento de objetos)
- Swashbuckle / Swagger
- xUnit + FluentAssertions + Moq (testes)

### Frontend
- Angular 18 (Standalone Components)
- Angular Material (tema Indigo Pink)
- Angular Signals (gerenciamento de estado)
- Reactive Forms
- Angular Router (lazy loading)
- Jasmine (testes unitários e de integração)
