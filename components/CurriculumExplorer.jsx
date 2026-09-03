"use client";

import {
  useDeferredValue,
  useId,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

import { curricula, curriculumKeys } from "@/lib/curricula";

import styles from "./CurriculumExplorer.module.css";

const STORAGE_KEY = "helpieee:curriculum-progress:v1";
const EMPTY_PROGRESS = Object.freeze({});
const progressListeners = new Set();
let progressSnapshot = EMPTY_PROGRESS;
let serializedProgressSnapshot;
let hasReadProgressSnapshot = false;
let isStorageUnavailable = false;

function parsePrerequisites(value = "") {
  return value
    .split("|")
    .map((code) => code.trim())
    .filter(Boolean);
}

function courseLabel(title) {
  return title
    .replace(/^Fluxo Curricular\s*[—-]\s*/, "")
    .replace(/^Eng\. Elétrica:\s*/, "Engenharia Elétrica — ");
}

function normalizeForSearch(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
}

function hydrateCurriculum(slug, definition) {
  const periods = definition.periods.map((entries, periodIndex) =>
    entries.map(([code, name, value, prerequisiteString]) => ({
      code,
      name,
      period: periodIndex + 1,
      prerequisites: parsePrerequisites(prerequisiteString),
      searchText: normalizeForSearch(`${code} ${name}`),
      value,
    })),
  );
  const disciplines = periods.flat();
  const byCode = new Map(
    disciplines.map((discipline) => [discipline.code, discipline]),
  );
  const unlocksByCode = new Map(
    disciplines.map((discipline) => [discipline.code, []]),
  );

  for (const discipline of disciplines) {
    for (const prerequisite of discipline.prerequisites) {
      unlocksByCode.get(prerequisite)?.push(discipline);
    }
  }

  return {
    ...definition,
    byCode,
    disciplines,
    label: courseLabel(definition.title),
    periods,
    slug,
    totalValue: disciplines.reduce(
      (total, discipline) => total + discipline.value,
      0,
    ),
    unlocksByCode,
  };
}

const hydratedCurricula = Object.fromEntries(
  curriculumKeys.map((slug) => [
    slug,
    hydrateCurriculum(slug, curricula[slug]),
  ]),
);

function parseStoredProgress(savedValue) {
  try {
    if (!savedValue) {
      return EMPTY_PROGRESS;
    }

    const parsedValue = JSON.parse(savedValue);

    if (!parsedValue || typeof parsedValue !== "object") {
      return {};
    }

    return Object.fromEntries(
      curriculumKeys.map((slug) => {
        const validCodes = new Set(
          hydratedCurricula[slug].disciplines.map(({ code }) => code),
        );
        const storedCodes = Array.isArray(parsedValue[slug])
          ? parsedValue[slug]
          : [];

        return [
          slug,
          [...new Set(storedCodes)].filter(
            (code) => typeof code === "string" && validCodes.has(code),
          ),
        ];
      }),
    );
  } catch {
    return EMPTY_PROGRESS;
  }
}

function getClientProgressSnapshot() {
  if (typeof window === "undefined") {
    return EMPTY_PROGRESS;
  }

  if (isStorageUnavailable) {
    return progressSnapshot;
  }

  try {
    const savedValue = window.localStorage.getItem(STORAGE_KEY);

    if (
      !hasReadProgressSnapshot ||
      savedValue !== serializedProgressSnapshot
    ) {
      serializedProgressSnapshot = savedValue;
      progressSnapshot = parseStoredProgress(savedValue);
      hasReadProgressSnapshot = true;
    }
  } catch {
    isStorageUnavailable = true;
  }

  return progressSnapshot;
}

function getServerProgressSnapshot() {
  return EMPTY_PROGRESS;
}

function subscribeToProgress(listener) {
  progressListeners.add(listener);

  return () => progressListeners.delete(listener);
}

function writeProgress(nextProgress) {
  progressSnapshot = nextProgress;
  hasReadProgressSnapshot = true;
  serializedProgressSnapshot = JSON.stringify(nextProgress);

  if (!isStorageUnavailable) {
    try {
      window.localStorage.setItem(STORAGE_KEY, serializedProgressSnapshot);
    } catch {
      isStorageUnavailable = true;
    }
  }

  progressListeners.forEach((listener) => listener());
}

function pluralize(count, singular, plural) {
  return count === 1 ? singular : plural;
}

function DisciplineCard({
  completedCodes,
  discipline,
  isSelected,
  onSelect,
  onToggleCompleted,
  unitShort,
}) {
  const missingPrerequisites = discipline.prerequisites.filter(
    (code) => !completedCodes.has(code),
  );
  const isCompleted = completedCodes.has(discipline.code);
  const isAvailable = missingPrerequisites.length === 0;
  const status = isCompleted
    ? "Concluída"
    : isAvailable
      ? "Liberada"
      : `${missingPrerequisites.length} ${pluralize(
          missingPrerequisites.length,
          "pré-requisito pendente",
          "pré-requisitos pendentes",
        )}`;
  const cardClasses = [
    styles.flowCard,
    isSelected ? styles.flowCardSelected : "",
    isCompleted ? styles.flowCardCompleted : "",
    !isCompleted && isAvailable ? styles.flowCardAvailable : "",
  ]
    .filter(Boolean)
    .join(" ");
  const statusClasses = [
    styles.flowStatus,
    isCompleted
      ? styles.flowStatusCompleted
      : isAvailable
        ? styles.flowStatusAvailable
        : styles.flowStatusBlocked,
  ].join(" ");

  return (
    <article className={cardClasses}>
      <button
        aria-pressed={isSelected}
        className={styles.flowCardButton}
        onClick={() => onSelect(discipline.code)}
        type="button"
      >
        <span className={styles.flowCardTopline}>
          <span className={styles.flowCode}>{discipline.code}</span>
          <span className={styles.flowValue}>
            {discipline.value} {unitShort}
          </span>
        </span>
        <span className={styles.flowDisciplineName}>{discipline.name}</span>
        <span className={statusClasses}>{status}</span>
      </button>

      <label className={styles.flowCompletionControl}>
        <input
          aria-label={`${isCompleted ? "Desmarcar" : "Marcar"} ${discipline.code} — ${discipline.name} como concluída`}
          checked={isCompleted}
          className={styles.flowCheckbox}
          onChange={() => onToggleCompleted(discipline.code)}
          type="checkbox"
        />
        <span>{isCompleted ? "Concluída" : "Marcar como concluída"}</span>
      </label>
    </article>
  );
}

function RelationshipItem({ discipline, onSelect, status }) {
  return (
    <li>
      <button
        className={styles.flowRelationButton}
        onClick={() => onSelect(discipline.code)}
        type="button"
      >
        <span className={styles.flowRelationCode}>{discipline.code}</span>
        <span className={styles.flowRelationName}>{discipline.name}</span>
        <span className={styles.flowRelationMeta}>
          no {discipline.period}º período · {status}
        </span>
      </button>
    </li>
  );
}

function getUnlockStatus(discipline, selectedCode, completedCodes) {
  if (completedCodes.has(discipline.code)) {
    return "concluída";
  }

  const otherPendingPrerequisites = discipline.prerequisites.filter(
    (code) => code !== selectedCode && !completedCodes.has(code),
  );

  if (otherPendingPrerequisites.length === 0) {
    return completedCodes.has(selectedCode)
      ? "liberada"
      : "será liberada ao concluir esta";
  }

  return `exige mais ${otherPendingPrerequisites.length} ${pluralize(
    otherPendingPrerequisites.length,
    "pré-requisito",
    "pré-requisitos",
  )}`;
}

export default function CurriculumExplorer({ initialCourse }) {
  const initialCourseKey = hydratedCurricula[initialCourse]
    ? initialCourse
    : curriculumKeys[0];
  const courseSelectId = useId();
  const searchId = useId();
  const [activeCourseKey, setActiveCourseKey] = useState(initialCourseKey);
  const [search, setSearch] = useState("");
  const [selectedCode, setSelectedCode] = useState(null);
  const completedByCourse = useSyncExternalStore(
    subscribeToProgress,
    getClientProgressSnapshot,
    getServerProgressSnapshot,
  );
  const deferredSearch = useDeferredValue(search);
  const activeCurriculum = hydratedCurricula[activeCourseKey];
  const completedCodes = useMemo(
    () => new Set(completedByCourse[activeCourseKey] ?? []),
    [activeCourseKey, completedByCourse],
  );
  const normalizedSearch = normalizeForSearch(deferredSearch);
  const searchTerms = useMemo(
    () => normalizedSearch.split(/\s+/).filter(Boolean),
    [normalizedSearch],
  );
  const filteredPeriods = useMemo(
    () =>
      activeCurriculum.periods
        .map((disciplines, periodIndex) => ({
          disciplines: disciplines.filter((discipline) =>
            searchTerms.every((term) => discipline.searchText.includes(term)),
          ),
          number: periodIndex + 1,
        }))
        .filter(({ disciplines }) => disciplines.length > 0),
    [activeCurriculum, searchTerms],
  );
  const visibleDisciplineCount = filteredPeriods.reduce(
    (total, period) => total + period.disciplines.length,
    0,
  );
  const completedDisciplines = activeCurriculum.disciplines.filter(
    ({ code }) => completedCodes.has(code),
  );
  const completedCount = completedDisciplines.length;
  const completedValue = completedDisciplines.reduce(
    (total, discipline) => total + discipline.value,
    0,
  );
  const completionPercentage = activeCurriculum.disciplines.length
    ? Math.round((completedCount / activeCurriculum.disciplines.length) * 100)
    : 0;
  const selectedDiscipline = selectedCode
    ? activeCurriculum.byCode.get(selectedCode)
    : null;
  const selectedPrerequisites = selectedDiscipline
    ? selectedDiscipline.prerequisites
        .map((code) => activeCurriculum.byCode.get(code))
        .filter(Boolean)
    : [];
  const selectedUnlocks = selectedDiscipline
    ? activeCurriculum.unlocksByCode.get(selectedDiscipline.code) ?? []
    : [];

  function handleCourseChange(event) {
    setActiveCourseKey(event.target.value);
    setSearch("");
    setSelectedCode(null);
  }

  function handleSelectDiscipline(code) {
    setSelectedCode(code);
  }

  function handleSelectRelationship(code) {
    setSearch("");
    setSelectedCode(code);
  }

  function handleToggleCompleted(code) {
    const currentProgress = getClientProgressSnapshot();
    const nextCompletedCodes = new Set(
      currentProgress[activeCourseKey] ?? [],
    );

    if (nextCompletedCodes.has(code)) {
      nextCompletedCodes.delete(code);
    } else {
      nextCompletedCodes.add(code);
    }

    writeProgress({
      ...currentProgress,
      [activeCourseKey]: activeCurriculum.disciplines
        .filter((discipline) => nextCompletedCodes.has(discipline.code))
        .map((discipline) => discipline.code),
    });
  }

  return (
    <section
      aria-labelledby="flow-explorer-title"
      className={styles.flowExplorer}
    >
      <div className={styles.flowIntro}>
        <div>
          <p className={styles.flowEyebrow}>Planejamento acadêmico</p>
          <h1 className={styles.flowTitle} id="flow-explorer-title">
            Explore sua grade curricular
          </h1>
          <p className={styles.flowLead}>
            Consulte períodos e pré-requisitos e marque o que você já concluiu.
            Seu progresso fica salvo somente neste navegador.
          </p>
        </div>

        <div className={styles.flowCourseField}>
          <label htmlFor={courseSelectId}>Curso ou habilitação</label>
          <select
            id={courseSelectId}
            onChange={handleCourseChange}
            value={activeCourseKey}
          >
            {curriculumKeys.map((slug) => (
              <option key={slug} value={slug}>
                {hydratedCurricula[slug].label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.flowSummary}>
        <div className={styles.flowSummaryHeading}>
          <div>
            <p className={styles.flowSummaryLabel}>Seu progresso</p>
            <p className={styles.flowSummaryValue}>
              {completedCount} de {activeCurriculum.disciplines.length}{" "}
              disciplinas
            </p>
          </div>
          <strong className={styles.flowPercentage}>
            {completionPercentage}%
          </strong>
        </div>
        <progress
          aria-label={`${completionPercentage}% da grade concluída`}
          className={styles.flowProgress}
          max={activeCurriculum.disciplines.length}
          value={completedCount}
        />
        <p className={styles.flowSummaryMeta}>
          Progresso de carga: {completedValue} de {activeCurriculum.totalValue}{" "}
          {activeCurriculum.unitLong}
        </p>
      </div>

      <div className={styles.flowToolbar}>
        <div className={styles.flowSearchField}>
          <label htmlFor={searchId}>Buscar na grade</label>
          <input
            id={searchId}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Código ou nome da disciplina"
            type="search"
            value={search}
          />
        </div>
        <p aria-live="polite" className={styles.flowSearchResult}>
          {normalizedSearch
            ? `${visibleDisciplineCount} ${pluralize(
                visibleDisciplineCount,
                "disciplina encontrada",
                "disciplinas encontradas",
              )}`
            : `${activeCurriculum.disciplines.length} disciplinas em ${activeCurriculum.periods.length} períodos`}
        </p>
      </div>

      <div className={styles.flowCourseHeader}>
        <div>
          <h2>{activeCurriculum.label}</h2>
          <p>{activeCurriculum.subtitle}</p>
        </div>
        <p className={styles.flowCompactRelations}>
          As relações aparecem em lista, sem setas sobrepostas.
        </p>
      </div>

      {visibleDisciplineCount > 0 ? (
        <div className={styles.flowPeriods}>
          {filteredPeriods.map((period) => (
            <section
              aria-labelledby={`flow-period-${activeCourseKey}-${period.number}`}
              className={styles.flowPeriod}
              key={period.number}
            >
              <header className={styles.flowPeriodHeader}>
                <h3 id={`flow-period-${activeCourseKey}-${period.number}`}>
                  {period.number}º período
                </h3>
                <span>
                  {period.disciplines.length}{" "}
                  {pluralize(
                    period.disciplines.length,
                    "disciplina",
                    "disciplinas",
                  )}
                </span>
              </header>
              <div className={styles.flowPeriodCards}>
                {period.disciplines.map((discipline) => (
                  <DisciplineCard
                    completedCodes={completedCodes}
                    discipline={discipline}
                    isSelected={selectedCode === discipline.code}
                    key={discipline.code}
                    onSelect={handleSelectDiscipline}
                    onToggleCompleted={handleToggleCompleted}
                    unitShort={activeCurriculum.unitShort}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className={styles.flowEmpty} role="status">
          <h2>Nenhuma disciplina encontrada</h2>
          <p>Tente buscar por outro nome ou pelo código da disciplina.</p>
          <button onClick={() => setSearch("")} type="button">
            Limpar busca
          </button>
        </div>
      )}

      <aside
        aria-live="polite"
        aria-label="Detalhes da disciplina selecionada"
        className={styles.flowDetails}
      >
        {selectedDiscipline ? (
          <>
            <div className={styles.flowDetailsHeader}>
              <div>
                <p className={styles.flowDetailsCode}>
                  {selectedDiscipline.code} · {selectedDiscipline.period}º
                  período
                </p>
                <h2>{selectedDiscipline.name}</h2>
                <p>
                  {activeCurriculum.valueLabel}: {selectedDiscipline.value}{" "}
                  {activeCurriculum.unitShort}
                </p>
              </div>
              <label className={styles.flowDetailsCompletion}>
                <input
                  aria-label={`${
                    completedCodes.has(selectedDiscipline.code)
                      ? "Desmarcar"
                      : "Marcar"
                  } ${selectedDiscipline.code} — ${selectedDiscipline.name} como concluída`}
                  checked={completedCodes.has(selectedDiscipline.code)}
                  onChange={() =>
                    handleToggleCompleted(selectedDiscipline.code)
                  }
                  type="checkbox"
                />
                <span>Disciplina concluída</span>
              </label>
            </div>

            <div className={styles.flowRelationships}>
              <section>
                <h3>Pré-requisitos</h3>
                {selectedPrerequisites.length > 0 ? (
                  <ul className={styles.flowRelationList}>
                    {selectedPrerequisites.map((discipline) => (
                      <RelationshipItem
                        discipline={discipline}
                        key={discipline.code}
                        onSelect={handleSelectRelationship}
                        status={
                          completedCodes.has(discipline.code)
                            ? "concluída"
                            : "pendente"
                        }
                      />
                    ))}
                  </ul>
                ) : (
                  <p className={styles.flowRelationshipEmpty}>
                    Esta disciplina não possui pré-requisitos cadastrados.
                  </p>
                )}
              </section>

              <section>
                <h3>Disciplinas desbloqueadas</h3>
                {selectedUnlocks.length > 0 ? (
                  <ul className={styles.flowRelationList}>
                    {selectedUnlocks.map((discipline) => (
                      <RelationshipItem
                        discipline={discipline}
                        key={discipline.code}
                        onSelect={handleSelectRelationship}
                        status={getUnlockStatus(
                          discipline,
                          selectedDiscipline.code,
                          completedCodes,
                        )}
                      />
                    ))}
                  </ul>
                ) : (
                  <p className={styles.flowRelationshipEmpty}>
                    Nenhuma disciplina da grade depende diretamente desta.
                  </p>
                )}
              </section>
            </div>
          </>
        ) : (
          <div className={styles.flowDetailsPlaceholder}>
            <p className={styles.flowDetailsCode}>Detalhes da disciplina</p>
            <h2>Selecione um cartão da grade</h2>
            <p>
              Você verá aqui os pré-requisitos e as disciplinas liberadas por
              ele.
            </p>
          </div>
        )}
      </aside>
    </section>
  );
}
