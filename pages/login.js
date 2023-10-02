import { useEffect, useState} from 'react';
import { signIn, useSession } from "next-auth/react";
import { useRouter } from 'next/router';
import { toast } from "react-toastify";
import Layout from '@/components/Layout';
import LoadingSpinner from '@/components/LoadingSpinner';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') { // Ensure that the session is authenticated
      if (session?.user?.accountId) {
        router.push(`/profile`);
      } else if (session?.user?.username) {
        router.push(`/authenticate-telco?username=${session.user.username}`);
      }
    }
  }, [session, status, router]);

  const loginUser = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error('Username and Password are required!');
      return;
    }

    const result = await signIn('credentials', {
      redirect: false,
      username,
      password,
    });

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success('Logged in successfully!');
    router.push(`/profile`);

  }

  
  if (status === 'loading') return <LoadingSpinner/>;

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <form onSubmit={loginUser} className="max-w-md w-full space-y-4 card">
          <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900 py-3">Login</h1>
          <div className='flex flex-col items-center justify-center'>
            <input className='mb-3'
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </div>
          <div className='text-center'>
            <button className='secondary-button' type="submit">Login</button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default Login;
