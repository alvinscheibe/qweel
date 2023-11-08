import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import Dashboard from '@/components/dashboard';

const Page = async () => {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  if (!user || !user.id)
    return redirect('/auth-callback?origin=dashboard');

  const dbUser = await db.user.findUnique({
    where: {
      id: user.id
    }
  });

  if (!dbUser)
    return redirect('/auth-callback?origin=dashboard');

  return (
    <Dashboard />
  );
};

export default Page;