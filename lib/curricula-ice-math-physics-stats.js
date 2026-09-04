const parsePeriods = (source) => {
  const periods = [];
  let currentPeriod;

  for (const rawLine of source.trim().split('\n')) {
    const line = rawLine.trim();
    if (!line) continue;

    if (/^#\s+\d+$/.test(line)) {
      currentPeriod = [];
      periods.push(currentPeriod);
      continue;
    }

    const [code, name, hours, requirements = '', corequirements = ''] = line.split('|');
    const discipline = [code, name, Number(hours)];
    if (requirements || corequirements) {
      discipline.push(requirements.replaceAll(',', '|'));
    }
    if (corequirements) {
      discipline.push(corequirements.replaceAll(',', '|'));
    }
    currentPeriod.push(discipline);
  }

  return periods;
};

const iceCurriculum = (metadata, source) => ({
  group: 'Cursos do ICE',
  unitShort: 'h',
  unitLong: 'horas',
  valueLabel: 'Carga horária',
  ...metadata,
  periods: parsePeriods(source),
});

export const ICE_MATH_PHYSICS_STATS_CURRICULA = {
  estatistica: iceCurriculum(
    {
      title: 'Fluxo Curricular — Estatística (Diurno)',
      subtitle: 'UFJF · bacharelado diurno (integral) · currículo 22023 · ingressantes a partir de 2024',
      sourceUrl: 'https://www2.ufjf.br/cursoestatistica/curso/5-grade-ppc-2/grade-ppc-2024/',
    },
    `
# 1
EST063|Introdução às Ciências Estatísticas|30|
MAT154|Cálculo I|60|
MAT155|Geometria Analítica e Sistemas Lineares|60|
DCC199|Algoritmos|90|
QUI125|Química Fundamental I|60|
QUI126|Laboratório de Química|30|
FIS122|Laboratório de Introdução às Ciências Físicas|30|
# 2
EST028|Introdução à Estatística|60|
MAT156|Cálculo II|60|MAT154,MAT155
DCC200|Algoritmos II|90|DCC199
FIS073|Física I|60|MAT154
FIS077|Laboratório de Física I|30|FIS122
QUI168|Laboratório de Transformações Químicas|30|QUI126
# 3
EST029|Cálculo de Probabilidades I|60|MAT156
EST030|Análise Exploratória de Dados|60|EST028
EST064|Laboratório de Estatística|30|EST028
MAT157|Cálculo III|60|MAT156
MAT158|Álgebra Linear|60|MAT155
ELETIVA-P3|Disciplina eletiva|60|
# 4
EST076|Cálculo de Probabilidades II|60|EST029,MAT157,MAT158
EST065|Estatística Computacional I|60|EST030,EST064,DCC199
DCC008|Cálculo Numérico|60|DCC199,MAT154,MAT155
EST077|Inferência Estatística Paramétrica I|60|EST029,MAT157
OPT-P4|Opcional/Complementar|60|
ELETIVA-P4|Disciplina eletiva|60|
# 5
EST020|Processos Estocásticos|60|EST076
EST066|Estatística Computacional II|60|EST065,EST029,DCC200
EST053|Inferência Estatística Paramétrica II|60|EST077,EST076
EST047|Estatística Bayesiana|60|EST076,EST065
OPT-P5|Opcional/Complementar|60|
EXT-P5|Atividade extensionista|60|
# 6
EST078|Amostragem I|60|EST077,EST066
EST074|Análise de Regressão|60|EST053,EST066,MAT158
EST073|Análise Multivariada|60|EST053,MAT158
EST037|Inferência Estatística Não Paramétrica|60|EST053
ELETIVA-P6|Disciplina eletiva|60|
OPT-P6|Opcional/Complementar|60|
# 7
EST079|Amostragem II|60|EST053,EST078
EST081|Controle Estatístico de Qualidade|60|EST053,EST078
EST082|Modelos Lineares Generalizados|60|EST073,EST074
EST080|Planejamento de Experimentos|60|EST074,EST078
ELETIVA-P7|Disciplina eletiva|60|
OPT-P7|Opcional/Complementar|60|
# 8
EST040|Análise e Previsão de Séries Temporais|60|EST074
EST075|Análise de Dados Categóricos|60|EST053
EXT120|Práticas em Estatística I|90|
ELETIVA-P8|Disciplina eletiva|60|
EXT-P8|Atividade extensionista|60|
# 9
EST084|Monografia em Estatística|120|EST040,EST080,EST081,EST082
EXT121|Práticas em Estatística II|90|
`,
  ),

  'fisica-bacharelado-diurno': iceCurriculum(
    {
      title: 'Fluxo Curricular — Física — Bacharelado (Diurno/Integral)',
      subtitle: 'UFJF · currículo 22023 · ingressantes a partir de 2024',
      sourceUrl: 'https://www2.ufjf.br/fisdiurno/curso/curriculos-ativos/curriculos-ativos-bacharelado/',
    },
    `
# 1
DCC199|Algoritmos|60||DC5199
DC5199|Algoritmos - Prática|30||DCC199
FIS085|Introdução à Física|30|
FIS122|Laboratório de Introdução às Ciências Físicas|30|
MAT154|Cálculo I|60|
MAT155|Geometria Analítica e Sistemas Lineares|60|
QUI125|Química Fundamental|60|
QUI126|Laboratório de Química|30|
# 2
EST028|Introdução à Estatística|60|MAT154
FIS073|Física I|60|MAT154
FIS077|Laboratório de Física I|30|FIS122
FIS108|Complementos de Física I|30|MAT154
MAT156|Cálculo II|60|MAT155,MAT154
MAT158|Álgebra Linear|60|MAT155
QUI162|Laboratório de Estrutura e Transformações|30|QUI126
# 3
FIS074|Física II|60|MAT156,FIS073
FIS078|Laboratório de Física II|30|FIS077,MAT156,FIS073
MAT029|Equações Diferenciais I|60|MAT156
MAT157|Cálculo III|60|MAT156
OPT-P3|Optativa|60|
EXT-P3|Atividade de extensão|60|
# 4
DCC008|Cálculo Numérico|60|MAT156,DCC199
FIS053|Física Matemática I|60|MAT156,FIS073,MAT158
FIS075|Física III|60|FIS074,MAT157
FIS079|Laboratório de Física III|30|FIS078,FIS074,MAT157
FIS110|Complementos de Física III|30|FIS074
OPT-P4|Optativa|60|
EXT-P4|Atividade de extensão|60|
# 5
EADFIS020|Termodinâmica|60|FIS074
FIS040|Mecânica Clássica I|60|FIS053,MAT157
FIS054|Física Matemática II|60|MAT029,FIS053
FIS076|Física IV|60|FIS075
FIS080|Laboratório de Física IV|30|FIS079,FIS075
ELETIVA-P5|Eletiva|60|
EXT-P5|Atividade de extensão|60|
# 6
FIS098|Física Moderna|60|MAT029,FIS075
FIS033|Teoria Eletromagnética I|60|FIS053,FIS075
FIS041|Mecânica Clássica II|60|FIS040
FIS100|Laboratório de Física Moderna|60|FIS076
FIS120|Física Computacional|60|MAT029,DCC008
ELETIVA-P6|Eletiva|60|
EXT-P6|Atividade de extensão|60|
# 7
FIS031|Mecânica Quântica I|60|FIS054,FIS098
FIS034|Teoria Eletromagnética II|60|FIS033
FIS133|Trabalho de Conclusão de Curso I|60|FIS041,FIS098
ELETIVA-AREA-P7|Eletiva da área|60|
EXT-P7|Atividade de extensão|60|
# 8
FIS032|Mecânica Quântica II|60|FIS031
FIS051|Evolução da Física|60|FIS080,MAT029
FIS069|Física Estatística|60|FIS031
FIS134|Trabalho de Conclusão de Curso II|60|FIS133
ELETIVA-AREA-P8|Eletiva da área|60|
OPT-P8|Optativa|60|
`,
  ),

  'fisica-licenciatura-diurno': iceCurriculum(
    {
      title: 'Fluxo Curricular — Física — Licenciatura (Diurno/Integral)',
      subtitle: 'UFJF · currículo 22023 · ingressantes a partir de 2024',
      sourceUrl: 'https://www2.ufjf.br/fisdiurno/curso/curriculos-ativos/curriculos-ativos-licenciatura/',
    },
    `
# 1
DCC199|Algoritmos|60||DC5199
DC5199|Algoritmos - Prática|30||DCC199
FIS085|Introdução à Física|30|
FIS122|Laboratório de Introdução às Ciências Físicas|30|
MAT154|Cálculo I|60|
MAT155|Geometria Analítica e Sistemas Lineares|60|
QUI125|Química Fundamental|60|
QUI126|Laboratório de Química|30|
# 2
EST028|Introdução à Estatística|60|MAT154
FIS073|Física I|60|MAT154
FIS077|Laboratório de Física I|30|FIS122
FIS108|Complementos de Física I|30|MAT154
MAT156|Cálculo II|60|MAT155,MAT154
MAT158|Álgebra Linear|60|MAT155
QUI162|Laboratório de Estrutura e Transformações|30|QUI126
# 3
EDU174|Prática Escolar em Saberes Físicos Escolares|30|
FIS074|Física II|60|MAT156,FIS073
FIS078|Laboratório de Física II|30|FIS077,MAT156,FIS073
MAT157|Cálculo III|60|MAT156
MTE179|Saberes Físicos Escolares|60|
EDU034|Estado, Sociedade e Educação|60|
OPT-P3|Optativa|60|
EXT-P3|Atividade de extensão|60|
# 4
EDU135|Metodologia do Ensino de Física|60|MTE179
EDU366|Políticas Públicas e Gestão da Educação com Prática Educativa|90|
ED5366|Políticas Públicas e Gestão da Educação com Prática Educativa - Prática|0|
FIS075|Física III|60|FIS074,MAT157
FIS079|Laboratório de Física III|30|
FIS110|Complementos de Física III|30|FIS074
MAT029|Equações Diferenciais I|60|MAT156
OPT-P4|Optativa|60|
# 5
EADFIS015|Mecânica|60|MAT029,MAT157
EADFIS020|Termodinâmica|60|FIS074
EDU175|Ensino de Física na Escola Básica I|30|EDU135,FIS075
EDU403|Prática em Ensino de Física na Escola Básica I|60|
FIS076|Física IV|60|FIS075
FIS080|Laboratório de Física IV|30|FIS075,FIS079
FIS114|Física Prática I|30|FIS075,EDU135
PEO039|Processo Ensino Aprendizagem|60|
EXT-P5|Atividade de extensão|30|
# 6
EADFIS022|Eletromagnetismo|60|FIS075,MAT029
EADFIS031|História da Física I|60|FIS075
EDU177|Ensino de Física na Escola Básica II|30|EDU175
EDU404|Prática em Ensino de Física na Escola Básica II|60|
FIS098|Física Moderna|60|MAT029,FIS075
FIS100|Laboratório de Física Moderna|60|FIS076
FIS115|Física Prática II|30|FIS114
EXT-P6|Atividade de extensão|30|
# 7
EADFIS032|História da Física II|60|EADFIS031
EDU054|Questões Filosóficas Aplicadas à Educação|60|
EDU203|Reflexões sobre a Atuação no Espaço Escolar I - Ensino de Física|60|EDU135,MTE179
EDU204|Estágio Supervisionado no Ensino de Física I|140|EDU135,MTE179
FIS043|Estrutura da Matéria I|60|FIS098
FIS116|Física Prática III|30|FIS115
FIS118|Instrumentação para o Ensino de Física I|60|FIS076
# 8
EDU205|Reflexões sobre a Atuação no Espaço Escolar II - Ensino de Física|60|EDU204
EDU206|Estágio Supervisionado no Ensino de Física II|140|EDU204
FIS117|Física Prática IV|30|FIS116
FIS119|Instrumentação para o Ensino de Física II|60|FIS118
FIS121|Estrutura da Matéria II|30|FIS043
UNI015|Libras Instrumental I|60|
OPT-P8|Optativa|60|
`,
  ),

  'fisica-licenciatura-noturno': iceCurriculum(
    {
      title: 'Fluxo Curricular — Física — Licenciatura (Noturno)',
      subtitle: 'UFJF · noturno · currículo 22011',
      sourceUrl: 'https://www2.ufjf.br/fisnoturno/o-curso/curriculos-ativos/?page=grade-curricular&codCurso=81A&codCurriculo=22011',
    },
    `
# 1
DCC119|Algoritmos|60|
DCC120|Laboratório de Programação|30|
FIS085|Introdução à Física|30|
ICE002|Laboratório de Ciências|60|
MAT154|Cálculo I|60|
MAT155|Geometria Analítica e Sistemas Lineares|60|
# 2
FIS073|Física I|60|MAT154
FIS077|Laboratório de Física I|30|
FIS108|Complementos de Física I|30|
MAT156|Cálculo II|60|MAT155,MAT154
MAT158|Álgebra Linear|60|MAT155
QUI125|Química Fundamental|60|
# 3
EDU174|Prática Escolar em Saberes Físicos Escolares|30|
FIS074|Física II|60|MAT156,FIS073
FIS078|Laboratório de Física II|30|FIS077,MAT156,FIS073
FIS109|Complementos de Física II|30|FIS073
MAT157|Cálculo III|60|MAT156
MTE179|Saberes Físicos Escolares|60|
QUI126|Laboratório de Química|30|
# 4
ADE103|Políticas Públicas e Gestão do Espaço Escolar|60|
EDU135|Metodologia do Ensino de Física|60|MTE179
EDU147|Prática Escolar em Políticas Públicas e Gestão do Espaço Escolar|30|
FIS075|Física III|60|FIS074,MAT157
FIS110|Complementos de Física III|30|FIS074
MAT029|Equações Diferenciais I|60|MAT156
# 5
EDU175|Ensino de Física na Escola Básica I|30|EDU135,FIS073
EDU176|Prática em Ensino de Física na Escola Básica I|60|EDU135,FIS073
FIS053|Física Matemática I|60|MAT156,FIS073,MAT158
FIS111|Laboratório de Eletricidade e Eletrônica|30|FIS078,FIS074,MAT157
FIS112|Óptica e Laser|60|FIS043,FIS075
PEO039|Processo Ensino Aprendizagem|60|
# 6
EDU034|Estado, Sociedade e Educação|60|
EDU177|Ensino de Física na Escola Básica II|30|EDU175,FIS074
EDU178|Prática em Ensino de Física na Escola Básica II|60|EDU175,FIS074
FIS040|Mecânica Clássica I|60|FIS053,MAT157
FIS052|Termodinâmica|60|FIS074
FIS113|Laboratório de Óptica e Laser|30|FIS075,FIS111
# 7
EDU179|Estágio Supervisionado em Ensino de Física I|70|EDU177,FIS112
EDU180|Reflexões sobre a Atuação no Espaço Escolar - Área de Física I|30|EDU177,FIS112
EST029|Cálculo de Probabilidades I|60|MAT156
FIS033|Teoria Eletromagnética I|60|FIS053,FIS075
FIS098|Física Moderna|60|MAT029,FIS075
FIS114|Física Prática I|30|FIS073,EDU135
# 8
DCC008|Cálculo Numérico|60|MAT155,MAT154,DCC119
EDU181|Estágio Supervisionado em Ensino de Física II|70|EDU179
EDU182|Reflexões sobre a Atuação no Espaço Escolar - Área de Física II|30|EDU180
FIS043|Estrutura da Matéria I|60|FIS098
FIS100|Laboratório de Física Moderna|60|FIS098
FIS115|Física Prática II|30|FIS114,FIS074
# 9
EDU054|Questões Filosóficas Aplicadas à Educação|60|
EDU183|Estágio Supervisionado em Ensino de Física III|70|EDU181
EDU184|Reflexões sobre a Atuação no Espaço Escolar - Área de Física III|30|EDU182
FIS116|Física Prática III|30|FIS075,FIS115
FIS118|Instrumentação para o Ensino de Física I|60|EDU135,FIS112
FIS121|Estrutura da Matéria II|30|FIS043
# 10
EDU088|Língua Brasileira de Sinais (LIBRAS)|60|
EDU185|Estágio Supervisionado em Ensino de Física IV|70|EDU183
EDU186|Reflexões sobre a Atuação no Espaço Escolar - Área de Física IV|30|EDU184
FIS051|Evolução da Física|60|FIS075
FIS117|Física Prática IV|30|FIS112,FIS116
FIS119|Instrumentação para o Ensino de Física II|60|FIS118
`,
  ),

  'matematica-bacharelado-diurno': iceCurriculum(
    {
      title: 'Fluxo Curricular — Matemática — Bacharelado (Diurno/Integral)',
      subtitle: 'UFJF · matriz 1.2024',
      sourceUrl: 'https://www2.ufjf.br/matematica/wp-content/uploads/sites/393/2024/03/grade-bach-12024.pdf',
    },
    `
# 1
MAT154|Cálculo I|60|
MAT155|Geometria Analítica e Sistemas Lineares|60|
QUI125|Química Fundamental|60|
DCC199|Algoritmos e Algoritmos - Prática|90|
FIS122|Laboratório de Introdução às Ciências Físicas|30|
QUI126|Laboratório de Química|30|
ICE001|Introdução às Ciências Exatas|30|
# 2
MAT156|Cálculo II|60|MAT154,MAT155
FIS073|Física I|60|MAT154
FIS077|Laboratório de Física I|30|FIS122
QUI168|Laboratório de Transformações Químicas|30|QUI126
EST028|Introdução à Estatística|60|MAT154
MAT133|Fundamentos de Matemática Elementar|60|
# 3
MAT157|Cálculo III|60|MAT156
FIS074|Física II|60|FIS073,MAT156
MAT143|Introdução à Teoria dos Números|60|
MAT144|Matemática Discreta|60|
# 4
MAT029|Equações Diferenciais I|60|MAT156
FIS075|Física III|60|FIS074,MAT157
DCC008|Cálculo Numérico|60|MAT156
MAT049|Álgebra Linear II|60|MAT155
MAT147|Análise I|60|MAT133,MAT156
# 5
MAT030|Equações Diferenciais II|60|MAT029
MAT031|Introdução às Variáveis Complexas|60|MAT029
MAT059|Álgebra Linear III|60|MAT049
MAT152|Análise II|60|MAT147
# 6
MAT044|História da Matemática|60|
MAT024|Álgebra III|60|MAT143
MAT153|Análise III|60|MAT049,MAT152,MAT157
MAT167|Espaços Métricos|60|MAT152
# 7
MAT025|Álgebra IV|60|MAT024
MAT045|Elementos de Geometria Diferencial|60|MAT153
MAT184|Trabalho de Conclusão de Curso I|60|
ELETIVA-P7|Disciplina eletiva|60|
# 8
MAT185|Trabalho de Conclusão de Curso II|60|
ELETIVA-P8|Disciplina eletiva|60|
`,
  ),

  'matematica-licenciatura-diurno': iceCurriculum(
    {
      title: 'Fluxo Curricular — Matemática — Licenciatura (Diurno/Integral)',
      subtitle: 'UFJF · matriz 2024.1',
      sourceUrl: 'https://www2.ufjf.br/matematica/wp-content/uploads/sites/393/2025/02/GRADE-CURR-LICENCIATURA-2024.pdf',
    },
    `
# 1
MAT154|Cálculo I|60|
MAT155|Geometria Analítica e Sistemas Lineares|60|
QUI125|Química Fundamental|60|
DCC199|Algoritmos|60||DC5199
DC5199|Algoritmos - Prática|30||DCC199
FIS122|Laboratório de Introdução às Ciências Físicas|30|
QUI126|Laboratório de Química|30|
ICE001|Introdução às Ciências Exatas|30|
# 2
MAT156|Cálculo II|60|MAT154,MAT155
FIS073|Física I|60|MAT154
FIS077|Laboratório de Física I|30|FIS122
QUI168|Laboratório de Transformações Químicas|30|QUI126
EST028|Introdução à Estatística|60|MAT154
MAT133|Fundamentos de Matemática Elementar|60|
# 3
MAT157|Cálculo III|60|MAT156
FIS074|Física II|60|FIS073,MAT156
MAT143|Introdução à Teoria dos Números|60|
EDU306|Saberes Matemáticos na Escola|60|
EDU307|Prática Escolar em Saberes Matemáticos na Escola|30|
EDU034|Estado, Sociedade e Educação|60|
# 4
MAT029|Equações Diferenciais I|60|MAT156
MAT158|Álgebra Linear|60|MAT155
MAT122|Geometria Plana|60|
EADMAT022|Informática no Ensino de Matemática|75|
EDU308|Metodologia para o Ensino da Matemática|60|EDU306,EDU307
EDU366|Políticas Públicas e Gestão da Educação com Prática Educativa|60||ED5366
ED5366|Políticas Públicas e Gestão da Educação com Prática Educativa - Prática|30||EDU366
# 5
MAT161|Introdução à Análise Matemática|60|MAT157
MAT164|Trigonometria|60|
MAT123|Geometria Espacial|60|MAT122
PEO039|Processo Ensino Aprendizagem|60|
EXT188|Ensino de Matemática na Educação Básica I|30|EDU308
EXT189|Prática Escolar em Ensino de Matemática na Educação Básica I|60|EDU308
# 6
MAT162|Funções do Plano Complexo|60|MAT156
MAT163|Exponenciais e Logaritmos|60|
MAT013|Matemática Financeira|60|
MAT166|Tópicos de Geometria|60|MAT122
EXT190|Ensino de Matemática na Educação Básica II|30|EXT188,EXT189
EXT191|Prática Escolar em Ensino de Matemática na Educação Básica II|60|EXT188,EXT189
MAT148|Matemática Escolar I|60|
# 7
MAT119|Estruturas Algébricas|60|MAT143
MAT144|Matemática Discreta|60|
EDU054|Questões Filosóficas Aplicadas à Educação|60|
MAT149|Matemática Escolar II|60|MAT148
ELETIVA-P7|Disciplina eletiva|60|
EDU313|Reflexões sobre a Atuação no Espaço Escolar - Ensino de Matemática I - Diurno|60|
EDU314|Estágio Supervisionado em Ensino de Matemática I - Diurno|140|
# 8
MAT044|História da Matemática|60|
LEM184|LIBRAS e Educação para Surdos|60|
MAT160|Matemática Escolar III|60|MAT149
ELETIVA-P8|Disciplina eletiva|60|
EDU315|Reflexões sobre a Atuação no Espaço Escolar - Ensino de Matemática II - Diurno|60|EDU313,EDU314
EDU316|Estágio Supervisionado em Ensino de Matemática II - Diurno|140|EDU313,EDU314
`,
  ),

  'matematica-licenciatura-noturno': iceCurriculum(
    {
      title: 'Fluxo Curricular — Matemática — Licenciatura (Noturno)',
      subtitle: 'UFJF · noturno · matriz oficial publicada (ano não informado pela fonte)',
      sourceUrl: 'https://www2.ufjf.br/matematica/curso/licenciatura-em-matematica-noturno/matriz-curricular-licenciatura-em-matematica-noturno/',
    },
    `
# 1
MAT154|Cálculo I|60|
MAT155|Geometria Analítica e Sistemas Lineares|60|
DCC119|Algoritmos|60|
DCC120|Laboratório de Programação|30|
MAT013|Matemática Financeira|60|
# 2
MAT156|Cálculo II|60|MAT154,MAT155
FIS073|Física I|60|
FIS077|Laboratório de Física I|30|
MAT133|Fundamentos de Matemática Elementar|60|
# 3
MAT157|Cálculo III|60|MAT156
FIS074|Física II|60|FIS073,MAT156
MAT143|Introdução à Teoria dos Números|60|
MTE181|Saberes Matemáticos Escolares|60|
EDU161|Prática Escolar em Saberes Matemáticos Escolares|30|
# 4
MAT029|Equações Diferenciais I|60|MAT156
MAT158|Álgebra Linear|60|MAT155
MAT165|Informática no Ensino de Matemática|60|
MTE183|Metodologia do Ensino da Matemática|60|
ADE103|Políticas Públicas e Gestão do Espaço Escolar|60|
EDU147|Prática Escolar em Políticas Públicas e Gestão do Espaço Escolar|30|
# 5
MAT161|Introdução à Análise Matemática|60|MAT157
MAT164|Trigonometria|60|
PEO039|Processo Ensino Aprendizagem|60|
EDU162|Ensino de Matemática na Escola Básica I|30|MTE183
EDU163|Prática Escolar em Ensino de Matemática na Escola Básica I|60|MTE183
EST029|Cálculo de Probabilidade|60|MAT156
# 6
MAT122|Geometria Plana|60|
MAT163|Exponenciais e Logaritmos|60|
MAT148|Matemática Escolar I|60|
EDU034|Estado, Sociedade e Educação|60|
EDU164|Ensino de Matemática na Escola Básica II|30|EDU162
EDU165|Prática Escolar em Ensino de Matemática na Escola Básica II|60|EDU162
# 7
MAT119|Estruturas Algébricas|60|MAT143
MAT149|Matemática Escolar II|60|MAT148
EDU054|Questões Filosóficas Aplicadas à Educação|60|MTE181
EDU167|Estágio Supervisionado no Ensino de Matemática I|70|EDU164
EDU166|Reflexões sobre a Atuação no Espaço Escolar I|30|EDU164
MAT123|Geometria Espacial|60|MAT122
# 8
MAT160|Matemática Escolar III|60|MAT149
EDU169|Estágio Supervisionado no Ensino de Matemática II|70|EDU167
EDU168|Reflexões sobre a Atuação no Espaço Escolar II|30|EDU166
MAT166|Tópicos de Geometria|60|MAT122
MAT162|Funções do Plano Complexo|60|MAT156
# 9
MAT144|Matemática Discreta|60|
EDU171|Estágio Supervisionado no Ensino de Matemática III|70|EDU169
EDU170|Reflexões sobre a Atuação no Espaço Escolar III|30|EDU168
# 10
EDU172|Reflexões sobre a Atuação no Espaço Escolar IV|30|EDU170
EDU173|Estágio Supervisionado no Ensino de Matemática IV|70|EDU171
MAT044|História da Matemática|60|
EDU088|LIBRAS|60|
`,
  ),
};

export default ICE_MATH_PHYSICS_STATS_CURRICULA;
