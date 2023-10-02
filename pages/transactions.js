import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {useSession } from "next-auth/react";
import { toast } from 'react-toastify';
import { getError } from '@/utils/error';
import axios from 'axios';
import LoadingSpinner from '@/components/LoadingSpinner';
import RequireAuthentication from '@/components/RequireAuthentication';
import Layout from '@/components/Layout';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const accountId = session?.user?.accountId;
    if (!accountId) {
      router.push('/login');
      return;
    }
  
    const fetchTransactions = async () => {
      try {
        const response = await axios.post(`/api/getTransactions?accountId=${accountId}`);
        setTransactions(response.data.data);
      } catch (error) {
        toast.error(getError(error));
      } finally {
        setLoading(false);
      }
    };
  
    fetchTransactions();
  }, [router, session?.user?.accountId]);
  

  if (loading) return <LoadingSpinner/>;

  if (!transactions.length) return <p>No transactions found</p>;

  return (
    <RequireAuthentication>
      <Layout>
        <div className='card'>
          <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900 py-3">Transactions</h1>
          <table className="min-w-full table-auto text-center">
            <thead className="justify-between">
              <tr className="bg-primary">
                <th className="px-2 py-2">Type</th>
                <th className="px-2 py-2">Amount</th>
                <th className="px-2 py-2">Narration</th>
                <th className="px-2 py-2">Balance</th>
                <th className="px-2 py-2">Date</th>
                <th className="px-2 py-2">Currency</th>
              </tr>
            </thead>
            <tbody className="bg-gray-200">
              {transactions.map(transaction => (
                <tr key={transaction._id}>
                  <td className="px-2 py-2">{transaction.type}</td>
                  <td className="px-2 py-2">{transaction.amount}</td>
                  <td className="px-2 py-2">{transaction.narration}</td>
                  <td className="px-2 py-2">{transaction.balance}</td>
                  <td className="px-2 py-2">{new Date(transaction.date).toLocaleDateString()}</td>
                  <td className="px-2 py-2">{transaction.currency}</td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>
      </Layout>
    </RequireAuthentication>
  );
}
