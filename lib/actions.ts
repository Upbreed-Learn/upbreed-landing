import { cookies } from 'next/headers';
import { StoreTokenRequest } from './constants';

export async function storeToken(request: StoreTokenRequest) {
  (await cookies()).set({
    name: `rf`,
    value: request.token,
    sameSite: 'strict',
  });
}
