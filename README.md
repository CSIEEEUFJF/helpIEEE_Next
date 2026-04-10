# HELPIEEE Next

Objetivo: migrar o site original para React com Next preservando estrutura, conteúdo, estilos, scripts e caminhos da demo.

Estrutura:
- `app/(home)` renderiza a home original em `/` e `/index.html`.
- `app/(content)/pages/[slug]` renderiza as páginas originais em `/pages/*.html`.
- `app/(flow)` mantém o fluxo em `/pages/fluxo.html` e redireciona `/fluxo.html`.
- `legacy-source/` guarda uma cópia dos HTML originais.
- `public/assets/` guarda a cópia integral dos assets originais.

Decisões de UX:
- Nenhuma reorganização de conteúdo foi aplicada nesta etapa.
- A prioridade foi manter o comportamento original e apenas portar a entrega para Next/React.
- Os caminhos antigos foram preservados para que links, iframes e scripts continuem funcionando.

Componentes utilizados:
- Next.js App Router
- React
- Renderização de HTML legado com carregamento fiel de CSS e scripts

Comandos:
- `npm run dev`
- `npm run lint`
- `npm run build`
