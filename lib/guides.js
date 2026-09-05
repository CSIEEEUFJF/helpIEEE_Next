export const CONTENT_REVIEW_DATE = '2026-09-03';

export const officialLinks = Object.freeze({
  ufjfSiga: 'https://www2.ufjf.br/minhaufjf/siga/',
  ufjfTechnologySupport: 'https://centraldeservicos.ufjf.br/',
  ufjfWifi: 'https://www2.ufjf.br/catalogoti/rede-sem-fio/',
  ufjfRestaurant: 'https://www2.ufjf.br/minhaufjf/restaurante-universitario/',
  ufjfRestaurantCard: 'https://carteirinha.ufjf.br/',
  ufjfCalendar: 'https://www2.ufjf.br/prograd/calendariosacademicos/',
  ufjfRag: 'https://www2.ufjf.br/prograd/rag/',
  ufjfCat: 'https://www2.ufjf.br/cat/',
  ufjfLibrary: 'https://www2.ufjf.br/biblioteca/servicos/',
  ufjfStudentSupport: 'https://www2.ufjf.br/ufjf/ensino/apoio-estudantil/',
  ufjfTransport: 'https://www2.ufjf.br/transporte/onibus-circular/',
  engineeringSupport: 'https://suporte.engenharia.ufjf.br/open.php',
  engineeringSupportScope: 'https://suporte.engenharia.ufjf.br/kb/faq.php?id=8',
  ufjfMoodle: 'https://ead.ufjf.br/',
  algorithms: 'https://sites.google.com/site/algoritmosufjf/turmas-A-a-E/material-a-a-j',
  algorithmsInfo: 'https://sites.google.com/site/algoritmosufjf/Principal/informacoes-uteis',
  algorithmsBibliography: 'https://sites.google.com/site/algoritmosufjf/Principal/bibliografia',
  calculus: 'https://www2.ufjf.br/mat/graduacao/disciplinasdep/paginas-das-disciplinas/calculo-1/',
  analyticGeometry:
    'https://www2.ufjf.br/mat/graduacao/disciplinasdep/paginas-das-disciplinas/geometria-analitica-e-sistemas-lineares/',
  ieeeUfjf: 'https://www.ieeeufjf.com.br/',
  ieeeUfjfInstagram: 'https://www.instagram.com/ieeeufjf/',
  ieeeUfjfAess: 'https://www.ieeeufjf.com.br/capitulos/aess',
  ieeeUfjfAps: 'https://www.ieeeufjf.com.br/capitulos/aps',
  ieeeUfjfComsoc: 'https://www.ieeeufjf.com.br/capitulos/comsoc',
  ieeeUfjfCs: 'https://www.ieeeufjf.com.br/capitulos/cs',
  ieeeUfjfCas: 'https://www.ieeeufjf.com.br/capitulos/cas',
  ieeeUfjfEdsoc: 'https://www.ieeeufjf.com.br/capitulos/edsoc',
  ieeeUfjfIas: 'https://www.ieeeufjf.com.br/capitulos/ias',
  ieeeUfjfPes: 'https://www.ieeeufjf.com.br/capitulos/pes',
  ieeeUfjfRas: 'https://www.ieeeufjf.com.br/capitulos/ras',
  ieeeUfjfSight: 'https://www.ieeeufjf.com.br/capitulos/sight',
  ieeeUfjfVts: 'https://www.ieeeufjf.com.br/capitulos/vts',
  ieeeUfjfWie: 'https://www.ieeeufjf.com.br/capitulos/wie',
});

const editorialSource = 'Acervo editorial do HELPIEEE';

