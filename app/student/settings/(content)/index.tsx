'use client';

import { useQueryState } from 'nuqs';
import Profile from './profile';
import Subscription from './subscription';
import Privacy from './privacy';
import Password from './password';

const Content = () => {
  const [tab, _] = useQueryState('section', {
    defaultValue: 'profile',
  });

  return (
    <section className="flex justify-center bg-white pt-8 pb-16 md:pt-10">
      <div className="flex w-full max-w-7xl px-6 sm:px-9 md:px-12 lg:px-18">
        <div className="w-full max-w-3xl lg:ml-34">
          {tab === 'profile' && <Profile />}
          {tab === 'subscription' && <Subscription />}
          {tab === 'privacy' && <Privacy />}
          {tab === 'password' && <Password />}
        </div>
      </div>
    </section>
  );
};

export default Content;
