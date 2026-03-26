const COMMON_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST,OPTIONS'
};

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

  const target = String(payload.targetName || 'Editor').trim();
  const site = String(payload.targetSite || 'Local Kenya Lifestyle Blog').trim();

  const emailTemplate = `Subject: Collaboration idea for ${site} + SM ATTIRE\n\nHi ${target},\n\nI enjoyed your recent coverage on affordable fashion in Kenya. I run SM ATTIRE, a Nairobi-based thrift and mitumba store focused on Grade A streetwear and second-hand sneakers.\n\nI would love to contribute a practical piece for your audience (e.g., \"How to Buy Quality Mitumba Shoes in Nairobi on a Budget\"). In return, we can include original visuals and data-backed buyer tips your readers can use immediately.\n\nIf this sounds useful, I can send a short outline today.\n\nBest,\nSM ATTIRE`; 

  return {
    statusCode: 200,
    headers: COMMON_HEADERS,
    body: JSON.stringify({
      generatedAt: new Date().toISOString(),
      backlinkTargets: [
        { segment: 'Kenya fashion/lifestyle publishers', value: 'Topical relevance + local trust signals' },
        { segment: 'Campus blogs and youth communities', value: 'High engagement with budget fashion topics' },
        { segment: 'Sneaker enthusiast communities', value: 'Commercial intent close to purchase decision' },
        { segment: 'Nairobi event/community pages', value: 'Geo-relevant citations and referral traffic' }
      ],
      personalizedEmail: emailTemplate,
      campaignCadence: [
        'Week 1: 15 prospects with personalized opener referencing latest article',
        'Week 2: 1st follow-up + alternate angle (data, visuals, checklist)',
        'Week 3: Final follow-up with specific guest-post headline options'
      ]
    })
  };
};