export const guides = [
  {
    slug: 'chegada',
    category: 'Primeiros passos',
    eyebrow: 'Primeiros passos',
    title: 'Comece pela UFJF que você vai usar todos os dias',
    summary:
      'Um roteiro curto para organizar horários, campus, acesso digital, alimentação e os canais certos de ajuda.',
    audience: 'Calouros de cursos de Exatas e Engenharias da UFJF.',
    scope:
      'Serviços gerais da UFJF, referências do campus de Juiz de Fora e orientações do LACEE na Faculdade de Engenharia.',
    keywords: ['primeira semana', 'SIGA', 'Wi-Fi', 'eduroam', 'RU', 'carteirinha', 'campus', 'LACEE'],
    reviewedAt: CONTENT_REVIEW_DATE,
    sourceLabel: editorialSource,
    legacySlugs: ['primeiros-passos.html'],
    sections: [
      {
        id: 'primeira-semana',
        title: 'Resolva primeiro o que evita correria',
        summary:
          'Você não precisa entender a universidade inteira no primeiro dia. Deixe à mão o que será usado já na primeira semana.',
        paragraphs: [
          'Confirme as informações no SIGA e nos avisos oficiais da sua turma. Sala, docente e horário podem mudar no início do período.',
        ],
        items: [
          {
            title: 'Salve sua grade',
            text: 'Registre disciplinas, horários e salas em um lugar que funcione mesmo sem internet.',
            list: [
              'Confira o nome e o código de cada disciplina.',
              'Observe se há aulas em unidades diferentes e considere o tempo de deslocamento.',
              'Revise o SIGA durante o período de ajustes.',
            ],
            links: [
              {
                label: 'Orientações oficiais sobre o SIGA',
                href: officialLinks.ufjfSiga,
                kind: 'official',
              },
            ],
          },
          {
            title: 'Crie seus pontos de referência',
            text: 'Localize as salas mais usadas, a coordenação do seu curso, o ICE, a Faculdade de Engenharia, o RU, a biblioteca e os banheiros próximos.',
            list: [
              'Faça o primeiro trajeto com alguns minutos de folga.',
              'Pergunte na coordenação quando uma localização não estiver clara.',
              'Não presuma que todas as aulas do curso ficam no mesmo prédio.',
            ],
            links: [],
          },
          {
            title: 'Entre na rede de comunicação da turma',
            text: 'Colegas, veteranos e monitorias ajudam com avisos de curto prazo, mas decisões acadêmicas devem ser confirmadas em canais oficiais.',
            list: [
              'Use o grupo para alertas de sala e aula.',
              'Guarde comunicados importantes do docente ou da coordenação.',
              'Separe informação oficial de repasse informal.',
            ],
            links: [],
          },
        ],
      },
      {
        id: 'servicos-essenciais',
        title: 'Internet, alimentação e suporte',
        summary:
          'Esses serviços mudam pouco a rotina quando funcionam — e tomam bastante tempo quando ficam para a última hora.',
        paragraphs: [
          'Os procedimentos, documentos e credenciais podem mudar. Por isso, o guia aponta para os canais que mantêm as instruções vigentes em vez de reproduzir passos sensíveis ao semestre.',
        ],
        items: [
          {
            title: 'Rede sem fio da UFJF',
            text: 'Configure o celular e o computador seguindo o catálogo oficial de TI. Se o acesso falhar, use a Central de Serviços de Tecnologia.',
            list: [
              'Faça a configuração antes de uma aula que dependa de internet.',
              'Nunca compartilhe senha institucional em grupos.',
              'Confirme no tutorial oficial quais redes e parâmetros estão ativos.',
            ],
            links: [
              { label: 'Configurar a rede sem fio', href: officialLinks.ufjfWifi, kind: 'official' },
              {
                label: 'Abrir a Central de Serviços de Tecnologia',
                href: officialLinks.ufjfTechnologySupport,
                kind: 'official',
              },
            ],
            sourceLabel: 'UFJF — Catálogo de TI',
            reviewedAt: CONTENT_REVIEW_DATE,
          },
          {
            title: 'Restaurante Universitário',
            text: 'Consulte o guia vigente do RU para saber como solicitar ou regularizar a carteirinha, quais documentos levar e como usar o serviço.',
            list: [
              'Solicite a carteirinha pelos canais oficiais.',
              'Confira horários, unidades e forma de crédito antes de se deslocar.',
              'Leve um plano alternativo enquanto a solicitação estiver em andamento.',
            ],
            links: [
              { label: 'Guia oficial do RU', href: officialLinks.ufjfRestaurant, kind: 'official' },
              {
                label: 'Portal da carteirinha',
                href: officialLinks.ufjfRestaurantCard,
                kind: 'official',
              },
            ],
            sourceLabel: 'UFJF — Minha UFJF / Restaurante Universitário',
            reviewedAt: CONTENT_REVIEW_DATE,
          },
          {
            title: 'Deslocamento dentro do campus',
            text: 'Consulte a página da Gerência de Transporte para conferir horários e alterações dos ônibus Circular e RU.',
            list: [
              'Verifique o horário vigente antes de sair.',
              'Considere tempo extra nos horários de maior movimento.',
              'Em férias e recessos, a oferta pode ser reduzida.',
            ],
            links: [
              {
                label: 'Consultar ônibus Circular e RU',
                href: officialLinks.ufjfTransport,
                kind: 'official',
              },
            ],
            sourceLabel: 'UFJF — Gerência de Transporte',
            reviewedAt: CONTENT_REVIEW_DATE,
          },
          {
            title: 'Acesso ao LACEE',
            text: 'Este item é específico da Faculdade de Engenharia. Quando uma disciplina exigir o laboratório, confirme o procedimento com o docente e com o suporte local.',
            list: [
              'Abra a solicitação no portal de suporte da Engenharia.',
              'Explique qual acesso é necessário e informe a disciplina quando aplicável.',
              'Aguarde a orientação da equipe para os próximos passos.',
            ],
            links: [
              {
                label: 'Abrir solicitação no suporte da Engenharia',
                href: officialLinks.engineeringSupport,
                kind: 'official',
              },
              {
                label: 'Consultar o escopo do suporte',
                href: officialLinks.engineeringSupportScope,
                kind: 'official',
              },
            ],
            sourceLabel: 'Faculdade de Engenharia da UFJF — Suporte',
            reviewedAt: CONTENT_REVIEW_DATE,
          },
          {
            title: 'Descubra quem resolve cada assunto',
            text: 'Sistema e senha vão para a TI; matrícula e regras pedem coordenação ou atendimento acadêmico; RU tem canal próprio.',
            list: [
              'Descreva o problema, a mensagem de erro e o que você já tentou.',
              'Evite enviar dados sensíveis em grupos abertos.',
              'Guarde protocolo e resposta quando abrir um atendimento.',
            ],
            links: [
              {
                label: 'Central de Serviços de Tecnologia',
                href: officialLinks.ufjfTechnologySupport,
                kind: 'official',
              },
              { label: 'Orientações do SIGA', href: officialLinks.ufjfSiga, kind: 'official' },
              { label: 'Atendimento do RU', href: officialLinks.ufjfRestaurant, kind: 'official' },
            ],
          },
        ],
      },
      {
        id: 'ritmo-inicial',
        title: 'Monte um ritmo possível',
        summary: 'O objetivo da primeira semana é criar previsibilidade, não uma rotina perfeita.',
        paragraphs: [
          'Matérias de base costumam acumular. Uma revisão curta e frequente facilita perceber dúvidas enquanto elas ainda são pequenas.',
        ],
        items: [
          {
            title: 'Faça uma revisão perto da aula',
            text: 'Organize anotações e tente alguns exercícios antes de o conteúdo seguinte chegar.',
            list: ['Marque dúvidas específicas.', 'Procure monitoria cedo.', 'Reserve tempo de descanso e deslocamento.'],
            links: [],
          },
          {
            title: 'Peça ajuda com contexto',
            text: 'Mostre sua tentativa e indique o ponto exato em que perdeu o raciocínio.',
            list: ['Leve o enunciado completo.', 'Explique o método usado.', 'Registre a correção para revisar depois.'],
            links: [],
          },
        ],
      },
    ],
  },
  {
    slug: 'faculdade',
    category: 'Vida acadêmica',
    eyebrow: 'Vida acadêmica',
    title: 'Entenda as regras sem decorar a universidade inteira',
    summary:
      'SIGA, calendário, matrícula, pré-requisitos e o vocabulário que aparece em toda graduação.',
    audience: 'Calouros de cursos de Exatas e Engenharias da UFJF.',
    scope:
      'Conceitos gerais de SIGA, calendário acadêmico, RAG, matrícula e organização curricular.',
    keywords: ['SIGA', 'RAG', 'IRA', 'matrícula', 'trancamento', 'frequência', 'pré-requisito', 'calendário'],
    reviewedAt: CONTENT_REVIEW_DATE,
    sourceLabel: editorialSource,
    legacySlugs: ['faculdade.html', 'fluxo.html'],
    sections: [
      {
        id: 'painel-academico',
        title: 'Tenha quatro referências no radar',
        summary: 'Quando houver dúvida, comece pela fonte que realmente governa aquela decisão.',
        paragraphs: [
          'O SIGA registra sua vida acadêmica. O calendário organiza prazos. O RAG reúne regras. A coordenação interpreta situações do seu curso.',
        ],
        items: [
          {
            title: 'SIGA',
            text: 'É o sistema usado para consultar informações como grade, histórico, comprovantes e etapas da matrícula.',
            list: [
              'Confira se seus dados de contato estão corretos.',
              'Guarde comprovantes de operações importantes.',
              'Em caso de erro técnico, registre atendimento.',
            ],
            links: [
              { label: 'Orientações oficiais sobre o SIGA', href: officialLinks.ufjfSiga, kind: 'official' },
              {
                label: 'Suporte de tecnologia da UFJF',
                href: officialLinks.ufjfTechnologySupport,
                kind: 'official',
              },
            ],
            sourceLabel: 'UFJF — Minha UFJF / SIGA',
            reviewedAt: CONTENT_REVIEW_DATE,
          },
          {
            title: 'Calendário acadêmico',
            text: 'Concentre em um calendário pessoal os prazos oficiais que afetam matrícula, ajustes, avaliações, trancamentos e encerramento do período.',
            list: [
              'Use somente o calendário do período e do campus/modalidade corretos.',
              'Não reutilize datas de semestres anteriores.',
              'Ative lembretes com antecedência.',
            ],
            links: [
              {
                label: 'Consultar o calendário acadêmico vigente',
                href: officialLinks.ufjfCalendar,
                kind: 'official',
              },
            ],
            sourceLabel: 'UFJF — Pró-Reitoria de Graduação',
            reviewedAt: CONTENT_REVIEW_DATE,
          },
          {
            title: 'RAG e atendimento acadêmico',
            text: 'Quando a questão envolver regra, procure o Regulamento Acadêmico da Graduação e valide a interpretação com a coordenação ou o setor responsável.',
            list: [
              'Informe curso, matrícula e contexto ao pedir orientação.',
              'Peça a indicação da norma ou do procedimento aplicável.',
              'Não trate relatos de outros semestres como regra atual.',
            ],
            links: [
              { label: 'Consultar o RAG', href: officialLinks.ufjfRag, kind: 'official' },
              { label: 'Abrir a Central de Atendimento', href: officialLinks.ufjfCat, kind: 'official' },
            ],
            sourceLabel: 'UFJF — Pró-Reitoria de Graduação e Central de Atendimento',
            reviewedAt: CONTENT_REVIEW_DATE,
          },
          {
            title: 'Currículo e pré-requisitos',
            text: 'Cada curso tem uma matriz própria. Consulte o currículo correspondente ao seu ingresso e use o fluxo como ferramenta de planejamento.',
            list: [
              'Confira quais disciplinas exigem pré-requisitos.',
              'Observe componentes ofertados em períodos específicos.',
              'Converse com a coordenação antes de alterar uma sequência importante.',
            ],
            links: [],
          },
        ],
      },
      {
        id: 'glossario',
        title: 'Glossário rápido da UFJF',
        summary: 'Um tradutor para termos que aparecem em sistemas, editais e conversas acadêmicas.',
        paragraphs: [
          'As definições abaixo são introdutórias. Consulte a norma ou o setor responsável quando o termo estiver ligado a uma decisão formal.',
        ],
        items: [
          {
            title: 'IRA — Índice de Rendimento Acadêmico',
            text: 'Indicador de desempenho acadêmico que pode aparecer em editais, seleções e critérios de classificação.',
            list: [],
            links: [],
          },
          {
            title: 'RAG — Regulamento Acadêmico da Graduação',
            text: 'Conjunto de regras da graduação usado em temas como matrícula, frequência, trancamento e procedimentos acadêmicos.',
            list: [],
            links: [{ label: 'Consultar o RAG', href: officialLinks.ufjfRag, kind: 'official' }],
          },
          {
            title: 'SIGA — Sistema Integrado de Gestão Acadêmica',
            text: 'Sistema que concentra consultas e operações da vida acadêmica.',
            list: [],
            links: [{ label: 'Conhecer o SIGA', href: officialLinks.ufjfSiga, kind: 'official' }],
          },
          {
            title: 'RU — Restaurante Universitário',
            text: 'Serviço de alimentação universitária; acesso, horários e forma de uso devem ser conferidos no canal vigente.',
            list: [],
            links: [{ label: 'Consultar o RU', href: officialLinks.ufjfRestaurant, kind: 'official' }],
          },
          {
            title: 'CAT — Central de Atendimento',
            text: 'Referência de atendimento para demandas administrativas, cadastrais e documentais.',
            list: [],
            links: [{ label: 'Abrir a Central de Atendimento', href: officialLinks.ufjfCat, kind: 'official' }],
          },
          {
            title: 'Pré-requisito',
            text: 'Componente que precisa ser cumprido antes de outro, conforme o currículo do curso.',
            list: [],
            links: [],
          },
          {
            title: 'Trancamento',
            text: 'Procedimento formal para interromper uma disciplina ou o curso dentro das regras e dos prazos aplicáveis.',
            list: [],
            links: [],
          },
        ],
      },
      {
        id: 'rotina-academica',
        title: 'Evite transformar todo prazo em emergência',
        summary: 'Uma verificação semanal costuma ser suficiente para manter o semestre visível.',
        paragraphs: [
          'Vida acadêmica combina estudo, presença, comunicação e burocracia. Cuidar dessas frentes aos poucos reduz imprevistos.',
        ],
        items: [
          {
            title: 'Faça uma revisão semanal',
            text: 'Confira aulas, entregas, prazos acadêmicos e dúvidas que precisam de resposta.',
            list: ['Atualize seu calendário.', 'Revise pendências no SIGA.', 'Procure apoio antes de acumular conteúdo.'],
            links: [],
          },
          {
            title: 'Registre decisões importantes',
            text: 'Guarde protocolos, e-mails e comprovantes relacionados a matrícula, atendimento e ajustes.',
            list: ['Use assunto claro nos e-mails.', 'Inclua informações suficientes.', 'Mantenha uma cópia da resposta.'],
            links: [],
          },
        ],
      },
    ],
  },
  {
    slug: 'estudos',
    category: 'Materiais e estudos',
    eyebrow: 'Materiais e estudos',
    title: 'Estude com fontes confiáveis e uma rotina que cabe na semana',
    summary:
      'Materiais oficiais, referências iniciais e métodos simples para disciplinas comuns de Exatas e Engenharias.',
    audience: 'Calouros de Exatas e Engenharias; a coleção inclui conteúdos de base comuns a diferentes cursos.',
    scope:
      'Materiais iniciais de sete disciplinas básicas presentes em cursos de Exatas e Engenharias.',
    keywords: [
      'materiais',
      'Moodle',
      'Algoritmos',
      'Cálculo',
      'Geometria Analítica',
      'Química',
      'laboratório',
      'rotina de estudo',
    ],
    reviewedAt: CONTENT_REVIEW_DATE,
    sourceLabel: editorialSource,
    legacySlugs: [
      'materiais.html',
      'materiais-algoritmos.html',
      'materiais-calculo.html',
      'materiais-geometria-analitica.html',
      'materiais-introducao-engenharia-eletrica.html',
      'materiais-laboratorio-ciencias-fisicas.html',
      'materiais-quimica-fundamental.html',
      'materiais-laboratorio-quimica.html',
    ],
    sections: [
      {
        id: 'fontes',
        title: 'Comece pela fonte da sua turma',
        summary: 'Plano de ensino, ambiente virtual e página da disciplina vêm antes de arquivos repassados sem contexto.',
        paragraphs: [
          'Materiais de outro semestre podem ajudar no treino, mas não substituem o plano, a bibliografia e as orientações vigentes da sua turma.',
        ],
        items: [
          {
            title: 'Monte um kit por disciplina',
            text: 'Reúna em uma pasta o plano de ensino, o material-base, listas, avisos e suas próprias anotações.',
            list: [
              'Nomeie os arquivos com disciplina e assunto.',
              'Diferencie material oficial de complemento.',
              'Anote a origem e o semestre de materiais antigos.',
            ],
            links: [{ label: 'Acessar o ambiente virtual da UFJF', href: officialLinks.ufjfMoodle, kind: 'official' }],
          },
          {
            title: 'Use o plano para dar direção ao estudo',
            text: 'O plano ajuda a entender objetivos, conteúdo e avaliação; o cronograma da turma mostra quando cada bloco será trabalhado.',
            list: [
              'Confirme o plano vigente com o docente.',
              'Divida o conteúdo em blocos menores.',
              'Replaneje quando o andamento da turma mudar.',
            ],
            links: [],
          },
          {
            title: 'Use as bibliotecas da UFJF',
            text: 'As bibliotecas oferecem acervo físico e digital, espaços de estudo, reservas, renovações e orientação para trabalhos acadêmicos.',
            list: [
              'Consulte a disponibilidade antes de se deslocar.',
              'Use o SIGA e o Pergamum para reservas e renovações quando o serviço estiver disponível.',
              'Verifique regras de empréstimo e devolução no canal oficial.',
            ],
            links: [
              {
                label: 'Conhecer os serviços das bibliotecas',
                href: officialLinks.ufjfLibrary,
                kind: 'official',
              },
            ],
            sourceLabel: 'UFJF — Sistema de Bibliotecas',
            reviewedAt: CONTENT_REVIEW_DATE,
          },
        ],
      },
      {
        id: 'acervo-inicial',
        title: 'Disciplinas e materiais de base',
        summary:
          'Uma coleção de apoio para conteúdos recorrentes em cursos de Exatas e Engenharias, sem representar uma grade universal.',
        paragraphs: [
          'Se uma disciplina não estiver na sua matrícula, ignore-a. Se o nome ou o código divergir, valide equivalências antes de usar o material.',
        ],
        items: [
          {
            title: 'Algoritmos',
            text: 'Lógica, variáveis, funções, estruturas condicionais, repetições, vetores, strings, matrizes e estruturas heterogêneas.',
            list: [
              'Acompanhe teoria e prática juntas.',
              'Teste soluções pequenas antes de ampliar o código.',
              'Use listas e depuração para localizar o tipo de erro.',
            ],
            links: [
              { label: 'Materiais públicos da disciplina', href: officialLinks.algorithms, kind: 'official' },
              { label: 'Informações úteis', href: officialLinks.algorithmsInfo, kind: 'official' },
              { label: 'Bibliografia indicada', href: officialLinks.algorithmsBibliography, kind: 'official' },
            ],
            sourceLabel: 'Página pública da disciplina de Algoritmos — UFJF',
            reviewedAt: CONTENT_REVIEW_DATE,
          },
          {
            title: 'Cálculo I',
            text: 'Números reais, funções, limites, continuidade, derivadas e aplicações aparecem como blocos centrais da disciplina.',
            list: [
              'Revise funções antes de avançar para limites.',
              'Alterne compreensão conceitual e exercícios.',
              'Use o cronograma vigente para distribuir as revisões.',
            ],
            links: [{ label: 'Página da disciplina', href: officialLinks.calculus, kind: 'official' }],
            sourceLabel: 'UFJF — Departamento de Matemática',
            reviewedAt: CONTENT_REVIEW_DATE,
          },
          {
            title: 'Geometria Analítica e Sistemas Lineares',
            text: 'Matrizes, sistemas lineares, vetores, retas, planos, cônicas e mudanças de coordenadas combinam cálculo e interpretação geométrica.',
            list: [
              'Separe o treino algébrico da visualização geométrica.',
              'Feche um capítulo antes de misturar muitos tipos de questão.',
              'Compare a solução com a interpretação do resultado.',
            ],
            links: [
              {
                label: 'Página da disciplina',
                href: officialLinks.analyticGeometry,
                kind: 'official',
              },
            ],
            sourceLabel: 'UFJF — Departamento de Matemática',
            reviewedAt: CONTENT_REVIEW_DATE,
          },
          {
            title: 'Introdução ao seu curso',
            text: 'Disciplinas de ambientação ajudam a reconhecer áreas, vocabulário, estrutura curricular e possibilidades profissionais de cada curso.',
            list: [
              'Relacione cada área a problemas e aplicações reais.',
              'Use visitas e apresentações para descobrir afinidades.',
              'Conecte a visão geral ao currículo do curso.',
            ],
            links: [],
          },
          {
            title: 'Laboratório de Introdução à Ciências Físicas',
            text: 'Preparação, observação, unidades, registro de dados e relatório são parte do experimento.',
            list: [
              'Leia o roteiro antes da aula.',
              'Registre medida, unidade e condição da observação.',
              'Comece o relatório enquanto o procedimento ainda está fresco.',
            ],
            links: [],
          },
          {
            title: 'Química Fundamental',
            text: 'Conceitos, transformações, representação química, proporções e resolução organizada de exercícios.',
            list: [
              'Entenda o fenômeno antes de memorizar a expressão.',
              'Acompanhe unidades e proporções em cada etapa.',
              'Revise estrutura, ligações, reações e estequiometria por blocos.',
            ],
            links: [],
          },
          {
            title: 'Laboratório de Química',
            text: 'Segurança, atenção ao roteiro, observação de bancada e comunicação clara dos resultados.',
            list: [
              'Siga as instruções de segurança da equipe responsável.',
              'Registre valores e também mudanças observadas.',
              'Relacione a conclusão aos dados coletados.',
            ],
            links: [],
          },
        ],
      },
      {
        id: 'bibliografia',
        title: 'Bibliografia para consulta',
        summary: 'Uma lista de partida para localizar livros na biblioteca ou em catálogos legais de consulta.',
        paragraphs: [
          'Nem toda obra está disponível em acesso aberto. Consulte a biblioteca da UFJF e respeite as condições de acesso de cada edição.',
        ],
        items: [
          {
            title: 'Algoritmos e programação',
            text: 'Referências indicadas para a disciplina.',
            list: [
              'Rodrigo L. Silva — Introdução à Lógica de Programação com C++ (2023).',
              'Medina e Fertig — Algoritmos e Programação: teoria e prática.',
              'José Augusto N. G. Manzano — Programação de computadores com C/C++.',
              'R. Soffner — Algoritmos e programação em linguagem C.',
              'Drozdek — Estrutura de dados e algoritmos em C++.',
              'Votre — C++ explicado e aplicado.',
              'Feofiloff — Algoritmos em linguagem C.',
              'Ascencio e Campos — Fundamentos da Programação de Computadores.',
            ],
            links: [{ label: 'Consultar a bibliografia da disciplina', href: officialLinks.algorithmsBibliography, kind: 'official' }],
          },
          {
            title: 'Cálculo I',
            text: 'Títulos indicados no plano de ensino da disciplina.',
            list: [
              'Anton — Cálculo, um novo horizonte, volume 1.',
              'Flemming e Gonçalves — Cálculo A.',
              'Guidorizzi — Um Curso de Cálculo, volume 1.',
              'Leithold — O Cálculo com Geometria Analítica, volume 1.',
              'Munem e Foulis — Cálculo, volume 1.',
              'Simmons — Cálculo com Geometria Analítica, volume 1.',
              'Stewart — Cálculo, volume 1.',
              'Swokowski — Cálculo com Geometria Analítica, volume 1.',
            ],
            links: [{ label: 'Página da disciplina', href: officialLinks.calculus, kind: 'official' }],
          },
          {
            title: 'Geometria Analítica e Álgebra Linear',
            text: 'Títulos indicados no plano de ensino da disciplina.',
            list: [
              'Anton e Rorres — Álgebra Linear com Aplicações.',
              'Boldrini — Álgebra Linear.',
              'Boulos e Camargo — Geometria Analítica: Um Tratamento Vetorial.',
              'Boulos e Camargo — Introdução à Geometria Analítica no Espaço.',
              'Callioli, Domingues e Costa — Álgebra Linear e Aplicações.',
              'Lehmann — Geometria Analítica.',
              'Lipschutz — Álgebra Linear.',
              'Reis e Silva — Geometria Analítica.',
              'Reginaldo J. Santos — Matrizes, Vetores e Geometria Analítica.',
              'Steinbruch e Winterle — Álgebra Linear; Geometria Analítica.',
              'Winterle — Vetores e Geometria Analítica.',
            ],
            links: [
              {
                label: 'Página da disciplina',
                href: officialLinks.analyticGeometry,
                kind: 'official',
              },
            ],
          },
        ],
      },
      {
        id: 'metodo',
        title: 'Transforme material em ciclo de estudo',
        summary: 'Colecionar arquivos não é o mesmo que aprender. Use cada recurso com uma intenção clara.',
        paragraphs: [
          'Uma sequência curta — compreender, tentar, diagnosticar e revisar — funciona em diferentes disciplinas sem exigir um sistema complicado.',
        ],
        items: [
          {
            title: '1. Separe por tema',
            text: 'Identifique o bloco de conteúdo e o tipo de habilidade exigida.',
            list: ['Leia a teoria-base.', 'Escolha poucos exercícios representativos.', 'Evite misturar assuntos antes de firmar a base.'],
            links: [],
          },
          {
            title: '2. Resolva em condições reais',
            text: 'Faça uma primeira tentativa sem consultar a solução e marque onde travou.',
            list: ['Registre o tempo.', 'Diferencie erro de conceito, conta e interpretação.', 'Compare métodos depois da tentativa.'],
            links: [],
          },
          {
            title: '3. Transforme o erro em revisão',
            text: 'Cada erro deve produzir uma ação pequena e verificável.',
            list: ['Rever um conceito.', 'Repetir um tipo de questão.', 'Levar uma dúvida específica à monitoria.'],
            links: [],
          },
        ],
      },
    ],
  },
  {
    slug: 'comunidade',
    category: 'Comunidade e apoio',
    eyebrow: 'Comunidade e apoio',
    title: 'Encontre pessoas, apoio e projetos para viver a UFJF',
    summary:
      'Canais de ajuda e uma vitrine inicial de equipes, extensão, representação e experiências além da sala de aula.',
    audience: 'Calouros de Exatas e Engenharias interessados em apoio, integração e atividades extracurriculares.',
    scope:
      'Canais de apoio, integração, projetos, extensão e representação estudantil.',
    keywords: ['monitoria', 'veteranos', 'equipes', 'extensão', 'empresa júnior', 'representação', 'projetos'],
    reviewedAt: CONTENT_REVIEW_DATE,
    sourceLabel: editorialSource,
    legacySlugs: ['comunidade.html'],
    sections: [
      {
        id: 'rede-de-apoio',
        title: 'Use cada rede para o que ela faz melhor',
        summary: 'Apoio acadêmico, aviso operacional e acolhimento não precisam vir do mesmo lugar.',
        paragraphs: [
          'Uma boa rede encurta dúvidas e também ajuda a perceber quando é hora de procurar um canal formal ou apoio especializado.',
        ],
        items: [
          {
            title: 'Colegas da turma',
            text: 'Úteis para avisos de sala, horário, mudanças de aula e organização de curto prazo.',
            list: ['Confirme mudanças importantes com a fonte oficial.', 'Evite expor dados pessoais.', 'Compartilhe avisos com contexto.'],
            links: [],
          },
          {
            title: 'Monitorias, docentes e veteranos',
            text: 'Ajudam melhor quando você apresenta a tentativa e a dúvida específica.',
            list: ['Procure a monitoria antes de acumular.', 'Leve o material usado em aula.', 'Registre o que aprendeu.'],
            links: [],
          },
          {
            title: 'Grupos e projetos',
            text: 'Equipes, extensão, representação e empresa júnior aproximam pessoas de períodos e cursos diferentes.',
            list: ['Conheça a proposta antes de se candidatar.', 'Considere sua carga horária.', 'Escolha profundidade em vez de acumular siglas.'],
            links: [],
          },
          {
            title: 'Parceria de estudo',
            text: 'Uma ou duas pessoas com rotina compatível podem tornar listas e revisões mais sustentáveis.',
            list: ['Definam objetivo e duração.', 'Façam tentativas individuais.', 'Usem o encontro para comparar raciocínios.'],
            links: [],
          },
        ],
      },
      {
        id: 'integracao-ufjf',
        title: 'Portas de entrada além da sala de aula',
        summary:
          'Estas iniciativas públicas aproximam estudantes de experiências técnicas, sociais e profissionais. Use os links para conhecer o trabalho e verificar oportunidades atuais.',
        paragraphs: [
          'A lista não é um ranking nem pretende ser completa. Ela reúne frentes técnicas, sociais, profissionais e de representação que já faziam parte do HELPIEEE.',
        ],
        items: [
          {
            title: 'Supernova Rocketry',
            text: 'Equipe ligada a projetos aeroespaciais, integração de sistemas e testes.',
            list: ['Aeroespacial', 'Sistemas', 'Testes', 'Trabalho em equipe'],
            links: [{ label: 'Conhecer a Supernova Rocketry', href: 'https://www.instagram.com/supernovarocketry/', kind: 'social' }],
          },
          {
            title: 'Rampage Baja',
            text: 'Equipe voltada a veículos, dinâmica, manufatura, telemetria e prototipagem.',
            list: ['Veículos', 'Telemetria', 'Protótipos', 'Competição'],
            links: [{ label: 'Conhecer a Rampage Baja', href: 'https://www.instagram.com/rampagebaja/', kind: 'social' }],
          },
          {
            title: 'Engenheiros Sem Fronteiras — Juiz de Fora',
            text: 'Iniciativa com projetos e ações sociais que aproximam Engenharia e impacto comunitário.',
            list: ['Projetos sociais', 'Comunidade', 'Voluntariado', 'Impacto local'],
            links: [{ label: 'Conhecer o ESF Juiz de Fora', href: 'https://www.instagram.com/esfjuizdefora/', kind: 'social' }],
          },
          {
            title: 'NASFE',
            text: 'Núcleo de atendimento social associado à Faculdade de Engenharia, com atuação técnica em Engenharia e Arquitetura.',
            list: ['Assistência técnica', 'Projetos', 'Extensão', 'Impacto social'],
            links: [{ label: 'Conhecer o NASFE', href: 'https://br.linkedin.com/company/nasfe', kind: 'social' }],
          },
          {
            title: 'CREA Jr. MG — Núcleo Juiz de Fora',
            text: 'Rede de aproximação entre estudantes, recém-formados e o ambiente profissional das Engenharias.',
            list: ['Eventos', 'Mentorias', 'Profissão', 'Networking'],
            links: [{ label: 'Conhecer o núcleo local', href: 'https://creajrminasnucleojf.blogspot.com/', kind: 'external' }],
          },
          {
            title: 'Equipe Capivara',
            text: 'Equipe de eficiência energética e desenvolvimento de protótipos veiculares.',
            list: ['Eficiência energética', 'Veículos', 'Integração de sistemas', 'Competição'],
            links: [{ label: 'Conhecer a Equipe Capivara', href: 'https://www.instagram.com/equipecapivara/', kind: 'social' }],
          },
          {
            title: 'LabMaker',
            text: 'Espaço de extensão associado a modelagem digital, prototipagem e impressão 3D.',
            list: ['Impressão 3D', 'Modelagem', 'Prototipagem', 'Extensão'],
            links: [{ label: 'Conhecer o LabMaker', href: 'https://www.instagram.com/labmakerufjf/', kind: 'social' }],
          },
          {
            title: 'ADAPT',
            text: 'Projeto de extensão em tecnologia assistiva, mobilidade e inclusão.',
            list: ['Inclusão', 'Mobilidade', 'Tecnologia assistiva', 'Extensão'],
            links: [{ label: 'Conhecer o ADAPT', href: 'https://www2.ufjf.br/adapt/', kind: 'official' }],
            sourceLabel: 'UFJF — página do projeto ADAPT',
            reviewedAt: CONTENT_REVIEW_DATE,
          },
          {
            title: 'Diretório Acadêmico da Engenharia',
            text: 'Espaço de representação estudantil e contato com pautas vividas pelos cursos de Engenharia.',
            list: ['Representação', 'Movimento estudantil', 'Acolhimento'],
            links: [
              {
                label: 'Consultar a referência pública disponível',
                href: 'https://www2.ufjf.br/engcomputacional/para-alunos/diretorio-academico/',
                kind: 'official',
              },
            ],
            sourceLabel: 'UFJF — Engenharia Computacional',
            reviewedAt: CONTENT_REVIEW_DATE,
          },
          {
            title: 'Microraptor',
            text: 'Equipe associada a aeronaves, aerodesign, projeto e testes.',
            list: ['Aerodesign', 'Aeronáutica', 'Projeto', 'Testes'],
            links: [{ label: 'Conhecer a Microraptor', href: 'https://www.instagram.com/microraptorufjf/', kind: 'social' }],
          },
          {
            title: 'Escuderia UFJF',
            text: 'Equipe associada a carro de competição, dinâmica veicular e projeto mecânico.',
            list: ['Fórmula SAE', 'Veículos', 'Projeto', 'Competição'],
            links: [{ label: 'Conhecer a Escuderia UFJF', href: 'https://www.instagram.com/escuderiaufjf/', kind: 'social' }],
          },
          {
            title: 'Porte Empresa Jr.',
            text: 'Empresa júnior com experiências em projetos, clientes e organização profissional.',
            list: ['Empresa júnior', 'Projetos', 'Clientes', 'Mercado'],
            links: [{ label: 'Conhecer a Porte', href: 'https://www.instagram.com/porteempresajr/', kind: 'social' }],
          },
        ].map((item) => ({
          ...item,
          sourceLabel: item.sourceLabel ?? 'Canal público da iniciativa',
          reviewedAt: item.reviewedAt ?? CONTENT_REVIEW_DATE,
        })),
      },
      {
        id: 'permanencia-bem-estar',
        title: 'Permanência e bem-estar também fazem parte da graduação',
        summary: 'Dificuldade financeira, emocional ou pedagógica não precisa ser enfrentada sem orientação.',
        paragraphs: [
          'A Pró-Reitoria de Assistência Estudantil reúne informações sobre bolsas e auxílios, moradia e atendimentos social, psicológico e pedagógico. Consulte o canal oficial para conhecer o acesso vigente.',
        ],
        items: [
          {
            title: 'Assistência estudantil',
            text: 'Procure a PROAE quando precisar entender programas de permanência, atendimento social, apoio pedagógico, psicologia ou moradia estudantil.',
            list: [
              'Leia os critérios e procedimentos vigentes antes de enviar documentos.',
              'Use os contatos institucionais e preserve seus dados pessoais.',
              'Se não souber qual setor procurar, peça orientação à Central de Atendimento.',
            ],
            links: [
              {
                label: 'Conhecer o apoio estudantil',
                href: officialLinks.ufjfStudentSupport,
                kind: 'official',
              },
              {
                label: 'Abrir a Central de Atendimento',
                href: officialLinks.ufjfCat,
                kind: 'official',
              },
            ],
            sourceLabel: 'UFJF — Pró-Reitoria de Assistência Estudantil',
            reviewedAt: CONTENT_REVIEW_DATE,
          },
        ],
      },
      {
        id: 'pedir-ajuda',
        title: 'Peça ajuda de um jeito que ensina',
        summary: 'Contexto e reciprocidade tornam qualquer grupo mais útil.',
        paragraphs: [
          'Pedir direção faz parte da aprendizagem. A ideia é destravar o próximo passo sem terceirizar todo o raciocínio.',
        ],
        items: [
          {
            title: 'Mostre onde travou',
            text: 'Explique o que tentou, onde o resultado divergiu e qual parte você ainda não compreende.',
            list: ['Inclua o enunciado.', 'Mostre os passos.', 'Faça uma pergunta específica.'],
            links: [],
          },
          {
            title: 'Compartilhe quando puder',
            text: 'Um aviso bem explicado, uma referência oficial ou uma anotação própria fortalecem a rede.',
            list: ['Dê crédito à fonte.', 'Não distribua material sem autorização.', 'Corrija informação desatualizada.'],
            links: [],
          },
        ],
      },
    ],
  },
  {
    slug: 'oportunidades',
    category: 'IEEE e oportunidades',
    eyebrow: 'IEEE e oportunidades',
    title: 'Conheça o Ramo Estudantil IEEE UFJF e aprenda fazendo',
    summary:
      'Projetos, extensão, sociedades técnicas, eventos e uma rede para explorar interesses desde o início do curso.',
    audience: 'Calouros de Exatas e Engenharias que desejam conhecer o IEEE e suas frentes na UFJF.',
    scope:
      'Sociedades técnicas, projetos, eventos e formas de participar do Ramo Estudantil IEEE UFJF.',
    keywords: ['IEEE', 'EdSoc', 'RAS', 'PES', 'WIE', 'SIGHT', 'eventos', 'projetos', 'extensão'],
    reviewedAt: CONTENT_REVIEW_DATE,
    sourceLabel: 'Ramo Estudantil IEEE UFJF e conteúdo editorial do HELPIEEE',
    legacySlugs: ['ieee.html'],
    sections: [
      {
        id: 'por-que-participar',
        title: 'A sala de aula é uma parte da formação',
        summary: 'Projetos e eventos acrescentam prática, colaboração e repertório à graduação.',
        paragraphs: [
          'Você não precisa chegar com experiência técnica. Curiosidade, disponibilidade para aprender e compromisso com a equipe já são um começo.',
        ],
        items: [
          {
            title: 'Aprender fazendo',
            text: 'Oficinas, projetos, eventos e documentação ajudam a transformar teoria em execução.',
            list: ['Prática técnica', 'Organização', 'Comunicação', 'Trabalho em equipe'],
            links: [{ label: 'Conhecer o Ramo Estudantil IEEE UFJF', href: officialLinks.ieeeUfjf, kind: 'official' }],
          },
          {
            title: 'Construir rede e repertório',
            text: 'O contato com estudantes, docentes, ex-membros e outros ramos amplia as referências de formação e carreira.',
            list: ['Eventos', 'Networking', 'Liderança', 'Troca entre áreas'],
            links: [{ label: 'Acompanhar o IEEE UFJF', href: officialLinks.ieeeUfjfInstagram, kind: 'social' }],
          },
          {
            title: 'Começar sem abraçar tudo',
            text: 'Escolha uma frente compatível com seu momento e conheça a rotina antes de assumir muitos compromissos.',
            list: ['Participe de atividades abertas.', 'Converse com integrantes.', 'Considere sua carga acadêmica.'],
            links: [],
          },
        ],
      },
      {
        id: 'ieeescolas',
        title: 'IEEEscolas',
        summary: 'Uma frente educacional que aproxima estudantes da UFJF e a educação básica.',
        paragraphs: [
          'As atividades envolvem ciências, energias renováveis, programação, robótica e aproximação com a Engenharia.',
        ],
        items: [
          {
            title: 'Ciência e energia em linguagem acessível',
            text: 'Atividades podem apresentar conceitos de robótica, energia, sustentabilidade e curiosidade científica de acordo com o público.',
            list: ['Ciência', 'Energia', 'Sustentabilidade', 'Robótica'],
            links: [{ label: 'Ver projetos do Ramo', href: officialLinks.ieeeUfjf, kind: 'official' }],
          },
          {
            title: 'Extensão como formação',
            text: 'Explicar um tema técnico para outras pessoas desenvolve comunicação, preparação e responsabilidade social.',
            list: ['Planejamento', 'Didática', 'Trabalho em equipe', 'Impacto educacional'],
            links: [],
          },
        ],
      },
      {
        id: 'grupos-ieee',
        title: 'Sociedades e grupos do IEEE na UFJF',
        summary: 'Cada frente reúne uma área de interesse. Conheça antes de escolher onde se envolver.',
        paragraphs: [
          'Acesse a página de cada sociedade ou grupo para conhecer sua atuação no Ramo Estudantil IEEE UFJF.',
        ],
        items: [
          {
            title: 'IEEE Aerospace and Electronic Systems Society',
            text: 'Sistemas aeroespaciais, aviação, eletrônica embarcada e tecnologias aplicadas a ambientes complexos.',
            list: ['Sistemas aeroespaciais', 'Eletrônica embarcada', 'Sensoriamento', 'Navegação e controle'],
            href: officialLinks.ieeeUfjfAess,
          },
          {
            title: 'IEEE Antennas and Propagation Society',
            text: 'Antenas, propagação e comportamento de sinais no espaço.',
            list: ['Antenas', 'Propagação', 'Eletromagnetismo'],
            href: officialLinks.ieeeUfjfAps,
          },
          {
            title: 'IEEE Communications Society',
            text: 'Telecomunicações, redes e comunicação digital.',
            list: ['Telecomunicações', 'Redes', 'Sinais'],
            href: officialLinks.ieeeUfjfComsoc,
          },
          {
            title: 'IEEE Computer Society',
            text: 'Computação, software, arquitetura de sistemas e desenvolvimento.',
            list: ['Computação', 'Software', 'Sistemas digitais'],
            href: officialLinks.ieeeUfjfCs,
          },
          {
            title: 'IEEE Circuits and Systems Society',
            text: 'Circuitos, sistemas eletrônicos, processamento de sinais e integração entre hardware e software.',
            list: ['Circuitos', 'Eletrônica', 'Processamento de sinais', 'Sistemas embarcados'],
            href: officialLinks.ieeeUfjfCas,
          },
          {
            title: 'IEEE Education Society',
            text: 'Ensino, oficinas, extensão e comunicação de assuntos técnicos.',
            list: ['Educação', 'Oficinas', 'Extensão'],
            href: officialLinks.ieeeUfjfEdsoc,
          },
          {
            title: 'IEEE Industry Applications Society',
            text: 'Acionamentos, automação aplicada, eletrificação e tecnologia em ambientes produtivos.',
            list: ['Indústria', 'Acionamentos', 'Automação', 'Eletrificação'],
            href: officialLinks.ieeeUfjfIas,
          },
          {
            title: 'IEEE Power & Energy Society',
            text: 'Energia, potência, redes elétricas, proteção e fontes renováveis.',
            list: ['Energia', 'Potência', 'Redes elétricas', 'Renováveis'],
            href: officialLinks.ieeeUfjfPes,
          },
          {
            title: 'IEEE Robotics and Automation Society',
            text: 'Robótica, automação, sistemas inteligentes, controle, sensores e atuadores.',
            list: ['Robótica', 'Automação', 'Controle', 'Sistemas inteligentes'],
            href: officialLinks.ieeeUfjfRas,
          },
          {
            title: 'IEEE Special Interest Group on Humanitarian Technology',
            text: 'Tecnologia aplicada a problemas reais da comunidade e impacto humano.',
            list: ['Tecnologia', 'Comunidade', 'Impacto social'],
            href: officialLinks.ieeeUfjfSight,
          },
          {
            title: 'IEEE Vehicular Technology Society',
            text: 'Mobilidade, veículos, dinâmica e sistemas de transporte.',
            list: ['Mobilidade', 'Veículos', 'Transporte'],
            href: officialLinks.ieeeUfjfVts,
          },
          {
            title: 'IEEE Women in Engineering',
            text: 'Rede, acolhimento, liderança e protagonismo feminino na Engenharia.',
            list: ['Acolhimento', 'Liderança', 'Representatividade'],
            href: officialLinks.ieeeUfjfWie,
          },
        ].map((item) => ({
          ...item,
          links: [
            {
              label: `Conhecer a ${item.title}`,
              href: item.href,
              kind: 'official',
            },
          ],
        })),
      },
      {
        id: 'primeiro-contato',
        title: 'Faça o primeiro contato',
        summary: 'O site e o Instagram do Ramo concentram os caminhos para eventos, projetos e seleções.',
        paragraphs: [
          'Acompanhe as atividades abertas e pergunte sobre a rotina da frente que chamou sua atenção.',
        ],
        items: [
          {
            title: 'Ramo Estudantil IEEE UFJF',
            text: 'Consulte os canais atuais antes de se inscrever ou comparecer a uma atividade.',
            list: ['Veja a agenda.', 'Confira requisitos.', 'Pergunte como acompanhar uma primeira atividade.'],
            links: [
              { label: 'Abrir o site do Ramo', href: officialLinks.ieeeUfjf, kind: 'official' },
              { label: 'Abrir o Instagram do Ramo', href: officialLinks.ieeeUfjfInstagram, kind: 'social' },
            ],
            sourceLabel: 'Ramo Estudantil IEEE UFJF',
            reviewedAt: CONTENT_REVIEW_DATE,
          },
        ],
      },
    ],
  },
  {
    slug: 'projeto',
    category: 'Sobre o projeto',
    eyebrow: 'Sobre o projeto',
    title: 'Um guia para começar a graduação com mais direção',
    summary:
      'O HELPIEEE organiza dúvidas recorrentes de calouros de Exatas e Engenharias e aponta para fontes oficiais.',
    audience: 'Calouros e demais estudantes de Exatas e Engenharias da UFJF.',
    scope:
      'Visão geral do HELPIEEE, sua missão e os caminhos disponíveis no guia.',
    keywords: ['HELPIEEE', 'EdSoc', 'IEEE UFJF', 'guia do calouro', 'fontes oficiais', 'projeto'],
    reviewedAt: CONTENT_REVIEW_DATE,
    sourceLabel: 'HELPIEEE — Education Society do Ramo Estudantil IEEE UFJF',
    legacySlugs: ['sobre-nos.html', 'index.html'],
    sections: [
      {
        id: 'missao',
        title: 'Por que o HELPIEEE existe',
        summary: 'Informação simples não deveria depender de sorte ou de encontrar o grupo certo.',
        paragraphs: [
          'O projeto nasceu como uma iniciativa da Education Society do Ramo Estudantil IEEE UFJF para reduzir a sensação de chegar à universidade sem saber por onde começar.',
          'O HELPIEEE reúne orientações para calouros de Exatas e Engenharias, respeitando as diferenças entre cursos, currículos e unidades.',
        ],
        items: [
          {
            title: 'Organizar a chegada',
            text: 'Reunir serviços, vocabulário e primeiros passos em caminhos curtos.',
            list: ['Menos procura dispersa.', 'Mais contexto.', 'Acesso rápido às fontes oficiais.'],
            links: [],
          },
          {
            title: 'Conectar a experiência universitária',
            text: 'Aproximar estudo, vida acadêmica, comunidade e oportunidades sem tratar essas áreas como mundos separados.',
            list: ['Rotina', 'Aprendizagem', 'Pertencimento', 'Exploração profissional'],
            links: [],
          },
        ],
      },
      {
        id: 'como-usar',
        title: 'Use o guia conforme a necessidade',
        summary: 'Não é preciso ler tudo em sequência nem decorar o site.',
        paragraphs: [
          'Comece pela dúvida mais urgente e volte quando uma nova etapa da graduação aparecer.',
        ],
        items: [
          {
            title: 'Chegada e vida acadêmica',
            text: 'Resolva o operacional, entenda sistemas, regras, calendário e currículo.',
            list: ['Primeiros passos', 'Serviços', 'SIGA', 'Prazos'],
            links: [
              { label: 'Abrir Primeiros passos', href: '/guia/chegada', kind: 'internal' },
              { label: 'Abrir Vida acadêmica', href: '/guia/faculdade', kind: 'internal' },
            ],
          },
          {
            title: 'Estudos, comunidade e oportunidades',
            text: 'Monte sua base de estudo e conheça pessoas, projetos e o Ramo Estudantil IEEE UFJF.',
            list: ['Materiais', 'Monitorias', 'Projetos', 'IEEE'],
            links: [
              { label: 'Abrir Materiais e estudos', href: '/guia/estudos', kind: 'internal' },
              { label: 'Abrir Comunidade e apoio', href: '/guia/comunidade', kind: 'internal' },
              { label: 'Abrir IEEE e oportunidades', href: '/guia/oportunidades', kind: 'internal' },
            ],
          },
        ],
      },
    ],
  },
];

