import Hero from './hero';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Hero />
      {children}
    </div>
  );
}
