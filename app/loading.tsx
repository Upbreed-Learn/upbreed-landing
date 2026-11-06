import SuspenseLoader from '@/components/suspense-loader';

// Shown while a page's data loads between navigations.
export default function Loading() {
  return <SuspenseLoader className="h-[calc(100vh/var(--site-zoom,1)-89px)] bg-[#00230F]" />;
}