export const guideCategories = guides.map(({ slug, category, eyebrow, title, summary }) => ({
  slug,
  category,
  eyebrow,
  title,
  summary,
}));

export const guidesBySlug = Object.fromEntries(guides.map((guide) => [guide.slug, guide]));

export const legacySlugMap = Object.freeze({
  'index.html': '/',
  'primeiros-passos.html': '/guia/chegada',
  'faculdade.html': '/guia/faculdade',
  'fluxo.html': '/fluxo',
  'materiais.html': '/guia/estudos',
  'materiais-algoritmos.html': '/guia/estudos#acervo-inicial',
  'materiais-calculo.html': '/guia/estudos#acervo-inicial',
  'materiais-geometria-analitica.html': '/guia/estudos#acervo-inicial',
  'materiais-introducao-engenharia-eletrica.html': '/guia/estudos#acervo-inicial',
  'materiais-laboratorio-ciencias-fisicas.html': '/guia/estudos#acervo-inicial',
  'materiais-quimica-fundamental.html': '/guia/estudos#acervo-inicial',
  'materiais-laboratorio-quimica.html': '/guia/estudos#acervo-inicial',
  'comunidade.html': '/guia/comunidade',
  'ieee.html': '/guia/oportunidades',
  'sobre-nos.html': '/guia/projeto',
});

