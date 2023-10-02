import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcrypt';
import Account from "@/models/Account";
import db from "@/utils/db";

export default NextAuth({
  session: {
    strategy: "jwt",
    secure: process.env.NODE_ENV === 'production',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.accountId){
        token.accountId = user.accountId;
        token.username = user.username;
      } 
      return token;
    },
    
    async session({ session, token }) {
      if (token?.accountId) {
        session.user.accountId = token.accountId
        session.user.username = token.username;
      };
      return session;
    },
    
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        await db.connect();
        const user = await Account.findOne({
          username: credentials.username,
        });
        if (user && await bcrypt.compareSync(credentials.password, user.password)) {
          return {
            _id: user._id,
            username: user.username,
            accountId: user.accountId,
          };
        }
        throw new Error('Invalid Username or Password');
        
      },
    }),
  ],
});
