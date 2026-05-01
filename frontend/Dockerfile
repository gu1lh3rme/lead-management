# Stage 1: Build da aplicação Angular
FROM node:20-alpine AS build

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de configuração do npm
COPY package*.json ./

# Instala as dependências
RUN npm ci --only=production=false

# Copia todo o código fonte
COPY . .

# Executa o build para produção
RUN npm run build

# Stage 2: Servidor web Nginx para produção
FROM nginx:alpine AS production

# Remove a configuração padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia os arquivos buildados do stage anterior
COPY --from=build /app/dist/frontend /usr/share/nginx/html

# Copia configuração customizada do Nginx para Angular
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta 80
EXPOSE 80

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]