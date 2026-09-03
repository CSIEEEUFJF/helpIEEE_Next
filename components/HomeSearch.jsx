'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

function normalize(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function HomeSearch({ entries }) {
  const [query, setQuery] = useState('');
  const normalizedQuery = normalize(query);
  const results = useMemo(() => {
    if (!normalizedQuery) return [];
    const tokens = normalizedQuery.split(/\s+/);
    return entries
      .filter((entry) => tokens.every((token) => normalize(`${entry.title} ${entry.summary} ${entry.keywords ?? ''}`).includes(token)))
      .slice(0, 6);
  }, [entries, normalizedQuery]);

  return (
    <div className="home-search">
      <label htmlFor="home-search-input">O que você precisa resolver?</label>
      <div className="home-search__field">
        <span aria-hidden="true">⌕</span>
        <input
          id="home-search-input"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Ex.: matrícula, RU, cálculo, estágio…"
          autoComplete="off"
        />
        {query ? (
          <button type="button" onClick={() => setQuery('')} aria-label="Limpar busca">
            Limpar
          </button>
        ) : null}
      </div>

      {normalizedQuery ? (
        <div className="home-search__results" aria-live="polite">
          {results.length ? (
            results.map((result) => (
              <Link href={result.href} key={`${result.href}-${result.title}`}>
                <span>{result.eyebrow}</span>
                <strong>{result.title}</strong>
                <small>{result.summary}</small>
              </Link>
            ))
          ) : (
            <p>Nenhum resultado direto. Tente uma palavra mais ampla ou abra o guia completo.</p>
          )}
        </div>
      ) : null}
    </div>
  );
}
