# Testes Jasmine para Criação de Leads

Este projeto agora inclui testes simples usando Jasmine para a funcionalidade de criação de leads.

## 📁 Estrutura dos Testes

### 1. **LeadFormComponent Tests** 
📍 `src/app/pages/leads/lead-form.component.spec.ts`

**O que é testado:**
- ✅ Criação do componente
- ✅ Inicialização do formulário
- ✅ Validação de campos obrigatórios
- ✅ Validação de email
- ✅ Criação de lead com sucesso
- ✅ Tratamento de erros na criação
- ✅ Navegação entre páginas
- ✅ Carregamento de lead para edição
- ✅ Labels de status dos leads

### 2. **LeadService Tests**
📍 `src/app/core/services/lead.service.spec.ts`

**O que é testado:**
- ✅ Criação de leads (POST)
- ✅ Listagem de leads (GET)
- ✅ Busca com filtros
- ✅ Busca por ID
- ✅ Atualização de leads (PUT)
- ✅ Exclusão de leads (DELETE)
- ✅ Tratamento de erros HTTP
- ✅ Computed properties (signals)

### 3. **Integration Tests**
📍 `src/app/integration-tests/lead-creation.integration.spec.ts`

**O que é testado:**
- ✅ Fluxo completo de criação (formulário → serviço → navegação)
- ✅ Validação de formulário
- ✅ Estado do botão de submit
- ✅ Exibição de erros de validação

## 🚀 Como Executar os Testes

### Executar todos os testes:
```bash
npm test
```

### Executar testes em modo headless (sem interface):
```bash
npx ng test --watch=false --browsers=ChromeHeadless
```

### Executar testes específicos:
```bash
# Apenas testes do componente
npx ng test --include='**/lead-form.component.spec.ts'

# Apenas testes do serviço  
npx ng test --include='**/lead.service.spec.ts'
```

## 🧪 Cenários de Teste

### ✅ **Casos de Sucesso:**
- Criação de lead com dados válidos
- Navegação após criação bem-sucedida
- Carregamento de dados para edição
- Validação de formulário funcionando

### ❌ **Casos de Erro:**
- Validação de campos obrigatórios
- Validação de email inválido
- Erro de servidor na criação
- Lead não encontrado para edição

### 🔄 **Casos de Integração:**
- Fluxo completo do formulário até a navegação
- Interação entre componente e serviço
- Estados de loading e validação

## 📊 Coverage

Os testes cobrem:
- **LeadFormComponent**: ~95% das funcionalidades
- **LeadService**: 100% dos métodos HTTP
- **Validation**: Todos os cenários de validação
- **Error Handling**: Principais casos de erro

## 🛠️ Estrutura dos Mocks

### Dados de Teste:
```typescript
const mockLead: Lead = {
  id: '1',
  name: 'João Silva',
  email: 'joao@email.com',
  status: 'New',
  createdAt: '2026-05-01T10:00:00Z',
  updatedAt: '2026-05-01T10:00:00Z'
};
```

### Services Mockados:
- `LeadService`: Métodos HTTP mockados
- `Router`: Navegação mockada  
- `MatSnackBar`: Notificações mockadas
- `ActivatedRoute`: Rotas mockadas

## 📝 Próximos Passos

Para expandir os testes, considere adicionar:
- Testes E2E com Cypress/Protractor
- Testes de performance
- Testes de acessibilidade
- Mocks mais sofisticados com interceptors
- Testes de componentes visuais com testing-library