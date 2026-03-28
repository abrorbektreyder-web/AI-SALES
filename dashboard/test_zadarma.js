const crypto = require('crypto');

const apiKey = '8566b102fc85b36d638a';
const apiSecret = 'b309d9eb3873e704eccd';
const methodName = '/v1/webrtc/get_key/';
const params = { sip: '510156' };

// Sort params
const sortedParams = Object.keys(params).sort().reduce((acc, key) => {
    acc[key] = params[key];
    return acc;
}, {});

// Create query string
const queryString = new URLSearchParams(sortedParams).toString();

// MD5 of query string
const md5 = crypto.createHash('md5').update(queryString).digest('hex');

// Concatenated string
const dataToSign = methodName + queryString + md5;

// HMAC-SHA1 in base64
const signature = crypto.createHmac('sha1', apiSecret).update(dataToSign).digest('base64');

fetch(`https://api.zadarma.com${methodName}?${queryString}`, {
    headers: {
        'Authorization': `${apiKey}:${signature}`
    }
})
.then(res => res.json())
.then(data => console.log('Zadarma API Response:', data))
.catch(err => console.error(err));
