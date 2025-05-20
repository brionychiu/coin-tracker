import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date'); // 格式 YYYY-MM-DD
  const currency = searchParams.get('currency'); // e.g. USD

  if (!date || !currency) {
    return NextResponse.json(
      { error: 'Missing date or currency' },
      { status: 400 },
    );
  }

  const key = process.env.EXCHANGE_RATE_API_KEY;
  const url = `https://api.exchangerate.host/historical?access_key=${key}&source=TWD&date=${date}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.success || !data.quotes) {
      return NextResponse.json({ error: 'API 回傳錯誤' }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 });
  }
}
