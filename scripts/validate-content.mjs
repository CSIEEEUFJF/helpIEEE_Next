#!/usr/bin/env node

// Os arquivos de dados usam ESM, embora o package.json não declare `type: module`.
// O Node 25 emite um aviso meramente informativo nesse caso; suprimimos o aviso
// para que a saída deste validador contenha apenas resultados acionáveis.
process.removeAllListeners('warning');

const [guideModule, curriculumModule] = await Promise.all([
  import('../lib/guides.js'),
  import('../lib/curricula.js'),
]);

const {
  CONTENT_REVIEW_DATE,
  editorialNotes,
  guides,
  legacySlugMap,
  officialLinks,
} = guideModule;
const { FLOW_CURRICULA } = curriculumModule;

const errors = [];
const URL_BASE = 'https://helpieee.local';
const REQUIRED_GUIDE_FIELDS = [
  'slug',
  'category',
  'eyebrow',
  'title',
  'summary',
  'audience',
  'scope',
  'sourceLabel',
];
const REQUIRED_CURRICULUM_FIELDS = [
  'title',
  'subtitle',
  'unitShort',
  'unitLong',
  'valueLabel',
];
const STATIC_INTERNAL_PATHS = new Set([
  '/',
  '/guia',
  '/fluxo',
  '/oportunidades',
  '/sobre',
]);

function report(location, message) {
  errors.push(`${location}: ${message}`);
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function normalize(value) {
  return value.trim().replace(/\s+/g, ' ').toLocaleLowerCase('pt-BR');
}

function requireText(record, fields, location) {
  for (const field of fields) {
    if (!isNonEmptyString(record?.[field])) {
      report(location, `campo obrigatório "${field}" ausente ou vazio`);
    }
  }
}

function requireArray(record, field, location, { allowEmpty = false } = {}) {
  if (!Array.isArray(record?.[field])) {
    report(location, `campo obrigatório "${field}" deve ser uma lista`);
    return [];
  }

  if (!allowEmpty && record[field].length === 0) {
    report(location, `campo obrigatório "${field}" não pode estar vazio`);
  }

  return record[field];
}

function validateUniqueValues(entries, description) {
  const firstLocationByValue = new Map();

  for (const { value, location } of entries) {
    if (!isNonEmptyString(value)) continue;

    const normalizedValue = normalize(value);
    const firstLocation = firstLocationByValue.get(normalizedValue);

    if (firstLocation) {
      report(location, `${description} duplicado; primeira ocorrência em ${firstLocation}`);
    } else {
      firstLocationByValue.set(normalizedValue, location);
    }
  }
}

function isValidIsoDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}

function validateReviewedAt(value, location) {
  if (!isValidIsoDate(value)) {
    report(location, 'reviewedAt deve ser uma data ISO real no formato YYYY-MM-DD');
  }
}

function getCurrentSemester() {
  const today = new Date();
  return {
    year: today.getFullYear(),
    semester: today.getMonth() < 6 ? 1 : 2,
  };
}

function semesterIndex(year, semester) {
  return year * 2 + semester - 1;
}

function findSemesterReferences(text) {
  const references = [];
  const yearFirstPattern = /\b(20\d{2})\s*[./-]\s*([12])\b/g;
  const semesterFirstPattern = /\b([12])(?:º|o)?\s*(?:º\s*)?(?:semestre|período)\s*(?:de\s*)?(20\d{2})\b/giu;

  for (const match of text.matchAll(yearFirstPattern)) {
    references.push({ year: Number(match[1]), semester: Number(match[2]), raw: match[0] });
  }

  for (const match of text.matchAll(semesterFirstPattern)) {
    references.push({ year: Number(match[2]), semester: Number(match[1]), raw: match[0] });
  }

  return references;
}

