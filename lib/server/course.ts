export async function getCourseByIdServer(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/course/${id}`,
    {
      cache: 'no-store',
    },
  );

  if (!res.ok) return null;
  return res.json();
}
