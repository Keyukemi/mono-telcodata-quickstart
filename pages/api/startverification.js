import db from '@/utils/db';
import axios from 'axios';
import Account from '@/models/Account';

export default async function handler(req, res) {
  await db.connect();

  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { phone, provider, username } = req.body;

  try {
    const userAccount = await Account.findOne({ username });

    if (!userAccount) {
      return res.status(404).json({ error: 'Username not found' });
    }

    const response = await axios.post('https://api.withmono.com/v1/telecom/auth', { phone, provider }, {
      headers: {
        'Content-Type': 'application/json',
        'mono-sec-key': process.env.MONO_SECRET_KEY,
      },
    });
  

    res.status(200).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || {});
  }
}
