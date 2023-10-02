import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
  accountId: {
    type: String,
    unique: true,
    sparse: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const Account = mongoose.models.Account || mongoose.model('Account', accountSchema);

export default Account;
