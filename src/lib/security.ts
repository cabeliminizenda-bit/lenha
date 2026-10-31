/**
 * Security helpers shared across the app (server + client safe, no dependencies).
 */

/**
 * Serialize an object for use inside <script type="application/ld+json">.
 * JSON.stringify does NOT escape "</script>", which allows breaking out of the
 * script tag (XSS) when data contains user content (e.g. product reviews).
 */
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

/**
 * Escape a string for safe interpolation into HTML (e.g. e-mail templates).
 */
export function escapeHtml(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Lightweight, dependency-free HTML sanitizer used during SSR (before DOMPurify
 * runs on the client). It removes the most common XSS vectors:
 * dangerous tags, inline event handlers and javascript:/vbscript:/data: URLs.
 *
 * NOTE: This is a defence-in-depth layer. For full robustness, replace with
 * `isomorphic-dompurify` (install from GitHub Codespaces).
 */
export function basicSanitizeHtml(html: string): string {
  if (!html) return '';
  let out = String(html);

  // 1. Remove dangerous elements together with their content
  out = out.replace(
    /<\s*(script|style|noscript|template|object|embed|applet|form|textarea|select|button|svg|math)\b[\s\S]*?<\s*\/\s*\1\s*>/gi,
    ''
  );
  // 2. Remove remaining (self-closing / unclosed) dangerous tags
  out = out.replace(
    /<\s*\/?\s*(script|style|noscript|template|object|embed|applet|form|input|textarea|select|button|meta|link|base|frameset|frame|svg|math)\b[^>]*>/gi,
    ''
  );

  // 3. Remove inline event handlers with any whitespace or slash separator
  // Handles: onclick=..., /onerror=..., onfocus = "...", etc.
  out = out.replace(/(?:[\s/]|&NewLine;)+on[a-z0-9_-]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>/]+))?/gi, '');

  // Helper to decode HTML entities and strip whitespace/control chars for protocol checking
  function normalizeUrl(url: string) {
    return url
      .replace(/&#x([0-9a-f]+);?/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
      .replace(/&#([0-9]+);?/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
      .replace(/&[a-z]+;/gi, '')
      .replace(/[\u0000-\u0020\s\t\r\n\\]+/g, '')
      .toLowerCase();
  }

  // 4. Neutralise dangerous URL schemes in attributes (href, src, action, etc.)
  out = out.replace(
    /(?:[\s/])(href|src|action|formaction|xlink:href)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi,
    (match, attr, qDouble, qSingle, unquoted) => {
      const rawVal = qDouble !== undefined ? qDouble : (qSingle !== undefined ? qSingle : unquoted);
      const normalized = normalizeUrl(rawVal);
      if (/^(javascript|vbscript|data):/i.test(normalized)) {
        return ` ${attr}="#"`;
      }
      return match;
    }
  );

  // 5. Remove CSS expressions / javascript in style attributes
  out = out.replace(/(?:[\s/])style\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, (match) => {
    const normalized = normalizeUrl(match);
    if (normalized.includes('expression') || normalized.includes('javascript:') || normalized.includes('behavior:')) {
      return '';
    }
    return match;
  });

  // 6. Only allow iframes from trusted video providers
  out = out.replace(/<\s*iframe\b[^>]*>[\s\S]*?<\s*\/\s*iframe\s*>/gi, (match) =>
    /src\s*=\s*["']https:\/\/(www\.)?(youtube\.com|youtube-nocookie\.com|player\.vimeo\.com)\//i.test(match) ? match : ''
  );

  return out;
}

export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Round a monetary amount to 2 decimals */
export function roundMoney(n: number): number {
  return Math.round(n * 100) / 100;
}

export function maskPII(str: string) {
  if (!str) return "";
  return str.charAt(0) + "***" + str.slice(-1);
}