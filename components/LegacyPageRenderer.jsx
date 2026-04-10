export function LegacyPageRenderer({ document, pageKey }) {
  return (
    <>
      {/* Preservamos a ordem original dos estilos e scripts da demo para manter o comportamento intacto. */}
      {document.stylesheets.map((href) => (
        <link key={`${pageKey}-style-${href}`} rel="stylesheet" href={href} />
      ))}

      {/* eslint-disable @next/next/no-sync-scripts */}
      {document.headScripts.map((script, index) =>
        script.src ? (
          <script key={`${pageKey}-head-src-${script.src}`} src={script.src} />
        ) : (
          <script
            key={`${pageKey}-head-inline-${index}`}
            dangerouslySetInnerHTML={{ __html: script.content }}
          />
        ),
      )}
      {/* eslint-enable @next/next/no-sync-scripts */}

      <div dangerouslySetInnerHTML={{ __html: document.bodyHtml }} suppressHydrationWarning />

      {document.bodyScripts.map((script, index) =>
        script.src ? (
          <script key={`${pageKey}-body-src-${script.src}`} src={script.src} defer />
        ) : (
          <script
            key={`${pageKey}-body-inline-${index}`}
            dangerouslySetInnerHTML={{ __html: script.content }}
          />
        ),
      )}
    </>
  );
}
