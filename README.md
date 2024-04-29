# Projeto Ativo e Operante!

Seja um cidadão atento aos problemas do dia a dia. Avise e denuncie de forma eficiente e rápida os problemas que encontrar na sua comunidade. Use o aplicativo web Ativo e Operante!

**Ativo e Operante!** é um sistema Web capaz de oferecer uma ferramenta ao cidadão que deseja avisar ou denunciar aos órgãos competentes sobre problemas na cidade, como buracos na rua, abandono de animais, poda ou corte de árvores, problemas no trânsito, enfim qualquer situação que pode afetar o dia a dia do cidadão.

## Funcionalidades do Aplicativo Web

O aplicativo web oferecerá as seguintes funcionalidades:

1. **Denúncia de Problemas:**
   - Os usuários autenticados poderão registrar uma denúncia informando um título, uma descrição, a urgência (entre 1 e 5, onde 5 é muito urgente), selecionar o órgão competente e escolher o tipo de problema.
   - Os tipos de problema e os órgãos competentes serão carregados a partir de um serviço web no formato JSON, desenvolvido com Spring REST.
   - Após preencher a denúncia, ela será enviada ao sistema e recebida por um serviço.

2. **Cadastro de Usuário:**
   - Os usuários poderão criar suas contas no próprio aplicativo.
   - A criação de conta será analisada por uma API web, que, ao receber a requisição de cadastro (CPF, email, senha), criará e armazenará esses dados em um banco de dados com nível de acesso "cidadão".

3. **Gerenciamento de Denúncias (para Administradores):**
   - Os administradores terão acesso a um módulo para cadastrar os órgãos responsáveis e os tipos de problemas.
   - Além disso, poderão listar e visualizar todas as denúncias, com opções para deletar e/ou dar feedback sobre elas.
   - O acesso a este módulo será pelo mesmo login utilizado pelo cidadão, mas ao detectar um usuário de nível "administrador", o sistema remeterá o usuário a essas funcionalidades.
   - O cadastro do usuário "administrador" será pré-cadastrado, utilizando o login: "admin@pm.br" e a senha numérica 123321.

## Desafio

Adicione uma imagem à denúncia!

## Fases de Desenvolvimento

1. **Definição e Criação da Base de Dados:**
   - Definir entidades e repositórios JPA para a base de dados.

2. **Definição dos Serviços (APIs Rest) e Geração de Token:**
   - Implementar APIs Rest para o administrador e para o cidadão.
   - Criar filtros para geração de token.
   - Serviços a serem consumidos pelo administrador:
     - CRUD de tipo de problema e órgão competente.
     - Listagem de denúncias.
     - Exclusão de denúncias.
     - Registro de feedback em denúncias.
   - Serviços a serem consumidos pelo cidadão:
     - Login com retorno de token.
     - Cadastro de usuário cidadão, com criação e armazenamento de chave.
     - Recebimento de denúncia.
     - Listagem de órgãos competentes.
     - Listagem de tipos de problemas.
     - Visualização de feedback.

3. **Home Page e Cadastro de Usuário Cidadão:**
   - Criar uma página inicial com opções de login e cadastro para o usuário cidadão.

4. **Frontend do Administrador:**
   - Desenvolver a interface do administrador com os CRUDs (órgão e tipos de problemas) e o módulo de visualização, exclusão de denúncias e feedback.

5. **Frontend do Cidadão:**
   - Implementar a interface para preencher e enviar denúncias.
   - Permitir que o cidadão visualize as denúncias enviadas por ele e os possíveis feedbacks.

## Tecnologias Utilizadas

- Banco de dados relacional (pode usar noSQL se desejar)
- JSON para troca de informações entre app e API web.
