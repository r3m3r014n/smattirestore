const COMMON_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST,OPTIONS'
};

const TARGET_PAGES = ['index.html', 'shop.html', 'about.html', 'contact.html'];

function countMatches(text, pattern) {
  const matches = text.match(pattern);
  return matches ? matches.length : 0;
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: COMMON_HEADERS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: COMMON_HEADERS, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  let payload = {};
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    payload = {};
  }

  const baseUrl = String(payload.baseUrl || '').trim().replace(/\/$/, '');
  if (!baseUrl) {
    return { statusCode: 400, headers: COMMON_HEADERS, body: JSON.stringify({ error: 'baseUrl is required' }) };
  }

  const pageReports = [];
  const brokenLinks = [];

  for (const page of TARGET_PAGES) {
    const url = `${baseUrl}/${page}`;
    try {
      const response = await fetch(url);
      const html = await response.text();

      const links = [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
      const internal = links.filter((href) => href.endsWith('.html') || href.startsWith('/'));
      const issues = [];

      if (!/<title>[^<]{20,70}<\/title>/i.test(html)) issues.push('Missing or weak <title> length');
      if (!/<meta\s+name="description"\s+content="[^"]{70,180}"/i.test(html)) issues.push('Missing or weak meta description length');
      if (!/<script\s+type="application\/ld\+json">/i.test(html)) issues.push('No JSON-LD schema block found');
      if (!/viewport-fit=cover/i.test(html)) issues.push('Viewport is not optimized for iOS safe areas');

      for (const href of internal) {
        const normalized = href.startsWith('http') ? href : href.startsWith('/') ? `${baseUrl}${href}` : `${baseUrl}/${href}`;
        try {
          const linkRes = await fetch(normalized, { method: 'HEAD' });
          if (linkRes.status >= 400) brokenLinks.push({ source: page, href, status: linkRes.status });
        } catch {
          brokenLinks.push({ source: page, href, status: 'FETCH_ERROR' });
        }
      }

      pageReports.push({
        page,
        status: response.status,
        linksChecked: internal.length,
        images: countMatches(html, /<img\s/gi),
        schemaBlocks: countMatches(html, /application\/ld\+json/gi),
        issues
      });
    } catch (error) {
      pageReports.push({ page, status: 'FETCH_ERROR', issues: [error.message] });
    }
  }

  const prioritizedFixes = [
    ...pageReports.flatMap((r) => r.issues.map((issue) => ({ page: r.page, issue, impact: issue.includes('title') || issue.includes('meta') ? 'HIGH' : 'MEDIUM' }))),
    ...brokenLinks.map((l) => ({ page: l.source, issue: `Broken link: ${l.href}`, impact: 'HIGH' }))
  ];

  return {
    statusCode: 200,
    headers: COMMON_HEADERS,
    body: JSON.stringify({
      auditedAt: new Date().toISOString(),
      baseUrl,
      pagesAudited: pageReports,
      brokenLinks,
      prioritizedFixes
    })
  };
};
