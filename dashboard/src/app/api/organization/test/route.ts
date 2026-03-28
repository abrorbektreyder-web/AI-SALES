import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  const { apiKey, apiSecret } = await req.json();
  if (!apiKey || !apiSecret) {
    return NextResponse.json({ success: false, message: 'API Key va Secret talab qilinadi' }, { status: 400 });
  }

  try {
    const methodName = '/v1/info/balance/';
    const queryString = '';
    const md5Payload = crypto.createHash('md5').update(queryString).digest('hex');
    const dataToSign = methodName + queryString + md5Payload;
    const signature = crypto.createHmac('sha1', apiSecret).update(dataToSign).digest('base64');

    const res = await fetch(`https://api.zadarma.com${methodName}`, {
      headers: { Authorization: `${apiKey}:${signature}` }
    });
    const data = await res.json();

    if (data.status === 'success') {
      return NextResponse.json({
        success: true,
        message: `✅ Zadarma ulanish muvaffaqiyatli! Balans: $${data.balance} ${data.currency}`
      });
    } else {
      return NextResponse.json({
        success: false,
        message: `❌ Xato: ${data.message || 'Avtorizatsiya bajarilmadi'}`
      });
    }
  } catch {
    return NextResponse.json({ success: false, message: '❌ Server bilan aloqa yo\'q' }, { status: 500 });
  }
}
