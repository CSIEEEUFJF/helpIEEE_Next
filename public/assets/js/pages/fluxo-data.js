window.FLOW_CURRICULA = {
  "sistemas-eletronicos": {
    title: "Fluxo Curricular — Eng. Elétrica: Sistemas Eletrônicos",
    subtitle: "UFJF · 69A · Clique nas disciplinas para acompanhar pré-requisitos e destravamentos",
    unitShort: "cr.",
    unitLong: "créditos",
    valueLabel: "Créditos",
    periods: [
      [
        ["DCC199", "Algoritmos", 6],
        ["FIS122", "Lab. Ciências Físicas", 2],
        ["MAT154", "Cálculo I", 4],
        ["MAT155", "Geometria Analítica", 4],
        ["QUI125", "Química Fundamental", 4],
        ["QUI126", "Lab. Química", 2],
        ["CEL064", "Introdução à Eng. Elétrica", 2]
      ],
      [
        ["EST028", "Introdução à Estatística", 4, "MAT154"],
        ["FIS073", "Física I", 4, "MAT154"],
        ["FIS077", "Lab. Física I", 2, "FIS122"],
        ["MAT156", "Cálculo II", 4, "MAT154|MAT155"],
        ["MAT158", "Álgebra Linear", 4, "MAT155"],
        ["ESA002", "Ecologia", 2, "QUI125"]
      ],
      [
        ["FIS074", "Física II", 4, "FIS073|MAT156"],
        ["MAT029", "Eq. Diferenciais I", 4, "MAT156"],
        ["MAT157", "Cálculo III", 4, "MAT156"],
        ["CEL032", "Circuitos Lógicos", 4, "DCC199"],
        ["ENE045", "Lab. Eletrotécnica", 2, "FIS077|QUI126"],
        ["ENE131", "Exp. Gráfica Eng. Elét.", 2]
      ],
      [
        ["DCC008", "Cálculo Numérico", 4, "DCC199|MAT156"],
        ["FIS075", "Física III", 4, "FIS074|MAT157"],
        ["FIS081", "Fenôm. Transporte", 4, "FIS074"],
        ["MAT030", "Eq. Diferenciais II", 4, "MAT029"],
        ["CEL033", "Circuitos Lineares I", 4, "MAT158|MAT029"],
        ["EPD097", "Engenharia e Sociedade", 2]
      ],
      [
        ["FIS076", "Física IV", 4, "FIS075"],
        ["CEL034", "Circuitos Lineares II", 4, "CEL033|MAT030"],
        ["CEL065", "Eletromagnetismo", 4, "FIS075|MAT030"],
        ["CEL066", "Sinais e Sistemas", 4, "MAT030"],
        ["CEL117", "Fund. Sist. Trifásicos", 2, "CEL033"],
        ["CEL040", "Eletrônica Analógica I", 4, "CEL033|MAT030"]
      ],
      [
        ["CEL035", "Eletrônica Digital", 4, "CEL032|CEL040"],
        ["CEL068", "Princ. Comunicações", 4, "CEL066|CEL040"],
        ["CEL101", "Eletromag. Aplicado", 4, "EST028|CEL065"],
        ["CEL112", "Controle Sist. Din. I", 4, "CEL034|CEL066"],
        ["ENE083", "Fund. Resist. Materiais", 2, "DCC008|FIS073"],
        ["ENE140", "Prog. para Engenharia", 2, "DCC199"],
        ["CEL115", "Eletrônica Analógica II", 4, "CEL034|CEL040"]
      ],
      [
        ["CEL113", "Controle Sist. Din. II", 2, "CEL112"],
        ["ENE125", "Fund. Conv. Energia", 4, "CEL117|CEL065"],
        ["CEL069", "Microproc. — Arq. e Prog.", 4, "CEL035"],
        ["CEL071", "Lab. Prototipagem", 2, "CEL035|ENE140"],
        ["CEL073", "Redes de Comunicação I", 4, "CEL115|CEL035"],
        ["CEL100", "Processam. Sinais I", 4, "CEL035|CEL066"],
        ["ENE143", "Prog. Avançada", 4, "CEL066|CEL035"]
      ],
      [
        ["CEL039", "Eletrônica de Potência I", 4, "ENE125|CEL040"],
        ["CEL078", "Instrumentação Eletrônica", 4, "CEL069"],
        ["CEL080", "Software Embarcado", 4, "CEL069"],
        ["CEL110", "Disp. Lógicos Programáveis", 4, "CEL069"],
        ["CEL118", "Projetos de C.I.", 4, "CEL115"]
      ],
      [
        ["ENE084", "Análise de Investimentos", 4, "MAT156"],
        ["CEL116", "Eletrônica de Potência II", 4, "CEL039|CEL040"],
        ["ENE082", "Instalações Elétricas", 4, "CEL117|ENE131"],
        ["ENE081", "Otimização", 4, "DCC008|CEL033"],
        ["EXT014", "Proj. Ext. em Sist. Eletr.", 4, "CEL069|CEL071"]
      ],
      [
        ["ENE064", "Estágio Eng. Elétrica", 6],
        ["TCC", "Trabalho de Conclusão", 6]
      ]
    ]
  },
  "sistemas-potencia": {
    title: "Fluxo Curricular — Eng. Elétrica: Sistemas de Potência",
    subtitle: "UFJF · Engenharia Elétrica — Sistemas de Potência",
    unitShort: "cr.",
    unitLong: "créditos",
    valueLabel: "Créditos",
    periods: [
      [
        ["DCC199", "Algoritmos", 4],
        ["DC5199", "Lab. de Programação", 2, "DCC199"],
        ["CEL064", "Introdução à Eng. Elétrica", 2],
        ["FIS122", "Lab. Int. às Ciências Físicas", 2],
        ["MAT154", "Cálculo I", 4],
        ["MAT155", "Geometria Analítica", 4],
        ["QUI125", "Química Fundamental", 4],
        ["QUI126", "Lab. de Química", 2]
      ],
      [
        ["ENE131", "Exp. Gráfica p/ Eng. Elétrica", 2],
        ["ESA002", "Ecologia e Pres. do Ambiente", 2, "QUI125"],
        ["EST028", "Introdução à Estatística", 4, "MAT154"],
        ["FIS073", "Física I", 4, "MAT154"],
        ["FIS077", "Lab. de Física I", 2, "FIS122"],
        ["MAT156", "Cálculo II", 4, "MAT154|MAT155"],
        ["MAT158", "Álgebra Linear", 4, "MAT155"]
      ],
      [
        ["CEL032", "Circuitos Lógicos", 4, "DCC199"],
        ["ENE045", "Lab. de Eletrotécnica", 2, "FIS077|QUI126"],
        ["ENE084", "An. de Inv. e Gest. de Obras", 4, "MAT156"],
        ["FIS074", "Física II", 4, "FIS073|MAT156"],
        ["MAT029", "Eq. Diferenciais I", 4, "MAT156"],
        ["MAT157", "Cálculo III", 4, "MAT156"]
      ],
      [
        ["CEL033", "Circuitos Lineares I", 4, "MAT029|MAT158"],
        ["DCC008", "Cálculo Numérico", 4, "DCC199|MAT156"],
        ["EPD097", "Engenharia e Sociedade", 2],
        ["FIS075", "Física III", 4, "FIS074|MAT157"],
        ["FIS081", "Fenômenos de Transporte", 4, "FIS074"],
        ["MAT030", "Eq. Diferenciais II", 4, "MAT029"]
      ],
      [
        ["CEL034", "Circuitos Lineares II", 4, "CEL033|MAT030"],
        ["CEL065", "Eletromagnetismo", 4, "FIS075|MAT030"],
        ["CEL066", "Sinais e Sistemas", 4, "MAT030"],
        ["ENE083", "Fund. Res. dos Materiais", 2, "DCC008|FIS073"],
        ["ENE127", "Ciência dos Materiais", 2, "CEL033"],
        ["ENE150", "Sist. Elét. Multifásicos", 4, "CEL033"]
      ],
      [
        ["CEL030", "Lab. de Circuitos Elétricos", 2, "CEL034"],
        ["CEL072", "Controle Sist. Dinâmicos I", 4, "CEL034|CEL066"],
        ["CEL114", "Eletrônica Analógica I", 4, "CEL033|MAT030"],
        ["ENE079", "Conversão Elétr. de Energia I", 4, "CEL065"],
        ["ENE081", "Métodos de Otimização", 4, "DCC008|CEL033"],
        ["ENE082", "Instalações Elétricas", 4, "ENE150|ENE131"]
      ],
      [
        ["CEL113", "Controle Sist. Dinâmicos II", 2, "CEL072"],
        ["ENE050", "Distribuição de En. Elétrica", 4, "ENE082"],
        ["ENE048", "Lab. de Máquinas Elétr. I", 2, "ENE079"],
        ["ENE054", "Transmissão de En. Elét.", 4, "ENE079"],
        ["ENE093", "Conversão Elet. de En. II", 4, "ENE079"],
        ["ENE094", "Instalaç. Elét. Industriais", 4, "ENE082"]
      ],
      [
        ["CEL035", "Eletrônica Digital", 4, "CEL032|CEL114"],
        ["CEL040", "Eletrônica de Potência I", 4, "CEL114|ENE079"],
        ["ENE049", "Lab. de Máquinas Elétr. II", 2, "ENE093"],
        ["ENE055", "Centrais Elétricas", 4, "ENE093"],
        ["ENE091", "Análise de SEP", 4, "ENE054"],
        ["ENE096", "Subestações e Equip.", 4, "ENE050"]
      ],
      [
        ["ENE057", "Estabilidade de SEP", 4, "ENE093"],
        ["ENE059", "Operação de SEP", 4, "ENE055"],
        ["ENE095", "Proteção de SEP", 4, "ENE091"],
        ["ENE097", "Transitórios Eletromag.", 4, "ENE096"]
      ],
      [
        ["ENE064", "TCC", 6]
      ]
    ]
  },
  "robotica-automacao": {
    title: "Fluxo Curricular — Eng. Elétrica: Robótica e Automação Industrial",
    subtitle: "UFJF · Engenharia Elétrica — Robótica e Automação Industrial · PPC 2023",
    unitShort: "cr.",
    unitLong: "créditos",
    valueLabel: "Créditos",
    periods: [
      [
        ["FIS122", "Lab. Int. Ciências Físicas", 2],
        ["QUI125", "Química Fundamental", 4],
        ["MAT154", "Cálculo I", 4],
        ["MAT155", "Geom. Analítica", 4],
        ["CEL064", "Int. Eng. Elétrica", 2],
        ["QUI126", "Lab. Química", 2]
      ],
      [
        ["DCC199 / DC5199", "Algoritmos", 6],
        ["FIS077", "Lab. Física I", 2, "FIS122"],
        ["MAT156", "Cálculo II", 4, "MAT154|MAT155"],
        ["MAT158", "Álgebra Linear", 4, "MAT155"],
        ["FIS073", "Física I", 4, "MAT154"]
      ],
      [
        ["FIS074", "Física II", 4, "FIS073|MAT156"],
        ["EST028", "Introdução à Estatística", 4, "MAT154"],
        ["MAT157", "Cálculo III", 4, "MAT156"],
        ["MAT029", "Eq. Diferenciais I", 4, "MAT156"],
        ["DCC008", "Cálculo Numérico", 4, "DCC199 / DC5199|MAT156"],
        ["ESA002", "Ecologia", 2, "QUI125"],
        ["ENE045", "Lab. Eletrotécnica", 2, "FIS077|QUI126"]
      ],
      [
        ["FIS075", "Física III", 4, "FIS074|MAT157"],
        ["FIS081", "Fenôm. Transporte", 4, "FIS074"],
        ["ENE131", "Expre. Gráfica", 2],
        ["MAT030", "Eq. Diferenciais II", 4, "MAT029"],
        ["CEL033", "Circuitos Lineares I", 4, "MAT029|MAT158"],
        ["EPD097", "Engenharia e Sociedade", 2]
      ],
      [
        ["CEL066", "Sinais e Sistemas", 4, "MAT030"],
        ["CEL032", "Circuitos Lógicos", 4, "DCC199 / DC5199"],
        ["CEL065", "Eletromagnetismo", 4, "FIS075|MAT030"],
        ["CEL114 / CE5144", "Eletrônica Analógica I", 4, "CEL033|MAT030"],
        ["CEL034", "Circuitos Lineares II", 4, "CEL033|MAT030"],
        ["CEL117", "Fund. Sist. Trifásicos", 2, "CEL033"]
      ],
      [
        ["ENE140 / EN5140", "Programação p/ Engenharia", 2, "DCC199 / DC5199"],
        ["ENE125", "Fund. de Conversão", 4, "CEL065"],
        ["ENE082", "Instalações Elétricas", 4, "CEL117|ENE131"],
        ["CEL112", "Controle Sist. Din. I", 4, "CEL034|CEL066"],
        ["CEL035", "Eletrônica Digital", 4, "CEL032|CEL114 / CE5144"],
        ["ENE081", "Otimização", 4, "CEL033|DCC008"]
      ],
      [
        ["CEL040", "Eletrônica de Potência", 4, "CEL114 / CE5144|ENE125"],
        ["ENE143 / EN5143", "Prog. Avanç. e Integ. Sist.", 4, "ENE140 / EN5140"],
        ["CEL069", "Microprocessadores", 4, "CEL035"],
        ["CEL113", "Controle Sist. Din. II", 2, "CEL112"],
        ["ENE141 / EN5141", "Autom. Industrial", 4, "CEL035"],
        ["ENE153", "Ciência dos Materiais", 2, "CEL033"],
        ["ENE094", "Instalações Elétr. Industriais", 4, "ENE082"]
      ],
      [
        ["ENE144 / EN5144", "Robótica Industrial I", 4, "CEL112|CEL035"],
        ["ENE112", "Controle Digital", 4, "CEL113"],
        ["ENE142 / EN5142", "Ciência de Dados", 4, "EST028|ENE143 / EN5143"],
        ["ENE139 / EN5139", "Automação Avançada", 4, "ENE141 / EN5141"],
        ["CEL030", "Lab. Circuitos", 2, "CEL034"],
        ["CEL080", "Software Embarcado", 4, "CEL069"],
        ["ENE146 / EN5146", "Desenv. Inter. Hum.-Máq.", 2, "ENE143 / EN5143"]
      ],
      [
        ["ENE145 / EN5145", "Robótica Industrial II", 4, "ENE144 / EN5144"],
        ["ENE147 / EN5147", "Int. Comput. Apl. Auto.", 4, "ENE139 / EN5139"],
        ["ENE148", "Trab. Concl. Curso I", 2],
        ["ENE084", "Análise de Investimento", 4, "MAT156"],
        ["CEL078", "Instrumentação Eletrônica", 4, "CEL069"]
      ],
      [
        ["EEE002", "Estágio Eng. Elétrica", 2],
        ["ENE149", "Trab. Concl. Curso II", 2, "ENE148"]
      ]
    ]
  },
  "energia": {
    title: "Fluxo Curricular — Eng. Elétrica: Energia",
    subtitle: "UFJF · Engenharia Elétrica — Energia · currículo 01.2023",
    unitShort: "h",
    unitLong: "horas",
    valueLabel: "Carga",
    periods: [
      [
        ["DCC199 + DC5199", "Algoritmos + Prática", 90],
        ["FIS122", "Lab. Int. Ciências Físicas", 30],
        ["MAT154", "Cálculo I", 60],
        ["MAT155", "Geometria Analítica", 60],
        ["CEL064", "Introdução à Eng. Elétrica", 30],
        ["QUI126", "Laboratório de Química", 30]
      ],
      [
        ["FIS073", "Física I", 60, "MAT154"],
        ["FIS077", "Laboratório Física I", 30, "FIS122"],
        ["MAT156", "Cálculo II", 60, "MAT154|MAT155"],
        ["MAT158", "Álgebra Linear", 60, "MAT155"],
        ["QUI125", "Química Fundamental", 60],
        ["QUI168", "Lab. Transf. Químicas", 30, "QUI126"]
      ],
      [
        ["FIS074", "Física II", 60, "FIS073|MAT156"],
        ["EST028", "Introdução à Estatística", 60, "MAT154"],
        ["MAT157", "Cálculo III", 60, "MAT156"],
        ["MAT029", "Eq. Diferenciais I", 60, "MAT156"],
        ["CEL032", "Circuitos Lógicos", 60, "DCC199 + DC5199"]
      ],
      [
        ["FIS075", "Física III", 60, "FIS074|MAT157"],
        ["DCC008", "Cálculo Numérico", 60, "DCC199 + DC5199|MAT156"],
        ["CEL033", "Circuitos Lineares I", 60, "MAT029|MAT158"],
        ["MAT030", "Eq. Diferenciais II", 60, "MAT029"],
        ["ENE045", "Lab. Eletrotécnica", 30, "FIS077|QUI126"],
        ["ENE131", "R. Gráfica e Des. Universal", 30]
      ],
      [
        ["CEL065", "Eletromagnetismo", 60, "FIS075|MAT030"],
        ["CEL114 + CE5144", "Eletrônica Analógica I", 60, "CEL033|MAT030"],
        ["CEL034", "Circuitos Lineares II", 60, "CEL033|MAT030"],
        ["ENE150", "Sist. Elét. Multifásicos", 60, "CEL033"],
        ["CEL066", "Sinais e Sistemas", 60, "MAT030"]
      ],
      [
        ["ENE083", "Fund. Res. Materiais", 30, "DCC008|FIS073"],
        ["FIS081", "Fenôm. Transporte", 60, "FIS074"],
        ["CEL030", "Laboratório Circuitos", 30, "CEL034"],
        ["ENE079", "Conversão I", 60, "ENE150|CEL065"],
        ["CEL112", "Controle Sist. Din. I", 60, "CEL034|CEL066"],
        ["ENE082", "Instalações Elétricas", 60, "ENE150|ENE131"]
      ],
      [
        ["CEL040", "Eletrônica de Potência", 60, "CEL114 + CE5144|ENE079"],
        ["CEL035", "Eletrônica Digital", 60, "CEL032|CEL114 + CE5144"],
        ["ENE048", "Lab. Máquinas I", 30, "ENE079"],
        ["ENE093", "Conversão II", 60, "ENE079"],
        ["CEL113", "Controle Sist. Din. II", 30, "CEL112"],
        ["ENE086", "Lab. Controle", 30, "CEL112"]
      ],
      [
        ["ENE153", "Ciência dos Materiais", 30, "CEL033"],
        ["ENE081", "Mét. Otimização", 60, "CEL033|DCC008"],
        ["ENE050", "Distribuição", 60, "ENE082"],
        ["ENE049", "Lab. Máquinas II", 30, "ENE093"],
        ["ENE084", "An. Inv. e Gestão Obras", 60, "MAT156"],
        ["ENE101", "Sist. Fotovoltaicos", 30, "CEL040"]
      ],
      [
        ["ENE087", "Fund. Sistemas Potência", 60, "ENE093"],
        ["ENE085", "Eficiência Energética", 60, "ENE082|ENE084|ENE093"],
        ["ENE151", "Subestações e Equipam.", 60, "ENE050"],
        ["ESA117", "Engenharia e Meio", 30, "QUI125"],
        ["ENE055", "Centrais Elétricas", 60, "FIS081|ENE093"]
      ],
      [
        ["ENE057", "Estabilidade SEP", 60, "ENE093"],
        ["ENE095", "Proteção", 60, "ENE087"],
        ["EPD097", "Engenharia e Sociedade", 30, "MAT029"],
        ["ENE103", "Sist. Geração Eólica", 30, "ENE050|ENE084"],
        ["ENE059", "Operação", 60, "CEL112|ENE055"]
      ],
      [
        ["ENE106", "Planejamento Energético", 30, "ENE081|ENE087"],
        ["ENE132", "Mercado Energia", 30, "ENE081"],
        ["ENE134", "Planejamento Expansão", 30, "ENE081|ENE087"],
        ["FLEX", "Flexibilização", 60],
        ["ELETIVAS", "Eletivas", 120]
      ],
      [
        ["ENE064", "TCC — Conclusão de Curso", 90, "CEL064"],
        ["EEE002", "Estágio Engenharia", 160, "CEL064"]
      ]
    ]
  },
  "engenharia-computacional": {
    title: "Fluxo Curricular — Engenharia Computacional",
    subtitle: "UFJF · currículo 2023 · clique nas disciplinas para acompanhar pré-requisitos e destravamentos",
    unitShort: "h",
    unitLong: "horas",
    valueLabel: "Carga",
    periods: [
      [
        ["DCC199", "Algoritmos (+ prática)", 90],
        ["FIS122", "Lab. Introd. Ciências Físicas", 30],
        ["ICE001", "Introd. às Ciências Exatas", 30],
        ["MAT154", "Cálculo I", 60],
        ["MAT155", "Geom. Analítica e Sist. Lineares", 60],
        ["QUI125", "Química Fundamental", 60],
        ["QUI126", "Lab. de Química", 30]
      ],
      [
        ["DCC200", "Algoritmos II (+ prática)", 90, "DCC199"],
        ["EST028", "Introdução à Estatística", 60, "MAT154"],
        ["FIS073", "Física I", 60],
        ["FIS077", "Lab. de Física I", 30, "FIS122"],
        ["MAC011", "Introd. à Eng. Computacional", 30],
        ["MAT156", "Cálculo II", 60, "MAT154|MAT155"],
        ["QUI168", "Lab. Transf. Químicas", 30, "QUI126"]
      ],
      [
        ["DCC013", "Estrutura de Dados", 60, "DCC200"],
        ["DCC025", "Orientação a Objetos", 60, "DCC200"],
        ["EST029", "Cálculo de Probabilidades I", 60, "MAT156"],
        ["FIS074", "Física II", 60, "FIS073|MAT156"],
        ["MAC036", "Rep. Gráfica e Modelagem Geom.", 30, "MAT155"],
        ["MAT157", "Cálculo III", 60, "MAT156"]
      ],
      [
        ["DCC008", "Cálculo Numérico", 60, "DCC199|MAT156"],
        ["DCC012", "Estrutura de Dados II", 60, "DCC013"],
        ["FIS075", "Física III", 60, "FIS074|MAT157"],
        ["MAC015", "Resistência dos Materiais", 60, "FIS073|MAT157"],
        ["MAT029", "Equações Diferenciais I", 60, "MAT156"],
        ["MAT158", "Álgebra Linear", 60, "MAT155"]
      ],
      [
        ["DCC059", "Teoria dos Grafos", 60, "DCC013"],
        ["DCC122", "Circuitos Digitais", 60],
        ["FIS081", "Fenômenos de Transporte", 60, "FIS074"],
        ["MAC019", "Fund. Mecânica das Estruturas", 60, "MAC015|DCC008"],
        ["MAC024", "Introd. à Modelagem Computacional", 60, "DCC008"],
        ["MAC026", "Introd. aos Métodos Discretos", 60, "MAT029|DCC008"]
      ],
      [
        ["DCC070", "Organização de Computadores", 60, "DCC122"],
        ["DCC117", "Modelagem de Sistemas", 60, "DCC025"],
        ["MAC005", "Mecânica dos Sólidos I", 60, "MAC019"],
        ["MAC008", "Introd. ao Método dos Elem. Finitos", 60, "MAC015"]
      ],
      [
        ["DCC001", "Análise e Projeto de Algoritmos", 60, "DCC013"],
        ["DCC060", "Banco de Dados", 60, "DCC117"],
        ["DCC062", "Sistemas Operacionais", 60, "DCC070"],
        ["MAC037", "Tóp. Avançados em Modelagem Geom.", 30, "MAC036"]
      ],
      [
        ["DCC042", "Redes de Computadores", 60, "DCC070"],
        ["DCC163", "Pesquisa Operacional", 60, "MAT158"],
        ["MAC034", "Mét. Comput. Aplic. em Eng. (+ prática)", 60, "MAC008|MAC026"],
        ["MAC035", "Trabalho Multidisciplinar", 30, "DCC008"]
      ],
      [
        ["DCC125", "Programação Paralela", 60, "DCC062"],
        ["DCC198", "Trab. Multidisciplinar Aplicado", 30, "MAC035"],
        ["ESA002", "Ecologia e Pres. do Ambiente", 30, "QUI125"],
        ["MAC018", "Estágio em Eng. Computacional", 170, "DCC059|DCC122|MAC019"],
        ["MAC038", "Trabalho Final de Curso I", 30]
      ],
      [
        ["MAC039", "Trabalho Final de Curso II", 30, "MAC038"]
      ]
    ]
  },
  "ciencia-computacao-integral": {
    title: "Fluxo Curricular — Ciência da Computação (Integral)",
    subtitle: "UFJF · currículo 2023 · recomendação de integralização em 8 períodos",
    unitShort: "h",
    unitLong: "horas",
    valueLabel: "Carga",
    periods: [
      [
        ["DCC199", "Algoritmos (+ prática)", 90],
        ["FIS122", "Lab. Introd. Ciências Físicas", 30],
        ["ICE001", "Introd. às Ciências Exatas", 30],
        ["MAT154", "Cálculo I", 60],
        ["MAT155", "Geom. Analítica e Sist. Lineares", 60],
        ["QUI125", "Química Fundamental", 60],
        ["QUI126", "Lab. de Química", 30]
      ],
      [
        ["DCC200", "Algoritmos II (+ prática)", 90, "DCC199"],
        ["EST028", "Introdução à Estatística", 60, "MAT154"],
        ["EXT099", "Introdução à Extensão", 60],
        ["FIS073", "Física I", 60, "MAT154"],
        ["FIS077", "Lab. de Física I", 30, "FIS122"],
        ["MAT156", "Cálculo II", 60, "MAT154|MAT155"],
        ["QUI168", "Lab. Transf. Químicas", 30, "QUI126"]
      ],
      [
        ["DCC013", "Estrutura de Dados", 60, "DCC200"],
        ["DCC025", "Orientação a Objetos", 60, "DCC200"],
        ["DCC122", "Circuitos Digitais", 60],
        ["DCC160", "Lógica e Fund. p/ Computação", 60],
        ["DCC202", "Desenvolvimento Web", 30],
        ["MAT143", "Introd. à Teoria dos Números", 60],
        ["MAT157", "Cálculo III", 60, "MAT156"]
      ],
      [
        ["DCC008", "Cálculo Numérico", 60, "DCC199|MAT156"],
        ["DCC012", "Estrutura de Dados II", 60, "DCC013"],
        ["DCC070", "Organização de Computadores", 60, "DCC122"],
        ["DCC117", "Modelagem de Sistemas", 60, "DCC025"],
        ["MAT029", "Equações Diferenciais I", 60, "MAT156"],
        ["MAT158", "Álgebra Linear", 60]
      ],
      [
        ["DCC059", "Teoria dos Grafos", 60, "DCC013"],
        ["DCC060", "Banco de Dados", 60, "DCC012|DCC117"],
        ["DCC061", "Engenharia de Software", 60, "DCC117"],
        ["DCC062", "Sistemas Operacionais", 60, "DCC070"],
        ["DCC065", "Computação Gráfica", 60, "DCC199|MAT158"],
        ["DCC203", "Metodologia Científica", 30, "DCC200"]
      ],
      [
        ["DCC019", "Linguagem de Programação", 60, "DCC012|DCC025"],
        ["DCC042", "Redes de Computadores", 60, "DCC070"],
        ["DCC063", "Ling. Formais e Autômatos", 60, "DCC013|MAT143"],
        ["DCC163", "Pesquisa Operacional", 60, "MAT158"],
        ["DCC174", "Interação Humano-Computador", 60, "DCC061"],
        ["EADDCC044", "Informática e Sociedade", 30]
      ],
      [
        ["DCC001", "Análise e Projeto de Algoritmos", 60, "DCC013|MAT143"],
        ["DCC014", "Inteligência Artificial", 60, "DCC059|DCC160|EST028"],
        ["DCC055", "Teoria da Computação", 60, "DCC063"],
        ["DCC075", "Segurança em Sist. de Computação", 60, "DCC042"],
        ["DCC204", "TCC I (exige DCC203 + 1560h)", 30, "DCC203"],
        ["EST029", "Cálculo de Probabilidades I", 60, "MAT156"]
      ],
      [
        ["DCC045", "Teoria dos Compiladores", 60, "DCC063"],
        ["DCC064", "Sistemas Distribuídos", 60, "DCC062"],
        ["DCC205", "Trab. de Conclusão de Curso II", 60, "DCC204"]
      ]
    ]
  },
  "ciencia-computacao-noturno": {
    title: "Fluxo Curricular — Ciência da Computação (Noturno)",
    subtitle: "UFJF · currículo 2023 · recomendação de integralização em 9 períodos",
    unitShort: "h",
    unitLong: "horas",
    valueLabel: "Carga",
    periods: [
      [
        ["MAT154", "Cálculo I", 60],
        ["MAT155", "Geom. Analítica e Sist. Lineares", 60],
        ["DCC160", "Lógica e Fund. p/ Computação", 60],
        ["DCC199", "Algoritmos", 90],
        ["DCC202", "Desenvolvimento Web", 30],
        ["DCC175", "Introd. à Ciência da Computação", 30]
      ],
      [
        ["MAT156", "Cálculo II", 60, "MAT154|MAT155"],
        ["FIS073", "Física I", 60, "MAT154"],
        ["FIS077", "Lab. de Física I", 30, "MAT154"],
        ["MAT158", "Álgebra Linear", 60, "MAT155"],
        ["DCC200", "Algoritmos II", 90, "DCC199"],
        ["EXT099", "Introdução à Extensão", 60]
      ],
      [
        ["MAT157", "Cálculo III", 60, "MAT156"],
        ["DCC025", "Orientação a Objetos", 60, "DCC200"],
        ["DCC122", "Circuitos Digitais", 60],
        ["DCC013", "Estrutura de Dados", 60, "DCC200"],
        ["MAT143", "Introd. à Teoria dos Números", 60]
      ],
      [
        ["DCC012", "Estrutura de Dados II", 60, "DCC013"],
        ["EST028", "Introdução à Estatística", 60, "MAT154"],
        ["DCC070", "Organização de Computadores", 60, "DCC122"],
        ["DCC117", "Modelagem de Sistemas", 60, "DCC025"],
        ["MAT029", "Equações Diferenciais I", 60, "MAT156"]
      ],
      [
        ["DCC059", "Teoria dos Grafos", 60, "DCC013"],
        ["DCC060", "Banco de Dados", 60, "DCC012|DCC117"],
        ["DCC061", "Engenharia de Software", 60, "DCC117"],
        ["DCC062", "Sistemas Operacionais", 60, "DCC070"],
        ["DCC203", "Metodologia Científica", 30, "DCC200"],
        ["EADDCC044", "Informática e Sociedade", 30]
      ],
      [
        ["DCC163", "Pesquisa Operacional", 60, "MAT158"],
        ["DCC063", "Ling. Formais e Autômatos", 60, "DCC013|DCC160|MAT143"],
        ["DCC042", "Redes de Computadores", 60, "DCC070"],
        ["DCC019", "Linguagem de Programação", 60, "DCC012|DCC025"],
        ["DCC008", "Cálculo Numérico", 60, "DCC199|MAT156"]
      ],
      [
        ["DCC001", "Análise e Projeto de Algoritmos", 60, "DCC059|MAT143"],
        ["DCC055", "Teoria da Computação", 60, "DCC063"],
        ["DCC065", "Computação Gráfica", 60, "DCC199|MAT158"],
        ["DCC014", "Inteligência Artificial", 60, "DCC059|DCC160"],
        ["EST029", "Cálculo de Probabilidades I", 60, "EST028|MAT156"]
      ],
      [
        ["DCC204", "TCC I (exige DCC203 + 1560h)", 30, "DCC203"],
        ["DCC045", "Teoria dos Compiladores", 60, "DCC063"],
        ["DCC174", "Interação Humano-Computador", 60, "DCC061"],
        ["DCC064", "Sistemas Distribuídos", 60, "DCC062"]
      ],
      [
        ["DCC075", "Segurança em Sist. de Computação", 60, "DCC042|MAT143"],
        ["DCC205", "Trab. de Conclusão de Curso II", 60, "DCC204"]
      ]
    ]
  }
};
