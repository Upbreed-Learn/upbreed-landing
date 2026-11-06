'use server';

import { cookies } from 'next/headers';
import { StoreTokenRequest } from './constants';

export async function storeToken(request: StoreTokenRequest) {
  (await cookies()).set({
    name: `rf`,
    value: request.token,
    // Only the server can read the login token (page scripts can't), so a script injected into
    // a page can't steal it. The site gets it through /api/auth/token.
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 30 * 24 * 60 * 60, // same as the login itself
  });
}

export async function deleteToken() {
  (await cookies()).delete({ name: `rf`, path: '/' });
}