function validateTemporalText(value, location) {
  if (!isNonEmptyString(value)) return;

  const current = getCurrentSemester();
  const currentIndex = semesterIndex(current.year, current.semester);

  for (const reference of findSemesterReferences(value)) {
    if (semesterIndex(reference.year, reference.semester) < currentIndex) {
      report(
        location,
        `referência ao semestre anterior "${reference.raw}"; o semestre corrente é ${current.year}.${current.semester}`,
      );
    }
  }
}

function validateExternalHref(href, location) {
  if (!isNonEmptyString(href) || href !== href.trim() || /\s/.test(href)) {
    report(location, 'link externo ausente ou com espaços');
    return;
  }

  let parsed;
  try {
    parsed = new URL(href);
  } catch {
    report(location, `URL externa inválida: "${href}"`);
    return;
  }

  if (parsed.protocol !== 'https:') {
    report(location, `link externo deve usar HTTPS: "${href}"`);
  }

  if (!parsed.hostname) {
    report(location, `link externo não possui domínio: "${href}"`);
  }

  if (parsed.username || parsed.password) {
    report(location, `link externo não pode conter credenciais: "${href}"`);
  }
}

function getGuideRoute(href) {
  const parsed = new URL(href, URL_BASE);
  const match = parsed.pathname.match(/^\/guia\/([^/]+)$/);
  return match ? { parsed, slug: decodeURIComponent(match[1]) } : { parsed, slug: null };
}

function validateInternalHref(href, location, guideBySlug) {
  if (!isNonEmptyString(href) || !href.startsWith('/') || href.startsWith('//')) {
    report(location, `link interno inválido: "${href ?? ''}"`);
    return;
  }

  let route;
  try {
    route = getGuideRoute(href);
  } catch {
    report(location, `link interno inválido: "${href}"`);
    return;
  }

  const { parsed, slug } = route;
  if (parsed.origin !== URL_BASE || parsed.username || parsed.password) {
    report(location, `link interno deve permanecer no site: "${href}"`);
    return;
  }

  if (slug) {
    const guide = guideBySlug.get(slug);
    if (!guide) {
      report(location, `link aponta para guia desconhecido: "${href}"`);
      return;
    }

    if (parsed.hash) {
      const sectionId = decodeURIComponent(parsed.hash.slice(1));
      const knownSection = Array.isArray(guide.sections)
        && guide.sections.some((section) => section?.id === sectionId);
      if (!knownSection) {
        report(location, `âncora aponta para seção desconhecida: "${href}"`);
      }
    }
    return;
  }

  if (!STATIC_INTERNAL_PATHS.has(parsed.pathname)) {
    report(location, `link aponta para rota interna desconhecida: "${href}"`);
  }
}

function validateLink(link, location, guideBySlug) {
  if (!link || typeof link !== 'object' || Array.isArray(link)) {
    report(location, 'link deve ser um objeto');
    return;
  }

  requireText(link, ['label', 'href', 'kind'], location);
  validateTemporalText(link.label, `${location}.label`);

  if (!isNonEmptyString(link.href)) return;

  if (link.href.startsWith('/') && !link.href.startsWith('//')) {
    if (link.kind !== 'internal') {
      report(location, 'link relativo deve usar kind "internal"');
    }
    validateInternalHref(link.href, `${location}.href`, guideBySlug);
  } else {
    if (link.kind === 'internal') {
      report(location, 'link com kind "internal" deve começar com /');
    }
    validateExternalHref(link.href, `${location}.href`);
  }
}

function validateTextArray(values, location, { allowEmpty = false } = {}) {
  if (!allowEmpty && values.length === 0) {
    report(location, 'lista de conteúdo não pode estar vazia');
  }

  const entries = [];
  values.forEach((value, index) => {
    const valueLocation = `${location}[${index}]`;
    if (!isNonEmptyString(value)) {
      report(valueLocation, 'valor deve ser um texto não vazio');
      return;
    }

    validateTemporalText(value, valueLocation);
    entries.push({ value, location: valueLocation });
  });
  validateUniqueValues(entries, 'texto');
}

