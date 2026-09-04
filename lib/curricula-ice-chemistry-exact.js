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

export const ICE_CHEMISTRY_EXACT_CURRICULA = {
  'ciencias-exatas': iceCurriculum(
    {
      title: 'Fluxo Curricular — Bacharelado em Ciências Exatas (Diurno)',
      subtitle: 'UFJF · currículo 12018 · formação interdisciplinar e acesso aos cursos de segundo ciclo',
      sourceUrl: 'https://www2.ufjf.br/cienciasexatas/wp-content/uploads/sites/591/2010/01/Estrutura-Curricular-2018-11.pdf',
    },
    `
# 1
MAT154|Cálculo I|60|
MAT155|Geometria Analítica e Sistemas Lineares|60|
QUI125|Química Fundamental|60|
DCC119|Algoritmos|60|
DCC120|Laboratório de Programação|30|
FIS122|Laboratório de Introdução às Ciências Físicas|30|
QUI126|Laboratório de Química|30|
ICE001|Introdução às Ciências Exatas|30|
# 2
MAT156|Cálculo II|60|MAT154,MAT155
FIS073|Física I|60|MAT154
FIS077|Laboratório de Física I|30|FIS122
QUI162|Laboratório de Estrutura e Transformações|30|QUI126
EST028|Introdução à Estatística|60|MAT154
ELE-P2|Disciplina eletiva|60|
OPT-P2|Disciplina optativa|60|
# 3
ELE-P3-1|Disciplina eletiva|60|
ELE-P3-2|Disciplina eletiva|60|
ELE-P3-3|Disciplina eletiva|60|
ELE-P3-4|Disciplina eletiva|60|
ELE-P3-5|Disciplina eletiva|60|
OPT-P3|Disciplina optativa|60|
# 4
ELE-P4-1|Disciplina eletiva|60|
ELE-P4-2|Disciplina eletiva|60|
ELE-P4-3|Disciplina eletiva|60|
ELE-P4-4|Disciplina eletiva|60|
ELE-P4-5|Disciplina eletiva|60|
OPT-P4|Disciplina optativa|60|
# 5
ELE-P5-1|Disciplina eletiva|60|
ELE-P5-2|Disciplina eletiva|60|
ELE-P5-3|Disciplina eletiva|60|
ELE-P5-4|Disciplina eletiva|60|
FLEX-P5|Flexibilização curricular|60|
CCE001|Trabalho de Conclusão do Curso de Ciências Exatas I|180|
# 6
ELE-P6-1|Disciplina eletiva|60|
ELE-P6-2|Disciplina eletiva|60|
ELE-P6-3|Disciplina eletiva|60|
OPT-P6|Disciplina optativa|60|
FLEX-P6|Flexibilização curricular|60|
CCE002|Trabalho de Conclusão do Curso de Ciências Exatas II|180|
`,
  ),

  'quimica-bacharelado-diurno': iceCurriculum(
    {
      title: 'Fluxo Curricular — Química — Bacharelado (Diurno/Integral)',
      subtitle: 'UFJF · currículo 12024 · 2.640 h em disciplinas obrigatórias',
      sourceUrl: 'https://www2.ufjf.br/quimicadiurno/wp-content/uploads/sites/223/2024/04/GB-24curr%C3%ADculo-1.2024.pdf',
    },
    `
# 1
DCC199|Algoritmos|60|
DC5199|Algoritmos - Prática|30|
MAT154|Cálculo I|60|
MAT155|Geometria Analítica e Sistemas Lineares|60|
EXT100|Introdução à Extensão Universitária|30|
QUI157|Introdução à Química|30|
FIS122|Laboratório de Introdução às Ciências Físicas|30|
QUI126|Laboratório de Química|30|
QUI125|Química Fundamental|60|
# 2
MAT156|Cálculo II|60|MAT154,MAT155
FIS073|Física I|60|MAT154
EST028|Introdução à Estatística|60|MAT154,MAT155
FIS077|Laboratório de Física I|30|FIS122
QUI204|Laboratório de Química Inorgânica|30|QUI125
QUI168|Laboratório de Transformações Químicas|30|QUI126
QUI206|Química Inorgânica|60|QUI125
QUI087|Química Orgânica I|60|QUI125
# 3
MAT157|Cálculo III|60|MAT156
FIS074|Física II|60|FIS073,MAT156
QUI189|Laboratório de Análises Qualitativas|30|QUI206
EXT101|Popularização das Ciências I|30|EXT100
QUI191|Química das Soluções|45|QUI206
QUI182|Química Orgânica Experimental I|60|QUI087
QUI079|Química Orgânica II|60|QUI087
# 4
MAT029|Equações Diferenciais I|60|MAT156
FIS075|Física III|60|FIS074,MAT157
QUI094|Introdução à Análise Química|30|QUI189,QUI191|QUI190
QUI190|Laboratório de Análises Volumétricas|30|QUI189,QUI191|QUI094
FIS111|Laboratório de Eletricidade e Eletrônica|30|FIS074,MAT157
QUI056|Laboratório de Termodinâmica Química|30|MAT156,QUI125|QUI130
EXT102|Popularização das Ciências II|60|EXT101
QUI130|Termodinâmica Química|60|MAT156,QUI125|QUI056
# 5
QUI131|Estrutura Atômica e Molecular|60|FIS073,QUI130
FIS076|Física IV|60|FIS075,FIS111
FIS080|Laboratório de Física IV|30|FIS075,FIS111
EXT103|Projeto de Extensão I|30|EXT100
QUI183|Química Orgânica Experimental II|60|QUI182
QUI009|Química Orgânica III|60|QUI079,QUI182
# 6
QUI128|Eletroquímica|45|QUI094,QUI130,QUI190|QUI110
QUI097|Equilíbrio e Cinética|60|QUI056,QUI130|QUI058
QUI110|Laboratório de Eletroquímica|30|QUI094,QUI130,QUI190|QUI128
QUI058|Laboratório de Equilíbrio e Cinética|30|QUI056,QUI130|QUI097
QUI092|Laboratório de Química de Coordenação|30|QUI131,QUI204|QUI091
QUI091|Química de Coordenação|60|QUI131,QUI206|QUI092
QUI017|Química Orgânica IV|60|QUI009
# 7
GEO173|Elementos de Mineralogia e Petrografia|45|QUI206
GE5173|Elementos de Mineralogia e Petrografia - Prática|15|
QUI129|Laboratório de Análise Instrumental|30|QUI110,QUI128|QUI093
QUI093|Métodos Instrumentais de Análise|60|QUI094,QUI190|QUI129
QUI132|Projetos em Química I|30|QUI009,QUI110,QUI130
BQU049|Química Biológica|45|QUI079
BQU549|Química Biológica - Prática|15|
# 8
QUI164|Laboratório de Química Ambiental|60|QUI129,QUI191
QUI064|Projetos em Química II|90|QUI132
QUI163|Química Ambiental|30|QUI191
QUI059|Química Quântica|60|QUI097,QUI131
QUI096|Tópicos em Química Inorgânica|60|QUI091
`,
  ),

  'quimica-licenciatura-diurno': iceCurriculum(
    {
      title: 'Fluxo Curricular — Química — Licenciatura (Diurno/Integral)',
      subtitle: 'UFJF · currículo 12024 · 3.420 h em oito períodos, incluindo 30 h de eletiva pedagógica e 200 h de flexibilização',
      sourceUrl: 'https://www2.ufjf.br/quimicadiurno/wp-content/uploads/sites/223/2024/04/GL-24curr%C3%ADculo-1.2024.pdf',
    },
    `
# 1
DCC199|Algoritmos|60|
DC5199|Algoritmos - Prática|30|
MAT154|Cálculo I|60|
MAT155|Geometria Analítica e Sistemas Lineares|60|
EXT100|Introdução à Extensão Universitária|30|
QUI157|Introdução à Química|30|
FIS122|Laboratório de Introdução às Ciências Físicas|30|
QUI126|Laboratório de Química|30|
QUI125|Química Fundamental|60|
# 2
MAT156|Cálculo II|60|MAT154
FIS073|Física I|60|MAT154
QUI207|Introdução à Educação Química|30|
EST028|Introdução à Estatística|60|MAT154
FIS077|Laboratório de Física I|30|FIS122
QUI204|Laboratório de Química Inorgânica|30|QUI125|QUI206
QUI168|Laboratório de Transformações Químicas|30|QUI126
QUI206|Química Inorgânica|60|QUI125|QUI204
QUI087|Química Orgânica I|60|
# 3
MAT157|Cálculo III|60|MAT156
EDU034|Estado, Sociedade e Educação|60|
EXT101|Popularização das Ciências I|30|EXT100
EDU148|Prática Escolar em Saberes Químicos Escolares|30||MTE177
QUI191|Química das Soluções|45|
QUI182|Química Orgânica Experimental I|60|QUI087
QUI079|Química Orgânica II|60|QUI087
MTE177|Saberes Químicos Escolares|60||EDU148
# 4
QUI174|Currículo e Planejamento no Ensino de Química|60|QUI125|QUI200
BQU063|Fundamentos de Bioquímica|60|QUI079
QUI094|Introdução à Análise Química|30|QUI191|QUI190
QUI190|Laboratório de Análises Volumétricas|30|QUI191|QUI094
MTE193|Metodologia do Ensino de Química|60|MTE177
EDU366|Políticas Públicas e Gestão da Educação com Prática Educativa|60|
ED5366|Políticas Públicas e Gestão da Educação com Prática Educativa - Prática|30|
EXT102|Popularização das Ciências II|60|EXT101
QUI200|Prática de Ensino de Transformações Químicas e Processos Produtivos|30||QUI174
# 5
EDU149|Ensino de Química na Escola Básica I|30|MTE193|EDU150
QUI203|Laboratório de Química Analítica Instrumental|30|QUI094,QUI190|QUI205
QUI134|Laboratório de Termodinâmica e Cinética|30|MAT156|QUI133
EDU150|Prática em Ensino de Química na Escola Básica I|60|MTE193|EDU149
PEO039|Processo Ensino Aprendizagem|60|
QUI205|Química Analítica Instrumental|45|QUI094,QUI190|QUI203
QUI183|Química Orgânica Experimental II|60|QUI079,QUI182
QUI133|Termodinâmica e Cinética|60|MAT156|QUI134
# 6
QUI185|Avaliação do Processo de Ensino e Aprendizagem de Química|30|QUI174
EDU151|Ensino de Química na Escola Básica II|30|EDU149,EDU150|EDU152
QUI197|Ensino de Química por Investigação|60|PEO039,QUI174|QUI199
QUI176|História da Química e Ensino|30|
QUI195|Prática de Ensino de Isomeria e Propriedades de Substâncias Orgânicas|30|QUI079,QUI174
QUI199|Prática de Ensino de Química por Investigação|15|PEO039,QUI174|QUI197
EDU152|Prática em Ensino de Química na Escola Básica II|60|EDU149,EDU150|EDU151
EDU054|Questões Filosóficas Aplicadas à Educação|60|
# 7
ELETIVA-PED-P7|Eletiva de dimensão pedagógica|30|
GEO173|Elementos de Mineralogia e Petrografia|45|QUI206
GE5173|Elementos de Mineralogia e Petrografia - Prática|15|
EDU200|Estágio Supervisionado no Ensino de Química I|140|EDU151,EDU152|EDU199
QUI131|Estrutura Atômica e Molecular|60|MAT156,QUI125|QUI201
QUI194|Prática de Ensino de Estequiometria e Misturas|30|QUI094,QUI174,QUI190
QUI201|Prática de Ensino de Termodinâmica e Estrutura da Matéria|30|QUI133,QUI174|QUI131
EXT103|Projeto de Extensão I|30|EXT100
EDU199|Reflexões sobre a Atuação no Espaço Escolar I - Ensino de Química|60|EDU151,EDU152|EDU200
# 8
EDU202|Estágio Supervisionado no Ensino de Química II|140|EDU199,EDU200|EDU201
QUI198|Interdisciplinaridade na Educação Básica|30|QUI174
QUI202|Introdução à Pesquisa no Ensino de Química|60|QUI174|QUI181
LEM184|Libras e Educação para Surdos|60|
QUI181|Prática de Introdução à Pesquisa no Ensino de Química|30|QUI174|QUI202
QUI163|Química Ambiental|30|QUI191
QUI184|Química, Saúde e Toxicologia|45|BQU063
EDU201|Reflexões sobre a Atuação no Espaço Escolar II - Ensino de Química|60|EDU199,EDU200|EDU202
FLEX-LIC-DIURNO|Flexibilização curricular (sem período definido)|200|
`,
  ),

  'quimica-licenciatura-noturno': iceCurriculum(
    {
      title: 'Fluxo Curricular — Química — Licenciatura (Noturno)',
      subtitle: 'UFJF · currículo 12023 · 3.010 h em dez períodos',
      sourceUrl: 'https://www2.ufjf.br/quimicanoturno/matriz-curricular-12023/',
    },
    `
# 1
QUI125|Química Fundamental|60|
QUI126|Laboratório de Química|30|
QUI138|Introdução à Educação Química|30|
EXT100|Introdução à Extensão Universitária|30|
MAT154|Cálculo I|60|
FIS122|Laboratório de Introdução às Ciências Físicas|30|
# 2
QUI087|Química Orgânica I|60|QUI125
QUI168|Laboratório de Transformações Químicas|30|QUI126
QUI206|Química Inorgânica|60|QUI125|QUI204
QUI204|Laboratório de Química Inorgânica|60|QUI125|QUI206
MAT155|Geometria Analítica e Sistemas Lineares|60|
FIS073|Física I|60|MAT154
# 3
QUI182|Química Orgânica Experimental I|60|QUI087
QUI191|Química das Soluções|45|QUI206
FIS077|Laboratório de Física I|30|FIS122
MTE177|Saberes Químicos Escolares|60||EDU148
EDU148|Prática Escolar em Saberes Químicos Escolares|30||MTE177
MAT156|Cálculo II|60|MAT154
# 4
QUI079|Química Orgânica II|60|QUI087
QUI094|Introdução à Análise Química|30|QUI191|QUI190
QUI190|Laboratório de Análises Volumétricas|30|QUI191|QUI094
EXT101|Popularização das Ciências I|30|EXT100
MAT157|Cálculo III|60|MAT156
MTE193|Metodologia do Ensino de Química|60|MTE177,EDU148
EDU366|Políticas Públicas e Gestão da Educação com Prática Educativa|60|
ED5366|Políticas Públicas e Gestão da Educação com Prática Educativa - Prática|30|
# 5
QUI183|Química Orgânica Experimental II|60|QUI079,QUI182
QUI133|Termodinâmica e Cinética|60|MAT156|QUI134
QUI134|Laboratório de Termodinâmica e Cinética|30|MAT156|QUI133
EXT102|Popularização das Ciências II|30|EXT101
PEO039|Processo Ensino e Aprendizagem|60|
EDU149|Ensino de Química na Escola Básica I|30|MTE193|EDU150
EDU150|Prática em Ensino de Química na Escola Básica I|60|MTE193|EDU149
# 6
QUI180|Prática de Ensino de Transformações Químicas e Processos Produtivos|30|QUI206|QUI174
QUI174|Currículo e Planejamento no Ensino de Química|60|QUI125,QUI138|QUI180
QUI205|Química Analítica Instrumental|45|QUI094,QUI190|QUI203
QUI203|Laboratório de Química Analítica Instrumental|30|QUI094,QUI190|QUI205
EDU034|Estado, Sociedade e Educação|60|
EDU151|Ensino de Química na Escola Básica II|30|EDU149,EDU150|EDU152
EDU152|Prática em Ensino de Química na Escola Básica II|60|EDU149,EDU150|EDU151
# 7
QUI188|Prática de Ensino de Estequiometria e Misturas|30|QUI094,QUI190,QUI174
QUI185|Avaliação do Processo de Ensino e Aprendizagem de Química|30|QUI174
QUI175|Ensino de Química por Investigação|60|PEO039,QUI174|QUI179
QUI179|Prática de Ensino de Química por Investigação|15|PEO039,QUI174|QUI175
BQU063|Fundamentos de Bioquímica|60|QUI079
GEO173|Elementos de Mineralogia e Petrografia|45|QUI206|GE5173
GE5173|Elementos de Mineralogia e Petrografia - Prática|15|QUI206|GEO173
EDU153|Estágio Supervisionado em Ensino de Química I|70|EDU151,EDU152|EDU154
EDU154|Reflexões sobre a Atuação no Espaço Escolar - Área de Química I|30|EDU151,EDU152|EDU153
# 8
QUI186|Prática de Ensino de Isomeria e Propriedades de Substâncias Orgânicas|30|QUI079,QUI174
QUI163|Química Ambiental|30|QUI191
QUI184|Química, Saúde e Toxicologia|45|BQU063
QUI176|História da Química e Ensino|30|
QUI177|Interdisciplinaridade na Educação Básica|30|QUI174
EDU155|Estágio Supervisionado em Ensino de Química II|70|EDU153,EDU154|EDU156
EDU156|Reflexões sobre a Atuação no Espaço Escolar - Área de Química II|30|EDU153,EDU154|EDU155
# 9
QUI131|Estrutura Atômica e Molecular|60|MAT156,QUI125|QUI187
QUI187|Prática de Ensino de Termodinâmica e Estrutura da Matéria|30|QUI133,QUI174|QUI131
EXT103|Projeto de Extensão I|30|EXT100
EDU054|Questões Filosóficas Aplicadas à Educação|60|
EDU157|Estágio Supervisionado em Ensino de Química III|70|EDU155,EDU156|EDU158
EDU158|Reflexões sobre a Atuação no Espaço Escolar - Área de Química III|30|EDU155,EDU156|EDU157
# 10
QUI178|Introdução à Pesquisa no Ensino de Química|60|QUI174|QUI181
QUI181|Prática de Introdução à Pesquisa no Ensino de Química|30|QUI174|QUI178
LEM184|Libras e Educação para Surdos|60|
EDU159|Estágio Supervisionado em Ensino de Química IV|70|EDU157,EDU158|EDU160
EDU160|Reflexões sobre a Atuação no Espaço Escolar - Área de Química IV|30|EDU157,EDU158|EDU159
`,
  ),
};

export default ICE_CHEMISTRY_EXACT_CURRICULA;
