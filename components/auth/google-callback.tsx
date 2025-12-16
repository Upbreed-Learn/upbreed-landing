// import React, { useEffect, useContext } from 'react';
// import { useRouter } from 'next/router';
// import { AuthContext } from '@/context/AuthContext';

// const GoogleCallback = () => {
//   const router = useRouter();
//   const { loginWithGoogle } = useContext(AuthContext);

//   // useEffect(() => {
//   //   const hashParams = new URLSearchParams(window.location.hash.substring(1));
//   //   const accessToken = hashParams.get('access_token');

//   //   if (accessToken) {
//   //     loginWithGoogle(); // This will handle the token verification and user login
//   //     router.push('/home');
//   //   } else {
//   //     console.error('No access token found');
//   //   }
//   // }, [loginWithGoogle, router]);

//   return <div>Loading...</div>;
// };

// export default GoogleCallback;

'use client';

import { useEffect } from 'react';
// import Cookies from 'js-cookie';

export default function GoogleCallbackPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      // Cookies.set('rf', token);
      window.location.href = '/home';
    }
  }, []);

  return <p>Signing you in...</p>;
}
