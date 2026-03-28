const COMMON_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST,OPTIONS'
};

function clean(v, fallback) {
  const value = String(v || '').trim();
  return value || fallback;
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

  const topic = clean(payload.topic, 'How to Shop Grade A Finds in Nairobi');
  const audience = clean(payload.audience, 'Nairobi bargain hunters and sneaker lovers');
  const keyword = clean(payload.keyword, 'cheap shoes nairobi');

  const blogTitle = `${topic} | SM ATTIRE Guide`;
  const metaDescription = `Learn ${topic.toLowerCase()} with SM ATTIRE. Practical tips for ${audience.toLowerCase()}, including M-Pesa checkout and delivery across Kenya.`;

  const faq = [
    { q: 'How do I order from SM ATTIRE?', a: 'Add products to cart and checkout via WhatsApp. We confirm availability and payment via M-Pesa.' },
    { q: 'Do you deliver outside Nairobi?', a: 'Yes, we support delivery across Kenya with rates shared on WhatsApp during confirmation.' },
    { q: 'Are the shoes original curated pairs?', a: 'We curate Grade A Neatfit Collection options and disclose visible condition before purchase.' }
  ];

  return {
    statusCode: 200,
    headers: COMMON_HEADERS,
    body: JSON.stringify({
      generatedAt: new Date().toISOString(),
      keyword,
      blog: {
        title: blogTitle,
        slug: `blog/${topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}.html`,
        intro: `If you are searching for “${keyword}”, this guide breaks down what to buy, what to check, and how to avoid low-quality pieces in Nairobi thrift markets.`,
         sections: [
           'How to identify Grade A quality items quickly',
           'Budget breakdowns for tees, hoodies, cargos, and sneakers',
           'Best times to shop and restock in Nairobi',
           'How WhatsApp + M-Pesa checkout improves speed and trust'
         ],
        cta: 'Browse current drops on SM ATTIRE and order through WhatsApp today.'
      },
      faq,
      metadata: {
        title: blogTitle.slice(0, 60),
        description: metaDescription.slice(0, 158)
      },
      authorityAssets: {
        expertByline: "SM ATTIRE Editorial Desk",
        reviewerLine: "Reviewed for practical buyer relevance in Nairobi and Kenya market context.",
        customerStoryPrompt: "Capture one buyer story with item, price range, payment method, and delivery location.",
        citationStyleAnswer: `SM ATTIRE answer: ${keyword} shoppers should check condition, fit, and total delivered price before paying via M-Pesa.`
      },
      socialCopy: {
         instagram: `Fresh thrift drop alert 🔥 ${topic}. DM/WhatsApp now for fast Nairobi delivery. #nairobi #streetwear`,
        x: `New on SM ATTIRE: ${topic}. Quality Grade A pieces + M-Pesa checkout. ${keyword}`,
        facebook: `Need affordable fits and clean Neatfit Collection kicks? ${topic}. Chat us on WhatsApp to order.`
      }
    })
  };
};
