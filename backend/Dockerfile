# Dockerfile para LeadManagement.Api (.NET 10)
# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /app

# Copia os arquivos de projeto e restaura as dependências
COPY src/LeadManagement.Api/*.csproj ./src/LeadManagement.Api/
COPY src/LeadManagement.Application/*.csproj ./src/LeadManagement.Application/
COPY src/LeadManagement.Domain/*.csproj ./src/LeadManagement.Domain/
COPY src/LeadManagement.Infrastructure/*.csproj ./src/LeadManagement.Infrastructure/
RUN dotnet restore src/LeadManagement.Api/LeadManagement.Api.csproj

# Copia o restante do código
COPY . .

# Publica a aplicação
RUN dotnet publish src/LeadManagement.Api/LeadManagement.Api.csproj -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Porta padrão
EXPOSE 5000

# Variável de ambiente para ASP.NET
ENV ASPNETCORE_URLS=http://+:5000

ENTRYPOINT ["dotnet", "LeadManagement.Api.dll"]
