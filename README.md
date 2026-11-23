# EC02 - Gestão de Funcionários

Estudo de caso de JavaScript com Bootstrap 5 para cadastro, listagem, edição, exclusão e relatórios de funcionários.

## Funcionalidades
- Classe `Funcionario` com construtor, getters, setters e `toString()`.
- Cadastro e edição com validação; exclusão com confirmação.
- Tabela dinâmica, contador e persistência em `localStorage`.
- Relatórios: salários acima de R$ 5.000, média salarial, cargos únicos e nomes em maiúsculas.
- Eventos com funções anônimas e arrow functions; uso de `map`, `filter`, `reduce` e `Set`.

## Como executar com Docker
1. Abra o Docker Desktop e aguarde o motor iniciar.
2. No terminal, dentro desta pasta, execute:

```bash
docker compose up --build -d
```

3. Acesse http://localhost:8080 no navegador.
4. Para encerrar: `docker compose down`.

## Executar sem Docker
Abra `index.html` no navegador (é necessária conexão para carregar o Bootstrap pelo CDN).

## Publicar no GitHub
```bash
git init
git add .
git commit -m "Implementa EC02 gestao de funcionarios"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/EC02_Funcionarios.git
git push -u origin main
```
Crie o repositório vazio no GitHub antes de executar os comandos e substitua `SEU_USUARIO`.

## Observações
Os dados ficam salvos no `localStorage` do navegador em uso; não há servidor de banco de dados. O Docker serve os arquivos estáticos com Nginx. O Bootstrap é carregado via CDN.
