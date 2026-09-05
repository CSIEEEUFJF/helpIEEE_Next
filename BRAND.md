# Identidade visual do HELPIEEE

Este arquivo registra as decisões de marca usadas no site e deve ser consultado antes de qualquer alteração visual.

Referências oficiais:

- [IEEE Brand Identity Guidelines](https://brand-experience.ieee.org/guidelines/brand-identity/)
- [IEEE Global Page Elements and Branding Requirements](https://brand-experience.ieee.org/guidelines/digital/style-guide/global-page-element-and-branding-requirements/)
- [IEEE Master Brand and Logos](https://brand-experience.ieee.org/guidelines/master-brand-and-logos/)

## Master Brand

- Usar somente os arquivos oficiais `ieee-master-brand-black.png` e `ieee-master-brand-white.png`.
- O cabeçalho mostra a versão preta sobre fundo branco e troca para a versão branca sobre azul IEEE ou no modo escuro.
- O Master Brand mantém 113 × 33 px, espaço livre e link para `https://www.ieee.org/` na mesma janela.
- Não redesenhar, recortar, distorcer, recolorir, aplicar sombra, contorno ou recipiente ao Master Brand.
- O rodapé usa a versão branca sobre Dark Blue ou preto.

## Identificador HELPIEEE

- Escrever `IEEE` sempre em maiúsculas.
- Usar apenas uma cor base e, no máximo, um acento da paleta IEEE.
- Não separar, redesenhar ou reaproveitar o kite do Master Brand dentro do identificador.
- O tratamento atual usa Open Sans, que é uma fonte institucional permitida para aplicações web.
- A aprovação formal do tratamento `HELPIEEE` pelo IEEE Experience Design Team continua obrigatória antes de declarar o wordmark oficialmente aprovado. O contato indicado pelo guia digital é `exd-team@ieee.org`.

## Tipografia

- Fonte global: Open Sans.
- Pesos disponíveis no projeto: de 300 a 800.
- Não usar `font-weight: 900`, pois esse peso seria sintetizado pelo navegador.
- Para um novo type treatment institucional, usar Formata Medium ou Formata Medium Condensed somente quando houver licença e aprovação do IEEE.

## Paleta

Pigmentos principais usados pelo HELPIEEE:

| Cor | HEX | Uso |
| --- | --- | --- |
| IEEE Blue | `#00629B` | marca, navegação e ações principais |
| Dark Blue | `#002855` | texto, fundos escuros e alto contraste |
| Cyan | `#00B5E2` | acentos |
| Dark Green | `#006341` | estados positivos |
| Dark Orange | `#E87722` | pré-requisitos e atenção |
| Dark Purple | `#772583` | correquisitos |
| Dark Red | `#861F41` | alertas críticos |
| IEEE Gray | `#75787B` | bordas e tints neutros |
| Black | `#000000` | modo escuro e Master Brand |
| White | `#FFFFFF` | superfícies e contraste |

- Tints devem ser derivados desses pigmentos com `color-mix` e não podem ficar abaixo de 10% da cor base.
- Textos pequenos devem atingir contraste WCAG AA de pelo menos 4,5:1.
- O modo escuro mantém a hierarquia monocromática preto e branco já definida.

## Identificador do Ramo

- Usar `ieee-ufjf.svg` sem editar o arquivo-fonte.
- No tema claro, o SVG pode ser apresentado em IEEE Blue sem círculo, sombra ou recipiente.
- No modo escuro, usar o SVG branco sem círculo, fundo, sombra ou recipiente e com a mesma caixa visual do tema claro.

## Checklist antes de publicar

1. Confirmar que o Master Brand aparece no cabeçalho de todas as rotas.
2. Verificar a troca preto → branco quando a navbar se torna azul e ao ativar o modo escuro.
3. Confirmar `alt="IEEE"`, link para `www.ieee.org` e tamanho mínimo.
4. Não introduzir cores fora da paleta ou pesos acima de 800.
5. Validar contraste, navegação móvel, build e testes.
6. Atualizar `public/og.png` e os metadados quando a identidade principal mudar.
