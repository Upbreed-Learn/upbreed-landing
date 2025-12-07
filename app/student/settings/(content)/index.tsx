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
    <section className="flex justify-center bg-white pt-11 pb-20 md:pt-22.25 md:pb-39.25">
      <div className="flex w-full max-w-7xl px-9 md:px-12 lg:px-18">
        <div className="w-full lg:max-w-[60.85rem] lg:px-45.25">
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
