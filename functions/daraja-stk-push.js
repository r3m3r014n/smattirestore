'use strict';

const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST,OPTIONS'
};

function getDarajaBaseUrl() {
  return String(process.env.MPESA_ENV || 'sandbox').toLowerCase() === 'production'
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke';
}

function toTimestamp(date = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}

function normalizeKenyanPhone(input) {
  const raw = String(input || '').replace(/\D/g, '');
  if (!raw) return '';
  if (raw.startsWith('254')) return raw;
  if (raw.startsWith('0')) return `254${raw.slice(1)}`;
  if (raw.startsWith('7') || raw.startsWith('1')) return `254${raw}`;
  return raw;
}

async function getAccessToken(baseUrl, key, secret) {
  const auth = Buffer.from(`${key}:${secret}`).toString('base64');
  const response = await fetch(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${auth}` }
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Token request failed: ${response.status} ${details}`);
  }

  const data = await response.json();
  if (!data.access_token) throw new Error('Daraja token missing');
  return data.access_token;
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: JSON_HEADERS, body: '' };
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: JSON_HEADERS, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  let payload = {};
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    payload = {};
  }

  const {
    MPESA_CONSUMER_KEY,
    MPESA_CONSUMER_SECRET,
    MPESA_SHORTCODE,
    MPESA_PASSKEY,
    MPESA_CALLBACK_URL
  } = process.env;

  const businessShortCode = String(MPESA_SHORTCODE || '303030').trim();

  if (!MPESA_CONSUMER_KEY || !MPESA_CONSUMER_SECRET || !MPESA_PASSKEY || !MPESA_CALLBACK_URL) {
    return {
      statusCode: 503,
      headers: JSON_HEADERS,
      body: JSON.stringify({ error: 'Daraja is not configured yet. Set required MPESA_* environment variables.' })
    };
  }

  const amount = Number(payload.amount);
  const phoneNumber = normalizeKenyanPhone(payload.phone);
  const accountReference = String(payload.accountReference || process.env.MPESA_ACCOUNT_REFERENCE || '2048379985').trim().slice(0, 12);
  const transactionDesc = String(payload.transactionDesc || process.env.MPESA_TRANSACTION_DESC || 'SM ATTIRE Order').trim().slice(0, 64);

  if (!Number.isFinite(amount) || amount < 1) {
    return { statusCode: 400, headers: JSON_HEADERS, body: JSON.stringify({ error: 'Invalid amount' }) };
  }
  if (!/^254\d{9}$/.test(phoneNumber)) {
    return { statusCode: 400, headers: JSON_HEADERS, body: JSON.stringify({ error: 'Invalid phone. Use Kenyan format (07... or 254...)' }) };
  }

  const baseUrl = getDarajaBaseUrl();
  const timestamp = toTimestamp();
  const password = Buffer.from(`${businessShortCode}${MPESA_PASSKEY}${timestamp}`).toString('base64');

  try {
    const token = await getAccessToken(baseUrl, MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET);
    const response = await fetch(`${baseUrl}/mpesa/stkpush/v1/processrequest`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        BusinessShortCode: businessShortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.round(amount),
        PartyA: phoneNumber,
        PartyB: businessShortCode,
        PhoneNumber: phoneNumber,
        CallBackURL: MPESA_CALLBACK_URL,
        AccountReference: accountReference || 'SMATTIRE',
        TransactionDesc: transactionDesc || 'SM ATTIRE Order'
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return {
        statusCode: 502,
        headers: JSON_HEADERS,
        body: JSON.stringify({ error: 'Daraja STK request failed', details: data })
      };
    }

    return {
      statusCode: 200,
      headers: JSON_HEADERS,
      body: JSON.stringify({
        ok: true,
        checkoutRequestId: data.CheckoutRequestID || null,
        merchantRequestId: data.MerchantRequestID || null,
        customerMessage: data.CustomerMessage || 'STK Push sent'
      })
    };
  } catch (error) {
    return {
      statusCode: 502,
      headers: JSON_HEADERS,
      body: JSON.stringify({ error: 'Failed to initialize Daraja STK push', detail: error.message })
    };
  }
};
