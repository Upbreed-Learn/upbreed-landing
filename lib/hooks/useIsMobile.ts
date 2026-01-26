import { useEffect, useState } from 'react';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 639);

    check(); // initial
    window.addEventListener('resize', check);

    return () => window.removeEventListener('resize', check);
  }, []);

  return isMobile;
}

export default useIsMobile;
