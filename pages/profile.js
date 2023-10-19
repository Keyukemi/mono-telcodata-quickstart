import { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/router';
import { toast } from "react-toastify";
import { getError } from "@/utils/error";
import Layout from '@/components/Layout';
import axios from 'axios';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Profile() {
  const [identity, setIdentity] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const {data: session} = useSession();
  

  useEffect(() => {
    if (!session) {
      toast.error("You must be logged in to view this page.");
      router.push('/login'); 
      return;
    }
    
    const fetchIdentity = async () => {
      const accountId = session?.user?.accountId;
      console.log(accountId)
      try {
        const response = await axios.post('/api/getidentitydata', { accountId });
        setIdentity(response.data);
      } catch (error) {
        return toast.error(getError(error))
      }finally{
        setLoading(false);
      }
    };

    fetchIdentity();
  }, [router, session]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!identity) {
    return (
      <Layout>
        <p className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">No Identity Data Found</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 card">
          <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Profile</h1>
          <form className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm -space-y-px">
              <div className='py-2' >
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input id="fullName" name="fullName" type="text" autoComplete="fullName" required 
                className="read-form" value={identity.fullName} readOnly />
              </div>
              <div className='py-2'>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                <input id="phone" name="phone" type="text" autoComplete="phone" required 
                className="read-form" value={identity.phone} readOnly />
              </div>
              <div className='py-2'>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input id="email" name="email" type="email" autoComplete="email" required 
                className="read-form" value={identity.email} readOnly />
              </div>
              <div className='py-2'>
                <label htmlFor="bvn" className="block text-sm font-medium text-gray-700">BVN</label>
                <input id="bvn" name="bvn" type="text" required 
                className="read-form" value={identity.bvn} readOnly />
              </div>
              <div className='py-2'>
                <label htmlFor="addressline1" className="block text-sm font-medium text-gray-700">Address</label>
                <input id="addressline1" name="addressline1" type="text" required 
                className="read-form" value={identity.addressLine1} readOnly />
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
