# HELPIEEE Next

English version available at [`README_EN.md`](README_EN.md)

Documentacao principal do projeto `helpieee-next`.

Ultima revisao desta documentacao: `2026-04-09`

## 1. Visao geral

Este projeto migra a demo original do HELPIEEE para **React com Next.js**, preservando:

- estrutura de paginas da demo
- caminhos antigos em `.html`
- HTML legado
- CSS legado
- scripts legados
- assets originais

O objetivo desta etapa nao foi redesenhar o produto. A prioridade foi portar a entrega para uma base moderna em React/Next sem quebrar a navegacao e o comportamento ja conhecidos da demo.

## 2. Estado atual

Funciona hoje:

- home em `/` e `/index.html`
- paginas legadas em `/pages/*.html`
- fluxo curricular em `/pages/fluxo.html`
- alias `/fluxo.html` redirecionando para `/pages/fluxo.html`
- renderizacao fiel dos HTMLs copiados da demo
- carregamento de CSS e scripts na ordem original
- tema claro/escuro mantido pelos scripts legados
- fluxo com marcacao de disciplinas cursadas via `localStorage`
- fluxo com destaque de pre-requisitos, destravamentos e setas
- fluxo com grades de Engenharia Eletrica, Engenharia Computacional e Ciencia da Computacao

Pontos importantes do estado atual:

- a aplicacao usa **App Router** do Next, mas continua servindo HTML legado
- o HTML e renderizado a partir de copias em `legacy-source/`
- as alteracoes do `legacy-source` sao relidas por `mtime`, evitando cache velho em memoria no servidor de desenvolvimento
- `html` e `body` usam `suppressHydrationWarning` porque os scripts legados alteram atributos antes da hidratacao
- o fluxo continua baseado em JavaScript legado, com dados centralizados em `public/assets/js/pages/fluxo-data.js`
- a barra horizontal fixa do fluxo e um espelho sincronizado da area rolavel principal para manter acesso continuo em desktop

## 3. Stack e base tecnica

### 3.1 Plataforma

- framework: `Next.js 16.2.3`
- view layer: `React 19.2.4`
- lint: `ESLint 9`
- roteamento: `App Router`

### 3.2 Estrategia de migracao

O projeto nao reescreve a demo em componentes de interface equivalentes. Em vez disso:

- copia os HTMLs originais para `legacy-source/`
- extrai `body`, `link rel="stylesheet"` e `script`
- injeta esse conteudo nas rotas do Next

Essa abordagem reduz risco de regressao visual e funcional durante a migracao inicial.

## 4. Estrutura do repositorio

Principais diretorios:

- [`app`](./app): rotas e layouts do Next
- [`components`](./components): renderer da pagina legada
- [`lib`](./lib): leitura de HTML legado e metadata compartilhada
- [`legacy-source`](./legacy-source): copia dos HTMLs originais da demo
- [`public/assets`](./public/assets): copia dos assets originais

Arquivos de apoio:

- [`CURRENT_STATE.md`](./CURRENT_STATE.md): snapshot rapido de retomada
- [`package.json`](./package.json): scripts e dependencias do projeto
- [`next.config.mjs`](./next.config.mjs): configuracao minima do Next

## 5. Arquitetura de software

## 5.1 Modulos principais

- [`components/LegacyPageRenderer.jsx`](./components/LegacyPageRenderer.jsx)
  - injeta estilos da pagina legada
  - injeta scripts de `head`
  - injeta HTML do `body`
  - injeta scripts de `body`
  - preserva a ordem de execucao da demo

- [`lib/legacyDocuments.js`](./lib/legacyDocuments.js)
  - le os HTMLs em `legacy-source/`
  - extrai titulo, atributos de `body`, estilos e scripts
  - remove `script` do HTML principal para recoloca-los com controle explicito
  - usa cache com verificacao de `mtime`

- [`app/(home)`](./app/%28home%29)
  - serve a home original
  - aplica `body.page-home`

