const crypto = require('crypto');
const axios = require('axios'); // Use axios or fetch, Next.js has fetch, but node might not if < 18. Let's use axios since it might be in node_modules, or just native fetch if on Node 18+

async function testZadarma() {
  const apiKey = '8566b102fc85b36d638a';
  const apiSecret = 'b309d9eb3873e704eccd';
  const methodName = '/v1/info/balance/';
  const params = {}; // Empty params

  // 1. Sort params by key
  const sortedKeys = Object.keys(params).sort();
  let queryString = '';
  sortedKeys.forEach(key => {
    queryString += key + '=' + params[key] + '&';
  });
  queryString = queryString.slice(0, -1); // Remove trailing &

  // 2. MD5 of sorted param string
  const md5Payload = crypto.createHash('md5').update(queryString).digest('hex');

  // 3. Data to sign: method + query_str + md5Payload
  const dataToSign = methodName + queryString + md5Payload;

  // 4. HMAC-SHA1 of dataToSign using apiSecret
  const hmac = crypto.createHmac('sha1', apiSecret).update(dataToSign).digest('hex');

  // 5. Base64 encode the HMAC hex string
  // WAIT. The Zadarma docs say: "BASE64( HMAC-SHA1( SECRET, METHOD + PARAMS + MD5(PARAMS) ) )"
  // Is it BASE64 encoded HMAC binary, or BASE64 encoded HMAC hex string?
  // Let's try base64 encoding the hex string first
  const signature = Buffer.from(hmac).toString('base64');
  
  // Actually, standard is usually base64 of the raw HMAC bytes, let's also prepare that
  const signatureRaw = crypto.createHmac('sha1', apiSecret).update(dataToSign).digest('base64');

  try {
    const res = await fetch(`https://api.zadarma.com${methodName}${queryString ? '?' + queryString : ''}`, {
      headers: {
        'Authorization': `${apiKey}:${signatureRaw}`
      }
    });
    console.log("Raw Response Base64 HMAC:", await res.json());
  } catch(e) { console.error(e) }
  
  try {
      const res2 = await fetch(`https://api.zadarma.com${methodName}${queryString ? '?' + queryString : ''}`, {
        headers: {
          'Authorization': `${apiKey}:${signature}`
        }
      });
      console.log("Response Hex->Base64:", await res2.json());
  } catch(e) { console.error(e) }
}
testZadarma();
