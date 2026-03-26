const COMMON_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST,OPTIONS'
};

function normalize(list) {
  return Array.isArray(list) ? list.map((v) => String(v || '').trim()).filter(Boolean) : [];
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

  const competitors = normalize(payload.competitors);
  if (!competitors.length) {
    return {
      statusCode: 200,
      headers: COMMON_HEADERS,
      body: JSON.stringify({
        message: 'No competitors provided; returning strategic baseline for Nairobi thrift SERPs.',
        opportunities: [
          'Create city-intent pages for mitumba shoes in Nairobi neighborhoods',
          'Publish weekly price comparison snippets targeting “cheap mitumba shoes Nairobi”',
          'Add “how to verify Grade A mitumba” FAQ hub with schema'
        ]
      })
    };
  }

  const findings = competitors.map((domain) => ({
    competitor: domain,
    observedContentPattern: 'Likely category-driven pages with limited long-tail FAQ depth',
    gapsToExploit: [
      'Long-tail local keyword coverage (estate/neighborhood + product type)',
      'M-Pesa-focused trust and checkout clarity in metadata/snippets',
      'Seasonal content tied to rain/cold school calendar and salary cycles'
    ],
    outrankPlay: [
      'Publish 2 localized guides per month + internal links to shop filters',
      'Embed FAQ schema with buyer-intent questions',
      'Add comparison tables for second-hand sneakers by budget band'
    ]
  }));

  return {
    statusCode: 200,
    headers: COMMON_HEADERS,
    body: JSON.stringify({ generatedAt: new Date().toISOString(), findings })
  };
};
