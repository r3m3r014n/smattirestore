'use strict';

const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST,OPTIONS'
};

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

  const callback = payload?.Body?.stkCallback;
  if (callback) {
    const metadata = Array.isArray(callback.CallbackMetadata?.Item) ? callback.CallbackMetadata.Item : [];
    const amountItem = metadata.find((item) => item?.Name === 'Amount');
    const mpesaReceiptItem = metadata.find((item) => item?.Name === 'MpesaReceiptNumber');
    const phoneItem = metadata.find((item) => item?.Name === 'PhoneNumber');

    console.info('Daraja callback received', {
      checkoutRequestId: callback.CheckoutRequestID || null,
      merchantRequestId: callback.MerchantRequestID || null,
      resultCode: callback.ResultCode,
      resultDesc: callback.ResultDesc || null,
      amount: amountItem?.Value ?? null,
      mpesaReceiptNumber: mpesaReceiptItem?.Value ?? null,
      phoneNumber: phoneItem?.Value ?? null
    });
  } else {
    console.warn('Daraja callback missing stkCallback body');
  }

  // ACK success so Daraja stops retrying callbacks.
  return {
    statusCode: 200,
    headers: JSON_HEADERS,
    body: JSON.stringify({ ResultCode: 0, ResultDesc: 'Accepted' })
  };
};
