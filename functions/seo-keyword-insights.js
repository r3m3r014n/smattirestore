const COMMON_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST,OPTIONS'
};

const SEASONAL_HINTS = [
  { month: 1, signal: 'Back-to-school restock demand for affordable sneakers and hoodies' },
  { month: 3, signal: 'Rain-season demand for windbreakers and boots in Nairobi' },
  { month: 6, signal: 'Mid-year salary cycle boosts purchase intent for curated thrift drops' },
  { month: 11, signal: 'Holiday and travel demand spikes for casual outfits and shoes' }
];

function buildKeywordClusters(seed = 'shoes nairobi') {
  const city = 'nairobi';
  return {
    transactional: [
      `buy ${seed}`,
      `grade a finds ${city}`,
      `neatfit collection sneakers ${city}`,
      `thrift clothes ${city} delivery`,
      `cheap shoes ${city}`
    ],
    commercialInvestigation: [
      `best thrift store ${city}`,
      `thrift vs new clothes kenya`,
      `where to buy thrifted jordans kenya`,
      `affordable streetwear kenya`
    ],
    localIntent: [
      `shoes near me ${city}`,
      `thrift shop in ${city}`,
      `mpesa thrift store kenya`,
      `whatsapp clothing store kenya`
    ]
  };
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

  const seedKeyword = String(payload.seedKeyword || 'shoes nairobi').trim().toLowerCase();
  const clusters = buildKeywordClusters(seedKeyword);
  const month = new Date().getMonth() + 1;

  const seasonal = SEASONAL_HINTS.filter((entry) => Math.abs(entry.month - month) <= 1 || Math.abs(entry.month - month) >= 11);

  return {
    statusCode: 200,
    headers: COMMON_HEADERS,
    body: JSON.stringify({
      source: 'On-demand heuristic keyword model (real-time execution endpoint)',
      geo: 'Kenya / Nairobi',
      seedKeyword,
      clusters,
      seasonalSignals: seasonal,
      nextActions: [
        'Prioritize transactional keywords in shop/category page titles and H1s',
        'Publish weekly comparison and styling FAQs targeting commercial investigation terms',
        'Use local intent phrases in internal links and Google Business Profile posts'
      ]
    })
  };
};
