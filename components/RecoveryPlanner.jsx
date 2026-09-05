"use client";

import { memo, useId, useMemo, useState } from "react";

import styles from "./RecoveryPlanner.module.css";

export const RECOVERY_PLANNER_DEFAULTS = Object.freeze({
  lookaheadPeriods: 1,
  maxSubjects: 8,
});

function parsePrerequisites(value) {
  if (Array.isArray(value)) {
    return value.filter(
      (code) => typeof code === "string" && code.trim().length > 0,
    );
  }

  return String(value ?? "")
    .split("|")
    .map((code) => code.trim())
    .filter(Boolean);
}

function normalizeDiscipline(entry, fallbackPeriod) {
  if (Array.isArray(entry)) {
    const [
      code,
      name,
      value,
      prerequisiteString,
      corequisiteString,
    ] = entry;

    return {
      code,
      corequisites: parsePrerequisites(corequisiteString),
      name,
      period: fallbackPeriod,
      prerequisites: parsePrerequisites(prerequisiteString),
      value: Number(value) || 0,
    };
  }

  if (!entry || typeof entry !== "object") {
    return null;
  }

  return {
    ...entry,
    code: entry.code,
    corequisites: parsePrerequisites(
      entry.corequisites ?? entry.coreqs,
    ),
    name: entry.name,
    period: Number(entry.period) || fallbackPeriod,
    prerequisites: parsePrerequisites(
      entry.prerequisites ?? entry.prereqs,
    ),
    value: Number(entry.value) || 0,
  };
}

function getCurriculumLabel(curriculum) {
  if (curriculum.label) {
    return curriculum.label;
  }

  return String(curriculum.title ?? "Grade selecionada")
    .replace(/^Fluxo Curricular\s*[—-]\s*/, "")
    .replace(/^Eng\. Elétrica:\s*/, "Engenharia Elétrica — ");
}

