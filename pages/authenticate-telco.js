import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast } from "react-toastify";
import { getError } from "@/utils/error";
import { useSession, signOut } from 'next-auth/react';
import Layout from '@/components/Layout';

export default function AuthenticateTelco() {
  const [phone, setPhone] = useState('');
  const [provider, setProvider] = useState('mtn');
  const [otp, setOtp] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [username, setUsername] = useState('');
  const router = useRouter();
  const { status, data: session } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (router.query.username) {
      setUsername(router.query.username);
    }
  }, [status, router.query.username, router]);


  const startVerification = async () => {
    try {
      const response = await axios.post('/api/startverification', { phone, provider, username });
      setSessionId(response.data.data.session_id);
    } catch (error) {
      return toast.error(error.response?.data?.error || getError(error))
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await axios.post('/api/verifyotp', { otp, sessionId, username });
      if (response.data && response.data.id) {
        await signOut({ redirect: false }); 
        router.push('/login');
      } else {
        console.warn('Account ID not found in response data');
      }
    } catch (error) {
      return toast.error(getError(error));
    }
  };


  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-4 card">
        <h1 className="mt-6 text-center text-2xl font-extrabold text-gray-900 py-3">Connect Your Telco Account</h1>
          <div className='flex items-center justify-around' >
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number" />
            <select value={provider} onChange={(e) => setProvider(e.target.value)}>
              <option value="mtn">MTN</option>
              <option value="airtel">AIRTEL</option>
            </select>
          </div>
          <div className='text-center mb-3' >
            <button className='secondary-button mb-4' onClick={startVerification}>Start Verification</button>
            {sessionId && (
              <div className='flex items-center justify-around'>
                <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" />
                <button className='secondary-button' onClick={verifyOtp}>Verify OTP</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

