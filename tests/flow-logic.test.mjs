import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  FLOW_CURRICULA,
  curricula,
  curriculumKeys,
} from "../lib/curricula.js";
import {
  buildCurriculumArrowEdges,
  buildCurriculumArrowPath,
} from "../lib/curriculum-arrows.js";
import {
  ELECTIVE_CATALOG_META,
  electiveCatalogKeys,
  loadElectiveCatalog,
} from "../lib/electives/manifest.js";
import { shouldUseIeeeBlueHeader } from "../lib/header-tone.js";

const componentSource = readFileSync(
  new URL("../components/CurriculumExplorer.jsx", import.meta.url),
  "utf8",
);
const recoveryPlannerSource = readFileSync(
  new URL("../components/RecoveryPlanner.jsx", import.meta.url),
  "utf8",
);
const curriculumArrowsSource = readFileSync(
  new URL("../components/CurriculumArrows.jsx", import.meta.url),
  "utf8",
);
const globalStylesSource = readFileSync(
  new URL("../app/globals.css", import.meta.url),
  "utf8",
);
const curriculumStylesSource = readFileSync(
  new URL("../components/CurriculumExplorer.module.css", import.meta.url),
  "utf8",
);
const electivesSource = readFileSync(
  new URL("../components/ElectivesExplorer.jsx", import.meta.url),
  "utf8",
);
const electivesStylesSource = readFileSync(
  new URL("../components/ElectivesExplorer.module.css", import.meta.url),
  "utf8",
);
const recoveryStylesSource = readFileSync(
  new URL("../components/RecoveryPlanner.module.css", import.meta.url),
  "utf8",
);
const headerToneControllerSource = readFileSync(
  new URL("../components/HeaderToneController.js", import.meta.url),
  "utf8",
);
const homePageSource = readFileSync(
  new URL("../app/(home)/page.js", import.meta.url),
  "utf8",
);
const guideIndexSource = readFileSync(
  new URL("../app/guia/page.js", import.meta.url),
  "utf8",
);
const flowPageSource = readFileSync(
  new URL("../app/fluxo/page.js", import.meta.url),
  "utf8",
);
const flowWrapperSource = readFileSync(
  new URL("../components/FlowCurriculumExplorer.jsx", import.meta.url),
  "utf8",
);
const rootLayoutSource = readFileSync(
  new URL("../app/layout.js", import.meta.url),
  "utf8",
);
const themeToggleSource = readFileSync(
  new URL("../components/ThemeToggle.jsx", import.meta.url),
  "utf8",
);
const themeSource = readFileSync(
  new URL("../lib/theme.js", import.meta.url),
  "utf8",
);
const homeSearchSource = readFileSync(
  new URL("../components/HomeSearch.jsx", import.meta.url),
  "utf8",
);
const aboutPageSource = readFileSync(
  new URL("../app/sobre/page.js", import.meta.url),
  "utf8",
);
const siteFooterSource = readFileSync(
  new URL("../components/SiteFooter.jsx", import.meta.url),
  "utf8",
);
const guideArticleSource = readFileSync(
  new URL("../components/GuideArticle.jsx", import.meta.url),
  "utf8",
);
const guidesSource = readFileSync(
  new URL("../lib/guides.js", import.meta.url),
  "utf8",
);

function readCssVariable(rule, property) {
  return rule.match(new RegExp(`--${property}:\\s*(#[0-9a-f]{6})`, "i"))?.[1];
}

