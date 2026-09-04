"use client";

import {
  useDeferredValue,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";

import {
  ELECTIVE_CATALOG_META,
  loadElectiveCatalog,
} from "@/lib/electives/manifest";

import styles from "./ElectivesExplorer.module.css";

const INITIAL_VISIBLE_COUNT = 36;
const VISIBLE_COUNT_INCREMENT = 36;
const EMPTY_DISCIPLINES = Object.freeze([]);
const hydratedCatalogCache = new WeakMap();
const explorerStateCache = new Map();

function getInitialExplorerState(courseKey) {
  return (
    explorerStateCache.get(courseKey) ?? {
      activeArea: "all",
      activeType: "all",
      search: "",
      visibleCount: INITIAL_VISIBLE_COUNT,
    }
  );
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

function pluralize(count, singular, plural) {
  return count === 1 ? singular : plural;
}

function hydrateDiscipline([
  code,
  name,
  hours,
  prerequisites,
  areas,
  types,
]) {
  const normalizedPrerequisites = prerequisites === "--" ? "" : prerequisites;

  return {
    areas,
    code,
    hours,
    name,
    prerequisites: normalizedPrerequisites,
    searchText: normalizeForSearch(
      [code, name, normalizedPrerequisites, ...areas, ...types].join(" "),
    ),
    types,
  };
}

function getHydratedDisciplines(catalog) {
  if (!catalog) return EMPTY_DISCIPLINES;

  if (!hydratedCatalogCache.has(catalog)) {
    hydratedCatalogCache.set(
      catalog,
      catalog.disciplines.map(hydrateDiscipline),
    );
  }

  return hydratedCatalogCache.get(catalog);
}

function CatalogLoading() {
  return (
    <div aria-busy="true" className={styles.loading} role="status">
      <span>Carregando eletivas deste curso…</span>
      <div aria-hidden="true" className={styles.loadingGrid}>
        {Array.from({ length: 6 }, (_, index) => (
          <i key={index} />
        ))}
      </div>
    </div>
  );
}

export default function ElectivesExplorer({ courseKey, courseLabel }) {
  const searchId = useId();
  const areaId = useId();
  const typeId = useId();
  const meta = ELECTIVE_CATALOG_META[courseKey];
  const [catalogState, setCatalogState] = useState(null);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [explorerState, setExplorerState] = useState(() =>
    getInitialExplorerState(courseKey),
  );
  const { activeArea, activeType, search, visibleCount } = explorerState;
  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    if (!meta?.hasCatalog) return undefined;

    let isCancelled = false;

    loadElectiveCatalog(courseKey)
      .then((catalog) => {
        if (!isCancelled) {
          setCatalogState({ catalog, courseKey, error: null });
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setCatalogState({ catalog: null, courseKey, error: true });
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [courseKey, loadAttempt, meta?.hasCatalog]);

  const catalog =
    catalogState?.courseKey === courseKey ? catalogState.catalog : null;
  const hasLoadError =
    catalogState?.courseKey === courseKey && catalogState.error;
  const disciplines = useMemo(
    () => getHydratedDisciplines(catalog),
    [catalog],
  );
  const areas = useMemo(
    () =>
      [...new Set(disciplines.flatMap((discipline) => discipline.areas))].sort(
        (left, right) => left.localeCompare(right, "pt-BR"),
      ),
    [disciplines],
  );
  const types = useMemo(
    () =>
      [...new Set(disciplines.flatMap((discipline) => discipline.types))].sort(
        (left, right) => left.localeCompare(right, "pt-BR"),
      ),
    [disciplines],
  );
  const normalizedSearch = normalizeForSearch(deferredSearch);
  const filteredDisciplines = useMemo(
    () => {
      const searchTerms = normalizedSearch.split(" ").filter(Boolean);

      return disciplines.filter(
        (discipline) =>
          (activeArea === "all" || discipline.areas.includes(activeArea)) &&
          (activeType === "all" || discipline.types.includes(activeType)) &&
          searchTerms.every((term) => discipline.searchText.includes(term)),
      );
    },
    [activeArea, activeType, disciplines, normalizedSearch],
  );
  const visibleDisciplines = filteredDisciplines.slice(0, visibleCount);
  const hiddenCount = filteredDisciplines.length - visibleDisciplines.length;

  function updateExplorerState(patch) {
    setExplorerState((currentState) => {
      const nextState = { ...currentState, ...patch };

      explorerStateCache.set(courseKey, nextState);
      return nextState;
    });
  }

  function handleSearchChange(event) {
    updateExplorerState({
      search: event.target.value,
      visibleCount: INITIAL_VISIBLE_COUNT,
    });
  }

  function handleAreaChange(event) {
    updateExplorerState({
      activeArea: event.target.value,
      visibleCount: INITIAL_VISIBLE_COUNT,
    });
  }

  function handleTypeChange(event) {
    updateExplorerState({
      activeType: event.target.value,
      visibleCount: INITIAL_VISIBLE_COUNT,
    });
  }

  if (!meta) return null;

  const sectionLabel = meta.hasCatalog
    ? `Eletivas de ${courseLabel}`
    : `Formação flexível de ${courseLabel}`;

  return (
    <section aria-labelledby="electives-title" className={styles.explorer}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>
            {meta.hasCatalog ? "Catálogo de eletivas" : "Formação flexível"}
          </p>
          <h2 id="electives-title">{sectionLabel}</h2>
          <p className={styles.description}>{meta.description}</p>
        </div>
        <div className={styles.requirement}>
          <span>Exigência curricular</span>
          <strong>{meta.minimum}</strong>
        </div>
      </header>

      <div className={styles.sourceActions}>
        <a href={meta.sourceUrl} rel="noreferrer" target="_blank">
          {meta.hasCatalog ? "Abrir catálogo oficial" : "Abrir matriz oficial"}
          <span aria-hidden="true">↗</span>
        </a>
        {meta.offerUrl ? (
          <a href={meta.offerUrl} rel="noreferrer" target="_blank">
            Ver oferta atual <span aria-hidden="true">↗</span>
          </a>
        ) : null}
      </div>

      {!meta.hasCatalog ? (
        <div className={styles.openChoice}>
          <span aria-hidden="true" className={styles.openChoiceIcon}>
            ↗
          </span>
          <div>
            <h3>{meta.emptyTitle}</h3>
            <p>
              Use o botão acima para consultar as possibilidades previstas na
              matriz deste curso.
            </p>
          </div>
        </div>
      ) : hasLoadError ? (
        <div className={styles.error} role="alert">
          <div>
            <h3>Não foi possível abrir o catálogo</h3>
            <p>Tente carregar novamente. A fonte oficial continua disponível acima.</p>
          </div>
          <button
            onClick={() => {
              setCatalogState(null);
              setLoadAttempt((currentAttempt) => currentAttempt + 1);
            }}
            type="button"
          >
            Tentar novamente
          </button>
        </div>
      ) : !catalog ? (
        <CatalogLoading />
      ) : (
        <>
          <div className={styles.filters}>
            <div className={styles.searchField}>
              <label htmlFor={searchId}>Buscar eletiva</label>
              <input
                id={searchId}
                onChange={handleSearchChange}
                placeholder="Código ou nome da disciplina"
                type="search"
                value={search}
              />
            </div>

            {areas.length > 1 ? (
              <div className={styles.selectField}>
                <label htmlFor={areaId}>Área</label>
                <select
                  id={areaId}
                  onChange={handleAreaChange}
                  value={activeArea}
                >
                  <option value="all">Todas as áreas</option>
                  {areas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}

            {types.length > 1 ? (
              <div className={styles.selectField}>
                <label htmlFor={typeId}>Categoria</label>
                <select
                  id={typeId}
                  onChange={handleTypeChange}
                  value={activeType}
                >
                  <option value="all">Todas as categorias</option>
                  {types.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
          </div>

          <div className={styles.resultsHeading}>
            <p aria-live="polite">
              Mostrando {visibleDisciplines.length} de{" "}
              {filteredDisciplines.length}{" "}
              {pluralize(filteredDisciplines.length, "disciplina", "disciplinas")}
            </p>
            {(search || activeArea !== "all" || activeType !== "all") && (
              <button
                onClick={() => {
                  updateExplorerState({
                    activeArea: "all",
                    activeType: "all",
                    search: "",
                    visibleCount: INITIAL_VISIBLE_COUNT,
                  });
                }}
                type="button"
              >
                Limpar filtros
              </button>
            )}
          </div>

          {visibleDisciplines.length > 0 ? (
            <>
              <div className={styles.cardGrid}>
                {visibleDisciplines.map((discipline) => (
                  <article className={styles.card} key={discipline.code}>
                    <div className={styles.cardTopline}>
                      <strong>{discipline.code}</strong>
                      <span>{discipline.hours} h</span>
                    </div>
                    <h3>{discipline.name}</h3>
                    <div className={styles.tags}>
                      {discipline.types.map((type) => (
                        <span className={styles.typeTag} key={type}>
                          {type}
                        </span>
                      ))}
                      {discipline.areas.map((area) => (
                        <span key={area}>{area}</span>
                      ))}
                    </div>
                    <p className={styles.prerequisites}>
                      <b>Pré-requisitos:</b>{" "}
                      {discipline.prerequisites || "não informado na lista"}
                    </p>
                  </article>
                ))}
              </div>

              {hiddenCount > 0 ? (
                <button
                  className={styles.loadMore}
                  onClick={() =>
                    updateExplorerState({
                      visibleCount:
                        visibleCount + VISIBLE_COUNT_INCREMENT,
                    })
                  }
                  type="button"
                >
                  Mostrar mais {Math.min(hiddenCount, VISIBLE_COUNT_INCREMENT)}
                </button>
              ) : null}
            </>
          ) : (
            <div className={styles.empty} role="status">
              <h3>Nenhuma eletiva encontrada</h3>
              <p>Tente outro termo ou remova um dos filtros.</p>
            </div>
          )}
        </>
      )}
    </section>
  );
}
