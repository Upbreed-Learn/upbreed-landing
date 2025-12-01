import Link from 'next/link';
import { id } from 'zod/v4/locales';

const ROLES = [
  {
    id: 1,
    name: 'INSTRUCTIONAL DESIGNERS',
    mode: 'Hybrid',
  },
  {
    id: 2,
    name: 'FINANCE MANAGER',
    mode: 'Hybrid',
  },
  {
    id: 3,
    name: 'BUSINESS EXECUTOR',
    mode: 'Hybrid',
  },
  {
    id: 4,
    name: 'GRAPHIC DESIGNERS',
    mode: 'Remote',
  },
  {
    id: 5,
    name: 'WEB DESIGNERS',
    mode: 'Hybrid',
  },
];

const Roles = () => {
  return (
    <section className="flex justify-center bg-[#F2F2F2]">
      <div className="grid w-full max-w-7xl justify-items-center gap-6 px-9 py-18 md:grid-cols-2 md:px-18 md:py-36">
        {ROLES.map(role => (
          <div className="text-center" key={role.id}>
            <p className="text-2xl/[30px] font-extrabold uppercase">
              {role.name}
            </p>
            <p className="text-xs/[30px] font-semibold">{role.mode}</p>
          </div>
        ))}
        <Link href={'#'} className="text-xl/[30px] text-[#305B43] underline">
          Apply Here!
        </Link>
      </div>
    </section>
  );
};

export default Roles;