function validateGuides() {
  if (!Array.isArray(guides) || guides.length === 0) {
    report('guides', 'deve exportar uma lista não vazia');
    return { guideCount: 0, sectionCount: 0, itemCount: 0, linkCount: 0 };
  }

  const guideBySlug = new Map(
    guides
      .filter((guide) => isNonEmptyString(guide?.slug))
      .map((guide) => [guide.slug, guide]),
  );
  const guideIdentities = [];
  const guideTitles = [];
  const guideSummaries = [];
  const sectionIdentities = [];
  const legacyIdentities = [];
  const itemSignatures = [];
  let sectionCount = 0;
  let itemCount = 0;
  let linkCount = 0;

  guides.forEach((guide, guideIndex) => {
    const guideLocation = `guides[${guideIndex}]${guide?.slug ? ` (${guide.slug})` : ''}`;
    if (!guide || typeof guide !== 'object' || Array.isArray(guide)) {
      report(guideLocation, 'guia deve ser um objeto');
      return;
    }

    requireText(guide, REQUIRED_GUIDE_FIELDS, guideLocation);
    if (isNonEmptyString(guide.slug) && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(guide.slug)) {
      report(`${guideLocation}.slug`, 'slug deve usar apenas minúsculas, números e hífens');
    }
    validateReviewedAt(guide.reviewedAt, `${guideLocation}.reviewedAt`);

    for (const field of ['category', 'eyebrow', 'title', 'summary', 'audience', 'scope']) {
      validateTemporalText(guide[field], `${guideLocation}.${field}`);
    }

    guideIdentities.push({ value: guide.slug, location: `${guideLocation}.slug` });
    guideTitles.push({ value: guide.title, location: `${guideLocation}.title` });
    guideSummaries.push({ value: guide.summary, location: `${guideLocation}.summary` });

    const keywords = requireArray(guide, 'keywords', guideLocation);
    validateTextArray(keywords, `${guideLocation}.keywords`);

    const legacySlugs = requireArray(guide, 'legacySlugs', guideLocation, { allowEmpty: true });
    legacySlugs.forEach((legacySlug, legacyIndex) => {
      const legacyLocation = `${guideLocation}.legacySlugs[${legacyIndex}]`;
      if (!isNonEmptyString(legacySlug)) {
        report(legacyLocation, 'slug legado deve ser um texto não vazio');
        return;
      }
      legacyIdentities.push({ value: legacySlug, location: legacyLocation });
    });

    const sections = requireArray(guide, 'sections', guideLocation);
    sections.forEach((section, sectionIndex) => {
      sectionCount += 1;
      const sectionLocation = `${guideLocation}.sections[${sectionIndex}]${section?.id ? ` (${section.id})` : ''}`;
      if (!section || typeof section !== 'object' || Array.isArray(section)) {
        report(sectionLocation, 'seção deve ser um objeto');
        return;
      }

      requireText(section, ['id', 'title', 'summary'], sectionLocation);
      if (isNonEmptyString(section.id) && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(section.id)) {
        report(`${sectionLocation}.id`, 'ID deve usar apenas minúsculas, números e hífens');
      }
      sectionIdentities.push({ value: section.id, location: `${sectionLocation}.id` });

      for (const field of ['title', 'summary']) {
        validateTemporalText(section[field], `${sectionLocation}.${field}`);
      }

      const paragraphs = requireArray(section, 'paragraphs', sectionLocation);
      validateTextArray(paragraphs, `${sectionLocation}.paragraphs`);

      const items = requireArray(section, 'items', sectionLocation);
      const itemTitles = [];
      items.forEach((item, itemIndex) => {
        itemCount += 1;
        const itemLocation = `${sectionLocation}.items[${itemIndex}]${item?.title ? ` (${item.title})` : ''}`;
        if (!item || typeof item !== 'object' || Array.isArray(item)) {
          report(itemLocation, 'item deve ser um objeto');
          return;
        }

        requireText(item, ['title', 'text'], itemLocation);
        validateTemporalText(item.title, `${itemLocation}.title`);
        validateTemporalText(item.text, `${itemLocation}.text`);
        if ('reviewedAt' in item) {
          validateReviewedAt(item.reviewedAt, `${itemLocation}.reviewedAt`);
        }
        if ('sourceLabel' in item && !isNonEmptyString(item.sourceLabel)) {
          report(`${itemLocation}.sourceLabel`, 'sourceLabel, quando informado, não pode estar vazio');
        }

        const list = requireArray(item, 'list', itemLocation, { allowEmpty: true });
        validateTextArray(list, `${itemLocation}.list`, { allowEmpty: true });
        const links = requireArray(item, 'links', itemLocation, { allowEmpty: true });

        if (!isNonEmptyString(item.text) && list.length === 0 && links.length === 0) {
          report(itemLocation, 'item precisa conter texto, lista ou link');
        }

        const linkIdentities = [];
        links.forEach((link, linkIndex) => {
          linkCount += 1;
          const linkLocation = `${itemLocation}.links[${linkIndex}]`;
          validateLink(link, linkLocation, guideBySlug);
          if (isNonEmptyString(link?.href)) {
            linkIdentities.push({ value: link.href, location: `${linkLocation}.href` });
          }
        });
        validateUniqueValues(linkIdentities, 'destino de link no mesmo item');

        itemTitles.push({ value: item.title, location: `${itemLocation}.title` });
        if (isNonEmptyString(item.title) && isNonEmptyString(item.text)) {
          const signature = JSON.stringify({
            title: normalize(item.title),
            text: normalize(item.text),
            list: list.filter(isNonEmptyString).map(normalize),
            links: links.map((link) => link?.href).filter(isNonEmptyString),
          });
          itemSignatures.push({ value: signature, location: itemLocation });
        }
      });
      validateUniqueValues(itemTitles, 'título de item na mesma seção');
    });
  });

  validateUniqueValues(guideIdentities, 'slug de guia');
  validateUniqueValues(guideTitles, 'título de guia');
  validateUniqueValues(guideSummaries, 'resumo de guia');
  validateUniqueValues(sectionIdentities, 'ID de seção');
  validateUniqueValues(legacyIdentities, 'slug legado');
  validateUniqueValues(itemSignatures, 'item idêntico');

  for (const [name, href] of Object.entries(officialLinks ?? {})) {
    validateExternalHref(href, `officialLinks.${name}`);
  }

  for (const [legacySlug, href] of Object.entries(legacySlugMap ?? {})) {
    validateInternalHref(href, `legacySlugMap[${JSON.stringify(legacySlug)}]`, guideBySlug);
  }

  validateReviewedAt(CONTENT_REVIEW_DATE, 'CONTENT_REVIEW_DATE');
  validateReviewedAt(editorialNotes?.reviewedAt, 'editorialNotes.reviewedAt');
  if (!isValidIsoDate(editorialNotes?.linkCheckAt)) {
    report('editorialNotes.linkCheckAt', 'deve ser uma data ISO real no formato YYYY-MM-DD');
  }

  return { guideCount: guides.length, sectionCount, itemCount, linkCount };
}

