# Lead Management

Um mono-repositório com backend em **.NET 8** (Clean Architecture) e frontend em **Angular 18** (Standalone Components + Angular Material) para gerenciamento de leads e tarefas.

---

## Estrutura do Repositório

```
/lead-management
├── backend/                  ← Solução .NET 8 (abrir no Visual Studio)
│   ├── LeadManagement.sln
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
│   │       ├── core/         (models, services, environments)
│   │       ├── features/     (leads: list, detail, form, tasks)
│   │       └── shared/
│   └── ...
├── README.md
└── .gitignore
```

---

## Backend (.NET 8)

### Requisitos
- [Visual Studio 2022](https://visualstudio.microsoft.com/) (com workload **ASP.NET and web development**)
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (ou SQL Server Express / LocalDB)

### Como abrir no Visual Studio
1. Abra o Visual Studio 2022
2. Clique em **Open a project or solution**
3. Navegue até `backend/` e selecione `LeadManagement.sln`
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

### Rodar as Migrations do EF Core

Via **Package Manager Console** no Visual Studio:
```powershell
# No Package Manager Console (Tools > NuGet Package Manager > Package Manager Console)
# Selecione LeadManagement.Infrastructure como Default Project

Add-Migration InitialCreate -Project LeadManagement.Infrastructure -StartupProject LeadManagement.Api
Update-Database -Project LeadManagement.Infrastructure -StartupProject LeadManagement.Api
```

Via **Terminal / CLI**:
```bash
cd backend

# Criar a migration inicial
dotnet ef migrations add InitialCreate \
  --project src/LeadManagement.Infrastructure \
  --startup-project src/LeadManagement.Api

# Aplicar as migrations no banco
dotnet ef database update \
  --project src/LeadManagement.Infrastructure \
  --startup-project src/LeadManagement.Api
```

### Executar o Backend
- No Visual Studio: pressione **F5** ou clique em **IIS Express / LeadManagement.Api**
- Via CLI: `cd backend && dotnet run --project src/LeadManagement.Api`

O backend estará disponível em:
- **API**: `http://localhost:5000/api`
- **Swagger UI**: `http://localhost:5000/swagger`

### Rodar os Testes
```bash
cd backend
dotnet test
```

---

## Frontend (Angular 18)

### Requisitos
- [Node.js 18+](https://nodejs.org/)
- [Angular CLI 18](https://angular.io/cli): `npm install -g @angular/cli@18`
- [VS Code](https://code.visualstudio.com/)

### Como abrir no VS Code
1. Abra o VS Code
2. Vá em **File > Open Folder**
3. Selecione a pasta `frontend/`
4. Instale as extensões recomendadas: **Angular Language Service**, **ESLint**

### Instalar dependências
```bash
cd frontend
npm install
```

### Executar o Frontend
```bash
cd frontend
npm start
# ou
ng serve
```

O frontend estará disponível em: **`http://localhost:4200`**

### Build de produção
```bash
cd frontend
npm run build
```

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
- .NET 8 Web API
- Entity Framework Core 8 + SQL Server
- Mapster (mapeamento de objetos)
- Swashbuckle / Swagger
- xUnit + FluentAssertions + Moq (testes)

### Frontend
- Angular 18 (Standalone Components)
- Angular Material (tema Indigo Pink)
- Angular Signals (gerenciamento de estado)
- Reactive Forms
- Angular Router (lazy loading)
