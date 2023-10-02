import LoadingSpinner from '@/components/LoadingSpinner';
import '@/styles/globals.css'
import { SessionProvider, useSession } from 'next-auth/react'
import { useRouter } from 'next/router';

function App({ Component, pageProps:{session, ...pageProps} }) {
  return(

    <SessionProvider session={session}>
        {Component.auth?(
          <Auth>
            <Component {...pageProps} />
          </Auth>
        ): <Component {...pageProps} />}
    </SessionProvider>
  ) 
}



function Auth ({children}){
  const router = useRouter();
  const {status} = useSession({
    required: true,
    onUnauthenticated(){
      router.push('/login')
    },
  });
  if (status === 'loading'){
    return <LoadingSpinner/>
  }
  return children
}


export default App;