function normalizeCurriculum(curriculum) {
  if (!curriculum || !curriculum.periods) {
    return null;
  }

  if (
    Array.isArray(curriculum.disciplines) &&
    curriculum.byCode instanceof Map &&
    curriculum.corequisitesByCode instanceof Map &&
    curriculum.unlocksByCode instanceof Map &&
    Number.isInteger(curriculum.periodCount)
  ) {
    return curriculum;
  }

  const periodEntries = Array.isArray(curriculum.periods)
    ? curriculum.periods.map((entries, index) => [index + 1, entries])
    : Object.entries(curriculum.periods)
        .map(([period, entries]) => [Number(period), entries])
        .sort(([left], [right]) => left - right);
  const periods = periodEntries.map(([period, entries]) =>
    (Array.isArray(entries) ? entries : [])
      .map((entry) => normalizeDiscipline(entry, period))
      .filter(
        (discipline) =>
          discipline &&
          typeof discipline.code === "string" &&
          typeof discipline.name === "string",
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
    ...curriculum,
    byCode,
    corequisitesByCode,
    disciplines,
    label: getCurriculumLabel(curriculum),
    periodCount: periods.length,
    periods,
    unlocksByCode,
  };
}

function clampPositiveInteger(value, fallback) {
  const parsedValue = Number.parseInt(value, 10);
  return Number.isFinite(parsedValue) && parsedValue > 0
    ? parsedValue
    : fallback;
}

function getPendingCorequisiteGroup(
  curriculum,
  initialCode,
  pendingCodes,
) {
  const groupCodes = new Set();
  const queue = [initialCode];

  for (let index = 0; index < queue.length; index += 1) {
    const code = queue[index];
    if (groupCodes.has(code) || !pendingCodes.has(code)) continue;

    groupCodes.add(code);
    for (const corequisite of curriculum.corequisitesByCode.get(code) ?? []) {
      if (pendingCodes.has(corequisite.code) && !groupCodes.has(corequisite.code)) {
        queue.push(corequisite.code);
      }
    }
  }

  return [...groupCodes]
    .map((code) => curriculum.byCode.get(code))
    .filter(Boolean);
}

function getEligibleDisciplineGroups(
  curriculum,
  pendingCodes,
  passedCodes,
  maximumOriginalPeriod,
) {
  const visitedCodes = new Set();
  const groups = [];

  for (const code of pendingCodes) {
    if (visitedCodes.has(code)) continue;

    const group = getPendingCorequisiteGroup(
      curriculum,
      code,
      pendingCodes,
    );
    group.forEach((discipline) => visitedCodes.add(discipline.code));

    const isEligible = group.every(
      (discipline) =>
        discipline.period <= maximumOriginalPeriod &&
        discipline.prerequisites.every((prerequisite) =>
          passedCodes.has(prerequisite),
        ),
    );

    if (isEligible) groups.push(group);
  }

  return groups;
}

function compareDisciplines(
  left,
  right,
  curriculum,
  failedCode,
) {
  if (left.code === failedCode && right.code !== failedCode) {
    return -1;
  }

  if (right.code === failedCode && left.code !== failedCode) {
    return 1;
  }

  if (left.period !== right.period) {
    return left.period - right.period;
  }

  const unlockDifference =
    (curriculum.unlocksByCode.get(right.code)?.length ?? 0) -
    (curriculum.unlocksByCode.get(left.code)?.length ?? 0);

  if (unlockDifference !== 0) {
    return unlockDifference;
  }

  if (left.value !== right.value) {
    return right.value - left.value;
  }

  return left.name.localeCompare(right.name, "pt-BR");
}

function compareDisciplineGroups(
  leftGroup,
  rightGroup,
  curriculum,
  failedCode,
) {
  const leftContainsFailure = leftGroup.some(({ code }) => code === failedCode);
  const rightContainsFailure = rightGroup.some(({ code }) => code === failedCode);

  if (leftContainsFailure !== rightContainsFailure) {
    return leftContainsFailure ? -1 : 1;
  }

  const leftLead = [...leftGroup].sort((left, right) =>
    compareDisciplines(left, right, curriculum, failedCode),
  )[0];
  const rightLead = [...rightGroup].sort((left, right) =>
    compareDisciplines(left, right, curriculum, failedCode),
  )[0];

  return compareDisciplines(leftLead, rightLead, curriculum, failedCode);
}

function selectDisciplineGroups(
  groups,
  maximumSubjects,
  curriculum,
  failedCode,
) {
  const selectedGroups = [];
  let availableSlots = maximumSubjects;

  for (const group of [...groups].sort((left, right) =>
    compareDisciplineGroups(left, right, curriculum, failedCode),
  )) {
    if (group.length > availableSlots) continue;

    selectedGroups.push(
      [...group].sort((left, right) =>
        compareDisciplines(left, right, curriculum, failedCode),
      ),
    );
    availableSlots -= group.length;
  }

  return selectedGroups.flat();
}

/**
 * Monta a simulação de recuperação do HELPIEEE em uma função pura.
 *
 * `curriculum` aceita tanto a definição bruta de `lib/curricula.js` quanto o
 * objeto hidratado usado por `CurriculumExplorer`. Retorna `null` quando a
 * disciplina não pertence ao 1º período.
 */
export function generateRecoveryPlan(
  curriculum,
  failedCode,
  {
    lookaheadPeriods = RECOVERY_PLANNER_DEFAULTS.lookaheadPeriods,
    maxSubjects = RECOVERY_PLANNER_DEFAULTS.maxSubjects,
  } = {},
) {
  const normalizedCurriculum = normalizeCurriculum(curriculum);

  if (!normalizedCurriculum || !failedCode) {
    return null;
  }

  const normalizedMaxSubjects = clampPositiveInteger(
    maxSubjects,
    RECOVERY_PLANNER_DEFAULTS.maxSubjects,
  );
  const normalizedLookahead = Math.max(
    0,
    Number.parseInt(lookaheadPeriods, 10) || 0,
  );
  const firstPeriod = normalizedCurriculum.periods[0] ?? [];
  const firstPeriodCodes = firstPeriod.map(({ code }) => code);
  const failedDiscipline = normalizedCurriculum.byCode.get(failedCode);

  if (!failedDiscipline || !firstPeriodCodes.includes(failedCode)) {
    return null;
  }

  const passedCodes = new Set(
    firstPeriodCodes.filter((code) => code !== failedCode),
  );
  const pendingCodes = new Set(
    normalizedCurriculum.disciplines
      .filter(({ code }) => !passedCodes.has(code))
      .map(({ code }) => code),
  );
  const semesters = [];
  let suggestedSemester = 2;

  while (pendingCodes.size > 0) {
    let maximumOriginalPeriod = Math.min(
      normalizedCurriculum.periodCount,
      suggestedSemester + normalizedLookahead,
    );
    let eligibleGroups = getEligibleDisciplineGroups(
      normalizedCurriculum,
      pendingCodes,
      passedCodes,
      maximumOriginalPeriod,
    );

    while (
      eligibleGroups.length === 0 &&
      maximumOriginalPeriod < normalizedCurriculum.periodCount
    ) {
      maximumOriginalPeriod += 1;
      eligibleGroups = getEligibleDisciplineGroups(
        normalizedCurriculum,
        pendingCodes,
        passedCodes,
        maximumOriginalPeriod,
      );
    }

    if (eligibleGroups.length === 0) {
      break;
    }

    const semesterDisciplines = selectDisciplineGroups(
      eligibleGroups,
      normalizedMaxSubjects,
      normalizedCurriculum,
      failedCode,
    );

    if (semesterDisciplines.length === 0) {
      break;
    }

    semesters.push({
      disciplines: semesterDisciplines,
      suggestedSemester,
    });

    for (const discipline of semesterDisciplines) {
      pendingCodes.delete(discipline.code);
      passedCodes.add(discipline.code);
    }

    suggestedSemester += 1;
  }

  return {
    curriculum: normalizedCurriculum,
    failedDiscipline,
    firstPeriodPassedCount: firstPeriodCodes.length - 1,
    maxSubjects: normalizedMaxSubjects,
    semesters,
    totalCourseCount: normalizedCurriculum.disciplines.length,
    unresolved: [...pendingCodes]
      .map((code) => normalizedCurriculum.byCode.get(code))
      .filter(Boolean),
  };
}

function pluralize(count, singular, plural) {
  return count === 1 ? singular : plural;
}

function getDisciplineNote(discipline, suggestedSemester, failedCode) {
  const corequisiteNote = discipline.corequisites.length
    ? ` · correquisito: ${discipline.corequisites.join(", ")}`
    : "";

  if (discipline.code === failedCode) {
    return `Repetição da disciplina reprovada${corequisiteNote}`;
  }

  if (discipline.period > suggestedSemester) {
    return `${discipline.period}º período original · disciplina adiantada${corequisiteNote}`;
  }

  if (discipline.period < suggestedSemester) {
    return `${discipline.period}º período original · disciplina reposicionada${corequisiteNote}`;
  }

  return `${discipline.period}º período original${corequisiteNote}`;
}

/**
 * Simulador de recuperação após uma única reprovação no 1º período.
 *
 * Props:
 * - curriculum: definição bruta ou currículo hidratado do fluxo (obrigatório)
 * - curriculumKey: identidade estável do curso; use o slug da grade
 * - maxSubjects: teto de disciplinas por semestre (padrão: 8)
 * - lookaheadPeriods: quantos períodos futuros podem ser adiantados (padrão: 1)
 * - className: classe opcional para o contêiner externo
 */
function RecoveryPlanner({
  className = "",
  curriculum,
  curriculumKey,
  lookaheadPeriods = RECOVERY_PLANNER_DEFAULTS.lookaheadPeriods,
  maxSubjects = RECOVERY_PLANNER_DEFAULTS.maxSubjects,
}) {
  const titleId = useId();
  const selectId = useId();
  const hintId = useId();
  const normalizedCurriculum = useMemo(
    () => normalizeCurriculum(curriculum),
    [curriculum],
  );
  const activeCurriculumKey = String(
    curriculumKey ??
      normalizedCurriculum?.slug ??
      normalizedCurriculum?.title ??
      normalizedCurriculum?.label ??
      "curriculum",
  );
  const [selection, setSelection] = useState({ code: "", curriculumKey: "" });
  const [submission, setSubmission] = useState({
    code: "",
    curriculumKey: "",
  });
  const firstPeriod = normalizedCurriculum?.periods[0] ?? [];
  const isAvailable = Boolean(normalizedCurriculum && firstPeriod.length > 0);
  const selectedCode =
    selection.curriculumKey === activeCurriculumKey &&
    firstPeriod.some(({ code }) => code === selection.code)
      ? selection.code
      : "";
  const submittedCode =
    submission.curriculumKey === activeCurriculumKey &&
    firstPeriod.some(({ code }) => code === submission.code)
      ? submission.code
      : "";
  const plan = useMemo(
    () =>
      submittedCode
        ? generateRecoveryPlan(normalizedCurriculum, submittedCode, {
            lookaheadPeriods,
            maxSubjects,
          })
        : null,
    [
      lookaheadPeriods,
      maxSubjects,
      normalizedCurriculum,
      submittedCode,
    ],
  );
  const containerClassName = [styles.planner, className]
    .filter(Boolean)
    .join(" ");
  const totalPlannedSubjects =
    plan?.semesters.reduce(
      (total, semester) => total + semester.disciplines.length,
      0,
    ) ?? 0;
  const lastSuggestedSemester =
    plan?.semesters.at(-1)?.suggestedSemester ?? 1;

  function handleSubmit(event) {
    event.preventDefault();

    if (!selectedCode) {
      return;
    }

    setSubmission({
      code: selectedCode,
      curriculumKey: activeCurriculumKey,
    });
  }

  return (
    <section aria-labelledby={titleId} className={containerClassName}>
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Depois de uma reprovação</p>
          <h2 className={styles.title} id={titleId}>
            Simule um plano de recuperação
          </h2>
          <p className={styles.lead}>
            Veja uma sugestão de sequência para reduzir o impacto de uma única
            reprovação no 1º período, sempre respeitando os pré-requisitos
            cadastrados.
          </p>
        </div>
        <span className={styles.limitBadge}>
          Até {clampPositiveInteger(maxSubjects, 8)} matérias/semestre
        </span>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor={selectId}>Qual disciplina você reprovou?</label>
          <select
            aria-describedby={hintId}
            disabled={!isAvailable}
            id={selectId}
            onChange={(event) => {
              setSelection({
                code: event.target.value,
                curriculumKey: activeCurriculumKey,
              });
            }}
            value={selectedCode}
          >
            <option value="">Selecione uma disciplina do 1º período</option>
            {firstPeriod.map((discipline) => (
              <option key={discipline.code} value={discipline.code}>
                {discipline.code} — {discipline.name}
              </option>
            ))}
          </select>
          <p className={styles.hint} id={hintId}>
            {isAvailable
              ? `Grade analisada: ${normalizedCurriculum.label}. A simulação considera aprovação nas demais disciplinas do 1º período.`
              : "Não foi possível identificar as disciplinas obrigatórias do 1º período desta grade."}
          </p>
        </div>

        <button disabled={!selectedCode} type="submit">
          Montar plano sugerido
        </button>
      </form>

      <p aria-live="polite" className={styles.liveStatus} role="status">
        {plan
          ? `Plano montado para ${plan.failedDiscipline.name}: ${plan.semesters.length} semestres sugeridos.`
          : submittedCode
            ? "Não foi possível montar um plano para a disciplina escolhida."
            : ""}
      </p>

      {!isAvailable ? (
        <div className={styles.emptyState} role="status">
          O simulador precisa da base do 1º período para montar um plano. O
          restante do fluxo curricular continua disponível normalmente.
        </div>
      ) : !submittedCode ? (
        <div className={styles.emptyState}>
          Selecione a disciplina reprovada para gerar a recomendação do 2º
          semestre em diante.
        </div>
      ) : plan ? (
        <div className={styles.result}>
          <div className={styles.summary}>
            <div className={styles.summaryIntro}>
              <p className={styles.summaryEyebrow}>Cenário simulado</p>
              <h3>{plan.failedDiscipline.name}</h3>
              <p>
                Consideramos aprovação nas outras {plan.firstPeriodPassedCount}{" "}
                {pluralize(
                  plan.firstPeriodPassedCount,
                  "disciplina",
                  "disciplinas",
                )}{" "}
                do 1º período e reorganizamos a sequência para reduzir o
                impacto da reprovação.
              </p>
            </div>

            <dl className={styles.stats}>
              <div>
                <dt>Disciplina reprovada</dt>
                <dd>{plan.failedDiscipline.code}</dd>
              </div>
              <div>
                <dt>Semestres sugeridos</dt>
                <dd>{plan.semesters.length}</dd>
              </div>
              <div>
                <dt>Último semestre previsto</dt>
                <dd>{lastSuggestedSemester}º</dd>
              </div>
              <div>
                <dt>Matérias planejadas</dt>
                <dd>
                  {totalPlannedSubjects}/
                  {plan.totalCourseCount - plan.firstPeriodPassedCount}
                </dd>
              </div>
            </dl>
          </div>

          <div className={styles.semesterGrid}>
            {plan.semesters.map((semester) => (
              <article
                className={styles.semester}
                key={semester.suggestedSemester}
              >
                <header>
                  <div>
                    <p>{semester.suggestedSemester}º semestre sugerido</p>
                    <h4>
                      {semester.disciplines.length}{" "}
                      {pluralize(
                        semester.disciplines.length,
                        "matéria planejada",
                        "matérias planejadas",
                      )}
                    </h4>
                  </div>
                  <span>
                    {semester.disciplines.length}/{plan.maxSubjects}
                  </span>
                </header>

                <ul>
                  {semester.disciplines.map((discipline) => (
                    <li key={discipline.code}>
                      <span className={styles.disciplineCode}>
                        {discipline.code}
                      </span>
                      <strong>{discipline.name}</strong>
                      <small>
                        {getDisciplineNote(
                          discipline,
                          semester.suggestedSemester,
                          plan.failedDiscipline.code,
                        )}
                      </small>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          {plan.unresolved.length > 0 ? (
            <div className={styles.warning} role="note">
              <strong>Revisão manual necessária.</strong> Restaram{" "}
              {plan.unresolved.length}{" "}
              {pluralize(
                plan.unresolved.length,
                "disciplina sem encaixe automático",
                "disciplinas sem encaixe automático",
              )}
              . Isso pode indicar pré-requisito ausente na base ou uma situação
              que precisa da coordenação.
            </div>
          ) : null}
        </div>
      ) : (
        <div className={styles.emptyState} role="status">
          Não foi possível montar a simulação com a disciplina escolhida. Tente
          outra matéria do 1º período.
        </div>
      )}
    </section>
  );
}

export default memo(RecoveryPlanner);