- [`app/(content)`](./app/%28content%29)
  - serve as paginas legadas de conteudo
  - aplica `body.page-content`

- [`app/(flow)`](./app/%28flow%29)
  - serve o fluxo curricular
  - aplica `body.page-flow`
  - preserva `/pages/fluxo.html`
  - redireciona `/fluxo.html`

- [`public/assets/js/pages/fluxo-data.js`](./public/assets/js/pages/fluxo-data.js)
  - concentra os curriculos do fluxo
  - define disciplinas, periodos, cargas e pre-requisitos

- [`public/assets/js/pages/fluxo.js`](./public/assets/js/pages/fluxo.js)
  - monta o fluxo em runtime
  - desenha setas
  - gerencia selecao e progresso
  - sincroniza a barra horizontal fixa

## 5.2 Layouts e hidratacao

Cada grupo de rota usa um layout proprio para reproduzir as classes do `body` da demo:

- [`app/(home)/layout.js`](./app/%28home%29/layout.js)
- [`app/(content)/layout.js`](./app/%28content%29/layout.js)
- [`app/(flow)/layout.js`](./app/%28flow%29/layout.js)

Todos usam:

- `lang="pt-BR"`
- `suppressHydrationWarning` em `html`
- `suppressHydrationWarning` em `body`

Isso existe porque o tema e o fluxo alteram atributos como:

- `data-theme`
- `style.colorScheme`
- `data-curriculum`

antes de o React hidratar a pagina.

## 5.3 Roteamento principal

Rotas principais:

- `/`
- `/index.html`
- `/pages/primeiros-passos.html`
- `/pages/faculdade.html`
- `/pages/materiais.html`
- `/pages/materiais-algoritmos.html`
- `/pages/materiais-calculo.html`
- `/pages/materiais-geometria-analitica.html`
- `/pages/materiais-introducao-engenharia-eletrica.html`
- `/pages/materiais-laboratorio-ciencias-fisicas.html`
- `/pages/materiais-laboratorio-quimica.html`
- `/pages/materiais-quimica-fundamental.html`
- `/pages/comunidade.html`
- `/pages/ieee.html`
- `/pages/fluxo.html`
- `/fluxo.html`

Observacao:

- a rota dinamica de conteudo usa `generateStaticParams()` para pre-renderizar os slugs legados, exceto `fluxo.html`

## 6. Fluxo curricular

## 6.1 O que o fluxo entrega hoje

O fluxo curricular atual suporta:

- selecao de grade
- destaque de pre-requisitos
- destaque do que a disciplina desbloqueia
- setas entre disciplinas
- alternancia entre modo navegar e marcar cursadas
- persistencia local do progresso por grade
- tema claro/escuro
- barra horizontal fixa e sincronizada

## 6.2 Grades atualmente cadastradas

Grades disponiveis hoje:

- Engenharia Eletrica - Sistemas Eletronicos
- Engenharia Eletrica - Sistemas de Potencia
- Engenharia Eletrica - Robotica e Automacao Industrial
- Engenharia Eletrica - Energia
- Engenharia Computacional
- Ciencia da Computacao (Integral)
- Ciencia da Computacao (Noturno)

Observacoes:

- as grades de Computacao foram adicionadas com base em documentacao oficial da UFJF
- o fluxo representa pre-requisitos por codigo de disciplina
- requisitos por carga horaria, como no `TCC I` de Ciencia da Computacao, aparecem apenas como observacao textual no nome do card

## 6.3 Arquivos principais do fluxo

- [`legacy-source/pages/fluxo.html`](./legacy-source/pages/fluxo.html)
- [`public/assets/css/pages/fluxo.css`](./public/assets/css/pages/fluxo.css)
- [`public/assets/js/pages/fluxo-data.js`](./public/assets/js/pages/fluxo-data.js)
- [`public/assets/js/pages/fluxo.js`](./public/assets/js/pages/fluxo.js)

## 7. Estrategia de assets e conteudo

