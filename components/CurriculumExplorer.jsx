"use client";

import {
  memo,
  useCallback,
  useDeferredValue,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import { curricula, curriculumKeys } from "@/lib/curricula";
import { ELECTIVE_CATALOG_META } from "@/lib/electives/manifest";

import styles from "./CurriculumExplorer.module.css";
import CurriculumArrows from "./CurriculumArrows";
import ElectivesExplorer from "./ElectivesExplorer";
import RecoveryPlanner from "./RecoveryPlanner";

const STORAGE_KEY = "helpieee:curriculum-progress:v1";
const LEGACY_STORAGE_KEY_PREFIX = "helpieee-flow-done-";
const EMPTY_PROGRESS = Object.freeze({});
const progressListeners = new Set();
let progressSnapshot = EMPTY_PROGRESS;
let serializedProgressSnapshot;
let storedProgressValue;
let hasReadProgressSnapshot = false;
let isStorageUnavailable = false;
let isStorageListenerAttached = false;

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
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const SEARCH_NUMERAL_EQUIVALENTS = Object.freeze({
  1: "i",
  2: "ii",
  3: "iii",
  4: "iv",
  5: "v",
  6: "vi",
  7: "vii",
  8: "viii",
  9: "ix",
  10: "x",
  i: "1",
  ii: "2",
  iii: "3",
  iv: "4",
  v: "5",
  vi: "6",
  vii: "7",
  viii: "8",
  ix: "9",
  x: "10",
});

function buildSearchTerms(value) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((term) => {
      const equivalent = SEARCH_NUMERAL_EQUIVALENTS[term];
      return equivalent ? [term, equivalent] : [term];
    });
}

function matchesSearchTerm(searchText, variants) {
  const words = new Set(searchText.split(" "));

  return variants.some((term) =>
    SEARCH_NUMERAL_EQUIVALENTS[term]
      ? words.has(term)
      : searchText.includes(term),
  );
}

function hydrateCurriculum(slug, definition) {
  const periods = definition.periods.map((entries, periodIndex) =>
    entries.map(
      ([code, name, value, prerequisiteString, corequisiteString]) => ({
        code,
        corequisites: parsePrerequisites(corequisiteString),
        name,
        period: periodIndex + 1,
        prerequisites: parsePrerequisites(prerequisiteString),
        searchText: normalizeForSearch(`${code} ${name}`),
        value,
      }),
    ),
  );
  const disciplines = periods.flat();
  const byCode = new Map(
    disciplines.map((discipline) => [discipline.code, discipline]),
  );
  const corequisiteCodesByCode = new Map(
    disciplines.map((discipline) => [
      discipline.code,
      new Set(discipline.corequisites),
    ]),
  );

  for (const discipline of disciplines) {
    for (const corequisite of discipline.corequisites) {
      corequisiteCodesByCode.get(corequisite)?.add(discipline.code);
    }
  }

  const corequisitesByCode = new Map(
    disciplines.map((discipline) => {
      const corequisites = [...corequisiteCodesByCode.get(discipline.code)]
        .map((code) => byCode.get(code))
        .filter(Boolean);

      discipline.corequisites = corequisites.map(({ code }) => code);
      return [discipline.code, corequisites];
    }),
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
    corequisitesByCode,
    disciplines,
    label: courseLabel(definition.title),
    periodCount: periods.length,
    periods,
    slug,
    totalValue: disciplines.reduce(
      (total, discipline) => total + discipline.value,
      0,
    ),
    unlocksByCode,
  };
}

const hydratedCurriculumCache = new Map();
const curriculumCodeSetCache = new Map();

function getHydratedCurriculum(slug) {
  if (!curricula[slug]) return null;

  if (!hydratedCurriculumCache.has(slug)) {
    hydratedCurriculumCache.set(
      slug,
      hydrateCurriculum(slug, curricula[slug]),
    );
  }

  return hydratedCurriculumCache.get(slug);
}

