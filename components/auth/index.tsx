import useTimer from '@/lib/hooks/useTimer';
import LoginDialog from './login';
import SignupDialog from './signup';
import ForgotPasswordDialog from './fogot-password';
import ResetPassword from './reset-password';
import VerifyDialog from './verify';
import { Suspense } from 'react';

const AuthPages = () => {
  const { formattedTime, handleStartTimer, timerRunning } = useTimer(30);

  return (
    <Suspense>
      <LoginDialog />
      <SignupDialog onStartTimer={handleStartTimer} />
      <ForgotPasswordDialog onStartTimer={handleStartTimer} />
      <ResetPassword
        onStartTimer={handleStartTimer}
        formattedTime={formattedTime}
        timerRunning={timerRunning}
      />
      <VerifyDialog
        onStartTimer={handleStartTimer}
        formattedTime={formattedTime}
        timerRunning={timerRunning}
      />
    </Suspense>
  );
};

export default AuthPages;
