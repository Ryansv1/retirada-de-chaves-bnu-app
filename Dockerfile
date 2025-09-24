############################
# ETAPA 1 — Build com Node
############################
FROM node:22-alpine AS build

# Ambiente de build: mantém todas as dependências
WORKDIR /app

# Copia os arquivos essenciais para instalar dependências
COPY package.json package-lock.json ./

# Instala todas as dependências (inclui devDependencies, como typescript)
RUN npm install

# Copia o restante do projeto
COPY . .

# Compila a aplicação Vite para produção
RUN npm run build


######################################
# ETAPA 2 — Container de produção NGINX
######################################
FROM nginx:stable-alpine

# Define o ambiente como produção aqui
ENV NODE_ENV=production

# Remove o arquivo de configuração default
RUN rm /etc/nginx/conf.d/default.conf

# Copia novo config para servir os arquivos corretamente (especialmente SPA routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos estáticos gerados pelo Vite
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
