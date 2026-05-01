# Deploy com Docker

Este documento contém instruções para fazer deploy da aplicação Angular usando Docker.

## Arquivos de Deploy

- `Dockerfile`: Configuração multi-stage para build e deploy
- `nginx.conf`: Configuração do Nginx otimizada para SPAs Angular
- `.dockerignore`: Arquivos excluídos do build do Docker

## Comandos de Deploy

### 1. Build da Imagem Docker

```bash
# Build da imagem
docker build -t lead-management-frontend .

# Build com tag específica
docker build -t lead-management-frontend:v1.0.0 .
```

### 2. Executar Container Localmente

```bash
# Executa o container na porta 80
docker run -d -p 80:80 --name frontend-app lead-management-frontend

# Executa o container em outra porta (ex: 8080)
docker run -d -p 8080:80 --name frontend-app lead-management-frontend
```

### 3. Verificar se está funcionando

```bash
# Ver logs do container
docker logs frontend-app

# Ver containers em execução
docker ps

# Acessar o container
docker exec -it frontend-app sh
```

## Docker Compose (Opcional)

Crie um arquivo `docker-compose.yml` na raiz do projeto:

```yaml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "80:80"
    restart: unless-stopped
    container_name: lead-management-frontend
```

Para usar:

```bash
# Subir a aplicação
docker-compose up -d

# Parar a aplicação
docker-compose down

# Ver logs
docker-compose logs -f
```

## Variáveis de Ambiente

Para diferentes ambientes (desenvolvimento, produção), você pode criar builds específicos:

```bash
# Build para produção
docker build -t lead-management-frontend:prod .

# Build para desenvolvimento (se necessário)
docker build --build-arg NODE_ENV=development -t lead-management-frontend:dev .
```

## Deploy em Nuvem

### Docker Hub

```bash
# Tag para Docker Hub
docker tag lead-management-frontend:latest seu-usuario/lead-management-frontend:latest

# Push para Docker Hub
docker push seu-usuario/lead-management-frontend:latest
```

### Heroku

```bash
# Login no Heroku
heroku login

# Login no registry do Heroku
heroku container:login

# Build e push para Heroku
heroku container:push web -a sua-app-heroku

# Release da aplicação
heroku container:release web -a sua-app-heroku
```

### AWS/Azure/GCP

Para deploy em nuvem, use o arquivo Docker configurado com os serviços de container da sua plataforma preferida:

- **AWS**: ECS, EKS, ou Elastic Beanstalk
- **Azure**: Container Instances ou AKS
- **GCP**: Cloud Run ou GKE

## Otimizações

### Multi-stage Build

O Dockerfile usa multi-stage build para:
- **Stage 1**: Build da aplicação Angular com Node.js
- **Stage 2**: Servidor de produção com Nginx

### Cache de Dependências

As dependências são instaladas antes de copiar o código fonte, aproveitando o cache do Docker.

### Configuração do Nginx

- Roteamento SPA configurado
- Cache otimizado para assets estáticos
- Headers de segurança
- Logs configurados

## Troubleshooting

### Build falhando

```bash
# Build com logs verbosos
docker build --no-cache --progress=plain -t lead-management-frontend .

# Verificar se o build Angular funciona localmente
npm run build
```

### Problemas de roteamento

Verifique se o arquivo `nginx.conf` está sendo copiado corretamente e contém a configuração `try_files $uri $uri/ /index.html;`.

### Container não iniciando

```bash
# Verificar logs detalhados
docker logs --details frontend-app

# Verificar configuração do Nginx
docker exec -it frontend-app cat /etc/nginx/conf.d/default.conf
```