import { useEffect } from 'react';
import { useRouter } from 'next/router';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/register');
  }, [router]);

  return <LoadingSpinner/>
}
