import { cn } from '@/lib/utils';

/** The password rules, shown on one line as small chips that turn green as each one is met. */
const RULES = [
  { label: '8+ characters', ok: (pw: string) => pw.length >= 8 },
  { label: 'A–Z', title: 'An uppercase letter', ok: (pw: string) => /[A-Z]/.test(pw) },
  { label: 'a–z', title: 'A lowercase letter', ok: (pw: string) => /[a-z]/.test(pw) },
  { label: '0–9', title: 'A number', ok: (pw: string) => /\d/.test(pw) },
  { label: '!@#', title: 'A symbol, e.g. ! @ # $', ok: (pw: string) => /[^A-Za-z0-9]/.test(pw) },
];

const PasswordHints = ({ value }: { value: string }) => (
  <ul className="mt-1.5 flex flex-wrap items-center gap-1" aria-live="polite" aria-label="Password must include">
    {RULES.map(r => {
      const passed = r.ok(value || '');
      return (
        <li
          key={r.label}
          title={r.title ?? r.label}
          className={cn(
            'flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px]/[100%] font-medium whitespace-nowrap transition-colors',
            passed ? 'border-[#305B43] bg-[#305B43] text-[#D0EA50]' : 'border-[#D9D9D9] text-[#8996A9]',
          )}
        >
          <span aria-hidden>{passed ? '✓' : '•'}</span>
          {r.label}
          <span className="sr-only">{passed ? ' (done)' : ' (needed)'}</span>
        </li>
      );
    })}
  </ul>
);

export default PasswordHints;