export const editorialNotes = Object.freeze({
  reviewedAt: CONTENT_REVIEW_DATE,
  linkCheckAt: CONTENT_REVIEW_DATE,
  linkCheckNote:
    'Todos os links externos publicados neste arquivo responderam em 2026-09-03; isso não confirma atividade, vínculo ou processo seletivo atual de cada iniciativa.',
  scopeDecision:
    'O HELPIEEE atende calouros de Exatas e Engenharias e contextualiza conteúdos específicos sempre que necessário.',
  excludedTemporalContent: [
    {
      legacySlug: 'faculdade.html',
      reason:
        'O calendário acadêmico detalhado era de 2026.1 e foi retirado. O guia orienta a consultar o calendário vigente.',
    },
    {
      legacySlug: 'materiais-algoritmos.html',
      reason:
        'Plano, docentes, turmas, monitoria, datas e pesos de avaliações eram específicos de 2026.1 e não foram migrados.',
    },
    {
      legacySlug: 'materiais-calculo.html',
      reason:
        'Plano, coordenação, turmas, cronograma, datas e regras de avaliação eram específicos de 2026.1 e não foram migrados.',
    },
    {
      legacySlug: 'materiais-geometria-analitica.html',
      reason:
        'Turmas, coordenação, disponibilidade momentânea de listas, cronograma e avaliações de 2026.1 não foram migrados.',
    },
  ],
  publicationChecks: [
    'Confirmar, a cada semestre, calendário, procedimentos, responsáveis, locais e processos seletivos.',
    'Testar links externos e atualizar o reviewedAt somente depois da revisão editorial.',
    'Identificar conteúdos específicos de curso, unidade, campus ou modalidade.',
  ],
});

export function getGuideBySlug(slug) {
  return guidesBySlug[slug] ?? null;
}

export default guides;
