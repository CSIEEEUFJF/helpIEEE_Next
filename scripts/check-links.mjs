#!/usr/bin/env node

const TIMEOUT_MS = 12_000;
const MAX_CONCURRENCY = 6;
const MAX_ATTEMPTS = 3;
const RETRY_DELAYS_MS = [500, 1_500];
const USER_AGENT = 'HELPIEEE-LinkChecker/1.0 (+https://www.ieeeufjf.com.br/)';

const args = process.argv.slice(2);
const unknownArgs = args.filter((arg) => arg !== '--quiet');
const quiet = args.includes('--quiet');

if (unknownArgs.length > 0) {
  console.error(`Argumento desconhecido: ${unknownArgs.join(', ')}`);
  console.error('Uso: node scripts/check-links.mjs [--quiet]');
  process.exit(2);
}

// guides.js contém ESM, mas o package.json não declara `type: module`. O aviso
// emitido pelo Node nesse caso não representa uma falha do conteúdo.
process.removeAllListeners('warning');
const { guides } = await import('../lib/guides.js');

function collectExternalLinks() {
  const uniqueLinks = new Map();

  for (const guide of guides) {
    for (const section of guide.sections ?? []) {
      for (const item of section.items ?? []) {
        for (const link of item.links ?? []) {
          if (typeof link.href !== 'string' || link.href.startsWith('/')) continue;

          let parsed;
          try {
            parsed = new URL(link.href);
          } catch {
            // URLs malformadas pertencem à validação estrutural. Ainda assim,
            // são preservadas aqui para aparecerem como falha sem status.
            uniqueLinks.set(link.href, link.href);
            continue;
          }

          if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') continue;

          parsed.hash = '';
          const canonicalUrl = parsed.href;
          if (!uniqueLinks.has(canonicalUrl)) {
            uniqueLinks.set(canonicalUrl, canonicalUrl);
          }
        }
      }
    }
  }

  return [...uniqueLinks.values()].sort((left, right) => left.localeCompare(right));
}

function describeError(error) {
  if (error?.name === 'AbortError') return `timeout após ${TIMEOUT_MS / 1000}s`;
  if (error instanceof TypeError && error.cause?.code) return error.cause.code;
  if (error instanceof Error && error.message) return error.message;
  return 'erro de rede desconhecido';
}

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function isTransientStatus(status) {
  return status === 408
    || status === 425
    || (status >= 500 && status <= 599);
}

async function requestLink(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.7',
      },
    });

    const result = {
      url,
      finalUrl: response.url,
      status: response.status,
      statusText: response.statusText,
      kind: response.status === 429
        ? 'warning'
        : response.status >= 200 && response.status <= 399
          ? 'success'
          : 'failure',
    };

    await response.body?.cancel();
    return result;
  } catch (error) {
    return {
      url,
      status: null,
      statusText: describeError(error),
      kind: 'failure',
      transient: true,
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function checkLink(url) {
  let lastResult;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    const result = await requestLink(url);
    result.attempts = attempt;
    lastResult = result;

    const shouldRetry = result.transient === true || isTransientStatus(result.status);
    if (!shouldRetry || attempt === MAX_ATTEMPTS) return result;

    await wait(RETRY_DELAYS_MS[attempt - 1]);
  }

  return lastResult;
}

async function checkWithConcurrency(urls) {
  const results = new Array(urls.length);
  let cursor = 0;

  async function worker() {
    while (cursor < urls.length) {
      const index = cursor;
      cursor += 1;
      const result = await checkLink(urls[index]);
      results[index] = result;

      if (!quiet) {
        const status = result.status ?? 'SEM STATUS';
        const label = result.kind === 'success'
          ? 'OK'
          : result.kind === 'warning'
            ? 'AVISO'
            : 'FALHA';
        const attempts = result.attempts > 1 ? ` (${result.attempts} tentativas)` : '';
        console.log(`[${index + 1}/${urls.length}] ${label} ${status} ${result.url}${attempts}`);
      }
    }
  }

  const workerCount = Math.min(MAX_CONCURRENCY, urls.length);
  await Promise.all(Array.from({ length: workerCount }, () => worker()));
  return results;
}

const urls = collectExternalLinks();

if (urls.length === 0) {
  console.log('Nenhum link externo publicado para verificar.');
  process.exit(0);
}

const results = await checkWithConcurrency(urls);
const warnings = results.filter((result) => result.kind === 'warning');
const failures = results.filter((result) => result.kind === 'failure');
const successes = results.filter((result) => result.kind === 'success');

if (quiet) {
  for (const warning of warnings) {
    console.warn(`AVISO ${warning.status} ${warning.url}`);
  }

  for (const failure of failures) {
    console.error(
      `FALHA ${failure.status ?? 'SEM STATUS'} ${failure.url}`
        + `${failure.statusText ? ` — ${failure.statusText}` : ''}`
        + `${failure.attempts > 1 ? ` (${failure.attempts} tentativas)` : ''}`,
    );
  }
}

const recoveredByRetry = successes.filter((result) => result.attempts > 1).length;
console.log(
  `Resumo: ${results.length} links | ${successes.length} válidos | `
    + `${warnings.length} aviso(s) 429 | ${failures.length} falha(s) | `
    + `${recoveredByRetry} recuperado(s) por retry.`,
);

if (failures.length > 0) {
  process.exitCode = 1;
}
