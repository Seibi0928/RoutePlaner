FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-12
EXPOSE 3000

WORKDIR /workspace

COPY package.json ./
COPY package-lock.json ./

RUN npm install
