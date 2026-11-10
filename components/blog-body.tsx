'use client';

import DOMPurify from 'dompurify';
import { useEffect, useMemo, useRef } from 'react';

/**
 * A news or press post, shown the way it was laid out in the editor:
 * pictures sit left, centre, right or full width at the chosen size, and galleries become slides
 * (arrows, dots, swipe on phones).
 */
export default function BlogBody({ html, className = '' }: { html: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const clean = useMemo(() => DOMPurify.sanitize(html ?? ''), [html]);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const cleanups: (() => void)[] = [];
    root.querySelectorAll<HTMLElement>('figure.ub-gallery').forEach(fig => {
      const track = fig.querySelector<HTMLElement>('.ub-gallery-track');
      const slides = track ? Array.from(track.querySelectorAll('img')) : [];
      if (!track || slides.length < 2 || fig.dataset.ready) return;
      fig.dataset.ready = '1';
      const stage = document.createElement('div');
      stage.className = 'ub-gallery-stage';
      track.replaceWith(stage);
      stage.appendChild(track);

      const go = (n: number) => track.scrollTo({ left: track.clientWidth * ((n + slides.length) % slides.length), behavior: 'smooth' });
      const current = () => Math.round(track.scrollLeft / Math.max(1, track.clientWidth));
      const button = (cls: string, label: string, path: string, onClick: () => void) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = `ub-gallery-nav ${cls}`;
        b.setAttribute('aria-label', label);
        b.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="${path}"/></svg>`;
        b.onclick = onClick;
        stage.appendChild(b);
      };
      button('ub-prev', 'Previous picture', 'M15 18l-6-6 6-6', () => go(current() - 1));
      button('ub-next', 'Next picture', 'M9 18l6-6-6-6', () => go(current() + 1));
      const count = document.createElement('span');
      count.className = 'ub-gallery-count';
      stage.appendChild(count);
      const dots = document.createElement('div');
      dots.className = 'ub-gallery-dots';
      slides.forEach((_, n) => {
        const d = document.createElement('button');
        d.type = 'button';
        d.setAttribute('aria-label', `Picture ${n + 1}`);
        d.onclick = () => go(n);
        dots.appendChild(d);
      });
      stage.after(dots);
      const sync = () => {
        const i = current();
        count.textContent = `${i + 1} / ${slides.length}`;
        Array.from(dots.children).forEach((d, n) => d.setAttribute('aria-current', String(n === i)));
      };
      sync();
      track.addEventListener('scroll', sync, { passive: true });
      cleanups.push(() => track.removeEventListener('scroll', sync));
    });
    return () => cleanups.forEach(f => f());
  }, [clean]);

  return (
    <div
      ref={ref}
      className={`ub-post flow-root text-base/7 [&_a]:text-[#305B43] [&_a]:underline [&_h1]:mt-6 [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:mt-6 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mt-5 [&_h3]:text-xl [&_h3]:font-semibold [&_p]:my-3 ${className}`}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
