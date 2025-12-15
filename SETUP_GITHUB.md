# Guia para Subir o Site no GitHub e Netlify

## Passo 1: Instalar o Git

1. Baixe o Git para Windows em: https://git-scm.com/download/win
2. Execute o instalador e siga as instruções (aceite os padrões)
3. Após a instalação, **reinicie o terminal/PowerShell** ou reinicie o computador

## Passo 2: Configurar o Git (primeira vez)

Abra o PowerShell ou Terminal e execute:

```bash
git config --global user.name "Denes"
git config --global user.email "denes_11@hotmail.com"
```

## Passo 3: Criar Repositório no GitHub

1. Acesse https://github.com e faça login
2. Clique no botão "+" no canto superior direito
3. Selecione "New repository"
4. Dê um nome ao repositório (ex: `portfolio-site` ou `desendev-portfolio`)
5. **NÃO** marque "Initialize this repository with a README"
6. Clique em "Create repository"

## Passo 4: Subir os Arquivos para o GitHub

No PowerShell, dentro da pasta do projeto (`C:\Users\filip\portfolio-site`), execute os seguintes comandos:

```bash
# Inicializar o repositório Git
git init

# Adicionar todos os arquivos
git add .

# Fazer o primeiro commit
git commit -m "Primeiro commit - Portfolio DESENDEV"

# Renomear branch para main (se necessário)
git branch -M main

# Adicionar o repositório remoto do GitHub
# SUBSTITUA SEU_USUARIO e NOME_DO_REPOSITORIO pelos seus valores
git remote add origin https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git

# Enviar os arquivos para o GitHub
git push -u origin main
```

**Nota:** Quando fizer o `git push`, você será solicitado a fazer login no GitHub.

## Passo 5: Publicar no Netlify

1. Acesse https://app.netlify.com e faça login (pode usar sua conta do GitHub)
2. Clique em "Add new site" → "Import an existing project"
3. Clique em "GitHub" e autorize o Netlify a acessar seus repositórios
4. Selecione o repositório que você acabou de criar
5. Configure o deploy:
   - **Build command:** (deixe em branco - site estático)
   - **Publish directory:** (deixe em branco ou coloque `/` - raiz)
6. Clique em "Deploy site"
7. Aguarde o deploy (pode levar alguns minutos)
8. Seu site estará disponível em uma URL como: `https://seu-site-aleatorio.netlify.app`

## Personalizar o Domínio (Opcional)

No Netlify, você pode:
- Renomear o site em "Site settings" → "Change site name"
- Adicionar um domínio customizado em "Domain settings"

## Atualizar o Site

Sempre que fizer alterações no código:

```bash
git add .
git commit -m "Descrição das alterações"
git push
```

O Netlify detectará automaticamente as mudanças e fará um novo deploy!