function getCurriculumCodeSet(slug) {
  if (!curricula[slug]) return new Set();

  if (!curriculumCodeSetCache.has(slug)) {
    curriculumCodeSetCache.set(
      slug,
      new Set(
        curricula[slug].periods.flatMap((period) =>
          period.map(([code]) => code),
        ),
      ),
    );
  }

  return curriculumCodeSetCache.get(slug);
}

const hydratedCurricula = Object.create(null);

for (const slug of curriculumKeys) {
  Object.defineProperty(hydratedCurricula, slug, {
    enumerable: true,
    get: () => getHydratedCurriculum(slug),
  });
}

const CURRICULUM_GROUP_ORDER = Object.freeze([
  "Cursos do ICE",
  "Engenharias",
]);
const curriculumGroups = Object.freeze(
  CURRICULUM_GROUP_ORDER.map((label) => ({
    curricula: curriculumKeys.filter(
      (slug) => curricula[slug].group === label,
    ).sort((leftSlug, rightSlug) => {
      const leftLabel = normalizeForSearch(courseLabel(curricula[leftSlug].title));
      const rightLabel = normalizeForSearch(courseLabel(curricula[rightSlug].title));

      if (leftLabel === rightLabel) return 0;
      return leftLabel < rightLabel ? -1 : 1;
    }),
    label,
  })).filter(({ curricula: groupCurricula }) => groupCurricula.length > 0),
);
const electiveCourseGroups = Object.freeze(
  CURRICULUM_GROUP_ORDER.map((label) => ({
    curricula: Object.keys(ELECTIVE_CATALOG_META)
      .filter(
        (slug) =>
          (curricula[slug]?.group ?? ELECTIVE_CATALOG_META[slug].group) ===
          label,
      )
      .sort((leftSlug, rightSlug) => {
        const leftLabel = normalizeForSearch(
          curricula[leftSlug]
            ? courseLabel(curricula[leftSlug].title)
            : ELECTIVE_CATALOG_META[leftSlug].label,
        );
        const rightLabel = normalizeForSearch(
          curricula[rightSlug]
            ? courseLabel(curricula[rightSlug].title)
            : ELECTIVE_CATALOG_META[rightSlug].label,
        );

        if (leftLabel === rightLabel) return 0;
        return leftLabel < rightLabel ? -1 : 1;
      }),
    label,
  })).filter(({ curricula: groupCurricula }) => groupCurricula.length > 0),
);
const DEFAULT_CURRICULUM_KEY = curricula["ciencias-exatas"]
  ? "ciencias-exatas"
  : curriculumKeys[0];

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
        const storedCodes = Array.isArray(parsedValue[slug])
          ? parsedValue[slug]
          : [];

        if (storedCodes.length === 0) return [slug, []];

        const validCodes = getCurriculumCodeSet(slug);

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

function readLegacyProgress() {
  const legacyProgress = {};
  let hasLegacyProgress = false;

  for (const slug of curriculumKeys) {
    try {
      const savedValue = window.localStorage.getItem(
        `${LEGACY_STORAGE_KEY_PREFIX}${slug}`,
      );

      if (!savedValue) continue;

      const savedCodes = JSON.parse(savedValue);

      if (!Array.isArray(savedCodes) || savedCodes.length === 0) {
        continue;
      }

      const validCodes = getCurriculumCodeSet(slug);
      const migratedCodes = [...new Set(savedCodes)].filter(
        (code) => typeof code === "string" && validCodes.has(code),
      );

      if (migratedCodes.length > 0) {
        legacyProgress[slug] = migratedCodes;
        hasLegacyProgress = true;
      }
    } catch {
      // Ignore malformed values left by an older version of the flow.
    }
  }

  return hasLegacyProgress ? legacyProgress : EMPTY_PROGRESS;
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
      savedValue !== storedProgressValue
    ) {
      const parsedProgress = parseStoredProgress(savedValue);
      const migratedProgress = savedValue ? EMPTY_PROGRESS : readLegacyProgress();

      progressSnapshot =
        migratedProgress === EMPTY_PROGRESS ? parsedProgress : migratedProgress;
      serializedProgressSnapshot = JSON.stringify(progressSnapshot);
      storedProgressValue = savedValue;
      hasReadProgressSnapshot = true;

      if (!savedValue && migratedProgress !== EMPTY_PROGRESS) {
        window.localStorage.setItem(STORAGE_KEY, serializedProgressSnapshot);
        storedProgressValue = serializedProgressSnapshot;
      }
    }
  } catch {
    isStorageUnavailable = true;
  }

  return progressSnapshot;
}

