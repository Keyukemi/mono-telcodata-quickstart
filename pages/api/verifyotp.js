import axios from 'axios';
import db from '@/utils/db';
import Account from '@/models/Account';
import { getToken } from 'next-auth/jwt';

export default async function handler(req, res) {
  const user = await getToken({ req });
  await db.connect();

  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { otp, sessionId, username} = req.body;

  try {
    const verifyResponse = await axios.post('https://api.withmono.com/v1/telecom/verify', { otp }, {
      headers: {
        'Content-Type': 'application/json',
        'mono-sec-key': process.env.MONO_SECRET_KEY,
        'x-session-id': sessionId,
      },
    });
    
    
    const { code } = verifyResponse.data.data;
    
    if (!code) {
        throw new Error('Code is undefined');
    }

 

    const exchangeResponse = await axios.post('https://api.withmono.com/account/auth?', { code }, {
      headers: {
        'Content-Type': 'application/json',
        'mono-sec-key': process.env.MONO_SECRET_KEY,
      },
    });

    const { id: accountId } = exchangeResponse.data;

    const userAccount = await Account.findOne({ username });
    if (userAccount) {
      userAccount.accountId = accountId;
      await userAccount.save();
    }else {
      return res.status(404).json({ error: 'User account does not exist' });
    }

    res.status(200).json({...exchangeResponse.data, accountId, user});

  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || {});
  }
}
