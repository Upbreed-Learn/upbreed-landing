import { cookies } from 'next/headers';

export async function GET() {
  const getCookies = await cookies();

  const resData = {
    token: getCookies.get('rf')?.value,
  };

  return new Response(JSON.stringify(resData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