function validateCurricula() {
  if (!FLOW_CURRICULA || typeof FLOW_CURRICULA !== 'object' || Array.isArray(FLOW_CURRICULA)) {
    report('FLOW_CURRICULA', 'deve exportar um objeto de grades');
    return { curriculumCount: 0, courseCount: 0 };
  }

  const curricula = Object.entries(FLOW_CURRICULA);
  if (curricula.length !== 10) {
    report('FLOW_CURRICULA', `deve conter exatamente 10 grades; encontrou ${curricula.length}`);
  }

  const curriculumTitles = [];
  let courseCount = 0;

  curricula.forEach(([curriculumId, curriculum]) => {
    const curriculumLocation = `FLOW_CURRICULA.${curriculumId}`;
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(curriculumId)) {
      report(curriculumLocation, 'ID da grade deve usar apenas minúsculas, números e hífens');
    }
    if (!curriculum || typeof curriculum !== 'object' || Array.isArray(curriculum)) {
      report(curriculumLocation, 'grade deve ser um objeto');
      return;
    }

    requireText(curriculum, REQUIRED_CURRICULUM_FIELDS, curriculumLocation);
    curriculumTitles.push({ value: curriculum.title, location: `${curriculumLocation}.title` });
    const periods = requireArray(curriculum, 'periods', curriculumLocation);
    const courses = [];

    periods.forEach((period, periodIndex) => {
      const periodLocation = `${curriculumLocation}.periods[${periodIndex}]`;
      if (!Array.isArray(period) || period.length === 0) {
        report(periodLocation, 'período deve ser uma lista não vazia de disciplinas');
        return;
      }

      period.forEach((course, courseIndex) => {
        courseCount += 1;
        const courseLocation = `${periodLocation}[${courseIndex}]`;
        if (!Array.isArray(course) || course.length < 3 || course.length > 4) {
          report(courseLocation, 'disciplina deve ter [código, nome, carga/créditos, pré-requisitos?]');
          return;
        }

        const [code, title, value, prerequisites] = course;
        if (!isNonEmptyString(code)) report(`${courseLocation}[0]`, 'código é obrigatório');
        if (!isNonEmptyString(title)) report(`${courseLocation}[1]`, 'nome é obrigatório');
        if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
          report(`${courseLocation}[2]`, 'carga/créditos deve ser um número não negativo');
        }
        if (prerequisites !== undefined && !isNonEmptyString(prerequisites)) {
          report(`${courseLocation}[3]`, 'pré-requisitos devem ser códigos separados por |');
        }

        courses.push({ code, prerequisites, location: courseLocation });
      });
    });

    validateUniqueValues(
      courses.map(({ code, location }) => ({ value: code, location: `${location}[0]` })),
      `código de disciplina na grade ${curriculumId}`,
    );

    const knownCodes = new Set(
      courses.filter(({ code }) => isNonEmptyString(code)).map(({ code }) => normalize(code)),
    );
    courses.forEach(({ code, prerequisites, location }) => {
      if (!isNonEmptyString(prerequisites)) return;

      const prerequisiteCodes = prerequisites.split('|').map((entry) => entry.trim());
      if (prerequisiteCodes.some((entry) => !entry)) {
        report(`${location}[3]`, 'lista de pré-requisitos contém código vazio');
      }

      validateUniqueValues(
        prerequisiteCodes.map((value) => ({ value, location: `${location}[3]` })),
        `pré-requisito de ${code}`,
      );

      prerequisiteCodes.filter(isNonEmptyString).forEach((prerequisiteCode) => {
        if (isNonEmptyString(code) && normalize(prerequisiteCode) === normalize(code)) {
          report(`${location}[3]`, `${code} não pode ser pré-requisito de si mesma`);
        } else if (!knownCodes.has(normalize(prerequisiteCode))) {
          report(
            `${location}[3]`,
            `pré-requisito ${prerequisiteCode} de ${code} não existe na grade ${curriculumId}`,
          );
        }
      });
    });
  });

  validateUniqueValues(curriculumTitles, 'título de grade');
  return { curriculumCount: curricula.length, courseCount };
}

const guideStats = validateGuides();
const curriculumStats = validateCurricula();

if (errors.length > 0) {
  console.error(`\nValidação de conteúdo falhou com ${errors.length} problema(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log(
    `Conteúdo válido: ${guideStats.guideCount} guias, ${guideStats.sectionCount} seções, `
      + `${guideStats.itemCount} itens, ${guideStats.linkCount} links, `
      + `${curriculumStats.curriculumCount} grades e ${curriculumStats.courseCount} disciplinas.`,
  );
}
