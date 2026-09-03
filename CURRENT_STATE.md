# Estado atual — HELPIEEE Next

Última atualização: `2026-09-03`

## Resumo

O HELPIEEE foi reconstruído como um guia React/Next.js para calouros de **Ciências Exatas e Engenharias da UFJF**. A interface antiga e o renderer de documentos legados foram removidos; conteúdo e currículos agora são dados estruturados consumidos por componentes nativos.

## Entregue

- identidade visual alinhada ao site do IEEE UFJF, com azul institucional `#00629b`, Open Sans, superfícies claras e tema escuro;
- shell compartilhado, responsivo e acessível, com cabeçalho, rodapé e menu móvel;
- home com busca local, público explícito e acesso às trilhas;
- índice `/guia` e seis páginas estáticas em `/guia/[slug]`;
- fluxo curricular em `/fluxo`, com dez grades, pesquisa, pré-requisitos, desbloqueios e progresso local;
- aliases `.html` antigos preservados por redirecionamento, sem dependência de HTML legado;
- imagem Open Graph/Twitter em [`public/og.png`](./public/og.png);
- metadados globais para o posicionamento “Guia de Exatas e Engenharias da UFJF” e `metadataBase` configurável por `NEXT_PUBLIC_SITE_URL`;
- Next.js `16.3.4` com React/React DOM `19.2.8`;
- camada de deploy para Sites via Vinext/Vite, com build compatível com Cloudflare Workers.

## Rotas canônicas

- `/`
- `/guia`
- `/guia/chegada`
- `/guia/faculdade`
- `/guia/estudos`
- `/guia/comunidade`
- `/guia/oportunidades`
- `/guia/projeto`
- `/fluxo`

`/index.html`, `/fluxo.html`, `/pages/fluxo.html` e as antigas páginas `/pages/*.html` redirecionam para as rotas atuais. `/oportunidades` e `/sobre` funcionam como atalhos.

## Fontes de verdade

- [`lib/guides.js`](./lib/guides.js): seis guias, links oficiais, `reviewedAt`, `sourceLabel`, notas editoriais e mapa de aliases;
- [`lib/curricula.js`](./lib/curricula.js): dez grades com períodos, disciplinas, cargas/créditos e pré-requisitos;
- [`app/globals.css`](./app/globals.css): tokens e sistema visual;
- [`components/GuideArticle.jsx`](./components/GuideArticle.jsx): renderer editorial;
- [`components/CurriculumExplorer.jsx`](./components/CurriculumExplorer.jsx): explorador e persistência de progresso;
- [`app/layout.js`](./app/layout.js): shell, fonte, metadados sociais e origem canônica configurável;
- [`vite.config.mjs`](./vite.config.mjs) e [`worker/index.js`](./worker/index.js): build e runtime do Sites.

## Governança editorial

- Informações institucionais ou voláteis devem indicar fonte e data de revisão.
- `reviewedAt` só muda depois da conferência do texto e do link.
- Datas acadêmicas encerradas, avaliações e responsáveis de semestres anteriores não permanecem nas páginas.
- Conteúdo específico de curso, unidade ou campus precisa declarar seu escopo.
- Currículos devem ser conferidos com documentação oficial antes de qualquer alteração.

O processo detalhado está em [`README.md`](./README.md).

## Validação mais recente

Executado com sucesso em `2026-09-03`:

- `npm run validate:content` — 6 guias, 21 seções, 83 itens, 67 links, 10 grades e 544 disciplinas
- `npm run lint`
- `npm run build`
- compilação das 29 páginas processadas pelo build

`npm run build` chama a validação de conteúdo via `prebuild`; `npm run check` executa conteúdo, lint e build em sequência.

Para a camada Sites, `npm run build:sites` gera a saída de produção e `npm run start:sites` permite conferi-la localmente. O domínio canônico deve ser informado por `NEXT_PUBLIC_SITE_URL` antes do build. Identificadores internos de hospedagem não pertencem à documentação.

## Próximos cuidados

- executar revisão visual em desktop e mobile depois de mudanças de layout;
- testar tema, menu, busca, links, redirects e `localStorage` do fluxo;
- manter [`public/og.png`](./public/og.png) sincronizado com o posicionamento visual;
- executar `npm run build:sites` antes de uma publicação pelo Sites;
- revisar links e metadados editoriais a cada semestre, sem reintroduzir datas vencidas.
