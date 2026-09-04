function hasValidFrame(frame) {
  return (
    frame &&
    [frame.left, frame.right, frame.top, frame.bottom].every(Number.isFinite) &&
    frame.right > frame.left &&
    frame.bottom > frame.top
  );
}

function rounded(value) {
  return Math.round(value * 10) / 10;
}

export function buildCurriculumArrowEdges(
  curriculum,
  selectedCode,
  visibleCodes,
  { directOnly = false } = {},
) {
  if (!curriculum?.disciplines || !curriculum.byCode) return [];

  const selectedDiscipline = selectedCode
    ? curriculum.byCode.get(selectedCode)
    : null;
  const selectedPrerequisites = new Set(
    selectedDiscipline?.prerequisites ?? [],
  );
  const selectedUnlocks = new Set(
    selectedDiscipline
      ? (curriculum.unlocksByCode.get(selectedDiscipline.code) ?? []).map(
          ({ code }) => code,
        )
      : [],
  );
  const edges = [];
  const seenEdges = new Set();

  for (const discipline of curriculum.disciplines) {
    if (visibleCodes && !visibleCodes.has(discipline.code)) continue;

    for (const prerequisiteCode of discipline.prerequisites) {
      if (
        !curriculum.byCode.has(prerequisiteCode) ||
        (visibleCodes && !visibleCodes.has(prerequisiteCode))
      ) {
        continue;
      }

      const edgeKey = `${prerequisiteCode}->${discipline.code}`;
      if (seenEdges.has(edgeKey)) continue;

      let relation = "default";

      if (selectedDiscipline) {
        if (
          discipline.code === selectedDiscipline.code &&
          selectedPrerequisites.has(prerequisiteCode)
        ) {
          relation = "prerequisite";
        } else if (
          prerequisiteCode === selectedDiscipline.code &&
          selectedUnlocks.has(discipline.code)
        ) {
          relation = "unlock";
        } else {
          relation = "dimmed";
        }
      }

      if (directOnly && !["prerequisite", "unlock"].includes(relation)) {
        continue;
      }

      seenEdges.add(edgeKey);
      edges.push({
        from: prerequisiteCode,
        relation,
        to: discipline.code,
      });
    }
  }

  return edges;
}

export function buildCurriculumArrowPath(sourceFrame, targetFrame) {
  if (!hasValidFrame(sourceFrame) || !hasValidFrame(targetFrame)) {
    return null;
  }

  const sourceCenterY = rounded(
    sourceFrame.top + (sourceFrame.bottom - sourceFrame.top) / 2,
  );
  const targetCenterY = rounded(
    targetFrame.top + (targetFrame.bottom - targetFrame.top) / 2,
  );
  let start;
  let end;
  let firstControlX;
  let secondControlX;

  if (targetFrame.left >= sourceFrame.right) {
    start = { x: rounded(sourceFrame.right), y: sourceCenterY };
    end = { x: rounded(targetFrame.left - 2), y: targetCenterY };
    const bend = Math.max(18, (end.x - start.x) / 2);
    firstControlX = rounded(start.x + bend);
    secondControlX = rounded(end.x - bend);
  } else if (targetFrame.right <= sourceFrame.left) {
    start = { x: rounded(sourceFrame.left), y: sourceCenterY };
    end = { x: rounded(targetFrame.right + 2), y: targetCenterY };
    const bend = Math.max(18, (start.x - end.x) / 2);
    firstControlX = rounded(start.x - bend);
    secondControlX = rounded(end.x + bend);
  } else {
    start = { x: rounded(sourceFrame.right), y: sourceCenterY };
    end = { x: rounded(targetFrame.right + 2), y: targetCenterY };
    const routeX = rounded(
      Math.max(sourceFrame.right, targetFrame.right) + 24,
    );
    firstControlX = routeX;
    secondControlX = routeX;
  }

  return {
    d: `M ${start.x} ${start.y} C ${firstControlX} ${start.y}, ${secondControlX} ${end.y}, ${end.x} ${end.y}`,
    end,
    start,
  };
}
