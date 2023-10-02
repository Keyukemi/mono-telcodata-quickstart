import axios from 'axios';
import { getToken } from 'next-auth/jwt';

export default async function handler(req, res) {
  const user = await getToken({ req });
  const { accountId } = req.query;

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const response = await axios.get(`https://api.withmono.com/accounts/${accountId}/transactions`, {
        headers: {
            'Content-Type': 'application/json',
            'mono-sec-key': process.env.MONO_SECRET_KEY,
        },
    });

    res.status(200).json(response.data);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
