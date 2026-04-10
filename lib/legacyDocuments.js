import fs from 'node:fs';
import path from 'node:path';

const legacyRoot = path.join(process.cwd(), 'legacy-source');
const cache = new Map();

function parseAttributes(attributeString = '') {
  const attributes = {};
  const matcher = /([a-zA-Z0-9:-]+)(?:="([^"]*)")?/g;
  let match = matcher.exec(attributeString);

  while (match) {
    attributes[match[1]] = match[2] ?? true;
    match = matcher.exec(attributeString);
  }

  return attributes;
}

function extractSection(html, tagName) {
  const match = html.match(new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i'));
  return match ? match[1] : '';
}

function extractBody(html) {
  const match = html.match(/<body([^>]*)>([\s\S]*?)<\/body>/i);

  if (!match) {
    return {
      attributes: {},
      innerHtml: '',
    };
  }

  return {
    attributes: parseAttributes(match[1]),
    innerHtml: match[2],
  };
}

function extractScripts(sectionHtml) {
  const scripts = [];
  const matcher = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
  let match = matcher.exec(sectionHtml);

  while (match) {
    const attributes = parseAttributes(match[1]);
    scripts.push({
      src: typeof attributes.src === 'string' ? attributes.src : null,
      content: match[2].trim(),
    });
    match = matcher.exec(sectionHtml);
  }

  return scripts;
}

function extractStylesheets(headHtml) {
  const links = [];
  const matcher = /<link([^>]*)>/gi;
  let match = matcher.exec(headHtml);

  while (match) {
    const attributes = parseAttributes(match[1]);
    if (attributes.rel === 'stylesheet' && typeof attributes.href === 'string') {
      links.push(attributes.href);
    }
    match = matcher.exec(headHtml);
  }

  return links;
}

function stripScripts(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, '');
}

function readLegacyHtml(relativePath) {
  const fullPath = path.join(legacyRoot, relativePath);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const stats = fs.statSync(fullPath);
  const cachedEntry = cache.get(fullPath);

  if (cachedEntry && cachedEntry.mtimeMs === stats.mtimeMs) {
    return cachedEntry.document;
  }

  const html = fs.readFileSync(fullPath, 'utf8');
  const headHtml = extractSection(html, 'head');
  const body = extractBody(html);
  const document = {
    relativePath,
    title: html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() || 'HELPIEEE',
    bodyAttributes: body.attributes,
    bodyHtml: stripScripts(body.innerHtml),
    stylesheets: extractStylesheets(headHtml),
    headScripts: extractScripts(headHtml),
    bodyScripts: extractScripts(body.innerHtml),
  };

  cache.set(fullPath, {
    mtimeMs: stats.mtimeMs,
    document,
  });
  return document;
}

export function getHomeDocument() {
  return readLegacyHtml('index.html');
}

export function getLegacyPageDocument(slug) {
  return readLegacyHtml(path.join('pages', slug));
}

export function listLegacyPageSlugs() {
  const pagesDir = path.join(legacyRoot, 'pages');
  return fs.readdirSync(pagesDir).filter((fileName) => fileName.endsWith('.html'));
}