Os assets da demo foram copiados para `public/assets/` para manter:

- caminhos originais relativos
- imagens e icones existentes
- CSS de pagina
- scripts originais

Os HTMLs foram copiados para `legacy-source/` para:

- evitar editar a demo original
- permitir evolucao do projeto Next de forma isolada
- manter uma fonte de verdade local para a camada legada

## 8. Scripts disponiveis

Comandos principais:

```bash
npm run dev
npm run lint
npm run build
npm run start
```

Uso tipico:

1. `npm install`
2. `npm run dev`
3. abrir `http://localhost:3000`

## 9. Validacao

Validacoes ja executadas nesta base:

- `npm run lint`
- `npm run build`

Essas validacoes ajudam a confirmar:

- integridade basica das rotas do Next
- ausencia de erros de lint no codigo novo
- geracao estatica das paginas mapeadas

## 10. Arquivos mais importantes para manutencao

- [`components/LegacyPageRenderer.jsx`](./components/LegacyPageRenderer.jsx)
- [`lib/legacyDocuments.js`](./lib/legacyDocuments.js)
- [`lib/metadata.js`](./lib/metadata.js)
- [`app/(home)/page.js`](./app/%28home%29/page.js)
- [`app/(content)/pages/[slug]/page.js`](./app/%28content%29/pages/%5Bslug%5D/page.js)
- [`app/(flow)/pages/fluxo.html/page.js`](./app/%28flow%29/pages/fluxo.html/page.js)
- [`app/(flow)/fluxo.html/page.js`](./app/%28flow%29/fluxo.html/page.js)
- [`legacy-source/pages/fluxo.html`](./legacy-source/pages/fluxo.html)
- [`public/assets/js/pages/fluxo-data.js`](./public/assets/js/pages/fluxo-data.js)
- [`public/assets/js/pages/fluxo.js`](./public/assets/js/pages/fluxo.js)
- [`public/assets/css/pages/fluxo.css`](./public/assets/css/pages/fluxo.css)

## 11. Limitacoes e cuidados

### 11.1 Escopo da migracao

O projeto ainda nao converteu as paginas legadas para componentes React semanticamente reescritos.

Hoje:

- a camada visual continua majoritariamente em HTML legado
- os scripts de interacao continuam baseados na implementacao original

### 11.2 Hydration e mutacoes pre-React

Como os scripts legados alteram `html` e `body` cedo:

- warnings de hidratacao podem reaparecer se novas mutacoes forem introduzidas sem cuidado
- layouts devem continuar respeitando `suppressHydrationWarning`

### 11.3 Cache e leitura de HTML

O loader legado usa cache em memoria com `mtime`.

Por isso:

- mudancas em `legacy-source` sao refletidas sem manter cache estagnado
- alteracoes fora desse fluxo devem preservar esse comportamento

### 11.4 Fluxo curricular

O fluxo atual nao modela:

- pre-requisitos por carga horaria
- co-requisitos formais
- regras curriculares condicionais mais complexas

Se isso passar a ser necessario, o formato de `fluxo-data.js` precisara ser expandido.

## 12. Checklist rapido de validacao

Depois de mudancas importantes, vale validar:

1. Home em `/` e `/index.html`.
2. Navegacao entre paginas legadas em `/pages/*.html`.
3. Alias `/fluxo.html`.
4. Troca de tema.
5. Fluxo curricular com troca de grade.
6. Destaque de pre-requisitos e destravamentos.
7. Marcacao de disciplinas cursadas.
8. Persistencia local do progresso.
9. Barra horizontal fixa do fluxo.
10. `npm run lint`.
11. `npm run build`.

## 13. Documentos auxiliares

Para contexto adicional:

- [`CURRENT_STATE.md`](./CURRENT_STATE.md): resumo rapido de retomada
- [`README_EN.md`](./README_EN.md): versao em ingles desta documentacao

Este `README.md` deve ser tratado como a documentacao principal e mais completa do projeto.
