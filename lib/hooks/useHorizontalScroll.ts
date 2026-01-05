import { useEffect, useRef, useState } from 'react';

export function useHorizontalScrollPercentage<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleScroll = () => {
      if (el.scrollWidth <= el.clientWidth) {
        setPercentage(0);
        return;
      }

      const scrolled =
        (el.scrollLeft / (el.scrollWidth - el.clientWidth)) * 100;

      setPercentage(Math.min(100, Math.max(0, scrolled)));
    };

    el.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  return { ref, percentage };
}