function relativeLuminance(hexColor) {
  const channels = hexColor
    .slice(1)
    .match(/.{2}/g)
    .map((hexChannel) => Number.parseInt(hexChannel, 16) / 255)
    .map((channel) =>
      channel <= 0.04045
        ? channel / 12.92
        : ((channel + 0.055) / 1.055) ** 2.4,
    );

  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrastRatio(firstColor, secondColor) {
  const firstLuminance = relativeLuminance(firstColor);
  const secondLuminance = relativeLuminance(secondColor);
  const lighter = Math.max(firstLuminance, secondLuminance);
  const darker = Math.min(firstLuminance, secondLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

function extractFunction(source, functionName) {
  const signature = `function ${functionName}(`;
  const start = source.indexOf(signature);
  assert.notEqual(start, -1, `${signature} deve existir no componente`);

  const bodyStart = source.indexOf("{", start);
  let depth = 0;
  let quote = null;
  let escaped = false;

  for (let index = bodyStart; index < source.length; index += 1) {
    const character = source[index];

    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (character === "\\") {
        escaped = true;
      } else if (character === quote) {
        quote = null;
      }
      continue;
    }

    if (character === '"' || character === "'" || character === "`") {
      quote = character;
      continue;
    }

    if (character === "{") depth += 1;
    if (character === "}") depth -= 1;

    if (depth === 0) {
      return source.slice(start, index + 1);
    }
  }

  throw new Error(`Não foi possível extrair ${functionName}`);
}

const logicStart = componentSource.indexOf("const STORAGE_KEY");
const logicEnd = componentSource.indexOf("const DisciplineCard");
assert.notEqual(logicStart, -1, "constantes de progresso devem existir");
assert.notEqual(logicEnd, -1, "limite da lógica pura deve existir");

const logicPrefix = componentSource.slice(logicStart, logicEnd);
const unlockStatusSource = extractFunction(componentSource, "getUnlockStatus");
const resetProgressSource = extractFunction(
  componentSource,
  "handleResetProgress",
);

const STORAGE_KEY = "helpieee:curriculum-progress:v1";
const LEGACY_STORAGE_KEY_PREFIX = "helpieee-flow-done-";
const EXPECTED_ICE_CURRICULA = new Set([
  "ciencias-exatas",
  "ciencia-computacao-integral",
  "ciencia-computacao-noturno",
  "engenharia-computacional",
  "estatistica",
  "fisica-bacharelado-diurno",
  "fisica-licenciatura-diurno",
  "fisica-licenciatura-noturno",
  "matematica-bacharelado-diurno",
  "matematica-licenciatura-diurno",
  "matematica-licenciatura-noturno",
  "quimica-bacharelado-diurno",
  "quimica-licenciatura-diurno",
  "quimica-licenciatura-noturno",
  "sistemas-informacao",
]);

function createRecoveryHarness() {
  const logicStart = recoveryPlannerSource.indexOf(
    "export const RECOVERY_PLANNER_DEFAULTS",
  );
  const logicEnd = recoveryPlannerSource.indexOf("function pluralize");

  assert.notEqual(logicStart, -1, "constantes do recuperador devem existir");
  assert.notEqual(logicEnd, -1, "limite da lógica do recuperador deve existir");

  const recoveryLogic = recoveryPlannerSource
    .slice(logicStart, logicEnd)
    .replace(/^export /gm, "");
  const factory = new Function(
    `"use strict";
${recoveryLogic}
return { generateRecoveryPlan, RECOVERY_PLANNER_DEFAULTS };`,
  );

  return factory();
}

class MemoryStorage {
  #values = new Map();

  constructor(initialValue) {
    if (initialValue !== undefined) {
      this.#values.set(STORAGE_KEY, initialValue);
    }
  }

  getItem(key) {
    return this.#values.has(key) ? this.#values.get(key) : null;
  }

  setItem(key, value) {
    this.#values.set(key, String(value));
  }

  replaceRaw(value, key = STORAGE_KEY) {
    if (value === null) {
      this.#values.delete(key);
    } else {
      this.#values.set(key, value);
    }
  }
}

class FakeWindow {
  #listeners = new Map();

  constructor(localStorage) {
    this.localStorage = localStorage;
  }

  addEventListener(type, listener) {
    const listeners = this.#listeners.get(type) ?? new Set();
    listeners.add(listener);
    this.#listeners.set(type, listeners);
  }

  removeEventListener(type, listener) {
    this.#listeners.get(type)?.delete(listener);
  }

  dispatchStorage(key) {
    for (const listener of this.#listeners.get("storage") ?? []) {
      listener({ key });
    }
  }

  listenerCount(type) {
    return this.#listeners.get(type)?.size ?? 0;
  }
}

function createLogicHarness({
  curriculumDefinitions = curricula,
  curriculumSlugs = curriculumKeys,
  initialStorage,
  localStorage = new MemoryStorage(initialStorage),
} = {}) {
  const windowObject = new FakeWindow(localStorage);
  const factory = new Function(
    "curricula",
    "curriculumKeys",
    "ELECTIVE_CATALOG_META",
    "window",
    `"use strict";
${logicPrefix}
${unlockStatusSource}

function searchCurriculum(slug, query) {
  const terms = buildSearchTerms(normalizeForSearch(query));
  return hydratedCurricula[slug].periods
    .flat()
    .filter((discipline) =>
      terms.every((variants) =>
        matchesSearchTerm(discipline.searchText, variants),
      ),
    );
}

function createToggleCompleted(activeCourseKey) {
  const activeCurriculum = hydratedCurricula[activeCourseKey];
  return (code) =>
    toggleCompletedProgress(activeCourseKey, activeCurriculum, code);
}

function createResetProgress(activeCourseKey) {
  ${resetProgressSource}
  return handleResetProgress;
}

return {
  buildSearchTerms,
  createResetProgress,
  createToggleCompleted,
  getClientProgressSnapshot,
  getUnlockStatus,
  hydratedCurricula,
  matchesSearchTerm,
  normalizeForSearch,
  parseStoredProgress,
  searchCurriculum,
  subscribeToProgress,
  writeProgress,
};`,
  );

  return {
    localStorage,
    windowObject,
    logic: factory(
      curriculumDefinitions,
      curriculumSlugs,
      ELECTIVE_CATALOG_META,
      windowObject,
    ),
  };
}

function codes(disciplines) {
  return disciplines.map(({ code }) => code);
}

test("exports curriculares permanecem coerentes", () => {
  assert.equal(curricula, FLOW_CURRICULA);
  assert.deepEqual(curriculumKeys, Object.keys(FLOW_CURRICULA));
  assert.equal(curriculumKeys.length, 21);
  assert.deepEqual(
    new Set(
      curriculumKeys.filter(
        (slug) => FLOW_CURRICULA[slug].group === "Cursos do ICE",
      ),
    ),
    EXPECTED_ICE_CURRICULA,
  );
});

test("hidratação preserva períodos, valores e relações inversas", () => {
  const { logic } = createLogicHarness();

  for (const slug of curriculumKeys) {
    const raw = curricula[slug];
    const hydrated = logic.hydratedCurricula[slug];
    const rawDisciplines = raw.periods.flat();

    assert.equal(hydrated.periods.length, raw.periods.length, slug);
    assert.equal(hydrated.disciplines.length, rawDisciplines.length, slug);
    assert.equal(
      hydrated.totalValue,
      rawDisciplines.reduce((total, discipline) => total + discipline[2], 0),
      slug,
    );

    for (const discipline of hydrated.disciplines) {
      assert.equal(hydrated.byCode.get(discipline.code), discipline);
      assert.equal(
        discipline.period,
        raw.periods.findIndex((period) =>
          period.some(([code]) => code === discipline.code),
        ) + 1,
      );

      for (const prerequisiteCode of discipline.prerequisites) {
        const prerequisite = hydrated.byCode.get(prerequisiteCode);
        assert.ok(
          prerequisite,
          `${slug}: ${discipline.code} referencia ${prerequisiteCode}`,
        );
        assert.ok(
          hydrated.unlocksByCode
            .get(prerequisiteCode)
            .some(({ code }) => code === discipline.code),
          `${slug}: aresta inversa ${prerequisiteCode} -> ${discipline.code}`,
        );
      }

      for (const corequisiteCode of discipline.corequisites) {
        const corequisite = hydrated.byCode.get(corequisiteCode);
        assert.ok(
          corequisite,
          `${slug}: ${discipline.code} referencia o correquisito ${corequisiteCode}`,
        );
        assert.ok(
          corequisite.corequisites.includes(discipline.code),
          `${slug}: correquisito simétrico ${discipline.code} <-> ${corequisiteCode}`,
        );
      }
    }

    const expectedEdges = hydrated.disciplines.reduce(
      (total, discipline) => total + discipline.prerequisites.length,
      0,
    );
    const inverseEdges = [...hydrated.unlocksByCode.values()].reduce(
      (total, unlocked) => total + unlocked.length,
      0,
    );
    assert.equal(inverseEdges, expectedEdges, `${slug}: total de relações`);
  }
});

test("hidratação torna correquisitos conhecidos simétricos", () => {
  const curriculumDefinitions = {
    teste: {
      title: "Fluxo Curricular — Teste",
      periods: [
        [
          ["TST001", "Base", 60],
          ["TST002", "Teoria", 60, "", "TST003"],
          ["TST003", "Prática", 30],
        ],
      ],
    },
  };
  const { logic } = createLogicHarness({
    curriculumDefinitions,
    curriculumSlugs: ["teste"],
  });
  const curriculum = logic.hydratedCurricula.teste;

  assert.deepEqual(curriculum.byCode.get("TST001").corequisites, []);
  assert.deepEqual(curriculum.byCode.get("TST002").corequisites, ["TST003"]);
  assert.deepEqual(curriculum.byCode.get("TST003").corequisites, ["TST002"]);
  assert.deepEqual(
    codes(curriculum.corequisitesByCode.get("TST003")),
    ["TST002"],
  );
});

test("todo grafo curricular é recuperável sem ciclos de pré-requisitos", () => {
  const { logic } = createLogicHarness();

  for (const slug of curriculumKeys) {
    const curriculum = logic.hydratedCurricula[slug];
    const pendingPrerequisites = new Map(
      curriculum.disciplines.map((discipline) => [
        discipline.code,
        discipline.prerequisites.length,
      ]),
    );
    const queue = [...pendingPrerequisites]
      .filter(([, pending]) => pending === 0)
      .map(([code]) => code);

    for (let index = 0; index < queue.length; index += 1) {
      for (const unlocked of curriculum.unlocksByCode.get(queue[index]) ?? []) {
        const nextPending = pendingPrerequisites.get(unlocked.code) - 1;
        pendingPrerequisites.set(unlocked.code, nextPending);
        if (nextPending === 0) queue.push(unlocked.code);
      }
    }

    assert.equal(
      new Set(queue).size,
      curriculum.disciplines.length,
      `${slug}: todas as disciplinas devem ser alcançáveis`,
    );
  }
});

test("plano de recuperação padrão respeita pré-requisitos e cobre a grade", () => {
  const { generateRecoveryPlan, RECOVERY_PLANNER_DEFAULTS } =
    createRecoveryHarness();

  for (const slug of curriculumKeys) {
    const rawCurriculum = curricula[slug];
    const firstPeriodCodes = rawCurriculum.periods[0].map(([code]) => code);

    for (const failedCode of firstPeriodCodes) {
      const plan = generateRecoveryPlan(rawCurriculum, failedCode);
      assert.ok(plan, `${slug}/${failedCode}: plano deve existir`);
      assert.equal(plan.unresolved.length, 0, `${slug}/${failedCode}: cobertura`);
      assert.equal(
        plan.firstPeriodPassedCount,
        firstPeriodCodes.length - 1,
        `${slug}/${failedCode}: aprovações iniciais`,
      );
      assert.equal(
        plan.semesters[0]?.disciplines[0]?.code,
        failedCode,
        `${slug}/${failedCode}: reprovação deve ser priorizada no 2º semestre`,
      );

      const passedBeforeSemester = new Set(
        firstPeriodCodes.filter((code) => code !== failedCode),
      );
      const plannedCodes = [];

      for (const semester of plan.semesters) {
        assert.ok(
          semester.disciplines.length <= RECOVERY_PLANNER_DEFAULTS.maxSubjects,
          `${slug}/${failedCode}: limite por semestre`,
        );

        const semesterCodes = new Set(codes(semester.disciplines));

        for (const discipline of semester.disciplines) {
          assert.ok(
            discipline.prerequisites.every((code) =>
              passedBeforeSemester.has(code),
            ),
            `${slug}/${failedCode}: ${discipline.code} só entra após os pré-requisitos`,
          );
          assert.ok(
            discipline.corequisites.every(
              (code) =>
                passedBeforeSemester.has(code) || semesterCodes.has(code),
            ),
            `${slug}/${failedCode}: correquisitos de ${discipline.code} ficam no mesmo semestre`,
          );
          plannedCodes.push(discipline.code);
        }

        for (const discipline of semester.disciplines) {
          passedBeforeSemester.add(discipline.code);
        }
      }

      assert.equal(
        new Set(plannedCodes).size,
        plannedCodes.length,
        `${slug}/${failedCode}: nenhuma disciplina duplicada`,
      );
      assert.ok(
        plannedCodes.includes(failedCode),
        `${slug}/${failedCode}: disciplina reprovada é reagendada`,
      );
      assert.equal(
        plannedCodes.length,
        plan.totalCourseCount - plan.firstPeriodPassedCount,
        `${slug}/${failedCode}: todas as pendências são planejadas`,
      );
    }
  }
});

test("plano agenda grupos de correquisitos juntos e não os divide", () => {
  const { generateRecoveryPlan } = createRecoveryHarness();
  const curriculum = {
    title: "Fluxo Curricular — Teste de correquisitos",
    periods: [
      [
        ["BASE", "Base", 60],
        ["APROVADA", "Já aprovada", 60],
      ],
      [
        ["TEORIA", "Teoria", 60, "BASE", "PRATICA"],
        ["PRATICA", "Prática", 30, "BASE"],
      ],
      [["FINAL", "Final", 60, "TEORIA|PRATICA"]],
    ],
  };
  const plan = generateRecoveryPlan(curriculum, "BASE", {
    lookaheadPeriods: 1,
    maxSubjects: 2,
  });
  const theorySemester = plan.semesters.find(({ disciplines }) =>
    disciplines.some(({ code }) => code === "TEORIA"),
  );
  const practiceSemester = plan.semesters.find(({ disciplines }) =>
    disciplines.some(({ code }) => code === "PRATICA"),
  );

  assert.ok(theorySemester);
  assert.equal(theorySemester, practiceSemester);
  assert.deepEqual(
    new Set(codes(theorySemester.disciplines)),
    new Set(["TEORIA", "PRATICA"]),
  );
  assert.equal(plan.unresolved.length, 0);

  const constrainedPlan = generateRecoveryPlan(curriculum, "BASE", {
    lookaheadPeriods: 1,
    maxSubjects: 1,
  });
  const constrainedCodes = constrainedPlan.semesters.flatMap(({ disciplines }) =>
    codes(disciplines),
  );

  assert.ok(!constrainedCodes.includes("TEORIA"));
  assert.ok(!constrainedCodes.includes("PRATICA"));
  assert.deepEqual(
    new Set(codes(constrainedPlan.unresolved)),
    new Set(["TEORIA", "PRATICA", "FINAL"]),
  );
});

test("plano rejeita disciplina inexistente ou fora do primeiro período", () => {
  const { generateRecoveryPlan } = createRecoveryHarness();
  const curriculum = curricula["engenharia-civil"];

  assert.equal(generateRecoveryPlan(null, "MAT154"), null);
  assert.equal(generateRecoveryPlan(curriculum, "CODIGO_INVALIDO"), null);
  assert.equal(
    generateRecoveryPlan(curriculum, curriculum.periods[1][0][0]),
    null,
  );
});

test("plano aceita a definição bruta e o currículo já hidratado", () => {
  const { generateRecoveryPlan } = createRecoveryHarness();
  const { logic } = createLogicHarness();
  const slug = "engenharia-civil";
  const failedCode = curricula[slug].periods[0][0][0];
  const rawPlan = generateRecoveryPlan(curricula[slug], failedCode);
  const hydratedPlan = generateRecoveryPlan(
    logic.hydratedCurricula[slug],
    failedCode,
  );

  assert.deepEqual(
    hydratedPlan.semesters.map(({ disciplines }) => codes(disciplines)),
    rawPlan.semesters.map(({ disciplines }) => codes(disciplines)),
  );
});

test("plano sanitiza opções inválidas e nunca excede o teto pedido", () => {
  const { generateRecoveryPlan, RECOVERY_PLANNER_DEFAULTS } =
    createRecoveryHarness();
  const curriculum = curricula["engenharia-civil"];
  const failedCode = curriculum.periods[0][0][0];

  const fallbackPlan = generateRecoveryPlan(curriculum, failedCode, {
    lookaheadPeriods: -10,
    maxSubjects: 0,
  });
  assert.equal(fallbackPlan.maxSubjects, RECOVERY_PLANNER_DEFAULTS.maxSubjects);
  assert.ok(
    fallbackPlan.semesters.every(
      ({ disciplines }) =>
        disciplines.length <= RECOVERY_PLANNER_DEFAULTS.maxSubjects,
    ),
  );

  const limitedPlan = generateRecoveryPlan(curriculum, failedCode, {
    lookaheadPeriods: 1,
    maxSubjects: 1,
  });
  assert.ok(
    limitedPlan.semesters.every(({ disciplines }) => disciplines.length <= 1),
  );
  assert.equal(limitedPlan.unresolved.length, 0);
});

test("busca ignora acentos, caixa e separadores e exige todos os termos", () => {
  const { logic } = createLogicHarness();

  assert.equal(logic.normalizeForSearch("  CÁLCULO III  "), "calculo iii");
  assert.deepEqual(
    codes(logic.searchCurriculum("sistemas-eletronicos", "calculo mat156")),
    ["MAT156"],
  );
  assert.deepEqual(
    codes(logic.searchCurriculum("sistemas-eletronicos", "DCC-199")),
    ["DCC199"],
  );
  assert.deepEqual(
    codes(logic.searchCurriculum("sistemas-eletronicos", "cálculo 2")),
    ["MAT156"],
  );
  assert.deepEqual(logic.buildSearchTerms("calculo 2"), [
    ["calculo"],
    ["2", "ii"],
  ]);
  assert.deepEqual(
    codes(logic.searchCurriculum("engenharia-civil", "fenomenos transporte")),
    ["FIS081"],
  );
  assert.deepEqual(
    logic.searchCurriculum("engenharia-civil", "termo inexistente"),
    [],
  );
  assert.equal(
    logic.searchCurriculum("engenharia-civil", "").length,
    logic.hydratedCurricula["engenharia-civil"].disciplines.length,
  );
});

test("progresso salvo é recuperado, deduplicado e sanitizado por curso", () => {
  const validCode = curricula["engenharia-civil"].periods[0][0][0];
  const payload = JSON.stringify({
    "engenharia-civil": [validCode, validCode, "CODIGO_INVALIDO", null, 7],
    "curso-inexistente": [validCode],
  });
  const { logic } = createLogicHarness({ initialStorage: payload });
  const recovered = logic.getClientProgressSnapshot();

  assert.deepEqual(recovered["engenharia-civil"], [validCode]);
  assert.deepEqual(recovered["sistemas-eletronicos"], []);
  assert.deepEqual(Object.keys(recovered), curriculumKeys);
  assert.equal(recovered["curso-inexistente"], undefined);
});

test("armazenamento ausente ou corrompido volta a um progresso vazio", () => {
  for (const initialStorage of [undefined, "{json quebrado", "null", '"texto"']) {
    const { logic } = createLogicHarness({ initialStorage });
    assert.deepEqual(logic.getClientProgressSnapshot(), {});
  }
});

test("mudança externa no localStorage invalida o snapshot em cache", () => {
  const course = "engenharia-civil";
  const [firstCode, secondCode] = curricula[course].periods[0].map(
    ([code]) => code,
  );
  const localStorage = new MemoryStorage(
    JSON.stringify({ [course]: [firstCode] }),
  );
  const { logic, windowObject } = createLogicHarness({ localStorage });
  let notifications = 0;
  const unsubscribe = logic.subscribeToProgress(() => {
    notifications += 1;
  });

  assert.deepEqual(logic.getClientProgressSnapshot()[course], [firstCode]);
  localStorage.replaceRaw(JSON.stringify({ [course]: [secondCode] }));
  windowObject.dispatchStorage("outra-chave");
  assert.equal(notifications, 0);
  windowObject.dispatchStorage(STORAGE_KEY);
  assert.equal(notifications, 1);
  assert.deepEqual(logic.getClientProgressSnapshot()[course], [secondCode]);
  assert.equal(windowObject.listenerCount("storage"), 1);
  unsubscribe();
  assert.equal(windowObject.listenerCount("storage"), 0);
});

test("progresso legado é migrado uma única vez para a chave atual", () => {
  const course = "engenharia-civil";
  const validCode = curricula[course].periods[0][0][0];
  const localStorage = new MemoryStorage();
  localStorage.replaceRaw(
    JSON.stringify([validCode, validCode, "CODIGO_INVALIDO"]),
    `${LEGACY_STORAGE_KEY_PREFIX}${course}`,
  );
  localStorage.replaceRaw(
    "{json quebrado",
    `${LEGACY_STORAGE_KEY_PREFIX}sistemas-eletronicos`,
  );
  const { logic } = createLogicHarness({ localStorage });

  const recovered = logic.getClientProgressSnapshot();
  assert.deepEqual(recovered, { [course]: [validCode] });
  assert.deepEqual(JSON.parse(localStorage.getItem(STORAGE_KEY)), recovered);

  localStorage.replaceRaw(
    JSON.stringify([curricula[course].periods[0][1][0]]),
    `${LEGACY_STORAGE_KEY_PREFIX}${course}`,
  );
  assert.deepEqual(logic.getClientProgressSnapshot(), recovered);
});

test("toggle persiste em ordem curricular, preserva outros cursos e notifica", () => {
  const course = "engenharia-civil";
  const otherCourse = "sistemas-eletronicos";
  const [firstCode, secondCode] = curricula[course].periods[0].map(
    ([code]) => code,
  );
  const otherCode = curricula[otherCourse].periods[0][0][0];
  const initialStorage = JSON.stringify({
    [course]: [secondCode],
    [otherCourse]: [otherCode],
  });
  const { localStorage, logic } = createLogicHarness({ initialStorage });
  const toggle = logic.createToggleCompleted(course);
  let notifications = 0;
  const unsubscribe = logic.subscribeToProgress(() => {
    notifications += 1;
  });

  toggle(firstCode);
  assert.deepEqual(logic.getClientProgressSnapshot()[course], [
    firstCode,
    secondCode,
  ]);
  assert.deepEqual(logic.getClientProgressSnapshot()[otherCourse], [otherCode]);
  assert.equal(notifications, 1);

  toggle(secondCode);
  unsubscribe();
  assert.deepEqual(logic.getClientProgressSnapshot()[course], [firstCode]);
  assert.equal(notifications, 2);
  assert.deepEqual(
    JSON.parse(localStorage.getItem(STORAGE_KEY)),
    logic.getClientProgressSnapshot(),
  );
});

test("limpar progresso afeta apenas a grade ativa", () => {
  const course = "engenharia-civil";
  const otherCourse = "sistemas-eletronicos";
  const code = curricula[course].periods[0][0][0];
  const otherCode = curricula[otherCourse].periods[0][0][0];
  const { logic } = createLogicHarness({
    initialStorage: JSON.stringify({
      [course]: [code],
      [otherCourse]: [otherCode],
    }),
  });

  logic.createResetProgress(course)();
  assert.deepEqual(logic.getClientProgressSnapshot()[course], []);
  assert.deepEqual(logic.getClientProgressSnapshot()[otherCourse], [otherCode]);
});

test("falhas do localStorage não derrubam o progresso em memória", () => {
  const course = "engenharia-civil";
  const code = curricula[course].periods[0][0][0];
  const unavailableStorage = {
    getItem() {
      throw new Error("storage bloqueado");
    },
    setItem() {
      throw new Error("storage bloqueado");
    },
  };
  const { logic } = createLogicHarness({ localStorage: unavailableStorage });

  assert.deepEqual(logic.getClientProgressSnapshot(), {});
  logic.createToggleCompleted(course)(code);
  assert.deepEqual(logic.getClientProgressSnapshot()[course], [code]);
});

test("status de desbloqueio considera conclusão e demais pré-requisitos", () => {
  const { logic } = createLogicHarness();
  const curriculum = logic.hydratedCurricula["sistemas-eletronicos"];
  const selectedCode = "MAT156";
  const target = curriculum.byCode.get("FIS074");

  assert.deepEqual(target.prerequisites, ["FIS073", selectedCode]);
  assert.equal(
    logic.getUnlockStatus(target, selectedCode, new Set()),
    "exige mais 1 pré-requisito",
  );
  assert.equal(
    logic.getUnlockStatus(target, selectedCode, new Set(["FIS073"])),
    "será liberada ao concluir esta",
  );
  assert.equal(
    logic.getUnlockStatus(
      target,
      selectedCode,
      new Set(["FIS073", selectedCode]),
    ),
    "liberada",
  );
  assert.equal(
    logic.getUnlockStatus(target, selectedCode, new Set([target.code])),
    "concluída",
  );
});

test("componente mantém os contratos de seleção, busca e fallback de curso", () => {
  assert.match(
    componentSource,
    /const DEFAULT_CURRICULUM_KEY = curricula\["ciencias-exatas"\]\s*\?\s*"ciencias-exatas"\s*:\s*curriculumKeys\[0\]/,
  );
  assert.match(
    componentSource,
    /curricula\[initialCourse\]\s*\?\s*initialCourse\s*:\s*DEFAULT_CURRICULUM_KEY/,
  );
  assert.match(componentSource, /searchTerms\.every\(/);
  assert.match(componentSource, /matchesSearchTerm\(discipline\.searchText, variants\)/);
  assert.match(componentSource, /setSearch\(""\);\s*setSelectedCode\(null\);/);
  assert.match(componentSource, /setSearch\(""\);\s*setSelectedCode\(code\);/);
  assert.match(componentSource, /useSyncExternalStore\(/);
  assert.match(componentSource, /searchParams\.set\("curso", nextCourseKey\)/);
  assert.match(componentSource, /selectedPrerequisiteCodes\.has\(discipline\.code\)/);
  assert.match(componentSource, /selectedCorequisiteCodes\.has\(discipline\.code\)/);
  assert.match(componentSource, /selectedUnlockCodes\.has\(discipline\.code\)/);
  assert.match(componentSource, /<h3>Correquisitos<\/h3>/);
  assert.match(
    componentSource,
    /const showCompletionControl = interactionMode === "complete"/,
  );
  assert.match(
    componentSource,
    /\{showCompletionControl \? \(\s*<label className=\{styles\.flowCompletionControl\}>/,
  );
});

test("breadcrumb do fluxo preserva o alinhamento lateral do container", () => {
  const rule = globalStylesSource.match(
    /\.flow-page__intro\s+\.breadcrumb\s*\{[^}]*\}/,
  )?.[0];

  assert.ok(rule, "regra específica do breadcrumb do fluxo deve existir");
  assert.match(rule, /margin-block:\s*0/);
  assert.doesNotMatch(rule, /margin:\s*0(?:;|\s)/);
});

test("tema escuro usa a hierarquia monocromática e alto contraste do IEEE UFJF", () => {
  const darkTokens = globalStylesSource.match(
    /:root\[data-theme="dark"\]\s*\{[^}]*\}/,
  )?.[0];
  const forbiddenBrandColors =
    /#(?:00629b|004f7d|003b5c|00b5e2|8de2f7|82d7f0|7edbf2)\b/i;

  assert.ok(darkTokens, "tokens específicos do tema escuro devem existir");
  assert.equal(readCssVariable(darkTokens, "ink"), "#e8eaed");
  assert.equal(readCssVariable(darkTokens, "muted"), "#bdc1c6");
  assert.equal(readCssVariable(darkTokens, "line"), "#3c4043");
  assert.equal(readCssVariable(darkTokens, "surface"), "#1f1f1f");
  assert.equal(readCssVariable(darkTokens, "surface-soft"), "#181818");
  assert.equal(readCssVariable(darkTokens, "surface-blue"), "#2a2a2a");
  assert.doesNotMatch(darkTokens, forbiddenBrandColors);
  assert.ok(contrastRatio("#e8eaed", "#121212") >= 7);
  assert.ok(contrastRatio("#bdc1c6", "#121212") >= 7);

  for (const moduleSource of [curriculumStylesSource, recoveryStylesSource]) {
    const darkOverrides = moduleSource.slice(
      moduleSource.indexOf(':global(:root[data-theme="dark"])'),
    );

    assert.ok(darkOverrides.length > 0, "módulo deve tratar o tema escuro");
    assert.doesNotMatch(darkOverrides, forbiddenBrandColors);
  }

  assert.match(curriculumStylesSource, /border-style:\s*dashed/);
  assert.match(curriculumStylesSource, /border-style:\s*double/);
  assert.match(curriculumStylesSource, /border-style:\s*dotted/);
});

test("navbar começa neutra e adota o azul IEEE depois da abertura", () => {
  assert.equal(
    shouldUseIeeeBlueHeader({
      hasSplash: true,
      headerHeight: 102,
      isIntersecting: true,
      splashBottom: 600,
    }),
    false,
  );
  assert.equal(
    shouldUseIeeeBlueHeader({
      hasSplash: true,
      headerHeight: 102,
      isIntersecting: false,
      splashBottom: 900,
    }),
    false,
    "uma splash ainda abaixo da viewport não deve ativar a navbar",
  );
  assert.equal(
    shouldUseIeeeBlueHeader({
      hasSplash: true,
      headerHeight: 102,
      isIntersecting: false,
      splashBottom: 101,
    }),
    true,
  );
  assert.equal(
    shouldUseIeeeBlueHeader({ hasSplash: false, scrollY: 0 }),
    false,
  );
  assert.equal(
    shouldUseIeeeBlueHeader({ hasSplash: false, scrollY: 1 }),
    true,
  );
  assert.match(homePageSource, /<section className="hero-section" data-header-splash>/);
  assert.match(guideIndexSource, /<header className="page-hero" data-header-splash>/);
  assert.match(guideArticleSource, /<header className="page-hero" data-header-splash>/);
  assert.match(flowPageSource, /<div className="flow-page__intro" data-header-splash>/);
  assert.match(headerToneControllerSource, /new IntersectionObserver\(/);
  assert.match(headerToneControllerSource, /new ResizeObserver\(observeSplash\)/);
  assert.match(headerToneControllerSource, /addEventListener\('scroll', updateToneOnScroll/);
  assert.match(headerToneControllerSource, /rootMargin: `-\$\{headerHeight\}px/);
  assert.match(globalStylesSource, /\.site-header\[data-tone="ieee-blue"\]/);
});

test("atalhos de cursos usam os rótulos editoriais corretos", () => {
  assert.match(homePageSource, />Ver cursos do ICE <span/);
  assert.match(homePageSource, />Ver cursos da Engenharia <span/);
  assert.match(
    homePageSource,
    /href="https:\/\/www2\.ufjf\.br\/engenharia\/ensino\/cursos\/"[^>]*>Ver cursos da Engenharia/,
  );
  assert.doesNotMatch(homePageSource, /Ver cursos (?:no ICE|na Prograd)/);
  assert.doesNotMatch(homePageSource, /www2\.ufjf\.br\/prograd\/cursos-de-graduacao-2/);
});

test("atalhos dos painéis de cursos permanecem alinhados pelo rodapé", () => {
  const panelRule = globalStylesSource.match(/\.course-panel\s*\{[^}]*\}/)?.[0];
  const linkRule = globalStylesSource.match(/\.course-panel a\s*\{[^}]*\}/)?.[0];

  assert.ok(panelRule, "regra do painel de cursos deve existir");
  assert.match(panelRule, /display:\s*flex/);
  assert.match(panelRule, /flex-direction:\s*column/);
  assert.ok(linkRule, "regra do atalho do painel deve existir");
  assert.match(linkRule, /margin-top:\s*auto/);
});

test("interface não volta a exibir disclaimers editoriais ou estáticos", () => {
  const interfaceSources = [
    homePageSource,
    flowPageSource,
    recoveryPlannerSource,
    siteFooterSource,
    guideArticleSource,
    guidesSource,
  ];
  const forbiddenCopy =
    /Transparência editorial|Conteúdo revisado|Use como apoio ao planejamento|esta é apenas uma simulação|Compromissos editoriais|O guia não substitui/;

  for (const source of interfaceSources) {
    assert.doesNotMatch(source, forbiddenCopy);
  }

  assert.doesNotMatch(guideArticleSource, /guide\.scope/);
  assert.match(guideArticleSource, /className="article-audience"/);
  assert.doesNotMatch(
    globalStylesSource,
    /\.(?:trust-note|site-footer__editorial|flow-disclaimer|article-trust|article-scope)\b/,
  );
  assert.doesNotMatch(recoveryStylesSource, /\.disclaimer\b/);
  assert.match(aboutPageSource, /redirect\('\/guia\/projeto'\)/);
});

test("marca de origem usa um círculo perfeito", () => {
  const originMarkRule = globalStylesSource.match(
    /\.origin-mark\s*\{[^}]*\}/,
  )?.[0];
  const darkOriginMarkRule = globalStylesSource.match(
    /:root\[data-theme="dark"\] \.origin-mark\s*\{[^}]*\}/,
  )?.[0];

  assert.ok(originMarkRule, "regra da marca de origem deve existir");
  assert.match(originMarkRule, /aspect-ratio:\s*1/);
  assert.match(originMarkRule, /border-radius:\s*50%/);
  assert.doesNotMatch(originMarkRule, /border-radius:[^;]*15%/);
  assert.doesNotMatch(originMarkRule, /box-shadow/);
  assert.ok(darkOriginMarkRule, "regra escura da marca de origem deve existir");
  assert.doesNotMatch(darkOriginMarkRule, /box-shadow/);
});

test("grade permite arrastar horizontalmente sem acionar cartões", () => {
  const draggingRule = curriculumStylesSource.match(
    /\.flowPeriods\[data-dragging="true"\]\s*\{[^}]*\}/,
  )?.[0];

  assert.match(componentSource, /onPointerDown=\{handlePeriodsPointerDown\}/);
  assert.match(componentSource, /onPointerMove=\{handlePeriodsPointerMove\}/);
  assert.match(componentSource, /onClickCapture=\{handlePeriodsClickCapture\}/);
  assert.match(componentSource, /setPointerCapture\(event\.pointerId\)/);
  assert.match(
    componentSource,
    /scrollLeft = drag\.startScrollLeft - distance/,
  );
  assert.match(componentSource, /Math\.abs\(distance\) < 6/);
  assert.match(componentSource, /event\.pointerType === "touch"/);
  assert.match(componentSource, /event\.preventDefault\(\);\s*event\.stopPropagation\(\);/);
  assert.match(
    componentSource,
    /event\.currentTarget\.dataset\.dragging = "true"/,
  );
  assert.doesNotMatch(componentSource, /isDraggingPeriods|setIsDraggingPeriods/);
  assert.ok(draggingRule, "estado visual de arraste deve existir");
  assert.match(draggingRule, /cursor:\s*grabbing/);
  assert.match(draggingRule, /user-select:\s*none/);
});

test("setas ligam pré-requisitos às matérias dependentes", () => {
  const { logic } = createLogicHarness();
  const curriculum = logic.hydratedCurricula["quimica-bacharelado-diurno"];
  const visibleCodes = new Set(
    curriculum.disciplines.map(({ code }) => code),
  );
  const directEdges = buildCurriculumArrowEdges(
    curriculum,
    "QUI094",
    visibleCodes,
    { directOnly: true },
  );

  assert.deepEqual(
    directEdges
      .map(({ from, relation, to }) => `${from}->${to}:${relation}`)
      .sort(),
    [
      "QUI094->QUI093:unlock",
      "QUI094->QUI110:unlock",
      "QUI094->QUI128:unlock",
      "QUI189->QUI094:prerequisite",
      "QUI191->QUI094:prerequisite",
    ].sort(),
  );
  assert.deepEqual(
    buildCurriculumArrowEdges(
      curriculum,
      "QUI094",
      new Set(["QUI094", "QUI189"]),
      { directOnly: true },
    ),
    [{ from: "QUI189", relation: "prerequisite", to: "QUI094" }],
  );
  assert.deepEqual(
    buildCurriculumArrowEdges(curriculum, null, visibleCodes, {
      directOnly: true,
    }),
    [],
  );
});

test("ponta da seta termina na borda da matéria de destino", () => {
  const source = { bottom: 70, left: 10, right: 110, top: 20 };
  const targetOnRight = { bottom: 90, left: 230, right: 330, top: 30 };
  const targetOnLeft = { bottom: 150, left: -150, right: -50, top: 100 };
  const targetInSameColumn = { bottom: 190, left: 20, right: 120, top: 150 };
  const forwardPath = buildCurriculumArrowPath(source, targetOnRight);
  const reversePath = buildCurriculumArrowPath(source, targetOnLeft);
  const sameColumnPath = buildCurriculumArrowPath(
    source,
    targetInSameColumn,
  );

  assert.deepEqual(forwardPath.end, { x: 228, y: 60 });
  assert.deepEqual(reversePath.end, { x: -48, y: 125 });
  assert.deepEqual(sameColumnPath.end, { x: 122, y: 170 });
  assert.doesNotMatch(forwardPath.d, /NaN|undefined/);
  assert.doesNotMatch(reversePath.d, /NaN|undefined/);
  assert.doesNotMatch(sameColumnPath.d, /NaN|undefined/);
  assert.equal(
    buildCurriculumArrowPath(source, {
      bottom: 0,
      left: 0,
      right: 0,
      top: 0,
    }),
    null,
  );
});

test("camada de setas acompanha o canvas sem bloquear scroll ou clique", () => {
  const arrowRule = curriculumStylesSource.match(
    /\.flowArrows\s*\{[^}]*\}/,
  )?.[0];

  assert.match(componentSource, /aria-pressed=\{showArrows\}/);
  assert.match(componentSource, /<CurriculumArrows/);
  assert.match(componentSource, /className=\{styles\.flowCanvas\}/);
  assert.match(curriculumArrowsSource, /aria-hidden="true"/);
  assert.match(curriculumArrowsSource, /focusable="false"/);
  assert.match(curriculumArrowsSource, /marker-end/);
  assert.match(curriculumArrowsSource, /window\.requestAnimationFrame\(/);
  assert.match(curriculumArrowsSource, /directOnly:\s*coarsePointer\.matches/);
  assert.doesNotMatch(curriculumArrowsSource, /addEventListener\("scroll"/);
  assert.ok(arrowRule, "regra do SVG de setas deve existir");
  assert.match(arrowRule, /position:\s*absolute/);
  assert.match(arrowRule, /pointer-events:\s*none/);
});

test("grade posterga trabalho e pintura fora da tela em celulares", () => {
  const periodRule = curriculumStylesSource.match(
    /\.flowPeriod\s*\{[^}]*\}/,
  )?.[0];
  const plannerRule = recoveryStylesSource.match(/\.planner\s*\{[^}]*\}/)?.[0];

  assert.match(componentSource, /const hydratedCurriculumCache = new Map\(\)/);
  assert.match(
    componentSource,
    /const DisciplineCard = memo\(function DisciplineCard/,
  );
  assert.match(componentSource, /const handleToggleCompleted = useCallback\(/);
  assert.match(componentSource, /const handleSelectDiscipline = useCallback\(/);
  assert.match(
    componentSource,
    /get:\s*\(\) => getHydratedCurriculum\(slug\)/,
  );
  assert.doesNotMatch(
    componentSource,
    /curriculumKeys\.map\(\(slug\) => \[\s*slug,\s*hydrateCurriculum/,
  );
  assert.ok(periodRule, "regra de período deve existir");
  assert.match(periodRule, /content-visibility:\s*auto/);
  assert.ok(plannerRule, "regra do simulador deve existir");
  assert.match(plannerRule, /content-visibility:\s*auto/);
  assert.match(globalStylesSource, /@media \(max-width: 720px\)[\s\S]*?\.site-header\s*\{[^}]*backdrop-filter:\s*none/);
  assert.match(recoveryStylesSource, /@media \(max-width: 760px\)[\s\S]*?box-shadow:\s*none/);
});

test("simulador reutiliza currículo hidratado e evita rerenders alheios", () => {
  assert.match(recoveryPlannerSource, /import \{ memo,/);
  assert.match(
    recoveryPlannerSource,
    /Array\.isArray\(curriculum\.disciplines\)[\s\S]*?curriculum\.byCode instanceof Map[\s\S]*?return curriculum;/,
  );
  assert.match(recoveryPlannerSource, /export default memo\(RecoveryPlanner\);/);
});

test("fluxo mantém HTML útil no SSR e sincroniza a query após hidratar", () => {
  assert.doesNotMatch(flowPageSource, /searchParams|<Suspense/);
  assert.match(flowPageSource, /<FlowCurriculumExplorer \/>/);
  assert.match(flowWrapperSource, /useSyncExternalStore\(/);
  assert.match(flowWrapperSource, /window\.location\.search/);
  assert.match(flowWrapperSource, /function getServerCourse\(\) \{\s*return undefined;/);
  assert.doesNotMatch(flowWrapperSource, /useSearchParams/);
});

test("tema é aplicado antes da primeira pintura sem escrita redundante", () => {
  assert.match(rootLayoutSource, /<head>[\s\S]*INITIAL_THEME_SCRIPT/);
  assert.match(rootLayoutSource, /suppressHydrationWarning/);
  assert.match(themeSource, /window\.localStorage\.getItem/);
  assert.match(themeSource, /root\.setAttribute\('data-theme',theme\)/);
  assert.match(themeToggleSource, /if \(root\.dataset\.theme !== theme\)/);
  assert.match(themeToggleSource, /catch \{\s*inMemoryTheme = nextTheme;/);
});

test("busca da home não renormaliza todo o índice a cada tecla", () => {
  assert.match(homePageSource, /searchText:\s*normalizeSearchText\(/);
  assert.match(homeSearchSource, /useDeferredValue\(query\)/);
  assert.match(homeSearchSource, /entry\.searchText\.includes\(token\)/);
  assert.doesNotMatch(homeSearchSource, /normalize\(`\$\{entry\.title\}/);
});

test("fluxo oferece uma área própria de eletivas para todos os cursos", () => {
  assert.ok(
    curriculumKeys.every((courseKey) => ELECTIVE_CATALOG_META[courseKey]),
  );
  assert.equal(Object.keys(ELECTIVE_CATALOG_META).length, 24);
  assert.deepEqual(
    Object.entries(ELECTIVE_CATALOG_META)
      .filter(([courseKey]) => !curricula[courseKey])
      .map(([courseKey]) => courseKey)
      .sort(),
    [
      "engenharia-ambiental-sanitaria",
      "engenharia-mecanica",
      "engenharia-producao",
    ],
  );
  assert.match(componentSource, /const \[viewMode, setViewMode\] = useState\("curriculum"\)/);
  assert.match(componentSource, /activeElectiveCourseKey/);
  assert.match(componentSource, />\s*Grade curricular\s*<\/button>/);
  assert.match(componentSource, />\s*Eletivas\s*<\/button>/);
  assert.match(componentSource, /import ElectivesExplorer from "\.\/ElectivesExplorer"/);
  assert.match(componentSource, /viewMode === "curriculum" \? \(/);
  assert.match(componentSource, /<ElectivesExplorer/);
  assert.ok(
    componentSource.indexOf("<RecoveryPlanner") >
      componentSource.indexOf("<ElectivesExplorer"),
    "o recuperador deve continuar no final da página",
  );
});

test("catálogos de eletivas preservam estrutura, fontes e códigos únicos", async () => {
  const expectedCatalogCounts = {
    "ciencia-computacao-integral": 94,
    "ciencia-computacao-noturno": 94,
    "ciencias-exatas": 553,
    energia: 82,
    "engenharia-ambiental-sanitaria": 32,
    "engenharia-civil": 108,
    "engenharia-computacional": 93,
    "engenharia-mecanica": 65,
    "engenharia-producao": 14,
    estatistica: 45,
    "fisica-bacharelado-diurno": 21,
    "matematica-bacharelado-diurno": 25,
    "matematica-licenciatura-diurno": 43,
    "quimica-licenciatura-diurno": 3,
    "robotica-automacao": 134,
    "sistemas-eletronicos": 59,
    "sistemas-informacao": 84,
    "sistemas-potencia": 175,
    telecomunicacoes: 71,
  };

  assert.deepEqual([...electiveCatalogKeys].sort(), Object.keys(expectedCatalogCounts).sort());

  for (const courseKey of electiveCatalogKeys) {
    const catalog = await loadElectiveCatalog(courseKey);
    const codes = catalog.disciplines.map(([code]) => code);

    assert.equal(catalog.disciplines.length, expectedCatalogCounts[courseKey]);
    assert.match(catalog.sourceUrl, /^https:\/\//);
    assert.match(catalog.reviewedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.equal(new Set(codes).size, codes.length);

    const mandatoryCodes = new Set(
      (curricula[courseKey]?.periods ?? [])
        .flat()
        .map(([code]) => code),
    );
    assert.deepEqual(
      codes.filter((code) => mandatoryCodes.has(code)),
      [],
      `${courseKey} não deve tratar obrigatórias como eletivas`,
    );

    for (const discipline of catalog.disciplines) {
      assert.equal(discipline.length, 6);
      assert.equal(typeof discipline[0], "string");
      assert.equal(typeof discipline[1], "string");
      assert.ok(Number.isFinite(discipline[2]) && discipline[2] > 0);
      assert.equal(typeof discipline[3], "string");
      assert.ok(Array.isArray(discipline[4]) && discipline[4].length > 0);
      assert.ok(Array.isArray(discipline[5]) && discipline[5].length > 0);
    }
  }
});

test("cursos sem catálogo fixo continuam acessíveis pela matriz oficial", () => {
  const withoutFixedCatalog = Object.entries(ELECTIVE_CATALOG_META)
    .filter(([, meta]) => !meta.hasCatalog)
    .map(([courseKey]) => courseKey)
    .sort();

  assert.deepEqual(withoutFixedCatalog, [
    "fisica-licenciatura-diurno",
    "fisica-licenciatura-noturno",
    "matematica-licenciatura-noturno",
    "quimica-bacharelado-diurno",
    "quimica-licenciatura-noturno",
  ]);

  for (const courseKey of withoutFixedCatalog) {
    const meta = ELECTIVE_CATALOG_META[courseKey];
    assert.equal(loadElectiveCatalog(courseKey), null);
    assert.ok(meta.emptyTitle.length > 0);
    assert.match(meta.sourceUrl, /^https:\/\//);
  }
});

test("catálogos e grades preservam as categorias acadêmicas oficiais", async () => {
  const chemistryDay = curricula["quimica-licenciatura-diurno"];
  const chemistryNight = curricula["quimica-licenciatura-noturno"];
  const chemistryDayCodes = chemistryDay.periods
    .flat()
    .map(([code]) => code);

  assert.equal(
    chemistryDay.periods.flat().reduce((total, discipline) => total + discipline[2], 0),
    3420,
  );
  assert.ok(chemistryDayCodes.includes("ELETIVA-PED-P7"));
  assert.match(chemistryNight.subtitle, /currículo 12023/);

  const expectedRequiredReplacements = {
    "engenharia-civil": ["CCI067", null],
    "robotica-automacao": ["ENE146", "ENE086"],
    "sistemas-potencia": ["CEL068", "ENE099"],
  };

  for (const [courseKey, [electiveCode, requiredCode]] of Object.entries(
    expectedRequiredReplacements,
  )) {
    const requiredCodes = curricula[courseKey].periods
      .flat()
      .map(([code]) => code);
    const catalog = await loadElectiveCatalog(courseKey);
    const electiveCodes = catalog.disciplines.map(([code]) => code);

    assert.ok(!requiredCodes.includes(electiveCode));
    assert.ok(electiveCodes.includes(electiveCode));
    if (requiredCode) assert.ok(requiredCodes.includes(requiredCode));
  }

  for (const courseKey of [
    "robotica-automacao",
    "sistemas-eletronicos",
    "sistemas-potencia",
    "telecomunicacoes",
  ]) {
    const catalog = await loadElectiveCatalog(courseKey);
    const types = new Set(catalog.disciplines.flatMap((discipline) => discipline[5]));

    assert.ok(!types.has("Optativa"), `${courseKey} usa a categoria Opcional`);
    assert.ok(types.has("Opcional"));
  }
});

test("explorador de eletivas posterga dados e cartões para manter fluidez", () => {
  const cardRule = electivesStylesSource.match(/\.card\s*\{[^}]*\}/)?.[0];

  assert.match(electivesSource, /useDeferredValue\(search\)/);
  assert.match(electivesSource, /const INITIAL_VISIBLE_COUNT = 36/);
  assert.match(electivesSource, /filteredDisciplines\.slice\(0, visibleCount\)/);
  assert.match(electivesSource, /Mostrar mais/);
  assert.match(
    readFileSync(
      new URL("../lib/electives/manifest.js", import.meta.url),
      "utf8",
    ),
    /\(\) => import\("\.\/data\/ciencias-exatas\.js"\)/,
  );
  assert.ok(cardRule, "regra de cartão de eletiva deve existir");
  assert.match(cardRule, /content-visibility:\s*auto/);
  assert.match(electivesStylesSource, /@media \(max-width: 620px\)/);
});
