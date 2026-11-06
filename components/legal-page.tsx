import H1 from '@/components/header-text';
import { ReactNode } from 'react';

export type LegalSection = { id: string; title: string; body: ReactNode };

/** Layout for the Privacy Policy and Terms: title, dates, a contents list and numbered sections. */
const LegalPage = ({ title, updated, intro, sections }: { title: string; updated: string; intro: ReactNode; sections: LegalSection[] }) => (
  <>
    <section className="flex justify-center">
      <div className="flex w-full max-w-7xl flex-col gap-3 px-6 py-14 sm:px-9 md:px-12 lg:px-18">
        <H1>{title}</H1>
        <p className="text-sm text-white/70">Last updated: {updated}</p>
      </div>
    </section>
    <section className="flex justify-center bg-[#F2F2F2] text-[#1F1F1F]">
      <div className="flex w-full max-w-7xl flex-col gap-10 px-6 py-12 sm:px-9 md:px-12 lg:flex-row lg:gap-16 lg:px-18 lg:py-16">
        <nav aria-label="Contents" className="shrink-0 lg:sticky lg:top-28 lg:w-64 lg:self-start">
          <p className="mb-3 text-xs font-semibold tracking-wider text-[#305B43] uppercase">Contents</p>
          <ol className="flex flex-col gap-1.5 text-[13px] text-[#474747]">
            {sections.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="hover:text-[#305B43] hover:underline">
                  {i + 1}. {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <article className="legal flex max-w-3xl flex-col gap-10 text-[15px]/relaxed">
          <div className="flex flex-col gap-4">{intro}</div>
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="flex scroll-mt-28 flex-col gap-3">
              <h2 className="text-xl font-semibold text-[#00230F]">
                {i + 1}. {s.title}
              </h2>
              {s.body}
            </section>
          ))}
        </article>
      </div>
    </section>
  </>
);

export default LegalPage;
