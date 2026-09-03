# HELPIEEE Next

English documentation: [`README_EN.md`](./README_EN.md)

Última revisão: `2026-09-03`

## Visão geral

O HELPIEEE é um guia de acolhimento para calouros de **Ciências Exatas e Engenharias da UFJF**. A aplicação reúne orientações práticas, materiais de estudo, vida acadêmica, comunidade, oportunidades e fluxos curriculares em uma interface React/Next.js.

A reconstrução substituiu a antiga entrega baseada em HTML, CSS e JavaScript injetados por:

- páginas e componentes React nativos;
- conteúdo editorial estruturado;
- currículos centralizados em dados;
- rotas estáveis com redirecionamentos para os endereços antigos;
- uma camada visual coerente com o [Ramo Estudantil IEEE UFJF](https://www.ieeeufjf.com.br/).

## Público e princípios

O conteúdo geral atende estudantes que chegam ao ICE e à Faculdade de Engenharia. Quando uma orientação é específica de curso, unidade, campus ou serviço, o escopo deve aparecer no próprio conteúdo.

Princípios editoriais:

- acolher sem presumir conhecimento prévio da universidade;
- usar linguagem direta e inclusiva para diferentes cursos;
- priorizar páginas oficiais da UFJF e do IEEE UFJF;
- identificar origem e revisão de informações sujeitas a mudança;
- nunca tratar uma única grade como universal;
- não publicar calendários, responsáveis ou datas de avaliações vencidas.

## Sistema visual

O design segue a linguagem institucional do site do IEEE UFJF:

- azul IEEE `#00629b` como cor principal;
- superfícies claras, hierarquia editorial e alto contraste;
- tipografia Open Sans carregada por `next/font`;
- cabeçalho e rodapé institucionais compartilhados;
- componentes responsivos e navegação móvel acessível;
- tema claro/escuro com preferência salva localmente;
- estados de foco visíveis e estrutura semântica de navegação.

Os tokens e estilos globais ficam em [`app/globals.css`](./app/globals.css). O shell compartilhado é definido em [`app/layout.js`](./app/layout.js).

## Rotas

| Rota | Função |
| --- | --- |
| `/` | Home, busca editorial, visão dos cursos e pontos de entrada |
| `/guia` | Índice das seis trilhas de conteúdo |
| `/guia/[slug]` | Página de uma trilha estruturada |
| `/fluxo` | Explorador interativo de grades curriculares |

Slugs disponíveis em `/guia/[slug]`:

- `chegada` — primeiros passos;
- `faculdade` — vida acadêmica;
- `estudos` — materiais e estudos;
- `comunidade` — comunidade e apoio;
- `oportunidades` — IEEE e oportunidades;
- `projeto` — sobre o HELPIEEE.

Rotas auxiliares:

- `/oportunidades` redireciona para a trilha de oportunidades;
- `/sobre` redireciona para a trilha do projeto.

Compatibilidade com links antigos:

- `/index.html` redireciona para `/`;
- `/fluxo.html` e `/pages/fluxo.html` redirecionam para `/fluxo`;
- `/pages/*.html` usa o `legacySlugMap` de [`lib/guides.js`](./lib/guides.js) para redirecionar cada página antiga à trilha equivalente.

Os aliases preservam links já compartilhados, mas não renderizam nem dependem dos documentos legados.

## Arquitetura

### Plataforma

- Next.js `16.3.4` com App Router;
- React e React DOM `19.2.8`;
- ESLint `9`;
- renderização estática das trilhas e renderização sob demanda do fluxo com parâmetro de curso.

### Conteúdo editorial

[`lib/guides.js`](./lib/guides.js) é a fonte de verdade dos guias. Ele exporta:

- `guides`: as seis trilhas completas;
- `guideCategories`: dados resumidos para navegação;
- `guidesBySlug` e `getGuideBySlug`: acesso por slug;
- `officialLinks`: links institucionais reutilizados;
- `legacySlugMap`: destino dos aliases antigos;
- `editorialNotes`: decisões de escopo, conteúdo temporal removido e verificações de publicação.

Cada guia possui título, resumo, público, escopo, palavras-chave, `reviewedAt`, `sourceLabel`, slugs legados e seções. Cada seção contém parágrafos e itens com texto, listas, links e, quando necessário, metadados próprios de fonte e revisão.

### Fluxos curriculares

[`lib/curricula.js`](./lib/curricula.js) centraliza períodos, disciplinas, cargas/créditos e pré-requisitos. Há dez grades cadastradas:

- Engenharia Elétrica — Sistemas Eletrônicos;
- Engenharia Elétrica — Sistemas de Potência;
- Engenharia Elétrica — Robótica e Automação Industrial;
- Engenharia Elétrica — Energia;
- Engenharia Elétrica — Telecomunicações;
- Engenharia Computacional;
- Engenharia Civil;
- Ciência da Computação — integral e noturno;
- Sistemas de Informação.

O explorador permite selecionar a grade, pesquisar por nome ou código, consultar pré-requisitos e disciplinas desbloqueadas, marcar conclusões e acompanhar progresso. O progresso fica somente no navegador, em `localStorage`.

O fluxo é apoio de planejamento: matrícula e equivalências sempre devem ser confirmadas no SIGA e com a coordenação.

### Componentes principais

- [`SiteHeader`](./components/SiteHeader.jsx), [`SiteFooter`](./components/SiteFooter.jsx) e [`siteNavigation`](./components/siteNavigation.js): shell e navegação institucional;
- [`MobileNavigation`](./components/MobileNavigation.jsx): menu móvel com fechamento por Escape e clique externo;
- [`ThemeToggle`](./components/ThemeToggle.jsx): preferência de tema persistida no navegador;
- [`GuideCard`](./components/GuideCard.jsx): entrada reutilizável para as trilhas;
- [`GuideArticle`](./components/GuideArticle.jsx): renderização semântica das seções, fontes e datas de revisão;
- [`HomeSearch`](./components/HomeSearch.jsx): busca local por guias e seções;
- [`CurriculumExplorer`](./components/CurriculumExplorer.jsx) e seu [CSS Module](./components/CurriculumExplorer.module.css): interação, pesquisa, relações e progresso das grades.

### Deploy com Sites

O projeto mantém o fluxo Next.js convencional e uma saída própria para Sites. [`vite.config.mjs`](./vite.config.mjs) combina Vinext, Vite e o adaptador do Cloudflare para gerar a aplicação compatível com Workers; [`worker/index.js`](./worker/index.js) atende o App Router e a otimização de imagens. A configuração de hospedagem fica em `.openai/hosting.json` e seus identificadores internos não devem ser copiados para documentação, issues ou logs.

- `npm run build:sites` valida o conteúdo e gera a saída de produção do Sites;
- `npm run start:sites` inicia localmente essa saída para conferência;
- `npm run build` e `npm run start` continuam disponíveis para o runtime Next.js convencional.

Defina `NEXT_PUBLIC_SITE_URL` com a origem canônica do ambiente antes do build. [`app/layout.js`](./app/layout.js) usa esse valor como `metadataBase`; quando ele não existe, aplica `https://help.ieeeufjf.com.br` como fallback.

## Imagem social

[`public/og.png`](./public/og.png) é a imagem Open Graph/Twitter do projeto (`1735 × 906`). Ela é declarada nos metadados de [`app/layout.js`](./app/layout.js), que resolve a URL absoluta a partir de `NEXT_PUBLIC_SITE_URL`. Sempre que nome, posicionamento, domínio ou identidade visual mudarem, revise a imagem e o texto alternativo juntos.

## Desenvolvimento

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

Scripts disponíveis:

```bash
npm run dev
npm run validate:content
npm run validate:links
npm run lint
npm run build
npm run build:sites
npm run start
npm run start:sites
npm run check
```

`npm run validate:content` verifica a estrutura dos guias e currículos, unicidade de slugs e IDs, formato dos links, datas de revisão e referências a semestres encerrados. `npm run validate:links` consulta as URLs externas publicadas. `npm run build` executa a validação estrutural automaticamente via `prebuild`; `npm run check` encadeia conteúdo, lint e build.

## Validação

Antes de entregar uma alteração:

1. execute `npm run validate:content`;
2. execute `npm run validate:links` antes de publicar conteúdo; timeouts e bloqueios de robô exigem conferência manual;
3. execute `npm run lint`;
4. execute `npm run build`;
5. para publicar via Sites, defina `NEXT_PUBLIC_SITE_URL` e execute `npm run build:sites`;
6. percorra `/`, `/guia`, uma página `/guia/[slug]` e `/fluxo` em desktop e mobile;
7. teste tema, menu, busca, links externos e persistência do fluxo;
8. confirme que os aliases antigos redirecionam corretamente.

Na revisão de `2026-09-03`, `npm run validate:content`, `npm run lint` e `npm run build` concluíram sem erros. O validador conferiu 6 guias, 21 seções, 83 itens, 67 links, 10 grades e 544 disciplinas; as 29 páginas processadas pelo build foram geradas com sucesso.

## Atualização de conteúdo

1. Localize a fonte oficial responsável pela informação.
2. Atualize o item correspondente em [`lib/guides.js`](./lib/guides.js).
3. Defina `sourceLabel` e altere `reviewedAt` somente após revisar o conteúdo e o link.
4. Remova datas encerradas; não acumule calendários, avaliações ou responsáveis de semestres anteriores.
5. Registre exclusões temporais ou decisões de escopo em `editorialNotes`.
6. Ao alterar um currículo, confirme curso, versão, períodos, códigos, cargas e pré-requisitos antes de editar [`lib/curricula.js`](./lib/curricula.js).
7. Execute as validações e confira visualmente as páginas afetadas.

Não copie informações de grupos informais como se fossem oficiais. Materiais antigos podem permanecer apenas quando continuarem úteis, tiverem origem identificada e estiverem claramente contextualizados.

## Arquivos para retomada

- [`CURRENT_STATE.md`](./CURRENT_STATE.md)
- [`app/layout.js`](./app/layout.js)
- [home](<./app/(home)/page.js>)
- [índice do guia](./app/guia/page.js)
- [rota dinâmica do guia](<./app/guia/[slug]/page.js>)
- [fluxo](./app/fluxo/page.js)
- [`lib/guides.js`](./lib/guides.js)
- [`lib/curricula.js`](./lib/curricula.js)
- [`app/globals.css`](./app/globals.css)
- [`vite.config.mjs`](./vite.config.mjs)
- [`worker/index.js`](./worker/index.js)
