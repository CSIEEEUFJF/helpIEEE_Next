// Catálogo transcrito da grade oficial 12024 da UFJF em 2026-09-04.
const disciplines = [
  ["MAT034", "Elementos de Topologia Geral", 60, "MAT147"],
  ["MAT140", "Equações Diferenciais Ordinárias", 60, "MAT049 e MAT152"],
  ["MAT058", "Equações Diferenciais Parciais", 60, "MAT030 e MAT153"],
  ["MAT170", "Geometria Não Euclidiana", 60, ""],
  ["MAT060", "Integral de Lebesgue", 60, "MAT152"],
  ["MAT159", "Introdução à Análise Funcional", 60, "MAT152"],
  ["MAT085", "Introdução à Análise Tensorial", 60, "MAT049 e MAT147"],
  ["MAT088", "Introdução ao Cálculo Variacional", 60, "MAT030"],
  ["MAT171", "Introdução aos Grupos de Matrizes", 60, "MAT153"],
  ["MAT172", "Introdução às Álgebras de Lie", 60, "MAT059"],
  ["MAT173", "Introdução às Representações de Grupos Finitos", 60, "MAT025"],
  ["MAT087", "Introdução às Variedades Diferenciáveis", 60, "MAT153"],
  ["MAT174", "Teoria dos Números", 60, "MAT143"],
  ["MAT175", "Tópicos em Álgebra I", 60, ""],
  ["MAT176", "Tópicos em Álgebra II", 60, ""],
  ["MAT177", "Tópicos em Análise I", 60, ""],
  ["MAT178", "Tópicos em Análise II", 60, ""],
  ["MAT179", "Tópicos em Geometria I", 60, ""],
  ["MAT180", "Tópicos em Geometria II", 60, ""],
  ["MAT181", "Tópicos em Matemática Aplicada I", 60, ""],
  ["MAT182", "Tópicos em Matemática Aplicada II", 60, ""],
  ["EST029", "Cálculo de Probabilidades I", 60, "MAT156"],
  ["ECO034", "Economia", 60, ""],
  ["ANE040", "Microeconomia", 60, "ECO034 e MAT156"],
  ["FIS112", "Óptica e Laser", 60, "FIS075"],
].map((discipline) => [...discipline, ["Eletivas"], ["Eletiva"]]);

const catalog = {
  sourceUrl:
    "https://www2.ufjf.br/matematica/wp-content/uploads/sites/393/2024/03/grade-bach-12024.pdf",
  reviewedAt: "2026-09-04",
  disciplines,
};

export default catalog;
