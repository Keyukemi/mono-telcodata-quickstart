import axios from 'axios';
import db from '@/utils/db';
import { getToken } from 'next-auth/jwt';



export default async function handler(req, res) {
  await db.connect();
  const user = await getToken({ req });
  
  const { accountId } = req.body;

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const identityResponse = await axios.get(`https://api.withmono.com/accounts/${accountId}/identity`, {
      headers: {
        'Content-Type': 'application/json',
        'mono-sec-key': process.env.MONO_SECRET_KEY,
      },
    });

    res.status(200).json(identityResponse.data);

  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || {});
  }
}

