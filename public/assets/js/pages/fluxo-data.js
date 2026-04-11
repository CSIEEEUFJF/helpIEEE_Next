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
  },
  "engenharia-civil": {
    title: "Fluxo Curricular — Engenharia Civil",
    subtitle: "UFJF · currículo 2023/3 · fluxo principal recomendado com estágio e projeto final",
    unitShort: "h",
    unitLong: "horas",
    valueLabel: "Carga",
    periods: [
      [
        ["MAT154", "Cálculo I", 60],
        ["MAT155", "Geom. Analítica e Sist. Lineares", 60],
        ["DCC199 / DC5199", "Algoritmos (+ prática)", 90],
        ["QUI125", "Química Fundamental", 60],
        ["QUI126", "Lab. de Química", 30],
        ["FIS122", "Lab. Introd. Ciências Físicas", 30],
        ["TRN082", "Introd. à Engenharia Civil", 30]
      ],
      [
        ["MAT156", "Cálculo II", 60, "MAT154|MAT155"],
        ["FIS073", "Física I", 60, "MAT154"],
        ["FIS077", "Lab. de Física I", 30, "FIS122"],
        ["EST028", "Introdução à Estatística", 60, "MAT154"],
        ["QUI168", "Lab. Transformações Químicas", 30, "QUI126"],
        ["PRT053", "Fund. de Representação Gráfica", 60],
        ["ESA117", "Engenharia e Meio Ambiente", 30, "QUI125"],
        ["TRN083", "Contexto e Prática em Eng. Civil", 30, "TRN082"]
      ],
      [
        ["MAT157", "Cálculo III", 60, "MAT156"],
        ["FIS074", "Física II", 60, "FIS073|MAT154"],
        ["DCC008", "Cálculo Numérico", 60, "DCC199 / DC5199|MAT156"],
        ["PHT043", "Fund. em Arquitetura e Urbanismo", 45, "PRT053"],
        ["CCI064", "Modelagem e Repres. Gráfica", 60, "PRT053"],
        ["ENE135", "Eletrotécnica", 30, "FIS073|MAT156"],
        ["ECO034", "Economia", 60, "EST028"]
      ],
      [
        ["MAT029", "Equações Diferenciais I", 60, "MAT156"],
        ["FIS081", "Fenômenos de Transporte", 60, "FIS074|MAT157"],
        ["MAC010", "Mecânica", 60, "FIS073|MAT157"],
        ["AUR064", "Projeto Arquitetônico", 30, "CCI064|PHT043"],
        ["CCI065", "Gestão de Projetos em Eng. Civil", 60, "CCI064|PHT043"],
        ["TRN078", "Elementos de Geologia", 45, "ESA117|FIS074"],
        ["TRN086", "Topografia Geral", 60, "PHT043|TRN083"],
        ["TRN084", "Práticas de Topografia", 30, "PHT043|TRN083"]
      ],
      [
        ["ETU094", "Análise de Estruturas I", 60, "MAC010"],
        ["MAC002", "Resistência dos Materiais I", 60, "MAC010|MAT029"],
        ["ENE037", "Instalações Elétricas Prediais", 60, "ENE135"],
        ["TRN018 / TRN518", "Mecânica dos Solos I (+ prática)", 75, "MAC010|TRN078"],
        ["TRN087", "Fund. de Geoprocessamento", 60, "TRN086"],
        ["CCI009", "Materiais de Const. Civil I", 60, "QUI125|TRN078"]
      ],
      [
        ["ETU095", "Análise de Estruturas II", 60, "ETU094|MAC002"],
        ["ETU096", "Bases para o Dimens. de Estruturas", 30, "ETU094|MAC002"],
        ["MAC003", "Resistência dos Materiais II", 60, "MAC002"],
        ["MAC007", "Lab. Resist. dos Materiais", 30, "MAC002"],
        ["TRN073", "Introd. aos Sist. de Transportes", 45, "TRN087"],
        ["TRN019 / TRN519", "Mecânica dos Solos II (+ prática)", 75, "ETU094|MAC002|TRN018 / TRN518"],
        ["ESA003 / ESA503", "Mecânica dos Fluidos (+ prática)", 75, "FIS081"],
        ["CCI010 / CCI510", "Materiais de Const. Civil II (+ prática)", 60, "CCI009|MAC002"]
      ],
      [
        ["ETU035", "Estruturas Metálicas", 60, "ETU094|MAC003|MAC007"],
        ["ETU037", "Concreto Armado I", 60, "ETU094|ETU095|MAC003"],
        ["TRN029", "Estradas", 45, "TRN019 / TRN519|TRN073"],
        ["TRN030", "Estudos Hidrológicos e Drenagem", 45, "ESA117|TRN087"],
        ["TRN074", "Geotecnia de Fundações e Obras", 60, "ESA003 / ESA503|MAC003|TRN019 / TRN519"],
        ["ESA005", "Mananciais e Qualidade da Água", 30, "ESA117"],
        ["ESA024 / ESA524", "Hidráulica Geral (+ prática)", 75, "ESA003 / ESA503"]
      ],
      [
        ["ETU017", "Fundações", 60, "ETU037|TRN074"],
        ["ETU038", "Concreto Armado II", 60, "ETU037"],
        ["TRN031", "Construção de Estradas I", 30, "TRN029"],
        ["ESA006", "Saneamento Básico", 60, "ESA005|ESA024 / ESA524"],
        ["ESA007", "Instalações Hidráulicas Prediais", 60, "AUR064|ESA024 / ESA524"],
        ["CCI069", "Construção de Edifícios", 60, "AUR064|CCI010 / CCI510"],
        ["CCI067", "Manutenção de Edifícios", 60, "CCI010 / CCI510"]
      ],
      [
        ["ETU041", "Fund. de Concreto Protendido", 30, "ETU038"],
        ["TRN075 / TRN575", "Pavimentação (+ prática)", 60, "TRN031"],
        ["ESA011", "Fund. de Segurança no Trabalho", 30, "CCI069"],
        ["CCI048", "Programação e Controle de Obras", 60, "CCI069"],
        ["CAD014", "Administração e Org. de Empresas", 60, "ECO034"],
        ["EXT067", "Estudos Sociais em Engenharia", 60, "CCI065"],
        ["PFC-I", "Projeto Final de Curso I", 15, "CCI069|ESA024 / ESA524|ETU037|TRN029"]
      ],
      [
        ["EEC003", "Estágio em Engenharia Civil", 165, "CCI010 / CCI510|ESA003 / ESA503|ETU095|ETU096|MAC003|TRN019 / TRN519|TRN073"],
        ["PFC-II", "Projeto Final de Curso II", 15, "PFC-I"]
      ]
    ]
  },
  "telecomunicacoes": {
    title: "Fluxo Curricular — Eng. Elétrica: Telecomunicações",
    subtitle: "UFJF · currículo 2023 · Engenharia Elétrica — Telecomunicações (integral)",
    unitShort: "h",
    unitLong: "horas",
    valueLabel: "Carga",
    periods: [
      [
        ["CEL064", "Introdução à Eng. Elétrica", 30],
        ["FIS122", "Lab. Introd. Ciências Físicas", 30],
        ["MAT154", "Cálculo I", 60],
        ["MAT155", "Geom. Analítica e Sist. Lineares", 60],
        ["QUI125", "Química Fundamental", 60],
        ["QUI126", "Lab. de Química", 30]
      ],
      [
        ["DCC199 / DC5199", "Algoritmos (+ prática)", 90],
        ["EST028", "Introdução à Estatística", 60, "MAT154"],
        ["FIS073", "Física I", 60, "MAT154"],
        ["FIS077", "Lab. de Física I", 30, "FIS122"],
        ["MAT156", "Cálculo II", 60, "MAT155|MAT154"],
        ["MAT158", "Álgebra Linear", 60, "MAT155"]
      ],
      [
        ["CEL032", "Circuitos Lógicos", 60, "DCC199 / DC5199"],
        ["ENE045", "Lab. de Eletrotécnica", 30, "FIS077|QUI126"],
        ["EPD097", "Engenharia e Sociedade", 30, "MAT029"],
        ["ESA002", "Ecologia e Pres. do Ambiente", 30, "QUI125"],
        ["FIS074", "Física II", 60, "MAT156|FIS073"],
        ["MAT029", "Equações Diferenciais I", 60, "MAT156"],
        ["MAT157", "Cálculo III", 60, "MAT156"]
      ],
      [
        ["CEL033", "Circuitos Lineares I", 60, "MAT029|MAT158"],
        ["DCC008", "Cálculo Numérico", 60, "MAT156|DCC199 / DC5199"],
        ["ENE131", "Expressão Gráfica", 30],
        ["ENE140 / EN5140", "Programação p/ Engenharia (+ prática)", 30, "DCC199 / DC5199"],
        ["FIS075", "Física III", 60, "FIS074|MAT157"],
        ["FIS081", "Fenômenos de Transporte", 60, "FIS074"],
        ["MAT030", "Equações Diferenciais II", 60, "MAT029"]
      ],
      [
        ["CEL034", "Circuitos Lineares II", 60, "CEL033|MAT030"],
        ["CEL065", "Eletromagnetismo", 60, "FIS075|MAT030"],
        ["CEL066", "Sinais e Sistemas", 60, "MAT030"],
        ["CEL114 / CE5114", "Eletrônica Analógica I (+ prática)", 60, "ENE045|CEL033|MAT030"],
        ["CEL117", "Fund. de Sist. Trifásicos", 30, "CEL033"],
        ["ENE143 / EN5143", "Prog. Avançada e Integ. de Sist. (+ prática)", 60, "ENE140 / EN5140"]
      ],
      [
        ["CEL035", "Eletrônica Digital", 60, "CEL032|CEL114 / CE5114"],
        ["CEL068", "Princípios de Comunicações", 60, "EST028|CEL066|CEL114 / CE5114"],
        ["CEL101", "Eletromagnetismo Aplicado", 60, "CEL065|CEL033"],
        ["CEL112", "Controle de Sist. Dinâmicos I", 60, "CEL034|CEL066"],
        ["ENE082", "Instalações Elétricas", 60, "ENE131"],
        ["ENE084", "Análise de Investimentos", 60, "MAT156"],
        ["ENE125", "Fund. de Conversão Eletromec.", 60, "CEL117"]
      ],
      [
        ["CEL069", "Microprocessadores", 60, "CEL035"],
        ["CEL086", "Antenas e Propagação", 60, "CEL101"],
        ["CEL088", "Comunicação Digital", 60, "CEL068"],
        ["CEL100", "Processamento de Sinais I", 60, "CEL035|CEL066"],
        ["CEL111", "Lab. de Prototipagem Eletrônica", 30, "CEL035|ENE045|CEL114 / CE5114"],
        ["CEL120", "Redes de Comunicações I", 60, "CEL035"],
        ["ENE083", "Fund. Resist. dos Materiais", 30, "DCC008|FIS073"]
      ],
      [
        ["CEL080", "Software Embarcado", 60, "CEL069"],
        ["CEL119", "Lab. Integrador de Comunicações I", 30, "CEL068"],
        ["CEL121", "Redes de Comunicações II", 60, "CEL120"],
        ["CEL123", "Micro-ondas e Circ. de RF", 60, "CEL065|CEL033"],
        ["EXT014 / EXT514", "Proj. Extensionistas em Sist. Eletr. (+ prática)", 60, "CEL069"]
      ],
      [
        ["CEL106", "Comunicações Ópticas", 60, "CEL101"],
        ["CEL122", "Sistemas de Telecomunicações", 60, "CEL101|CEL068"],
        ["CEL124", "Lab. Integrador de Comunicações II", 30, "CEL068"],
        ["CEL125", "Sist. de Comunicações Móveis", 60, "CEL101|CEL068"],
        ["EXT015 / EXT515", "Telefonia Digital (+ prática)", 60, "CEL101|CEL068"]
      ],
      [
        ["CEL126", "Trabalho de Conclusão de Curso I", 0],
        ["EEE002", "Estágio em Engenharia Elétrica", 160],
        ["CEL127", "Trabalho de Conclusão de Curso II", 0, "CEL126"]
      ]
    ]
  },
  "sistemas-informacao": {
    title: "Fluxo Curricular — Sistemas de Informação",
    subtitle: "UFJF · currículo 2023 · Sistemas de Informação (noturno)",
    unitShort: "h",
    unitLong: "horas",
    valueLabel: "Carga",
    periods: [
      [
        ["DCC133", "Introd. a Sistemas de Informação", 60],
        ["DCC160", "Lógica e Fund. p/ Computação", 60],
        ["DCC199 / DC5199", "Algoritmos (+ prática)", 90],
        ["DCC202", "Desenvolvimento Web", 30],
        ["MAT155", "Geom. Analítica e Sist. Lineares", 60]
      ],
      [
        ["DCC145", "Aspectos Organizacionais de SI", 60, "DCC133"],
        ["DCC200 / DC5200", "Algoritmos II (+ prática)", 90, "DCC199 / DC5199"],
        ["DCC206", "Desenvolvimento Web II", 30, "DCC202"],
        ["MAT154", "Cálculo I", 60],
        ["CAD014", "Administração e Org. de Empresas", 60],
        ["EXT099", "Introdução à Extensão", 60]
      ],
      [
        ["DCC013", "Estrutura de Dados", 60, "DCC200 / DC5200"],
        ["DCC025", "Orientação a Objetos", 60, "DCC200 / DC5200"],
        ["MAT156", "Cálculo II", 60, "MAT155|MAT154"],
        ["DCC207", "Desenvolvimento Web Front-end", 60, "DCC206"],
        ["DCC203", "Metodologia Científica", 30, "DCC200 / DC5200"]
      ],
      [
        ["DCC012", "Estrutura de Dados II", 60, "DCC013"],
        ["EST028", "Introdução à Estatística", 60, "MAT154"],
        ["DCC070", "Organização de Computadores", 60],
        ["DCC117", "Modelagem de Sistemas", 60, "DCC025"],
        ["DCC209", "Desenv. p/ Dispositivos Móveis", 60, "DCC207"],
        ["EADDCC049", "Aspectos Legais da Informática", 60]
      ],
      [
        ["DCC059", "Teoria dos Grafos", 60, "DCC013"],
        ["DCC060", "Banco de Dados", 60, "DCC012|DCC117"],
        ["DCC061", "Engenharia de Software", 60, "DCC117"],
        ["DCC062", "Sistemas Operacionais", 60, "DCC070"],
        ["FIN001", "Contabilidade Geral e Introd.", 60],
        ["EADDCC044", "Informática e Sociedade", 30]
      ],
      [
        ["DCC042", "Redes de Computadores", 60, "DCC070"],
        ["DCC146", "Aspectos Teóricos da Computação", 60, "DCC013|DCC160"],
        ["DCC174", "Interação Humano-Computador", 60, "DCC061"],
        ["DCC208", "Desenvolvimento Web Back-end", 60, "DCC206|DCC117"],
        ["DCC210", "Empreendedorismo Tecnológico", 60, "CAD014|DCC117"]
      ],
      [
        ["DCC014", "Inteligência Artificial", 60, "DCC160|DCC059"],
        ["DCC077", "Aspectos Avanç. em Banco de Dados", 60, "DCC060"],
        ["DCC078", "Aspectos Avanç. em Eng. Software", 60, "DCC061"],
        ["DCC168", "Teste de Software", 60, "DCC061"],
        ["DCC204", "Trabalho de Conclusão de Curso I", 30, "DCC203"]
      ],
      [
        ["DCC154", "Gerência de Projetos", 60, "DCC061"],
        ["DCC165", "Segurança e Auditoria de Sistemas", 60, "DCC061"],
        ["DCC166", "Sistemas de Apoio à Decisão", 60, "DCC014"],
        ["DCC205", "Trabalho de Conclusão de Curso II", 60, "DCC204"]
      ]
    ]
  }
};
