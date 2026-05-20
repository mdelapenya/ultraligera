<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes" />

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>Ultraligera — Sitemap</title>
        <meta name="robots" content="noindex" />
        <style>
          :root {
            --bg: #191919;
            --surface: #0d0d0d;
            --fg: #e6e6e6;
            --muted: #a3a3a3;
            --accent: #f14e41;
            --border: rgba(255, 255, 255, 0.08);
          }
          * { box-sizing: border-box; }
          body {
            background: var(--bg);
            color: var(--fg);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
            margin: 0;
            padding: 3rem 1.5rem;
            line-height: 1.5;
          }
          .wrap { max-width: 80rem; margin: 0 auto; }
          .eyebrow {
            font-family: ui-monospace, "JetBrains Mono", monospace;
            font-size: 0.7rem;
            letter-spacing: 0.3em;
            text-transform: uppercase;
            color: var(--accent);
            margin: 0 0 1rem;
          }
          h1 {
            font-size: clamp(2.5rem, 6vw, 5rem);
            line-height: 0.95;
            margin: 0 0 1.5rem;
            letter-spacing: -0.02em;
            font-weight: 800;
          }
          .meta {
            color: var(--muted);
            font-family: ui-monospace, "JetBrains Mono", monospace;
            font-size: 0.8rem;
            margin: 0 0 2.5rem;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid var(--border);
            background: var(--surface);
          }
          thead {
            background: rgba(255, 255, 255, 0.03);
          }
          th {
            text-align: left;
            font-family: ui-monospace, "JetBrains Mono", monospace;
            font-size: 0.7rem;
            text-transform: uppercase;
            letter-spacing: 0.18em;
            color: var(--muted);
            padding: 1rem;
            border-bottom: 1px solid var(--border);
            font-weight: 600;
          }
          td {
            padding: 0.85rem 1rem;
            border-bottom: 1px solid var(--border);
            vertical-align: top;
            font-size: 0.875rem;
          }
          tr:last-child td { border-bottom: 0; }
          tr:hover td { background: rgba(255, 255, 255, 0.02); }
          a {
            color: var(--fg);
            text-decoration: none;
            border-bottom: 1px dashed rgba(255, 255, 255, 0.2);
          }
          a:hover { color: var(--accent); border-bottom-color: var(--accent); }
          .mono {
            font-family: ui-monospace, "JetBrains Mono", monospace;
            color: var(--muted);
            font-size: 0.78rem;
          }
          .alts {
            margin: 0.35rem 0 0;
            padding: 0;
            list-style: none;
            font-family: ui-monospace, "JetBrains Mono", monospace;
            font-size: 0.72rem;
            color: var(--muted);
          }
          .alts li { display: inline-block; margin-right: 1rem; }
          .alts strong {
            color: var(--accent);
            font-weight: 500;
            margin-right: 0.35rem;
          }
          .priority {
            display: inline-block;
            min-width: 2.5rem;
            text-align: center;
            padding: 0.15rem 0.4rem;
            border: 1px solid var(--border);
            font-family: ui-monospace, "JetBrains Mono", monospace;
            font-size: 0.7rem;
            color: var(--muted);
          }
          .note {
            margin-top: 2rem;
            font-size: 0.78rem;
            color: var(--muted);
            line-height: 1.6;
          }
        </style>
      </head>
      <body>
        <div class="wrap">
          <p class="eyebrow">XML Sitemap</p>
          <h1>Ultraligera — Sitemap</h1>
          <p class="meta">
            <xsl:value-of select="count(s:urlset/s:url)" /> URLs ·
            Generated <xsl:value-of select="s:urlset/s:url[1]/s:lastmod" />
          </p>

          <table>
            <thead>
              <tr>
                <th>URL</th>
                <th>Last modified</th>
                <th>Change freq</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="s:urlset/s:url">
                <tr>
                  <td>
                    <a href="{s:loc}">
                      <xsl:value-of select="s:loc" />
                    </a>
                    <xsl:if test="xhtml:link">
                      <ul class="alts">
                        <xsl:for-each select="xhtml:link">
                          <li>
                            <strong>
                              <xsl:value-of select="@hreflang" />
                            </strong>
                            <a href="{@href}">
                              <xsl:value-of select="@href" />
                            </a>
                          </li>
                        </xsl:for-each>
                      </ul>
                    </xsl:if>
                  </td>
                  <td class="mono"><xsl:value-of select="s:lastmod" /></td>
                  <td class="mono"><xsl:value-of select="s:changefreq" /></td>
                  <td>
                    <span class="priority">
                      <xsl:value-of select="s:priority" />
                    </span>
                  </td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>

          <p class="note">
            This is a machine-readable sitemap for search engines. The XSL
            stylesheet above is rendered by browsers only — crawlers see the
            raw XML. <code>hreflang</code> alternates link the equivalent page
            across locales (<code>es</code>, <code>en</code>, plus
            <code>x-default</code> falling back to Spanish).
          </p>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
