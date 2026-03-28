'use strict';

/**
 * Netlify function: /api/oembed?url=POST_URL
 *
 * Proxies TikTok oEmbed requests so the browser never makes a cross-origin
 * fetch directly to tiktok.com (which would require CORS headers we don't
 * control). Returns a trimmed JSON payload:
 *   { thumbnail_url, title, author_name }
 *
 * Responses are cached at Netlify's CDN edge for 24 h and allowed to serve
 * stale for another hour while revalidating, so repeat page loads are free.
 *
 * Security: only TikTok video URLs (/video/<id>) are accepted; everything
 * else gets a 403 so the function cannot be used as an open HTTP proxy.
 */

const https = require('https');

const TIKTOK_OEMBED = 'https://www.tiktok.com/oembed';

/** Fetch a URL and parse the JSON body. Rejects after 6 s. */
function fetchJson(url) {
    return new Promise((resolve, reject) => {
        const req = https.get(
            url,
            { headers: { 'User-Agent': 'smattirestore.com oEmbed/1.0' } },
            res => {
                let body = '';
                res.on('data', chunk => { body += chunk; });
                res.on('end', () => {
                    try { resolve(JSON.parse(body)); }
                    catch (e) { reject(new Error('JSON parse failed')); }
                });
                res.on('error', reject);
            }
        );
        req.on('error', reject);
        req.setTimeout(6000, () => {
            req.destroy(new Error('Request timeout'));
        });
    });
}

exports.handler = async event => {
    if (event.httpMethod !== 'GET') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const postUrl = (event.queryStringParameters || {}).url;
    if (!postUrl) {
        return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Missing required parameter: url' }),
        };
    }

    // Validate: must be a TikTok video URL
    let parsed;
    try { parsed = new URL(postUrl); }
    catch {
        return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Invalid URL' }),
        };
    }

    if (!parsed.hostname.endsWith('tiktok.com')) {
        return {
            statusCode: 403,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Only TikTok URLs are accepted' }),
        };
    }

    if (!parsed.pathname.includes('/video/')) {
        return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'URL must point to a TikTok video (/video/<id>)' }),
        };
    }

    const oembedUrl = `${TIKTOK_OEMBED}?url=${encodeURIComponent(postUrl)}`;

    try {
        const data = await fetchJson(oembedUrl);
        const payload = JSON.stringify({
            thumbnail_url: data.thumbnail_url || null,
            title: data.title || null,
            author_name: data.author_name || null,
        });
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                // Edge CDN caches for 24 h; browser for 1 h; stale-while-revalidate
                // means Googlebot and repeat visitors never wait for a cold fetch.
                'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=3600',
                'Access-Control-Allow-Origin': '*',
            },
            body: payload,
        };
    } catch (err) {
        return {
            statusCode: 502,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'oEmbed upstream failed', detail: err.message }),
        };
    }
};