function getServerProgressSnapshot() {
  return EMPTY_PROGRESS;
}

function handleProgressStorage(event) {
  if (event.key !== STORAGE_KEY && event.key !== null) {
    return;
  }

  hasReadProgressSnapshot = false;
  storedProgressValue = undefined;
  progressListeners.forEach((listener) => listener());
}

function subscribeToProgress(listener) {
  progressListeners.add(listener);

  if (!isStorageListenerAttached) {
    window.addEventListener("storage", handleProgressStorage);
    isStorageListenerAttached = true;
  }

  return () => {
    progressListeners.delete(listener);

    if (progressListeners.size === 0 && isStorageListenerAttached) {
      window.removeEventListener("storage", handleProgressStorage);
      isStorageListenerAttached = false;
    }
  };
}

function writeProgress(nextProgress) {
  progressSnapshot = nextProgress;
  hasReadProgressSnapshot = true;
  serializedProgressSnapshot = JSON.stringify(nextProgress);
  storedProgressValue = serializedProgressSnapshot;

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

function toggleCompletedProgress(activeCourseKey, activeCurriculum, code) {
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

const DisciplineCard = memo(function DisciplineCard({
  completedCodes,
  discipline,
  elementId,
  interactionMode,
  relation,
  isSelected,
  onSelect,
  onToggleCompleted,
  unitShort,
}) {
  const missingPrerequisites = discipline.prerequisites.filter(
    (code) => !completedCodes.has(code),
  );
  const pendingCorequisites = discipline.corequisites.filter(
    (code) => !completedCodes.has(code),
  );
  const isCompleted = completedCodes.has(discipline.code);
  const isAvailable = missingPrerequisites.length === 0;
  const showCompletionControl = interactionMode === "complete";
  const relationLabel =
    relation === "prerequisite"
      ? "pré-requisito direto"
      : relation === "corequisite"
        ? "correquisito"
        : relation === "unlock"
          ? "disciplina desbloqueada"
          : "";
  const status = isCompleted
    ? "Concluída"
    : isAvailable
      ? pendingCorequisites.length > 0
        ? `Liberada com ${pendingCorequisites.length} ${pluralize(
            pendingCorequisites.length,
            "correquisito",
            "correquisitos",
          )}`
        : "Liberada"
      : `${missingPrerequisites.length} ${pluralize(
          missingPrerequisites.length,
          "pré-requisito pendente",
          "pré-requisitos pendentes",
        )}`;
  const cardClasses = [
    styles.flowCard,
    isSelected ? styles.flowCardSelected : "",
    relation === "prerequisite" ? styles.flowCardPrerequisite : "",
    relation === "unlock" ? styles.flowCardUnlock : "",
    relation === "corequisite" ? styles.flowCardCorequisite : "",
    isCompleted ? styles.flowCardCompleted : "",
    !isCompleted && isAvailable ? styles.flowCardAvailable : "",
  ]
    .filter(Boolean)
    .join(" ");
  const statusClasses = [
    styles.flowStatus,
    isCompleted
      ? styles.flowStatusCompleted
      : !isAvailable
        ? styles.flowStatusBlocked
        : pendingCorequisites.length > 0
          ? styles.flowStatusCorequisite
          : styles.flowStatusAvailable,
  ].join(" ");

  return (
    <article className={cardClasses} id={elementId}>
      <button
        aria-label={`${
          interactionMode === "complete"
            ? isCompleted
              ? "Desmarcar"
              : "Marcar como concluída"
            : isSelected
              ? "Fechar relações de"
              : "Explorar relações de"
        } ${discipline.code} — ${discipline.name} — ${status}${
          relationLabel ? ` — ${relationLabel}` : ""
        }`}
        aria-pressed={
          interactionMode === "complete" ? isCompleted : isSelected
        }
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
        {relation ? (
          <span
            className={`${styles.flowRelationBadge} ${
              relation === "prerequisite"
                ? styles.flowRelationBadgePrerequisite
                : relation === "corequisite"
                  ? styles.flowRelationBadgeCorequisite
                  : styles.flowRelationBadgeUnlock
            }`}
          >
            {relation === "prerequisite"
              ? "Pré-requisito direto"
              : relation === "corequisite"
                ? "Correquisito"
                : "Desbloqueada por esta"}
          </span>
        ) : null}
        <span className={statusClasses}>{status}</span>
      </button>

      {showCompletionControl ? (
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
      ) : null}
    </article>
  );
});

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
  const initialCourseKey = curricula[initialCourse]
    ? initialCourse
    : DEFAULT_CURRICULUM_KEY;
  const courseSelectId = useId();
  const searchId = useId();
  const flowScrollHintId = useId();
  const periodsRef = useRef(null);
  const periodsCanvasRef = useRef(null);
  const periodsDragRef = useRef(null);
  const suppressPeriodsClickRef = useRef(false);
  const [activeCourseKey, setActiveCourseKey] = useState(initialCourseKey);
  const [activeElectiveCourseKey, setActiveElectiveCourseKey] =
    useState(initialCourseKey);
  const [viewMode, setViewMode] = useState("curriculum");
  const [interactionMode, setInteractionMode] = useState("explore");
  const [showArrows, setShowArrows] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCode, setSelectedCode] = useState(null);
  const completedByCourse = useSyncExternalStore(
    subscribeToProgress,
    getClientProgressSnapshot,
    getServerProgressSnapshot,
  );
  const deferredSearch = useDeferredValue(search);
  const activeCurriculum = hydratedCurricula[activeCourseKey];
  const selectedCourseKey =
    viewMode === "curriculum" ? activeCourseKey : activeElectiveCourseKey;
  const activeCourseGroups =
    viewMode === "curriculum" ? curriculumGroups : electiveCourseGroups;
  const selectedCourseLabel = curricula[selectedCourseKey]
    ? courseLabel(curricula[selectedCourseKey].title)
    : ELECTIVE_CATALOG_META[selectedCourseKey].label;
  const completedCodes = useMemo(
    () => new Set(completedByCourse[activeCourseKey] ?? []),
    [activeCourseKey, completedByCourse],
  );
  const normalizedSearch = normalizeForSearch(deferredSearch);
  const searchTerms = useMemo(
    () => buildSearchTerms(normalizedSearch),
    [normalizedSearch],
  );
  const filteredPeriods = useMemo(
    () =>
      activeCurriculum.periods
        .map((disciplines, periodIndex) => ({
          disciplines: disciplines.filter((discipline) =>
            searchTerms.every((variants) =>
              matchesSearchTerm(discipline.searchText, variants),
            ),
          ),
          number: periodIndex + 1,
        })),
    [activeCurriculum, searchTerms],
  );
  const visibleDisciplineCount = filteredPeriods.reduce(
    (total, period) => total + period.disciplines.length,
    0,
  );
  const visibleCodes = useMemo(
    () =>
      new Set(
        filteredPeriods.flatMap(({ disciplines }) =>
          disciplines.map(({ code }) => code),
        ),
      ),
    [filteredPeriods],
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
  const selectedCorequisites = selectedDiscipline
    ? activeCurriculum.corequisitesByCode.get(selectedDiscipline.code) ?? []
    : [];
  const selectedPrerequisiteCodes = new Set(
    selectedPrerequisites.map(({ code }) => code),
  );
  const selectedUnlockCodes = new Set(
    selectedUnlocks.map(({ code }) => code),
  );
  const selectedCorequisiteCodes = new Set(
    selectedCorequisites.map(({ code }) => code),
  );

  function handlePeriodsPointerDown(event) {
    if (
      event.button !== 0 ||
      event.isPrimary === false ||
      event.pointerType === "touch"
    ) {
      return;
    }

    suppressPeriodsClickRef.current = false;
    periodsDragRef.current = {
      isDragging: false,
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startScrollLeft: event.currentTarget.scrollLeft,
    };
  }

  function handlePeriodsPointerMove(event) {
    const drag = periodsDragRef.current;

    if (!drag || drag.pointerId !== event.pointerId) return;

    const distance = event.clientX - drag.startClientX;

    if (!drag.isDragging) {
      if (Math.abs(distance) < 6) return;

      drag.isDragging = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      event.currentTarget.dataset.dragging = "true";
    }

    event.preventDefault();
    event.currentTarget.scrollLeft = drag.startScrollLeft - distance;
  }

  function finishPeriodsDrag(event, suppressClick) {
    const drag = periodsDragRef.current;

    if (!drag || drag.pointerId !== event.pointerId) return;

    const wasDragging = drag.isDragging;
    periodsDragRef.current = null;
    delete event.currentTarget.dataset.dragging;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (suppressClick && wasDragging) {
      suppressPeriodsClickRef.current = true;
      window.setTimeout(() => {
        suppressPeriodsClickRef.current = false;
      }, 0);
    }
  }

  function handlePeriodsPointerLeave(event) {
    const drag = periodsDragRef.current;

    if (drag?.pointerId === event.pointerId && !drag.isDragging) {
      periodsDragRef.current = null;
    }
  }

  function handlePeriodsLostPointerCapture(event) {
    if (periodsDragRef.current?.pointerId !== event.pointerId) return;

    periodsDragRef.current = null;
    delete event.currentTarget.dataset.dragging;
  }

  function handlePeriodsClickCapture(event) {
    if (!suppressPeriodsClickRef.current) return;

    suppressPeriodsClickRef.current = false;
    event.preventDefault();
    event.stopPropagation();
  }

  const handleToggleCompleted = useCallback(
    (code) =>
      toggleCompletedProgress(activeCourseKey, activeCurriculum, code),
    [activeCourseKey, activeCurriculum],
  );

  function handleCourseChange(event) {
    const nextCourseKey = event.target.value;

    if (viewMode === "electives") {
      setActiveElectiveCourseKey(nextCourseKey);
      return;
    }

    setActiveCourseKey(nextCourseKey);
    setActiveElectiveCourseKey(nextCourseKey);
    setSearch("");
    setSelectedCode(null);
    periodsRef.current?.scrollTo({ left: 0 });

    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set("curso", nextCourseKey);
    window.history.replaceState(
      window.history.state,
      "",
      nextUrl.toString(),
    );
  }

  const handleSelectDiscipline = useCallback(
    (code) => {
      if (interactionMode === "complete") {
        handleToggleCompleted(code);
        return;
      }

      setSearch("");
      setSelectedCode((currentCode) => (currentCode === code ? null : code));
    },
    [handleToggleCompleted, interactionMode],
  );

  function handleSearchChange(event) {
    setSearch(event.target.value);
    periodsRef.current?.scrollTo({ left: 0 });
  }

  function handleSelectRelationship(code) {
    setSearch("");
    setSelectedCode(code);

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        const target = document.getElementById(
          `flow-discipline-${activeCourseKey}-${code}`,
        );

        target?.scrollIntoView({
          behavior: window.matchMedia(
            "(prefers-reduced-motion: reduce), (max-width: 720px)",
          ).matches
            ? "auto"
            : "smooth",
          block: "center",
          inline: "center",
        });
        target?.querySelector("button")?.focus({ preventScroll: true });
      });
    });
  }

  function handleResetProgress() {
    const currentProgress = getClientProgressSnapshot();

    writeProgress({
      ...currentProgress,
      [activeCourseKey]: [],
    });
  }

  function handleInteractionMode(nextMode) {
    setInteractionMode(nextMode);

    if (nextMode === "complete") {
      setSelectedCode(null);
    }
  }

  function handleViewMode(nextMode) {
    setViewMode(nextMode);
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
            Explore seu curso
          </h1>
          <p className={styles.flowLead}>
            Consulte a grade, entenda os pré-requisitos e explore as eletivas
            das graduações presenciais do ICE e da Faculdade de Engenharia.
          </p>
        </div>

        <div className={styles.flowCourseField}>
          <label htmlFor={courseSelectId}>Curso ou habilitação</label>
          <select
            id={courseSelectId}
            onChange={handleCourseChange}
            value={selectedCourseKey}
          >
            {activeCourseGroups.map((group) => (
              <optgroup
                key={group.label}
                label={`${group.label} (${group.curricula.length})`}
              >
                {group.curricula.map((slug) => (
                  <option key={slug} value={slug}>
                    {curricula[slug]
                      ? courseLabel(curricula[slug].title)
                      : ELECTIVE_CATALOG_META[slug].label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.flowViewSwitcher}>
        <div
          aria-label="Conteúdo do curso"
          className={styles.flowViewTabs}
          role="group"
        >
          <button
            aria-pressed={viewMode === "curriculum"}
            className={
              viewMode === "curriculum" ? styles.flowViewTabActive : ""
            }
            onClick={() => handleViewMode("curriculum")}
            type="button"
          >
            Grade curricular
          </button>
          <button
            aria-pressed={viewMode === "electives"}
            className={
              viewMode === "electives" ? styles.flowViewTabActive : ""
            }
            onClick={() => handleViewMode("electives")}
            type="button"
          >
            Eletivas
          </button>
        </div>
        <p>
          {viewMode === "curriculum"
            ? "Períodos, relações entre matérias e progresso."
            : "Opções, áreas, carga horária e pré-requisitos."}
        </p>
      </div>

      {viewMode === "curriculum" ? (
        <div
          className={styles.flowViewPanel}
        >
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

      <div className={styles.flowControls}>
        <div>
          <p className={styles.flowControlsLabel}>Modo de interação</p>
          <div
            aria-label="Modo de interação com a grade"
            className={styles.flowModeGroup}
            role="group"
          >
            <button
              aria-pressed={interactionMode === "explore"}
              className={
                interactionMode === "explore" ? styles.flowModeActive : ""
              }
              onClick={() => handleInteractionMode("explore")}
              type="button"
            >
              Explorar relações
            </button>
            <button
              aria-pressed={interactionMode === "complete"}
              className={
                interactionMode === "complete" ? styles.flowModeActive : ""
              }
              onClick={() => handleInteractionMode("complete")}
              type="button"
            >
              Marcar concluídas
            </button>
          </div>
        </div>
        <p aria-live="polite" className={styles.flowControlsHint}>
          {interactionMode === "explore"
            ? "Selecione uma disciplina para destacar o que vem antes e depois dela."
            : "Clique nos cartões para registrar rapidamente as disciplinas concluídas."}
        </p>
        <div className={styles.flowControlActions}>
          <button
            aria-label={
              showArrows
                ? "Ocultar setas entre as matérias"
                : "Mostrar setas entre as matérias"
            }
            aria-pressed={showArrows}
            className={styles.flowArrowToggle}
            onClick={() => setShowArrows((currentValue) => !currentValue)}
            type="button"
          >
            <span aria-hidden="true">→</span>
            {showArrows ? "Setas visíveis" : "Mostrar setas"}
          </button>
          <button
            className={styles.flowResetButton}
            disabled={completedCount === 0}
            onClick={handleResetProgress}
            type="button"
          >
            Limpar progresso desta grade
          </button>
        </div>
      </div>

      <div className={styles.flowToolbar}>
        <div className={styles.flowSearchField}>
          <label htmlFor={searchId}>Buscar na grade</label>
          <input
            id={searchId}
            onChange={handleSearchChange}
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
          {activeCurriculum.sourceUrl ? (
            <a
              aria-label="Conferir grade oficial da UFJF (abre em nova aba)"
              className={styles.flowOfficialSource}
              href={activeCurriculum.sourceUrl}
              rel="noreferrer"
              target="_blank"
            >
              Conferir grade oficial da UFJF <span aria-hidden="true">↗</span>
            </a>
          ) : null}
        </div>
        <div aria-label="Legenda da grade" className={styles.flowLegend}>
          <span><i className={styles.flowLegendSelected} />Selecionada</span>
          <span><i className={styles.flowLegendPrerequisite} />Pré-requisito</span>
          <span><i className={styles.flowLegendCorequisite} />Correquisito</span>
          <span>
            <i className={styles.flowLegendUnlock} />
            Desbloqueia
          </span>
          <span><i className={styles.flowLegendCompleted} />Concluída</span>
        </div>
      </div>

      {visibleDisciplineCount > 0 ? (
        <>
          <p className={styles.flowHorizontalHint} id={flowScrollHintId}>
            <span aria-hidden="true">↔</span>
            Todos os períodos estão lado a lado. Arraste, deslize ou use a
            barra de rolagem horizontal para percorrer a grade. Selecione uma
            matéria para destacar suas setas.
          </p>
          <div
            aria-describedby={flowScrollHintId}
            aria-label={`Períodos de ${activeCurriculum.label}`}
            className={styles.flowPeriods}
            onClickCapture={handlePeriodsClickCapture}
            onLostPointerCapture={handlePeriodsLostPointerCapture}
            onPointerCancel={(event) => finishPeriodsDrag(event, false)}
            onPointerDown={handlePeriodsPointerDown}
            onPointerLeave={handlePeriodsPointerLeave}
            onPointerMove={handlePeriodsPointerMove}
            onPointerUp={(event) => finishPeriodsDrag(event, true)}
            ref={periodsRef}
            role="region"
            tabIndex={0}
          >
            <div
              className={styles.flowCanvas}
              data-arrows-visible={showArrows ? "true" : undefined}
              ref={periodsCanvasRef}
            >
              {showArrows ? (
                <CurriculumArrows
                  canvasRef={periodsCanvasRef}
                  courseKey={activeCourseKey}
                  curriculum={activeCurriculum}
                  layoutKey={`${interactionMode}:${selectedCode ?? ""}:${completedCount}:${normalizedSearch}`}
                  selectedCode={selectedCode}
                  visibleCodes={visibleCodes}
                />
              ) : null}
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
                    {period.disciplines.length > 0 ? (
                      period.disciplines.map((discipline) => (
                        <DisciplineCard
                          completedCodes={completedCodes}
                          discipline={discipline}
                          elementId={`flow-discipline-${activeCourseKey}-${discipline.code}`}
                          interactionMode={interactionMode}
                          isSelected={selectedCode === discipline.code}
                          key={discipline.code}
                          onSelect={handleSelectDiscipline}
                          onToggleCompleted={handleToggleCompleted}
                          relation={
                            selectedPrerequisiteCodes.has(discipline.code)
                              ? "prerequisite"
                              : selectedCorequisiteCodes.has(discipline.code)
                                ? "corequisite"
                                : selectedUnlockCodes.has(discipline.code)
                                  ? "unlock"
                                  : null
                          }
                          unitShort={activeCurriculum.unitShort}
                        />
                      ))
                    ) : (
                      <p className={styles.flowPeriodEmpty}>
                        Sem correspondências neste período.
                      </p>
                    )}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </>
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

              <section>
                <h3>Correquisitos</h3>
                {selectedCorequisites.length > 0 ? (
                  <ul className={styles.flowRelationList}>
                    {selectedCorequisites.map((discipline) => (
                      <RelationshipItem
                        discipline={discipline}
                        key={discipline.code}
                        onSelect={handleSelectRelationship}
                        status={
                          completedCodes.has(discipline.code)
                            ? "concluída"
                            : "cursar junto"
                        }
                      />
                    ))}
                  </ul>
                ) : (
                  <p className={styles.flowRelationshipEmpty}>
                    Esta disciplina não possui correquisitos cadastrados.
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
              Você verá aqui os pré-requisitos, correquisitos e as disciplinas
              liberadas por ele.
            </p>
          </div>
        )}
      </aside>

        </div>
      ) : (
        <div
          className={styles.flowViewPanel}
        >
          <ElectivesExplorer
            courseKey={activeElectiveCourseKey}
            courseLabel={selectedCourseLabel}
            key={activeElectiveCourseKey}
          />
        </div>
      )}

      {viewMode === "curriculum" ? (
        <RecoveryPlanner
          curriculum={activeCurriculum}
          curriculumKey={activeCourseKey}
        />
      ) : null}
    </section>
  );
}
