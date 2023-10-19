import db from '@/utils/db';
import bcrypt from 'bcrypt';
import Account from '@/models/Account';

async function registerHandler(req, res) {

  await db.connect();

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end();
  }

  const { username, password } = req.body;
  if(!username || !password){
    res.status(422).json({message: 'Validation error'});
    return ;
  }

  try {
    const existingAccount = await Account.findOne({ username });

    if (existingAccount) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAccount = new Account({
      username,
      password: hashedPassword,
    });

    const account = await newAccount.save();

    await db.disconnect();
    
    res.status(201).send({ 
      message: 'Registration successful',
      _id : account._id,
      username : account.username,
      accountId : account.accountId
    });

  } catch (error) {
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}

export default registerHandler