# Food Express

Esse projeto foi originalmente desenvolvido por Daniel Ohata (https://github.com/dr-ohata/foodexpress).
Utilizado na disciplina de UX e Testes de Software.

# Teste Caixa Cinza com Supabase e Postman

Atividade da Aula 11 da disciplina **UX/UI e Testes de Software** (AS406TSN1, UniFacens).

O objetivo é aplicar testes funcionais em uma aplicação moderna, integrando modelagem, validação, autenticação, testes de API e automação de testes em um projeto real. O projeto utilizado é o **FoodExpress**, com autenticação de usuários (cadastro e login) feita pelo **Supabase**.

## Sumário

- [Visão geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Etapa 1: Modelagem dos testes](#etapa-1-modelagem-dos-testes)
- [Etapa 2: Configuração do Supabase](#etapa-2-configuração-do-supabase)
- [Etapa 3: Testes de API com Postman](#etapa-3-testes-de-api-com-postman)
- [Etapa 4: Configuração e execução do FoodExpress](#etapa-4-configuração-e-execução-do-foodexpress)
- [Etapa 5: Testes de interface com Selenium IDE](#etapa-5-testes-de-interface-com-selenium-ide)
- [Casos de teste](#casos-de-teste)
- [Planilhas de registro](#planilhas-de-registro)
- [Referências](#referências)

## Visão geral

O FoodExpress permite que o cliente:

- **Registrar-se**: cria uma conta com e-mail e senha.
- **Fazer login**: acessa o sistema com e-mail e senha.

O fluxo principal identifica o usuário e concede acesso. O fluxo alternativo bloqueia o acesso quando alguma credencial está incorreta.

O projeto é testado em três níveis:

| Nível | Ferramenta | Tipo de teste |
|---|---|---|
| API / autenticação | Postman | Caixa cinza |
| Interface | Selenium IDE (Edge) | Caixa preta, automatizado |
| Modelagem | PlantUML (diagramas de caso de uso, atividades e sequência) | Análise antes da implementação |

## Tecnologias

- **Frontend:** React + Vite
- **Roteamento:** React Router DOM
- **Autenticação e banco:** Supabase (PostgreSQL)
- **Cliente:** `@supabase/supabase-js`
- **Testes de API:** Postman (versão desktop)
- **Testes de interface:** Selenium IDE 3.x (plugin do Microsoft Edge)
- **Diagramas:** PlantUML

## Pré-requisitos

- Node.js e npm instalados
- Conta gratuita no [Supabase](https://supabase.com) (o plano gratuito permite até dois projetos)
- Conta gratuita no [Postman](https://www.postman.com/downloads/) e aplicativo desktop instalado
- Microsoft Edge com a extensão [Selenium IDE](https://microsoftedge.microsoft.com/addons/detail/selenium-ide/ajdpfmkffanmkhejnopjppegokpogffp)
- Acesso a um e-mail válido para confirmação de cadastro (se a confirmação estiver habilitada)

## Estrutura do projeto

```
foodexpress/
├── .env                  # credenciais do Supabase (NÃO versionar)
├── src/
│   ├── supabase.js       # cliente Supabase
│   └── pages/
│       ├── Login.jsx     # tela de acesso
│       └── Signup.jsx    # tela de cadastro
└── ...
```

Coloque o projeto em um caminho sem espaços e fora da pasta de usuário do Windows, por exemplo `C:\foodexpress`. Isso evita problemas de permissão com `npm`, `node` e `vite`.

## Etapa 1: Modelagem dos testes

Antes de codificar, os fluxos são representados em diagramas:

1. **Diagrama de caso de uso:** identifica as ações do usuário (Realizar Login Válido, Realizar Login Inválido, Exibir Mensagem de Erro, Redirecionar para Dashboard).
2. **Diagrama de atividades:** descreve o procedimento do usuário. Cada cenário deve ser um diagrama isolado.
3. **Diagrama de sequência:** mostra a comunicação entre Tester, Navegador e Sistema FoodExpress, incluindo as requisições HTTP.

Os cenários de teste são derivados do fluxo básico e dos fluxos alternados, conforme o critério de caso de uso:

| Cenário | Composição |
|---|---|
| 1 | Fluxo básico (login válido) |
| 2 | Fluxo básico + fluxo alternado 1 |
| 3 | Fluxo básico + fluxo alternado 1 + fluxo alternado 2 |
| 4 | Fluxo básico + fluxo alternado 3 |
| 5 | Fluxo básico + fluxo alternado 3 + fluxo alternado 1 |
| 6 | Fluxo básico + fluxo alternado 3 + fluxo alternado 1 + fluxo alternado 2 |
| 7 | Fluxo básico + fluxo alternado 4 |
| 8 | Fluxo básico + fluxo alternado 3 + fluxo alternado 4 |

## Etapa 2: Configuração do Supabase

1. Crie um projeto chamado **foodexpress** em *New project*, com região *Americas*.
2. Em **Authentication → Sign In / Providers**, confirme que o provedor **Email** está em *Enabled*.
3. A opção **Confirm email** é opcional. Se estiver ativada, o usuário só acessa após confirmar o e-mail. Para simplificar os testes, deixe-a desmarcada.
4. Em **Authentication → Users**, clique em **Add user** e cadastre um e-mail e senha para os testes.
5. Em **Connect** (barra superior), escolha o framework **React** com variante **Vite** e copie a **Project URL** e a **API Key** (`anon public`).

> **Importante:** nunca publique a chave em repositórios públicos. A chave pública é segura apenas quando há Row Level Security configurado nas tabelas.

## Etapa 3: Testes de API com Postman

### 3.1 Ambiente

Crie um workspace chamado **FoodExpress Supabase** e, em **Environments**, crie as variáveis:

| Variável | Valor |
|---|---|
| `base_url` | URL do projeto Supabase |
| `api_key` | Chave `anon public` |
| `email` | E-mail cadastrado no Supabase |
| `senha` | Senha do usuário cadastrado |
| `access_token` | Preenchido automaticamente pelo script de teste |

### 3.2 Coleção

Crie a coleção **FoodExpress API Tests** com duas requisições.

**Requisição 1: Login Válido**

- Método: `POST`
- URL: `{{base_url}}/auth/v1/token?grant_type=password`
- Headers:
  - `apikey: {{api_key}}`
  - `Content-Type: application/json`
- Body (raw, JSON):
  ```json
  {
    "email": "{{email}}",
    "password": "{{senha}}"
  }
  ```

**Requisição 2: Login Inválido**

Duplique a Requisição 1, renomeie e substitua o corpo por credenciais incorretas:

```json
{
  "email": "teste@facens.br",
  "password": "123456"
}
```

### 3.3 Scripts de teste (aba Scripts → Post-response)

Adicione na coleção (ou em cada requisição):

```javascript
pm.test("Status code é 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Resposta contém access_token", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("access_token");
    pm.environment.set("access_token", jsonData.access_token);
});

pm.test("Status code é 400 (erro esperado)", function () {
    pm.response.to.have.status(400);
});

pm.test("Mensagem de erro é 'Credenciais de acesso erradas'", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.msg).to.include("Invalid login credentials");
});
```

Os dois primeiros testes validam o login válido. Os dois últimos validam o login inválido.

### 3.4 Execução

- Para executar tudo: selecione a coleção e clique em **Run**, depois em **Run FoodExpress API Tests**.
- Para executar uma requisição: selecione-a e clique em **Send**.

**Resultado esperado:** a Requisição 1 passa nos quatro testes e a Requisição 2 falha nos testes de status 200 e de access_token, passando nos testes de erro.

## Etapa 4: Configuração e execução do FoodExpress

1. Baixe o projeto:
   ```
   https://github.com/dr-ohata/foodexpress/tree/main
   ```
   (Também há uma versão de referência em https://github.com/Ernakh/foodexpressByOhata)

2. Crie o arquivo **`.env`** na raiz do projeto:

   ```env
   VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
   VITE_SUPABASE_KEY=SUA-CHAVE-ANON
   ```

3. Crie o arquivo **`src/supabase.js`**:

   ```javascript
   import { createClient } from '@supabase/supabase-js'

   const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
   const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

   export const supabase = createClient(supabaseUrl, supabaseKey)
   ```

4. Em `src/pages/Login.jsx`, use `supabase.auth.signInWithPassword` com `email` e `password`, exibindo erro com `alert` quando houver `error`, e redirecionando para `/catalog` em caso de sucesso.

5. Em `src/pages/Signup.jsx`, use `supabase.auth.signUp` com `email` e `password`, exibindo a mensagem de cadastro realizado e redirecionando para `/login`.

6. Instale as dependências e execute:

   ```bash
   npm install @supabase/supabase-js
   npm run dev
   ```

7. Acesse `http://localhost:5173/foodexpress/#/login`.

**Verificação manual:**

- Credenciais inválidas: deve aparecer mensagem de erro e o acesso ser negado.
- Credenciais válidas: deve aparecer a mensagem de sucesso e o catálogo de produtos.

## Etapa 5: Testes de interface com Selenium IDE

1. Abra o Selenium IDE pelo ícone na barra do Edge e clique em **Create a new project**. Nomeie o projeto como **ProjetoFoodExpress**.
2. Crie dois testes:
   - **Requisição 1 – Login Válido**
   - **Requisição 2 – Login Inválido**
3. Na URL base, informe `http://localhost:5173/foodexpress/#/login`.
4. Para cada teste, clique em **REC**, preencha e envie o formulário com os dados correspondentes e clique em **REC** novamente para parar a gravação.
5. Execute cada teste com o botão **Play**, ou todos com **Run all tests in suite**.
6. Salve o projeto. O arquivo gerado tem extensão `.side`.

**Atenção:** o Selenium grava exatamente os cliques e digitações feitos. Evite cliques desnecessários durante a gravação.

## Casos de teste

| ID | Título | Pré-condição | Entrada | Resultado esperado |
|---|---|---|---|---|
| CT01 | Login válido | Usuário cadastrado e confirmado | E-mail e senha corretos | Status 200, `access_token` retornado, acesso ao catálogo |
| CT02 | Login inválido | — | E-mail ou senha incorretos | Status 400, mensagem "Invalid login credentials", acesso negado |
| CT03 | Login com e-mail não confirmado | Confirmação de e-mail ativa e usuário não confirmado | E-mail e senha corretos | Acesso negado com mensagem de e-mail não confirmado |
| CT04 | Cadastro de novo usuário | Provedor Email habilitado | E-mail válido e senha | Mensagem de cadastro realizado e redirecionamento para login |

> **Observação:** durante a execução da Requisição 2, o Supabase pode retornar `email_not_confirmed` (status 400) em vez de `invalid_credentials`. Isso ocorre quando o usuário existe mas ainda não confirmou o e-mail. Ajuste a mensagem esperada conforme o caso real e registre a diferença nas planilhas.

## Planilhas de registro

Os testes são registrados em planilha com três abas:

1. **Informação do projeto:** ambiente, responsável e data dos testes.
2. **Sistema:** testes realizados sobre os componentes da implementação (foco em componentes).
3. **Aceitação:** funcionamento da interface sob a perspectiva do usuário (foco em requisitos).

| ID | Requisito | Operação | Resultado esperado |
|---|---|---|---|
| 1 | Registrar-se | Cliente cria uma conta | Conta criada com sucesso |
| 2 | Fazer Login | Cliente acessa o sistema | Login realizado com sucesso |

| ID | Título | Funcionalidade/Componente | Execução | Resultado esperado |
|---|---|---|---|---|
| 1 | Inserir Credenciais | Interface de Login | Cliente insere nome de usuário e senha | Credenciais recebidas pela interface de login |
| 2 | Credenciais Corretas | Servidor de Autenticação | Credenciais são enviadas ao servidor para autenticação | Login bem-sucedido |

## Referências

- CARPINETTI, Luiz Cesar Ribeiro; GEROLAMO, Mateus Cecílio. *Gestão da Qualidade ISO 9001*. São Paulo: Atlas, 2016.
- MACHADO, Felipe Nery Rodrigues. *Análise e Gestão de Requisitos de Software: Onde Nascem os Sistemas*. 3. ed. São Paulo: Érica, 2015.
- PRESSMAN, Roger S.; MAXIM, Bruce R. *Engenharia de Software: Uma Abordagem Profissional*. 8. ed. Porto Alegre: AMGH, 2016.
- CORDELLI, Rosa Lantmann; LAUREANO, Marcos Aurelio Pchek. *Fundamentos de Software – Desempenho de Sistemas Computacionais*. São Paulo: Érica, 2014.
- MACHADO, Felipe Nery Rodrigues. *Banco de Dados – Projeto e Implementação*. São Paulo: Érica, 2014.
- MANZANO, José Augusto N. G.; OLIVEIRA, Jayr Figueiredo de. *Algoritmos – Lógica para Desenvolvimento de Programação de Computadores*. São Paulo: Érica, 2016.
- MANZANO, José Augusto N. G.; LOURENÇO, André Evandro; MATOS, Edivaldo. *Algoritmos – Técnicas de Programação*. São Paulo: Érica, 2016.
- STAIR, Ralph M.; REYNOLDS, George W. *Princípios de Sistemas de Informação*. 11. ed. São Paulo: Cengage Learning, 2016.